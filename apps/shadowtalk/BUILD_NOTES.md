# BUILD NOTES — ShadowSay (App #15), built 2026-10-02

## Built (v1, tsc clean, local only — no GitHub push)
- Expo SDK 57 managed app at `app/` (`com.shadowsay.app`). Strict TS, single
  persisted AsyncStorage state object, no state libs, no new deps beyond the
  SDK set.
- Theme: token-based (tokens/light/dark/typography/ThemeProvider), warm
  coral + deep teal + cream palette, light+dark. AR/EN bilingual strings with
  RTL text direction per phrase; UI-language switch sets I18nManager RTL at
  onboarding (full live-toggle is a launch concern).
- Core loop: phrase card (text + translation + phonetic hint) → on-device TTS
  model voice (expo-speech, en-US/ar-SA, adjustable rate) → record attempt
  (expo-audio `useAudioRecorder`, RECORD_AUDIO permission, rationale in
  onboarding) → persist attempt to FileSystem document dir (one slot per
  phrase — new attempt replaces the old) → compare player (model vs mine,
  real progress bar for your recording) → self-score 1–5 stars → next.
- Content: 40 bundled phrases, 4 packs × 10 (Travel, Work, Daily — EN model
  for AR speakers; Arabic for English speakers — AR model). Written for the app.
- Progress: streak, phrases completed, stars earned, per-pack bars.
- Billing: react-native-iap v16 scaffold, weekly+trial per the deep-dive LTV
  rule, product `shadowsay_weekly` (create in Play Console at launch).
  Free: free pack of your learning direction + 10 attempts/day. Pro: all 4
  packs + unlimited practice.
- Supabase: one reserve migration (`backend/supabase/migrations/`) for a
  progress table with RLS locked down — no reads/writes in v1 (YAGNI).
- CI: `.github/workflows/e2e-shadowsay.yml` (shared `gradle-…-expo57` cache
  key, disk-cleanup step, paths `apps/shadowtalk/**`) + `.maestro/smoke.yaml`.
  Emulator has no mic — the smoke flow plays the TTS model and navigates
  states without ever tapping Record.

## Stubbed (honest by design)
- **Pronunciation scoring.** True automated scoring needs on-device STT/
  phoneme scoring not feasible in managed Expo without native modules or a
  paid cloud API. We do NOT ship fake AI scores: v1 = TTS model + your
  recording + side-by-side compare + self-scored stars.
  Insertion point: `lib/scoring.ts` defines the `ScoringProvider` interface
  with a `NullScoringProvider` — exactly the STT insertion-point pattern.
  When an on-device scorer exists (e.g. a Wav2Vec2/TFLite phoneme model as an
  Expo module), implement the interface and swap the export in one place.

## Left for launch
- Create `shadowsay_weekly` (weekly + free trial) in Play Console → Monetize.
- Server-side purchase verification (Palate's verify-purchase edge function
  pattern); v1 acknowledges and unlocks locally.
- Play listing assets: screenshots, feature graphic, icon art.
- 12-tester closed test (14 days) per the personal-account rule; API 36 target.
- Live mic-permission + RTL-layout check on a real device (emulator CI only
  covers navigation states).

## Policy posture (per deep-dive §4/§5)
- ≥3 differentiators vs ELSA/Duolingo/phrasebooks: (1) shadowing core loop
  not word drills, (2) AR↔EN bidirectional wedge, (3) side-by-side compare
  player with honest self-scoring, (4) situation-pack ladders with streaks.
  Distinct brand, palette, listing copy, and data model from every sibling.
- Local-only audio posture: recordings never leave the device; Data Safety
  form answers "no data collected"; privacy policy + data-safety drafts in
  `play-listing/`.
