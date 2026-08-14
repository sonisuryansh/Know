import * as vscode from 'vscode';
import { StorageManager } from '../managers/storageManager';
import { DevProject, ProjectCreateInput } from '../models/project';
import { PROJECT_COLORS, PROJECT_ICONS } from '../constants';

export class ProjectEngine {
  private _onProjectsChanged = new vscode.EventEmitter<DevProject[]>();
  public readonly onProjectsChanged = this._onProjectsChanged.event;

  constructor(private readonly storage: StorageManager) {}

  public getAllProjects(computeStats = true): DevProject[] {
    const projects = this.storage.getProjects();
    if (!computeStats) {
      return projects;
    }

    const tasks = this.storage.getTasks();
    const statsMap = this.storage.getDailyStatsMap();

    return projects.map(proj => {
      const projTasks = tasks.filter(t => t.projectId === proj.id);
      const completedCount = projTasks.filter(t => t.status === 'COMPLETED').length;

      let totalMinutes = 0;
      Object.values(statsMap).forEach(day => {
        if (day.projects && day.projects[proj.id]) {
          totalMinutes += day.projects[proj.id];
        }
      });

      return {
        ...proj,
        tasksCount: projTasks.length,
        completedTasksCount: completedCount,
        totalFocusedMinutes: totalMinutes
      };
    });
  }

  public getProjectById(projectId: string): DevProject | undefined {
    return this.getAllProjects(false).find(p => p.id === projectId);
  }

  public findProjectByRepoUrl(repoUrl: string): DevProject | undefined {
    const normalized = repoUrl.toLowerCase().replace(/\.git$/, '').trim();
    return this.getAllProjects(false).find(p => {
      if (!p.repositoryUrl) return false;
      const cur = p.repositoryUrl.toLowerCase().replace(/\.git$/, '').trim();
      return cur === normalized;
    });
  }

  public findProjectByLocalPath(localPath: string): DevProject | undefined {
    const normalized = localPath.toLowerCase().replace(/\\/g, '/').trim();
    return this.getAllProjects(false).find(p => {
      if (!p.localPath) return false;
      const cur = p.localPath.toLowerCase().replace(/\\/g, '/').trim();
      return cur === normalized;
    });
  }

  public async createProject(input: ProjectCreateInput): Promise<DevProject> {
    const projects = this.getAllProjects(false);
    const now = Date.now();

    const colorIndex = projects.length % PROJECT_COLORS.length;
    const iconIndex = projects.length % PROJECT_ICONS.length;

    const newProject: DevProject = {
      id: `proj-${now}-${Math.random().toString(36).substring(2, 6)}`,
      name: input.name.trim(),
      description: input.description?.trim(),
      category: input.category || 'Personal Project',
      color: input.color || '',
      icon: input.icon || (PROJECT_ICONS.length > 0 ? PROJECT_ICONS[projects.length % PROJECT_ICONS.length] : '🚀'),
      repositoryUrl: input.repositoryUrl?.trim(),
      localPath: input.localPath?.trim(),
      gitBranch: input.gitBranch?.trim(),
      isGitConnected: input.isGitConnected ?? (!!input.repositoryUrl || !!input.localPath),
      createdAt: now,
      updatedAt: now
    };

    projects.push(newProject);
    await this.storage.saveProjects(projects);
    this._onProjectsChanged.fire(projects);
    return newProject;
  }

  public async updateProject(projectId: string, changes: Partial<DevProject>): Promise<DevProject | null> {
    const projects = this.getAllProjects(false);
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) {
      return null;
    }

    const updated = {
      ...projects[index],
      ...changes,
      updatedAt: Date.now()
    };

    projects[index] = updated;
    await this.storage.saveProjects(projects);
    this._onProjectsChanged.fire(projects);
    return updated;
  }

  public async deleteProject(projectId: string): Promise<boolean> {
    let projects = this.getAllProjects(false);
    const prevLen = projects.length;
    projects = projects.filter(p => p.id !== projectId);
    if (projects.length !== prevLen) {
      await this.storage.saveProjects(projects);
      this._onProjectsChanged.fire(projects);
      return true;
    }
    return false;
  }
}
