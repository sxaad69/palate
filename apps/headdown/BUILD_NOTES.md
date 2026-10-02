# HeadDown — Build Notes (v1, 2026-10-03)

App #18 of the portfolio (queue order). Focus timer + distraction guard.
Claimed via `build-queue/claimed/18-monkMode` (claim is by number per protocol).

## Name

**HeadDown** — package `com.headdown.app`. Collision-checked: "MonkMode"
is heavily taken (iOS focus app, Chrome extension, macOS blockers);
"HeadDown" has no app collisions.

## Built

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript — `npx tsc --noEmit` clean.
- Own "ember on ink" palette (NOT reused from any sibling): `app/theme/`.
- EN/AR with RTL (`app/lib/strings.tsx`).
- Components: Screen, Text (with align), Button, Card, Chip.
- Screens: Onboarding, Home (duration presets 25/50/90 + Plus custom
  stepper, label, DND nudge, today's numbers), Session (big countdown,
  progress bar, distraction guard via AppState, manual "I got distracted",
  strict-mode exit counting, end-early confirm), Complete (focus score,
  distraction count, reflection note), History (7-day chart, avg score,
  total deep time, session list), Paywall, Settings (language, appearance,
  default duration, strict toggle, notification toggle, honesty card, erase).
- Distraction guard: AppState background/inactive → exit logged with
  timestamp; away-time subtracted from focused seconds; toast on return.
  Strict mode (Plus): 3 exits breaks the session.
- Focus score = focusedSec ÷ elapsed.
- Session-end local notification (expo-notifications) pulls the user back
  if they wandered off; cancelled on finish.
- Store: single context (`app/store/focus.tsx`) — sessions, streak,
  settings, AsyncStorage-persisted.
- Free: 25/50/90 presets, guard, 30-session visible history. Plus: custom
  durations, strict mode, unlimited history.
- Billing: react-native-iap v16 scaffold, **weekly plan + free trial**
  (`headdown_weekly`) per the portfolio LTV rule.
- Supabase: `headdown_sessions` migration (device-keyed, RLS
  permissive-by-device-id).
- Maestro smoke test + CI workflow (adapted from Palate's, all lessons baked in).
- `play-listing/`: EN + AR listing drafts, privacy policy, Data Safety draft.
- Icon: generated ember target PNG at `app/assets/icon.png`.

## Stubbed / left for launch

- **Play Console product `headdown_weekly` not created** — weekly + 7-day
  trial must be configured before purchases work.
- **Server-side purchase verification not built** — provisional local unlock;
  Play Developer API verification is launch work.
- **Supabase migration not applied live.**
- **Notification delivery not verified on a real device.**
- Timer is in-memory: if the OS kills the app mid-session, the session is
  lost (launch hardening: foreground service / persistent session).
- We do NOT block other apps — AppState exit detection only (honest limits
  documented in-app, BRAND.md, and privacy policy).
- No GitHub repo created / nothing pushed (local-only per instructions).
- AR translations written by the builder, not a native speaker — review before launch.

## Differentiation vs Forest / Focus Keeper

1. Distraction guard — exits detected + logged with timestamps (Forest
   grows a tree; we show the truth).
2. Focus score + distraction log per session.
3. Strict mode (Plus) — 3 exits breaks the session.
4. AR/EN RTL.
