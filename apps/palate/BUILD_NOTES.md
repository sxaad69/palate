# Palate — Build Notes

App #1 of the portfolio. AI nutrition recognizer for non-Western cuisines worldwide: snap a meal → identify dish/portion → matched against a curated 96-dish database → confirm/log.

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript (`npx tsc --noEmit` clean)
- Token-based theme (light/dark), AR/EN with RTL
- Screens: onboarding, Today, Scan, Dish detail, Progress, Profile, Paywall
- Backend: Supabase (`ajzypbzojvgflajkkwnr`) — dishes DB, analyze-meal edge function (Gemini→NVIDIA fallback), purchase ledger, persistent meals, IP rate limiting, Play Integrity plumbing
- Billing: react-native-iap 16.7.2, product `palate_pro_monthly` (rework to weekly+trial pending — launch phase)
- CI: .github/workflows/e2e-palate.yml (emulator + Maestro, full disk-budget fixes)
- Gamification v1: XP, levels, streaks, cuisine badges

Launch-deferred: Play Console product setup, purchase-ledger migration live, verify-purchase deploy, service account + PLAY_SERVICE_ACCOUNT_JSON, weekly+trial rework.
