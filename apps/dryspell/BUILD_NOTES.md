# DrySpell — Build Notes (v1, 2026-10-02)

App #4 of the portfolio. Sobriety counter with money-saved math.

## Name

**DrySpell** — package `com.dryspell.app`. The queue said "ClearDays", but
collision check found a live product in this exact niche (cleardays.co —
"Drink less. Make room for more." — plus Android app `com.cleardays.test`),
so it was renamed per the queue's collision rule. "ZeroProof" was also
checked and is taken (Play Store app). DrySpell is free in the sobriety
niche (only unrelated agriculture/WoW references).

## Built

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript — `npx tsc --noEmit` clean.
- Dawn token theme (own palette — soft sky blue → gentle gold; NOT Palate's saffron): `app/theme/` (tokens, light, dark, typography, ThemeProvider with system/light/dark preference).
- EN/AR with RTL (`app/lib/strings.tsx`) — typed dictionaries, `I18nManager.forceRTL`, logical layout throughout.
- Components: Screen, Text, Button (primary/secondary/ghost/gold), Card (default/gold tone), Chip.
- Screens: Onboarding (habit + daily spend + start date, skippable), Dashboard (live days/hrs/min/sec counter, money saved, next milestone, daily pledge, encouragement quote, SOS entry), Milestones (8-step body-recovery timeline, wellness-framed, standing "not medical advice" disclaimer), Journal (30 free entries, then Plus nudge), Achievements (13 streak + savings badges), SOS (breathing pacer, personal reasons, pledge, distract ideas), Savings Goals (Plus), Paywall, Profile (language, appearance, reasons editor, reset, medical disclaimer).
- Store: single context (`app/store/sobriety.tsx`), AsyncStorage-persisted, 1-second tick for the live counter.
- Billing: react-native-iap v16 scaffold, **weekly plan + free trial** (`dryspell_weekly`) per the portfolio LTV rule. Paywall shows weekly price, trial copy, subscribe + restore.
- Supabase: `dryspell_progress` table migration (device-keyed upsert, RLS permissive-by-device-id); app syncs best-effort, works fully offline.
- Maestro smoke test (`.maestro/smoke.yaml`) covering onboarding → dashboard → pledge → all 5 tabs.
- CI workflow (`.github/workflows/e2e.yml`) adapted from Palate's with all lessons baked in (no setup-android, disk cleanup before Maestro install, Gradle cache, 240-min timeout).
- `play-listing/`: EN + AR listing drafts, privacy policy, Data Safety draft.
- Icon: generated dawn-gradient (sky → gold sun) PNG at `app/assets/icon.png`.

## Stubbed / left for launch

- **Play Console product `dryspell_weekly` not created** — weekly subscription with 7-day free trial must be configured in Monetize > Subscriptions before any purchase can succeed.
- **Server-side purchase verification not built** — the app provisionally unlocks Plus on purchase and finishes the transaction; a Play Developer API verification step (edge function like Palate's verify-purchase) is launch work.
- **Supabase migration not applied live** — apply `backend/supabase/migrations/20261002_dryspell_progress.sql` to the shared project when convenient.
- No GitHub repo created / nothing pushed (local-only per build instructions).
- AR translations are functional but were written by the builder, not a native speaker — worth a review pass before launch.

## Differentiation vs Trifoil's Sober (≥3, Play repetitive-content)

1. Savings goals with visual progress (money allocated toward tangible targets).
2. Craving SOS mode: breathing pacer + personal "why" reasons + daily pledge.
3. Health recovery milestone timeline with celebrations (wellness-framed).
4. Multi-habit in one app (alcohol, smoking, other) — Trifoil splits these.
