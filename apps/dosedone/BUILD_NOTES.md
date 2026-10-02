# DoseDone — Build Notes (v1, 2026-10-02)

App #8 of the portfolio (queue order). Senior-friendly medication reminder —
big-button UX. Claimed via `build-queue/claimed/seniormeds`. (#7 tiny-habits
was already claimed by another agent; moved to next in order.)

## Name

**DoseDone** — package `com.dosedone.app`. Collision checks: "PillPal" and
"MedMinder" are taken (pill-dispenser startups). DoseDone is free — no app
collisions found. The name is the core loop: take the dose, mark it done.

## Built

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript — `npx tsc --noEmit` clean.
- Own "care" palette (deep teal + warm amber TAKE action, AAA-contrast
  neutrals — NOT Palate's saffron, DrySpell's dawn, or LanceLedger's pine):
  `app/theme/` (tokens, light, dark, typography).
- Senior-first type scale: body 18sp (portfolio default 16), display 36 —
  every step bumped 2sp. 56–64dp primary touch targets.
- EN/AR with RTL (`app/lib/strings.tsx`) — short, plain sentences.
- Components: Screen, Text, Button (primary/secondary/ghost/action), Card
  (default/action tone), Chip.
- Screens: Onboarding (3 steps + notification permission), Today (dose cards
  with giant TAKE button, taken/undo, missed flagging, low-stock refill
  cards), Meds (list + add/edit form with HH:MM time pickers, pills per dose,
  bottle count, low threshold; 3-med free cap), Progress (7-day adherence %,
  streak, day bars), Family (Plus-gated big-text caregiver report), Paywall,
  Settings (language, appearance, erase, medical disclaimer).
- Store: single context (`app/store/meds.tsx`) — meds, dose logs,
  derived today-dose statuses (taken/due/upcoming/missed with 2h grace),
  7-day adherence, streak, low-stock detection. AsyncStorage-persisted.
- Reminders: expo-notifications, local daily repeating notifications per dose
  time, rescheduled on every med change / language switch
  (`lib/notifications.ts` + `ReminderSync` in App).
- Billing: react-native-iap v16 scaffold, **weekly plan + free trial**
  (`dosedone_weekly`) per the portfolio LTV rule.
- Supabase: `dosedone_meds` + `dosedone_doses` migrations (device-keyed
  upsert, RLS permissive-by-device-id); best-effort sync.
- Maestro smoke test + CI workflow (adapted from Palate's, all lessons baked
  in). Note: the form defaults the first dose to the next hour so the TAKE
  button is always visible in tests.
- `play-listing/`: EN + AR listing drafts, privacy policy, Data Safety draft
  (health-data category declared; verify Play "Health apps" policy at launch).
- Icon: generated pill-capsule PNG at `app/assets/icon.png`.

## Stubbed / left for launch

- **Play Console product `dosedone_weekly` not created** — weekly + 7-day
  trial must be configured before purchases work.
- **Server-side purchase verification not built** — provisional local unlock;
  Play Developer API verification is launch work.
- **Supabase migration not applied live.**
- **Notification delivery not verified on a real device** — scheduling logic
  is complete; confirm exact delivery/timing on hardware at launch (emulators
  are unreliable for this). Android 12+ exact-alarm behavior should be
  checked; currently using default (inexact-tolerant) scheduling.
- No GitHub repo created / nothing pushed (local-only per instructions).
- AR translations written by the builder, not a native speaker — review before launch.

## Differentiation vs Medisafe

1. Senior-first big-button UX (giant type, huge targets, minimal screens).
2. Caregiver weekly summary screen (Plus).
3. Refill countdown with low-stock alerts built into the take flow.
4. No account, local-first, AR/EN RTL bilingual.
