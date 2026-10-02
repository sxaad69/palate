import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_KEY = '@scrubdeck:device_id';

// Stable per-install ID for the (optional) backend sync. Not advertising ID.
export async function getDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const id = `ds-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    await AsyncStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return `ds-ephemeral-${Math.random().toString(36).slice(2, 10)}`;
  }
}
