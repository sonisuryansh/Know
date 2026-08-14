# GitHub & Git Integration in Know

Know includes frictionless Git repository cloning and workspace association workflows directly inside VS Code.

---

## 🐙 1. Import GitHub Repository

You can clone and link a GitHub repository directly from Know:

1. In the **Projects** tab or Command Palette, select **Import GitHub Repository** (`Know: Import GitHub Repository`).
2. Enter the repository URL. Know accepts:
   - HTTPS: `https://github.com/user/project.git`
   - SSH: `git@github.com:user/project.git`
   - Short syntax: `user/project`
3. Select a destination directory on your computer.

### 🛡️ Automatic Collision Safety:
- **Existing Clone with Same Remote:** If the destination folder already contains a clone of the repository, Know connects it without re-cloning.
- **Existing Directory with Unrelated Files:** If the folder contains files or a different Git remote, Know alerts you to prevent overwriting or deleting code.
- **Empty / Parent Directory:** Know automatically clones the repository into a dedicated subfolder (`git clone <url> <dest>`).

---

## 📂 2. Connect Current Active Workspace

If you are already working in a repository in VS Code:
1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run **`Know: Associate Current Workspace as Project`**.
3. Know inspects the workspace, retrieves the local folder path, remote repository URL, and active Git branch, and binds it as a Know project.
