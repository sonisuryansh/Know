# Privacy & Local-First Architecture

Know is built on strict local-first privacy principles.

---

## 🔒 Core Privacy Guarantees

1. **100% Local Storage:**
   - All tasks, projects, focus logs, and statistics are stored locally on your machine using VS Code's internal `globalState` storage.
2. **Zero Telemetry & Analytics:**
   - No tracking, analytics, crash reporters, or user behavior metrics are collected or sent to external servers.
3. **No Code Transmission:**
   - Your code, filenames, and project contents never leave your computer.
4. **No Cloud Account or Registration Required:**
   - Know works completely offline without requiring sign-ins, API keys, or subscriptions.
5. **Network Requests:**
   - Network connectivity is used exclusively when you initiate an explicit Git clone command (`git clone <url> <dest>`).

---

## 💾 Data Backup & Portability

You can export or import your complete Know database anytime:
1. Open the Know sidebar or tab.
2. Click the ⚙️ icon in the top header.
3. Select **📥 Export Data (JSON)** to save your backup file.
4. Select **📤 Import Data (JSON)** to restore data on another machine.
