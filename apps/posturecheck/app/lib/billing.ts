import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  getAvailablePurchases,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type Purchase,
} from 'react-native-iap';

// Deep-dive LTV rule: WEEKLY plan + free trial on every app. No monthly-only.
// Create in Play Console > Monetize > Products > Subscriptions:
//   - product ID below, weekly billing period, with a free trial configured.
export const PRO_WEEKLY_SKU = 'straightup_weekly';

const PRO_STATUS_KEY = '@straightup:pro_status';

let connected = false;
let updateSub: { remove(): void } | null = null;
let errorSub: { remove(): void } | null = null;

export async function initBilling(onUnlock: () => void): Promise<boolean> {
  try {
    connected = await initConnection();
  } catch {
    connected = false;
  }
  if (!connected) return false;

  updateSub?.remove();
  errorSub?.remove();

  updateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
    try {
      // Server verification lands at launch (verify-purchase edge function
      // pattern from Palate). For now: acknowledge and unlock locally.
      await finishTransaction({ purchase, isConsumable: false });
      await AsyncStorage.setItem(PRO_STATUS_KEY, '1');
      onUnlock();
    } catch {
      // leave unfinished; restore will retry
    }
  });
  errorSub = purchaseErrorListener(() => {});

  // Restore prior entitlement silently.
  try {
    const purchases = await getAvailablePurchases();
    if (purchases.some((p) => p.productId === PRO_WEEKLY_SKU)) {
      await AsyncStorage.setItem(PRO_STATUS_KEY, '1');
      onUnlock();
    }
  } catch {
    // offline — local status stands
  }
  return true;
}

export function closeBilling() {
  updateSub?.remove();
  errorSub?.remove();
  updateSub = null;
  errorSub = null;
  if (connected) void endConnection();
  connected = false;
}

export async function getWeeklyPrice(): Promise<string | null> {
  if (!connected) return null;
  try {
    const products = await fetchProducts({ skus: [PRO_WEEKLY_SKU], type: 'subs' });
    return products?.[0]?.displayPrice ?? null;
  } catch {
    return null;
  }
}

/** Launches the Play Billing sheet for the weekly+trial subscription. */
export async function buyWeekly(): Promise<void> {
  // Trial is configured server-side on the product in Play Console
  // (deep-dive rule), not in code.
  await requestPurchase({
    request: { google: { skus: [PRO_WEEKLY_SKU] } },
    type: 'subs',
  });
}

export async function isProLocal(): Promise<boolean> {
  return (await AsyncStorage.getItem(PRO_STATUS_KEY)) === '1';
}

export async function setProLocal(v: boolean): Promise<void> {
  await AsyncStorage.setItem(PRO_STATUS_KEY, v ? '1' : '0');
}
