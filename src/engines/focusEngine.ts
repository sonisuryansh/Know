import * as vscode from 'vscode';
import { FocusSession, SessionState, SessionTickPayload } from '../models/session';
import { StorageManager } from '../managers/storageManager';
import { TaskEngine } from './taskEngine';
import { ProjectEngine } from './projectEngine';
import { TaskAttempt } from '../models/task';
import { getTodayDateString } from '../utils/timeUtils';
import { WorkCategory } from '../constants';

export class FocusEngine implements vscode.Disposable {
  private activeSession: FocusSession | null = null;
  private timerHandle: NodeJS.Timeout | null = null;

  private _onSessionTick = new vscode.EventEmitter<SessionTickPayload>();
  public readonly onSessionTick = this._onSessionTick.event;

  private _onSessionStateChanged = new vscode.EventEmitter<FocusSession | null>();
  public readonly onSessionStateChanged = this._onSessionStateChanged.event;

  constructor(
    private readonly storage: StorageManager,
    private readonly taskEngine: TaskEngine,
    private readonly projectEngine: ProjectEngine
  ) {
    // Restore active session if any was running before reload
    this.activeSession = this.storage.getActiveSession();
    if (this.activeSession && (this.activeSession.state === 'ACTIVE' || this.activeSession.state === 'PAUSED')) {
      this.startTimerLoop();
    }
  }

  public getSession(): FocusSession | null {
    return this.activeSession;
  }

  /**
   * Starts a focus session for a task or an ad-hoc custom session
   */
  public async startSession(options: {
    taskId?: string;
    taskTitle?: string;
    projectId?: string;
    category?: WorkCategory;
    durationMinutes?: number;
  }): Promise<FocusSession | null> {
    if (this.activeSession && this.activeSession.state === 'ACTIVE') {
      await this.pauseSession();
    }

    let title = options.taskTitle || 'Focus Session';
    let projectId = options.projectId;
    let projectName: string | undefined;
    let category: WorkCategory = options.category || 'Personal Project';
    let duration = options.durationMinutes !== undefined ? options.durationMinutes : 35;

    if (options.taskId) {
      const task = this.taskEngine.getTaskById(options.taskId);
      if (task) {
        title = task.title;
        projectId = task.projectId || projectId;
        category = task.category || category;
        duration = options.durationMinutes !== undefined ? options.durationMinutes : (task.targetDurationMinutes ?? 35);

        if (task.status === 'TODO') {
          await this.taskEngine.updateStatus(task.id, 'IN_PROGRESS');
        }
      }
    }

    if (projectId) {
      const proj = this.projectEngine.getProjectById(projectId);
      if (proj) {
        projectName = proj.name;
        if (!options.category && !options.taskId) {
          category = proj.category;
        }
      }
    }

    const now = Date.now();

    this.activeSession = {
      id: `sess-${now}-${Math.random().toString(36).substring(2, 6)}`,
      taskId: options.taskId,
      projectId: projectId,
      taskTitle: title,
      projectName: projectName,
      category: category,
      targetDurationMinutes: duration,
      startTime: now,
      state: 'ACTIVE',
      focusedMs: 0,
      otherMs: 0,
      pausedMs: 0,
      lastStateChangeTime: now,
      isWorkspaceFileActive: true,
      completed: false
    };

    await this.saveSessionState();
    this.startTimerLoop();
    this._onSessionStateChanged.fire(this.activeSession);

    vscode.window.showInformationMessage(`🎯 Focus started: "${title}" (${duration}m)`);
    return this.activeSession;
  }

  /**
   * Pauses the active session
   */
  public async pauseSession(): Promise<FocusSession | null> {
    if (!this.activeSession || this.activeSession.state !== 'ACTIVE') {
      return this.activeSession;
    }

    this.accumulateTimeSinceLastChange();
    this.activeSession.state = 'PAUSED';
    this.activeSession.lastStateChangeTime = Date.now();

    await this.saveSessionState();
    this._onSessionStateChanged.fire(this.activeSession);
    return this.activeSession;
  }

  /**
   * Resumes the paused session
   */
  public async resumeSession(): Promise<FocusSession | null> {
    if (!this.activeSession || this.activeSession.state !== 'PAUSED') {
      return this.activeSession;
    }

    this.accumulateTimeSinceLastChange();
    this.activeSession.state = 'ACTIVE';
    this.activeSession.lastStateChangeTime = Date.now();

    await this.saveSessionState();
    this._onSessionStateChanged.fire(this.activeSession);
    return this.activeSession;
  }

  /**
   * Adds extra minutes to current active session (e.g. +5 min extension)
   */
  public async addExtraMinutes(minutes: number): Promise<void> {
    if (!this.activeSession) return;
    this.activeSession.targetDurationMinutes += minutes;
    await this.saveSessionState();
    this._onSessionStateChanged.fire(this.activeSession);
    vscode.window.showInformationMessage(`Added +${minutes}m to active focus session.`);
  }

