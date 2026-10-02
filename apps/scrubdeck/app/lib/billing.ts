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
  type ProductOrSubscription,
  type ProductSubscriptionAndroid,
  type Purchase,
} from 'react-native-iap';

// Play Console product: WEEKLY subscription WITH a free trial, per the
// portfolio's monetization rule (Adapty: weekly+trial = 636% 12-mo LTV lift).
// Create `scrubdeck_weekly` in Play Console > Monetize > Subscriptions with
// a 7-day free trial before any purchase can succeed.
export const WEEKLY_SKU = 'scrubdeck_weekly';

const PRO_STATUS_KEY = '@scrubdeck:pro_status';

export interface WeeklyProduct {
  displayPrice: string;
  trialText: string | null;
}

let connected = false;
let updateSub: { remove(): void } | null = null;
let errorSub: { remove(): void } | null = null;
let purchaseHandler: ((purchase: Purchase) => void) | null = null;

export async function initBilling(
  onPurchase: (purchase: Purchase) => void,
): Promise<boolean> {
  purchaseHandler = onPurchase;
  try {
    connected = await initConnection();
  } catch {
    connected = false;
  }
  if (!connected) return false;

  updateSub?.remove();
  errorSub?.remove();

  updateSub = purchaseUpdatedListener(async (purchase) => {
    try {
      // v1: provisional local unlock; server-side Play Developer API
      // verification is launch work (see BUILD_NOTES.md).
      await setProStatus(true);
      // Acknowledge so Google doesn't auto-refund after 3 days.
      await finishTransaction({ purchase, isConsumable: false });
      purchaseHandler?.(purchase);
    } catch {
      // Leave the purchase unfinished so it can be retried via restore.
      purchaseHandler?.(purchase);
    }
  });

  errorSub = purchaseErrorListener(() => {
    // Caller surfaces errors via returned state; listener just prevents leaks.
  });

  return true;
}

export function closeBilling() {
  updateSub?.remove();
  errorSub?.remove();
  updateSub = null;
  errorSub = null;
  purchaseHandler = null;
  if (connected) {
    endConnection().catch(() => {});
    connected = false;
  }
}

function toWeeklyProduct(p: ProductOrSubscription): WeeklyProduct | null {
  if (p.platform === 'android' && 'displayPrice' in p) {
    const sub = p as ProductSubscriptionAndroid;
    return { displayPrice: sub.displayPrice, trialText: null };
  }
  return null;
}

export async function getWeeklyProduct(): Promise<WeeklyProduct | null> {
  if (!connected) return null;
  try {
    const products = await fetchProducts({ skus: [WEEKLY_SKU], type: 'subs' });
    if (!products) return null;
    for (const p of products) {
      const weekly = toWeeklyProduct(p);
      if (weekly) return weekly;
    }
    return null;
  } catch {
    return null;
  }
}

/** Starts the weekly subscription purchase (trial configured in Play Console). */
export async function subscribeWeekly(): Promise<void> {
  if (!connected) throw new Error('Billing is not available on this device.');
  await requestPurchase({
    request: { google: { skus: [WEEKLY_SKU] } },
    type: 'subs',
  });
}

export async function restorePurchases(): Promise<boolean> {
  if (!connected) return false;
  try {
    const purchases = await getAvailablePurchases();
    const active = purchases.some((p) => p.productId === WEEKLY_SKU);
    if (active) {
      await setProStatus(true);
      for (const p of purchases) {
        try {
          await finishTransaction({ purchase: p, isConsumable: false });
        } catch {
          // Best effort; a finished purchase throws, which is fine.
        }
      }
    }
    return active;
  } catch {
    return false;
  }
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
