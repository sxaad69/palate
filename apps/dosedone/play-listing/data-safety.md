# Data Safety draft — DoseDone (Play Console)

Fill into Play Console > App content > Data safety:

**Does your app collect or share any of the required user data types?**
- Collected: YES (optional cloud backup — see below)
- Shared with third parties: NO

**Data types collected:**
- Health and fitness > Health info (medication names, dosages, schedules,
  dose logs — only if cloud backup enabled): Collected, not shared.
  Purpose: Backup. Optional.
- Purchases (purchase tokens for subscription verification): Collected via
  Google Play Billing, not shared. Purpose: Account management / app
  functionality. Required for Plus features.

**Defaults (no backup enabled, no purchase):** the app collects nothing and
transmits nothing — fully offline. Reminders are scheduled locally.

**Security practices:**
- Data encrypted in transit (TLS).
- No data shared with third parties.
- Users can request deletion of cloud backup via support email or the
  in-app "Erase all data" option.

**Health data note:** this app handles health info (medications) as its core
function. The Data Safety form's Health category IS declared here because
backup transmits it. The Play Console health-apps declaration / policy
review for health apps should be checked at launch — a medication reminder
without diagnosis/treatment claims is typically fine, but verify the
current "Health apps" policy before submission.
