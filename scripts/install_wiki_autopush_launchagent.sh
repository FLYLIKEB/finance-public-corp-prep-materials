#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LABEL="com.financepubliccorp.wikidocs.autopush"
PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_PATH="$PLIST_DIR/$LABEL.plist"
LOG_DIR="$HOME/Library/Logs/wikidocs-ebook"
UID_VALUE="$(id -u)"

mkdir -p "$PLIST_DIR" "$LOG_DIR"

cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/env</string>
    <string>bash</string>
    <string>$ROOT_DIR/scripts/auto_push_wiki.sh</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    <key>WIKI_AUTOPUSH_PYTHON</key>
    <string>/opt/homebrew/bin/python3</string>
    <key>WIKI_AUTOPUSH_REPO_DIR</key>
    <string>$ROOT_DIR</string>
    <key>WIKI_AUTOPUSH_DEBOUNCE_SECONDS</key>
    <string>2</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>ThrottleInterval</key>
  <integer>2</integer>
  <key>WatchPaths</key>
  <array>
    <string>$ROOT_DIR/README.md</string>
    <string>$ROOT_DIR/TOC.md</string>
    <string>$ROOT_DIR/pages</string>
  </array>
  <key>StandardOutPath</key>
  <string>$LOG_DIR/autopush.stdout.log</string>
  <key>StandardErrorPath</key>
  <string>$LOG_DIR/autopush.stderr.log</string>
</dict>
</plist>
EOF

chmod 644 "$PLIST_PATH"
launchctl bootout "gui/$UID_VALUE" "$PLIST_PATH" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$UID_VALUE" "$PLIST_PATH"
launchctl enable "gui/$UID_VALUE/$LABEL"
launchctl kickstart -k "gui/$UID_VALUE/$LABEL"
launchctl print "gui/$UID_VALUE/$LABEL"

echo "Installed $LABEL at $PLIST_PATH"