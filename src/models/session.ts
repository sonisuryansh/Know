import { WorkCategory } from '../constants';

export type SessionState = 'ACTIVE' | 'PAUSED' | 'IDLE' | 'COMPLETED';

export interface FocusSession {
  id: string;
  taskId?: string;
  projectId?: string;
  taskTitle: string;
  projectName?: string;
  category: WorkCategory;
  targetDurationMinutes: number;
  startTime: number;
  endTime?: number;
  state: SessionState;
  
  // Time breakdown
  focusedMs: number;
  otherMs: number;
  pausedMs: number;
  
  lastStateChangeTime: number;
  isWorkspaceFileActive: boolean;
  
  completed: boolean;
  notes?: string;
}

export interface SessionTickPayload {
  session: FocusSession;
  remainingMs: number;
  elapsedMs: number;
  progressPercent: number;
  isWorkspaceActive: boolean;
}
