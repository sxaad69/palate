// Web stub for session-end notifications. expo-notifications has no web
// implementation; Metro resolves this file over notifications.ts on web.

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function scheduleSessionEnd(
  _at: Date,
  _title: string,
  _body: string,
): Promise<string | null> {
  // No-op on web.
  return null;
}

export async function cancelSessionEnd(_id: string | null): Promise<void> {
  // No-op on web.
}
