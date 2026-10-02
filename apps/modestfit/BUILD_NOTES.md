# ModestFit — Build Notes

**Built:** 2026-10-02 · **Bench #2** (Lifestyle) · Expo SDK 57 · strict TS (tsc clean)

## What was built (honest v1)
- **Onboarding:** 3 slides + language pick (EN/AR with RTL) + modesty preferences (min sleeve / min hem / opacity).
- **Wardrobe:** owned-pieces grid with search + category filter, add-piece form (name, category, color, coverage attrs, photo via expo-image-picker copied to app document storage with the new `File`/`Directory`/`Paths` API), 40-piece EN+AR starter catalog with "adopt" buttons, delete with confirm.
- **Outfits:** create from wardrobe pieces, occasion tags, per-outfit modesty badge (✓ meets / ⚠ needs attention).
- **Planner:** 7-day strip, assign outfits per day with occasion, "mark worn" (bumps wear counts). Pro-gated.
- **Suggestions ("Shop your closet"):** deterministic combos from owned pieces only — abaya/dress solo bases or top+bottom pairs — each with a hijab pick scored by local color-harmony rules; save-as-outfit.
- **Insights:** capsule score ("N pieces → M outfits"), most-worn top 5, never-worn list. Pro-gated.
- **Profile:** appearance (light/dark/system, persisted), language, modesty prefs (editable), plan status, insights entry, paywall entry.
- **Paywall:** weekly + free trial posture (deep-dive LTV rule), product ID `modestfit_weekly`, react-native-iap v16 billing scaffold (purchase listener + silent restore; server verification at launch).
- **Free/Pro:** free = 20 pieces; Pro = unlimited + planner + insights. Gate enforced in the store (`addPiece` returns false at the limit).
- **Billing/CI artifacts:** `.maestro/smoke.yaml`, `.github/workflows/e2e-modestfit.yml` (shared `gradle-…-expo57` cache key + disk-cleanup step, paths `apps/modestfit/**`), `play-listing/` (EN + AR listings, privacy policy, data-safety draft), `backend/supabase/migrations/0001_wardrobe.sql` (schema reserved, no reads/writes in v1).
- **Logic check:** `app/lib/logic.check.ts` — 12 runnable asserts covering the modesty checker, hijab scoring, and suggestion engine; all pass.

## Deliberately stubbed / left for launch
- **NO virtual try-on** (queue verdict: AR/camera territory, out of scope v1). We compete with ALIFF/Fashion Frame on planning + modesty intelligence, not try-on.
- **Weather is manual** in the planner (zero-cost rule: no weather API). Documented as v2 in the listing copy and planner screen.
- **Billing:** product `modestfit_weekly` must be created in Play Console (weekly + free trial); purchase verification is local-only until the verify-purchase backend pass (Palate pattern).
- **App icon / adaptive-icon assets:** placeholders referenced in app.json; generate at launch.
- **RTL language toggle** after onboarding: sets `I18nManager.forceRTL` without a reload (noted in code; launch concern).
- **Cloud sync:** Supabase schema reserved; no reads/writes, no edge function (YAGNI).
- **CI workflow** is dormant until the repo exists (no GitHub push per instructions); Maestro flow written against English strings.

## Differentiation (≥3, per Play repetitive-content thresholds)
1. Modesty-first data model + outfit checker (coverage attributes on every piece; user minimums).
2. Hijab pairing engine (local color-harmony rules, zero cost).
3. Occasion + 7-day outfit planning with wear tracking.
4. Capsule wardrobe insights (pieces→outfits efficiency, most/never-worn).
