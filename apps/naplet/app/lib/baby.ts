// Pure baby-logic: event model, day stats, sleep↔feeding insights.
// No React, no storage — the store owns state, this owns math.

export type EventKind = 'sleep' | 'feed' | 'diaper';
export type FeedType = 'breast' | 'bottle' | 'solid';
export type DiaperType = 'wet' | 'dirty' | 'mixed';

export interface BabyEvent {
  id: string;
  kind: EventKind;
  /** epoch ms */
  start: number;
  /** epoch ms (sleep end / feed end) */
  end?: number;
  feedType?: FeedType;
  side?: 'left' | 'right' | 'both';
  amountMl?: number;
  diaperType?: DiaperType;
  note?: string;
  /** epoch ms of last local edit — last-write-wins on family merge */
  updatedAt: number;
}

export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

export function dayStartMs(d = new Date()): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Events overlapping [from, to). */
function inRange(events: BabyEvent[], from: number, to: number): BabyEvent[] {
  return events.filter((e) => e.start < to && (e.end ?? e.start) >= from);
}

export function eventsForDay(events: BabyEvent[], d: Date): BabyEvent[] {
  const from = dayStartMs(d);
  return inRange(events, from, from + 86_400_000).sort((a, b) => b.start - a.start);
}

/** Total sleep ms within the day. Ongoing sleep counts up to `now`. */
export function sleepTotalMs(events: BabyEvent[], d: Date, now = Date.now()): number {
  const from = dayStartMs(d);
  const to = from + 86_400_000;
  let total = 0;
  for (const e of events) {
    if (e.kind !== 'sleep') continue;
    const s = Math.max(e.start, from);
    const en = Math.min(e.end ?? now, to, now);
    if (en > s) total += en - s;
  }
  return total;
}

export function countKind(events: BabyEvent[], kind: EventKind, d: Date): number {
  return eventsForDay(events, d).filter((e) => e.kind === kind).length;
}

export function lastEvent(events: BabyEvent[], kind: EventKind): BabyEvent | undefined {
  return events
    .filter((e) => e.kind === kind)
    .sort((a, b) => b.start - a.start)[0];
}

/** Longest single sleep stretch (ms) ending within the last 24h. */
export function longestRecentStretch(events: BabyEvent[], now = Date.now()): number {
  let best = 0;
  for (const e of events) {
    if (e.kind !== 'sleep') continue;
    if (e.start < now - 86_400_000) continue;
    const dur = (e.end ?? now) - e.start;
    if (dur > best) best = dur;
  }
  return best;
}

/** Average interval between feeds today (ms). Null if <2 feeds. */
export function avgFeedIntervalMs(events: BabyEvent[], d: Date): number | null {
  const feeds = eventsForDay(events, d)
    .filter((e) => e.kind === 'feed')
    .sort((a, b) => a.start - b.start);
  if (feeds.length < 2) return null;
  let gaps = 0;
  for (let i = 1; i < feeds.length; i++) gaps += feeds[i].start - feeds[i - 1].start;
  return gaps / (feeds.length - 1);
}

export interface DaySummary {
  sleepMs: number;
  feeds: number;
  diapers: number;
  naps: number;
}

/** naps = sleep events starting 6:00–19:00; night sleep otherwise */
export function summarizeDay(events: BabyEvent[], d: Date, now = Date.now()): DaySummary {
  const day = eventsForDay(events, d);
  let naps = 0;
  for (const e of day) {
    if (e.kind !== 'sleep') continue;
    const h = new Date(e.start).getHours();
    if (h >= 6 && h < 19) naps += 1;
  }
  return {
    sleepMs: sleepTotalMs(events, d, now),
    feeds: day.filter((e) => e.kind === 'feed').length,
    diapers: day.filter((e) => e.kind === 'diaper').length,
    naps,
  };
}

/**
 * Simple on-device insight cards: sleep↔feeding correlations.
 * Returns short human-readable lines (EN/AR chosen by caller).
 */
export function insightKeys(
  events: BabyEvent[],
  now = Date.now(),
): ('longStretch' | 'frequentFeeds' | 'goodNight' | 'startLogging')[] {
  const out: ('longStretch' | 'frequentFeeds' | 'goodNight' | 'startLogging')[] = [];
  if (events.length === 0) return ['startLogging'];
  const stretch = longestRecentStretch(events, now);
  if (stretch >= 4 * 3_600_000) out.push('longStretch');
  const today = new Date(now);
  const feeds = countKind(events, 'feed', today);
  const sleepHrs = sleepTotalMs(events, today, now) / 3_600_000;
  if (feeds >= 8 && sleepHrs < 10) out.push('frequentFeeds');
  const lastSleep = lastEvent(events, 'sleep');
  if (lastSleep) {
    const h = new Date(lastSleep.start).getHours();
    const nightWakes = events.filter(
      (e) =>
        e.kind === 'sleep' &&
        e.start > lastSleep.start - 12 * 3_600_000 &&
        e.start < lastSleep.start,
    ).length;
    if (h >= 21 && nightWakes <= 1) out.push('goodNight');
  }
  return out;
}

export function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatTimeOfDay(ms: number, use24h: boolean): string {
  const d = new Date(ms);
  const h = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (use24h) return `${String(h).padStart(2, '0')}:${mm}`;
  const suffix = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${suffix}`;
}
