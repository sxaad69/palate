# ThreeGood — Build Notes (2026-10-02)

Gratitude journal with streaks (App #19, Lifestyle). Collision-checked and
**renamed from GlowBack to ThreeGood** ("GlowBack" taken on Play by a GLP-1
tracker; "Grateful" taken by a gratitude journal app; "ThreeGood" clear and
names the ritual exactly).

## Built
- Expo SDK 57, strict TS (clean), token theme — sunrise cream/peach/gold +
  warm bark, light hero + deep-bark dark. AppText/Button/Screen/Card component
  library (text-glyph tab icons, no icon font).
- 60 gratitude prompts across 6 themes (people, senses, small-wins, nature,
  challenges, wonder), EN+AR, written for the app. Deterministic day rotation
  (interleaved across themes; day 47 ≠ day 1). Free: 3 themes; Pro: all 6.
- Today ritual screen: 3 prompt cards with inputs, streak pill, complete button,
  encouraging completion state (one-shot per day, read-only after).
- Glow jar: fill = this week's completed days / 7; streak milestones
  (7/14/30/60/100/365) unlock jar glow themes, tappable to apply.
- History: week-grouped past days, tap-to-read; current week free, older weeks
  Pro-locked with paywall entry.
- Weekly letter: auto-compiled readable summary (EN+AR), Share as text;
  past-letter archive + full export are Pro.
- Onboarding (3 slides + language pick + reminder-time presets), Profile
  (appearance, language, reminder presets incl. off, paywall entry), Paywall.
- Daily reminder via expo-notifications, LOCAL ONLY (no push service, no
  tokens). Reschedules when the time changes; cancellable.
- Local-first persistence via AsyncStorage (single persisted state object:
  onboarded, lang, reminder, entries, jarThemeId, pro).
- Billing: react-native-iap v16 scaffold, WEEKLY + free trial
  (`threegood_weekly`), restore-on-init, local Pro status.
- Supabase migration (threegood_entries) — schema reserved for future cloud
  sync; **no reads/writes in v1, no edge function** (YAGNI).
- Maestro smoke.yaml + e2e-gratitude.yml workflow (dormant until repo exists;
  shares the Expo-57 Gradle cache key; disk-cleanup before downloads).
- play-listing/: EN+AR listing drafts, privacy policy, Data Safety draft
  (local-only posture).
- Brand: BRAND.md — sunrise identity, 4 differentiators, unique icon/voice.

## Stubbed (works locally, needs launch-time config)
- Billing: product `threegood_weekly` must be created in Play Console with
  weekly billing + free trial; server-side purchase verification before
  unlocking Pro at scale.
- Notifications: permission + exact scheduling verified on a real device at
  launch; plugin declared in app.json.
- Supabase URL/anon key via EXPO_PUBLIC_* env (client is no-op until set).
- Maestro flow assumes English locale; RTL flow not scripted.

## Left for launch
- App icon assets (adaptive-icon placeholders in app.json) + feature graphic.
- Play Console: create `threegood_weekly` (weekly + trial), Data Safety form
  answers (drafted), content rating questionnaire, privacy-policy URL.
- 12-tester closed track per portfolio playbook.
- E2E: create repo, push, let e2e-gratitude.yml run on an emulator runner.
- Optional v2: cloud sync against the reserved Supabase schema; server-side
  billing verification edge function; streak-repair.

## Differentiation vs Day One / gratitude apps (≥3, Play repetitive-content policy)
1. Ritual-first home (today's 3 prompts, 60-second completable) vs blank page.
2. 60 rotating EN+AR prompts across 6 themes (free 3 / pro 6).
3. Glow jar visualization + streak-milestone jar themes.
4. Weekly reflection letter (shareable text keepsake), Pro archive + export.

## Deliberate simplifications (ponytail)
- Reminder times are presets (7:00/12:30/18:00/21:00/off), not a datetime
  picker — covers the habit loop without a native picker dep.
- promptsForDay is O(60) per render — trivial at this size; cache if the
  library grows 10×.
- Theme mode and language toggle apply without app restart except RTL flip
  (documented; launch concern).
