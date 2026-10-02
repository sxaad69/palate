# SalahMate — Build Notes (v1, 2026-10-02)

App #9 of the portfolio (queue order). Prayer-time + habit companion.
Claimed via `build-queue/claimed/prayerhabit`.

## Name

**SalahMate** — package `com.salahmate.app`. Collision check: "PrayerPal" is
taken (multiple Play Store apps: com.hyya.prayerpal, com.ionicerrrrcode.prayerpal).
SalahMate is free — no app collisions found.

## Built

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript — `npx tsc --noEmit` clean.
- Own "night sky" palette (midnight indigo + soft gold — NOT Palate's saffron,
  DrySpell's dawn, LanceLedger's pine, or DoseDone's teal): `app/theme/`.
- EN/AR with RTL (`app/lib/strings.tsx`) — prayer names in Arabic +
  transliteration; `prayerName()` helper.
- Prayer engine: `adhan` library, on-device calculation (offline), 6 methods
  (MWL/Egyptian/Karachi/ISNA/UmmAlQura/Tehran), device location via
  expo-location with Riyadh fallback. "Verify with your local mosque"
  disclaimer in Settings + listing.
- Components: Screen, Text, Button (primary/secondary/ghost/action), Card
  (default/action tone), Chip.
- Screens: Onboarding (location + method), Today (live next-prayer countdown,
  5-prayer checklist, anchored habits, day score), Habits (list + add form
  with anchor-prayer picker; 3-habit free cap), Dhikr (giant tap counter,
  33/100/500/1000 targets, vibration on complete), Progress (weekly prayer
  bars, perfect-day streak, habit streaks), Paywall, Settings (location
  refresh, method, reminders toggle, language, appearance, erase).
- Store: single context (`app/store/salah.tsx`) — prayer logs, habits +
  logs, dhikr (daily reset), streaks, week counts, day score.
  AsyncStorage-persisted.
- Reminders: expo-notifications, one-time local notifications for today's
  upcoming prayers, rebuilt on app start / settings change (`ReminderSync`).
- Billing: react-native-iap v16 scaffold, **weekly plan + free trial**
  (`salahmate_weekly`) per the portfolio LTV rule.
- Supabase: `salahmate_prayers` + `salahmate_habits` + `salahmate_habit_logs`
  migrations (device-keyed upsert, RLS permissive-by-device-id).
- Maestro smoke test + CI workflow (adapted from Palate's, all lessons baked in).
- `play-listing/`: EN + AR listing drafts, privacy policy, Data Safety draft
  (location is on-device only — declared as not collected).
- Icon: generated crescent-moon PNG at `app/assets/icon.png`.

## Stubbed / left for launch

- **Play Console product `salahmate_weekly` not created** — weekly + 7-day
  trial must be configured before purchases work.
- **Server-side purchase verification not built** — provisional local unlock;
  Play Developer API verification is launch work.
- **Supabase migration not applied live.**
- **Notification delivery not verified on a real device** (same caveat as DoseDone).
- **Qibla compass NOT in v1** — sensor risk; candidate for v1.1.
- Asr madhab fixed to Shafi'i (adhan default); Hanafi toggle is a possible
  settings addition.
- No GitHub repo created / nothing pushed (local-only per instructions).
- AR translations written by the builder, not a native speaker — review before launch.

## Differentiation vs Muslim Pro / Athan apps

1. Habits anchored to prayers (habit stacking on the 5 daily anchors).
2. Unified day score (prayers + habits, one streak system).
3. Dhikr counter built in.
4. Offline on-device prayer times, no account, local-first, AR/EN RTL.
