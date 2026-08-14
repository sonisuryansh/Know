import { WorkCategory } from '../constants';

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
  sessionsCount: number;
  completedTasksCount: number;
  categories: Record<string, number>; // category -> minutes
  projects: Record<string, number>;   // projectId -> minutes
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // focus minutes
  level: 0 | 1 | 2 | 3 | 4; // 0 = empty, 4 = heavy focus
}

export interface CategoryTimeSummary {
  category: WorkCategory;
  minutes: number;
  percentage: number;
}

export interface ProjectTimeSummary {
  projectId: string;
  projectName: string;
  color: string;
  icon: string;
  minutes: number;
  tasksCount: number;
  completedTasksCount: number;
}

export interface DashboardSummary {
  todayStats: {
    focusMinutes: number;
    completedTasksCount: number;
    sessionsCount: number;
    activeSessionTitle?: string;
    activeProjectName?: string;
  };
  periodStats: {
    thisWeekMinutes: number;
    thisMonthMinutes: number;
    totalFocusMinutes: number;
    totalCompletedTasks: number;
    totalSessions: number;
  };
  streak: StreakInfo;
  heatmap: HeatmapDay[];
  categoryDistribution: CategoryTimeSummary[];
  projectBreakdown: ProjectTimeSummary[];
  recentSessions: {
    id: string;
    taskTitle: string;
    projectName?: string;
    category: string;
    durationMinutes: number;
    completed: boolean;
    date: string;
    notes?: string;
  }[];
}
