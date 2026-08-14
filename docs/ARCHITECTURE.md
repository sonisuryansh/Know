# Technical Architecture of Know

This document outlines the internal system architecture, data models, state machines, and message protocols of the Know VS Code extension.

---

## 🏛️ High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VS CODE EXTENSION HOST                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Extension Entry Point (src/extension.ts)                               │
│  ├── Command Registrations (14 Commands)                                │
│  ├── Status Bar Controller (src/ui/statusBarItem.ts)                    │
│  └── Context Menu & File Link Handler (src/managers/fileLinkManager.ts) │
├─────────────────────────────────────────────────────────────────────────┤
│  Core Domain Engines                                                    │
│  ├── TaskEngine       ──> Task CRUD, priorities, attempts, file links   │
│  ├── ProjectEngine    ──> Project CRUD, folder paths, Git remotes       │
│  ├── FocusEngine      ──> Timer state machine, ticks, timestamp math    │
│  ├── StatsEngine      ──> 52-wk heatmap calculation, streak tracking    │
│  └── ActivityEngine   ──> Active editor file tracking & context binding │
├─────────────────────────────────────────────────────────────────────────┤
│  Persistence & System Services                                          │
│  ├── StorageManager   ──> VS Code globalState serialization & JSON I/O  │
│  ├── GitManager       ──> CLI git operations (clone, inspect, status)   │
│  └── GitImportService ──> Repository validation & collision safety      │
├─────────────────────────────────────────────────────────────────────────┤
│  Webview UI & Bi-Directional IPC                                        │
│  ├── SidebarViewProvider / TabPanelManager (Webview lifecycle)          │
│  ├── WebviewMessageHandler (Bi-directional JSON-RPC dispatch)           │
│  └── Frontend Assets (media/main.js & media/main.css native themes)     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
Know/
├── .vscode/                   # Launch configurations and build tasks
├── docs/                      # Multi-document user & technical guides
│   ├── ARCHITECTURE.md        # Technical architecture specification
│   ├── COMMANDS.md            # Command palette & context menu reference
│   ├── CONFIGURATION.md       # Configuration settings reference
│   ├── CONTRIBUTING.md        # Development & contribution guide
│   ├── FEATURES.md            # Feature breakdown
│   ├── FOCUS-SESSIONS.md      # Focus timers & stopwatch engine
│   ├── GITHUB.md              # Git/GitHub repository cloning & safety
│   ├── PRIVACY.md             # Local-first privacy guarantees
│   ├── PROJECTS.md            # Project organization & folders
│   ├── STATISTICS.md          # 52-week activity heatmap & streaks
│   ├── TASKS.md               # Task management & file linking
│   └── screenshots/           # Documentation showcase screenshots
├── media/                     # Webview UI styling, scripts, and icons
│   ├── icon.png               # Extension marketplace icon
│   ├── main.css               # Native VS Code CSS variable theme styles
│   ├── main.js                # Frontend view controller & state renderer
│   └── icons/
│       ├── activity-bar-icon.svg # Vector icon for VS Code Activity Bar
│       └── know-icon.png      # High-resolution circular Know logo
├── src/                       # TypeScript extension source code
│   ├── constants.ts           # Work categories, priorities, and colors
│   ├── extension.ts           # Extension activation & command registry
│   ├── engines/               # Core business logic engines
│   │   ├── activityEngine.ts  # Workspace file context tracking
│   │   ├── focusEngine.ts     # Focus session timer state machine
│   │   ├── projectEngine.ts   # Project management & task rollup
│   │   ├── statsEngine.ts     # Heatmap & productivity metrics
│   │   └── taskEngine.ts      # Task queue & attempts management
│   ├── managers/              # Persistence & system services
│   │   ├── fileLinkManager.ts # Active editor file linking
│   │   ├── gitImportService.ts# GitHub import & folder safety checks
│   │   ├── gitManager.ts      # Git CLI execution & branch inspection
│   │   └── storageManager.ts  # VS Code globalState storage manager
│   ├── models/                # TypeScript interfaces and data models
│   │   ├── project.ts         # DevProject data model
│   │   ├── session.ts         # FocusSession data model
│   │   ├── stats.ts           # HeatmapDay & DashboardSummary models
│   │   └── task.ts            # DevTask & TaskAttempt models
│   ├── ui/                    # Webview providers and HTML generators
│   │   ├── sharedWebviewHtml.ts # Webview HTML template & CSP nonce
│   │   ├── sidebarViewProvider.ts # Sidebar Webview provider
│   │   ├── statusBarItem.ts   # Live timer status bar controller
│   │   ├── tabPanelManager.ts # Dedicated editor tab Webview manager
│   │   └── webviewMessageHandler.ts # IPC message dispatcher
│   └── utils/                 # Utility helper functions
│       ├── debounce.ts        # Input debounce utilities
│       ├── nonce.ts           # CSP cryptographic nonce generator
│       └── timeUtils.ts       # Date strings & duration formatters
├── CHANGELOG.md               # Version release history
├── LICENSE                    # MIT License
├── package.json               # Extension manifest & contributions
├── README.md                  # Concise Marketplace homepage
└── SUPPORT.md                 # Support & troubleshooting guide
```

---

## ⚡ Webview IPC Protocol

The Webview communicates with the extension host using asynchronous JSON messages:

| Direction | Command | Payload | Purpose |
|---|---|---|---|
| Webview $\rightarrow$ Host | `START_SESSION` | `{ durationMinutes, taskId, projectId }` | Starts a new focus timer |
| Webview $\rightarrow$ Host | `PAUSE_SESSION` | `{}` | Pauses running timer |
| Webview $\rightarrow$ Host | `RESUME_SESSION` | `{}` | Resumes paused timer |
| Webview $\rightarrow$ Host | `FINISH_SESSION` | `{ markCompleted, notes }` | Finalizes session and logs attempt |
| Webview $\rightarrow$ Host | `ADD_TASK` | `TaskCreateInput` | Creates a new task |
| Webview $\rightarrow$ Host | `TOGGLE_TASK` | `{ taskId }` | Toggles task completion |
| Webview $\rightarrow$ Host | `OPEN_FILE` | `{ filePath }` | Opens linked file in editor |
| Host $\rightarrow$ Webview | `STATE_UPDATE` | `{ tasks, projects, session, stats }` | Broadcasts complete state update |
| Host $\rightarrow$ Webview | `TICK` | `SessionTickPayload` | 1000ms timer progress tick |
