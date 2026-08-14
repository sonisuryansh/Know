import { WorkCategory } from '../constants';

export interface DevProject {
  id: string;
  name: string;
  description?: string;
  category: WorkCategory;
  color: string;
  icon: string;
  repositoryUrl?: string;
  localPath?: string;
  gitBranch?: string;
  isGitConnected?: boolean;
  createdAt: number;
  updatedAt: number;
  totalFocusedMinutes?: number;
  tasksCount?: number;
  completedTasksCount?: number;
}

export interface ProjectCreateInput {
  name: string;
  description?: string;
  category?: WorkCategory;
  color?: string;
  icon?: string;
  repositoryUrl?: string;
  localPath?: string;
  gitBranch?: string;
  isGitConnected?: boolean;
}
