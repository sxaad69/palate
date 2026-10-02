# Privacy Policy — Palate

**Effective date:** [EFFECTIVE_DATE]
**App:** Palate — AI Food Scanner (Android)
**Developer:** [DEVELOPER_NAME]

This policy explains what data Palate collects, why, and what you can do about it. Short version: we collect the minimum needed to recognize your meals and keep your log, we never sell your data, and there are no ads in the app.

## 1. Data we collect

**Meal photos (camera).** When you use the AI scan feature, the photo you take is sent to our backend for dish recognition. Photos are processed to identify the dish and estimate the portion, then matched against our nutrition database. Photos are transmitted securely and are not used for advertising or sold to anyone.

**Food logs and nutrition data.** The meals you log (dish names, portions, calories, macros) are stored so your diary, streaks, and progress charts work — including when you switch devices. This is health-related information you choose to enter.

**Device identifier.** We store a device identifier (Android ID, or a randomly generated ID on devices where it is unavailable) for one purpose only: enforcing the limit of 3 free AI scans per device, so the free tier cannot be abused by reinstalling the app. It is not used for advertising or cross-app tracking.

**Gamification state.** Your XP, level, streaks, and unlocked badges are stored so your progress persists.

**Account data.** [VERIFY — if/when sign-in is added: email or phone number used for authentication.] At launch, Palate works without an account; the above data is tied to your device identifier.

## 2. Where your data lives

App data is stored with **Supabase** (database and backend infrastructure, hosted in their cloud regions). Meal photos in transit are processed by our AI providers (see below). All connections use TLS encryption.

## 3. AI processing — named processors

When you scan a meal, the photo is sent to:
- **Google (Gemini API)** — primary dish-recognition provider
- **NVIDIA (NIM API)** — fallback provider if the primary is unavailable

These providers process the image solely to return a dish identification. We do not send them your name, contact details, or any other personal information — only the meal photo and the recognition request. Their own privacy policies apply to their processing: [Google Privacy Policy](https://policies.google.com/privacy), [NVIDIA Privacy Policy](https://www.nvidia.com/en-us/about-nvidia/privacy-policy/).

## 4. What we never do

- **No ads.** Palate contains no advertising SDKs and shows no ads.
- **No sale of personal data.** We do not sell, rent, or trade your personal data to anyone.
- **No cross-app tracking.** Your device identifier is used only for the free-scan limit described above.

## 5. Data retention

- Meal photos: retained only as long as needed to complete the recognition request, then deleted from our processing pipeline. [VERIFY — confirm no photo persistence in Supabase Storage.]
- Food logs, gamification state, and device identifiers: retained while you use the app and for [RETENTION_PERIOD, e.g. 12 months] after your last activity, then deleted.
- If you request deletion (see below), we delete your data within 30 days.

## 6. Your rights

You may at any time:
- **Access** a copy of the data we hold about you
- **Correct** inaccurate data (e.g. edit or delete logged meals in the app)
- **Delete** your data entirely — use the in-app deletion request [VERIFY — confirm the in-app path exists before launch] or email us

To exercise these rights, email **[CONTACT_EMAIL]** with the subject "Palate data request". We respond within 30 days.

## 7. Children's privacy

Palate is not directed at children under 13, and we do not knowingly collect data from children under 13. If you believe a child has provided us data, contact **[CONTACT_EMAIL]** and we will delete it.

## 8. Security

We use TLS for all network traffic, Row Level Security on our database, and API keys are kept server-side — never in the app. No system is perfectly secure, but we apply industry-standard measures appropriate to the data we hold.

## 9. Changes to this policy

If we change this policy, we will update the effective date above and notify you in the app for material changes. Continued use after changes take effect means you accept the updated policy.

## 10. Contact

Questions about privacy: **[CONTACT_EMAIL]**
Developer: [DEVELOPER_NAME], [DEVELOPER_ADDRESS_IF_REQUIRED]

---

> **Note for the launch checklist:** this policy needs a **public URL** before Play submission (Play Console requires a privacy policy link on the store listing). Host it on the Palate website or a public docs page, then paste the URL into Play Console → Store presence → Privacy policy.
