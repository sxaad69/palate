# BUILD_NOTES.md — Hulm (bench #1: dream interpreter)

Built 2026-10-03 · `com.hulm.app` · Expo SDK 57 · strict TS (`npx tsc --noEmit` clean) · local only, never pushed.

## What was built
- **Concept:** dream journal + bundled bilingual symbol lexicon with keyword
  auto-suggest. Framing is reflection, NOT an AI oracle, NOT religious rulings —
  the disclaimer is structural: onboarding screen 3, every reflection view, and
  the store listing ("for reflection and journaling — not tafsir al-ahlam").
- **47-symbol lexicon** (`app/data/symbols.ts`): 24 free + 24 Plus-gated (actual
  count 47 after dedupe). Each symbol: EN/AR name, EN+AR keywords, themes,
  2 reflection questions EN/AR, one-line "traditional association" EN/AR —
  explicitly labeled as cultural tradition, never a ruling.
- **Screens:** Onboarding (3 steps) → Journal (streak header, dream list) →
  DreamForm (narrative → auto-detected symbols as confirmable chips, mood picker)
  → DreamDetail (reflection view: your words + confirmed symbols + disclaimer) →
  Symbols (searchable lexicon browser, Plus locks) → SymbolDetail (themes,
  reflection questions, traditional note) → Insights (Plus-gated: recurring
  symbols, streak, waking-mood mix) → Paywall → Settings (lang, appearance,
  disclaimer, erase-all).
- **Store** (`app/store/dreams.tsx`): dreams, confirmed symbols, journaling
  streak, recurring-symbol counts, pro flag, onboarding flag — all AsyncStorage
  persisted, local-first.
- **Theme:** midnight plum `#221133` + moonlit amber `#FFB347`, light+dark
  tokens, AR/EN with RTL (I18nManager).
- **Billing:** react-native-iap v16 scaffold, `hulm_weekly` WEEKLY subscription
  (weekly+trial per portfolio LTV rule). Paywall wired to real billing module.
- **Backend:** Supabase migration `hulm_dreams` (device-keyed, permissive RLS)
  — schema only, not applied, sync not wired (v1 is local-first).
- **CI:** `.github/workflows/e2e.yml` (copied from dryspell, Gradle lessons
  baked in) + `.maestro/smoke.yaml` (onboarding → log dream with symbol
  suggestion → detail → lexicon → symbol detail → insights gate → settings).
- **play-listing/:** EN + AR drafts, privacy policy, Data Safety draft.
- **Icon:** `app/assets/icon.png` — amber crescent moon on midnight plum.

## Differentiators vs dream-dictionary apps
1. Keyword auto-suggest: the journal *finds* symbols in your words — no manual lookup.
2. Reflection questions per symbol (journaling mechanic), not one-line "meanings".
3. Structural religious-ruling disclaimer — trust positioning for the MENA/global Muslim audience; recurring-symbol insights as the Plus hook.

## Stubbed / left for launch
- Play Console: create `hulm_weekly` subscription with 7-day free trial; no server-side purchase verification (provisional local unlock).
- Supabase: migration not applied live; sync not wired (local-first v1).
- Notification delivery unverified on hardware (no reminders in v1 — deliberate).
- AR translations need native-speaker review.
- Nothing pushed to GitHub (local only, per instructions).
