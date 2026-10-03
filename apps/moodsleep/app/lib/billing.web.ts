import AsyncStorage from '@react-native-async-storage/async-storage';

// Web stub for the billing module. Metro resolves `billing.web.ts` instead of
// `billing.ts` on web, so the native react-native-iap module is never loaded.
// All purchases are no-ops; pro status still persists via AsyncStorage
// (localStorage on web).

export const PRO_WEEKLY_SKU = 'restory_weekly';

const PRO_STATUS_KEY = '@restory:pro_status';

export async function initBilling(_onUnlock: () => void): Promise<boolean> {
  // No billing on web.
  return false;
}

export function closeBilling() {
  // No-op on web.
}

export async function getWeeklyPrice(): Promise<string | null> {
  return null;
}

export async function buyWeekly(): Promise<void> {
  throw new Error('Billing is not available on web.');
}

export async function isProLocal(): Promise<boolean> {
  return (await AsyncStorage.getItem(PRO_STATUS_KEY)) === '1';
}

export async function setProLocal(v: boolean): Promise<void> {
  await AsyncStorage.setItem(PRO_STATUS_KEY, v ? '1' : '0');
}
