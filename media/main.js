// @ts-check
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  // Local state cache
  let appState = {
    allProjects: [],
    allTasks: [],
    todayTasks: [],
    inboxTasks: [],
    activeSession: null,
    dashboard: null,
    categories: [],
    priorities: [],
    statuses: [],
    projectColors: [],
    projectIcons: []
  };

  let modalSelectedDuration = 25;
  let selectedProjectColor = '';
  let activeSubtab = 'subtabToday';

  // Navigation Tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const refreshBtn = document.getElementById('refreshBtn');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const settingsModal = document.getElementById('settingsModal');

  // Header Entry Buttons
  const headerStartFocusBtn = document.getElementById('headerStartFocusBtn');
  const headerAddTaskBtn = document.getElementById('headerAddTaskBtn');

  // Focus Tab Elements
  const focusActiveContainer = document.getElementById('focusActiveContainer');
  const focusIdleContainer = document.getElementById('focusIdleContainer');
  const activeProjectBadge = document.getElementById('activeProjectBadge');
  const activeCategoryBadge = document.getElementById('activeCategoryBadge');
  const activeGitBadge = document.getElementById('activeGitBadge');
  const activeTaskTitle = document.getElementById('activeTaskTitle');
  const timerClock = document.getElementById('timerClock');
  const timerStatusSubtext = document.getElementById('timerStatusSubtext');
  const sessionTimeProgressFill = document.getElementById('sessionTimeProgressFill');
  const pauseResumeBtn = document.getElementById('pauseResumeBtn');
  const addFiveMinsBtn = document.getElementById('addFiveMinsBtn');
  const finishSuccessBtn = document.getElementById('finishSuccessBtn');
  const finishAndCompleteTaskBtn = document.getElementById('finishAndCompleteTaskBtn');
  const cancelSessionBtn = document.getElementById('cancelSessionBtn');

  // Hero Entry Buttons
  const heroStartFocusBtn = document.getElementById('heroStartFocusBtn');
  const heroCreateTaskBtn = document.getElementById('heroCreateTaskBtn');
  const todayQueueList = document.getElementById('todayQueueList');
  const todayQueueCount = document.getElementById('todayQueueCount');

  // Tasks Tab Elements
  const subNavTabs = document.querySelectorAll('.sub-nav-tab');
  const quickInboxInput = /** @type {HTMLInputElement} */ (document.getElementById('quickInboxInput'));
  const quickInboxAddBtn = document.getElementById('quickInboxAddBtn');
  const tasksFilterRow = document.getElementById('tasksFilterRow');
  const inboxCountBadge = document.getElementById('inboxCountBadge');
  const allTaskList = document.getElementById('allTaskList');
  const taskSearchInput = /** @type {HTMLInputElement} */ (document.getElementById('taskSearchInput'));
  const taskProjectFilterSelect = /** @type {HTMLSelectElement} */ (document.getElementById('taskProjectFilterSelect'));
  const taskPriorityFilterSelect = /** @type {HTMLSelectElement} */ (document.getElementById('taskPriorityFilterSelect'));
  const taskStatusFilterSelect = /** @type {HTMLSelectElement} */ (document.getElementById('taskStatusFilterSelect'));
  const tasksTabStartFocusBtn = document.getElementById('tasksTabStartFocusBtn');
  const showDetailedTaskFormBtn = document.getElementById('showDetailedTaskFormBtn');
  const addTaskForm = document.getElementById('addTaskForm');
  const newTaskTitle = /** @type {HTMLInputElement} */ (document.getElementById('newTaskTitle'));
  const newTaskDesc = /** @type {HTMLTextAreaElement} */ (document.getElementById('newTaskDesc'));
  const newTaskProject = /** @type {HTMLSelectElement} */ (document.getElementById('newTaskProject'));
  const newTaskCategory = /** @type {HTMLSelectElement} */ (document.getElementById('newTaskCategory'));
  const newTaskPriority = /** @type {HTMLSelectElement} */ (document.getElementById('newTaskPriority'));
  const newTaskDuration = /** @type {HTMLInputElement} */ (document.getElementById('newTaskDuration'));
  const newTaskToday = /** @type {HTMLInputElement} */ (document.getElementById('newTaskToday'));
  const newTaskLinkActiveFile = /** @type {HTMLInputElement} */ (document.getElementById('newTaskLinkActiveFile'));
  const submitAddTaskBtn = document.getElementById('submitAddTaskBtn');
  const cancelAddTaskBtn = document.getElementById('cancelAddTaskBtn');

  // Projects Tab Elements
  const projectsGrid = document.getElementById('projectsGrid');
  const importGitHubBtn = document.getElementById('importGitHubBtn');
  const showAddProjectModalBtn = document.getElementById('showAddProjectModalBtn');
  const addProjectForm = document.getElementById('addProjectForm');
  const newProjectName = /** @type {HTMLInputElement} */ (document.getElementById('newProjectName'));
  const newProjectDesc = /** @type {HTMLTextAreaElement} */ (document.getElementById('newProjectDesc'));
  const newProjectCategory = /** @type {HTMLSelectElement} */ (document.getElementById('newProjectCategory'));
  const newProjectIcon = /** @type {HTMLSelectElement} */ (document.getElementById('newProjectIcon'));
  const colorPickerOptions = document.getElementById('colorPickerOptions');
  const submitAddProjectBtn = document.getElementById('submitAddProjectBtn');
  const cancelAddProjectBtn = document.getElementById('cancelAddProjectBtn');

  // Stats Tab Elements
  const statStreakNum = document.getElementById('statStreakNum');
  const statTodayTime = document.getElementById('statTodayTime');
  const statWeekTime = document.getElementById('statWeekTime');
  const statTotalCompleted = document.getElementById('statTotalCompleted');
  const heatmapContainer = document.getElementById('heatmapContainer');
  const categoryProgressBars = document.getElementById('categoryProgressBars');
  const projectStatsList = document.getElementById('projectStatsList');
  const sessionHistoryList = document.getElementById('sessionHistoryList');

  // Modal 1: Start Focus Modal Elements
  const startFocusModal = document.getElementById('startFocusModal');
  const closeStartFocusModalBtn = document.getElementById('closeStartFocusModalBtn');
  const modalFocusTitleInput = /** @type {HTMLInputElement} */ (document.getElementById('modalFocusTitleInput'));
  const modalDurationPills = document.querySelectorAll('#modalDurationPills .duration-pill');
  const modalCustomDurationInput = /** @type {HTMLInputElement} */ (document.getElementById('modalCustomDurationInput'));
  const modalFocusProjectSelect = /** @type {HTMLSelectElement} */ (document.getElementById('modalFocusProjectSelect'));
  const modalCreateTaskCheckbox = /** @type {HTMLInputElement} */ (document.getElementById('modalCreateTaskCheckbox'));
  const modalConfirmStartFocusBtn = document.getElementById('modalConfirmStartFocusBtn');

  // Modal 2: Add Task Modal Elements
  const addTaskModal = document.getElementById('addTaskModal');
  const closeAddTaskModalBtn = document.getElementById('closeAddTaskModalBtn');
  const modalTaskTitleInput = /** @type {HTMLInputElement} */ (document.getElementById('modalTaskTitleInput'));
  const modalTaskDescInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('modalTaskDescInput'));
  const modalTaskProjectSelect = /** @type {HTMLSelectElement} */ (document.getElementById('modalTaskProjectSelect'));
  const modalTaskPrioritySelect = /** @type {HTMLSelectElement} */ (document.getElementById('modalTaskPrioritySelect'));
  const modalTaskDurationInput = /** @type {HTMLInputElement} */ (document.getElementById('modalTaskDurationInput'));
  const modalTaskTodayCheckbox = /** @type {HTMLInputElement} */ (document.getElementById('modalTaskTodayCheckbox'));
  const modalConfirmCreateTaskBtn = document.getElementById('modalConfirmCreateTaskBtn');

  // Modal 3: GitHub Import Modal Elements
  const gitImportModal = document.getElementById('gitImportModal');
  const closeGitImportModalBtn = document.getElementById('closeGitImportModalBtn');
  const gitRepoUrlInput = /** @type {HTMLInputElement} */ (document.getElementById('gitRepoUrlInput'));
  const modalConfirmGitImportBtn = document.getElementById('modalConfirmGitImportBtn');
  const associateWorkspaceBtn = document.getElementById('associateWorkspaceBtn');

  // Settings Elements
  const exportDataBtn = document.getElementById('exportDataBtn');
  const importDataBtn = document.getElementById('importDataBtn');
  const importFileInput = /** @type {HTMLInputElement} */ (document.getElementById('importFileInput'));
  const resetDataBtn = document.getElementById('resetDataBtn');

  // --- Modal Open / Close Helpers ---
  function openStartFocusModal(presetTitle = '') {
    if (startFocusModal) {
      startFocusModal.classList.remove('hidden');
      if (modalFocusTitleInput) {
        modalFocusTitleInput.value = presetTitle;
        modalFocusTitleInput.focus();
      }
    }
  }

  function closeStartFocusModal() {
    if (startFocusModal) startFocusModal.classList.add('hidden');
  }

  function openAddTaskModal(presetTitle = '') {
    if (addTaskModal) {
      addTaskModal.classList.remove('hidden');
      if (modalTaskTitleInput) {
        modalTaskTitleInput.value = presetTitle;
        modalTaskTitleInput.focus();
      }
    }
  }

  function closeAddTaskModal() {
    if (addTaskModal) addTaskModal.classList.add('hidden');
  }

  function openGitImportModal() {
    if (gitImportModal) {
      gitImportModal.classList.remove('hidden');
      if (gitRepoUrlInput) {
        gitRepoUrlInput.value = '';
        gitRepoUrlInput.focus();
      }
    }
  }

  function closeGitImportModal() {
    if (gitImportModal) gitImportModal.classList.add('hidden');
  }

  // --- Primary Tab Switching ---
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTabId = tab.getAttribute('data-tab');
      if (targetTabId) switchTab(targetTabId);
    });
  });

  function switchTab(tabId) {
    navTabs.forEach(t => {
      if (t.getAttribute('data-tab') === tabId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === tabId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  // --- Sub Navigation Tabs in Tasks (Today / Inbox / All) ---
  subNavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      subNavTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeSubtab = tab.getAttribute('data-subtab') || 'subtabToday';
      if (tasksFilterRow) {
        tasksFilterRow.style.display = activeSubtab === 'subtabAll' ? 'grid' : 'none';
      }
      renderTasksTab();
    });
  });

  // --- Header Action Buttons ---
  if (headerStartFocusBtn) {
    headerStartFocusBtn.addEventListener('click', () => openStartFocusModal());
  }

  if (headerAddTaskBtn) {
    headerAddTaskBtn.addEventListener('click', () => openAddTaskModal());
  }

  // --- Hero Action Buttons ---
  if (heroStartFocusBtn) {
    heroStartFocusBtn.addEventListener('click', () => openStartFocusModal());
  }

  if (heroCreateTaskBtn) {
    heroCreateTaskBtn.addEventListener('click', () => openAddTaskModal());
  }

  if (tasksTabStartFocusBtn) {
    tasksTabStartFocusBtn.addEventListener('click', () => openStartFocusModal());
  }

  // --- Modal Duration Pills Handler ---
  modalDurationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      modalDurationPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = pill.getAttribute('data-mins');
      if (val === 'custom') {
        if (modalCustomDurationInput) {
          modalCustomDurationInput.classList.remove('hidden');
          modalCustomDurationInput.focus();
          modalSelectedDuration = parseInt(modalCustomDurationInput.value) || 35;
        }
      } else if (val === '0') {
        if (modalCustomDurationInput) modalCustomDurationInput.classList.add('hidden');
        modalSelectedDuration = 0;
      } else {
        if (modalCustomDurationInput) modalCustomDurationInput.classList.add('hidden');
        modalSelectedDuration = parseInt(val || '25') || 25;
      }
    });
  });

  if (modalCustomDurationInput) {
    modalCustomDurationInput.addEventListener('input', () => {
      modalSelectedDuration = parseInt(modalCustomDurationInput.value) || 35;
    });
  }

  // --- Start Focus Modal Actions ---
  if (closeStartFocusModalBtn) {
    closeStartFocusModalBtn.addEventListener('click', closeStartFocusModal);
  }

  if (modalConfirmStartFocusBtn && modalFocusTitleInput) {
    modalConfirmStartFocusBtn.addEventListener('click', () => {
      const title = modalFocusTitleInput.value.trim() || 'Focus Session';
      const projectId = modalFocusProjectSelect.value || undefined;
      const shouldCreateTask = modalCreateTaskCheckbox ? modalCreateTaskCheckbox.checked : false;

      if (shouldCreateTask) {
        vscode.postMessage({
          command: 'CREATE_TASK',
          payload: {
            title,
            projectId,
            targetDurationMinutes: modalSelectedDuration || 35,
            isToday: true
          }
        });
      }

      vscode.postMessage({
        command: 'START_SESSION',
        payload: {
          taskTitle: title,
          projectId,
          durationMinutes: modalSelectedDuration || 35
        }
      });

      closeStartFocusModal();
      switchTab('focusTab');
    });

    modalFocusTitleInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        modalConfirmStartFocusBtn.click();
      }
    });
  }

  // --- Add Task Modal Actions ---
  if (closeAddTaskModalBtn) {
    closeAddTaskModalBtn.addEventListener('click', closeAddTaskModal);
  }

  if (modalConfirmCreateTaskBtn && modalTaskTitleInput) {
    modalConfirmCreateTaskBtn.addEventListener('click', () => {
      const title = modalTaskTitleInput.value.trim();
      if (!title) return;

      const description = modalTaskDescInput ? modalTaskDescInput.value.trim() || undefined : undefined;
      const projectId = modalTaskProjectSelect ? modalTaskProjectSelect.value || undefined : undefined;
      const priority = modalTaskPrioritySelect ? modalTaskPrioritySelect.value || 'Medium' : 'Medium';
      const targetDurationMinutes = modalTaskDurationInput ? parseInt(modalTaskDurationInput.value) || 35 : 35;
      const isToday = modalTaskTodayCheckbox ? modalTaskTodayCheckbox.checked : true;

      vscode.postMessage({
        command: 'CREATE_TASK',
        payload: {
          title,
          description,
          projectId,
          priority,
          targetDurationMinutes,
          isToday,
          isInbox: false
        }
      });

      closeAddTaskModal();
    });

    modalTaskTitleInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        modalConfirmCreateTaskBtn.click();
      }
    });
  }

  // --- GitHub Import Modal Actions ---
  if (importGitHubBtn) {
    importGitHubBtn.addEventListener('click', openGitImportModal);
  }

  if (closeGitImportModalBtn) {
    closeGitImportModalBtn.addEventListener('click', closeGitImportModal);
  }

  if (modalConfirmGitImportBtn && gitRepoUrlInput) {
    modalConfirmGitImportBtn.addEventListener('click', () => {
      const repoUrl = gitRepoUrlInput.value.trim();
      if (!repoUrl) return;

      vscode.postMessage({
        command: 'IMPORT_GITHUB_REPO',
        payload: { repoUrl }
      });
      closeGitImportModal();
    });

    gitRepoUrlInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        modalConfirmGitImportBtn.click();
      }
    });
  }

  if (associateWorkspaceBtn) {
    associateWorkspaceBtn.addEventListener('click', () => {
      vscode.postMessage({ command: 'ASSOCIATE_WORKSPACE_REPO' });
      if (settingsModal) settingsModal.classList.add('hidden');
    });
  }

  // --- Active Session Controls ---
  if (pauseResumeBtn) {
    pauseResumeBtn.addEventListener('click', () => {
      if (!appState.activeSession) return;
      if (appState.activeSession.state === 'ACTIVE') {
        vscode.postMessage({ command: 'PAUSE_SESSION' });
      } else if (appState.activeSession.state === 'PAUSED') {
        vscode.postMessage({ command: 'RESUME_SESSION' });
      }
    });
  }

  if (addFiveMinsBtn) {
    addFiveMinsBtn.addEventListener('click', () => {
      vscode.postMessage({ command: 'ADD_EXTRA_TIME', payload: { minutes: 5 } });
    });
  }

  if (finishSuccessBtn) {
    finishSuccessBtn.addEventListener('click', () => {
      vscode.postMessage({
        command: 'FINISH_SESSION',
        payload: { markCompleted: false }
      });
    });
  }

  if (finishAndCompleteTaskBtn) {
    finishAndCompleteTaskBtn.addEventListener('click', () => {
      vscode.postMessage({
        command: 'FINISH_SESSION',
        payload: { markCompleted: true }
      });
    });
  }

  if (cancelSessionBtn) {
    cancelSessionBtn.addEventListener('click', () => {
      vscode.postMessage({ command: 'CANCEL_SESSION' });
    });
  }

  // --- Frictionless Quick Inbox Capture ---
  function handleQuickInboxSubmit() {
    if (!quickInboxInput) return;
    const title = quickInboxInput.value.trim();
    if (!title) return;
    vscode.postMessage({
      command: 'QUICK_INBOX_ADD',
      payload: { title }
    });
    quickInboxInput.value = '';
  }

  if (quickInboxAddBtn) {
    quickInboxAddBtn.addEventListener('click', handleQuickInboxSubmit);
  }

  if (quickInboxInput) {
    quickInboxInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        handleQuickInboxSubmit();
      }
    });
  }

  // --- Detailed Task Form (Collapsible in Tasks tab) ---
  if (showDetailedTaskFormBtn && addTaskForm) {
    showDetailedTaskFormBtn.addEventListener('click', () => {
      openAddTaskModal();
    });
  }

  if (cancelAddTaskBtn && addTaskForm) {
    cancelAddTaskBtn.addEventListener('click', () => {
      addTaskForm.classList.add('hidden');
    });
  }

  if (submitAddTaskBtn && newTaskTitle) {
    submitAddTaskBtn.addEventListener('click', () => {
      const title = newTaskTitle.value.trim();
      if (!title) return;

      const projectId = newTaskProject.value || undefined;
      const category = newTaskCategory.value || 'Personal Project';
      const priority = newTaskPriority.value || 'Medium';
      const targetDurationMinutes = parseInt(newTaskDuration.value) || 35;
      const isToday = newTaskToday.checked;
      const linkActiveFile = newTaskLinkActiveFile.checked;
      const description = newTaskDesc.value.trim() || undefined;

      vscode.postMessage({
        command: 'CREATE_TASK',
        payload: {
          title,
          description,
          projectId,
          category,
          priority,
          targetDurationMinutes,
          isToday,
          isInbox: false,
          linkActiveFile
        }
      });

      newTaskTitle.value = '';
      newTaskDesc.value = '';
      if (addTaskForm) addTaskForm.classList.add('hidden');
    });
  }

  // Filter Listeners
  [taskSearchInput, taskProjectFilterSelect, taskPriorityFilterSelect, taskStatusFilterSelect].forEach(el => {
    if (el) {
      el.addEventListener('input', renderTasksTab);
      el.addEventListener('change', renderTasksTab);
    }
  });

  // --- Projects Form ---
  if (showAddProjectModalBtn && addProjectForm) {
    showAddProjectModalBtn.addEventListener('click', () => {
      addProjectForm.classList.toggle('hidden');
      if (!addProjectForm.classList.contains('hidden') && newProjectName) {
        newProjectName.focus();
      }
    });
  }

  if (cancelAddProjectBtn && addProjectForm) {
    cancelAddProjectBtn.addEventListener('click', () => {
      addProjectForm.classList.add('hidden');
    });
  }

  if (submitAddProjectBtn && newProjectName) {
    submitAddProjectBtn.addEventListener('click', () => {
      const name = newProjectName.value.trim();
      if (!name) return;

      const description = newProjectDesc.value.trim() || undefined;
      const category = newProjectCategory.value || 'Personal Project';
      const icon = newProjectIcon.value || '🚀';

      vscode.postMessage({
        command: 'CREATE_PROJECT',
        payload: { name, description, category, icon, color: '' }
      });

      newProjectName.value = '';
      newProjectDesc.value = '';
      if (addProjectForm) addProjectForm.classList.add('hidden');
    });
  }

  // --- Settings Modal Toggle ---
  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.remove('hidden');
    });
  }

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      vscode.postMessage({ command: 'REFRESH_ALL' });
    });
  }

  // Settings Actions
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
      vscode.postMessage({ command: 'EXPORT_DATA' });
    });
  }

  if (importDataBtn && importFileInput) {
    importDataBtn.addEventListener('click', () => {
      importFileInput.click();
    });

    importFileInput.addEventListener('change', () => {
      const file = importFileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = evt => {
          const content = evt.target?.result;
          if (typeof content === 'string') {
            vscode.postMessage({
              command: 'IMPORT_DATA',
              payload: { jsonContent: content }
            });
          }
        };
        reader.readAsText(file);
      }
    });
  }

  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', () => {
      vscode.postMessage({ command: 'RESET_DATA' });
    });
  }

  // --- Message Listener from Host ---
  window.addEventListener('message', event => {
    const message = event.data;
    switch (message.type) {
      case 'STATE_UPDATE':
        appState = message.payload;
        renderAll();
        break;

      case 'SESSION_TICK':
        handleSessionTick(message.payload);
        break;
    }
  });

  function handleSessionTick(payload) {
    const { session, remainingMs, elapsedMs, progressPercent } = payload;
    appState.activeSession = session;

    if (timerClock) {
      if (session.targetDurationMinutes === 0) {
        // Open-ended stopwatch mode: count up elapsed time
        const totalSec = Math.floor((elapsedMs || 0) / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        timerClock.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      } else {
        // Countdown timer mode
        const totalSec = Math.floor(remainingMs / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        timerClock.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }

    if (sessionTimeProgressFill) {
      if (session.targetDurationMinutes === 0) {
        sessionTimeProgressFill.style.width = '100%';
      } else {
        sessionTimeProgressFill.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
      }
    }

    if (timerStatusSubtext) {
      if (session.state === 'PAUSED') {
        timerStatusSubtext.textContent = '⏸ Focus Paused';
      } else if (session.targetDurationMinutes === 0) {
        timerStatusSubtext.textContent = '⏱ Open-ended Focus Time';
      } else {
        timerStatusSubtext.textContent = '🎯 Active Focus Time';
      }
    }
  }

  // --- Render Orchestrator ---
  function renderAll() {
    populateDropdowns();
    renderFocusTab();
    renderTodayQueue();
    renderTasksTab();
    renderProjectsTab();
    renderStatsTab();
  }

  function populateDropdowns() {
    const projectSelects = [modalFocusProjectSelect, modalTaskProjectSelect, newTaskProject, taskProjectFilterSelect];
    projectSelects.forEach(sel => {
      if (!sel) return;
      const curVal = sel.value;
      const isFilter = sel === taskProjectFilterSelect;
      sel.innerHTML = isFilter ? '<option value="">All Projects</option>' : '<option value="">No Project (Standalone)</option>';

      (appState.allProjects || []).forEach(proj => {
        const opt = document.createElement('option');
        opt.value = proj.id;
        opt.textContent = `${proj.icon} ${proj.name}`;
        sel.appendChild(opt);
      });
      if (curVal) sel.value = curVal;
    });

    const categorySelects = [newTaskCategory, newProjectCategory];
    categorySelects.forEach(sel => {
      if (!sel) return;
      const curVal = sel.value;
      sel.innerHTML = '';
      (appState.categories || []).forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        sel.appendChild(opt);
      });
      if (curVal) sel.value = curVal;
    });
  }

  function renderFocusTab() {
    const session = appState.activeSession;

    if (session && (session.state === 'ACTIVE' || session.state === 'PAUSED')) {
      if (focusActiveContainer) focusActiveContainer.classList.remove('hidden');
      if (focusIdleContainer) focusIdleContainer.classList.add('hidden');

      if (activeTaskTitle) activeTaskTitle.textContent = session.taskTitle;
      if (activeProjectBadge) {
        activeProjectBadge.textContent = session.projectName || 'Standalone';
        activeProjectBadge.style.display = session.projectName ? 'inline-flex' : 'none';
      }
      if (activeCategoryBadge) {
        activeCategoryBadge.textContent = session.category || 'Focus';
      }

      // Check if project has git branch
      const proj = (appState.allProjects || []).find(p => p.id === session.projectId);
      if (activeGitBadge) {
        if (proj && proj.gitBranch) {
          activeGitBadge.textContent = `🐙 ${proj.gitBranch}`;
          activeGitBadge.classList.remove('hidden');
        } else {
          activeGitBadge.classList.add('hidden');
        }
      }

      if (pauseResumeBtn) {
        pauseResumeBtn.textContent = session.state === 'PAUSED' ? '▶ Resume' : '⏸ Pause';
        pauseResumeBtn.className = session.state === 'PAUSED' ? 'btn btn-primary' : 'btn btn-secondary';
      }

      if (finishAndCompleteTaskBtn) {
        finishAndCompleteTaskBtn.style.display = session.taskId ? 'inline-flex' : 'none';
      }
    } else {
      if (focusActiveContainer) focusActiveContainer.classList.add('hidden');
      if (focusIdleContainer) focusIdleContainer.classList.remove('hidden');
    }
  }

  function renderTodayQueue() {
    if (!todayQueueList) return;
    todayQueueList.innerHTML = '';

    const tasks = (appState.todayTasks || []).filter(t => t.status !== 'COMPLETED');
    if (todayQueueCount) todayQueueCount.textContent = `${tasks.length} tasks`;

    if (tasks.length === 0) {
      todayQueueList.innerHTML = `
        <div class="empty-state-card">
          <p class="empty-text">No tasks planned for today.</p>
          <p class="empty-subtext">Add something you want to work on, or start a focus session directly.</p>
          <div class="empty-actions">
            <button class="btn btn-primary btn-sm open-focus-modal-action">▶ Start Focus</button>
            <button class="btn btn-secondary btn-sm open-task-modal-action">+ Add Task</button>
          </div>
        </div>
      `;

      todayQueueList.querySelectorAll('.open-focus-modal-action').forEach(b => {
        b.addEventListener('click', () => openStartFocusModal());
      });
      todayQueueList.querySelectorAll('.open-task-modal-action').forEach(b => {
        b.addEventListener('click', () => openAddTaskModal());
      });
      return;
    }

    tasks.forEach(task => {
      const card = createTaskCard(task, true);
      todayQueueList.appendChild(card);
    });
  }

  function renderTasksTab() {
    if (!allTaskList) return;
    allTaskList.innerHTML = '';

    const inboxCount = (appState.inboxTasks || []).length;
    if (inboxCountBadge) inboxCountBadge.textContent = String(inboxCount);

    let targetTasks = [];
    if (activeSubtab === 'subtabToday') {
      targetTasks = appState.todayTasks || [];
    } else if (activeSubtab === 'subtabInbox') {
      targetTasks = appState.inboxTasks || [];
    } else {
      targetTasks = (appState.allTasks || []).filter(t => !t.isInbox);
    }

    const query = taskSearchInput ? taskSearchInput.value.toLowerCase().trim() : '';
    const projFilter = taskProjectFilterSelect ? taskProjectFilterSelect.value : '';
    const prioFilter = taskPriorityFilterSelect ? taskPriorityFilterSelect.value : '';
    const statusFilter = taskStatusFilterSelect ? taskStatusFilterSelect.value : '';

    const filtered = targetTasks.filter(task => {
      if (query && !task.title.toLowerCase().includes(query) && !(task.description || '').toLowerCase().includes(query)) {
        return false;
      }
      if (activeSubtab === 'subtabAll') {
        if (projFilter && task.projectId !== projFilter) return false;
        if (prioFilter && task.priority !== prioFilter) return false;
        if (statusFilter && task.status !== statusFilter) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      let emptyTitle = 'No tasks found';
      let emptySub = 'Add a new task or start focusing immediately.';
      if (activeSubtab === 'subtabInbox') {
        emptyTitle = 'Your Inbox is empty!';
        emptySub = 'Capture quick thoughts or tasks above.';
      } else if (activeSubtab === 'subtabToday') {
        emptyTitle = 'No tasks planned for today.';
        emptySub = 'Add something you want to work on today.';
      }

      allTaskList.innerHTML = `
        <div class="empty-state-card">
          <p class="empty-text">${emptyTitle}</p>
          <p class="empty-subtext">${emptySub}</p>
          <div class="empty-actions">
            <button class="btn btn-primary btn-sm open-focus-modal-action">▶ Start Focus</button>
            <button class="btn btn-secondary btn-sm open-task-modal-action">+ Add Task</button>
          </div>
        </div>
      `;

      allTaskList.querySelectorAll('.open-focus-modal-action').forEach(b => {
        b.addEventListener('click', () => openStartFocusModal());
      });
      allTaskList.querySelectorAll('.open-task-modal-action').forEach(b => {
        b.addEventListener('click', () => openAddTaskModal());
      });
      return;
    }

    filtered.forEach(task => {
      const card = createTaskCard(task, false, activeSubtab === 'subtabInbox');
      allTaskList.appendChild(card);
    });
  }

  function createTaskCard(task, isCompact = false, isInboxItem = false) {
    const card = document.createElement('div');
    const isDone = task.status === 'COMPLETED';
    card.className = `task-card ${isDone ? 'completed' : ''}`;

    const proj = (appState.allProjects || []).find(p => p.id === task.projectId);
    const projName = proj ? proj.name : 'Standalone';
    const totalTimeMins = Math.round((task.totalTimeSpentMs || 0) / 60000);

    card.innerHTML = `
      <div class="task-card-header">
        <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''} title="Toggle Complete">
        <div class="task-card-body">
          <div class="task-card-title">${escapeHtml(task.title)}</div>
          ${task.description ? `<div class="task-card-desc">${escapeHtml(task.description)}</div>` : ''}
          
          <div class="task-card-meta">
            ${proj ? `<span class="badge project-badge">${proj.icon} ${escapeHtml(projName)}</span>` : ''}
            <span class="badge priority-badge ${task.priority}">${task.priority}</span>
            <span class="timer-subtext">⏱ ${task.targetDurationMinutes}m</span>
            ${totalTimeMins > 0 ? `<span class="timer-subtext">⚡ ${totalTimeMins}m focused</span>` : ''}
            ${task.linkedFilePath ? `<span title="File: ${escapeHtml(task.linkedFilePath)}" class="open-file-link badge" style="cursor:pointer;">📄 File</span>` : ''}
          </div>
        </div>
      </div>

      <div class="task-card-actions">
        ${isInboxItem ? `<button class="btn btn-secondary btn-sm move-today-btn">⭐ Add to Today</button>` : ''}
        ${!isDone ? `<button class="btn btn-primary btn-sm start-btn">▶ Focus</button>` : ''}
        ${!isCompact ? `<button class="icon-btn delete-btn" title="Delete Task">🗑</button>` : ''}
      </div>
    `;

    const chk = card.querySelector('.task-checkbox');
    if (chk) {
      chk.addEventListener('change', () => {
        vscode.postMessage({
          command: 'TOGGLE_TASK_COMPLETE',
          payload: { taskId: task.id }
        });
      });
    }

    const moveTodayBtn = card.querySelector('.move-today-btn');
    if (moveTodayBtn) {
      moveTodayBtn.addEventListener('click', () => {
        vscode.postMessage({
          command: 'MOVE_TO_TODAY',
          payload: { taskId: task.id }
        });
      });
    }

    const startBtn = card.querySelector('.start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        vscode.postMessage({
          command: 'START_SESSION',
          payload: { taskId: task.id }
        });
        switchTab('focusTab');
      });
    }

    const delBtn = card.querySelector('.delete-btn');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        vscode.postMessage({
          command: 'DELETE_TASK',
          payload: { taskId: task.id }
        });
      });
    }

    const fileLink = card.querySelector('.open-file-link');
    if (fileLink && task.linkedFilePath) {
      fileLink.addEventListener('click', () => {
        vscode.postMessage({
          command: 'OPEN_LINKED_FILE',
          payload: { filePath: task.linkedFilePath }
        });
      });
    }

    return card;
  }

  function renderProjectsTab() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    const projects = appState.allProjects || [];
    if (projects.length === 0) {
      projectsGrid.innerHTML = `
        <div class="empty-state-card">
          <p class="empty-text">No projects created yet.</p>
          <p class="empty-subtext">Projects help you organize related tasks, connect Git repositories, and track focus time.</p>
          <div class="empty-actions">
            <button class="btn btn-secondary btn-sm" id="emptyImportGitHubBtn">🐙 Import GitHub</button>
            <button class="btn btn-primary btn-sm" id="emptyAddProjectBtn">+ New Project</button>
          </div>
        </div>
      `;
      const btn = document.getElementById('emptyAddProjectBtn');
      if (btn && addProjectForm) {
        btn.addEventListener('click', () => {
          addProjectForm.classList.remove('hidden');
          if (newProjectName) newProjectName.focus();
        });
      }
      const gitBtn = document.getElementById('emptyImportGitHubBtn');
      if (gitBtn) {
        gitBtn.addEventListener('click', openGitImportModal);
      }
      return;
    }

    projects.forEach(proj => {
      const projTasks = (appState.allTasks || []).filter(t => t.projectId === proj.id && !t.isInbox);
      const completedCount = projTasks.filter(t => t.status === 'COMPLETED').length;
      const totalCount = projTasks.length;
      const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-card-header">
          <span class="project-icon-badge">${proj.icon}</span>
          <div class="project-name">${escapeHtml(proj.name)}</div>
          <span class="project-stats-pill">${completedCount}/${totalCount}</span>
        </div>
        ${proj.description ? `<p class="task-card-desc" style="margin-bottom:6px;">${escapeHtml(proj.description)}</p>` : ''}
        
        ${proj.gitBranch || proj.repositoryUrl ? `
          <div class="project-git-row">
            <span>🐙 ${escapeHtml(proj.gitBranch || 'connected')}</span>
            ${proj.localPath ? `<button class="icon-btn open-proj-folder-btn" title="Open Folder in VS Code" style="font-size:10px;">📂 Open</button>` : ''}
          </div>
        ` : ''}

        <div class="progress-bar-track" style="margin-bottom: 6px;">
          <div class="progress-bar-fill" style="width: ${pct}%;"></div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;" class="timer-subtext">
          <span>${escapeHtml(proj.category)}</span>
          <button class="icon-btn delete-proj-btn" title="Delete Project">🗑</button>
        </div>
      `;

      const openFolderBtn = card.querySelector('.open-proj-folder-btn');
      if (openFolderBtn && proj.localPath) {
        openFolderBtn.addEventListener('click', () => {
          vscode.postMessage({
            command: 'OPEN_PROJECT_FOLDER',
            payload: { localPath: proj.localPath }
          });
        });
      }

      const delBtn = card.querySelector('.delete-proj-btn');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          vscode.postMessage({
            command: 'DELETE_PROJECT',
            payload: { projectId: proj.id }
          });
        });
      }

      projectsGrid.appendChild(card);
    });
  }

  function renderStatsTab() {
    const db = appState.dashboard;
    if (!db) return;

    if (statStreakNum) statStreakNum.textContent = String(db.streak.currentStreak || 0);
    if (statTodayTime) statTodayTime.textContent = `${db.todayStats.focusMinutes || 0}m`;
    if (statWeekTime) statWeekTime.textContent = `${Math.round((db.periodStats.thisWeekMinutes || 0) / 60)}h ${(db.periodStats.thisWeekMinutes || 0) % 60}m`;
    if (statTotalCompleted) statTotalCompleted.textContent = String(db.periodStats.totalCompletedTasks || 0);

    // 52-Week GitHub Heatmap Grid
    if (heatmapContainer && db.heatmap) {
      heatmapContainer.innerHTML = '';
      db.heatmap.forEach(day => {
        const cell = document.createElement('div');
        cell.className = `heatmap-cell level-${day.level}`;
        cell.title = `${day.date}: ${day.count} mins focused`;
        heatmapContainer.appendChild(cell);
      });
    }

    // Category Distribution Bars
    if (categoryProgressBars) {
      categoryProgressBars.innerHTML = '';
      const cats = db.categoryDistribution || [];
      if (cats.length === 0) {
        categoryProgressBars.innerHTML = '<div class="timer-subtext" style="padding:4px 0;">No category activity recorded yet.</div>';
      } else {
        cats.forEach(cat => {
          const row = document.createElement('div');
          row.className = 'category-row';
          row.innerHTML = `
            <div class="category-label-row">
              <span>${escapeHtml(cat.category)}</span>
              <span class="timer-subtext">${cat.minutes}m (${cat.percentage}%)</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${cat.percentage}%;"></div>
            </div>
          `;
          categoryProgressBars.appendChild(row);
        });
      }
    }

    // Project Stats
    if (projectStatsList) {
      projectStatsList.innerHTML = '';
      const projs = db.projectBreakdown || [];
      if (projs.length === 0) {
        projectStatsList.innerHTML = '<div class="timer-subtext" style="padding:4px 0;">No projects created yet.</div>';
      } else {
        projs.forEach(proj => {
          const div = document.createElement('div');
          div.className = 'history-item';
          div.innerHTML = `
            <div style="display:flex;align-items:center;gap:6px;">
              <span>${proj.icon}</span>
              <strong>${escapeHtml(proj.projectName)}</strong>
            </div>
            <div class="timer-subtext">
              ${proj.minutes}m · ${proj.completedTasksCount}/${proj.tasksCount} done
            </div>
          `;
          projectStatsList.appendChild(div);
        });
      }
    }

    // Session History
    if (sessionHistoryList) {
      sessionHistoryList.innerHTML = '';
      const sessions = db.recentSessions || [];
      if (sessions.length === 0) {
        sessionHistoryList.innerHTML = `<div class="timer-subtext" style="padding:4px 0;">No completed sessions yet. Start your first session to see your activity!</div>`;
      } else {
        sessions.forEach(s => {
          const div = document.createElement('div');
          div.className = 'history-item';
          div.innerHTML = `
            <div>
              <strong>${escapeHtml(s.taskTitle)}</strong>
              ${s.projectName ? `<span class="badge" style="margin-left:4px;">${escapeHtml(s.projectName)}</span>` : ''}
              <div class="timer-subtext">${s.date} · ${escapeHtml(s.category)}</div>
            </div>
            <div style="font-weight:600;">
              ${s.durationMinutes}m ✓
            </div>
          `;
          sessionHistoryList.appendChild(div);
        });
      }
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
