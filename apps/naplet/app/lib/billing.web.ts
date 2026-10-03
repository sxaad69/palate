import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Purchase } from 'react-native-iap';

// Web stub for the billing module. Metro resolves `billing.web.ts` instead of
// `billing.ts` on web, so the native react-native-iap module is never loaded
// (type-only import is erased at compile time). All purchases are no-ops;
// pro status still persists via AsyncStorage (localStorage on web).

export const PRO_WEEKLY_SKU = 'naplet_pro_weekly';

const PRO_STATUS_KEY = '@naplet:pro_status';
const PRO_EXPIRY_KEY = '@naplet:pro_expiry_ms';

export interface ProProduct {
  displayPrice: string;
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

export async function getProProduct(): Promise<ProProduct | null> {
  return null;
}

export async function subscribe(): Promise<void> {
  throw new Error('Billing is not available on web.');
}

export async function restorePurchases(): Promise<boolean> {
  return false;
}

export async function setProStatus(pro: boolean, expiryMs?: number): Promise<void> {
  await AsyncStorage.setItem(PRO_STATUS_KEY, pro ? '1' : '0');
  if (expiryMs) {
    await AsyncStorage.setItem(PRO_EXPIRY_KEY, String(expiryMs));
  } else if (!pro) {
    await AsyncStorage.removeItem(PRO_EXPIRY_KEY);
  }
}

export async function isPro(): Promise<boolean> {
  const v = await AsyncStorage.getItem(PRO_STATUS_KEY);
  if (v !== '1') return false;
  const expiry = await AsyncStorage.getItem(PRO_EXPIRY_KEY);
  if (expiry && Number(expiry) < Date.now()) {
    await setProStatus(false);
    return false;
  }
  return true;
}
