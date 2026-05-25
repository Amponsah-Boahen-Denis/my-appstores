## Autopush script

This repository includes a simple local autopush helper that will stage, commit, and push local changes automatically.

How it works
- `scripts/autopush.js` polls `git status --porcelain` every few seconds and, if changes are detected, runs `git add -A`, `git commit -m "Auto commit: <timestamp>"`, and `git push`.

Security and setup
- Do NOT store your GitHub token in the repo. Instead configure Git credentials on your machine using the Git Credential Manager or `gh auth login`.
- On Windows, enable credential manager:

```bash
git config --global credential.helper manager-core
```

- On macOS:

```bash
git config --global credential.helper osxkeychain
```

- On Linux you can use `cache` or credential helpers of your desktop environment.

Usage
- Install dependencies (if any) and run the autopush script:

```bash
npm run autopush
```

Optional environment variables
- `AUTOPUSH_INTERVAL` - polling interval in milliseconds (default: 5000)
- `AUTOPUSH_COMMIT_MESSAGE` - custom commit message template

Notes
- This script is intended for local development convenience only. Use with caution — it will push commits to the current branch.
- For safer CI-based automation, consider GitHub Actions and protected branches.
