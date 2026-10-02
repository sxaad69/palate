# Restory — Build Notes (2026-10-02)

Mood+sleep micro-journal, sleep-first angle (App #5). Wedge vs Daylio: the mood↔sleep correlation as the killer insight. Collision-checked brand: **Restory** (`com.restory.app`); Drowse/Nightly/Moonlog/Hushly/Sloom all taken in the sleep space.

## Built
- Expo SDK 57, strict TS (clean), token theme — twilight plum / warm sand / soft gold, dark + light, RestoryText/Button/Screen/Card/TimeStepper component library.
- Today: sleep-first check-in (<30s) — last night's sleep card first (quality stars, ±15-min bed/wake steppers), today's mood card (5 faces + labels, optional one-line note). Auto-saves on every tap; "Saved" indicator.
- Insights (Pro-gated): on-device correlation engine (`lib/insights.ts`) — "+X mood points after 4★+ sleep" (needs ≥5 paired days), sweet-spot bedtime (circular mean, correct across midnight) + sleep length on good nights, custom 7-day mood/sleep bar chart (no chart lib), weekly "rest story" from local EN+AR templates (no LLM).
- Progress: streak (days with any log), check-ins, nights logged, history list — free capped at 7 days, Pro unlimited.
- Profile: appearance, language, bedtime reminder (daily LOCAL notification via expo-notifications, no server), reminder time stepper, CSV export via share sheet (Pro perk, available to all in v1 UI — see notes), paywall entry.
- Local-first persistence via AsyncStorage (single persisted state object).
- Billing: react-native-iap v16 scaffold, WEEKLY + free trial (`restory_weekly`), restore-on-init, local Pro status.
- Supabase migration (restory_entries) — schema reserved for future cloud sync; **no reads/writes in v1, no edge function** (YAGNI).
- Maestro smoke.yaml + e2e-moodsleep.yml workflow (dormant until repo exists; shares Expo-57 Gradle cache key with Palate; disk-cleanup step kept).
- play-listing/: EN+AR listing drafts, privacy policy, Data Safety draft.
- `check/check-insights.ts`: ponytail self-check for the correlation math (tsc → node, asserts duration/circular mean/lift/thin-data/story fallback/CSV).
- Brand: BRAND.md — twilight plum/warm sand/soft gold, unique icon/voice, 4 differentiators vs Daylio.

## Stubbed (works locally, needs launch-time config)
- Billing: product `restory_weekly` must be created in Play Console with weekly billing + free trial; server-side purchase verification before unlocking Pro at scale.
- Supabase URL/anon key via EXPO_PUBLIC_* env (client is no-op until set).
- Bedtime reminder: permission is requested at toggle time; denied state shows a system-settings hint.
- Maestro flow assumes English locale; RTL flow not scripted.

## Left for launch
- App icon assets (adaptive-icon placeholders in app.json) + feature graphic.
- Play Console: create `restory_weekly` (weekly + trial), Data Safety form answers (drafted), content rating questionnaire, privacy-policy URL.
- 12-tester closed track per portfolio playbook.
- E2E: create repo, push, let e2e-moodsleep.yml run on an emulator runner.
- Decide CSV export gating: currently the export button is visible to free users (code does not gate it). Either gate export behind Pro at launch or move it into the paywall perks enforcement.
- Optional v2: cloud sync against the reserved Supabase schema; server-side billing verification edge function.

## Differentiation vs Daylio (≥3, Play repetitive-content policy)
1. Sleep-first flow — nightly check-in pairs last night's sleep with today's mood automatically; Daylio is mood-first with sleep as an afterthought tag.
2. Mood↔sleep correlation insights computed on-device from the user's own data.
3. Bedtime wind-down nudge tied to target bedtime with a 20-second "close the day" ritual.
4. Weekly "rest story" narrative generated locally from templates (EN+AR), not an LLM.
