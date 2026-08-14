# Know

**Know** is a focused developer workspace built directly into VS Code for organizing projects, managing tasks, running distraction-free focus sessions, and tracking coding activity over time.

---

## Why Know?

Developers often switch between code editors, external to-do apps, web timers, and time-tracking spreadsheets. Context switching breaks flow and scatters project history across multiple apps.

**Know brings the entire focus and productivity loop inside VS Code:**
- **Stay in your flow:** Plan tasks, start timers, and associate files without leaving your editor.
- **Track genuine progress:** Log focused development time and monitor day streaks with a 52-week activity heatmap.
- **Native VS Code feel:** 100% theme-adaptive UI that automatically matches any dark, light, or high-contrast theme.
- **100% Local & Private:** All data resides on your machine with zero tracking, zero external telemetry, and offline backup capabilities.

---

## Features

### 🎯 1. Focus Sessions & Smart Timer
- **Preset & Custom Timers:** Launch focus sessions with standard presets (25m, 45m, 60m, 90m), custom minute inputs, or an open-ended stopwatch timer.
- **Task & Project Attachment:** Focus on specific tasks or start an ad-hoc session immediately.
- **Live Status Bar:** Displays real-time remaining or elapsed time right in your VS Code status bar (`$(clock) 24:35`).
- **In-Session Controls:** Pause, resume, extend by +5 minutes, cancel, or complete sessions with optional summary notes.

### 📋 2. Task Management & Frictionless Inbox
- **Quick Inbox Capture:** Type an idea in the quick input bar and hit `Enter` to instantly save thoughts without breaking your focus.
- **Today's Focus Queue:** Curate what you intend to accomplish today.
- **Task Attributes:** Assign priorities (`Low`, `Medium`, `High`, `Urgent`), categories, estimated durations, and optional notes.
- **Context-Aware File Linking:** Link the currently active workspace file directly to any task. Clicking `📄 File` re-opens that file in the editor.

### 📁 3. Projects & Workspaces
- **Organize by Scope:** Group tasks under custom projects (e.g. personal apps, client work, open-source repos, learning).
- **Progress Tracking:** Live completion bars indicating completed versus total tasks per project.
- **Workspace Connection:** Associate projects with local folders and open project workspaces in one click.

### 🐙 4. GitHub & Git Integration
- **Import GitHub Repositories:** Clone repositories directly via HTTPS, SSH, or `owner/repo` short syntax into a chosen folder.
- **Workspace Auto-Detection:** Detects Git remotes and active branches from your open VS Code workspace.
- **Safe Operations:** Checks target folders to prevent accidental overwrites and provides clear error diagnostics if network or clone operations fail.

### 📊 5. Statistics & 52-Week Activity Heatmap
- **52-Week Activity Heatmap:** GitHub-style coding activity grid visualizing daily focus time across the past 365 days.
- **Metrics at a Glance:**
  - **Day Streak:** Current consecutive days active.
  - **Today's Focus:** Minutes focused today.
  - **This Week:** Aggregate focus hours and minutes.
  - **Tasks Completed:** Total completed tasks count.
- **Category & Project Breakdown:** Percentage and minute rollups of time spent per category and project.
- **Session History:** Log of recent completed sessions with durations, dates, and notes.

---

## Getting Started

1. **Open Know:** Click the ⚡ **Know / Developer Focus** icon in the Activity Bar or press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and run `Developer Focus: View Focus Hub`.
2. **Start Immediately:**
   - Click **▶ Start Focus** on the Focus screen for an ad-hoc session.
   - Or click **+ Add Task** to add an item to Today's queue.
3. **Work with Focus:** Keep VS Code open and work normally. The status bar keeps track of your session.
4. **Review Progress:** Switch to the **Stats** tab to inspect your activity heatmap and daily streaks.

---

## GitHub Repository Setup

To initialize a project from GitHub:
1. Open the **Projects** tab and click **🐙 Import GitHub** (or run `Developer Focus: Import GitHub Repository` from the Command Palette).
2. Enter the repository URL (e.g. `https://github.com/username/repository.git` or `username/repository`).
3. Select a destination folder on your machine.
4. Know checks whether the folder is empty or contains an existing repository.
5. Upon cloning, Know associates the project, detects the default branch, and offers to open the workspace.

---

## Commands

Access all actions from the VS Code Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---|---|
| `Developer Focus: Start Focus Session` | Select an existing task or start a custom focus session |
| `Developer Focus: Quick Add Task to Inbox` | Quickly capture a thought or task into your Inbox |
| `Developer Focus: Create Task from Current File` | Creates a task pre-linked to the active editor file |
| `Developer Focus: Start Focus on This File` | Immediately starts a focus session linked to the active file |
| `Developer Focus: Link Current File to Task` | Links the active editor file to an existing task |
| `Developer Focus: Create New Task` | Opens the interactive task creation wizard |
| `Developer Focus: Pause Focus Session` | Pauses the currently active timer |
| `Developer Focus: Resume Focus Session` | Resumes the paused timer |
| `Developer Focus: Finish Focus Session` | Finishes and logs the session, with option to mark task complete |
| `Developer Focus: Import GitHub Repository` | Clones and connects a GitHub repository as a project |
| `Developer Focus: Associate Current Workspace as Project` | Detects workspace Git details and creates a project |
| `Developer Focus: View Focus Hub` | Focuses the sidebar view |
| `Developer Focus: View Productivity Stats & Heatmap` | Opens the stats and productivity view |
| `Developer Focus: Open Focus Hub in Editor Tab` | Opens the full Focus dashboard in a main editor tab |

---

## Settings

Configure preferences in VS Code Settings (`Ctrl+,` / `Cmd+,` searching for `Developer Focus`):

| Setting | Type | Default | Description |
|---|---|---|---|
| `devFocus.defaultDurationMinutes` | `number` | `35` | Default focus session target duration in minutes. |
| `devFocus.defaultCategory` | `string` | `"Personal Project"` | Default category assigned to new tasks. |

---

## Privacy & Data Storage

- **100% Local Storage:** All tasks, projects, sessions, and statistics are stored locally using VS Code's `ExtensionContext.globalState`.
- **No Telemetry / No Tracking:** Know does not collect, transmit, or monetize any analytics, metrics, or personal data.
- **No Cloud Dependencies:** Works completely offline without requiring any user account or third-party service.
- **Backup & Portability:** Export your entire dataset to a single standard JSON file or restore anytime via the Settings dialog (`⚙️`).

---

## Requirements

- **VS Code:** Version `1.80.0` or higher.
- **Git:** Git CLI installed and available in your system path (only required if using Git repository import / branch detection features).

---

## Troubleshooting

- **Git Clone Issues:** Ensure Git is installed and that you have read/write access to private repositories via your local SSH keys or Git credential manager.
- **Non-Empty Folder Warning:** When cloning a repository, choose an empty directory or select the parent folder to prevent file collision.
- **File Link Re-opening:** Ensure workspace files have been saved to disk so that Know can resolve their absolute paths.

---

## Support & Feedback

- **GitHub Repository:** [https://github.com/sonisuryansh/Know](https://github.com/sonisuryansh/Know)
- **Issue Tracker:** [https://github.com/sonisuryansh/Know/issues](https://github.com/sonisuryansh/Know/issues)

---

## License

This project is licensed under the [MIT License](LICENSE).
