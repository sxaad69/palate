// Pure habit logic: recipes, streaks, shrink detection. No React, no
// storage — the store owns state, this owns math.

export interface Recipe {
  id: string;
  /** "After I …" — the existing routine this anchors to */
  anchor: string;
  /** "I will …" — the tiny behavior (must be <30s by design) */
  behavior: string;
  /** "To celebrate, I will …" */
  celebration: string;
  createdAt: number;
  archived: boolean;
}

export interface Completion {
  recipeId: string;
  /** YYYY-MM-DD in local time */
  date: string;
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function shiftKey(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return todayKey(d);
}

/** Consecutive days (ending today or yesterday) with a completion. */
export function recipeStreak(recipeId: string, completions: Completion[]): number {
  const dates = new Set(
    completions.filter((c) => c.recipeId === recipeId).map((c) => c.date),
  );
  if (dates.size === 0) return 0;
  const now = new Date();
  if (!dates.has(todayKey(now))) {
    // No completion today yet — streak survives from yesterday.
    if (!dates.has(shiftKey(now, -1))) return 0;
  }
  let streak = 0;
  let offset = dates.has(todayKey(now)) ? 0 : -1;
  while (dates.has(shiftKey(now, offset))) {
    streak += 1;
    offset -= 1;
  }
  return streak;
}

/** Days since the last completion (0 = today). Infinity if never. */
export function daysSinceLast(recipeId: string, completions: Completion[]): number {
  const dates = completions
    .filter((c) => c.recipeId === recipeId)
    .map((c) => c.date)
    .sort();
  if (dates.length === 0) return Infinity;
  const last = new Date(`${dates[dates.length - 1]}T12:00:00`);
  const now = new Date();
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((startOf(now) - startOf(last)) / 86_400_000);
}

/**
 * Fogg debugging rule: if the behavior was missed 2+ days in a row, the
 * behavior is too big — suggest shrinking it. Returns true when the
 * "Make it tinier" nudge should show.
 */
export function shouldShrink(recipeId: string, completions: Completion[]): boolean {
  const gap = daysSinceLast(recipeId, completions);
  return gap >= 2 && gap !== Infinity;
}

/** Last 7 days (oldest → newest) with completion flags for one recipe. */
export function weekDots(
  recipeId: string,
  completions: Completion[],
): { date: string; done: boolean }[] {
  const dates = new Set(
    completions.filter((c) => c.recipeId === recipeId).map((c) => c.date),
  );
  const now = new Date();
  const out: { date: string; done: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const key = shiftKey(now, -i);
    out.push({ date: key, done: dates.has(key) });
  }
  return out;
}

export interface HabitStats {
  totalWins: number;
  activeRecipes: number;
  bestStreak: number;
}

export function computeStats(
  recipes: Recipe[],
  completions: Completion[],
): HabitStats {
  const active = recipes.filter((r) => !r.archived);
  const totalWins = completions.filter((c) =>
    active.some((r) => r.id === c.recipeId),
  ).length;
  const bestStreak = active.reduce(
    (best, r) => Math.max(best, recipeStreak(r.id, completions)),
    0,
  );
  return { totalWins, activeRecipes: active.length, bestStreak };
}
