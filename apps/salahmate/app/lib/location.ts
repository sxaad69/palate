import * as Location from 'expo-location';

// Riyadh fallback — the portfolio is built there, and it's a sane default
// when the user declines location permission.
export const FALLBACK_COORDS = { lat: 24.7136, lng: 46.6753 };

export interface Coords {
  lat: number;
  lng: number;
  fromDevice: boolean;
}

/** Best-effort device coordinates; falls back to Riyadh on denial/failure. */
export async function getCoordinates(): Promise<Coords> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const pos = await Location.getLastKnownPositionAsync({});
      if (pos) {
        return {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          fromDevice: true,
        };
      }
      const fresh = await Location.getCurrentPositionAsync({});
      return {
        lat: fresh.coords.latitude,
        lng: fresh.coords.longitude,
        fromDevice: true,
      };
    }
  } catch {
    // fall through to fallback
  }
  return { ...FALLBACK_COORDS, fromDevice: false };
}
