import { TaskPriority, TaskStatus, WorkCategory } from '../constants';

export interface TaskAttempt {
  id: string;
  sessionStartTime: number;
  durationMs: number;
  completed: boolean;
  notes?: string;
}

export interface DevTask {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  category: WorkCategory;
  priority: TaskPriority;
  status: TaskStatus;
  targetDurationMinutes: number;
  totalTimeSpentMs: number;
  isToday: boolean;
  isInbox?: boolean;
  linkedFilePath?: string;
  deadline?: string;
  tags: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  attempts: TaskAttempt[];
}

export interface TaskCreateInput {
  title: string;
  projectId?: string;
  description?: string;
  category?: WorkCategory;
  priority?: TaskPriority;
  targetDurationMinutes?: number;
  isToday?: boolean;
  isInbox?: boolean;
  linkedFilePath?: string;
  deadline?: string;
  tags?: string[];
  notes?: string;
}
