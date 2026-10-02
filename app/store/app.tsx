import React, { createContext, useContext, useMemo, useState } from 'react';

export interface MealNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// A logged meal carries its own per-plate nutrition snapshot, so what the
// user saw (e.g. an AI estimate on the Scan screen) is what gets logged.
export interface LoggedMeal {
  id: string;
  dishId: string;
  nameEn: string;
  nameAr: string;
  cuisine: string;
  region: string;
  mealType: string;
  plates: number;
  nutrition: MealNutrition;
  tags: string[];
  allergens: string[];
}

interface AppState {
  goal: string | null;
  setGoal: (goal: string) => void;
  onboarded: boolean;
  setOnboarded: (value: boolean) => void;
  meals: LoggedMeal[];
  addMeal: (meal: Omit<LoggedMeal, 'id'>) => void;
}

const AppContext = createContext<AppState | null>(null);

// ponytail: one tiny context is the whole "store" — no state library for
// three pieces of state and a list.
const SEED_MEALS: LoggedMeal[] = [
  {
    id: 'seed-1',
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
    id: 'seed-2',
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
    id: 'seed-3',
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goal, setGoal] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [meals, setMeals] = useState<LoggedMeal[]>(SEED_MEALS);

  const value = useMemo<AppState>(
    () => ({
      goal,
      setGoal,
      onboarded,
      setOnboarded,
      meals,
      addMeal: (meal) =>
        setMeals((prev) => [
          ...prev,
          { ...meal, id: `meal-${Date.now()}` },
        ]),
    }),
    [goal, onboarded, meals],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const state = useContext(AppContext);
  if (!state) throw new Error('useApp must be used within AppProvider');
  return state;
}

export function mealTotals(meals: LoggedMeal[]): MealNutrition {
  return meals.reduce<MealNutrition>(
    (acc, m) => ({
      calories: acc.calories + m.nutrition.calories * m.plates,
      protein: acc.protein + m.nutrition.protein * m.plates,
      carbs: acc.carbs + m.nutrition.carbs * m.plates,
      fat: acc.fat + m.nutrition.fat * m.plates,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}
