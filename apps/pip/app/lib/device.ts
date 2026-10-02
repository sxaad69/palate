import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pip/device-id/v1';

let cached: string | null = null;

function randomUuid(): string {
  // ponytail: Math.random is fine here — this is an abuse signal, not a
  // security token. Server-side Play Integrity is the real gate (phase 2).
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return ((c === 'x' ? r : (r & 0x3) | 0x8) as number).toString(16);
  });
}

/**
 * Stable per-device ID for the anti-abuse scan ledger.
 * Android: ANDROID_ID (survives reinstalls). Otherwise: a random UUID
 * cached in AsyncStorage (survives restarts, not reinstalls).
 */
export async function getDeviceId(): Promise<string> {
  if (cached) return cached;
  try {
    const androidId = await Application.getAndroidId();
    if (androidId) {
      cached = `android:${androidId}`;
      return cached;
    }
  } catch {
    // fall through to the UUID fallback
  }
  const stored = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
  if (stored) {
    cached = stored;
    return cached;
  }
  cached = `uuid:${randomUuid()}`;
  await AsyncStorage.setItem(STORAGE_KEY, cached).catch(() => {});
  return cached;
}
