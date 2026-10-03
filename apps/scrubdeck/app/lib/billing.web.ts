import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Purchase } from 'react-native-iap';

// Web stub for the billing module. Metro resolves `billing.web.ts` instead of
// `billing.ts` on web, so the native react-native-iap module is never loaded
// (type-only import is erased at compile time). All purchases are no-ops;
// pro status still persists via AsyncStorage (localStorage on web).

export const WEEKLY_SKU = 'scrubdeck_weekly';

const PRO_STATUS_KEY = '@scrubdeck:pro_status';

export interface WeeklyProduct {
  displayPrice: string;
  trialText: string | null;
}

export async function initBilling(
  _onPurchase: (purchase: Purchase) => void,
): Promise<boolean> {
  // No billing on web.
  return false;
}

export function closeBilling() {
  // No-op on web.
}

export async function getWeeklyProduct(): Promise<WeeklyProduct | null> {
  return null;
}

/** Starts the weekly subscription purchase (trial configured in Play Console). */
export async function subscribeWeekly(): Promise<void> {
  throw new Error('Billing is not available on web.');
}

export async function restorePurchases(): Promise<boolean> {
  return false;
}

export async function setProStatus(pro: boolean): Promise<void> {
  await AsyncStorage.setItem(PRO_STATUS_KEY, pro ? '1' : '0');
}

export async function isPro(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(PRO_STATUS_KEY)) === '1';
  } catch {
    return false;
  }
}
