// Web stub for the prayer notifications module. expo-notifications does not
// support web scheduling; all functions are no-ops. Metro resolves this file
// instead of prayerNotifications.ts on web.

export async function requestNotificationPermissions(): Promise<boolean> {
  // No notification permissions on web.
  return false;
}

export async function reschedulePrayerReminders(
  _times: Record<string, Date>,
  _enabled: Record<string, boolean>,
  _t: { title: (prayerName: string) => string; body: string },
  _prayerName: (key: string) => string,
): Promise<void> {
  // No-op on web.
}
