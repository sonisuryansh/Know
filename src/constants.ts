export const STORAGE_KEYS = {
  PROJECTS: 'dev_focus_projects',
  TASKS: 'dev_focus_tasks',
  SESSIONS: 'dev_focus_sessions',
  ACTIVE_SESSION: 'dev_focus_active_session',
  STREAK_DATA: 'dev_focus_streak_data',
  DAILY_STATS: 'dev_focus_daily_stats',
  USER_SETTINGS: 'dev_focus_settings'
} as const;

export const WORK_CATEGORIES = [
  'Personal Project',
  'Company Work',
  'Learning & Study',
  'Feature Implementation',
  'Bug Fix & Debugging',
  'DSA & Algorithms',
  'Code Review',
  'Documentation',
  'Open Source',
  'Research & Architecture',
  'Other'
] as const;

export type WorkCategory = typeof WORK_CATEGORIES[number];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;
export type TaskPriority = typeof TASK_PRIORITIES[number];

export const TASK_STATUSES = [
  'TODO',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

export const DURATION_PRESETS = [25, 45, 60, 90] as const;

export const PROJECT_COLORS: string[] = [];

export const PROJECT_ICONS = [
  '📁', '🚀', '💼', '💻', '📚', '⚡', '🛠️', '🎯', '🌐', '🧪', '🔥', '🎨'
] as const;

export const DEFAULT_PROJECTS = [
  {
    id: 'proj-personal',
    name: 'Personal Project',
    description: 'Personal side projects, apps, and tools',
    category: 'Personal Project' as WorkCategory,
    color: '',
    icon: '🚀'
  },
  {
    id: 'proj-work',
    name: 'Company / Work',
    description: 'Professional work, tickets, and company services',
    category: 'Company Work' as WorkCategory,
    color: '',
    icon: '💼'
  },
  {
    id: 'proj-learning',
    name: 'Learning & Study',
    description: 'Courses, docs, and concepts',
    category: 'Learning & Study' as WorkCategory,
    color: '',
    icon: '📚'
  },
  {
    id: 'proj-dsa',
    name: 'DSA & Algorithms',
    description: 'Data structures, algorithm practice, and problem solving',
    category: 'DSA & Algorithms' as WorkCategory,
    color: '',
    icon: '🎯'
  }
];
