import { supabase } from './supabase';
import type { FastEntry } from './fasting';

export interface VerifyPurchaseParams {
  purchaseToken: string;
  productId: string;
  platform: 'android' | 'ios';
}

/**
 * Ask the backend to verify a Play purchase token. Returns true when the
 * subscription is valid. Server-verified once the Play Developer API service
 * account is wired (launch step); until then the function records and
 * provisionally accepts (logged for reconciliation).
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

export interface ServerFastInput {
  startedAt: number;
  endedAt: number;
  targetHours: number;
  presetId: string;
  completed: boolean;
}

/** Persist a fast server-side. Fire-and-forget friendly: returns id or null. */
export async function logFastToServer(
  deviceId: string,
  fast: ServerFastInput,
): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('fasts', {
      body: { action: 'log', device_id: deviceId, fast },
    });
    if (error) return null;
    return (data as { id?: string } | null)?.id ?? null;
  } catch {
    return null;
  }
}

/** Fetch fast history from the server. Null on failure (caller keeps cache). */
export async function fetchFastsFromServer(
  deviceId: string,
): Promise<FastEntry[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke('fasts', {
      body: { action: 'list', device_id: deviceId },
    });
    if (error) return null;
    const fasts = (data as { fasts?: unknown } | null)?.fasts;
    return Array.isArray(fasts) ? (fasts as FastEntry[]) : null;
  } catch {
    return null;
  }
}
