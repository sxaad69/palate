# LanceLedger — Build Notes (v1, 2026-10-02)

App #6 of the portfolio (queue order). Freelancer expense tracker with
client profitability. Claimed via `build-queue/claimed/expensewise`.

## Name

**LanceLedger** — package `com.lanceledger.app`. Collision checks: "ExpenseWise"
heavily taken (multiple GitHub projects); "SoloLedger" taken (multiple
products); "GigProfit" is a live Play Store app (`app.gigprofit`).
LanceLedger is free — no app collisions found.

## Built

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript — `npx tsc --noEmit` clean.
- Own "ledger" palette (deep pine green on warm paper, mint profit highlights —
  NOT Palate's saffron, NOT DrySpell's dawn): `app/theme/` (tokens, light,
  dark, typography, ThemeProvider).
- EN/AR with RTL (`app/lib/strings.tsx`) — typed dictionaries, 9 currencies.
- Components: Screen, Text, Button (primary/secondary/ghost/highlight), Card
  (default/highlight tone), Chip — copied from the portfolio pattern, adapted.
- Screens: Onboarding (currency + tax %), Dashboard (month P&L hero, tax
  shield, deductible total, quick-add, recent transactions), Add (expense/
  income form: amount, category, vendor, client tag, date stepper, deductible
  toggle), Clients (profit-ranked list, 3-client free cap), ClientDetail
  (income/expense/profit + transactions), Reports (month P&L, deductible
  summary, category bars, CSV export), Paywall, Settings (currency, tax rate,
  language, appearance, export, erase).
- Store: single context (`app/store/ledger.tsx`), AsyncStorage-persisted,
  derived month P&L / tax shield / per-client stats / CSV builder.
- Billing: react-native-iap v16 scaffold, **weekly plan + free trial**
  (`lanceledger_weekly`) per the portfolio LTV rule.
- Supabase: `lanceledger_clients` + `lanceledger_transactions` migrations
  (device-keyed upsert, RLS permissive-by-device-id); best-effort sync.
- CSV export via expo-clipboard (Plus-gated).
- Maestro smoke test + CI workflow (adapted from Palate's, all lessons baked in).
- `play-listing/`: EN + AR listing drafts, privacy policy, Data Safety draft.
- Icon: generated ledger-book + coin PNG at `app/assets/icon.png`.

## Stubbed / left for launch

- **Play Console product `lanceledger_weekly` not created** — weekly
  subscription with 7-day free trial must be configured before purchases work.
- **Server-side purchase verification not built** — provisional local unlock;
  Play Developer API verification is launch work.
- **Supabase migration not applied live.**
- No GitHub repo created / nothing pushed (local-only per instructions).
- AR translations written by the builder, not a native speaker — review before launch.

## Differentiation vs Wave / Zoho (free incumbents)

1. Per-client profitability ranking (income − expenses per client).
2. Tax shield: auto-computed set-aside from real profit × your rate.
3. Deductible flagging + one-tap CSV tax report.
4. AR/EN RTL bilingual.
