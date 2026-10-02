# Data Safety draft — SalahMate (Play Console)

Fill into Play Console > App content > Data safety:

**Does your app collect or share any of the required user data types?**
- Collected: YES (optional cloud backup — see below)
- Shared with third parties: NO

**Data types collected:**
- App activity > Other user-generated content (prayer/habit records, only
  if cloud backup enabled): Collected, not shared. Purpose: Backup.
  Optional.
- Location > Approximate location: processed ON-DEVICE ONLY for prayer
  times; never collected or transmitted. (Declare as "not collected" —
  note the on-device use in the store listing instead.)
- Purchases (purchase tokens for subscription verification): Collected via
  Google Play Billing, not shared. Purpose: Account management / app
  functionality. Required for Plus features.

**Defaults (no backup enabled, no purchase):** the app collects nothing and
transmits nothing — fully offline.

**Security practices:**
- Data encrypted in transit (TLS).
- No data shared with third parties.
- Users can request deletion of cloud backup via support email or the
  in-app "Erase all data" option.
