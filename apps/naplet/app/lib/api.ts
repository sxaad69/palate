import { supabase } from './supabase';
import type { BabyEvent } from './baby';

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

export interface ServerEvent {
  id: string;
  kind: BabyEvent['kind'];
  start: number;
  end?: number;
  feedType?: BabyEvent['feedType'];
  side?: BabyEvent['side'];
  amountMl?: number;
  diaperType?: BabyEvent['diaperType'];
  note?: string;
  updatedAt: number;
  deleted?: boolean;
}

/** Upsert events server-side under the family code. Fire-and-forget friendly. */
export async function syncEventsToServer(
  familyCode: string,
  events: ServerEvent[],
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('naplet', {
      body: { action: 'sync', family_code: familyCode, events },
    });
    return !error;
  } catch {
    return false;
  }
}

/** Fetch the family's events. Null on failure (caller keeps cache). */
export async function fetchEventsFromServer(
  familyCode: string,
): Promise<ServerEvent[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke('naplet', {
      body: { action: 'list', family_code: familyCode },
    });
    if (error) return null;
    const events = (data as { events?: unknown } | null)?.events;
    return Array.isArray(events) ? (events as ServerEvent[]) : null;
  } catch {
    return null;
  }
}
