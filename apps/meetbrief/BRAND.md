# MeetBrief — Brand Record

**App #11** of the 20-app portfolio · Business/Productivity · built 2026-10-02

## Name decision

- **Proposed:** Briefly (`com.briefly.notes`)
- **Collision check (2026-10-02, web search):** "Briefly" is TAKEN in the
  meeting-notes space —
  - "Briefly AI – Smart Meeting Notes" (Chrome Web Store, live extension,
    4.0K users),
  - "Briefly AI" meeting-prep web app (satya7250/briefly-ai),
  - "Briefly" AI meeting-notes portfolio projects (hayorkun/briefly,
    sakhawatkabir/ai-meeting-notes — same name, same domain).
- **Decision: renamed to MeetBrief.** Fallbacks checked — "MeetBrief",
  "Recaply", "Minutely" returned no existing meeting-notes apps.
  "MeetBrief" was picked over the others: it says what the app does
  (meeting → brief) and reads naturally in a share-pack sign-off.
- **Package:** `com.meetbrief.notes` (Play-unique, no shared patterns with
  sibling apps per §4 thresholds).
- **Billing SKU:** `meetbrief_weekly` (weekly + free trial, deep-dive LTV rule).

## Palette — "boardroom slate + signal blue"

Designed from scratch for business/productivity: professional, efficient,
high-contrast. Cool slate neutrals paired with a cool signal-blue brand
(never warm grays — that clash is the dead giveaway of generic output).

| Role | Light | Dark |
|---|---|---|
| Background | slate-50 `#F8FAFC` (paper) | slate-950 `#020617` |
| Surface | `#FFFFFF` | slate-900 `#0F172A` |
| Text | slate-900 `#0F172A` (ink) | slate-100 `#F1F5F9` |
| Accent | signal blue `#2563EB` | blue-400 `#60A5FA` (lightened ~15% for dark) |
| Record | `#DC2626` | `#F87171` |
| Money/cost | amber `#B45309` | `#FBBF24` |

Light is the primary experience (business users in daylight); dark follows
the skill rules (surfaces lighten with elevation, never pure black).

Does NOT reuse: Fable indigo/lavender, Restory plum/sand/gold, KeepsFresh
greens/cream, Palate saffron.

## Voice

Short, plain, workmanlike. No hype, no "AI magic" claims (v1 has no AI —
the copy never implies otherwise). EN + AR, full RTL.

## Icon

Generated launcher set (`app/assets/`): signal-blue field with a white
waveform-bars motif; adaptive foreground is the waveform on transparent,
background solid slate-900. Final polished launcher art is a launch task —
the current set is build-safe and on-brand.

## Differentiators (≥3 vs Otter.ai/Fireflies + built-in recorders)

1. **On-device first, no account.** Recording + storage 100% local, works
   offline. Competitors are cloud/account-first by design.
2. **Action items as first-class output.** The detail screen leads with a
   checkable action list, not a transcript wall.
3. **Meeting cost timer.** Optional hourly rate → live "this meeting costs
   ~$X" readout. Fun, shareable, genuinely differentiated.
4. **Instant share pack.** One-tap copy/share of summary + actions as
   formatted text (WhatsApp/email-ready, EN + AR).
