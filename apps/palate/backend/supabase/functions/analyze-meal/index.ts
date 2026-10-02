// analyze-meal: photo -> dish identification -> curated nutrition.
// AI does recognition + portion guess; curated `dishes` table is the nutrition source.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FREE_SCANS = 3;
const DISH_PROMPT =
  'Identify the dish in this photo. Respond with ONLY JSON, no other text: ' +
  '{"dish_name": "...", "confidence": 0.0-1.0, "portion_g": number, "portion_label": "..."}';

interface DishGuess {
  dish_name: string;
  confidence: number;
  portion_g: number;
  portion_label: string;
}

// Capability-tagged adapters: the router only calls adapters with vision:true.
// A future text-only provider gets vision:false and is skipped automatically.
interface VisionAdapter {
  name: string;
  capabilities: { vision: boolean };
  identify(imageBase64: string): Promise<DishGuess>;
}

function parseDishJson(raw: string): DishGuess {
  const clean = raw.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  const obj = JSON.parse(clean.slice(start, end + 1));
  return {
    dish_name: String(obj.dish_name ?? ""),
    confidence: Number(obj.confidence ?? 0),
    portion_g: Number(obj.portion_g ?? 100),
    portion_label: String(obj.portion_label ?? ""),
  };
}

const gemini: VisionAdapter = {
  name: "gemini",
  capabilities: { vision: true },
  async identify(imageBase64: string) {
    const models = ["gemini-flash-latest", "gemini-3-flash-preview"]; // AQ. keys use x-goog-api-key header only
    let lastErr = "";
    for (const model of models) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "x-goog-api-key": Deno.env.get("GEMINI_API_KEY") ?? "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
                  { text: DISH_PROMPT },
                ],
              },
            ],
          }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        return parseDishJson(data.candidates[0].content.parts[0].text);
      }
      lastErr = `${res.status} ${await res.text().then((t) => t.slice(0, 120))}`;
    }
    throw new Error(`gemini failed: ${lastErr}`);
  },
};

const nvidia: VisionAdapter = {
  name: "nvidia",
  capabilities: { vision: true },
  async identify(imageBase64: string) {
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("NVIDIA_API_KEY") ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-11b-vision-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: DISH_PROMPT },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });
    if (!res.ok) throw new Error(`nvidia failed: ${res.status}`);
    const data = await res.json();
    return parseDishJson(data.choices[0].message.content);
  },
};

