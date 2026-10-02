# Naplet — Build Notes (2026-10-03)

## Built
- **App:** Expo SDK 57, strict TypeScript (`npx tsc --noEmit` clean), token theme (light/dark/system), EN/AR with I18nManager RTL (full layout mirror applies after restart — RN behavior), single-context store + AsyncStorage, Android-first 48dp targets (giant 3am buttons: 120dp).
- **Screens:** Onboarding (baby name + units + 24h), Today (status hero + day summary + timeline, long-press to delete), Log (the 3am screen: giant sleep start/stop, feed, diaper), Feed editor (breast L/R/both, bottle ml/oz, solid), Diaper editor, Stats (totals + insight cards), Profile (name, family sync code, language, appearance, units, 24h), Paywall.
- **Domain logic:** `lib/baby.ts` — event model (sleep/feed/diaper), day summaries, longest stretch, avg feed interval, sleep↔feeding insight keys. Pure, no React.
- **The wedge (≥3 differentiators vs Baby Tracker/Huckleberry/Nod):**
  1. **3am night mode** — giant one-thumb buttons, dim colors, follows system dark theme
  2. **Sleep↔feeding insight cards** — on-device correlations (longest stretch, feed intervals, early-bedtime pattern)
  3. **Family sync via short code** — no accounts; every caregiver shares one timeline (Supabase, last-write-wins on `updated_at_ms`)
  4. **Bilingual EN/AR day one** with full RTL — incumbents are English-first
- **Billing:** react-native-iap v16 scaffold, weekly SKU `naplet_pro_weekly`, 7-day free trial configured in Play Console (not code). Paywall = weekly only, per deep-dive LTV rule.
- **Backend:** `backend/supabase/migrations/20261003000000_baby_events.sql` (baby_events, RLS deny-all, unique on family_code+event_id) + `backend/supabase/functions/naplet/index.ts` (sync with server-side last-write-wins + list). Shares Saad's Supabase project for now (distinct table).
- **Icon:** PIL-generated — violet crescent + stars on deep plum; adaptive foreground/background/monochrome + favicon + splash-icon.
- **CI/tests:** `.maestro/smoke.yaml` (onboard → sleep start/stop → feed → stats → profile → paywall), `.github/workflows/e2e.yml` copied from Pip (same battle-tested shape).
- **play-listing/:** EN + AR drafts, privacy policy, Data Safety draft.

## Stubbed (works locally, needs launch wiring)
- **Family sync:** works end-to-end against the edge function, but the migration is NOT applied yet — apply with `supabase db push` or the dashboard SQL editor before testing sync. Family code is a short user code (not a secret): anyone with the code reads/writes the timeline — noted in the privacy policy.
- **Purchase verification:** `verify-purchase` edge function does not exist yet (shared portfolio gap) — purchases grant Pro client-side until server verification is wired.

## Left for launch (deliberate, not this build stage)
- Play Console: create `naplet_pro_weekly` product with 7-day free trial, Data Safety form, EN/AR listings, privacy policy URL.
- Support email placeholder (`naplet-support@example.com`) → real address.
- Multi-baby support (twins) — data model supports it via family code, UI is single-baby v1.
- Birth-date/age-based sleep guidance — post-launch.
- Dedicated Supabase project per app (recommended at launch).
- Monorepo-ready: move to `apps/naplet/` + CI path prefix after Palate CI goes green.
