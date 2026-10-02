# StraightUp — Brand

**Name:** StraightUp — collision-checked 2026-10-02. "StandTall" was REJECTED: a GitHub desktop app "StandTall Pro" in the same posture-reminder domain plus two ™-marked posture-corrector products (TrendyLoomz StandTall™, Leshera StandTall™). "PosturePal" was REJECTED: multiple same-name projects plus a registered "PosturePal® Smart Posture Trainer" device. "AlignMe" was REJECTED: a live Play Store app "AlignMe - Posture Reminder" plus alignme.app, a direct photo→AI-score competitor. "StraightUp" is clear — nearest Play results ("Stay Straight", "Straight Posture") are different names. Fallbacks on standby: PosturePal (burned), StraightUp (chosen), AlignMe (burned).

**Package:** `com.straightup.posture`

**Identity:** upright, clinical-but-friendly. Confident navy + energizing lime + cool light gray — a palette designed from scratch for the posture/body domain (nothing saffron/food like Palate, nothing indigo-night like Fable). Navy carries trust and "stand tall" confidence; lime is the energy accent (score rings, landmark markers, dark-mode CTAs); light gray keeps it airy and clinical. Dark mode is deep navy, never pure black.

**Voice:** direct, honest, no wellness fluff. The app says what it measures and shows the formula. Second person, plain language. Never claims AI detection it doesn't have.

**Differentiation vs generic posture apps / phone-camera selfies (Play repetitive-content thresholds, ≥3 genuinely unique):**
1. Landmark-based geometric scoring — real computed angles (forward-head, shoulder-lean, knee, hip-shift) from user-placed markers with the formula shown in-app. Competitors either fake an "AI score" or require a clinic visit; nobody shows the math.
2. Angle-specific exercise prescription — each weak angle maps to targeted exercises (chin tucks for forward head, wall angels for rounded shoulders), not generic "sit straight" advice.
3. Progress timeline with side-by-side comparison — check history with photos, angle history, and score deltas vs the previous check (custom bars/rings, no chart lib).
4. AR/EN bilingual + local "unhunch" nudges (expo-notifications, on-device only).

**Icon:** navy rounded square, lime spine-line with joint dots (generated, `app/assets/`).

**Scope note (queue verdict):** photo→AI-score wedge with on-device pose detection. True on-device pose estimation (MediaPipe/TFLite) is NOT feasible in managed Expo v1 — documented honestly in BUILD_NOTES.md. v1 = guided capture + user-placed landmarks + real geometry. No fake AI scores, ever.
