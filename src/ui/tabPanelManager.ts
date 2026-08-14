import * as vscode from 'vscode';
import { FocusEngine } from '../engines/focusEngine';
import { TaskEngine } from '../engines/taskEngine';
import { ProjectEngine } from '../engines/projectEngine';
import { StatsEngine } from '../engines/statsEngine';
import { StorageManager } from '../managers/storageManager';
import { getSharedWebviewHtml } from './sharedWebviewHtml';
import { WebviewMessageHandler } from './webviewMessageHandler';

export class TabPanelManager {
  public static currentPanel: TabPanelManager | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private readonly messageHandler: WebviewMessageHandler;

  public static createOrShow(
    extensionUri: vscode.Uri,
    focusEngine: FocusEngine,
    taskEngine: TaskEngine,
    projectEngine: ProjectEngine,
    statsEngine: StatsEngine,
    storage: StorageManager
  ): TabPanelManager {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (TabPanelManager.currentPanel) {
      TabPanelManager.currentPanel._panel.reveal(column);
      TabPanelManager.currentPanel.postStateUpdate();
      return TabPanelManager.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      'devFocusTab',
      '⚡ Know',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri]
      }
    );

    TabPanelManager.currentPanel = new TabPanelManager(
      panel,
      extensionUri,
      focusEngine,
      taskEngine,
      projectEngine,
      statsEngine,
      storage
    );
    return TabPanelManager.currentPanel;
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    private readonly focusEngine: FocusEngine,
    private readonly taskEngine: TaskEngine,
    private readonly projectEngine: ProjectEngine,
    private readonly statsEngine: StatsEngine,
    private readonly storage: StorageManager
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this.messageHandler = new WebviewMessageHandler(
      this.focusEngine,
      this.taskEngine,
      this.projectEngine,
      this.statsEngine,
      this.storage
    );

    this._panel.webview.html = getSharedWebviewHtml(this._panel.webview, this._extensionUri, true);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async message => {
        await this.messageHandler.handleMessage(message, () => this.postStateUpdate());
      },
      null,
      this._disposables
    );

    this._disposables.push(
      this.taskEngine.onTasksChanged(() => this.postStateUpdate()),
      this.projectEngine.onProjectsChanged(() => this.postStateUpdate()),
      this.focusEngine.onSessionStateChanged(() => this.postStateUpdate()),
      this.focusEngine.onSessionTick(payload => {
        this._panel.webview.postMessage({
          type: 'SESSION_TICK',
          payload
        });
      })
    );

    setTimeout(() => this.postStateUpdate(), 200);
  }

  public postStateUpdate(): void {
    this._panel.webview.postMessage({
      type: 'STATE_UPDATE',
      payload: this.messageHandler.getStatePayload()
    });
  }

  public dispose(): void {
    TabPanelManager.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
