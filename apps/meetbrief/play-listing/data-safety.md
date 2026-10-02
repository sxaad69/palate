# MeetBrief — Data Safety (Play Console answers)

Posture: **local-only**. Recordings, notes, transcripts, and action items
never leave the device; the app makes no network requests and runs no
analytics/ads/crash SDKs.

## Does your app collect or share any of the required user data types?
**No data collected. No data shared.**

Rationale per Play's definitions (collection = data transmitted off the
device):
- **Recorded audio** — captured via the microphone and written to the
  app's private document directory only. It is never transmitted off the
  device, so it is not "collected". The microphone permission
  (`RECORD_AUDIO`) is declared in the manifest for on-device recording.
- **Files / notes / action items** — stored in on-device app storage
  (AsyncStorage + document directory) only.
- **No account, no identifiers** — no email, name, device IDs, or
  advertising IDs are accessed.
- **Purchases** — handled entirely by Google Play Billing; the app stores
  only a local Pro flag.

## Follow-up answers (as the form asks them)
- Data is encrypted in transit: **N/A — no data transmitted.**
- Users can request data deletion: **yes — deleting a meeting in-app
  permanently deletes its recording and notes; uninstalling removes all
  app data.** (No server copy exists to delete.)
- Data is collected for: **N/A.**

## Permissions declared
- `RECORD_AUDIO` — core feature (meeting recording), on-device only.
  Rationale is shown in onboarding before the system prompt.

Note for launch: if a cloud sync or STT feature is added later, this form,
the privacy policy, and the in-app disclosure must be updated first.
