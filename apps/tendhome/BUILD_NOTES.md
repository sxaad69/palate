# TendHome — Build Notes (v1, 2026-10-03)

App #20 of the portfolio (queue order). Home maintenance reminder log.
Claimed via `build-queue/claimed/20-homecare` (claim is by number per protocol).

## Name

**TendHome** — package `com.tendhome.app`. Collision-checked: "Hearth"
(multiple home-maintenance projects), "Mend" (same-category iOS app),
"DwellWell" (exact-concept app with Home Health Score) all taken.
"TendHome" has no app collisions.

## Built

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript — `npx tsc --noEmit` clean.
- Own "terracotta + warm charcoal on cream" palette (NOT reused from any sibling): `app/theme/`.
- EN/AR with RTL (`app/lib/strings.tsx`).
- Components: Screen, Text (with align), Button, Card, Chip.
- Content: 24-task pre-loaded library across 6 categories (HVAC, Safety,
  Plumbing, Exterior, Appliances, General) with intervals, time estimates,
  seasonal tags, and "why it matters" (`app/data/tasks.ts`).
- Derived logic (`app/lib/home.ts`): next-due, status (new/overdue/
  due-soon/ok), urgency-sorted attention queue, due labels. Pure, no React.
- Screens: Onboarding, Home ("Needs attention" urgency queue + all-good
  state), Tasks (library browser grouped by category, enable switches,
  custom task creator), TaskDetail (facts, why-it-matters, mark-done with
  cost, history, custom edit/delete), Costs (this-year + total spend,
  Plus-gated annual category insights), Paywall, Settings (language,
  appearance, reminder toggle, climate note, erase).
- 8 essential tasks enabled by default; never-done tasks show as "due now"
  (get started); mark-done auto-computes next due.
- Due-date local notifications (expo-notifications, 9 AM, next 14 days),
  rebuilt on every change (`ReminderSync`).
- Store: single context (`app/store/home.tsx`) — tasks, completions,
  settings, AsyncStorage-persisted.
- Free: 10 enabled tasks. Plus: unlimited tasks + annual cost insights +
  seasonal checklists.
- Billing: react-native-iap v16 scaffold, **weekly plan + free trial**
  (`tendhome_weekly`) per the portfolio LTV rule.
- Supabase: `tendhome_tasks` + `tendhome_completions` migrations
  (device-keyed, RLS permissive-by-device-id).
- Maestro smoke test + CI workflow (adapted from Palate's, all lessons baked in).
- `play-listing/`: EN + AR listing drafts, privacy policy, Data Safety draft.
- Icon: generated terracotta house PNG at `app/assets/icon.png`.

## Stubbed / left for launch

- **Play Console product `tendhome_weekly` not created** — weekly + 7-day
  trial must be configured before purchases work.
- **Server-side purchase verification not built** — provisional local unlock;
  Play Developer API verification is launch work.
- **Supabase migration not applied live.**
- **Notification delivery not verified on a real device.**
- Seasonal checklists (Plus feature) are listed but the dedicated seasonal
  view is not built — launch work.
- No GitHub repo created / nothing pushed (local-only per instructions).
- AR translations written by the builder, not a native speaker — review before launch.
- Intervals are sensible defaults, not professional advice — noted in-app.

## Differentiation vs Todoist / Centriq / HomeZada

1. Pre-loaded maintenance library with real intervals — not a blank list.
2. Seasonal tags — right tasks at the right time.
3. Cost tracking → annual maintenance spend (Plus insights).
4. AR/EN RTL, offline-first, no account.
