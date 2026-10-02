# Data Safety — Pawscript (Play Console declaration draft)

**Posture: local-only. No data collected, no data shared.**

## Data collected
None. The app transmits no data off the device. All pet records, photos,
schedules, and preferences are stored locally (AsyncStorage + app document
directory).

## Data shared with third parties
None. No third-party SDKs receive any data. No ads, no analytics.

## Security practices
- Data encrypted in transit: N/A (no transmission) — declare "No" only if the form requires; the accurate statement is that no data leaves the device.
- Data deletion: users can erase all local data via **Profile → Erase all data**, or by uninstalling the app.

## Permissions used
- **Notifications (POST_NOTIFICATIONS):** local dose reminders scheduled on-device only.
- **Photos / media (READ_MEDIA_IMAGES):** only when the user chooses a pet photo; the photo is copied to the app's private directory and never uploaded.
- **Exact alarms (SCHEDULE_EXACT_ALARM / USE_EXACT_ALARM, if declared):** only to fire local dose reminders at the scheduled time. If the platform offers inexact scheduling, prefer it; exact alarms are used solely for the core reminder function the user explicitly enables.

## Play Console answers (draft)
- Does your app collect or share any of the required user data types? **No**
- Is all of the user data collected by your app encrypted in transit? **N/A — no data collected** (answer per current console guidance)
- Do you provide a way for users to request that their data is deleted? **Yes** — in-app erase + uninstall removes everything
- Independent security review: **No**

## Notes for launch
- Re-verify the exact-alarm declaration text against the current Play policy at launch; if the reminder works reliably with inexact alarms on the target API level, drop the exact-alarm permission to minimize review friction.
- If optional cloud sync ships later, this form must be updated before release.