const ADAPTERS: VisionAdapter[] = [gemini, nvidia];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405, headers: cors });
  }

  let body: { image_base64?: string; device_id?: string; integrity_token?: string; _force_adapter?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400, headers: cors });
  }
  const { image_base64, device_id, integrity_token, _force_adapter } = body;
  if (!image_base64 || !device_id) {
    return Response.json({ error: "image_base64 and device_id required" }, { status: 400, headers: cors });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Play Integrity: verify the token when the Play API key is configured.
  // Until then, log attestation presence for later analysis (not a gate).
  const integrityKey = Deno.env.get("PLAY_INTEGRITY_API_KEY");
  let attested = false;
  if (integrity_token && integrityKey) {
    try {
      const verifyRes = await fetch(
        `https://playintegrity.googleapis.com/v1/${Deno.env.get("PLAY_PACKAGE_NAME") ?? "com.palate.app"}:decodeIntegrityToken?key=${integrityKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ integrityToken: integrity_token }),
        },
      );
      if (verifyRes.ok) {
        const verdict = await verifyRes.json();
        const deviceVerdict: string[] = verdict?.deviceIntegrity?.deviceRecognitionVerdict ?? [];
        const appVerdict: string = verdict?.appIntegrity?.appRecognitionVerdict ?? "";
        attested =
          deviceVerdict.includes("MEETS_DEVICE_INTEGRITY") &&
          (appVerdict === "PLAY_RECOGNIZED" || appVerdict === "UNRECOGNIZED_VERSION");
      }
    } catch (e) {
      console.error("integrity verify failed:", e);
    }
  }
  if (integrity_token && !integrityKey) {
    console.log("integrity token present but PLAY_INTEGRITY_API_KEY not configured (provisional accept)");
  }

  // Rate limiting: 10 requests per IP per 60s window (fixed windows).
  // ponytail: crude but effective v1; tighten per-endpoint if abuse appears.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";
  const windowStart = new Date(Math.floor(Date.now() / 60000) * 60000).toISOString();
  const { data: bucket } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("ip", ip)
    .eq("window_start", windowStart)
    .maybeSingle();
  const hits = bucket?.count ?? 0;
  if (hits >= 10) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: cors });
  }
  if (bucket) {
    await supabase.from("rate_limits").update({ count: hits + 1 }).eq("ip", ip).eq("window_start", windowStart);
  } else {
    await supabase.from("rate_limits").insert({ ip, window_start: windowStart, count: 1 });
  }

  // Anti-abuse: free-scan ledger per device, enforced server-side.
  // ponytail: read-then-write races under concurrent scans; ceiling = a few extra free scans, acceptable v1.
  const { data: ledger } = await supabase
    .from("scan_ledger")
    .select("free_scans_used")
    .eq("device_id", device_id)
    .maybeSingle();
  const used = ledger?.free_scans_used ?? 0;
  if (used >= FREE_SCANS) {
    return Response.json({ error: "free_scans_exhausted", paywall: true }, { status: 429, headers: cors });
  }
  if (ledger) {
    await supabase.from("scan_ledger").update({ free_scans_used: used + 1, updated_at: new Date().toISOString() }).eq("device_id", device_id);
  } else {
    await supabase.from("scan_ledger").insert({ device_id, free_scans_used: 1 });
  }
  const scans_left = FREE_SCANS - (used + 1);

  // Router: first vision-capable adapter that succeeds wins.
  const adapters = _force_adapter
    ? ADAPTERS.filter((a) => a.name === _force_adapter)
    : ADAPTERS.filter((a) => a.capabilities.vision);
  let guess: DishGuess | null = null;
  let provider = "";
  for (const adapter of adapters) {
    try {
      guess = await adapter.identify(image_base64);
      provider = adapter.name;
      break;
    } catch (e) {
      console.error(adapter.name, "failed:", (e as Error).message);
    }
  }
  if (!guess) {
    return Response.json({ error: "ai_unavailable" }, { status: 502, headers: cors });
  }

  // Match against curated data: full name first, then distinctive words
  // (generic words like "chicken"/"rice" are skipped — matching on them alone
  // produces confidently-wrong dishes, e.g. biryani -> chicken shawarma).
  const STOPWORDS = new Set([
    "chicken", "rice", "meat", "lamb", "beef", "fish", "bread", "with", "and",
    "the", "sauce", "grilled", "fried", "plate", "dish", "style", "mixed",
    "white", "red", "green", "hot", "sweet", "lamb", "goat",
  ]);
  const words = guess.dish_name.split(/\s+/).filter(Boolean);
  const distinctive = words
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w.toLowerCase()))
    .sort((a, b) => b.length - a.length);
  let dish = null;
  for (const term of [guess.dish_name, ...distinctive]) {
    const { data } = await supabase.from("dishes").select("*").ilike("name_en", `%${term}%`).limit(1);
    if (data?.length) {
      dish = data[0];
      break;
    }
  }
  if (!dish) {
    return Response.json({ matched: false, ai: guess, provider, scans_left }, { headers: cors });
  }

  // Portion sanity: models sometimes return 1g or 2500g. Outside a sane
  // range we fall back to the standard serving instead of scaling garbage.
  const portionG =
    guess.portion_g >= 50 && guess.portion_g <= 1500 ? guess.portion_g : dish.serving_size_g || 100;
  const factor = portionG / (dish.serving_size_g || 100);
  const scaled = {
    calories: Math.round(dish.calories * factor),
    protein_g: +(dish.protein_g * factor).toFixed(1),
    carbs_g: +(dish.carbs_g * factor).toFixed(1),
    fat_g: +(dish.fat_g * factor).toFixed(1),
    fiber_g: dish.fiber_g == null ? null : +(dish.fiber_g * factor).toFixed(1),
    sodium_mg: dish.sodium_mg == null ? null : Math.round(dish.sodium_mg * factor),
  };
  return Response.json(
    {
      matched: true,
      provider,
      dish: { id: dish.id, name_en: dish.name_en, name_ar: dish.name_ar, region: dish.region, cuisine: dish.cuisine },
      ai: guess,
      nutrition: scaled,
      scans_left,
    },
    { headers: cors },
  );
});
