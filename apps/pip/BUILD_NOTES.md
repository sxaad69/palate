# Pip — Build Notes (2026-10-03)

## Built
- **App:** Expo SDK 57, strict TypeScript (`npx tsc --noEmit` clean), token theme (light/dark/system), EN/AR with I18nManager RTL (full layout mirror applies after restart — RN behavior), single-context store + AsyncStorage, Android-first 48dp targets.
- **Screens:** Onboarding (template picker, pick 1–3 starter recipes), Today (recipe cards → Done → **Shine** celebration moment), Recipes (+ editor), Progress (stats + weekly dots), Profile (streak, language, appearance), Paywall.
- **Method, made structural (the 3+ differentiators vs Loop/Streaks):**
  1. **Recipe builder** — every habit is "After I [anchor], I will [behavior]" with an anchor-suggestion library, not a free-text checklist
  2. **Shine moment** — post-check-in celebration ritual with a celebration picker (the part every other tracker skips)
  3. **Shrink coach** — miss 2+ days → Fogg's debugging rule surfaces "Make it tinier" with a hint, linking straight into the editor
- **Logic:** `lib/habits.ts` — streaks (survives from yesterday), `shouldShrink` (≥2-day gap), week dots, stats. Pure, no React.
- **Billing:** react-native-iap v16 scaffold, weekly SKU `pip_pro_weekly`, 7-day free trial configured in Play Console (not code). Paywall = weekly only, per deep-dive LTV rule.
- **Backend:** `backend/supabase/migrations/20261003000000_habit_events.sql` (habit_events, RLS deny-all) + `backend/supabase/functions/habits/index.ts` (log/list via service role). Shares Saad's Supabase project for now (distinct table).
- **Icon:** PIL-generated — white seed tilted 24° in a sky-blue ring with sprout dot on deep navy; adaptive foreground/background/monochrome + favicon + splash-icon.
- **CI/tests:** `.maestro/smoke.yaml` (onboard → done → shine → tabs → paywall), `.github/workflows/e2e.yml` copied from Fastuna (same battle-tested shape).
- **play-listing/:** EN + AR drafts, privacy policy, Data Safety draft.

## Stubbed (works locally, needs launch wiring)
- **Server sync:** `fetchEventsFromServer`/`logEventToServer` merge on boot; no conflict resolution, no delete propagation. Migration NOT applied yet — apply with `supabase db push` or the dashboard SQL editor before first device test.
- **Purchase verification:** `verify-purchase` edge function does not exist yet (same shared gap as Fastuna) — purchases grant Pro client-side until server verification is wired.

## Left for launch (deliberate, not this build stage)
- Play Console: create `pip_pro_weekly` product with 7-day free trial, Data Safety form, EN/AR listings, privacy policy URL.
- Support email placeholder (`pip-support@example.com`) → real address.
- Dedicated Supabase project per app (recommended at launch; table name `habit_events` won't collide if sharing).
- Monorepo-ready: app lives in `apps/pip/`-style layout (move + CI path prefix) after Palate CI goes green.
- **Rename note:** queue name "Fastwell" was taken (wicknixon/fastwell + fastwellstore.com) → built as **Fastuna** (com.fastuna.app). Claim dir `claimed/fastwell` retained for queue bookkeeping.
