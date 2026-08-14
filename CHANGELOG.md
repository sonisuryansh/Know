# Change Log

All notable changes to the "Know" extension will be documented in this file.

## [1.0.0] - 2026-08-14

### Initial Production Release
- **Focus Sessions & Timer Engine**:
  - Countdown timer with 25m, 45m, 60m, 90m presets, custom duration, and open-ended stopwatch mode.
  - Active session HUD with pause, resume, +5m time extension, and completion logging.
  - Live status bar timer integration with automatic workspace context detection.
- **Task & Inbox Management**:
  - Instant quick-capture Inbox with single-key submission.
  - Curated Today's Focus queue.
  - Task prioritization (`Low`, `Medium`, `High`, `Urgent`), categories, and estimated duration.
  - Context-aware active editor file linking (`📄 File`).
- **Project Workspaces**:
  - Project organization with custom icons and categories.
  - Workspace folder binding and one-click folder opening.
- **GitHub & Git Integration**:
  - Clone GitHub repositories directly via HTTPS, SSH, or `owner/repo` short syntax.
  - Active branch and remote detection.
  - Safe folder validation to prevent accidental overwrites.
- **Analytics & 52-Week Activity Heatmap**:
  - GitHub-style 52-week activity heatmap calculating daily focus time.
  - Day streaks, today's focus time, weekly totals, and completed tasks counter.
  - Time breakdown by category and project.
  - Recent session history log.
- **Native VS Code Theming**:
  - 100% theme-adaptive styling adhering strictly to VS Code CSS variables for Dark+, Light+, and High Contrast themes.
- **Data Privacy & Backup**:
  - 100% local storage via VS Code `globalState`.
  - JSON export and import capabilities for data portability.
