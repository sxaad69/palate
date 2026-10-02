// Restory insight engine — pure functions, zero RN imports.
// The product wedge: mood↔sleep correlation computed on-device from the
// user's own data, plus a weekly "rest story" narrative from templates
// (EN+AR). No LLM call — YAGNI.

// ponytail: circular bedtime mean uses vector averaging (naive arithmetic
// mean breaks across midnight); O(n) scans are fine at journal scale.

export interface DayEntryLike {
  date: string; // YYYY-MM-DD, local
  mood: number | null; // 1..5 (today's mood)
  sleepQuality: number | null; // 1..5 (last night's sleep)
  bedTime: string | null; // "HH:MM"
  wakeTime: string | null; // "HH:MM"
  note?: string | null;
}

export type Lang2 = 'en' | 'ar';

/** Minutes from midnight for "HH:MM"; null on bad input. */
export function toMinutes(hhmm: string | null): number | null {
  if (!hhmm) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Sleep duration in minutes, handling the overnight wrap. */
export function sleepDurationMinutes(bed: string | null, wake: string | null): number | null {
  const b = toMinutes(bed);
  const w = toMinutes(wake);
  if (b === null || w === null) return null;
  return (w - b + 1440) % 1440;
}

export function toHHMM(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** Entries with both sides of the pair: last night's sleep + today's mood. */
export function pairedDays(entries: DayEntryLike[]): DayEntryLike[] {
  return entries.filter((e) => e.mood !== null && e.sleepQuality !== null);
}

const avg = (xs: number[]): number => xs.reduce((s, x) => s + x, 0) / xs.length;
const fmt1 = (x: number): string => (Math.round(x * 10) / 10).toFixed(1);

export interface Lift {
  /** +x.x mood points after good sleep vs poor sleep; null when data is thin. */
  lift: number | null;
  goodAvg: number | null;
  poorAvg: number | null;
  /** Nights still needed before the insight unlocks. */
  need: number;
}

const MIN_PAIRED = 5;

/**
 * "You rate days X points higher after 4★+ sleep."
 * Good = sleep ≥ 4, poor = sleep ≤ 2. Needs ≥5 paired days and both bands
 * non-empty — otherwise returns lift: null with the remaining count.
 */
export function moodLiftAfterGoodSleep(entries: DayEntryLike[]): Lift {
  const p = pairedDays(entries);
  const good = p.filter((e) => (e.sleepQuality as number) >= 4).map((e) => e.mood as number);
  const poor = p.filter((e) => (e.sleepQuality as number) <= 2).map((e) => e.mood as number);
  if (p.length < MIN_PAIRED || good.length === 0 || poor.length === 0) {
    return { lift: null, goodAvg: null, poorAvg: null, need: Math.max(0, MIN_PAIRED - p.length) };
  }
  const goodAvg = avg(good);
  const poorAvg = avg(poor);
  return { lift: Math.round((goodAvg - poorAvg) * 10) / 10, goodAvg, poorAvg, need: 0 };
}

/** Average mood for the last 7 days (null when no moods logged). */
export function avgMoodLast7(entries: DayEntryLike[], now = new Date()): number | null {
  const cutoff = dayStr(addDays(now, -6));
  const moods = entries
    .filter((e) => e.date >= cutoff && e.mood !== null)
    .map((e) => e.mood as number);
  return moods.length ? Math.round(avg(moods) * 10) / 10 : null;
}

/** Circular mean bedtime on 4★+ nights — null when no such nights. */
export function avgBedtimeOnGoodNights(entries: DayEntryLike[]): string | null {
  const mins = entries
    .filter((e) => (e.sleepQuality ?? 0) >= 4)
    .map((e) => toMinutes(e.bedTime))
    .filter((m): m is number => m !== null);
  if (!mins.length) return null;
  // ponytail: vector average so 23:30 + 00:30 → 00:00, not 11:30.
  const angles = mins.map((m) => (m / 1440) * 2 * Math.PI);
  const x = avg(angles.map(Math.cos));
  const y = avg(angles.map(Math.sin));
  let deg = (Math.atan2(y, x) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return toHHMM((deg / 360) * 1440);
}

/** Mean sleep hours on 4★+ nights with both times — null when none. */
export function avgHoursOnGoodNights(entries: DayEntryLike[]): number | null {
  const hs = entries
    .filter((e) => (e.sleepQuality ?? 0) >= 4)
    .map((e) => sleepDurationMinutes(e.bedTime, e.wakeTime))
    .filter((d): d is number => d !== null && d > 0);
  return hs.length ? Math.round((avg(hs) / 60) * 10) / 10 : null;
}

export interface SeriesDay {
  date: string;
  label: string; // short weekday, locale-aware
  mood: number | null;
  sleep: number | null;
}

/** Last N days (oldest → newest) for the 7/30-day charts. */
export function weekSeries(
  entries: DayEntryLike[],
  days: number,
  lang: Lang2,
  now = new Date(),
): SeriesDay[] {
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const out: SeriesDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(now, -i);
    const ds = dayStr(d);
    const e = byDate.get(ds);
    out.push({
      date: ds,
      label: d.toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US', { weekday: 'narrow' }),
      mood: e?.mood ?? null,
      sleep: e?.sleepQuality ?? null,
    });
  }
  return out;
}

export function dayStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/**
 * Weekly "rest story": 2–3 plain-language sentences from the user's own
 * stats. Locally generated template text — no network, no LLM.
 */
export function buildRestStory(entries: DayEntryLike[], lang: Lang2, now = new Date()): string {
  const cutoff = dayStr(addDays(now, -6));
  const week = entries.filter((e) => e.date >= cutoff && e.sleepQuality !== null);
  const nights = week.length;

  if (lang === 'ar') {
    if (nights < 3) return 'واصل التسجيل — ستظهر قصة راحتك بعد ٣ ليالٍ.';
    const lift = moodLiftAfterGoodSleep(entries);
    const s1 = `سجّلت ${nights} من آخر ٧ ليالٍ.`;
    let s2 = '';
    if (lift.lift !== null && lift.goodAvg !== null) {
      s2 = `الليالي التي قيّمتها ٤ نجوم أو أكثر تبعتها أيام بمتوسط ${fmt1(lift.goodAvg)}/٥ — أي أعلى بـ ${fmt1(lift.lift)} نقطة من لياليك المتقطعة.`;
    } else {
      const m = avgMoodLast7(entries, now);
      s2 = m !== null ? `متوسط مزاجك هذا الأسبوع ${fmt1(m)}/٥.` : 'كل ليلة تسجّلها تجعل الصورة أوضح.';
    }
    const bt = avgBedtimeOnGoodNights(entries);
    const s3 = bt ? `أفضل لياليك تبدأ عادة حوالي ${bt} — احمِ وقت التهدئة، وستتبعك الأيام.` : '';
    return [s1, s2, s3].filter(Boolean).join(' ');
  }

  if (nights < 3) return 'Keep logging — your rest story appears after 3 nights.';
  const lift = moodLiftAfterGoodSleep(entries);
  const s1 = `You logged ${nights} of the last 7 nights.`;
  let s2 = '';
  if (lift.lift !== null && lift.goodAvg !== null) {
    s2 = `Nights you rated 4★ or higher were followed by days you rated ${fmt1(lift.goodAvg)}/5 on average — ${fmt1(lift.lift)} points above your restless nights.`;
  } else {
    const m = avgMoodLast7(entries, now);
    s2 = m !== null ? `Your average mood this week is ${fmt1(m)}/5.` : 'Every night you log sharpens the picture.';
  }
  const bt = avgBedtimeOnGoodNights(entries);
  const s3 = bt ? `Your best nights tend to start around ${bt} — protect the wind-down and the days follow.` : '';
  return [s1, s2, s3].filter(Boolean).join(' ');
}

/** CSV export of the journal (Pro perk). */
export function entriesToCsv(entries: DayEntryLike[]): string {
  const rows = ['date,mood,sleep_quality,bedtime,wake_time,note'];
  const esc = (v: string | null): string =>
    v === null ? '' : /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  for (const e of [...entries].sort((a, b) => a.date.localeCompare(b.date))) {
    rows.push(
      [
        e.date,
        e.mood === null ? '' : String(e.mood),
        e.sleepQuality === null ? '' : String(e.sleepQuality),
        e.bedTime ?? '',
        e.wakeTime ?? '',
        esc(e.note ?? null),
      ].join(','),
    );
  }
  return rows.join('\n');
}
