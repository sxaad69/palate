# Fernly — Build Notes (2026-10-03)

## Built
- **App:** Expo SDK 57, strict TypeScript (`npx tsc --noEmit` clean), token theme (light/dark/system), EN/AR with I18nManager RTL (full layout mirror applies after restart — RN behavior), single-context store + AsyncStorage, Android-first 48dp targets.
- **Screens:** Onboarding (species multi-picker), Today (due/overdue tasks + care streak), Plants (collection + FAB), PlantAdd (species + nickname), PlantDetail (care schedule per type + tips + remove), Doctor (symptom picker → diagnosis), Profile (stats, language, appearance), Paywall.
- **Domain logic:** `lib/plants.ts` (schedules, due/upcoming tasks, care streak — pure), `lib/doctor.ts` (rule-based diagnosis — pure), `data/plants.ts` (12-species offline library, EN/AR).
- **The wedge (≥3 differentiators vs Planta/PictureThis):**
  1. **Plant Doctor** — 10 symptoms → 8 weighted diagnoses with cause + treatment (EN/AR), urgency-ranked. The "disease ID" wedge with zero inference cost, fully offline
  2. **Adaptive care schedules** — water/fertilize/mist per species computed from actual logs, overdue highlighting
  3. **Offline-first 12-plant library** — no account, no network needed
  4. **Bilingual EN/AR day one** with full RTL — incumbents are English-first
- **Billing:** react-native-iap v16 scaffold, weekly SKU `fernly_pro_weekly`, 7-day free trial configured in Play Console (not code). Paywall = weekly only, per deep-dive LTV rule.
- **Backend:** `backend/supabase/migrations/20261003000000_plants.sql` (plants + plant_events, RLS deny-all) + `backend/supabase/functions/fernly/index.ts` (sync/list via service role). Shares Saad's Supabase project for now (distinct tables).
- **Icon:** PIL-generated — lime sprout with leaves over a soil mound on deep forest; adaptive foreground/background/monochrome + favicon + splash-icon.
- **CI/tests:** `.maestro/smoke.yaml` (onboard → done task → plants → doctor diagnose → profile → paywall), `.github/workflows/e2e.yml` copied from Pip (same battle-tested shape).
- **play-listing/:** EN + AR drafts, privacy policy, Data Safety draft.

## Stubbed (works locally, needs launch wiring)
- **Server sync:** union-by-id merge on boot; no conflict resolution beyond id dedupe. Migration NOT applied yet — apply with `supabase db push` or the dashboard SQL editor before first device test.
- **Purchase verification:** `verify-purchase` edge function does not exist yet (shared portfolio gap) — purchases grant Pro client-side until server verification is wired.

## Left for launch (deliberate, not this build stage)
- Play Console: create `fernly_pro_weekly` product with 7-day free trial, Data Safety form, EN/AR listings, privacy policy URL.
- Support email placeholder (`fernly-support@example.com`) → real address.
- Push-notification reminders for due tasks (OneSignal free tier) — the natural retention driver for this app; post-launch.
- More species in the library; photo-based disease ID is explicitly out of scope for v1 (rule-based doctor is the wedge).
- Dedicated Supabase project per app (recommended at launch).
- Monorepo-ready: move to `apps/fernly/` + CI path prefix after Palate CI goes green.
