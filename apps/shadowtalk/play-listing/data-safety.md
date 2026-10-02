# Data Safety — ShadowSay (answers for the Play Console Data safety form)

## Does the app collect or share any user data?
**No.** All app data (practice history, streaks, settings, voice recordings)
stays on the device. Nothing is transmitted to us or any third party.

Details for the form:

| Question | Answer |
|---|---|
| Data collected | No data collected |
| Data shared with third parties | No data shared |
| Data types | None (recordings are device-local and never leave the phone) |
| Is data encrypted in transit | N/A — nothing is transmitted |
| Can users request data deletion | Yes — deleting the app removes all local data; no account data exists |
| Independent security review | Not conducted |

Notes:
- The microphone is used solely for on-device practice recordings. Audio is
  stored in the app's private document directory and is never uploaded.
- The TTS model voice (expo-speech) runs on-device; no text or audio leaves
  the device for synthesis.
- Purchases are handled entirely by Google Play Billing; the app does not
  see or store payment information.
