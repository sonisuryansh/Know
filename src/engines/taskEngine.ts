import * as vscode from 'vscode';
import { StorageManager } from '../managers/storageManager';
import { DevTask, TaskCreateInput } from '../models/task';
import { TaskStatus } from '../constants';
import { ProjectEngine } from './projectEngine';

export class TaskEngine {
  private _onTasksChanged = new vscode.EventEmitter<DevTask[]>();
  public readonly onTasksChanged = this._onTasksChanged.event;

  constructor(
    private readonly storage: StorageManager,
    private readonly projectEngine?: ProjectEngine
  ) {}

  public getAllTasks(): DevTask[] {
    return this.storage.getTasks();
  }

  public getTaskById(taskId: string): DevTask | undefined {
    return this.getAllTasks().find(t => t.id === taskId);
  }

  public getTodayTasks(): DevTask[] {
    return this.getAllTasks().filter(t => (t.isToday || t.status === 'IN_PROGRESS') && !t.isInbox);
  }

  public getInboxTasks(): DevTask[] {
    return this.getAllTasks().filter(t => t.isInbox && t.status !== 'COMPLETED');
  }

  public getTasksByProject(projectId: string): DevTask[] {
    return this.getAllTasks().filter(t => t.projectId === projectId);
  }

  public async quickAddInboxTask(title: string, linkedFilePath?: string): Promise<DevTask> {
    return this.createTask({
      title: title.trim(),
      category: 'Personal Project',
      priority: 'Medium',
      targetDurationMinutes: 25,
      isToday: false,
      isInbox: true,
      linkedFilePath
    });
  }

  public async createTask(input: TaskCreateInput): Promise<DevTask> {
    const tasks = this.getAllTasks();
    const now = Date.now();

    let category = input.category || 'Personal Project';
    if (input.projectId && this.projectEngine) {
      const proj = this.projectEngine.getProjectById(input.projectId);
      if (proj && !input.category) {
        category = proj.category;
      }
    }

    const newTask: DevTask = {
      id: `task-${now}-${Math.random().toString(36).substring(2, 6)}`,
      projectId: input.projectId,
      title: input.title.trim(),
      description: input.description?.trim(),
      category: category,
      priority: input.priority || 'Medium',
      status: 'TODO',
      targetDurationMinutes: input.targetDurationMinutes || 35,
      totalTimeSpentMs: 0,
      isToday: input.isToday ?? (!input.isInbox),
      isInbox: input.isInbox ?? false,
      linkedFilePath: input.linkedFilePath,
      deadline: input.deadline,
      tags: input.tags || [],
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
      attempts: []
    };

    tasks.unshift(newTask);
    await this.storage.saveTasks(tasks);
    this._onTasksChanged.fire(tasks);
    return newTask;
  }

  public async updateTask(taskId: string, changes: Partial<DevTask>): Promise<DevTask | null> {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      return null;
    }

    const updatedTask = {
      ...tasks[index],
      ...changes,
      updatedAt: Date.now()
    };

    tasks[index] = updatedTask;
    await this.storage.saveTasks(tasks);
    this._onTasksChanged.fire(tasks);
    return updatedTask;
  }

  public async deleteTask(taskId: string): Promise<boolean> {
    let tasks = this.getAllTasks();
    const prevLen = tasks.length;
    tasks = tasks.filter(t => t.id !== taskId);
    if (tasks.length !== prevLen) {
      await this.storage.saveTasks(tasks);
      this._onTasksChanged.fire(tasks);
      return true;
    }
    return false;
  }

  public async updateStatus(taskId: string, status: TaskStatus): Promise<DevTask | null> {
    const changes: Partial<DevTask> = { status };
    if (status === 'COMPLETED') {
      changes.completedAt = Date.now();
    } else {
      changes.completedAt = undefined;
    }
    return this.updateTask(taskId, changes);
  }

  public async toggleTaskCompletion(taskId: string): Promise<DevTask | null> {
    const task = this.getTaskById(taskId);
    if (!task) return null;
    const newStatus: TaskStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    return this.updateStatus(taskId, newStatus);
  }

  public async moveToToday(taskId: string): Promise<DevTask | null> {
    return this.updateTask(taskId, { isToday: true, isInbox: false });
  }

  public async addTimeToTask(taskId: string, durationMs: number): Promise<void> {
    const task = this.getTaskById(taskId);
    if (task) {
      await this.updateTask(taskId, {
        totalTimeSpentMs: (task.totalTimeSpentMs || 0) + durationMs
      });
    }
  }

  public async linkFile(taskId: string, filePath: string): Promise<DevTask | null> {
    return this.updateTask(taskId, { linkedFilePath: filePath });
  }
}
