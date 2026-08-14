import * as vscode from 'vscode';
import { FocusEngine } from '../engines/focusEngine';
import { TaskEngine } from '../engines/taskEngine';
import { ProjectEngine } from '../engines/projectEngine';
import { StatsEngine } from '../engines/statsEngine';
import { StorageManager } from '../managers/storageManager';
import { getSharedWebviewHtml } from './sharedWebviewHtml';
import { WebviewMessageHandler } from './webviewMessageHandler';

export class SidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'devFocus.sidebarView';
  private _view?: vscode.WebviewView;
  private readonly messageHandler: WebviewMessageHandler;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly focusEngine: FocusEngine,
    private readonly taskEngine: TaskEngine,
    private readonly projectEngine: ProjectEngine,
    private readonly statsEngine: StatsEngine,
    private readonly storage: StorageManager
  ) {
    this.messageHandler = new WebviewMessageHandler(
      this.focusEngine,
      this.taskEngine,
      this.projectEngine,
      this.statsEngine,
      this.storage
    );

    // Subscribe to engine state changes
    this.taskEngine.onTasksChanged(() => this.postStateUpdate());
    this.projectEngine.onProjectsChanged(() => this.postStateUpdate());
    this.focusEngine.onSessionStateChanged(() => this.postStateUpdate());
    this.focusEngine.onSessionTick(payload => {
      if (this._view && this._view.visible) {
        this._view.webview.postMessage({
          type: 'SESSION_TICK',
          payload
        });
      }
    });
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };

    webviewView.webview.html = getSharedWebviewHtml(webviewView.webview, this.extensionUri, false);

    // Handle messages coming from the webview
    webviewView.webview.onDidReceiveMessage(async (message: { command: string; payload?: any }) => {
      await this.messageHandler.handleMessage(message, () => this.postStateUpdate());
    });

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this.postStateUpdate();
      }
    });

    setTimeout(() => this.postStateUpdate(), 200);
  }

  public postStateUpdate(): void {
    if (!this._view) return;
    this._view.webview.postMessage({
      type: 'STATE_UPDATE',
      payload: this.messageHandler.getStatePayload()
    });
  }
}
