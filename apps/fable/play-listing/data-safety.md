# Data Safety draft — Fable (for Play Console)

**Data collection:** None in v1.
- Location: not collected
- Personal info: not collected
- Health/fitness data: session logs (minutes, streaks) are stored ON-DEVICE ONLY and never transmitted. Declare as "not collected" (on-device-only data is not "collected" per Play's definition).
- Financial info: handled entirely by Google Play Billing; the app does not see card details.

**Data sharing:** Purchase confirmation via Google Play Billing only (required for subscription functionality).

**Security:** No network transmission of user data in v1 (local-only). Play Billing uses Google's encrypted channel.

**Deletion:** Uninstalling the app deletes all local data. No server-side account exists to delete.

**Notes for the console form:**
- "Does your app collect or share any of the required user data types?" → No
- In-app disclosure for billing is handled by Google Play's own purchase sheet.
