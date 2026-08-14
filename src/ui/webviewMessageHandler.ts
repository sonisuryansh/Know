import * as vscode from 'vscode';
import { FocusEngine } from '../engines/focusEngine';
import { TaskEngine } from '../engines/taskEngine';
import { ProjectEngine } from '../engines/projectEngine';
import { StatsEngine } from '../engines/statsEngine';
import { StorageManager } from '../managers/storageManager';
import { FileLinkManager } from '../managers/fileLinkManager';
import { GitImportService } from '../managers/gitImportService';
import { WORK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES, PROJECT_COLORS, PROJECT_ICONS } from '../constants';

export class WebviewMessageHandler {
  private gitImportService: GitImportService;

  constructor(
    private readonly focusEngine: FocusEngine,
    private readonly taskEngine: TaskEngine,
    private readonly projectEngine: ProjectEngine,
    private readonly statsEngine: StatsEngine,
    private readonly storage: StorageManager
  ) {
    this.gitImportService = new GitImportService(projectEngine);
  }

  public getStatePayload() {
    const allProjects = this.projectEngine.getAllProjects(true);
    const allTasks = this.taskEngine.getAllTasks();
    const todayTasks = this.taskEngine.getTodayTasks();
    const inboxTasks = this.taskEngine.getInboxTasks();
    const activeSession = this.focusEngine.getSession();
    const dashboard = this.statsEngine.getDashboardSummary();

    return {
      allProjects,
      allTasks,
      todayTasks,
      inboxTasks,
      activeSession,
      dashboard,
      categories: WORK_CATEGORIES,
      priorities: TASK_PRIORITIES,
      statuses: TASK_STATUSES,
      projectColors: PROJECT_COLORS,
      projectIcons: PROJECT_ICONS
    };
  }

  public async handleMessage(message: { command: string; payload?: any }, postUpdate: () => void): Promise<void> {
    switch (message.command) {
      case 'START_SESSION': {
        await this.focusEngine.startSession(message.payload || {});
        break;
      }

      case 'PAUSE_SESSION': {
        await this.focusEngine.pauseSession();
        break;
      }

      case 'RESUME_SESSION': {
        await this.focusEngine.resumeSession();
        break;
      }

      case 'ADD_EXTRA_TIME': {
        const mins = message.payload?.minutes || 5;
        await this.focusEngine.addExtraMinutes(mins);
        break;
      }

      case 'FINISH_SESSION': {
        const { markCompleted, notes } = message.payload || {};
        await this.focusEngine.finishSession(markCompleted, notes);
        break;
      }

      case 'CANCEL_SESSION': {
        await this.focusEngine.cancelSession();
        break;
      }

      case 'QUICK_INBOX_ADD': {
        const { title } = message.payload;
        if (title) {
          const task = await this.taskEngine.quickAddInboxTask(title);
          vscode.window.showInformationMessage(`Added to Inbox: "${task.title}"`);
        }
        break;
      }

      case 'MOVE_TO_TODAY': {
        const { taskId } = message.payload;
        if (taskId) {
          await this.taskEngine.moveToToday(taskId);
        }
        break;
      }

      case 'CREATE_TASK': {
        const input = message.payload;
        if (input.linkActiveFile) {
          const activeFile = FileLinkManager.getActiveEditorFilePath();
          if (activeFile) {
            input.linkedFilePath = activeFile;
          }
        }
        const task = await this.taskEngine.createTask(input);
        vscode.window.showInformationMessage(`Created task: "${task.title}"`);
        break;
      }

      case 'UPDATE_TASK_STATUS': {
        const { taskId, status } = message.payload;
        await this.taskEngine.updateStatus(taskId, status);
        break;
      }

      case 'TOGGLE_TASK_COMPLETE': {
        const { taskId } = message.payload;
        await this.taskEngine.toggleTaskCompletion(taskId);
        break;
      }

      case 'DELETE_TASK': {
        const { taskId } = message.payload;
        await this.taskEngine.deleteTask(taskId);
        break;
      }

      case 'CREATE_PROJECT': {
        const project = await this.projectEngine.createProject(message.payload);
        vscode.window.showInformationMessage(`Created project: "${project.name}"`);
        break;
      }

      case 'IMPORT_GITHUB_REPO': {
        const { repoUrl } = message.payload || {};
        const project = await this.gitImportService.promptAndImportRepository(repoUrl);
        if (project) {
          postUpdate();
        }
        break;
      }

      case 'ASSOCIATE_WORKSPACE_REPO': {
        const project = await this.gitImportService.associateActiveWorkspace();
        if (project) {
          postUpdate();
        }
        break;
      }

      case 'OPEN_PROJECT_FOLDER': {
        const { localPath } = message.payload || {};
        if (localPath) {
          await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(localPath));
        }
        break;
      }

      case 'DELETE_PROJECT': {
        const { projectId } = message.payload;
        await this.projectEngine.deleteProject(projectId);
        break;
      }

      case 'OPEN_LINKED_FILE': {
        const { filePath } = message.payload;
        if (filePath) {
          await FileLinkManager.openLinkedFile(filePath);
        }
        break;
      }

      case 'EXPORT_DATA': {
        const jsonStr = this.storage.getAllDataExport();
        const doc = await vscode.workspace.openTextDocument({
          content: jsonStr,
          language: 'json'
        });
        await vscode.window.showTextDocument(doc);
        vscode.window.showInformationMessage('Exported data to JSON. Save anywhere you like!');
        break;
      }

      case 'IMPORT_DATA': {
        const { jsonContent } = message.payload;
        if (jsonContent) {
          const ok = await this.storage.importAllData(jsonContent);
          if (ok) {
            vscode.window.showInformationMessage('Data imported successfully!');
            postUpdate();
          } else {
            vscode.window.showErrorMessage('Failed to parse import JSON data.');
          }
        }
        break;
      }

      case 'RESET_DATA': {
        const confirm = await vscode.window.showWarningMessage(
          'Are you sure you want to reset all Developer Focus data? This action cannot be undone.',
          { modal: true },
          'Reset Everything'
        );
        if (confirm === 'Reset Everything') {
          await this.storage.resetAllData();
          vscode.window.showInformationMessage('All data has been reset.');
          postUpdate();
        }
        break;
      }

      case 'REFRESH_ALL': {
        postUpdate();
        break;
      }
    }
  }
}
