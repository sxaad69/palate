# KeepsFresh — Build Notes (2026-10-02)

Portfolio App #10 — pantry & expiry tracker. Built local-only; **not pushed to GitHub** per instructions.

## Built

- **Scaffold:** Expo SDK 57, strict TypeScript (`tsc --noEmit` clean), `react-navigation` bottom tabs, AsyncStorage single persisted state object (`@keepsfresh/state/v1`), react-native-iap v16 billing.
- **Theme:** token-based (tokens/light/dark/typography/ThemeProvider), fresh-greens + warm-cream palette designed from scratch, light+dark, `ThemeMode` persisted in store and driving ThemeProvider (controlled mode).
- **Component library:** `KText`, `Screen`, `Button` (primary/secondary/ghost/destructive), `Input` (label-above, error state), `Card` (platform-correct elevation).
- **i18n:** full EN+AR dictionary with RTL (`I18nManager`), language pick on onboarding + Profile toggle.
- **Screens:** Onboarding (3 slides + language), Pantry (urgency groups: expired/use soon/this week/fresh + search), Add/Edit item sheet with ~60-food smart-default DB (EN+AR names, per-food shelf life, location, est. price), Alerts (waste-risk queue + local reminder toggle), Stats (waste-saved hero, tiles, weekly report, CSV export), Profile (appearance/language/notifications/paywall/restore/about), Paywall (weekly + trial, `keepsfresh_weekly`).
- **Differentiators (≥3, vs typical expiry apps / notes workarounds):**
  1. Waste-risk urgency queue — `wasteRisk = perishability × qty × max(1, 4 − daysLeft)`, not a date list.
  2. Waste-saved money counter + weekly waste report (used vs wasted events).
  3. Smart expiry defaults — 60-item DB pre-fills shelf life/location/price; user adjusts.
  4. Local-first + AR/EN bilingual + household-sharing schema reserved (no cloud in v1).
- **Notifications:** `expo-notifications`, local-only scheduling for items expiring ≤2 days; cancel-all + debounced reschedule on item/toggle change (ponytail: O(n) fine for ≤hundreds of items); best-effort, never breaks the pantry.
- **Billing:** `lib/billing.ts` — init/restore/purchase listeners, `buyWeekly()` via `requestPurchase({request:{google:{skus}}}, type:'subs')`; local entitlement flag. Free limit: 30 items → paywall.
- **Supabase:** one migration (`20261002224500_keepsfresh_v1.sql`) reserving `households` + `pantry_items` for future sharing; **no reads/writes in v1, no edge function**.
- **CI:** `.maestro/smoke.yaml` (onboarding → add "Milk" → pantry/alerts/stats/profile → paywall) + `.github/workflows/e2e-keepsfresh.yml` (shared `gradle-…-expo57` cache key, disk-cleanup before downloads, paths `apps/keepsfresh/**`). Dormant until repo exists.
- **play-listing/:** listing-en.md, listing-ar.md (ASO keywords: expiry date tracker, food waste, pantry organizer, use by date reminder), privacy-policy.md, data-safety.md (local-only posture).

## Stubbed / simplified (v1 ceilings)

- Notification scheduling is cancel-all + reschedule (debounced 800ms) — fine for pantry-scale lists.
- Expiry set via day-stepper + quick chips (3/7/14/30), not a native date picker — no new dep, and relative dates match the use case.
- Prices are rough USD estimates from the food DB, editable per item; waste-saved $ is directional, not accounting.
- i18n `daysLabel` uses simple AR pluralization (يوم واحد/يومان/N أيام).
- Tab/modal icons are emoji glyphs (dependency-free, portfolio convention).

## Left for launch

- [ ] Create `keepsfresh_weekly` subscription in Play Console (weekly billing + free trial) — product ID already wired in code.
- [ ] Server-side purchase verification (verify-purchase edge function pattern from Palate) — currently acknowledge-and-unlock locally.
- [ ] App icon / adaptive icon assets (`app.json` references `./assets/*` — generate before prebuild).
- [ ] Household sharing against the reserved Supabase schema (post-launch).
- [ ] Tester pool + 12-tester/14-day closed test per Play policy before production.
- [ ] EAS build / `expo prebuild` sanity run (not run in this sandbox).
