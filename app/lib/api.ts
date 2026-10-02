// Typed client for the Palate backend (Supabase Edge Functions).
// The app never holds provider keys; analyze-meal runs server-side.
import { supabase } from './supabase';

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
  const { data, error } = await supabase.functions.invoke('analyze-meal', {
    body: {
      image_base64: imageBase64,
      device_id: deviceId,
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
