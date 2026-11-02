# Palate — Build Notes

App #1 of the portfolio. AI nutrition recognizer for non-Western cuisines worldwide: snap a meal → identify dish/portion → matched against a curated 96-dish database → confirm/log.

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript (`npx tsc --noEmit` clean)
- Token-based theme (light/dark), AR/EN with native RTL layout
- Screens: Onboarding, Today, Scan, Dish detail, Progress, Profile, Paywall
- Backend: Supabase (`ajzypbzojvgflajkkwnr`) — dishes DB, analyze-meal edge function (Gemini→NVIDIA fallback), purchase ledger, persistent meals, IP rate limiting, Play Integrity plumbing
- Billing: Updated to high-LTV weekly subscription `palate_pro_weekly` ($2.99/week + 7-day free trial) with backward compatibility for `palate_pro_monthly`.
- CI/Testing: Dedicated deep coverage suite `.github/workflows/e2e-palate.yml` executing extended boundary tests (0.5 portion min, 2.0 portion max), cross-screen Dark Mode visual verification, and universal screenshot collection (`*.png`).
- Gamification v1: XP, levels, streaks, cuisine badges.

## Production Launch Checklist
- [x] Weekly + 7-day free trial billing rework (`palate_pro_weekly`) wired in `app/lib/billing.ts` and `PaywallScreen.tsx`.
- [x] Deep boundary & dark-mode E2E suite wired in `.maestro/full-coverage.yaml`.
- [x] Full Play listing assets prepared in `play-listing/` (EN/AR listings, data safety, privacy policy).
- [ ] Configure `palate_pro_weekly` subscription product in Google Play Console with 7-day trial.
- [ ] Deploy Supabase `verify-purchase` and `purchase_ledger` migration live with Google Play Developer Service Account JSON.
- [ ] Enroll in Google Play 15% service fee tier before opening closed testing.
