import { supabase } from './supabase';
import type { Completion } from './habits';

export interface VerifyPurchaseParams {
  purchaseToken: string;
  productId: string;
  platform: 'android' | 'ios';
}

/**
 * Ask the backend to verify a Play purchase token. Server-verified once the
 * Play Developer API service account is wired (launch step).
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

export interface ServerEventInput {
  recipeId: string;
  date: string;
  kind: 'completed' | 'shrunk';
}

/** Persist a habit event server-side. Fire-and-forget friendly. */
export async function logEventToServer(
  deviceId: string,
  event: ServerEventInput,
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('habits', {
      body: { action: 'log', device_id: deviceId, event },
    });
    return !error;
  } catch {
    return false;
  }
}

/** Fetch completions from the server. Null on failure (caller keeps cache). */
export async function fetchEventsFromServer(
  deviceId: string,
): Promise<Completion[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke('habits', {
      body: { action: 'list', device_id: deviceId },
    });
    if (error) return null;
    const events = (data as { events?: unknown } | null)?.events;
    return Array.isArray(events) ? (events as Completion[]) : null;
  } catch {
    return null;
  }
}
