# TwoPurse — Build Notes

**Built:** 2026-10-02 · **Status:** scaffold complete, `tsc` clean, local only (no GitHub push)

## What was built

Expo SDK 57 + strict TS app at `~/workspace/apps/duobudget/app/`:
- **Theme** (`theme/`): token-based (tokens/light/dark/typography/ThemeProvider),
  terracotta+sage+cream palette, light+dark, Android-first system fonts.
- **i18n** (`lib/i18n.ts`): full EN+AR dictionary, RTL via I18nManager (set at
  onboarding / profile). Currency via `Intl.NumberFormat` (`ar-SA`/`en-US`).
- **Store** (`store/app.tsx`): single persisted AsyncStorage object
  (`@twopurse/state/v1`): envelopes, expenses, rollover credits, money-date
  completions, lang/currency/names/theme, pro flag. No state lib.
- **Screens:** Onboarding (3 slides + language + currency USD/EUR/SAR/EGP/AED/
  KWD/QAR/GBP + partner names + 6 starter envelopes) → Envelopes home
  (month selector, planned/spent/left summary, per-envelope progress cards with
  joint/mine/theirs badges + per-person split captions, FAB add-expense) →
  Money Date (month review, per-envelope bars, biggest envelope, who-spent-what
  split bar, one-tap rollover-to-savings, share summary, CSV export) →
  Profile (appearance, language, currency, names, paywall entry, local-data note).
- **Billing** (`lib/billing.ts`): react-native-iap v16, weekly SKU
  `twopurse_weekly` (trial configured in Play Console). Free: 6 envelopes.
  Pro: unlimited envelopes, money-date reports, CSV export. Paywall screen wired
  with init/restore/purchase listeners.
- **Supabase** (`backend/supabase/migrations/20261002230000_twopurse_v1.sql`):
  households / household_members / envelopes / expenses tables, RLS deny-all.
  **No reads/writes in v1 — schema only, reserves the v2 insertion point.**
- **CI/E2E:** `.maestro/smoke.yaml` (onboarding → add expense → money date →
  profile → paywall) + `.github/workflows/e2e-twopurse.yml` (shared
  `gradle-…-expo57` cache key, disk-cleanup before downloads, `apps/duobudget/**`
  paths). Dormant until repo exists.
- **Play listing:** `play-listing/` — listing-en.md, listing-ar.md,
  privacy-policy.md (local-only posture), data-safety.md (no collection declared).

## Differentiators (≥3 vs YNAB/Splitwise/Goodbudget — §4 policy threshold)

1. **Envelope-first home** — the home screen is envelopes with "left to spend"
   bars, not a transaction feed. (YNAB does envelopes but is solo and complex;
   Goodbudget is the closest incumbent — see risks.)
2. **His/hers/ours per envelope** — every envelope is tagged joint/mine/theirs
   with per-partner spending totals on joint envelopes. Splitwise splits bills;
   it doesn't budget.
3. **Month-end "money date" ritual** — a guided monthly review screen with
   one-tap rollover of leftovers into a savings envelope. No competitor frames
   the monthly close as a couples ritual.
4. **Partner mode without accounts (honest v1)** — no sign-up, no bank linking;
   "partner handoff" is a one-tap shareable plain-text monthly summary. Cloud
   two-device sync is the documented v2 insertion point (schema + RLS reserved).

## Deliberately stubbed / left for launch

- **Partner cloud sync (v2 insertion point):** migration reserves
  `households(join_code)`, `household_members`, `envelopes`, `expenses` with
  RLS deny-all. v2 work: join-code flow, device_id claims, RLS policies
  (member-only read/write), last-write-wins merge in the store, re-answer Data
  safety + update privacy policy BEFORE shipping v2.
- **Billing server verification:** client acknowledges + unlocks locally
  (Palate's verify-purchase edge-function pattern to be added at launch).
- **`twopurse_weekly` product:** create in Play Console (weekly + free trial)
  before launch; price fetch falls back gracefully until then.
- **Icons/screenshots:** `app.json` references `./assets/*` — generate the
  terracotta envelope-mark icon + EN/AR screenshot set at launch.
- **12-tester closed test:** required before production (post-Nov-2023 account
  rule); plan +3 weeks.
- No push notifications, no analytics, no bank sync (all YAGNI for v1).

## Risks / honest caveats

- Closest incumbent is **Goodbudget** (envelope method, household sync, 4.7★) —
  our wedge is couples-specific ritual + his/hers/ours + simpler onboarding,
  not feature parity. ASO must lead with "couples budget" keywords.
- v1 is **single-device**; the listing copy must not promise real-time sync
  (says "share a summary with your partner" — accurate).
- Amounts in onboarding starters are flat numbers across currencies (400 for
  Groceries whether USD or EGP) — user edits them; acceptable for v1.

## ponytail log

- No chart lib: custom `ProgressBar` + flex split bars.
- No clipboard dep: CSV export goes through the share sheet.
- Free-envelope limit enforced once in `store.saveEnvelope`, not per caller.
- `closeMonth`/`saveEnvelope` read via a state ref to avoid setState-updater
  side effects under StrictMode double-invocation.
- RTL: `‹`/`›` chevrons are direction-neutral glyphs; layout mirrors via RN RTL.
