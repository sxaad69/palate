// verify-purchase: validate a Play/App Store purchase token server-side.
//
// Flow:
//  1. Record the purchase attempt in purchase_ledger (idempotent on token).
//  2. If PLAY_SERVICE_ACCOUNT_JSON is configured, verify the subscription
//     against the Google Play Developer API and return the real verdict.
//  3. Otherwise (service account not yet wired), record and return
//     verified=true with provisional=true so the client can unlock. These
//     rows are flagged for later reconciliation once verification is live.
//
// TODO (production hardening): provision the Play Developer API service
// account, store its JSON as the PLAY_SERVICE_ACCOUNT_JSON secret, and flip
// verification on. Until then every row with provisional=true needs re-check.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PACKAGE = "com.palate.app";

interface VerifyBody {
  purchase_token?: string;
  product_id?: string;
  platform?: string;
}

async function verifyWithGooglePlay(
  serviceAccountJson: string,
  productId: string,
  purchaseToken: string,
): Promise<{ active: boolean; expiryMs?: number }> {
  const sa = JSON.parse(serviceAccountJson);

  // OAuth2 JWT bearer flow for the Android Publisher scope.
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = btoa(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/androidpublisher",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!tokenRes.ok) throw new Error(`oauth failed: ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE}` +
    `/purchases/subscriptions/${encodeURIComponent(productId)}` +
    `/tokens/${encodeURIComponent(purchaseToken)}?access_token=${access_token}`;
  const subRes = await fetch(url);
  if (subRes.status === 404) return { active: false };
  if (!subRes.ok) throw new Error(`play api failed: ${subRes.status}`);
  const sub = await subRes.json();
  // paymentState: 1 = received, 2 = free trial; expiryTimeMillis in the future = active.
  const active =
    Number(sub.expiryTimeMillis ?? 0) > Date.now() &&
    (sub.paymentState === 1 || sub.paymentState === 2);
  return { active, expiryMs: Number(sub.expiryTimeMillis ?? 0) };
}

function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: VerifyBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "bad_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { purchase_token, product_id, platform } = body;
  if (!purchase_token || !product_id) {
    return new Response(JSON.stringify({ error: "missing_token" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const saJson = Deno.env.get("PLAY_SERVICE_ACCOUNT_JSON");
  let verified = false;
  let provisional = false;
  let expiryMs: number | undefined;

  if (saJson && platform === "android") {
    try {
      const result = await verifyWithGooglePlay(saJson, product_id, purchase_token);
      verified = result.active;
      expiryMs = result.expiryMs;
    } catch (e) {
      console.error("play verification failed:", e);
      return new Response(JSON.stringify({ error: "verification_failed", verified: false }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    // Service account not configured yet: record provisionally.
    verified = true;
    provisional = true;
  }

  // Best-effort ledger write: the table is created by migration
  // 20261002193000_purchase_ledger.sql (run in the Supabase SQL editor).
  // If it doesn't exist yet, verification still returns its verdict.
  try {
    await supabase.from("purchase_ledger").upsert(
      {
        purchase_token,
        product_id,
        platform: platform ?? "android",
        verified,
        provisional,
        expiry_ms: expiryMs ?? null,
      },
      { onConflict: "purchase_token" },
    );
  } catch (e) {
    console.warn("purchase_ledger write skipped:", e);
  }

  return new Response(JSON.stringify({ verified, provisional }), {
    headers: { "Content-Type": "application/json" },
  });
});
