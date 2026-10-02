# Naplet — Data Safety (Play Console draft)

## Does the app collect or share user data?
**Yes** — limited: app activity (baby-care logs) for family sync, only when a family code is set.

## Data types collected
| Data type | Collected | Shared | Purpose | Ephemeral | Required or optional |
|---|---|---|---|---|---|
| App activity (sleep/feed/diaper logs, baby name) | Yes | No* | App functionality (family sync) | No | Optional (only with family code) |
| Purchase history (anonymous token) | Yes | No | App functionality (subscription verification) | No | Optional (Pro only) |
| Device or other IDs (anonymous device ID) | Yes | No | App functionality (backup key) | No | Optional |

\* "Shared" with third parties: No. Events are visible to other devices using the same family code — that is the app's core feature, not third-party sharing.

## Security
- Data in transit: encrypted (HTTPS/TLS)
- Users can request data deletion: yes (contact support / delete app)

## Notes for the console form
- No personal info, no financial info (Play Billing handles payments), no location, no health *sensor* data — logs are user-entered app activity.
- No data shared with third parties, no ads SDKs, no analytics SDKs in v1.
