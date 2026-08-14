import * as vscode from 'vscode';
import * as path from 'path';
import { GitManager } from './gitManager';
import { ProjectEngine } from '../engines/projectEngine';
import { DevProject } from '../models/project';

export class GitImportService {
  constructor(private readonly projectEngine: ProjectEngine) {}

  /**
   * Interactive GitHub repository import wizard
   */
  public async promptAndImportRepository(presetUrl?: string): Promise<DevProject | null> {
    // 1. Prompt for Repository URL
    const urlInput = presetUrl || await vscode.window.showInputBox({
      prompt: 'Enter GitHub Repository URL (HTTPS, SSH, or owner/repo):',
      placeHolder: 'https://github.com/username/repository.git or username/repository',
      ignoreFocusOut: true,
      validateInput: text => {
        if (!text.trim()) return 'Repository URL is required.';
        const val = GitManager.validateGitHubUrl(text);
        if (!val.isValid) {
          return 'Invalid GitHub URL format. Example: https://github.com/user/project.git';
        }
        return null;
      }
    });

    if (!urlInput) return null;

    const validated = GitManager.validateGitHubUrl(urlInput);
    if (!validated.isValid || !validated.normalizedUrl || !validated.repoName) {
      vscode.window.showErrorMessage('Invalid GitHub repository URL.');
      return null;
    }

    // 2. Check for duplicate project already configured
    const existingByUrl = this.projectEngine.findProjectByRepoUrl(validated.normalizedUrl);
    if (existingByUrl) {
      const choice = await vscode.window.showInformationMessage(
        `Project already exists: This GitHub repository is already configured in Developer Focus ("${existingByUrl.name}").`,
        'Open Project Folder',
        'Dismiss'
      );
      if (choice === 'Open Project Folder' && existingByUrl.localPath) {
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(existingByUrl.localPath));
      }
      return existingByUrl;
    }

