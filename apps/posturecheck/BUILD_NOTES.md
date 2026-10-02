# StraightUp — Build Notes

Bench #3 of the portfolio (Health & Fitness). Local-only build; nothing pushed to GitHub.

## Built
- Expo SDK 57, strict TypeScript (`tsc --noEmit` clean), Android-first.
- Token-based theme (navy/lime/light-gray, designed from scratch — not reused from any sibling), light + dark, system/body typography scale, SafeArea on every screen.
- Component library first: Screen, PostureText, Button (haptics, ripple/opacity, 48dp targets), Card (platform shadows), ScoreRing, Toggle, AngleCard, ExerciseRow.
- AR/EN bilingual throughout with RTL (I18nManager.forceRTL on language switch, set at onboarding).
- AsyncStorage local-first single persisted state (`store/app.tsx`): onboarding, lang, theme mode, checks, exercise log, reminders, pro.
- Check flow: guided capture (expo-camera with alignment overlay guides, gallery fallback via expo-image-picker) → landmark placement (5 draggable markers via PanResponder, plumb-line reference) → results.
- **Honest scoring** (`lib/pose.ts`): real 2D geometry from marker positions — forward-head angle, shoulder-lean angle, knee interior angle, hip-offset % of body height. Score = 100 − fixed deductions per weak angle; thresholds and formula shown in-app (onboarding + results + profile). Runnable self-check: `lib/pose.check.ts` (no framework; asserts perfect/forward-head/knee-bend/watch-band/provider-null/score-floor cases — all passing).
- Exercise library: 12 desk-posture exercises, EN+AR instructions, each mapped to the angle(s) it corrects; results prescribe from actual weak angles (`prescribeFor`).
- History: timeline with photo thumbnails, scores, per-check detail modal, side-by-side comparison vs previous check with score delta, per-check delete (photo file deleted too).
- Posture nudges: expo-notifications local repeating reminders (30/60/120 min), permission-gated, no server.
- Billing scaffold: react-native-iap v16, weekly+trial (`straightup_weekly`; trial configured in Play Console per the deep-dive LTV rule). Free: 3 checks/month; Pro: unlimited + full history + programs.
- Paywall, onboarding (3 slides + language pick + camera rationale + honest scoring explainer), profile (appearance/language/reminders/paywall/medical disclaimer).
- `.maestro/smoke.yaml` + `.github/workflows/e2e-posturecheck.yml` (shared `gradle-…-expo57` cache key, disk-cleanup step; emulator has no real camera so smoke navigates the check entry without capture).
- `backend/supabase/migrations/20261002230000_posturecheck_v1.sql` — reserves cloud sync shape; nothing reads/writes in v1.
- `play-listing/`: EN/AR listings, privacy policy, data safety (local-only; no data collected).

## Stubbed (documented insertion points)
- **`PoseProvider` (`lib/pose.ts`)** — the interface a future on-device ML pose provider implements: `detectLandmarks(photoUri) → Record<LandmarkKey, Landmark> | null`. v1 ships `ManualLandmarkProvider` (always returns null by design; the landmark screen collects user-placed markers). A future MLKit/MediaPipe provider drops in behind this interface with zero changes to the scoring pipeline. Record `providerId` on every check so future mixed-provider data stays comparable.

## Left for launch
- Create `straightup_weekly` (weekly + free trial) in Play Console > Monetize; wire server-side purchase verification (Palate's verify-purchase edge-function pattern); the client currently acknowledges and unlocks locally.
- Generate store screenshots/icon set from the navy/lime brand; 12-tester closed test (new-account rule).
- Supabase cloud sync: migration exists; no client reads/writes yet (YAGNI for v1).
- Notification icon asset is a placeholder glyph (fine for v1).

## Deliberate ceilings (ponytail)
- 2D side-profile geometry only; assumes the photo is taken from the side at hip height (capture guides enforce this). Not a medical measurement — the medical disclaimer ships on the profile screen and in the listing.
- Marker placement error is the dominant noise source; "watch" bands are deliberately wide.
- Reminder scheduling uses a simple repeating interval trigger; quiet-hours windowing is a v2 concern.
- Language switch applies immediately to strings; full RTL layout pass on every screen is a launch QA item.
