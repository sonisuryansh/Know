import * as vscode from 'vscode';
import * as path from 'path';
import { StorageManager } from './managers/storageManager';
import { ProjectEngine } from './engines/projectEngine';
import { TaskEngine } from './engines/taskEngine';
import { FocusEngine } from './engines/focusEngine';
import { ActivityEngine } from './engines/activityEngine';
import { StatsEngine } from './engines/statsEngine';
import { StatusBarController } from './ui/statusBarItem';
import { SidebarViewProvider } from './ui/sidebarViewProvider';
import { TabPanelManager } from './ui/tabPanelManager';
import { FileLinkManager } from './managers/fileLinkManager';
import { GitImportService } from './managers/gitImportService';
import { WORK_CATEGORIES, WorkCategory, TASK_PRIORITIES, TaskPriority } from './constants';

export function activate(context: vscode.ExtensionContext) {
  console.log('🚀 Developer Focus extension is activating...');

  // 1. Initialize Core Storage & Engines
  const storageManager = new StorageManager(context);
  const projectEngine = new ProjectEngine(storageManager);
  const taskEngine = new TaskEngine(storageManager, projectEngine);
  const focusEngine = new FocusEngine(storageManager, taskEngine, projectEngine);
  const activityEngine = new ActivityEngine(focusEngine, taskEngine);
  const statsEngine = new StatsEngine(storageManager, taskEngine, projectEngine, focusEngine);
  const gitImportService = new GitImportService(projectEngine);

  // 2. Initialize UI Controllers
  const statusBarController = new StatusBarController(focusEngine);
  const sidebarProvider = new SidebarViewProvider(
    context.extensionUri,
    focusEngine,
    taskEngine,
    projectEngine,
    statsEngine,
    storageManager
  );

  // 3. Register Sidebar Webview View
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SidebarViewProvider.viewType, sidebarProvider)
  );

  // 4. Register VS Code Commands

  // A. Open in Editor Tab
  const openInTabCmd = vscode.commands.registerCommand('devFocus.openInTab', () => {
    TabPanelManager.createOrShow(
      context.extensionUri,
      focusEngine,
      taskEngine,
      projectEngine,
      statsEngine,
      storageManager
    );
  });

  // B. Start Focus Session
  const startSessionCmd = vscode.commands.registerCommand('devFocus.startSession', async () => {
    const tasks = taskEngine.getAllTasks().filter(t => t.status !== 'COMPLETED');
    const items: (vscode.QuickPickItem & { taskId?: string })[] = [
      {
        label: '$(play) Start Custom / Ad-hoc Focus Session',
        description: 'Focus on a custom task without selecting an existing one',
        taskId: undefined
      }
    ];

    tasks.forEach(t => {
      const proj = t.projectId ? projectEngine.getProjectById(t.projectId) : undefined;
      items.push({
        label: `$(target) ${t.title}`,
        description: `[${t.priority}] ${proj ? proj.name : t.category}`,
        detail: `Target: ${t.targetDurationMinutes} mins`,
        taskId: t.id
      });
    });

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a task or start custom focus session:'
    });

    if (!selected) return;

    if (selected.taskId) {
      const task = taskEngine.getTaskById(selected.taskId);
      if (task) {
        await focusEngine.startSession({ taskId: task.id, durationMinutes: task.targetDurationMinutes });
        if (task.linkedFilePath) {
          await FileLinkManager.openLinkedFile(task.linkedFilePath);
        }
      }
    } else {
      const title = await vscode.window.showInputBox({
        prompt: 'What are you focusing on right now?',
        placeHolder: 'e.g. Implement user authentication, Debug API timeout'
      });
      if (!title) return;

      const durationStr = await vscode.window.showInputBox({
        prompt: 'Target duration in minutes:',
        value: '35'
      });
      const duration = parseInt(durationStr || '35') || 35;

      await focusEngine.startSession({ taskTitle: title, durationMinutes: duration });
    }
  });

  // C. Pause Session
  const pauseSessionCmd = vscode.commands.registerCommand('devFocus.pauseSession', async () => {
    await focusEngine.pauseSession();
  });

  // D. Resume Session
  const resumeSessionCmd = vscode.commands.registerCommand('devFocus.resumeSession', async () => {
    await focusEngine.resumeSession();
  });

  // E. Finish Session
  const finishSessionCmd = vscode.commands.registerCommand('devFocus.finishSession', async () => {
    const session = focusEngine.getSession();
    if (!session) {
      vscode.window.showInformationMessage('Developer Focus: No active session running.');
      return;
    }

    const choice = await vscode.window.showQuickPick(
      [
        { label: '✓ Finish & Mark Task Completed', markCompleted: true },
        { label: '⏱ Finish Session (Keep Task In-Progress)', markCompleted: false }
      ],
      { placeHolder: 'Complete session action:' }
    );

    if (choice) {
      const notes = await vscode.window.showInputBox({
        prompt: 'Optional session summary or notes:',
        placeHolder: 'e.g. Added JWT token validator, tested with Postman'
      });
      await focusEngine.finishSession(choice.markCompleted, notes);
    }
  });

  // F. Create Task
  const createTaskCmd = vscode.commands.registerCommand('devFocus.createTask', async () => {
    const title = await vscode.window.showInputBox({
      prompt: 'Enter task title:',
      placeHolder: 'e.g. Setup Redis cache layer'
    });
    if (!title) return;

    const projects = projectEngine.getAllProjects();
    const projectItems = [
      { label: '$(circle-slash) No Project (Standalone)', id: undefined },
      ...projects.map(p => ({ label: `${p.icon} ${p.name}`, id: p.id }))
    ];

    const chosenProj = await vscode.window.showQuickPick(projectItems, {
      placeHolder: 'Assign to a project (optional):'
    });

    const category = await vscode.window.showQuickPick([...WORK_CATEGORIES], {
      placeHolder: 'Select Category:'
    });

    const priority = await vscode.window.showQuickPick([...TASK_PRIORITIES], {
      placeHolder: 'Select Priority:'
    });

    const durationStr = await vscode.window.showInputBox({
      prompt: 'Target minutes:',
      value: '35'
    });

    const task = await taskEngine.createTask({
      title,
      projectId: chosenProj?.id,
      category: (category as WorkCategory) || 'Personal Project',
      priority: (priority as TaskPriority) || 'Medium',
      targetDurationMinutes: parseInt(durationStr || '35') || 35,
      isToday: true
    });

    const startChoice = await vscode.window.showInformationMessage(
      `Created task "${task.title}". Start focus session now?`,
      '▶ Start Focus',
      'Later'
    );

    if (startChoice === '▶ Start Focus') {
      await focusEngine.startSession({ taskId: task.id });
    }
  });

  // G. Quick Add Task to Inbox
  const quickAddTaskCmd = vscode.commands.registerCommand('devFocus.quickAddTask', async () => {
    const title = await vscode.window.showInputBox({
      prompt: 'Quick add idea / task to Inbox:',
      placeHolder: 'e.g. Fix responsive navbar bug'
    });
    if (!title) return;

    const activeFile = FileLinkManager.getActiveEditorFilePath() || undefined;
    const task = await taskEngine.quickAddInboxTask(title, activeFile);
    vscode.window.showInformationMessage(`Added "${task.title}" to Inbox.`);
  });

  // H. Create Task from Current File (Context-Aware)
  const createTaskFromCurrentFileCmd = vscode.commands.registerCommand('devFocus.createTaskFromCurrentFile', async (uri?: vscode.Uri) => {
    const filePath = uri ? uri.fsPath : FileLinkManager.getActiveEditorFilePath();
    if (!filePath) {
      vscode.window.showWarningMessage('Developer Focus: No file is currently open in the editor.');
      return;
    }

    const relName = FileLinkManager.getDisplayFilePath(filePath);
    const baseName = path.basename(filePath);

    const title = await vscode.window.showInputBox({
      prompt: `Enter task title for "${baseName}":`,
      value: `Work on ${baseName}`
    });
    if (!title) return;

    const task = await taskEngine.createTask({
      title,
      linkedFilePath: filePath,
      category: 'Feature Implementation',
      priority: 'Medium',
      targetDurationMinutes: 35,
      isToday: true
    });

    const choice = await vscode.window.showInformationMessage(
      `Created task "${task.title}" linked to ${relName}. Start focus?`,
      '▶ Start Focus',
      'Later'
    );

    if (choice === '▶ Start Focus') {
      await focusEngine.startSession({ taskId: task.id });
    }
  });

  // I. Start Focus on This File
  const startFocusOnFileCmd = vscode.commands.registerCommand('devFocus.startFocusOnFile', async (uri?: vscode.Uri) => {
    const filePath = uri ? uri.fsPath : FileLinkManager.getActiveEditorFilePath();
    if (!filePath) {
      vscode.window.showWarningMessage('Developer Focus: No file is currently open in the editor.');
      return;
    }

    const baseName = path.basename(filePath);
    const durationStr = await vscode.window.showInputBox({
      prompt: `Focus duration for "${baseName}" in minutes:`,
      value: '35'
    });
    const duration = parseInt(durationStr || '35') || 35;

    await focusEngine.startSession({
      taskTitle: `Focus on ${baseName}`,
      durationMinutes: duration
    });
  });

  // J. Link Current File to Existing Task
  const linkCurrentFileCmd = vscode.commands.registerCommand('devFocus.linkCurrentFile', async () => {
    const currentPath = FileLinkManager.getActiveEditorFilePath();
    if (!currentPath) {
      vscode.window.showWarningMessage('Developer Focus: Please open a workspace file in the editor first.');
      return;
    }

    const tasks = taskEngine.getAllTasks().filter(t => t.status !== 'COMPLETED');
    if (tasks.length === 0) {
      vscode.window.showInformationMessage('Developer Focus: No active tasks found. Create a task first!');
      return;
    }

    const items = tasks.map(t => ({
      label: t.title,
      description: `[${t.priority}] ${t.category}`,
      task: t
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select task to link active file to:'
    });

    if (selected) {
      await taskEngine.linkFile(selected.task.id, currentPath);
      vscode.window.showInformationMessage(`Linked "${FileLinkManager.getDisplayFilePath(currentPath)}" to task!`);
    }
  });

  // K. Import GitHub Repository
  const importGitHubRepoCmd = vscode.commands.registerCommand('devFocus.importGitHubRepo', async () => {
    await gitImportService.promptAndImportRepository();
  });

  // L. Associate Current Workspace as Project
  const associateWorkspaceCmd = vscode.commands.registerCommand('devFocus.associateCurrentWorkspace', async () => {
    await gitImportService.associateActiveWorkspace();
  });

  // M. View Focus / View Stats
  const viewFocusCmd = vscode.commands.registerCommand('devFocus.viewFocus', () => {
    vscode.commands.executeCommand('devFocus.sidebarView.focus');
  });

  const viewStatsCmd = vscode.commands.registerCommand('devFocus.viewStats', () => {
    vscode.commands.executeCommand('devFocus.sidebarView.focus');
  });

  // Register all subscriptions
  context.subscriptions.push(
    focusEngine,
    activityEngine,
    statusBarController,
    openInTabCmd,
    startSessionCmd,
    pauseSessionCmd,
    resumeSessionCmd,
    finishSessionCmd,
    createTaskCmd,
    quickAddTaskCmd,
    createTaskFromCurrentFileCmd,
    startFocusOnFileCmd,
    linkCurrentFileCmd,
    importGitHubRepoCmd,
    associateWorkspaceCmd,
    viewFocusCmd,
    viewStatsCmd
  );

  console.log('✅ Developer Focus extension successfully activated.');
}

export function deactivate() {
  console.log('🛑 Developer Focus extension deactivated.');
}
