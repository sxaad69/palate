// Self-check for lib/insights.ts — the one runnable check behind the
// correlation math. Compile: node node_modules/typescript/bin/tsc
//   lib/insights.ts check/check-insights.ts --ignoreConfig --module commonjs
//   --target es2020 --moduleResolution bundler --outDir /tmp/insight-check
// Then: node /tmp/insight-check/check/check-insights.js
// (ponytail: inline asserts, no node types / test framework needed.)
import {
  sleepDurationMinutes,
  moodLiftAfterGoodSleep,
  avgBedtimeOnGoodNights,
  avgHoursOnGoodNights,
  buildRestStory,
  entriesToCsv,
  type DayEntryLike,
} from '../lib/insights';

declare const console: { log(s: string): void };

function eq(actual: unknown, expected: unknown, msg?: string): void {
  if (actual !== expected) {
    throw new Error(`assert failed${msg ? ` (${msg})` : ''}: expected ${expected}, got ${actual}`);
  }
}

function ok(v: unknown, msg?: string): void {
  if (!v) throw new Error(`assert failed${msg ? ` (${msg})` : ''}: expected truthy, got ${v}`);
}

const e = (over: Partial<DayEntryLike>): DayEntryLike => ({
  date: '2026-09-28',
  mood: null,
  sleepQuality: null,
  bedTime: null,
  wakeTime: null,
  ...over,
});

// Overnight duration
eq(sleepDurationMinutes('23:30', '06:45'), 435);
eq(sleepDurationMinutes('22:00', '06:00'), 480);
eq(sleepDurationMinutes(null, '06:00'), null);
eq(sleepDurationMinutes('22:xx', '06:00'), null);

// Lift: good nights [5,4,5] vs poor [2,3,2] over 7 paired days
const week: DayEntryLike[] = [
  e({ date: '2026-09-25', mood: 5, sleepQuality: 5, bedTime: '22:40', wakeTime: '06:30' }),
  e({ date: '2026-09-26', mood: 4, sleepQuality: 4, bedTime: '23:10', wakeTime: '06:50' }),
  e({ date: '2026-09-27', mood: 5, sleepQuality: 5, bedTime: '22:30', wakeTime: '06:20' }),
  e({ date: '2026-09-28', mood: 2, sleepQuality: 1, bedTime: '01:20', wakeTime: '07:00' }),
  e({ date: '2026-09-29', mood: 3, sleepQuality: 2, bedTime: '00:40', wakeTime: '06:40' }),
  e({ date: '2026-09-30', mood: 2, sleepQuality: 2, bedTime: '01:00', wakeTime: '07:10' }),
  e({ date: '2026-10-01', mood: 3, sleepQuality: 3, bedTime: '23:50', wakeTime: '06:30' }),
];
const lift = moodLiftAfterGoodSleep(week);
// goodAvg = 14/3 ≈ 4.7, poorAvg = 7/3 ≈ 2.3 → lift 2.3
eq(lift.lift, 2.3, `lift ${lift.lift}`);
eq(lift.need, 0);

// Thin data: only 3 paired days → locked with need=2
const thin = week.slice(0, 3);
const thinLift = moodLiftAfterGoodSleep(thin);
eq(thinLift.lift, null);
eq(thinLift.need, 2);

// Circular bedtime mean: 23:30 + 00:30 → 00:00 (not 11:30)
const wrap: DayEntryLike[] = [
  e({ sleepQuality: 5, bedTime: '23:30' }),
  e({ sleepQuality: 4, bedTime: '00:30' }),
];
eq(avgBedtimeOnGoodNights(wrap), '00:00');

// Good nights with bad bedtimes fall back to the vector mean of valid ones
eq(avgBedtimeOnGoodNights([e({ sleepQuality: 5, bedTime: '22:40' })]), '22:40');
eq(avgBedtimeOnGoodNights([e({ sleepQuality: 2, bedTime: '22:40' })]), null);

// Avg hours on good nights: 22:40→06:30 = 7.83h, 23:10→06:50 = 7.67h, 22:30→06:20 = 7.83h
eq(avgHoursOnGoodNights(week), 7.8);

// Rest story: full version in both languages, fallback when thin
const now = new Date('2026-10-02T12:00:00');
const story = buildRestStory(week, 'en', now);
ok(story.includes('6 of the last 7 nights'), story);
ok(story.includes('2.3 points'), story);
const storyAr = buildRestStory(week, 'ar', now);
ok(storyAr.includes('٧ ليالٍ'), storyAr);
ok(storyAr.includes('٤ نجوم'), storyAr);
eq(buildRestStory(week.slice(0, 2), 'en', now), 'Keep logging — your rest story appears after 3 nights.');
eq(buildRestStory([], 'ar', now), 'واصل التسجيل — ستظهر قصة راحتك بعد ٣ ليالٍ.');

// CSV export
const csv = entriesToCsv([e({ date: '2026-10-01', mood: 4, sleepQuality: 5, note: 'calm "evening", ok' })]);
ok(csv.startsWith('date,mood,sleep_quality,bedtime,wake_time,note'));
ok(csv.includes('"calm ""evening"", ok"'), csv);

console.log('insights self-check: all assertions passed');
