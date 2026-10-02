// Pure dose-schedule logic — zero imports so it stays unit-checkable.
// All dates are local-time day keys ("YYYY-MM-DD").

export type Frequency = 'daily' | 'twice' | 'three' | 'weekly';

export interface SchedMed {
  id: string;
  petId: string;
  times: string[]; // "HH:MM"
  frequency: Frequency;
  startDate: string; // day key
  endDate?: string; // day key, optional
}

export interface DoseEventRec {
  key: string; // `${medId}|${date}|${time}`
  at: number; // epoch ms
  status: 'given' | 'skipped';
}

export interface Occurrence {
  key: string;
  medId: string;
  petId: string;
  date: string;
  time: string;
  at: number; // local epoch ms
}

export type OccurrenceStatus = 'given' | 'skipped' | 'overdue' | 'upcoming';

const DAY_MS = 86_400_000;

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function occurrenceKey(medId: string, date: string, time: string): string {
  return `${medId}|${date}|${time}`;
}

function timeToMs(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return ((h ?? 0) * 60 + (m ?? 0)) * 60_000;
}

/** Does this med fire on this date? Weekly meds fire on the start-date weekday. */
export function occursOn(med: SchedMed, date: string): boolean {
  if (date < med.startDate) return false;
  if (med.endDate && date > med.endDate) return false;
  if (med.frequency === 'weekly') {
    return parseDayKey(date).getDay() === parseDayKey(med.startDate).getDay();
  }
  return true;
}

export function occurrencesForDay(med: SchedMed, date: string): Occurrence[] {
  if (!occursOn(med, date)) return [];
  const base = parseDayKey(date).getTime();
  return med.times.map((time) => ({
    key: occurrenceKey(med.id, date, time),
    medId: med.id,
    petId: med.petId,
    date,
    time,
    at: base + timeToMs(time),
  }));
}

export function occurrencesInRange(meds: SchedMed[], from: string, to: string): Occurrence[] {
  const out: Occurrence[] = [];
  let cursor = parseDayKey(from);
  const end = parseDayKey(to);
  while (cursor <= end) {
    const date = localDayKey(cursor);
    for (const med of meds) out.push(...occurrencesForDay(med, date));
    cursor = new Date(cursor.getTime() + DAY_MS);
  }
  return out.sort((a, b) => a.at - b.at);
}

export function resolveStatus(
  occ: Occurrence,
  now: number,
  events: Map<string, DoseEventRec>,
): OccurrenceStatus {
  const ev = events.get(occ.key);
  if (ev) return ev.status;
  return occ.at <= now ? 'overdue' : 'upcoming';
}

export interface Adherence {
  expected: number;
  given: number;
  pct: number; // 0-100
}

/** Adherence over the last `days` days ending today (local). */
export function adherence(
  med: SchedMed,
  events: DoseEventRec[],
  days = 7,
  now = Date.now(),
): Adherence {
  const today = localDayKey(new Date(now));
  const from = localDayKey(new Date(now - (days - 1) * DAY_MS));
  const evMap = new Map(events.map((e) => [e.key, e]));
  let expected = 0;
  let given = 0;
  for (const occ of occurrencesInRange([med], from, today)) {
    expected += 1;
    if (evMap.get(occ.key)?.status === 'given') given += 1;
  }
  return { expected, given, pct: expected === 0 ? 100 : Math.round((given / expected) * 100) };
}

/** Doses given in the last `days` days (across meds). */
export function dosesGiven(meds: SchedMed[], events: DoseEventRec[], days = 7, now = Date.now()): number {
  const today = localDayKey(new Date(now));
  const from = localDayKey(new Date(now - (days - 1) * DAY_MS));
  const valid = new Set(occurrencesInRange(meds, from, today).map((o) => o.key));
  return events.filter((e) => e.status === 'given' && valid.has(e.key)).length;
}

/**
 * Streak: consecutive days (ending today, or yesterday if today has no
 * completed day yet) where every expected occurrence was given.
 * ponytail: O(days × occurrences) scan is fine — pet med counts are tiny.
 */
export function streak(petId: string, meds: SchedMed[], events: DoseEventRec[], now = Date.now()): number {
  const petMeds = meds.filter((m) => m.petId === petId);
  if (petMeds.length === 0) return 0;
  const evMap = new Map(events.map((e) => [e.key, e]));
  const today = new Date(now);
  // Start from today if it already has any occurrence; otherwise yesterday.
  const todayKey = localDayKey(today);
  const hasToday = petMeds.some((m) => occurrencesForDay(m, todayKey).length > 0);
  let cursor = new Date(today.getTime() + (hasToday ? 0 : -DAY_MS));
  let streak = 0;
  for (let guard = 0; guard < 365; guard++) {
    const date = localDayKey(cursor);
    let expected = 0;
    let given = 0;
    for (const med of petMeds) {
      for (const occ of occurrencesForDay(med, date)) {
        expected += 1;
        if (evMap.get(occ.key)?.status === 'given') given += 1;
      }
    }
    if (expected === 0) {
      // No doses expected that day: doesn't break the streak, but don't
      // count it either — just walk back. Stop at the med start horizon.
      cursor = new Date(cursor.getTime() - DAY_MS);
      continue;
    }
    if (given < expected) break;
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
}

export function isValidTime(s: string): boolean {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(s.trim());
  return m !== null;
}

export function isValidDayKey(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.trim())) return false;
  const d = parseDayKey(s.trim());
  return localDayKey(d) === s.trim();
}

export const DEFAULT_TIMES: Record<Frequency, string[]> = {
  daily: ['09:00'],
  twice: ['09:00', '21:00'],
  three: ['08:00', '14:00', '20:00'],
  weekly: ['09:00'],
};
