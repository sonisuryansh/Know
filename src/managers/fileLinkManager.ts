import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class FileLinkManager {
  /**
   * Returns the file path of the active text editor if open and saved
   */
  public static getActiveEditorFilePath(): string | null {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document.isUntitled) {
      return null;
    }
    return activeEditor.document.uri.fsPath;
  }

  /**
   * Returns the relative path of a file to the workspace root for display
   */
  public static getDisplayFilePath(filePath: string): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const rootPath = workspaceFolders[0].uri.fsPath;
      if (filePath.startsWith(rootPath)) {
        return path.relative(rootPath, filePath);
      }
    }
    return path.basename(filePath);
  }

  /**
   * Opens an existing linked file in the editor
   */
  public static async openLinkedFile(filePath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(filePath)) {
        vscode.window.showErrorMessage(`Developer Focus: Linked file not found at: ${filePath}`);
        return false;
      }
      const doc = await vscode.workspace.openTextDocument(filePath);
      await vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.One });
      return true;
    } catch (err) {
      vscode.window.showErrorMessage(`Developer Focus: Could not open file: ${String(err)}`);
      return false;
    }
  }

  /**
   * Checks if a file path belongs to current workspace
   */
  public static isWorkspaceFile(filePath?: string): boolean {
    if (!filePath) return false;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) return false;
    const norm = path.normalize(filePath).toLowerCase();
    return workspaceFolders.some(wf => norm.startsWith(path.normalize(wf.uri.fsPath).toLowerCase()));
  }
}
