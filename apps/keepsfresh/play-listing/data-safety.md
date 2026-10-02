# Data Safety — KeepsFresh (Play Console form answers)

## Data collection
**Does your app collect or share any user data?** — **No.**

KeepsFresh stores all pantry data locally on the device (AsyncStorage). No data is transmitted off-device.

## Data types
- None collected, none shared.

## Security practices
- Data is encrypted in transit: **N/A** (no data transmitted).
- Data is encrypted at rest: via Android's device-level storage encryption.
- Users can request data deletion: yes — clearing app storage or uninstalling deletes everything, since data is device-local.

## Exceptions / notes for review
- **Google Play Billing:** the optional Pro subscription is processed entirely by Google Play; the app only receives an entitlement flag. Per Play guidance, billing handled by Google Play does not need to be declared as app data collection.
- **Local notifications:** expiry reminders are scheduled on-device with `expo-notifications`; no notification content leaves the device.
- **Supabase schema:** a `households`/`pantry_items` schema is reserved in migrations for a possible future household-sharing feature. **The v1 app makes no network calls** — no Supabase client is instantiated without user-provided credentials (none requested in v1).

## Target audience
General audience; not directed at children under 13.
