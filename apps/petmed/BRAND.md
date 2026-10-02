# Pawscript — Brand

Pet medication & vet records — App #17 of the portfolio (Lifestyle). Claimed via
`build-queue/claimed/17-petmed` (build dir `~/workspace/apps/petmed/`, queue name
kept for claim-protocol consistency; the app itself is branded **Pawscript**).

## Name decision (collision-checked 2026-10-02)

- **PetMinder** — TAKEN. Google Play app "PetMinder" (`com.grayjack.petminder`), "Your Complete Pet Care Assistant", with medication management. Rejected.
- **PawDose** — TAKEN. iOS app "PawDose - Pet Medication Tracker" (getpawdose.com) with prescription scanning, adherence tracking, vet reports. Rejected.
- **VetVault** — TAKEN. iOS app "VetVault - AI-powered pet health records" (App Store id6754192374). Rejected.
- **DosePaw** — TAKEN. "DosePaw — Pet Health Tracking" (dosepaw.com), meds/vaccines/vet visits/adherence. Rejected.
- **Pawscript** — FREE. No app collisions found in web + Play searches. "Paw" + "prescription" pun: the name says what the app does (meds) while staying warm and pet-y.

**Package:** `com.pawscript.app` · **Billing SKU:** `pawscript_weekly` (weekly + free trial, per the deep-dive LTV rule)

## Identity

**Warm companion, not a clinic.** Playful teal (trust + friendliness) as the brand
accent, warm amber reserved for the big "GIVE dose" action, cream backgrounds,
warm-brown neutrals. Friendly pet-care warmth — deliberately NOT clinical
(DoseDone's deep-teal/amber is clinical calm; Pawscript is a sunny kitchen-table
companion). NOT Palate's saffron, Fable's indigo/lavender, Restory's plum/sand/gold,
KeepsFresh's greens/cream, MeetBrief's slate/signal-blue, or TwoPurse's
terracotta/sage.

Palette (`app/theme/`):
- Light: cream `#FFFBF3` bg, white surfaces, teal-700 `#0E7A6E` accent, amber-700 `#B45309` dose action
- Dark: warm charcoal `#14110C` bg (never pure black), teal-300 `#63D9C4` accent, amber-300 `#F8C876` dose action
- 6 per-pet timeline colors: teal, amber-orange, coral, violet, rose, sky

## Voice

Warm, reassuring, plain words. Pet-parent to pet-parent. "Never miss a dose for
your best friend." Standing disclaimer: Pawscript reminds; it does not prescribe.

## Differentiation (≥3 vs generic pet apps / phone reminders)

1. **Multi-pet "due now" dose timeline** — one timeline across ALL pets, color-coded per pet (most pet apps are single-pet or reminder-only).
2. **Dose logging with adherence streaks** — tap "Given"; weekly adherence % per medication + per-pet streaks (borrowed from human med apps, rare in pet apps).
3. **Vet-visit prep sheet** — one-tap compiled summary (pet info, current meds + adherence, weight trend, vaccination status, recent visits/notes) shared as text for the vet appointment.
4. **Weight + photo timeline per pet** — simple weight log with trend delta; photo on the profile stored locally.

Free: 1 pet + full dose tracking/reminders. Pro: unlimited pets + vet-visit prep sheet + export.
