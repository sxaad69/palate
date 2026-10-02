// Play Integrity attestation plumbing.
// The native Play Integrity module is optional: if it isn't linked (or this
// isn't a Play-distributed build), we skip attestation and the server treats
// the request as unattested. When the native module + server key are in
// place, the server verifies the token against Google's API.

let cachedToken: string | null = null;
let lastFetch = 0;
const TOKEN_TTL_MS = 50 * 60 * 1000; // integrity tokens are short-lived; refresh hourly

/**
 * Returns a Play Integrity token, or null when attestation isn't available.
 * Never throws — callers treat null as "unattested".
 */
export async function getIntegrityToken(): Promise<string | null> {
  try {
    if (cachedToken && Date.now() - lastFetch < TOKEN_TTL_MS) return cachedToken;
    // Optional native module — resolved lazily so the app builds without it.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-play-integrity');
    const getToken = mod?.getIntegrityToken ?? mod?.default?.getIntegrityToken;
    if (typeof getToken !== 'function') return null;
    const token: string = await getToken();
    if (typeof token === 'string' && token.length > 0) {
      cachedToken = token;
      lastFetch = Date.now();
      return token;
    }
    return null;
  } catch {
    return null;
  }
}

/** Clear the cached token (e.g. after the server rejects it). */
export function clearIntegrityToken(): void {
  cachedToken = null;
  lastFetch = 0;
}
