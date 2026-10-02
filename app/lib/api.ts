// Typed client for the Palate backend (Supabase Edge Functions).
// The app never holds provider keys; analyze-meal runs server-side.
import { supabase } from './supabase';
import type { LoggedMeal } from '../store/app';

export interface DishGuess {
  dish_name: string;
  confidence: number;
  portion_g: number;
  portion_label: string;
}

export interface MatchedDish {
  id: string;
  name_en: string;
  name_ar: string | null;
  region: string | null;
  cuisine: string | null;
}

export interface ScaledNutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  sodium_mg: number | null;
}

export type AnalyzeMealResult =
  | { matched: true; provider: string; dish: MatchedDish; ai: DishGuess; nutrition: ScaledNutrition; scans_left: number }
  | { matched: false; provider: string; ai: DishGuess; scans_left: number };

export class FreeScansExhaustedError extends Error {
  constructor() {
    super('free_scans_exhausted');
    this.name = 'FreeScansExhaustedError';
  }
}

export async function analyzeMeal(
  imageBase64: string,
  deviceId: string,
  forceAdapter?: string,
): Promise<AnalyzeMealResult> {
  // Best-effort Play Integrity token; null when unavailable (not a blocker).
  let integrityToken: string | null = null;
  try {
    const { getIntegrityToken } = await import('./integrity');
    integrityToken = await getIntegrityToken();
  } catch {
    // ignore — unattested
  }
  const { data, error } = await supabase.functions.invoke('analyze-meal', {
    body: {
      image_base64: imageBase64,
      device_id: deviceId,
      ...(integrityToken ? { integrity_token: integrityToken } : {}),
      ...(forceAdapter ? { _force_adapter: forceAdapter } : {}),
    },
  });
  if (error) {
    const status =
      (error as { context?: { status?: number } }).context?.status ??
      (error as { status?: number }).status;
    if (status === 429 || (data as { error?: string } | null)?.error === 'free_scans_exhausted') {
      throw new FreeScansExhaustedError();
    }
    throw error;
  }
  if ((data as { error?: string })?.error === 'free_scans_exhausted') {
    throw new FreeScansExhaustedError();
  }
  return data as AnalyzeMealResult;
}

export type MealInput = Omit<LoggedMeal, 'id' | 'loggedDate'>;

export interface VerifyPurchaseParams {
  purchaseToken: string;
  productId: string;
  platform: 'android' | 'ios';
}

/**
 * Ask the backend to verify a Play/App Store purchase token.
 * Returns true when the subscription is valid and active.
 * The server checks against Google Play while the Play Developer API
 * service account is configured; until then it records the purchase and
 * returns true so the client can unlock (logged for later reconciliation).
 */
export async function verifyPurchaseToken(params: VerifyPurchaseParams): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-purchase', {
      body: {
        purchase_token: params.purchaseToken,
        product_id: params.productId,
        platform: params.platform,
      },
    });
    if (error) return false;
    return (data as { verified?: boolean } | null)?.verified === true;
  } catch {
    return false;
  }
}

export interface ServerMealInput {
  dishId?: string;
  nameEn: string;
  nameAr?: string;
  cuisine?: string;
  region?: string;
  mealType?: string;
  tags?: string[];
  allergens?: string[];
  plates?: number;
  portion_g?: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number | null;
    sodium?: number | null;
  };
}

/** Persist a meal server-side. Fire-and-forget friendly: returns the server id or null. */
export async function logMealToServer(
  deviceId: string,
  meal: ServerMealInput,
  date: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('meals', {
      body: { action: 'log', device_id: deviceId, date, meal },
    });
    if (error) return null;
    return (data as { id?: string } | null)?.id ?? null;
  } catch {
    return null;
  }
}

/** Fetch the day's meals from the server. Returns null on failure (caller keeps cache). */
export async function fetchMealsFromServer(
  deviceId: string,
  date: string,
): Promise<LoggedMeal[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke('meals', {
      body: { action: 'list', device_id: deviceId, date },
    });
    if (error) return null;
    const meals = (data as { meals?: unknown } | null)?.meals;
    return Array.isArray(meals) ? (meals as LoggedMeal[]) : null;
  } catch {
    return null;
  }
}

/**
 * Map a matched analyze-meal response onto the app's meal shape.
 * Pure — the server already scaled nutrition to the AI's portion estimate.
 */
export function mealInputFromAnalysis(
  result: Extract<AnalyzeMealResult, { matched: true }>,
  mealType: string,
): MealInput {
  const r = Math.round;
  return {
    dishId: result.dish.id,
    nameEn: result.dish.name_en,
    nameAr: result.dish.name_ar ?? '',
    cuisine: result.dish.cuisine ?? 'Custom',
    region: result.dish.region ?? 'Unknown',
    mealType,
    plates: 1,
    nutrition: {
      calories: r(result.nutrition.calories),
      protein: r(result.nutrition.protein_g),
      carbs: r(result.nutrition.carbs_g),
      fat: r(result.nutrition.fat_g),
    },
    tags: ['ai-scan'],
    allergens: [],
  };
}
