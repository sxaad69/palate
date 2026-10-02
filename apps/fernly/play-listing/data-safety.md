# Fernly — Data Safety (Play Console draft)

## Does the app collect or share user data?
**Yes** — limited: app activity (plant care logs) for backup, only when cloud backup is used.

## Data types collected
| Data type | Collected | Shared | Purpose | Ephemeral | Required or optional |
|---|---|---|---|---|---|
| App activity (plant collection, care logs) | Yes | No | App functionality (backup/sync) | No | Optional (only with backup) |
| Purchase history (anonymous token) | Yes | No | App functionality (subscription verification) | No | Optional (Pro only) |
| Device or other IDs (anonymous device ID) | Yes | No | App functionality (backup key) | No | Optional |

## Security
- Data in transit: encrypted (HTTPS/TLS)
- Users can request data deletion: yes (contact support / delete app)

## Notes for the console form
- No personal info, no financial info (Play Billing handles payments), no location, no photos — the Plant Doctor is a symptom checklist, not a camera feature.
- No data shared with third parties, no ads SDKs, no analytics SDKs in v1.
