# Data Safety Form — Draft Answers (Palate)

Fill these into Play Console → App content → Data safety. "Collected" = transmitted off the device or stored on our servers. "Shared" = sent to a third party.

## Photos and videos (meal photos)
- **Collected:** YES
- **Shared:** YES — with AI processors (Google Gemini, NVIDIA NIM) for dish recognition
- **Purpose:** App functionality
- **Optional:** YES — the app works without AI scans (manual logging, dish search, diary all function offline of the AI feature)
- **Ephemeral:** [VERIFY — confirm photos are not persisted server-side; if they are stored even briefly, answer accordingly]

## Device or other IDs (Android ID / generated device UUID)
- **Collected:** YES
- **Shared:** NO
- **Purpose:** Fraud prevention / abuse prevention (enforcing the 3-free-AI-scans-per-device limit)
- **Optional:** NO — required for the free tier to function

## Health and fitness → Health info (food logs: dishes, portions, calories, macros)
- **Collected:** YES
- **Shared:** NO
- **Purpose:** App functionality (diary, streaks, progress charts)
- **Optional:** YES — core logging is the app's purpose, but users choose what to log; no health data is required at onboarding

## App activity → App interactions (gamification: XP, levels, streaks, badges; scan counts)
- **Collected:** YES
- **Shared:** NO
- **Purpose:** App functionality (persisting progress across sessions/devices)
- **Optional:** NO — inherent to using the app

## Personal info (name, email, phone, contacts)
- **Collected:** NO (no account system at launch)
- **[VERIFY — if sign-in is added before launch, update this section: email/phone collected, not shared, purpose = account management]**

## Location
- **Collected:** NO

## Financial info
- **Collected:** NO (payments handled entirely by Google Play Billing; we never see card details)

## Data handling declarations
- Data is encrypted in transit: **YES** (TLS everywhere)
- Data encrypted at rest: **YES** (Supabase platform encryption) [VERIFY]
- Users can request data deletion: **YES** (in-app request + email [CONTACT_EMAIL])
- Data is deleted on account/data deletion request: **YES**, within 30 days
- Committed to follow the Play Families Policy: **N/A** (app is 13+, not a children's app)
- Independent security review: **NO**

## Notes
- The "shared with AI processors" answer for photos must match the privacy policy's named processors (Google, NVIDIA).
- If a crash-reporting SDK (e.g. Sentry, Crashlytics) is added later, add: Diagnostics → Crash logs, collected YES, shared with the crash provider, purpose = Analytics/diagnostics.
- Revisit this entire form before EVERY release — Play rejects updates when the form drifts from reality.
