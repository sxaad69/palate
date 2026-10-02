# Data Safety draft — HeadDown (Play Console)

Fill into Play Console > App content > Data safety:

**Does your app collect or share any of the required user data types?**
- Collected: YES (optional cloud backup — see below)
- Shared with third parties: NO

**Data types collected:**
- App activity > Other user-generated content (focus sessions, reflection
  notes — only if cloud backup enabled): Collected, not shared. Purpose:
  Backup. Optional.
- Purchases (purchase tokens for subscription verification): Collected via
  Google Play Billing, not shared. Purpose: Account management / app
  functionality. Required for Plus features.

**Defaults (no backup enabled, no purchase):** the app collects nothing and
transmits nothing — fully offline except the optional session-end
reminder, which is scheduled locally.

**Security practices:**
- Data encrypted in transit (TLS).
- No data shared with third parties.
- Users can request deletion of cloud backup via support email or the
  in-app "Erase all data" option.
