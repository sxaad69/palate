# Data Safety (Google Play) — Hulm

## Data collected
- **App activity / other user-generated content (dream entries, moods):** collected, stored on device only; optional cloud backup keyed by random device id (v1 ships local-only; backup is a future feature). Encrypted in transit. Not shared with third parties.
- **Purchase history:** collected by Google Play Billing to unlock Hulm Plus; not shared.

## Data shared
None shared with third parties. No analytics, no advertising SDKs.

## Security practices
- Data encrypted in transit (HTTPS / TLS)
- Data stored on device; users can erase all data from Settings
- No account required; no login data collected

## Not collected
Location, contacts, photos/media, audio, device identifiers beyond a
self-generated random device id (only if future sync is enabled).
