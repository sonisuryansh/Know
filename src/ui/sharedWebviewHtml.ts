import * as vscode from 'vscode';
import { getNonce } from '../utils/nonce';

export function getSharedWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri, isPanel = false): string {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.css'));
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; font-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}';">
  <link href="${styleUri}" rel="stylesheet">
  <title>Developer Focus</title>
</head>
<body class="dev-body ${isPanel ? 'panel-mode' : 'sidebar-mode'}">
  <div id="app">
    <!-- Top Header -->
    <header class="app-header">
      <div class="brand-title">
        <span class="brand-icon">⚡</span>
        <span class="brand-name">Developer Focus</span>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary btn-xs header-cta-btn" id="headerStartFocusBtn">▶ Start Focus</button>
        <button class="btn btn-secondary btn-xs header-cta-btn" id="headerAddTaskBtn">+ Add Task</button>
        <button class="icon-btn" id="refreshBtn" title="Refresh">↻</button>
        <button class="icon-btn" id="openSettingsBtn" title="Settings & Backup">⚙️</button>
      </div>
    </header>

    <!-- 4 Primary Navigation Tabs -->
    <nav class="nav-tabs">
      <button class="nav-tab active" data-tab="focusTab" title="Focus Session">
        <span class="tab-icon">🎯</span>
        <span class="tab-text">Focus</span>
      </button>
      <button class="nav-tab" data-tab="tasksTab" title="Tasks & Inbox">
        <span class="tab-icon">📋</span>
        <span class="tab-text">Tasks</span>
      </button>
      <button class="nav-tab" data-tab="projectsTab" title="Projects">
        <span class="tab-icon">📁</span>
        <span class="tab-text">Projects</span>
      </button>
      <button class="nav-tab" data-tab="statsTab" title="Stats & Heatmap">
        <span class="tab-icon">📊</span>
        <span class="tab-text">Stats</span>
      </button>
    </nav>

    <!-- Main Content Container -->
    <main class="tab-content-container">

      <!-- ================= TAB 1: FOCUS ================= -->
      <section id="focusTab" class="tab-pane active">
        <!-- Active Session Focus Mode -->
        <div id="focusActiveContainer" class="focus-active-card hidden">
          <div class="focus-problem-meta">
            <span class="badge project-badge" id="activeProjectBadge">Project</span>
            <span class="badge category-badge" id="activeCategoryBadge">Feature</span>
            <span class="badge git-badge hidden" id="activeGitBadge">🐙 main</span>
          </div>

          <h2 class="active-task-title" id="activeTaskTitle">Select a task to start</h2>

          <!-- Timer HUD -->
          <div class="timer-hud">
            <div class="timer-display-box">
              <div class="timer-time" id="timerClock">00:00</div>
              <div class="timer-subtext" id="timerStatusSubtext">Active Focus Time</div>
            </div>
            
            <div class="progress-bar-track">
              <div class="progress-bar-fill" id="sessionTimeProgressFill" style="width: 0%"></div>
            </div>
          </div>

          <!-- Session Actions Grid -->
          <div class="session-actions-grid">
            <button class="btn btn-primary" id="pauseResumeBtn">⏸ Pause</button>
            <button class="btn btn-secondary btn-sm" id="addFiveMinsBtn">+5m Extra</button>
            <button class="btn btn-primary" id="finishSuccessBtn">✓ Finish & Log</button>
            <button class="btn btn-secondary" id="finishAndCompleteTaskBtn">✓ Complete Task</button>
            <button class="btn btn-danger-outline" id="cancelSessionBtn">✕ Cancel</button>
          </div>
        </div>

        <!-- Idle State -->
        <div id="focusIdleContainer" class="focus-idle-card">
          <!-- Hero Section with Clear Entry Points -->
          <div class="idle-hero">
            <div class="hero-icon">🎯</div>
            <h2 class="hero-title">Ready to focus?</h2>
            <p class="hero-subtitle">Choose something to work on and start a focused session.</p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" id="heroStartFocusBtn">▶ Start Focus</button>
              <button class="btn btn-secondary" id="heroCreateTaskBtn">+ Add Task</button>
            </div>
          </div>

          <!-- Today's Up Next Queue -->
          <div class="queue-section" id="todayQueueSection">
            <div class="section-title-row">
              <h4>Today's Focus</h4>
              <span class="counter-chip" id="todayQueueCount">0 tasks</span>
            </div>
            <div id="todayQueueList" class="today-queue-list">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TAB 2: TASKS & INBOX ================= -->
      <section id="tasksTab" class="tab-pane">
        <!-- Sub Navigation Tabs: Today | Inbox | All Tasks -->
        <div class="sub-nav-tabs">
          <button class="sub-nav-tab active" data-subtab="subtabToday">Today</button>
          <button class="sub-nav-tab" data-subtab="subtabInbox">Inbox <span class="inbox-badge" id="inboxCountBadge">0</span></button>
          <button class="sub-nav-tab" data-subtab="subtabAll">All Tasks</button>
        </div>

        <!-- Frictionless Quick Inbox Capture -->
        <div class="quick-inbox-bar">
          <input type="text" id="quickInboxInput" class="form-input" placeholder="+ Add a task or idea (press Enter)...">
          <button class="btn btn-secondary btn-sm" id="quickInboxAddBtn">Add</button>
        </div>

        <!-- Filters (Visible for All Tasks view) -->
        <div class="filters-row" id="tasksFilterRow">
          <input type="text" id="taskSearchInput" class="search-input" placeholder="Search tasks...">
          <select id="taskProjectFilterSelect" class="filter-select">
            <option value="">All Projects</option>
          </select>
          <select id="taskPriorityFilterSelect" class="filter-select">
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select id="taskStatusFilterSelect" class="filter-select">
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <!-- Task List Area -->
        <div class="task-list" id="allTaskList">
          <!-- Populated by JS based on active subtab -->
        </div>

        <!-- Bottom Action Bar -->
        <div class="tasks-bottom-bar">
          <button class="btn btn-primary btn-sm" id="tasksTabStartFocusBtn">▶ Start Focus</button>
          <button class="btn btn-secondary btn-sm" id="showDetailedTaskFormBtn">+ Add Task</button>
        </div>
      </section>

      <!-- ================= TAB 3: PROJECTS ================= -->
      <section id="projectsTab" class="tab-pane">
        <div class="section-title-row">
          <h3>Projects</h3>
          <div class="project-header-actions">
            <button class="btn btn-secondary btn-xs" id="importGitHubBtn">🐙 Import GitHub</button>
            <button class="btn btn-primary btn-xs" id="showAddProjectModalBtn">+ New Project</button>
          </div>
        </div>

        <!-- Inline Add Project Form -->
        <div id="addProjectForm" class="add-task-card hidden">
          <h4>New Project</h4>
          <input type="text" id="newProjectName" class="form-input" placeholder="Project Name (e.g. Portfolio, Company Backend)">
          <textarea id="newProjectDesc" class="form-input" placeholder="Project description (optional)" rows="2"></textarea>
          <div class="form-row">
            <select id="newProjectCategory" class="form-input"></select>
            <select id="newProjectIcon" class="form-input">
              <option value="🚀">🚀 Launch</option>
              <option value="🐙">🐙 GitHub</option>
              <option value="📁">📁 Folder</option>
              <option value="💼">💼 Work</option>
              <option value="💻">💻 Code</option>
              <option value="📚">📚 Study</option>
              <option value="⚡">⚡ Quick</option>
              <option value="🛠️">🛠️ Tools</option>
              <option value="🎯">🎯 Goal</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary btn-sm" id="submitAddProjectBtn">Create Project</button>
            <button class="btn btn-secondary btn-sm" id="cancelAddProjectBtn">Cancel</button>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="projects-grid" id="projectsGrid">
          <!-- Populated by JS -->
        </div>
      </section>

      <!-- ================= TAB 4: STATS & HEATMAP ================= -->
      <section id="statsTab" class="tab-pane">
        <!-- Overview Grid -->
        <div class="dashboard-grid">
          <div class="stat-card">
            <span class="stat-icon">🔥</span>
            <div class="stat-num" id="statStreakNum">0</div>
            <div class="stat-lbl">Day Streak</div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">⏱</span>
            <div class="stat-num" id="statTodayTime">0m</div>
            <div class="stat-lbl">Today's Focus</div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📅</span>
            <div class="stat-num" id="statWeekTime">0m</div>
            <div class="stat-lbl">This Week</div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">✓</span>
            <div class="stat-num" id="statTotalCompleted">0</div>
            <div class="stat-lbl">Tasks Done</div>
          </div>
        </div>

        <!-- 52-Week Activity Heatmap -->
        <div class="dashboard-section heatmap-section">
          <div class="section-header-flex">
            <h4>📈 Focus & Coding Activity</h4>
            <span class="heatmap-subtitle">Past 52 weeks</span>
          </div>
          <div class="heatmap-container" id="heatmapContainer"></div>
          <div class="heatmap-legend">
            <span>Less</span>
            <span class="legend-cell level-0"></span>
            <span class="legend-cell level-1"></span>
            <span class="legend-cell level-2"></span>
            <span class="legend-cell level-3"></span>
            <span class="legend-cell level-4"></span>
            <span>More</span>
          </div>
        </div>

        <!-- Category Time Distribution -->
        <div class="dashboard-section">
          <h4>🏷️ Time Distribution by Category</h4>
          <div id="categoryProgressBars" class="category-bars-list"></div>
        </div>

        <!-- Project Breakdown -->
        <div class="dashboard-section">
          <h4>📁 Project Activity</h4>
          <div id="projectStatsList" class="project-stats-list"></div>
        </div>

        <!-- Recent Focus Sessions Log -->
        <div class="dashboard-section">
          <h4>🕒 Recent Focus Sessions</h4>
          <div id="sessionHistoryList" class="history-list"></div>
        </div>
      </section>

    </main>

    <!-- ================= MODAL 1: START FOCUS MODAL ================= -->
    <div id="startFocusModal" class="modal-overlay hidden">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🎯 Start Focus</h3>
          <button class="icon-btn modal-close-btn" id="closeStartFocusModalBtn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">What are you working on?</label>
            <input type="text" id="modalFocusTitleInput" class="form-input" placeholder="e.g. Fix authentication bug, Study binary trees">
          </div>

          <div class="form-group">
            <label class="form-label">Duration</label>
            <div class="duration-pills-row" id="modalDurationPills">
              <button class="duration-pill active" data-mins="25">25m</button>
              <button class="duration-pill" data-mins="45">45m</button>
              <button class="duration-pill" data-mins="60">60m</button>
              <button class="duration-pill" data-mins="90">90m</button>
              <button class="duration-pill" data-mins="custom" id="modalCustomDurPill">Custom</button>
              <button class="duration-pill" data-mins="0" id="modalNoTimerPill">No timer</button>
            </div>
            <input type="number" id="modalCustomDurationInput" class="form-input custom-dur-input hidden" placeholder="mins" min="1" max="300" value="35">
          </div>

          <div class="form-group">
            <label class="form-label">Project (optional)</label>
            <select id="modalFocusProjectSelect" class="form-input">
              <option value="">No Project (Standalone)</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" id="modalCreateTaskCheckbox"> Create a task from this
            </label>
          </div>

          <div class="modal-actions">
            <button class="btn btn-primary btn-block btn-lg" id="modalConfirmStartFocusBtn">▶ Start Focus</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL 2: ADD TASK MODAL ================= -->
    <div id="addTaskModal" class="modal-overlay hidden">
      <div class="modal-card">
        <div class="modal-header">
          <h3>📋 Create Task</h3>
          <button class="icon-btn modal-close-btn" id="closeAddTaskModalBtn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Task Title</label>
            <input type="text" id="modalTaskTitleInput" class="form-input" placeholder="e.g. Implement authentication, Fix API bug">
          </div>

          <div class="form-group">
            <label class="form-label">Notes (optional)</label>
            <textarea id="modalTaskDescInput" class="form-input" placeholder="Description or notes" rows="2"></textarea>
          </div>

          <div class="form-row">
            <div style="flex:1;">
              <label class="form-label">Project (optional)</label>
              <select id="modalTaskProjectSelect" class="form-input">
                <option value="">No Project (Standalone)</option>
              </select>
            </div>
            <div style="flex:1;">
              <label class="form-label">Priority</label>
              <select id="modalTaskPrioritySelect" class="form-input">
                <option value="Low">Low</option>
                <option value="Medium" selected>Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div class="form-row" style="margin-top:8px;">
            <div style="flex:1;">
              <label class="form-label">Estimated Time</label>
              <input type="number" id="modalTaskDurationInput" class="form-input" value="35" min="5" max="300">
            </div>
            <div style="flex:1;display:flex;align-items:flex-end;">
              <label class="checkbox-label" style="margin-bottom:6px;">
                <input type="checkbox" id="modalTaskTodayCheckbox" checked> Add to Today
              </label>
            </div>
          </div>

          <div class="modal-actions" style="margin-top:14px;">
            <button class="btn btn-primary btn-block btn-lg" id="modalConfirmCreateTaskBtn">Create Task</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL 3: GITHUB REPO IMPORT MODAL ================= -->
    <div id="gitImportModal" class="modal-overlay hidden">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🐙 Import GitHub Repository</h3>
          <button class="icon-btn modal-close-btn" id="closeGitImportModalBtn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">GitHub Repository URL</label>
            <input type="text" id="gitRepoUrlInput" class="form-input" placeholder="https://github.com/user/project.git or user/project">
            <span style="font-size:10px;color:var(--vscode-descriptionForeground);margin-top:3px;display:block;">Supports HTTPS, SSH, or username/repo format.</span>
          </div>

          <div class="modal-actions" style="margin-top:16px;">
            <button class="btn btn-primary btn-block btn-lg" id="modalConfirmGitImportBtn">🐙 Select Destination & Clone</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL 4: SETTINGS MODAL ================= -->
    <div id="settingsModal" class="modal-overlay hidden">
      <div class="modal-card">
        <div class="modal-header">
          <h3>⚙️ Settings & Data Backup</h3>
          <button class="icon-btn modal-close-btn" id="closeSettingsBtn">✕</button>
        </div>
        <div class="modal-body">
          <div class="setting-item">
            <div class="setting-text">
              <strong>Default Duration</strong>
              <p>Default target timer minutes for new tasks.</p>
            </div>
            <input type="number" id="settingDefaultDuration" class="form-input setting-input" value="35" min="5" max="180">
          </div>

          <div class="setting-item" style="margin-top:12px;">
            <div class="setting-text">
              <strong>Associate Workspace Repository</strong>
              <p>Detect Git repository in current active workspace and add as project.</p>
            </div>
            <button class="btn btn-secondary btn-xs" id="associateWorkspaceBtn">🔗 Connect</button>
          </div>

          <div class="setting-item" style="margin-top:12px;">
            <div class="setting-text">
              <strong>100% Local & Free</strong>
              <p>Your tasks, projects, and history are stored safely on your machine.</p>
            </div>
          </div>

          <div class="settings-actions" style="margin-top:14px;">
            <button class="btn btn-secondary btn-sm" id="exportDataBtn">📥 Export Data (JSON)</button>
            <button class="btn btn-secondary btn-sm" id="importDataBtn">📤 Import Data (JSON)</button>
            <button class="btn btn-danger-outline btn-sm" id="resetDataBtn">🗑️ Reset All Data</button>
          </div>
          <input type="file" id="importFileInput" style="display:none;" accept=".json">
        </div>
      </div>
    </div>

  </div>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}
