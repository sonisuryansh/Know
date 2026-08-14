import * as vscode from 'vscode';
import { FocusEngine } from './focusEngine';
import { TaskEngine } from './taskEngine';
import { FileLinkManager } from '../managers/fileLinkManager';

export class ActivityEngine implements vscode.Disposable {
  private disposables: vscode.Disposable[] = [];

  constructor(
    private readonly focusEngine: FocusEngine,
    private readonly taskEngine: TaskEngine
  ) {
    this.registerEventListeners();
  }

  private registerEventListeners(): void {
    // 1. Monitor active editor changes
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(editor => {
        this.handleActiveEditorChange(editor);
      })
    );

    // Initial check
    this.handleActiveEditorChange(vscode.window.activeTextEditor);
  }

  private handleActiveEditorChange(editor: vscode.TextEditor | undefined): void {
    const session = this.focusEngine.getSession();
    if (!session || session.state !== 'ACTIVE') {
      return;
    }

    if (!editor || !editor.document || editor.document.isUntitled) {
      this.focusEngine.updateWorkspaceFileContext(false);
      return;
    }

    const currentFilePath = editor.document.uri.fsPath;
    const isWorkspace = FileLinkManager.isWorkspaceFile(currentFilePath);
    this.focusEngine.updateWorkspaceFileContext(isWorkspace);
  }

  public dispose(): void {
    this.disposables.forEach(d => d.dispose());
  }
}