    // 3. Prompt for Destination Folder
    const folderUris = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'Select Clone Destination',
      title: `Select Destination Folder for "${validated.repoName}"`
    });

    if (!folderUris || folderUris.length === 0) {
      return null;
    }

    const selectedBaseFolder = folderUris[0].fsPath;
    // If selected folder is empty or not named after repo, target the repo subfolder
    let targetPath = selectedBaseFolder;
    const baseInspection = await GitManager.inspectFolder(selectedBaseFolder);

    if (baseInspection.isGit || !baseInspection.isEmpty) {
      // If user selected an existing parent folder (e.g. C:\Projects), clone into subfolder C:\Projects\repoName
      targetPath = path.join(selectedBaseFolder, validated.repoName);
    }

    const targetInspection = await GitManager.inspectFolder(targetPath);

    // 4. Handle Existing Git Repository
    if (targetInspection.isGit) {
      const existingRemote = targetInspection.remoteUrl ? targetInspection.remoteUrl.toLowerCase().replace(/\.git$/, '').trim() : '';
      const reqRemote = validated.normalizedUrl.toLowerCase().replace(/\.git$/, '').trim();

      if (existingRemote && existingRemote === reqRemote) {
        // Same remote already exists on disk
        const choice = await vscode.window.showInformationMessage(
          `Repository already exists: This folder is already connected to ${validated.normalizedUrl}.`,
          'Add to Developer Focus',
          'Open Folder'
        );

        let proj = this.projectEngine.findProjectByLocalPath(targetPath);
        if (!proj) {
          proj = await this.projectEngine.createProject({
            name: formatRepoTitle(validated.repoName),
            repositoryUrl: validated.normalizedUrl,
            localPath: targetPath,
            gitBranch: targetInspection.branch || 'main',
            isGitConnected: true,
            icon: '🐙'
          });
        }

        if (choice === 'Open Folder') {
          await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetPath));
        }
        return proj;
      } else {
        // Different remote detected
        await vscode.window.showWarningMessage(
          `Existing Git repository detected: This folder is connected to a different remote (${targetInspection.remoteUrl || 'Local'}). Requested: ${validated.normalizedUrl}. The existing repository will not be overwritten.`,
          { modal: true },
          'OK'
        );
        return null;
      }
    }

    // 5. Handle Non-Empty Non-Git Folder
    if (targetInspection.exists && !targetInspection.isEmpty) {
      await vscode.window.showErrorMessage(
        'Folder is not empty: The selected destination folder already contains files and is not a Git repository. Please choose an empty folder.',
        { modal: true },
        'OK'
      );
      return null;
    }

    // 6. Safe Clone with Progress UI
    let cloneSuccess = false;
    let branchName = 'main';

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Importing GitHub Repository: ${validated.repoName}`,
        cancellable: false
      },
      async progress => {
        progress.report({ message: 'Cloning repository from GitHub...' });
        const result = await GitManager.cloneRepository(validated.normalizedUrl!, targetPath, status => {
          progress.report({ message: status });
        });

        if (result.success) {
          cloneSuccess = true;
          branchName = result.branch || 'main';
        } else {
          const viewDetails = 'View Details';
          const action = await vscode.window.showErrorMessage(
            `Repository import failed: ${result.error || 'Unable to clone repository.'}`,
            viewDetails,
            'OK'
          );
          if (action === viewDetails && result.error) {
            const doc = await vscode.workspace.openTextDocument({
              content: `Git Clone Error Details:\n\nURL: ${validated.normalizedUrl}\nTarget: ${targetPath}\n\n${result.error}`,
              language: 'text'
            });
            await vscode.window.showTextDocument(doc);
          }
        }
      }
    );

    if (!cloneSuccess) {
      return null;
    }

    // 7. Associate with Developer Focus Project
    const project = await this.projectEngine.createProject({
      name: formatRepoTitle(validated.repoName),
      description: `Cloned from ${validated.normalizedUrl}`,
      repositoryUrl: validated.normalizedUrl,
      localPath: targetPath,
      gitBranch: branchName,
      isGitConnected: true,
      category: 'Personal Project',
      icon: '🐙'
    });

    const openChoice = await vscode.window.showInformationMessage(
      `✓ Repository imported successfully! "${project.name}" is now connected.`,
      'Open Project in VS Code',
      'Later'
    );

    if (openChoice === 'Open Project in VS Code') {
      await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetPath));
    }

    return project;
  }

  /**
   * Associates the current active workspace with Developer Focus
   */
  public async associateActiveWorkspace(): Promise<DevProject | null> {
    const wsGit = await GitManager.detectActiveWorkspaceGit();
    if (!wsGit) {
      vscode.window.showWarningMessage('No Git repository detected in the current active workspace.');
      return null;
    }

    const existing = this.projectEngine.findProjectByLocalPath(wsGit.localPath) ||
      (wsGit.remoteUrl ? this.projectEngine.findProjectByRepoUrl(wsGit.remoteUrl) : undefined);

    if (existing) {
      vscode.window.showInformationMessage(`Current workspace is already connected to project "${existing.name}".`);
      return existing;
    }

    const projectName = await vscode.window.showInputBox({
      prompt: 'Project Name for this repository:',
      value: formatRepoTitle(wsGit.repoName)
    });

    if (!projectName) return null;

    const project = await this.projectEngine.createProject({
      name: projectName.trim(),
      description: wsGit.remoteUrl ? `Connected to ${wsGit.remoteUrl}` : 'Local Git Repository',
      repositoryUrl: wsGit.remoteUrl,
      localPath: wsGit.localPath,
      gitBranch: wsGit.branch || 'main',
      isGitConnected: true,
      category: 'Personal Project',
      icon: '🐙'
    });

    vscode.window.showInformationMessage(`✓ Successfully connected workspace "${project.name}" [${wsGit.branch || 'main'}] to Developer Focus!`);
    return project;
  }
}

function formatRepoTitle(repoName: string): string {
  return repoName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