  /**
   * Updates whether user is active in workspace
   */
  public updateWorkspaceFileContext(isWorkspaceActive: boolean): void {
    if (!this.activeSession || this.activeSession.state !== 'ACTIVE') {
      return;
    }

    if (this.activeSession.isWorkspaceFileActive !== isWorkspaceActive) {
      this.accumulateTimeSinceLastChange();
      this.activeSession.isWorkspaceFileActive = isWorkspaceActive;
      this.activeSession.lastStateChangeTime = Date.now();
      this.saveSessionState();
    }
  }

  /**
   * Finishes and completes the active session
   */
  public async finishSession(markTaskCompleted: boolean = false, notes?: string): Promise<void> {
    if (!this.activeSession) {
      return;
    }

    this.accumulateTimeSinceLastChange();
    const session = this.activeSession;
    const now = Date.now();
    session.endTime = now;
    session.state = 'COMPLETED';
    session.completed = true;
    session.notes = notes;

    const totalDurationMs = session.focusedMs + session.otherMs;
    const focusMinutes = Math.max(1, Math.round(totalDurationMs / (1000 * 60)));

    // 1. Record Attempt & Time on Task
    if (session.taskId) {
      const task = this.taskEngine.getTaskById(session.taskId);
      if (task) {
        const attempt: TaskAttempt = {
          id: `att-${now}`,
          sessionStartTime: session.startTime,
          durationMs: totalDurationMs,
          completed: markTaskCompleted,
          notes: notes || 'Completed focus session'
        };

        const updatedAttempts = [...task.attempts, attempt];
        const newTotalTime = (task.totalTimeSpentMs || 0) + totalDurationMs;

        const changes: Partial<typeof task> = {
          attempts: updatedAttempts,
          totalTimeSpentMs: newTotalTime,
          notes: notes || task.notes
        };

        if (markTaskCompleted) {
          changes.status = 'COMPLETED';
          changes.completedAt = now;
        }

        await this.taskEngine.updateTask(task.id, changes);
      }
    }

    // 2. Save into History
    await this.storage.addSessionToHistory(session);

    // 3. Update Daily Stats & Streaks
    const today = getTodayDateString();
    await this.storage.updateDailyActivity(
      today,
      focusMinutes,
      session.category,
      session.projectId,
      markTaskCompleted ? 1 : 0
    );
    await this.storage.updateStreak(today);

    // 4. Clear Active Session
    this.stopTimerLoop();
    this.activeSession = null;
    await this.storage.saveActiveSession(null);
    this._onSessionStateChanged.fire(null);

    vscode.window.showInformationMessage(`🎉 Focus session completed: "${session.taskTitle}" (${focusMinutes}m logged)`);
  }

  /**
   * Cancels the active session without recording
   */
  public async cancelSession(): Promise<void> {
    this.stopTimerLoop();
    this.activeSession = null;
    await this.storage.saveActiveSession(null);
    this._onSessionStateChanged.fire(null);
  }

  private accumulateTimeSinceLastChange(): void {
    if (!this.activeSession) return;
    const now = Date.now();
    const delta = Math.max(0, now - this.activeSession.lastStateChangeTime);

    if (this.activeSession.state === 'ACTIVE') {
      if (this.activeSession.isWorkspaceFileActive) {
        this.activeSession.focusedMs += delta;
      } else {
        this.activeSession.otherMs += delta;
      }
    } else if (this.activeSession.state === 'PAUSED') {
      this.activeSession.pausedMs += delta;
    }
    this.activeSession.lastStateChangeTime = now;
  }

  private startTimerLoop(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
    }

    this.timerHandle = setInterval(() => {
      if (!this.activeSession) {
        this.stopTimerLoop();
        return;
      }

      if (this.activeSession.state === 'ACTIVE') {
        const now = Date.now();
        const delta = Math.max(0, now - this.activeSession.lastStateChangeTime);
        const liveFocusedMs = this.activeSession.focusedMs + (this.activeSession.isWorkspaceFileActive ? delta : 0);
        const targetTotalMs = (this.activeSession.targetDurationMinutes || 0) * 60 * 1000;
        
        let remainingMs = 0;
        let progressPercent = 0;

        if (targetTotalMs > 0) {
          remainingMs = Math.max(0, targetTotalMs - liveFocusedMs);
          progressPercent = Math.min(100, Math.round((liveFocusedMs / targetTotalMs) * 100));
        } else {
          remainingMs = 0;
          progressPercent = 100;
        }

        this._onSessionTick.fire({
          session: this.activeSession,
          remainingMs,
          elapsedMs: liveFocusedMs,
          progressPercent,
          isWorkspaceActive: this.activeSession.isWorkspaceFileActive
        });
      }
    }, 1000);
  }

  private stopTimerLoop(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  private async saveSessionState(): Promise<void> {
    await this.storage.saveActiveSession(this.activeSession);
  }

  public dispose(): void {
    this.stopTimerLoop();
    this._onSessionTick.dispose();
    this._onSessionStateChanged.dispose();
  }
}
