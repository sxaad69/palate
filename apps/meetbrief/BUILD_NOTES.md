# MeetBrief — Build Notes

App #11 · Expo SDK 57 · strict TS (tsc clean) · local-first (AsyncStorage +
FileSystem document dir) · react-native-iap v16 weekly+trial billing.

## Built (v1)

- **Onboarding** — 3 slides, EN/AR language pick, mic permission rationale
  with in-flow permission request.
- **Meetings list** — recordings with duration/date/action counts/cost chip,
  search, free-plan usage indicator (x/5), empty state.
- **Record screen** — `expo-audio` (see deviation note below) high-quality
  recording, live timer, live metering bar, pause/resume, title input,
  cost-timer toggle + hourly rate (defaults from profile), free-plan
  30-min auto-stop, 5-meetings/month gate with inline upgrade card.
- **Meeting detail** — playback (play/pause + progress), template summary
  with regenerate, action-item checklist (add/edit/check/delete),
  notes field, transcript field (manual paste for now), share pack
  (Share sheet) + copy-to-clipboard, delete (also deletes the audio file).
- **Stats** — meetings, hours, actions done/total, this month, tracked cost.
- **Profile** — appearance (light/dark/system, persisted), language,
  default hourly rate, plan card + paywall entry, on-device privacy note.
- **Paywall** — weekly + free trial (`meetbrief_weekly`; trial configured
  server-side in Play Console per the LTV rule), live price lookup,
  purchase + silent restore via `initBilling`.
- **Billing scaffold** — `lib/billing.ts` mirrors the Fable v16 shape
  (`requestPurchase({request:{google:{skus}}}, type:'subs')`).
- **Summary engine** — `lib/summary.ts`: deterministic local template from
  title/date/duration/cost/notes/actions (EN+AR). No network, no cost.
- **Share pack** — `lib/share.ts`: formatted EN/AR text block for
  WhatsApp/email.
- **CI** — `.maestro/smoke.yaml` (permission pre-granted via adb; asserts UI
  states, records silence) + `.github/workflows/e2e-meetbrief.yml`
  (shared `gradle-…-expo57` cache key, disk-cleanup before downloads).
- **Self-check** — `scripts/selfcheck.mjs` compiles `lib/format.ts` +
  `lib/summary.ts` (zero runtime deps) and asserts durations, money, cost,
  and EN/AR summary output. Run: `node scripts/selfcheck.mjs`.
- **Supabase** — one migration (`backend/supabase/migrations/`) reserving
  `meetings` + `action_items` with RLS for future opt-in sync. No client
  calls, no edge function (YAGNI).
- **Play listing** — `play-listing/` drafts: EN + AR listings, privacy
  policy, data-safety (local-only posture).

## Deliberate deviations from the brief

- **`expo-audio` instead of `expo-av`.** The brief said expo-av, but
  expo-av's latest release is 16.0.8 (SDK 53-era, frozen/deprecated) while
  the project targets SDK 57. `expo-audio@~57.0.0` is the supported SDK 57
  recording/playback API (`useAudioRecorder`, `useAudioPlayer`,
  `requestRecordingPermissionsAsync`). Same capability, correct SDK.
- **`expo-file-system` new API.** SDK 57 ships the rewritten module:
  `Paths.document` + `File`/`Directory` classes instead of the legacy
  `FileSystem.documentDirectory`/`copyAsync` functions. `lib/audio.ts`
  uses the new API.
- **No `@supabase/supabase-js` dependency.** The brief asked for the
  migration only, with no reads/writes in v1 — so no client dep was added.
- **`expo-clipboard`** added for the copy button (tiny, standard; the
  Share sheet alone has no explicit copy action).

## Stubbed (present but not functional)

- **STT** — `lib/stt.ts` defines the `SttProvider` interface and a
  `NullSttProvider`. The `Meeting.transcript` field and the transcript
  input in the detail screen are the insertion points. Nothing half-working
  ships: v1 is an honest recorder + action tracker.

## Left for launch

1. **Launcher art polish** — current icons are generated waveform marks;
   commission/finalize the real icon + feature graphic + screenshots.
2. **STT module** — evaluate `expo-speech-recognition` (Android on-device)
   in the managed workflow; fallback: sherpa-onnx via dev client, or
   optional BYOK cloud as non-default opt-in. Wire into `sttProvider`,
   feed `Meeting.transcript`, extend `lib/summary.ts` with key points.
3. **Seek in playback** — progress bar is display-only; add tap-to-seek.
4. **Server-side purchase verification** — edge function at launch
   (currently acknowledge-and-unlock-locally like the sibling apps).
5. **Play Console** — create `meetbrief_weekly` (weekly + free trial),
   12-tester closed test, data-safety form, listing assets.
6. **RTL reload** — language toggle applies `forceRTL`; a full reload on
   toggle is deferred (same posture as sibling apps).

## Policy posture (§5)

- Repetitive-content: distinct data model (meetings/actions/cost), unique
  slate+blue identity, unique listing copy — no shared patterns with
  sibling apps.
- AI rules: v1 makes no AI claims anywhere in UI or listing (no AI
  disclosure burden). When STT lands, add in-app disclosure.
- Audio stays on-device: declared in privacy policy + data safety; no
  account, no analytics SDK, no network calls at all in v1.
