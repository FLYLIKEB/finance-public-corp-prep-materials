# Repository Operating Notes

## Git workflow

Use a trunk-based Git workflow in this repository.

- Work directly on `main` by default.
- After each completed change, commit promptly on `main`.
- Push promptly to `origin/main` after committing.
- If `origin/main` has advanced, run `git fetch origin main`, rebase local `main` onto `origin/main`, resolve conflicts while preserving the user's latest intent, then push.
- Do not leave completed local changes uncommitted or unpushed unless explicitly asked.

## Commit style

Follow the Lore Commit Protocol from the session/root instructions when writing commit messages.
