// Pure plant-care logic: schedules, due tasks, streaks. No React, no storage.

import { speciesById } from '../data/plants';

export type CareType = 'water' | 'fertilize' | 'mist';

export interface Plant {
  id: string;
  speciesId: string;
  nickname: string;
  adoptedAt: number;
  archived: boolean;
}

export interface CareEvent {
  id: string;
  plantId: string;
  type: CareType;
  at: number;
}

export interface DueTask {
  plantId: string;
  type: CareType;
  /** days overdue (0 = due today, negative = upcoming) */
  overdueDays: number;
}

export function lastDoneAt(
  plantId: string,
  type: CareType,
  events: CareEvent[],
  adoptedAt: number,
): number {
  const done = events
    .filter((e) => e.plantId === plantId && e.type === type)
    .sort((a, b) => b.at - a.at)[0];
  return done ? done.at : adoptedAt;
}

function intervalFor(speciesId: string, type: CareType): number {
  const s = speciesById(speciesId);
  if (!s) return 0;
  return type === 'water' ? s.waterDays : type === 'fertilize' ? s.fertilizeDays : s.mistDays;
}

/** Next due timestamp (ms) for a care type. Null when not applicable. */
export function nextDueAt(
  plant: Plant,
  type: CareType,
  events: CareEvent[],
  now = Date.now(),
): number | null {
  const interval = intervalFor(plant.speciesId, type);
  if (interval <= 0) return null;
  return lastDoneAt(plant.id, type, events, plant.adoptedAt) + interval * 86_400_000;
}

/** All tasks due today or overdue, sorted most-overdue first. */
export function dueTasks(
  plants: Plant[],
  events: CareEvent[],
  now = Date.now(),
): DueTask[] {
  const out: DueTask[] = [];
  const types: CareType[] = ['water', 'fertilize', 'mist'];
  for (const p of plants) {
    if (p.archived) continue;
    for (const t of types) {
      const due = nextDueAt(p, t, events, now);
      if (due == null) continue;
      const overdueDays = Math.floor((now - due) / 86_400_000);
      if (overdueDays >= 0) out.push({ plantId: p.id, type: t, overdueDays });
    }
  }
  return out.sort((a, b) => b.overdueDays - a.overdueDays);
}

/** Upcoming tasks in the next 3 days (not yet due). */
export function upcomingTasks(
  plants: Plant[],
  events: CareEvent[],
  now = Date.now(),
): DueTask[] {
  const out: DueTask[] = [];
  const types: CareType[] = ['water', 'fertilize', 'mist'];
  for (const p of plants) {
    if (p.archived) continue;
    for (const t of types) {
      const due = nextDueAt(p, t, events, now);
      if (due == null) continue;
      const overdueDays = Math.floor((now - due) / 86_400_000);
      if (overdueDays < 0 && overdueDays >= -3) out.push({ plantId: p.id, type: t, overdueDays });
    }
  }
  return out.sort((a, b) => a.overdueDays - b.overdueDays);
}

/** Watering streak: consecutive days with ≥1 care event, ending today/yesterday. */
export function careStreak(events: CareEvent[], now = Date.now()): number {
  const days = new Set(
    events.map((e) => {
      const d = new Date(e.at);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const today = new Date(now);
  let offset = days.has(key(today)) ? 0 : -1;
  if (offset === -1) {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    if (!days.has(key(y))) return 0;
  }
  let streak = 0;
  for (;;) {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    if (!days.has(key(d))) break;
    streak += 1;
    offset -= 1;
  }
  return streak;
}
