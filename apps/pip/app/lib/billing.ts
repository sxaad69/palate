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
import { verifyPurchaseToken } from './api';

// Play Console product IDs — create these in Play Console > Monetize > Products > Subscriptions.
// WEEKLY plan + free trial (deep dive LTV rule: weekly-with-trial = 636% 12-mo LTV lift).
// The 7-day free trial is configured on the subscription in Play Console,
// not in code — the client just offers the weekly SKU.
// The weekly sub must exist before any purchase can succeed.
export const PRO_WEEKLY_SKU = 'pip_pro_weekly';

const PRO_STATUS_KEY = '@pip:pro_status';
const PRO_EXPIRY_KEY = '@pip:pro_expiry_ms';

export interface ProProduct {
  displayPrice: string;
}

let connected = false;
let updateSub: { remove(): void } | null = null;
let errorSub: { remove(): void } | null = null;
let purchaseHandler: ((purchase: Purchase) => void) | null = null;

export async function initBilling(onPurchase: (purchase: Purchase) => void): Promise<boolean> {
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
      // Verify with our backend before unlocking. The server checks the
      // purchase token against Google Play (once the Play Developer API
      // service account is wired; until then it accepts and logs).
      const verified = await verifyPurchaseToken({
        purchaseToken: purchase.purchaseToken ?? '',
        productId: purchase.productId ?? '',
        platform: 'android',
      });
      if (verified) {
        await setProStatus(true);
        // Acknowledge so Google doesn't auto-refund after 3 days.
        await finishTransaction({ purchase, isConsumable: false });
      }
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

function toProProduct(p: ProductOrSubscription): ProProduct | null {
  if (p.platform === 'android' && 'displayPrice' in p) {
    return { displayPrice: (p as ProductSubscriptionAndroid).displayPrice };
  }
  return null;
}

export async function getProProduct(): Promise<ProProduct | null> {
  if (!connected) return null;
  try {
    const products = await fetchProducts({ skus: [PRO_WEEKLY_SKU], type: 'subs' });
    if (!products) return null;
    for (const p of products) {
      const pro = toProProduct(p);
      if (pro) return pro;
    }
    return null;
  } catch {
    return null;
  }
}

export async function subscribe(): Promise<void> {
  if (!connected) throw new Error('Billing is not available on this device.');
  await requestPurchase({
    request: { google: { skus: [PRO_WEEKLY_SKU] } },
    type: 'subs',
  });
}

export async function restorePurchases(): Promise<boolean> {
  if (!connected) return false;
  try {
    const purchases = await getAvailablePurchases();
    const active = purchases.some((p) => p.productId === PRO_WEEKLY_SKU);
    if (active) {
      await setProStatus(true);
      // Finish any unfinished transactions found during restore.
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
