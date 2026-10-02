# MeetBrief

App #11 of the 20-app portfolio — voice meeting-notes for freelancers,
students, and small teams. Record a meeting, get a recap with checkable
action items, an optional meeting-cost timer, and a one-tap share pack.
On-device first: no account, works offline, recordings never leave the phone.

## Run
```sh
cd app
npm install
npm run typecheck   # tsc --noEmit
node ../scripts/selfcheck.mjs   # pure-logic assertions
npx expo start
```

## Docs
- `BRAND.md` — name decision (Briefly → MeetBrief), palette, differentiators
- `BUILD_NOTES.md` — built/stubbed/left-for-launch, STT insertion point
- `play-listing/` — EN/AR listings, privacy policy, data safety
- `.maestro/smoke.yaml` + `.github/workflows/e2e-meetbrief.yml` — E2E
- `backend/supabase/migrations/` — reserved cloud-sync schema (no client use in v1)
