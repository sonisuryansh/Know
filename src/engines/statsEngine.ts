import { StorageManager } from '../managers/storageManager';
import { TaskEngine } from './taskEngine';
import { ProjectEngine } from './projectEngine';
import { FocusEngine } from './focusEngine';
import { DashboardSummary, HeatmapDay, CategoryTimeSummary, ProjectTimeSummary } from '../models/stats';
import { WORK_CATEGORIES } from '../constants';
import { getTodayDateString, getPastDatesArray, isDateThisWeek, isDateThisMonth } from '../utils/timeUtils';

export class StatsEngine {
  constructor(
    private readonly storage: StorageManager,
    private readonly taskEngine: TaskEngine,
    private readonly projectEngine: ProjectEngine,
    private readonly focusEngine: FocusEngine
  ) {}

  public getDashboardSummary(): DashboardSummary {
    const tasks = this.taskEngine.getAllTasks();
    const projects = this.projectEngine.getAllProjects(true);
    const today = getTodayDateString();
    const dailyStatsMap = this.storage.getDailyStatsMap();
    const streak = this.storage.getStreakInfo();
    const history = this.storage.getSessionsHistory();
    const activeSession = this.focusEngine.getSession();

    // 1. Today Stats
    const todayRecord = dailyStatsMap[today] || {
      date: today,
      focusMinutes: 0,
      sessionsCount: 0,
      completedTasksCount: 0,
      categories: {},
      projects: {}
    };

    const completedTodayCount = tasks.filter(t => {
      if (!t.completedAt) return false;
      const compDate = new Date(t.completedAt).toISOString().split('T')[0];
      return compDate === today;
    }).length;

    // 2. Period Aggregations
    let thisWeekMinutes = 0;
    let thisMonthMinutes = 0;
    let totalFocusMinutes = 0;
    let totalSessions = 0;

    Object.entries(dailyStatsMap).forEach(([dateStr, record]) => {
      const mins = record.focusMinutes || 0;
      totalFocusMinutes += mins;
      totalSessions += (record.sessionsCount || 0);

      if (isDateThisWeek(dateStr)) {
        thisWeekMinutes += mins;
      }
      if (isDateThisMonth(dateStr)) {
        thisMonthMinutes += mins;
      }
    });

    const totalCompletedTasks = tasks.filter(t => t.status === 'COMPLETED').length;

    // 3. 52-Week GitHub-style Heatmap Grid (Past 365 days / 52 weeks)
    const pastDates = getPastDatesArray(365);
    const heatmap: HeatmapDay[] = pastDates.map(dStr => {
      const rec = dailyStatsMap[dStr];
      const count = rec ? rec.focusMinutes : 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 120) level = 4;
      else if (count >= 60) level = 3;
      else if (count >= 30) level = 2;
      else if (count > 0) level = 1;

      return {
        date: dStr,
        count,
        level
      };
    });

    // 4. Category Time Distribution (Only real user data)
    const categoryMinutesMap: Record<string, number> = {};
    WORK_CATEGORIES.forEach(cat => { categoryMinutesMap[cat] = 0; });

    Object.values(dailyStatsMap).forEach(rec => {
      if (rec.categories) {
        Object.entries(rec.categories).forEach(([cat, mins]) => {
          categoryMinutesMap[cat] = (categoryMinutesMap[cat] || 0) + mins;
        });
      }
    });

    const grandTotalCatMinutes = Object.values(categoryMinutesMap).reduce((a, b) => a + b, 0);
    const categoryDistribution: CategoryTimeSummary[] = grandTotalCatMinutes > 0
      ? WORK_CATEGORIES.map(cat => ({
          category: cat,
          minutes: categoryMinutesMap[cat] || 0,
          percentage: Math.round(((categoryMinutesMap[cat] || 0) / grandTotalCatMinutes) * 100)
        })).filter(c => c.minutes > 0)
      : [];

    // 5. Project Breakdown (Only projects that exist)
    const projectBreakdown: ProjectTimeSummary[] = projects.map(proj => {
      const projTasks = tasks.filter(t => t.projectId === proj.id);
      const completedCount = projTasks.filter(t => t.status === 'COMPLETED').length;
      
      let projTotalMinutes = 0;
      Object.values(dailyStatsMap).forEach(rec => {
        if (rec.projects && rec.projects[proj.id]) {
          projTotalMinutes += rec.projects[proj.id];
        }
      });

      const taskTimeMinutes = Math.round(projTasks.reduce((sum, t) => sum + (t.totalTimeSpentMs || 0), 0) / (60 * 1000));
      const effectiveMinutes = Math.max(projTotalMinutes, taskTimeMinutes);

      return {
        projectId: proj.id,
        projectName: proj.name,
        color: proj.color,
        icon: proj.icon,
        minutes: effectiveMinutes,
        tasksCount: projTasks.length,
        completedTasksCount: completedCount
      };
    });

    // 6. Recent Sessions
    const recentSessionsFormatted = history.slice(0, 15).map(s => {
      const proj = s.projectId ? this.projectEngine.getProjectById(s.projectId) : undefined;
      return {
        id: s.id,
        taskTitle: s.taskTitle,
        projectName: s.projectName || proj?.name,
        category: s.category || 'General',
        durationMinutes: Math.round((s.focusedMs + s.otherMs) / (60 * 1000)),
        completed: s.completed,
        date: new Date(s.startTime).toLocaleDateString(),
        notes: s.notes
      };
    });

    return {
      todayStats: {
        focusMinutes: todayRecord.focusMinutes,
        completedTasksCount: completedTodayCount || todayRecord.completedTasksCount,
        sessionsCount: todayRecord.sessionsCount,
        activeSessionTitle: activeSession ? activeSession.taskTitle : undefined,
        activeProjectName: activeSession ? activeSession.projectName : undefined
      },
      periodStats: {
        thisWeekMinutes,
        thisMonthMinutes,
        totalFocusMinutes,
        totalCompletedTasks,
        totalSessions
      },
      streak,
      heatmap,
      categoryDistribution,
      projectBreakdown,
      recentSessions: recentSessionsFormatted
    };
  }
}
