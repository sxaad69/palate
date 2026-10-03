#!/usr/bin/env bash
# Pre-push verification gate: every app under apps/ must be complete
# BEFORE anything gets pushed to CI. Run: ./scripts/verify-apps.sh
# Exits non-zero with a clear report if anything is missing.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APPS_DIR="$ROOT/apps"
FAIL=0
TOTAL=0

check() { # $1=app $2=desc $3=test...
  local app="$1" desc="$2"; shift 2
  if "$@" >/dev/null 2>&1; then
    echo "  ok   $desc"
  else
    echo "  FAIL $desc"
    FAIL=1
  fi
}

for app_path in "$APPS_DIR"/*/; do
  app="$(basename "$app_path")"
  TOTAL=$((TOTAL+1))
  echo "== $app =="
  check "$app" "app/package.json exists"        test -f "$app_path/app/package.json"
  check "$app" "app/app.json valid JSON"         python3 -c "import json;json.load(open('$app_path/app/app.json'))"
  # icon: Expo allows top-level "icon" or expo.icon — check both, verify the file exists
  ICON="$(python3 -c "
import json
d=json.load(open('$app_path/app/app.json'))
print(d.get('icon') or d.get('expo',{}).get('icon') or '')" 2>/dev/null)"
  if [ -n "$ICON" ]; then
    check "$app" "icon file exists ($ICON)"     test -f "$app_path/app/$ICON"
  else
    echo "  FAIL no expo.icon in app.json"; FAIL=1
  fi
  check "$app" ".maestro/smoke.yaml exists"      test -f "$app_path/.maestro/smoke.yaml"
  check "$app" "screens non-empty"               test -n "$(ls "$app_path/app/screens" 2>/dev/null)"
  check "$app" "play-listing has files"          test -n "$(ls "$app_path/play-listing" 2>/dev/null)"
  check "$app" "BUILD_NOTES.md exists"           test -f "$app_path/BUILD_NOTES.md"
  check "$app" "tsc clean"                       bash -c "cd '$app_path/app' && npx --yes tsc --noEmit 2>/dev/null"
done

echo ""
echo "Checked $TOTAL apps."
if [ "$FAIL" -eq 0 ]; then echo "ALL GREEN — safe to push."; else echo "BLOCKED — fix FAIL lines above before pushing."; fi
exit "$FAIL"
