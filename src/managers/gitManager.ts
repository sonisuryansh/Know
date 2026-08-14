import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface FolderInspectionResult {
  exists: boolean;
  isEmpty: boolean;
  isGit: boolean;
  remoteUrl?: string;
  branch?: string;
  filesCount: number;
}

export interface WorkspaceGitInfo {
  isGit: boolean;
  repoName: string;
  localPath: string;
  remoteUrl?: string;
  branch?: string;
}

export class GitManager {
  /**
   * Validates and parses a GitHub repository URL
   */
  public static validateGitHubUrl(url: string): { isValid: boolean; normalizedUrl?: string; owner?: string; repoName?: string } {
    if (!url || typeof url !== 'string') {
      return { isValid: false };
    }

    const trimmed = url.trim();
    // Support https://github.com/owner/repo(.git), git@github.com:owner/repo(.git), or shorthand owner/repo
    const httpsRegex = /^https?:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(\.git)?\/?$/;
    const sshRegex = /^git@github\.com:([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(\.git)?$/;
    const shorthandRegex = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/;

    let match = trimmed.match(httpsRegex);
    if (match) {
      const owner = match[1];
      const repoName = match[2].replace(/\.git$/, '');
      return {
        isValid: true,
        normalizedUrl: `https://github.com/${owner}/${repoName}.git`,
        owner,
        repoName
      };
    }

    match = trimmed.match(sshRegex);
    if (match) {
      const owner = match[1];
      const repoName = match[2].replace(/\.git$/, '');
      return {
        isValid: true,
        normalizedUrl: `https://github.com/${owner}/${repoName}.git`,
        owner,
        repoName
      };
    }

    match = trimmed.match(shorthandRegex);
    if (match) {
      const owner = match[1];
      const repoName = match[2].replace(/\.git$/, '');
      return {
        isValid: true,
        normalizedUrl: `https://github.com/${owner}/${repoName}.git`,
        owner,
        repoName
      };
    }

    return { isValid: false };
  }

  /**
   * Check whether git is available on PATH
   */
  public static async isGitInstalled(): Promise<boolean> {
    try {
      const { stdout } = await execFileAsync('git', ['--version']);
      return stdout.toLowerCase().includes('git version');
    } catch {
      return false;
    }
  }

  /**
   * Safe inspection of a directory without running modifying commands
   */
  public static async inspectFolder(folderPath: string): Promise<FolderInspectionResult> {
    if (!fs.existsSync(folderPath)) {
      return {
        exists: false,
        isEmpty: true,
        isGit: false,
        filesCount: 0
      };
    }

    try {
      const entries = fs.readdirSync(folderPath);
      const isGit = fs.existsSync(path.join(folderPath, '.git'));
      const isEmpty = entries.length === 0;

      let remoteUrl: string | undefined;
      let branch: string | undefined;

      if (isGit) {
        try {
          const { stdout: remoteOut } = await execFileAsync('git', ['config', '--get', 'remote.origin.url'], { cwd: folderPath });
          remoteUrl = remoteOut.trim();
        } catch {
          // No remote origin configured
        }

        try {
          const { stdout: branchOut } = await execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: folderPath });
          branch = branchOut.trim();
        } catch {
          branch = 'main';
        }
      }

      return {
        exists: true,
        isEmpty,
        isGit,
        remoteUrl,
        branch,
        filesCount: entries.length
      };
    } catch {
      return {
        exists: true,
        isEmpty: false,
        isGit: false,
        filesCount: 1
      };
    }
  }

  /**
   * Clones a repository into destPath with safe process execution
   */
  public static async cloneRepository(
    repoUrl: string,
    destPath: string,
    onProgress?: (msg: string) => void
  ): Promise<{ success: boolean; error?: string; branch?: string }> {
    try {
      if (onProgress) onProgress('Checking Git environment...');
      const gitOk = await this.isGitInstalled();
      if (!gitOk) {
        return {
          success: false,
          error: 'Git is not found on your system PATH. Please install Git to import repositories.'
        };
      }

      // Ensure parent directory exists
      const parentDir = path.dirname(destPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      if (onProgress) onProgress('Cloning repository from GitHub...');

      // Execute safe git clone without shell interpolation
      await execFileAsync('git', ['clone', repoUrl, destPath]);

      let branch = 'main';
      try {
        const { stdout: branchOut } = await execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: destPath });
        branch = branchOut.trim();
      } catch {
        // Default to main
      }

      return { success: true, branch };
    } catch (err: any) {
      const errMsg = err?.stderr || err?.message || String(err);
      if (errMsg.includes('Authentication failed') || errMsg.includes('could not read Username')) {
        return {
          success: false,
          error: 'GitHub authentication is required. Please check your Git credentials and try again.'
        };
      }
      return {
        success: false,
        error: errMsg
      };
    }
  }

  /**
   * Detects Git metadata in active VS Code workspace
   */
  public static async detectActiveWorkspaceGit(): Promise<WorkspaceGitInfo | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return null;
    }

    const wsPath = workspaceFolders[0].uri.fsPath;
    const inspection = await this.inspectFolder(wsPath);

    if (inspection.isGit) {
      const repoName = path.basename(wsPath);
      return {
        isGit: true,
        repoName,
        localPath: wsPath,
        remoteUrl: inspection.remoteUrl,
        branch: inspection.branch || 'main'
      };
    }

    return null;
  }
}
