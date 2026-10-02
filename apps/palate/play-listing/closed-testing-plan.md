# Closed Testing Plan — Palate (Play 12-tester / 14-day requirement)

## The requirement (verify current official wording in Play Console before acting)
New personal developer accounts must run a **closed test with at least 12 testers opted in for the last 14 days continuously**, then apply for production access. Plan for **15–20 testers** so a few dropouts don't break the 14-day continuity.

## Where to recruit genuine Android testers

Target: Arabic- or English-speaking Android users interested in food, health, or MENA culture. Genuine interest matters — Play looks for real engagement, not warm bodies.

1. **Reddit** — r/saudiarabia, r/dubai, r/Egypt, r/lebanon, r/AskMiddleEast, r/loseit, r/caloriecount. Post in English (and Arabic where the sub allows): "I'm building a food tracker that actually knows kabsa — need 15 Android testers for 2 weeks."
2. **X / Threads** — post in Arabic and English with #تغذية #صحة hashtags; quote-post in food/health circles.
3. **WhatsApp/Telegram groups** — family, friends-of-friends, gym and nutrition groups. Warmest source, highest retention.
4. **University groups** — nutrition/dietetics students (Riyadh, Jeddah, Cairo, Dubai). They give the best feedback.
5. **Indie Hackers / BetaList-style communities** — smaller yield, but testers who understand beta testing.

Do NOT use: the 6 Gmail accounts, paid "tester" farms, or anyone who won't actually open the app. Fake engagement risks the production-access application.

## Screening criteria (keep it light — a 1-minute form)
- Android phone, Android 10+ (our minSdk — [VERIFY against app config])
- Eats Middle Eastern / South Asian / Filipino food at least a few times a week (they're the target user)
- Willing to log at least 3 meals/week for 2 weeks and answer a 5-question survey at the end
- Not a family member sharing the developer's Play account (keep it clean)

## What to tell testers (send on opt-in day)
- The Play opt-in link (from Play Console → Testing → Closed testing → Testers)
- "Install Palate, finish onboarding, and use it like a food diary for 2 weeks."
- "Try the AI scan on a real meal at least twice — that's the feature we need tested."
- "Report crashes or weird results with: what you did, what you expected, a screenshot if possible."
- "Nothing you log is shared; your data is covered by our privacy policy [LINK]."
- Set expectations: it's a beta, the AI sometimes misidentifies dishes, Arabic support is new.

## Feedback form (5 questions, Google Forms, Arabic + English)
1. Which meals did you log, and did the AI recognize them correctly? (Which dishes failed?)
2. Was anything confusing in the first 5 minutes? What?
3. Did the app crash, freeze, or drain battery unusually? When?
4. Would you pay $4.99/month for unlimited AI scans? Why / why not?
5. One thing you'd change or add.

## Week-by-week timeline

**Week 0 — Prep (before the 14-day clock starts)**
- Play listing filled in (both languages), privacy policy URL live, Data Safety form submitted, content rating questionnaire done, app uploaded to the closed track.
- Recruitment posts live; aim for 20 opt-ins before starting the clock.

**Week 1 — Days 1–7: onboarding & core loop**
- Monitor opt-in count daily — if anyone drops below 12 opted-in, recruit replacements immediately (the 14 days must be continuous).
- Watch for crash reports in Play Console → Android vitals.
- Mid-week nudge to testers: "Have you tried the AI scan yet?"

**Week 2 — Days 8–14: retention & monetization signal**
- Check who is still active (streaks/XP in our backend are a proxy for engagement).
- Send the feedback form on day 12; chase non-responders on day 14.
- Fix only critical crashes — no feature work during the test.

**Day 15 — Review & apply**
- Triage feedback: crashes → fix now; AI misidentifications → note for dish-DB expansion; pricing objections → note for monetization review.
- Ship a bugfix build to the closed track if anything critical broke.
- Apply for production access in Play Console with a summary of the test (tester count, duration, key findings, fixes shipped).

## What "done" looks like
- [ ] 12+ testers continuously opted in for 14 days (verified in Play Console)
- [ ] Zero unresolved crash clusters in Android vitals
- [ ] Feedback form responses from ≥10 testers
- [ ] AI scan tried by ≥8 testers with dish-recognition accuracy notes logged
- [ ] Production access application submitted with test summary
- [ ] [PLACEHOLDER: Saad to confirm tester pool and start date]
