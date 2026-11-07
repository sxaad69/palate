#!/usr/bin/env bash
set -e

echo "=== ModestFit Physical Device Autonomous Test Runner ==="

# 1. Verify ADB connection
DEVICE=$(adb devices | grep -E "device$" | head -1 | awk '{print $1}')
if [ -z "$DEVICE" ]; then
  echo "Error: No physical Android device connected via ADB."
  exit 1
fi
echo "✓ Connected device: $DEVICE"

# 2. Find latest run with APK artifact
APK_DIR="/tmp/modestfit-apk"
mkdir -p "$APK_DIR"

echo "Checking for latest APK artifact from GitHub Actions..."
RUN_ID=$(gh run list --workflow=e2e-modestfit.yml --json databaseId,conclusion --limit 3 | grep -B 1 '"conclusion":"success"' | head -1 | grep -o '[0-9]*' || true)

if [ -z "$RUN_ID" ]; then
  # Check if in-progress run has finished
  RUN_ID="42363564120"
fi

echo "Downloading APK from run $RUN_ID..."
gh run download "$RUN_ID" -n modestfit-debug-apk -D "$APK_DIR" || true

APK_PATH=$(find "$APK_DIR" -name "*.apk" | head -1)
if [ -z "$APK_PATH" ]; then
  echo "Waiting for APK build to complete on CI..."
  exit 2
fi

echo "✓ Found APK: $APK_PATH"

# 3. Install APK on physical device
echo "Installing ModestFit on physical device..."
adb -s "$DEVICE" install -r -d "$APK_PATH"

echo "✓ APK installed successfully."

# 4. Launch ModestFit
echo "Launching com.modestfit.app..."
adb -s "$DEVICE" shell am start -n com.modestfit.app/.MainActivity
sleep 4

# 5. Capture initial launch screenshot from physical phone
SC_DIR="apps/modestfit/screenshots"
mkdir -p "$SC_DIR"
adb -s "$DEVICE" exec-out screencap -p > "$SC_DIR/physical-device-01-launch.png"
echo "✓ Captured launch screenshot: $SC_DIR/physical-device-01-launch.png"

# 6. Dump UI hierarchy to verify app loaded
adb -s "$DEVICE" shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1
adb -s "$DEVICE" pull /sdcard/ui.xml /tmp/device-ui.xml >/dev/null 2>&1
echo "--- On-Screen UI Elements on Physical Phone ---"
grep -o 'text="[^"]*"' /tmp/device-ui.xml | grep -v 'text=""' | head -20 || true

echo "=== Physical Device Test Complete ==="
