// Gamification logic — pure functions only. No JSX, no React Native imports,
// so this module is runnable and unit-testable in plain node.

export const XP_PER_MEAL = 10;
export const XP_GOAL_BONUS = 5;
export const DEFAULT_CALORIE_GOAL = 2000;
export const PROTEIN_GOAL_G = 100;

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

export interface LevelInfo {
  level: number;
  name: string;
  /** XP earned within the current level. */
  xpIntoLevel: number;
  /** XP needed to go from the current level's floor to the next level's floor; null at max level. */
  xpForNext: number | null;
}

const LEVELS: { level: number; name: string; threshold: number }[] = [
  { level: 1, name: 'Taster', threshold: 0 },
  { level: 2, name: 'Explorer', threshold: 100 },
  { level: 3, name: 'Foodie', threshold: 250 },
  { level: 4, name: 'Connoisseur', threshold: 500 },
  { level: 5, name: 'Palate Master', threshold: 1000 },
];

export function levelForXp(xp: number): LevelInfo {
  const safe = Math.max(0, Math.floor(xp));
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (safe >= LEVELS[i].threshold) idx = i;
  }
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1];
  return {
    level: current.level,
    name: current.name,
    xpIntoLevel: safe - current.threshold,
    xpForNext: next ? next.threshold - current.threshold : null,
  };
}

// ---------------------------------------------------------------------------
// Date helpers — YYYY-MM-DD strings, no date library.
// ---------------------------------------------------------------------------

export function todayStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function yesterdayStr(today: string): string {
  const [y, m, d] = today.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return todayStr(dt);
}

/**
 * Consecutive calendar days with ≥1 logged meal.
 * - first ever log (no lastLogDate) → 1
 * - already logged today → unchanged
 * - last log was yesterday → +1
 * - any gap → reset to 1
 */
export function updateStreak(
  currentStreak: number,
  lastLogDate: string | null,
  today: string,
): number {
  if (!lastLogDate) return 1;
  if (lastLogDate === today) return currentStreak;
  if (lastLogDate === yesterdayStr(today)) return currentStreak + 1;
  return 1;
}

// ---------------------------------------------------------------------------
// XP awards
// ---------------------------------------------------------------------------

export interface XpAward {
  xp: number;
  /** True when the daily-goal bonus was earned by this log (caller persists the date). */
  awardBonus: boolean;
}

/** +10 per meal, +5 once per day when the day's calories reach the goal. */
export function xpForMealLog(
  dayCaloriesAfter: number,
  calorieGoal: number = DEFAULT_CALORIE_GOAL,
  goalBonusAwardedToday: boolean = false,
): XpAward {
  const awardBonus = !goalBonusAwardedToday && dayCaloriesAfter >= calorieGoal;
  return { xp: XP_PER_MEAL + (awardBonus ? XP_GOAL_BONUS : 0), awardBonus };
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export interface BadgeContext {
  totalMeals: number;
  streak: number;
  gulfMeals: number;
  regions: string[];
  proteinGoalDays: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  /** Short two-line label for the badge grid. */
  caption: string;
  check: (ctx: BadgeContext) => boolean;
}

export const GULF_REGION = 'Arabian Peninsula';

export const BADGES: Badge[] = [
  {
    id: 'first-bite',
    name: 'First Bite',
    emoji: '🍽️',
    caption: 'First meal',
    check: (c) => c.totalMeals >= 1,
  },
  {
    id: 'streak-7',
    name: '7-Day Streak',
    emoji: '🔥',
    caption: '7-day streak',
    check: (c) => c.streak >= 7,
  },
  {
    id: 'gulf-explorer',
    name: 'Gulf Explorer',
    emoji: '🍛',
    caption: 'Gulf explorer',
    check: (c) => c.gulfMeals >= 5,
  },
  {
    id: 'world-taster',
    name: 'World Taster',
    emoji: '🌍',
    caption: '3 cuisines',
    check: (c) => c.regions.length >= 3,
  },
  {
    id: 'protein-pro',
    name: 'Protein Pro',
    emoji: '💪',
    caption: 'Protein pro',
    check: (c) => c.proteinGoalDays >= 3,
  },
];

/** Ids of badges newly earned by this check (already-unlocked ones excluded). */
export function checkBadges(
  ctx: BadgeContext,
  alreadyUnlocked: string[],
): string[] {
  return BADGES.filter(
    (b) => !alreadyUnlocked.includes(b.id) && b.check(ctx),
  ).map((b) => b.id);
}
