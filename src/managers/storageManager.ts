import * as vscode from 'vscode';
import { STORAGE_KEYS } from '../constants';
import { DevProject } from '../models/project';
import { DevTask } from '../models/task';
import { FocusSession } from '../models/session';
import { DailyActivityRecord, StreakInfo } from '../models/stats';

export class StorageManager {
  constructor(private readonly context: vscode.ExtensionContext) {
    this.cleanLegacyDsaKeys();
  }

  // --- Clean legacy DSA storage keys if any exist ---
  private cleanLegacyDsaKeys(): void {
    const legacyKeys = [
      'dsa_focus_tasks',
      'dsa_focus_sessions',
      'dsa_focus_active_session',
      'dsa_focus_streak_data',
      'dsa_focus_daily_stats',
      'dsa_focus_settings'
    ];
    for (const key of legacyKeys) {
      if (this.context.globalState.get(key) !== undefined) {
        this.context.globalState.update(key, undefined);
      }
    }
  }

  // --- Projects ---
  public getProjects(): DevProject[] {
    return this.context.globalState.get<DevProject[]>(STORAGE_KEYS.PROJECTS, []);
  }

  public async saveProjects(projects: DevProject[]): Promise<void> {
    await this.context.globalState.update(STORAGE_KEYS.PROJECTS, projects);
  }

  // --- Tasks ---
  public getTasks(): DevTask[] {
    return this.context.globalState.get<DevTask[]>(STORAGE_KEYS.TASKS, []);
  }

  public async saveTasks(tasks: DevTask[]): Promise<void> {
    await this.context.globalState.update(STORAGE_KEYS.TASKS, tasks);
  }

  // --- Active Session ---
  public getActiveSession(): FocusSession | null {
    return this.context.globalState.get<FocusSession | null>(STORAGE_KEYS.ACTIVE_SESSION, null);
  }

  public async saveActiveSession(session: FocusSession | null): Promise<void> {
    await this.context.globalState.update(STORAGE_KEYS.ACTIVE_SESSION, session);
  }

  // --- Past Sessions History ---
  public getSessionsHistory(): FocusSession[] {
    return this.context.globalState.get<FocusSession[]>(STORAGE_KEYS.SESSIONS, []);
  }

  public async addSessionToHistory(session: FocusSession): Promise<void> {
    const history = this.getSessionsHistory();
    history.unshift(session);
    if (history.length > 300) {
      history.pop();
    }
    await this.context.globalState.update(STORAGE_KEYS.SESSIONS, history);
  }

  // --- Daily Activity Stats ---
  public getDailyStatsMap(): Record<string, DailyActivityRecord> {
    return this.context.globalState.get<Record<string, DailyActivityRecord>>(STORAGE_KEYS.DAILY_STATS, {});
  }

  public async updateDailyActivity(
    dateStr: string,
    focusMinutes: number,
    category: string,
    projectId?: string,
    completedTaskDelta: number = 0
  ): Promise<void> {
    const stats = this.getDailyStatsMap();
    const existing: DailyActivityRecord = stats[dateStr] || {
      date: dateStr,
      focusMinutes: 0,
      sessionsCount: 0,
      completedTasksCount: 0,
      categories: {},
      projects: {}
    };

    existing.focusMinutes += focusMinutes;
    existing.sessionsCount += 1;
    existing.completedTasksCount += completedTaskDelta;

    if (category) {
      existing.categories[category] = (existing.categories[category] || 0) + focusMinutes;
    }
    if (projectId) {
      existing.projects[projectId] = (existing.projects[projectId] || 0) + focusMinutes;
    }

    stats[dateStr] = existing;
    await this.context.globalState.update(STORAGE_KEYS.DAILY_STATS, stats);
  }

  // --- Streaks ---
  public getStreakInfo(): StreakInfo {
    return this.context.globalState.get<StreakInfo>(STORAGE_KEYS.STREAK_DATA, {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: ''
    });
  }

  public async updateStreak(activeDateStr: string): Promise<void> {
    const streak = this.getStreakInfo();
    if (streak.lastActiveDate === activeDateStr) {
      return;
    }

    const today = activeDateStr;
    if (!streak.lastActiveDate) {
      streak.currentStreak = 1;
      streak.longestStreak = 1;
      streak.lastActiveDate = today;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streak.lastActiveDate === yesterdayStr) {
        streak.currentStreak += 1;
      } else {
        streak.currentStreak = 1;
      }

      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
      streak.lastActiveDate = today;
    }

    await this.context.globalState.update(STORAGE_KEYS.STREAK_DATA, streak);
  }

  // --- Export & Import Data ---
  public getAllDataExport(): string {
    const data = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      projects: this.getProjects(),
      tasks: this.getTasks(),
      sessions: this.getSessionsHistory(),
      dailyStats: this.getDailyStatsMap(),
      streak: this.getStreakInfo()
    };
    return JSON.stringify(data, null, 2);
  }

  public async importAllData(jsonStr: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.projects && Array.isArray(parsed.projects)) {
        await this.saveProjects(parsed.projects);
      }
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        await this.saveTasks(parsed.tasks);
      }
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        await this.context.globalState.update(STORAGE_KEYS.SESSIONS, parsed.sessions);
      }
      if (parsed.dailyStats && typeof parsed.dailyStats === 'object') {
        await this.context.globalState.update(STORAGE_KEYS.DAILY_STATS, parsed.dailyStats);
      }
      if (parsed.streak && typeof parsed.streak === 'object') {
        await this.context.globalState.update(STORAGE_KEYS.STREAK_DATA, parsed.streak);
      }
      return true;
    } catch {
      return false;
    }
  }

  public async resetAllData(): Promise<void> {
    await this.context.globalState.update(STORAGE_KEYS.PROJECTS, undefined);
    await this.context.globalState.update(STORAGE_KEYS.TASKS, undefined);
    await this.context.globalState.update(STORAGE_KEYS.SESSIONS, undefined);
    await this.context.globalState.update(STORAGE_KEYS.ACTIVE_SESSION, undefined);
    await this.context.globalState.update(STORAGE_KEYS.DAILY_STATS, undefined);
    await this.context.globalState.update(STORAGE_KEYS.STREAK_DATA, undefined);
    this.cleanLegacyDsaKeys();
  }
}
