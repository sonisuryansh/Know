# Focus Sessions & Timers in Know

Know provides a distraction-free focus timer engine built directly into VS Code, eliminating the need for browser tabs or third-party timer apps.

---

## ⏱️ Duration Modes

1. **Preset Durations:**
   - `25m`: Standard Pomodoro sprint
   - `45m`: Deep work interval
   - `60m`: Complete feature block
   - `90m`: Ultradian focus rhythm
2. **Custom Target Duration:**
   - Enter any duration in minutes (e.g. `15m`, `35m`, `120m`).
3. **Stopwatch Mode (`No timer`):**
   - Count-up stopwatch for open-ended coding, debugging, or exploratory research.

---

## 🎮 Active Session HUD & Controls

When a session is active, the **Focus** tab renders a real-time HUD card:
- **Elapsed & Remaining Clock:** Authoritative millisecond time calculations.
- **Dynamic Progress Bar:** Visual indicator of target completion percentage.
- **Pause & Resume:** Pauses the timer when interrupted; paused time is locked and not counted toward focus metrics.
- **+5m Time Extension:** Add 5 minutes to your target duration when you need just a few extra minutes to finish.
- **Finish Session:** Complete the session, log optional summary notes, and mark the associated task completed.

---

## 📊 Status Bar Integration

- While idle, the status bar displays `$(flame) Know`.
- During an active session, the status bar displays a live countdown: `$(clock) 24:35 [ProjectName]`.
- When paused: `$(debug-pause) Paused: TaskName`.
- Clicking the status bar item instantly opens and reveals the Know dashboard.

---

## 🔒 Accurate Timestamp Calculations

Know does NOT rely solely on UI rendering intervals (`setInterval`) for recording time. It uses authoritative timestamps (`startTime`, `lastStateChangeTime`, `focusedMs`, `pausedMs`) to guarantee accurate metrics even if VS Code is minimized or the Webview is reloaded.
