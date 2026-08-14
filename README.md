<div align="center">

# ⚡ Know
### *Developer Focus & Coding Productivity Workspace for VS Code*

[![VS Code](https://img.shields.io/badge/VS%20Code-1.80.0+-007ACC.svg?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Know-181717.svg?logo=github&logoColor=white)](https://github.com/sonisuryansh/Know)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-success.svg)](README.md#privacy--data-storage)

<p align="center">
  <b>Know</b> is an all-in-one focus and productivity workspace built directly into VS Code.<br>
  Plan tasks, run distraction-free focus timers, organize projects, import GitHub repositories, and track your daily coding activity with a 52-week heatmap — without leaving your editor.
</p>

</div>

---

## 💡 Why Know?

Developers waste valuable energy switching between code editors, browser timers, external to-do apps, and spreadsheets. Every context switch breaks your concentration.

**Know keeps you completely inside your coding flow:**
- 🚫 **No external apps:** Manage tasks and timers directly in the VS Code sidebar or editor tab.
- 🎯 **Deep Focus:** Built-in countdown and stopwatch timers with live status bar feedback.
- 📂 **Context-Aware:** Link open files directly to tasks for seamless one-click resumption.
- 📈 **Authentic Progress:** Automatic 52-week activity heatmap and day streak tracking.
- 🎨 **100% Native Theming:** Seamlessly adapts to Dark+, Light+, High Contrast, and custom themes.
- 🔒 **Private & Offline:** Zero telemetry, no cloud accounts, and 100% local machine storage.

---

## 🚀 Key Features

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ⚡ KNOW WORKSPACE                             │
├──────────────┬──────────────────┬──────────────────┬───────────────────┤
│  🎯 FOCUS    │    📋 TASKS      │   📁 PROJECTS    │    📊 STATS       │
│  • Timers    │  • Quick Inbox   │  • Git Connect   │  • 52-Wk Heatmap  │
│  • Stopwatch │  • Today's Queue │  • Folders       │  • Day Streaks    │
│  • Status Bar│  • File Links    │  • Progress      │  • Time Breakdown │
└──────────────┴──────────────────┴──────────────────┴───────────────────┘
```

### 1. 🎯 Smart Focus Timers
- **Presets & Custom Durations:** Select standard intervals (`25m`, `45m`, `60m`, `90m`), enter custom minutes, or switch to open-ended stopwatch mode (`No timer`).
- **In-Session Controls:** Pause, resume, extend by `+5m`, or finish sessions with summary notes.
- **Status Bar Integration:** Shows real-time countdown or elapsed time right on your status bar (`$(clock) 24:35`).

### 2. 📋 Frictionless Task Management
- **Instant Quick Capture:** Type ideas or tasks in the quick bar and press `Enter` to save to your Inbox without interrupting work.
- **Today's Focus Queue:** Select what you want to achieve today and work through them sequentially.
- **Priorities & Metadata:** Tag tasks with `Low`, `Medium`, `High`, or `Urgent`, assign estimated minutes, and set categories.
- **Active Editor File Linking:** Link open files to tasks (`📄 File`). Click the badge to jump straight back to that file anytime.

### 3. 📁 Project Organization
- **Group by Scope:** Organize tasks by project (e.g. *Personal Apps*, *Company Work*, *Open Source*, *Learning*).
- **Workspace Navigation:** Connect local project folders and open workspaces in VS Code with a single click.

### 4. 🐙 GitHub & Git Repository Integration
- **Direct GitHub Clone:** Import repositories via HTTPS, SSH, or `owner/repo` short syntax.
- **Collision Safety:** Automatically inspects target folders to prevent overwriting existing files.
- **Branch Detection:** Auto-detects Git branches and remotes in your active workspace.

### 5. 📊 52-Week Activity Heatmap & Streaks
- **GitHub-Style Heatmap:** Visual grid displaying your daily focus time across the past 365 days.
- **Productivity Metrics:** Tracks current day streak, daily focus minutes, weekly totals, and completed tasks.
- **Category & Project Breakdowns:** Understand exactly where your development time goes.

---

## 🏁 Getting Started

1. **Open Know:** Click the ⚡ **Know** icon on your VS Code Activity Bar, or press `Ctrl+Shift+P` / `Cmd+Shift+P` and type `Developer Focus: View Focus Hub`.
2. **Start a Session:**
   - Click **▶ Start Focus** on the hero banner for an immediate ad-hoc timer.
   - Or click **+ Add Task** to add an item to Today's queue.
3. **Code in Flow:** Work in your editor while Know monitors focus duration in your status bar.
4. **View Progress:** Open the **Stats** tab to review your daily streaks and 52-week activity heatmap.

---

## ⌨️ Command Palette Shortcuts

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to access all commands:

| Command | Description |
|---|---|
| `Developer Focus: Start Focus Session` | Start a custom focus session or pick an existing task |
| `Developer Focus: Quick Add Task to Inbox` | Capture a task/idea into your Inbox immediately |
| `Developer Focus: Create Task from Current File` | Create a task linked to the active editor file |
| `Developer Focus: Start Focus on This File` | Start a focus session linked to the active editor file |
| `Developer Focus: Link Current File to Task` | Link the open file to an existing task |
| `Developer Focus: Create New Task` | Open the interactive task creation wizard |
| `Developer Focus: Pause Focus Session` | Pause the active focus timer |
| `Developer Focus: Resume Focus Session` | Resume the paused focus timer |
| `Developer Focus: Finish Focus Session` | Complete and log the session with optional notes |
| `Developer Focus: Import GitHub Repository` | Clone a GitHub repository and link it as a project |
| `Developer Focus: Associate Current Workspace as Project` | Connect the current workspace Git repository |
| `Developer Focus: View Focus Hub` | Focus the sidebar panel |
| `Developer Focus: View Productivity Stats & Heatmap` | Open the productivity and statistics view |
| `Developer Focus: Open Focus Hub in Editor Tab` | Open the complete dashboard in an editor tab |

---

## ⚙️ Extension Settings

Configure Know in your VS Code Settings (`Ctrl+,` / `Cmd+,` searching for `Developer Focus`):

| Setting | Type | Default | Description |
|---|---|---|---|
| `devFocus.defaultDurationMinutes` | `number` | `35` | Default focus session target duration in minutes |
| `devFocus.defaultCategory` | `string` | `"Personal Project"` | Default category assigned to new tasks |

---

## 🔒 Privacy & Data Storage

- **100% Local:** All tasks, projects, sessions, and statistics are stored securely on your machine using VS Code's `globalState`.
- **Zero Telemetry:** No analytics, tracking, or network requests are ever made by Know.
- **Offline First:** Fully functional without an internet connection.
- **Data Portability:** Export your entire database to standard JSON or restore anytime via the Settings dialog (`⚙️`).

---

## 🛠️ Requirements

- **VS Code:** Version `1.80.0` or higher.
- **Git:** Git CLI installed on your machine (only needed if using GitHub clone or branch detection features).

---

## 🤝 Support & Feedback

- **GitHub Repository:** [https://github.com/sonisuryansh/Know](https://github.com/sonisuryansh/Know)
- **Report an Issue:** [https://github.com/sonisuryansh/Know/issues](https://github.com/sonisuryansh/Know/issues)

---

## 📄 License

This extension is open-source software licensed under the [MIT License](LICENSE).
