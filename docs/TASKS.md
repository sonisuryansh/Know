# Task Management in Know

Know includes a lightweight, developer-focused task management system integrated directly into your VS Code editor.

---

## 📥 Quick Inbox Capture
- Type any thought, bug fix, or task into the quick input bar at the top of the **Tasks** tab.
- Press `Enter` to immediately save it to your **Inbox** without losing your coding flow or leaving your active file.

---

## 🎯 Today's Focus Queue
- Keep your working memory clear by curating a focused subset of 3–5 tasks for the current day.
- Move any task from your **Inbox** or project backlog into **Today** by clicking the **Move to Today** button or checking the "Add to Today" box when creating a task.
- Tasks in Today appear directly in the **Focus** tab alongside the timer.

---

## 🏷️ Task Attributes & Metadata

| Field | Description | Values / Examples |
|---|---|---|
| **Title** | The name of the task | `Implement JWT Auth`, `Fix 504 gateway timeout` |
| **Project** | Optional project assignment | Select from any existing project or Standalone |
| **Category** | Work classification | *Feature Implementation*, *Bug Fix & Debugging*, *Refactoring*, *Code Review*, *Documentation*, *Testing*, *DevOps*, *Learning*, *Personal Project*, *Company Work* |
| **Priority** | Urgency indicator | `Low`, `Medium`, `High`, `Urgent` |
| **Target Duration** | Estimated minutes | `25`, `35`, `45`, `60`, etc. |
| **Linked File** | Active editor document link | `📄 src/auth/jwt.ts` |
| **Status** | Task state | `TODO`, `IN_PROGRESS`, `COMPLETED` |
| **Attempts** | Session history | Logged focus attempts with timestamps and notes |

---

## 📄 Active Editor File Linking
- Attach the currently active file in VS Code to any task.
- Click the `📄 <filename>` badge on any task card to immediately open and focus that exact file in your editor.
- Use the editor context menu shortcut: Right-click any code file $\rightarrow$ **Know: Create Task from Current File** or **Know: Link Current File to Task**.

---

## 🔄 Task Lifecycle & Auto-Transitions
1. **Start Focus:** When you click **▶ Focus** on a `TODO` task, its status automatically transitions to `IN_PROGRESS`.
2. **Finish Session:** When you finish the focus timer, Know asks if you want to mark the task completed. If confirmed, the task transitions to `COMPLETED` with an accurate `completedAt` timestamp.
3. **Attempt Logging:** Every focus session linked to a task is recorded in the task's `attempts` array, including duration and summary notes.
