# ScrubDeck — Build Notes (v1, 2026-10-03)

App #16 of the portfolio (queue order). Nursing/medical-exam flashcards
with spaced repetition. Claimed via `build-queue/claimed/16-scrubdeck`.

## Name

**ScrubDeck** — package `com.scrubdeck.app`. Collision-checked:
"ScrubDeck"/"NurseDeck" have no app collisions (only a physical
"Davis's Med Deck" book product shares a similar name). "ShadowTalk" and
"ParrotTalk" were considered for #15 and rejected as taken — not reused here.

## Built

- Expo SDK 57, React Native 0.86, React 19, strict TypeScript — `npx tsc --noEmit` clean.
- Own "scrub wine + gold" palette (NOT reused from any sibling): `app/theme/`.
- EN/AR with RTL (`app/lib/strings.tsx`).
- Components: Screen, Text (with align), Button, Card, Chip.
- Content: 48 bundled NCLEX-style cards in 4 decks — Fundamentals (free),
  Pharmacology, Med-Surg, Maternal & Peds (Plus) — with high-yield /
  priority / labs tags (`app/data/decks.ts`).
- Real SM-2 spaced repetition (`app/lib/sm2.ts`): Again/Hard/Good/Easy →
  1/3/4/5, ease factor, intervals 1d → 6d → ease-scaled.
- Screens: Onboarding, Home (due hero, streak, per-deck due counts),
  Study (flip + 4-grade session with progress bar + close), Decks (browser,
  locked Plus decks, custom deck editor + card adder), Stats (streak,
  reviews, 7-day retention, per-deck mastery bars), Paywall, Settings
  (language, appearance, study-aid disclaimer, erase).
- Store: single context (`app/store/study.tsx`) — SM-2 progress, streak
  days, grade events, custom decks, AsyncStorage-persisted.
- Free limits: Fundamentals deck only, 20 reviews/day; Plus unlocks all
  decks + unlimited + custom decks.
- Billing: react-native-iap v16 scaffold, **weekly plan + free trial**
  (`scrubdeck_weekly`) per the portfolio LTV rule.
- Supabase: `scrubdeck_progress` + `scrubdeck_custom_decks` +
  `scrubdeck_custom_cards` migrations (device-keyed, RLS permissive-by-device-id).
- Maestro smoke test + CI workflow (adapted from Palate's, all lessons baked in).
- `play-listing/`: EN + AR listing drafts, privacy policy, Data Safety draft.
- Icon: generated wine/gold flashcard PNG at `app/assets/icon.png`.

## Stubbed / left for launch

- **Play Console product `scrubdeck_weekly` not created** — weekly + 7-day
  trial must be configured before purchases work.
- **Server-side purchase verification not built** — provisional local unlock;
  Play Developer API verification is launch work.
- **Supabase migration not applied live.**
- No GitHub repo created / nothing pushed (local-only per instructions).
- AR translations written by the builder, not a native speaker — review before launch.
- Card content is a study aid, not medical advice — disclaimer in listing,
  settings, and privacy policy.

## Differentiation vs Anki

1. Pre-loaded NCLEX-style nursing decks (Anki ships empty).
2. Nursing-specific: drug-suffix decoder cards, lab ranges, priority framing.
3. Dead-simple 4-button grading UX + full AR/EN RTL (Anki's AR support is poor).
4. Streaks + per-deck mastery rings.
