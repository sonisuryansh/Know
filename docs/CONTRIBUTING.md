# Contributing to Know

Thank you for your interest in contributing to **Know**!

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Visual Studio Code (v1.80.0+)
- Git

### Build & Run from Source
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

# 5. Launch Extension Development Host
# Press F5 (or Run -> Start Debugging)
```

---

## 🧪 Testing & Validation
```bash
# Run TypeScript compilation check
npm run compile

# Watch mode during development
npm run watch

# Package into VSIX
npm run package
```

---

## 📜 Pull Request Guidelines
1. Fork the repository and create a new feature branch (`git checkout -b feature/my-feature`).
2. Adhere to TypeScript strict mode and existing formatting conventions.
3. Ensure no hardcoded color tokens are introduced (use native VS Code CSS variables).
4. Commit your changes with clear messages (`git commit -m "Add feature X"`).
5. Push to your branch and open a Pull Request.
