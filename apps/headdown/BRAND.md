# HeadDown — Brand

Focus timer + distraction blocker. App #18 of the portfolio (queue order;
claimed as `claimed/18-monkMode` — claim is by number per protocol).

**Name note:** "MonkMode" is heavily taken (iOS focus app, Chrome
extension, macOS blockers). **HeadDown** is clear — no app collisions.
Package: `com.headdown.app`.

## Identity

**Ember on ink.** Vivid ember orange on deep ink, warm paper light mode.
Intense, no-nonsense — head down, do the work. Nothing like the other
apps' palettes.

## Voice

Blunt coach. Short sentences. "Your attention is the product. Guard it."

## Concept (the honest architecture)

A focus timer with a **distraction guard** — honest about what a phone
app can and can't do:

1. **Start** a 25/50/90-min session (custom on Plus) with a label.
2. **Guard** — leave the app mid-session and it's detected (AppState) and
   logged as a distraction with a timestamp. No OS privileges, no fake
   "app blocking".
3. **Strict mode** (Plus) — 3 exits breaks the session. Real stakes.
4. **Score** — focus score = focused minutes ÷ total; distraction log
   shows exactly when you drifted.
5. **Session-end nudge** — a local notification pulls you back if you
   wandered off when the timer ends.

Pre-session checklist nudges Do Not Disturb (we don't toggle it for you —
that's your phone's job).

## Differentiation vs Forest / Focus Keeper / generic pomodoros

1. **Distraction guard** — exits are detected and logged with timestamps
   (Forest grows a tree; we show you the truth).
2. **Focus score + distraction log** per session — accountability data,
   not vibes.
3. **Strict mode** (Plus) — 3 exits kills the session.
4. **AR/EN RTL** — most pomodoro apps are English-only.

## Honesty notes

- We do NOT block other apps (that needs Accessibility/Device Admin —
  heavy, policy-sensitive, and creepy). The guard detects exits instead.
- Timer is in-memory: if the OS kills the app mid-session, the session is
  lost. Noted as launch hardening.
- Notification delivery unverified on hardware (same caveat as siblings).
