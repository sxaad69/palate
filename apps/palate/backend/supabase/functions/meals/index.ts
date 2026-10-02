// meals: persistent meal log behind the service role.
//  POST { action: 'log', device_id, meal: {...} } -> { id }
//  POST { action: 'list', device_id, date: 'YYYY-MM-DD' } -> { meals: [...] }
// No auth yet: device_id is client-supplied, same trust model as scan_ledger.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface MealInput {
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

function toRow(deviceId: string, loggedDate: string, m: MealInput) {
  return {
    device_id: deviceId,
    dish_id: m.dishId ?? null,
    name_en: m.nameEn,
    name_ar: m.nameAr ?? null,
    cuisine: m.cuisine ?? null,
    region: m.region ?? null,
    meal_type: m.mealType ?? null,
    tags: m.tags ?? [],
    allergens: m.allergens ?? [],
    plates: m.plates ?? 1,
    portion_g: m.portion_g ?? null,
    calories: Math.round(m.nutrition.calories),
    protein_g: m.nutrition.protein,
    carbs_g: m.nutrition.carbs,
    fat_g: m.nutrition.fat,
    fiber_g: m.nutrition.fiber ?? null,
    sodium_mg: m.nutrition.sodium ?? null,
    logged_date: loggedDate,
  };
}

function toMeal(r: Record<string, unknown>) {
  return {
    id: r.id,
    dishId: r.dish_id,
    nameEn: r.name_en,
    nameAr: r.name_ar ?? "",
    cuisine: r.cuisine ?? "",
    region: r.region ?? "",
    mealType: r.meal_type ?? "",
    tags: r.tags ?? [],
    allergens: r.allergens ?? [],
    plates: Number(r.plates),
    portion_g: r.portion_g,
    nutrition: {
      calories: r.calories,
      protein: Number(r.protein_g),
      carbs: Number(r.carbs_g),
      fat: Number(r.fat_g),
      fiber: r.fiber_g != null ? Number(r.fiber_g) : null,
      sodium: r.sodium_mg != null ? Number(r.sodium_mg) : null,
    },
    loggedDate: r.logged_date,
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }

  const { action, device_id, date, meal } = body as {
    action?: string;
    device_id?: string;
    date?: string;
    meal?: MealInput;
  };
  if (!device_id || typeof device_id !== "string" || device_id.length > 128) {
    return Response.json({ error: "missing_device_id" }, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  if (action === "log") {
    if (!meal?.nameEn || !meal?.nutrition) {
      return Response.json({ error: "missing_meal" }, { status: 400 });
    }
    const loggedDate =
      typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? date
        : new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("meals")
      .insert(toRow(device_id, loggedDate, meal))
      .select("id")
      .single();
    if (error) {
      console.error("meals log failed:", error);
      return Response.json({ error: "db_error" }, { status: 500 });
    }
    return Response.json({ id: data.id });
  }

  if (action === "list") {
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ error: "missing_date" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("device_id", device_id)
      .eq("logged_date", date)
      .order("created_at", { ascending: true });
    if (error) {
      console.error("meals list failed:", error);
      return Response.json({ error: "db_error" }, { status: 500 });
    }
    return Response.json({ meals: (data ?? []).map(toMeal) });
  }

  return Response.json({ error: "bad_action" }, { status: 400 });
});
