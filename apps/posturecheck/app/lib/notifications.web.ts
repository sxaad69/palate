// Web stub for notifications. Metro resolves `notifications.web.ts` instead of
// `notifications.ts` on web, so the native expo-notifications module is never
// loaded. All scheduling is a no-op on web.

export async function ensureNotifPermission(): Promise<boolean> {
  return false;
}

export async function scheduleNudges(_intervalMinutes: number): Promise<void> {
  // No-op on web.
}

export async function cancelNudges(): Promise<void> {
  // No-op on web.
}
