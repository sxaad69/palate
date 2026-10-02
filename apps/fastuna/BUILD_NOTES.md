# Fastuna — Build Notes (2026-10-03)

**Name:** Fastuna (renamed from Fastwell — "Fastwell" is taken by a shipping
fasting app: wicknixon/fastwell on GitHub + fastwellstore.com; the Fast*
namespace is gone. "Fastora" is also taken on Play. Fastuna had no collisions.)
**Package:** `com.fastuna.app` · **Brand:** teal/deep-green, own palette (see BRAND.md)

## Built
- Expo SDK 57 app in `app/`, strict TS (`npx tsc --noEmit` clean).
- Token theme: teal + pine + cool slate primitives → light/dark semantic
  mappings (ThemeProvider, system/light/dark). No saffron anywhere.
- Screens: Onboarding (goal chips + preset picker with wedge badges),
  Timer (live SVG countdown ring, start/stop, ±30 min start adjust, fasting
  stage timeline with plain-language "what's happening"), Presets (16:8, 18:6,
  20:4, OMAD + Ramadan / night-shift / gentle-14:10 wedge presets),
  History (stats cards + fast log), Profile (streak, achievements, EN/AR
  toggle, appearance), Paywall.
- Store (`store/app.tsx`): single context + AsyncStorage, fasts log,
  active fast, streaks (consecutive days), 5 achievements, goal, language.
  Server merge on launch (server wins on id).
- i18n: EN/AR string dictionaries; language toggle flips RTL via
  I18nManager (full layout mirror applies after app restart — RN behavior).
- Billing: react-native-iap v16 scaffold, **weekly** SKU
  `fastuna_pro_weekly` (+ 7-day free trial — configured in Play Console, not
  in code). Subscribe / restore / server verify hook.
- Supabase: `backend/supabase/migrations/20261003000000_fasts.sql`
  (fasts table, RLS deny-all, service-role via edge fn) +
  `backend/supabase/functions/fasts/index.ts` (log/list actions).
  Shares Saad's Supabase project with Palate for now (distinct table).
- Maestro smoke test (`.maestro/smoke.yaml`) + CI workflow
  (`.github/workflows/e2e.yml`, copied from Palate's battle-tested version).
- Brand assets: icon.png, adaptive foreground/background/monochrome,
  favicon, splash-icon (teal fasting ring on deep pine).
- `play-listing/`: EN + AR listing drafts, privacy policy, Data Safety draft.

## Stubbed / simplified (v1 ceilings)
- Timer tick is screen-local (1s interval); no background notifications —
  fast end alerts are a v2 feature.
- Ramadan preset uses editable suggested times (default 03:30 start), not
  live prayer-time API — a location/prayer-times pack is the obvious Pro v2.
- No charts library; stats are cards.
- `verify-purchase` edge function does not exist yet — billing lib calls it
  and fails closed; needs the Play Developer API service account (launch).
- Streak-repair is listed as a Pro feature but not implemented (gated by Pro).

## Left for launch
- Play Console: create `fastuna_pro_weekly` subscription + 7-day free trial,
  upload build, complete listing (use play-listing/ drafts), Data Safety form.
- Supabase: run the fasts migration + deploy the fasts function (secret key
  needed); or move to a dedicated project per app.
- Replace `fastuna-support@example.com` in the privacy policy.
- EAS production build + submit (`eas.json` included).
- Restart caveat for RTL: verify AR layout mirror on a real device.

## Monorepo note
Built standalone mirroring Palate's layout (`app/`, `.maestro/`,
`.github/`). When the monorepo restructure happens, move this tree to
`apps/fastuna/` and prefix CI paths (`apps/fastuna/**`).

## Differentiation vs Zero/Fastic (Play repetitive-content threshold)
≥3 unique features: (1) Ramadan dawn-to-sunset preset with adjustable
suhoor/iftar times, (2) night-shift inverted schedule preset,
(3) gentle 14:10 preset for women 45+. Plus EN/AR RTL as a feature, not the brand.
