# TwoPurse — Data Safety (Play Console draft)

Posture: **local-only financial data. No collection, no sharing.**

## Answers for the Data safety form

- **Does your app collect or share any of the required user data types?**
  **No — do not collect any data.** Rationale: all envelopes, expenses, names,
  and settings are stored in on-device AsyncStorage only. There is no backend
  call, no analytics SDK, and no ad SDK in v1.

- **Financial info (purchase history / financial account data):** NOT collected.
  The app never links banks and never transmits amounts anywhere. Manual
  entries stay on the device.

- **Data shared with third parties:** None. The only third-party interaction is
  Google Play Billing at purchase time, which is handled by Google Play
  services under Google's own policy — the app receives only an
  active/inactive entitlement flag.

- **Data deletion:** In-app deletion control = clearing app data / uninstalling
  removes everything (there is no server copy). Answer "yes" to providing a
  way to request deletion: the mechanism is device-level deletion; document in
  the privacy policy.

- **Encryption in transit / deletion attestation:** N/A — no data leaves the
  device (select "no" where the form asks about collection-dependent items;
  never claim encryption of data that isn't transmitted).

- **User-initiated sharing:** The "Share summary" and "Export CSV" features
  hand user-composed text to Android's share sheet. This is user-directed
  sharing, not app collection — disclose in the privacy policy (done).

## If v2 adds partner cloud sync
The form must be re-answered: collection = financial info + account-adjacent
identifiers (device id, household code), sharing = sync infra (Supabase),
encryption in transit = TLS, deletion = in-app "leave household / delete data".
Do this **before** submitting the v2 release.
