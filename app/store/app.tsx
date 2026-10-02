import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MealNutrition, ScaledMeal } from '../lib/nutrition';
import {
  BADGES,
  DEFAULT_CALORIE_GOAL,
  GULF_REGION,
  PROTEIN_GOAL_G,
  checkBadges,
  levelForXp,
  todayStr,
  updateStreak,
  xpForMealLog,
  type BadgeContext,
  type LevelInfo,
} from '../lib/gamification';

export type { MealNutrition };
export { mealTotals } from '../lib/nutrition';
export { levelForXp, BADGES, type LevelInfo };

// A logged meal carries its own per-plate nutrition snapshot, so what the
// user saw (e.g. an AI estimate on the Scan screen) is what gets logged.
export interface LoggedMeal extends ScaledMeal {
  id: string;
  dishId: string;
  nameEn: string;
  nameAr: string;
  cuisine: string;
  region: string;
  mealType: string;
  tags: string[];
  allergens: string[];
  loggedDate: string; // YYYY-MM-DD — the store fills this in addMeal
}

interface AppState {
  goal: string | null;
  setGoal: (goal: string) => void;
  onboarded: boolean;
  setOnboarded: (value: boolean) => void;
  meals: LoggedMeal[];
  addMeal: (meal: Omit<LoggedMeal, 'id' | 'loggedDate'>) => void;
  // gamification
  xp: number;
  level: LevelInfo;
  streak: number;
  unlockedBadges: string[];
  // free AI scans: 3 per install, then the paywall
  freeScansLeft: number;
  /** Decrements one scan if any remain. Returns false when exhausted. */
  useFreeScan: () => boolean;
  /** Overwrite from the server's scans_left — the server is the authority. */
  syncFreeScansLeft: (n: number) => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = '@palate/gamification/v1';
const FREE_SCANS = 3;

// ponytail: one tiny context is the whole "store" — no state library for
// a handful of values and a list.
const SEED_MEALS: Omit<LoggedMeal, 'id' | 'loggedDate'>[] = [
  {
    dishId: 'na-ful-medames',
    nameEn: 'Ful Medames',
    nameAr: 'فول مدمس',
    cuisine: 'Egyptian',
    region: 'North Africa',
    mealType: 'Breakfast',
    plates: 1,
    nutrition: { calories: 295, protein: 14, carbs: 42, fat: 8 },
    tags: ['vegan', 'high-fiber', 'breakfast-staple'],
    allergens: [],
  },
  {
    dishId: 'ap-kabsa',
    nameEn: 'Kabsa',
    nameAr: 'كبسة',
    cuisine: 'Saudi',
    region: 'Arabian Peninsula',
    mealType: 'Lunch',
    plates: 1,
    nutrition: { calories: 620, protein: 38, carbs: 68, fat: 22 },
    tags: ['rice', 'chicken', 'national-dish'],
    allergens: [],
  },
  {
    dishId: 'sl-hummus',
    nameEn: 'Hummus',
    nameAr: 'حمص',
    cuisine: 'Levantine',
    region: 'Levant',
    mealType: 'Snack',
    plates: 1,
    nutrition: { calories: 177, protein: 8, carbs: 20, fat: 8 },
    tags: ['vegan', 'gluten-free', 'mezze'],
    allergens: ['sesame'],
  },
];

interface PersistedGamification {
  xp: number;
  streak: number;
  lastLogDate: string | null;
  unlockedBadges: string[];
  proteinGoalDays: number;
  proteinGoalHitDate: string | null;
  goalBonusDate: string | null;
  freeScansLeft: number;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goal, setGoal] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [meals, setMeals] = useState<LoggedMeal[]>(() =>
    SEED_MEALS.map((m, i) => ({
      ...m,
      id: `seed-${i + 1}`,
      loggedDate: todayStr(),
    })),
  );

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastLogDate, setLastLogDate] = useState<string | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [proteinGoalDays, setProteinGoalDays] = useState(0);
  const [proteinGoalHitDate, setProteinGoalHitDate] = useState<string | null>(
    null,
  );
  const [goalBonusDate, setGoalBonusDate] = useState<string | null>(null);
  const [freeScansLeft, setFreeScansLeft] = useState(FREE_SCANS);

  // Load persisted gamification once on start; corrupted data → fresh start.
  const hydratedRef = useRef(false);
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const d = JSON.parse(raw) as Partial<PersistedGamification>;
          if (typeof d.xp === 'number') setXp(d.xp);
          if (typeof d.streak === 'number') setStreak(d.streak);
          if (typeof d.lastLogDate === 'string' || d.lastLogDate === null)
            setLastLogDate(d.lastLogDate ?? null);
          if (Array.isArray(d.unlockedBadges))
            setUnlockedBadges(d.unlockedBadges.filter((b) => typeof b === 'string'));
          if (typeof d.proteinGoalDays === 'number')
            setProteinGoalDays(d.proteinGoalDays);
          if (typeof d.proteinGoalHitDate === 'string' || d.proteinGoalHitDate === null)
            setProteinGoalHitDate(d.proteinGoalHitDate ?? null);
          if (typeof d.goalBonusDate === 'string' || d.goalBonusDate === null)
            setGoalBonusDate(d.goalBonusDate ?? null);
          if (typeof d.freeScansLeft === 'number')
            setFreeScansLeft(Math.max(0, d.freeScansLeft));
        }
      } catch {
        // ignore — start fresh
      } finally {
        hydratedRef.current = true;
      }
    })();
  }, []);

  // Save on every change, but never before the initial load completes.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const data: PersistedGamification = {
      xp,
      streak,
      lastLogDate,
      unlockedBadges,
      proteinGoalDays,
      proteinGoalHitDate,
      goalBonusDate,
      freeScansLeft,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [xp, streak, lastLogDate, unlockedBadges, proteinGoalDays, proteinGoalHitDate, goalBonusDate, freeScansLeft]);

  // One tap = one scan. Returns false when the free scans are exhausted.
  const useFreeScan = () => {
    if (freeScansLeft <= 0) return false;
    setFreeScansLeft((n) => n - 1);
    return true;
  };

  // Server-side scans_left wins over the local counter when reachable.
  const syncFreeScansLeft = (n: number) => {
    setFreeScansLeft(Math.max(0, Math.floor(n)));
  };

  const addMeal = (meal: Omit<LoggedMeal, 'id' | 'loggedDate'>) => {
    const today = todayStr();
    const newMeal: LoggedMeal = {
      ...meal,
      id: `meal-${Date.now()}`,
      loggedDate: today,
    };
    const nextMeals = [...meals, newMeal];
    const todaysMeals = nextMeals.filter((m) => m.loggedDate === today);
    const dayCals = todaysMeals.reduce(
      (s, m) => s + m.nutrition.calories * m.plates,
      0,
    );
    const dayProtein = todaysMeals.reduce(
      (s, m) => s + m.nutrition.protein * m.plates,
      0,
    );

    const nextStreak = updateStreak(streak, lastLogDate, today);
    const award = xpForMealLog(dayCals, DEFAULT_CALORIE_GOAL, goalBonusDate === today);

    let nextProteinDays = proteinGoalDays;
    let nextProteinHitDate = proteinGoalHitDate;
    if (dayProtein >= PROTEIN_GOAL_G && proteinGoalHitDate !== today) {
      nextProteinDays += 1;
      nextProteinHitDate = today;
    }

    const ctx: BadgeContext = {
      totalMeals: nextMeals.length,
      streak: nextStreak,
      gulfMeals: nextMeals.filter((m) => m.region === GULF_REGION).length,
      regions: [...new Set(nextMeals.map((m) => m.region))],
      proteinGoalDays: nextProteinDays,
    };
    const newlyUnlocked = checkBadges(ctx, unlockedBadges);

    setMeals(nextMeals);
    setXp((x) => x + award.xp);
    setStreak(nextStreak);
    setLastLogDate(today);
    setProteinGoalDays(nextProteinDays);
    setProteinGoalHitDate(nextProteinHitDate);
    if (award.awardBonus) setGoalBonusDate(today);
    if (newlyUnlocked.length > 0)
      setUnlockedBadges((prev) => [...prev, ...newlyUnlocked]);
  };

  const value = useMemo<AppState>(
    () => ({
      goal,
      setGoal,
      onboarded,
      setOnboarded,
      meals,
      addMeal,
      xp,
      level: levelForXp(xp),
      streak,
      unlockedBadges,
      freeScansLeft,
      useFreeScan,
      syncFreeScansLeft,
    }),
    [goal, onboarded, meals, xp, streak, unlockedBadges, lastLogDate, proteinGoalDays, proteinGoalHitDate, goalBonusDate, freeScansLeft],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const state = useContext(AppContext);
  if (!state) throw new Error('useApp must be used within AppProvider');
  return state;
}
