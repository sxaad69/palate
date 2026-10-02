import { supabase } from './supabase';
import type { CareEvent, CareType, Plant } from './plants';

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

export interface ServerPlant {
  id: string;
  speciesId: string;
  nickname: string;
  adoptedAt: number;
  archived: boolean;
}

export interface ServerCareEvent {
  id: string;
  plantId: string;
  type: CareType;
  at: number;
}

/** Push plants + care events. Fire-and-forget friendly. */
export async function syncToServer(
  deviceId: string,
  plants: ServerPlant[],
  events: ServerCareEvent[],
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('fernly', {
      body: { action: 'sync', device_id: deviceId, plants, events },
    });
    return !error;
  } catch {
    return false;
  }
}

export interface ServerSnapshot {
  plants: ServerPlant[];
  events: ServerCareEvent[];
}

/** Fetch server snapshot. Null on failure (caller keeps cache). */
export async function fetchSnapshotFromServer(
  deviceId: string,
): Promise<ServerSnapshot | null> {
  try {
    const { data, error } = await supabase.functions.invoke('fernly', {
      body: { action: 'list', device_id: deviceId },
    });
    if (error) return null;
    const d = (data as Partial<ServerSnapshot> | null) ?? {};
    return {
      plants: Array.isArray(d.plants) ? d.plants : [],
      events: Array.isArray(d.events) ? d.events : [],
    };
  } catch {
    return null;
  }
}

export type { Plant, CareEvent };
