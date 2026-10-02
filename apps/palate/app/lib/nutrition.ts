export interface MealNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ScaledMeal {
  plates: number;
  nutrition: MealNutrition;
}

// Sum of per-plate nutrition × plates across logged meals.
export function mealTotals(meals: ScaledMeal[]): MealNutrition {
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
