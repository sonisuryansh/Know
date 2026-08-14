# ⚡ Developer Focus — VS Code Extension

> **A general-purpose Developer Focus & Coding Productivity workspace inside Visual Studio Code.**
> Stay inside your editor, manage your projects and tasks, start focused timers, and track your coding activity with GitHub-style heatmaps — without needing another productivity app.

---

## 🌟 What is Developer Focus?

Developer Focus answers three essential questions for every developer and student:

1. **What should I work on?** $\rightarrow$ **Projects & Tasks**
2. **How long should I focus?** $\rightarrow$ **Focus Sessions & Timer HUD**
3. **How am I doing overall?** $\rightarrow$ **Productivity Stats, Streaks & 52-Week Heatmap**

Whether you are building a personal portfolio, fixing production bugs at work, learning new technologies (like Docker or Kubernetes), reviewing code, or practicing DSA problem solving — Developer Focus supports your entire development workflow.

---

## ✨ Key Features

### 1. 🎯 Focus Sessions & Precision Timer
- Start focused study/coding sessions with clean Pomodoro/countdown timer HUD.
- Support for ad-hoc focus sessions or task-linked sessions.
- State persistence: timers survive VS Code reloads.
- Integrated status bar indicator showing real-time countdown.

### 2. 📋 Developer Task & Todo System
- Manage all your coding tasks directly inside VS Code.
- Organize tasks by **Project**, **Category**, and **Priority** (*Low*, *Medium*, *High*, *Urgent*).
- Filter by project, category, priority, status, or search query.
- Associate tasks with specific files in your workspace.

### 3. 📁 Project Management
- Group tasks and focus sessions into projects (e.g. *Personal Project*, *Company / Work*, *Learning & Study*, *Open Source*, *DSA & Algorithms*).
- Custom color coding and icons.
- Visual completion progress bars and total logged hours per project.

### 4. 📊 Coding Activity Heatmap & Analytics
- **52-Week GitHub-style Activity Heatmap**: Visual grid representing your daily coding and focus density.
- **Period Stats**: Focus time today, this week, this month, and all-time.
- **Streaks**: Maintain daily consistency with 🔥 day streak tracking.
- **Time Distribution**: Category distribution breakdown and project breakdown.
- **Session History**: Detailed audit trail of past focus sessions.

### 5. 🔒 Free & 100% Local-First
- **No Paywalls, No Subscriptions**: All features (unlimited tasks, projects, stats, heatmap, timers) are completely free.
- **Privacy First**: 100% of your data is stored locally in your VS Code environment (`globalState`).
- **Data Export & Import**: Easily backup and export your data as JSON anytime from the Settings tab.

---

## 🚀 Quick Start

1. Open the **Developer Focus** hub from the VS Code Activity Bar (lightning icon ⚡) or run `Developer Focus: Open Focus Hub in Editor Tab`.
2. Pick or add a task in the **📋 Tasks** tab, or type what you're working on in the **🎯 Focus** tab.
3. Click **▶ Start Focus** to begin your timed focus session.
4. When finished, click **✓ Finish & Log** to record your session and update your streak and activity heatmap!

---

## ⌨️ Command Palette Shortcuts (`Ctrl+Shift+P` / `Cmd+Shift+P`)

| Command | Description |
|---|---|
| `Developer Focus: Start Focus Session` | Start a timer for a task or custom focus session |
| `Developer Focus: Pause Focus Session` | Pause the active focus timer |
| `Developer Focus: Resume Focus Session` | Resume the paused focus timer |
| `Developer Focus: Finish Focus Session` | Complete and log the active focus session |
| `Developer Focus: Create New Task` | Quick add a new task with project & priority |
| `Developer Focus: Link Current File to Task` | Map the active editor document to a task |
| `Developer Focus: View Focus Hub` | Open the Developer Focus sidebar |
| `Developer Focus: View Productivity Stats & Heatmap` | Open the stats and activity dashboard |
| `Developer Focus: Open Focus Hub in Editor Tab` | Open full-width Focus Hub in an editor tab |

---

## ⚙️ Configuration Settings

Configure in VS Code Settings (`settings.json`):

```json
{
  "devFocus.defaultDurationMinutes": 35,
  "devFocus.defaultCategory": "Personal Project"
}
```

---

*Built with ❤️ for developers and students.*
