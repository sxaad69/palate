# Pawscript — Build Notes (v1, 2026-10-02)

App #17 of the portfolio (queue order). Pet medication & vet records (Lifestyle).
Claimed via `build-queue/claimed/17-petmed`. Local build only — **never pushed to GitHub.**

## Name
**Pawscript** — package `com.pawscript.app`. Collision checks: PetMinder (Play app),
PawDose (iOS app), VetVault (iOS app), DosePaw (web app) all taken — see BRAND.md.

## Built
- Expo SDK 57, React Native 0.86, React 19, strict TypeScript — `node node_modules/typescript/bin/tsc --noEmit` clean.
- Own "warm companion" palette (playful teal + warm amber + cream, warm-brown neutrals; dark = warm charcoal): `app/theme/` (tokens, light, dark, typography, ThemeProvider).
- EN/AR with RTL (`app/lib/i18n.ts`) — full string coverage for all screens; language pick on onboarding + switchable in Profile.
- Components: Screen, PawText, Button (primary/dose/secondary/ghost/destructive), Card (pet color-bar), Input, Chip, EmptyState, PetAvatar, ModalShell.
- Screens: Onboarding (3 slides + language pick + optional notification enable), Pets (pet cards w/ upcoming-dose counts), Doses (multi-pet "due now / later today" timeline, given/skip/undo), Records (vaccinations w/ overdue/due-soon badges + vet-visit log, per-pet), Stats (7-day adherence % per med, weekly doses, streaks), Profile (appearance, language, paywall entry, erase), Paywall.
- Modals: AddPet (photo via expo-image-picker → copied to FileSystem document dir with the new `File`/`Directory`/`Paths` API), PetDetail (meds, weight log w/ trend delta, prep sheet, delete), AddMedication (name, dose, frequency quick-sets + editable HH:MM times, start/end dates), AddWeight, AddVisit, AddVaccine, PrepSheet (share via OS share sheet; Pro-gated).
- Store: single context (`app/store/app.tsx`) — pets, meds, dose events, vaccinations, visits, weight log; AsyncStorage-persisted; cascade deletes.
- Schedule engine: `app/lib/schedule.ts` — pure, zero-import functions (occurrences, weekly-weekday logic, adherence, streaks); **runnable check**: `/tmp/schedcheck/check.js` — ALL PASS.
- Reminders: expo-notifications 0.32.12, local daily repeating per dose time, rescheduled on every med change / language switch (`lib/notifications.ts` + `ReminderSync` in App).
- Billing: react-native-iap v16 scaffold, **weekly plan + free trial** (`pawscript_weekly`) per the portfolio LTV rule. Free = 1 pet; Pro = unlimited pets + prep sheet + export.
- Supabase: `backend/supabase/migrations/20261002_pawscript.sql` — pets/meds/doses/vaccinations/visits DDL + device-keyed RLS (cloud sync reserved; NO reads/writes from the app in v1, no edge function).
- Maestro smoke test + CI workflow (adapted from Fable's: shared `gradle-…-expo57` cache key, disk-cleanup after APK build before Maestro download, paths `apps/petmed/**`).

## Stubbed / simplified (deliberate)
- Time/date entry = validated text inputs (HH:MM, YYYY-MM-DD) instead of `@react-native-community/datetimepicker` — native picker at launch if testers complain.
- No photo on Maestro/CI path (image picker needs a real device gallery).
- Exact-alarm behavior: notifications are best-effort; verify delivery on a real device at launch (see data-safety.md note).

## Left for launch
- Create `pawscript_weekly` subscription in Play Console (weekly + free trial) — product ID wired in `lib/billing.ts`.
- Server-side purchase verification (Palate's verify-purchase edge-function pattern).
- Real-device verification: notification delivery, RTL layout pass, photo copy path, both themes per screen.
- 12 testers × 14 days closed test (post-Nov-2023 account rule).
- Icon/screenshots/feature graphic; privacy policy hosted URL in listing.
- Supabase cloud sync (opt-in) — schema is ready; add client + sync engine + update data-safety.
