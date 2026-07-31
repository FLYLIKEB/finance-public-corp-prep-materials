#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${WIKI_AUTOPUSH_REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
LOCK_DIR="$ROOT_DIR/.git/wiki-autopush.lock"
DEBOUNCE_SECONDS="${WIKI_AUTOPUSH_DEBOUNCE_SECONDS:-2}"
PYTHON_BIN="${WIKI_AUTOPUSH_PYTHON:-$(command -v python3 || true)}"
SYNC_PATHS=(README.md TOC.md pages)

mkdir "$LOCK_DIR" 2>/dev/null || exit 0
cleanup() {
  rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
}
trap cleanup EXIT

sleep "$DEBOUNCE_SECONDS"

if ! git -C "$ROOT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "wiki autopush: git repository not found at $ROOT_DIR" >&2
  exit 1
fi

if ! git -C "$ROOT_DIR" remote get-url origin >/dev/null 2>&1; then
  echo "wiki autopush: origin remote is not configured" >&2
  exit 1
fi

BRANCH="$(git -C "$ROOT_DIR" branch --show-current)"
if [[ -z "$BRANCH" ]]; then
  echo "wiki autopush: current branch could not be determined" >&2
  exit 1
fi

STATUS="$(git -C "$ROOT_DIR" status --porcelain --untracked-files=all -- "${SYNC_PATHS[@]}")"
if [[ -z "$STATUS" ]]; then
  echo "wiki autopush: no wiki content changes" 
  exit 0
fi

if [[ -z "$PYTHON_BIN" ]]; then
  echo "wiki autopush: python3 is not available" >&2
  exit 1
fi

"$PYTHON_BIN" "$ROOT_DIR/scripts/validate_toc_links.py"

git -C "$ROOT_DIR" add -- "${SYNC_PATHS[@]}"
if git -C "$ROOT_DIR" diff --cached --quiet -- "${SYNC_PATHS[@]}"; then
  echo "wiki autopush: nothing staged after add"
  exit 0
fi

if [[ "${WIKI_AUTOPUSH_DRY_RUN:-0}" == "1" ]]; then
  echo "wiki autopush: dry run"
  git -C "$ROOT_DIR" diff --cached --stat -- "${SYNC_PATHS[@]}"
  exit 0
fi

STAMP="$(date '+%Y-%m-%d %H:%M:%S')"
MESSAGE="Auto-sync wiki content ($STAMP)"

git -C "$ROOT_DIR" commit -m "$MESSAGE"

if ! git -C "$ROOT_DIR" push origin "$BRANCH"; then
  echo "wiki autopush: push rejected, rebasing onto origin/$BRANCH"
  if ! git -C "$ROOT_DIR" pull --rebase --autostash origin "$BRANCH"; then
    git -C "$ROOT_DIR" rebase --abort >/dev/null 2>&1 || true
    echo "wiki autopush: automatic rebase failed; resolve manually" >&2
    exit 1
  fi
  git -C "$ROOT_DIR" push origin "$BRANCH"
fi

echo "wiki autopush: pushed $BRANCH"