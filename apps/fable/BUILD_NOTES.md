# Fable — Build Notes (2026-10-02)

Narrative breathwork app (App #2). Queue slug was "Drift"; collision-checked
and **renamed to Fable** ("Drift" taken in-category: Drift 2.0 breathwork app
on Uptodown, a "Drift" sleep-meditation prototype targeting Android,
HoMedics Drift). No breathwork collision found for "Fable".

## Built
- Expo SDK 57, strict TS (clean), token theme — deep indigo/night blue +
  lavender, dark-first, light "dawn" mode. FableText/Button/Screen/BreathRing
  component library.
- 12 narrative sessions across 4 arcs (Tide House/calm 4-6, Ember & Pine/box
  focus, Night Train/4-7-8 sleep, Greenhouse/coherent 5-5), EN+AR narration.
- Player: animated breath ring, JS-clock phase engine, breath-synced story
  beats, on-device TTS storyteller (Full / Cues / Silent density), countdown,
  outro + completion logging.
- Onboarding, Library (arcs, favorites, Pro locks), Progress (streak/minutes/
  week/history), Profile (appearance, language, guidance density), Paywall.
- Local-first persistence via AsyncStorage (single persisted state object).
- Billing: react-native-iap v16 scaffold, WEEKLY + free trial (`fable_weekly`),
  restore-on-init, local Pro status.
- Supabase migration (fable_progress, fable_favorites) — schema reserved for
  future cloud sync; **no reads/writes in v1, no edge function** (YAGNI).
- Maestro smoke.yaml + e2e-fable.yml workflow (dormant until repo exists;
  shares Expo-57 Gradle cache key with Palate).
- play-listing/: EN+AR listing drafts, privacy policy, Data Safety draft.
- Brand: BRAND.md — warm night/indigo identity, unique icon/voice.

## Stubbed (works locally, needs launch-time config)
- Billing: product `fable_weekly` must be created in Play Console with weekly
  billing + free trial; server-side purchase verification before unlocking Pro
  at scale.
- Supabase URL/anon key via EXPO_PUBLIC_* env (client is no-op until set).
- Maestro flow assumes English locale; RTL flow not scripted.

## Left for launch
- App icon assets (adaptive-icon placeholders in app.json) + feature graphic.
- Play Console: create `fable_weekly` (weekly + trial), Data Safety form
  answers (drafted), content rating questionnaire, privacy-policy URL.
- 12-tester closed track per portfolio playbook.
- E2E: create repo, push, let e2e-fable.yml run on an emulator runner.
- Optional v2: cloud sync against the reserved Supabase schema; server-side
  billing verification edge function.

## Differentiation vs Breathwrk (≥3, Play repetitive-content policy)
1. Story arcs — continuing narratives across sessions (chapters).
2. Breath-synced narration — story beats advance with breath phases.
3. Chapter streaks — narrative continuation as the retention mechanic.
4. On-device TTS storyteller with guidance density (no streaming/cost).
