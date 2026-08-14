<div align="center">

# <img src="media/icon.png" width="36" height="36" valign="middle" alt="Know Logo"> Know

> **A focused developer workspace for tasks, focus sessions, projects, and coding activity inside VS Code.**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.80.0+-007ACC.svg?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Know-181717.svg?logo=github&logoColor=white)](https://github.com/sonisuryansh/Know)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-success.svg)](README.md#privacy--data-storage)

<br>

<p align="center">
  <img src="docs/screenshots/know-dashboard.png" alt="Know developer workspace dashboard" width="100%">
  <br>
  <em>Know — a focused development workspace inside VS Code.</em>
</p>

</div>

---

## 📖 What is Know?

**Know** is a developer productivity workspace integrated directly into Visual Studio Code. It keeps your daily task planning, focus timers, project organization, Git repository links, and coding activity analytics inside your editor so you can work without switching between browser tabs and external apps.

Whether you are practicing coding problems, building a personal project, or working on production codebase features, Know gives you a structured environment to decide what to work on, run deep focus sessions, and review your daily consistency.

---

## 👥 Who is Know for?

- **Students & Learners:** Set dedicated focus timers when learning new frameworks, solving programming exercises, or completing coursework.
- **Independent Developers:** Organize personal side projects, capture quick ideas into an Inbox, and track real development hours across weeks.
- **Professional Engineers:** Break large codebase tickets into actionable subtasks, link tasks directly to specific workspace files, and monitor focused execution time without external context switching.

---

## 🚀 What Can You Do With Know?

| Area | Capabilities |
|---|---|
| **🎯 Focus** | Countdown timers (`25m`, `45m`, `60m`, `90m`, custom minutes) or open-ended stopwatch mode with live status bar feedback. |
| **📋 Tasks** | Instant single-key Inbox capture, prioritized Today queue, category tagging, estimated minutes, and active editor file linking. |
| **📁 Projects** | Organize tasks by project, track completed percentages, connect local workspace folders, and launch projects in one click. |
| **🐙 GitHub** | Import and clone GitHub repositories directly, detect active Git branches, and associate workspaces without manual configuration. |
| **📊 Stats** | GitHub-style 52-week activity heatmap (365 days), daily streaks, weekly totals, category breakdowns, and session history logs. |

---

## 🔄 Core Workflow

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────┐
│ Create Task │ ──> │ Organize Project │ ──> │ Start Focus  │ ──> │ Code in Flow │ ──> │ View Stats │
│  or Capture │     │   (Optional)     │     │ Session (HUD)│     │ (Status Bar) │     │ & Heatmap  │
└─────────────┘     └──────────────────┘     └──────────────┘     └──────────────┘     └────────────┘
```

1. **Capture & Plan:** Add a task to your Inbox or choose what you want to tackle today.
2. **Assign Context (Optional):** Attach the task to a project or link it to the currently open editor file (`📄 File`).
3. **Start Focus:** Select your duration preset or start an ad-hoc session.
4. **Work in Flow:** Work in your editor while Know monitors elapsed time in your status bar (`$(flame) Know: 24:35`).
5. **Complete & Log:** Finish the session, log optional notes, and mark the task completed.
6. **Track Consistency:** Review your 52-week heatmap, daily streaks, and project time distribution.

---

## 📋 Task Management

Know provides a streamlined task manager designed specifically for coding workflows:

- **Quick Inbox Capture:** Type an idea or bug fix in the quick-input bar at the top of the Tasks tab and press `Enter` to capture it immediately without interrupting your current file.
- **Today's Focus Queue:** Select specific tasks for today's session. Keep your active working memory focused on only 3–5 high-priority items.
- **Priority Levels:** Classify tasks as `Low`, `Medium`, `High`, or `Urgent`.
- **Work Categories:** Tag tasks by activity (*Feature Implementation*, *Bug Fix & Debugging*, *Refactoring & Architecture*, *Code Review*, *Documentation*, *Testing & QA*, *DevOps & CI/CD*, *Learning & Research*, *Meeting & Planning*, *Personal Project*, *Company Work*).
- **Editor File Linking:** Attach the open file in your active editor to any task. Clicking the file badge in Know opens that exact file in your editor tab immediately.
- **Task Attempts & History:** Every completed focus session linked to a task is recorded under its attempt log with duration and notes.

---

## 📁 Project Management

Projects allow you to organize tasks and measure cumulative effort across separate repositories or initiatives:

- **Custom Colors & Icons:** Assign visual identifiers to distinguish between personal apps, open-source tools, and client codebases.
- **Progress Tracking:** Automatically displays total tasks, completed tasks, completion percentage bar, and total accumulated focus minutes.
- **Local Folder Association:** Link projects to local directory paths. Click **Open Folder** to launch that project workspace directly in VS Code.
- **Git Metadata Binding:** Displays connected Git repository URLs and active branch names.

---

## 🎯 Focus Sessions & Timers

The focus engine provides distraction-free time tracking without relying on browser timers:

- **Flexible Duration Modes:**
  - **Presets:** Standard `25m` (Pomodoro), `45m`, `60m`, and `90m` intervals.
  - **Custom Duration:** Enter any specific target duration in minutes.
  - **Stopwatch Mode (`No timer`):** Count-up stopwatch mode for exploratory research and open-ended coding sessions.
- **Active Session HUD:** Displays an active banner card in the Webview with a real-time progress bar, remaining time, elapsed time, and project context.
- **In-Session Actions:**
  - **Pause & Resume:** Pause the timer when interrupted; authoritative timestamps ensure paused time is not counted toward focus metrics.
  - **+5m Extension:** Extend your active session on the fly when you are close to finishing a feature.
  - **Finish Session:** Complete the session, enter summary notes, and choose whether to mark the task completed.
- **Status Bar Integration:** Shows real-time countdown or elapsed stopwatch time in the VS Code status bar. Clicking the status bar item reveals the Know dashboard.

---

## 🐙 GitHub & Repository Workflow

Know includes built-in Git and GitHub repository import workflows:

### 1. Import from GitHub Repository URL
- Enter any repository URL (HTTPS, SSH, or `owner/repo` short syntax like `facebook/react`).
- Select a local destination folder.
- **Automatic Safety Checks:**
  - If the destination folder already contains a cloned Git repository with the same remote URL, Know connects it without re-cloning.
  - If the destination folder contains unrelated files or a different Git remote, Know alerts you to prevent accidental overwrites.
  - If the destination is empty or a parent folder, Know clones the repository into a dedicated subfolder (`git clone <url> <dest>`).
- Automatically creates a project in Know with the repository URL, local path, and active Git branch.

### 2. Connect Current Active Workspace
- Open any existing project folder in VS Code.
- Run `Know: Associate Current Workspace as Project` or click **Connect Workspace**.
- Know automatically detects the local Git configuration, active branch, and remote URL, linking it as a Know project.

---

## 📊 Statistics & 52-Week Activity Heatmap

The statistics engine analyzes completed focus sessions to provide clear, accurate metrics:

- **52-Week Activity Heatmap:** A visual 365-day grid displaying daily focus time with GitHub-style intensity levels:
  - **Level 0:** 0 minutes
  - **Level 1:** 1 – 29 minutes
  - **Level 2:** 30 – 59 minutes
  - **Level 3:** 60 – 119 minutes
  - **Level 4:** 120+ minutes
- **Streaks:** Calculates current active streak in consecutive days and all-time longest streak.
- **Period Totals:** View total focus minutes, this week's minutes, this month's minutes, and total completed tasks.
- **Category & Project Breakdown:** Visual progress bars displaying the percentage of total development time invested in each category and project.
- **Recent Session History:** Chronological log of recent focus sessions with timestamps, durations, categories, and user notes.

---

## 🔌 VS Code Integration

- **Activity Bar Container:** Quick access via the Know icon in the primary sidebar.
- **Sidebar Webview:** Responsive dashboard tailored for sidebars.
- **Dedicated Editor Tab:** Open the full dashboard in an editor tab (`Know: Open Focus Hub in Editor Tab`) for wide multi-column views.
- **Status Bar Item:** Live session HUD and one-click access in the bottom status bar.
- **Editor & Explorer Context Menus:** Right-click any open file or folder in the Explorer to instantly create a task or start a focus session linked to that file.
- **Native VS Code Theme Support:** 100% compliant with VS Code CSS design tokens. Adapts automatically to Dark+, Light+, High Contrast, and third-party themes.

---

## ⌨️ Command Palette Shortcuts

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to access all commands:

| Command | Purpose |
|---|---|
| `Know: Start Focus Session` | Launch an interactive wizard to start a focus timer or select a task |
| `Know: Quick Add Task to Inbox` | Capture a new task directly to your Inbox from anywhere in VS Code |
| `Know: Create Task from Current File` | Create a task automatically linked to the active editor file |
| `Know: Start Focus on This File` | Start a focus session pre-populated with the active editor filename |
| `Know: Link Current File to Task` | Link the active file to an existing task in your backlog |
| `Know: Create New Task` | Open the full interactive task creation modal |
| `Know: Pause Focus Session` | Pause the active focus timer |
| `Know: Resume Focus Session` | Resume a paused focus timer |
| `Know: Finish Focus Session` | Complete the active session, log notes, and update task status |
| `Know: Import GitHub Repository` | Clone a remote GitHub repository and link it as a project |
| `Know: Associate Current Workspace as Project` | Connect the currently open VS Code workspace to Know |
| `Know: View Focus Hub` | Open and focus the Know sidebar view |
| `Know: View Productivity Stats & Heatmap` | Open the Know sidebar focused on statistics |
| `Know: Open Focus Hub in Editor Tab` | Open the complete dashboard in an editor tab |

---

## ⚙️ Configuration

Configure Know in your VS Code Settings (`Ctrl+,` / `Cmd+,` searching for `Know`):

| Setting | Type | Default | Description |
|---|---|---|---|
| `know.defaultDurationMinutes` | `number` | `35` | Default focus session target duration in minutes for new sessions. |

*(Legacy setting `devFocus.defaultDurationMinutes` is automatically recognized for backward compatibility).*

---

## 🔒 Privacy & Data Storage

- **100% Local Storage:** All tasks, projects, session logs, and statistics are stored locally on your machine via VS Code's internal `globalState` persistence.
- **Zero Telemetry & Tracking:** No personal data, code snippets, filenames, or analytics are ever collected or transmitted.
- **Offline First:** Fully functional without an internet connection (network is only used when you explicitly request a `git clone`).
- **No Account Required:** No cloud login, API keys, or registration needed.
- **Data Portability:** Export and import your complete database anytime in JSON format via the settings menu (⚙️ icon in header).

---

## 📦 Installation

### Visual Studio Marketplace
1. Open VS Code.
2. Open the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3. Search for **Know** by **sonisuryansh**.
4. Click **Install**.
5. Click the **Know** icon in your Activity Bar to open your workspace.

### Building from Source
```bash
# 1. Clone the repository
git clone https://github.com/sonisuryansh/Know.git
cd Know

# 2. Install dependencies
npm install

# 3. Compile TypeScript
npm run compile

# 4. Open in VS Code
code .

# 5. Press F5 to launch the Extension Development Host
```

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VS CODE EXTENSION HOST                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Extension Entry Point (extension.ts)                                   │
│  ├── Command Registrations (14 Commands)                                │
│  ├── Status Bar Controller (statusBarItem.ts)                           │
│  └── Context Menu & File Link Manager (fileLinkManager.ts)              │
├─────────────────────────────────────────────────────────────────────────┤
│  Core Domain Engines                                                    │
│  ├── TaskEngine       ──> Task CRUD, priorities, attempts, file links   │
│  ├── ProjectEngine    ──> Project CRUD, folder paths, Git remotes       │
│  ├── FocusEngine      ──> Timer state machine, ticks, timestamp math    │
│  ├── StatsEngine      ──> 52-wk heatmap calculation, streak tracking    │
│  └── ActivityEngine   ──> Active editor file tracking & context binding │
├─────────────────────────────────────────────────────────────────────────┤
│  Managers & Persistence Layer                                           │
│  ├── StorageManager   ──> VS Code globalState serialization & JSON I/O  │
│  ├── GitManager       ──> CLI git operations (clone, inspect, status)   │
│  └── GitImportService ──> Repository validation & collision safety      │
├─────────────────────────────────────────────────────────────────────────┤
│  Webview UI & Message Dispatcher                                        │
│  ├── SidebarViewProvider / TabPanelManager (Webview lifecycle)          │
│  ├── WebviewMessageHandler (Bi-directional JSON-RPC dispatch)           │
│  └── Frontend Assets (media/main.js & media/main.css native themes)     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
Know/
├── .vscode/                   # VS Code launch configurations and tasks
├── docs/                      # Documentation assets and screenshots
│   └── screenshots/
│       └── know-dashboard.png # Primary dashboard showcase screenshot
├── media/                     # Webview UI styling, scripts, and icons
│   ├── icon.png               # Extension marketplace icon (circular badge)
│   ├── main.css               # Native VS Code CSS variable theme styles
│   ├── main.js                # Frontend view controller & state renderer
│   └── icons/
│       ├── activity-bar-icon.svg # Vector icon for VS Code Activity Bar
│       └── know-icon.png      # High-resolution Know logo
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
├── README.md                  # Comprehensive product documentation
└── SUPPORT.md                 # Support & troubleshooting guide
```

---

## 🤝 Contributing

Contributions, feedback, and bug reports are welcome:

1. Fork the [Know Repository](https://github.com/sonisuryansh/Know).
2. Create a feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
