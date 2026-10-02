# Data Safety draft — DrySpell (Play Console)

Fill into Play Console > App content > Data safety:

**Does your app collect or share any of the required user data types?**
- Collected: YES (optional cloud backup — see below)
- Shared with third parties: NO

**Data types collected:**
- App activity > Other user-generated content (journal entries, only if cloud
  backup enabled): Collected, not shared. Purpose: Backup. Optional.
- Personal info > Other personal info (sobriety start date / habit / spend,
  only if cloud backup enabled): Collected, not shared. Purpose: Backup.
  Optional.
- Purchases (purchase tokens for subscription verification): Collected via
  Google Play Billing, not shared. Purpose: Account management / app
  functionality. Required for Plus features.

**Defaults (no backup enabled, no purchase):** the app collects nothing and
transmits nothing — fully offline.

**Security practices:**
- Data encrypted in transit (TLS).
- No data shared with third parties.
- Users can request deletion of cloud backup via support email.

**Note:** journal entries are health-adjacent personal content. They are
stored on-device by default; the Data Safety form's "Health and fitness"
category is NOT declared because the app does not transmit health data to
any health service — backup is generic user-generated content. Revisit this
classification with counsel before launch if the backup scope changes.
