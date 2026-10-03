import AsyncStorage from '@react-native-async-storage/async-storage';

// Web version: no expo-application (native module). Always uses a random
// UUID cached in AsyncStorage (localStorage on web).

const STORAGE_KEY = '@headdown/device-id/v1';

let cached: string | null = null;

function randomUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return ((c === 'x' ? r : (r & 0x3) | 0x8) as number).toString(16);
  });
}

export async function getDeviceId(): Promise<string> {
  if (cached) return cached;
  const stored = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
  if (stored) {
    cached = stored;
    return cached;
  }
  cached = `uuid:${randomUuid()}`;
  await AsyncStorage.setItem(STORAGE_KEY, cached).catch(() => {});
  return cached;
}
