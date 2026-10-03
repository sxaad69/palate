import type { Med } from '../store/meds';

// Web stub for the notifications module. expo-notifications does not support
// web scheduling; all functions are no-ops. Metro resolves this file instead
// of notifications.ts on web.

// Local dose reminders. Best-effort: scheduling is exact on most devices,
// but delivery should be verified on a real device at launch (see
// BUILD_NOTES.md). The app's logs and schedules work fully without it.

export async function requestNotificationPermissions(): Promise<boolean> {
  // No notification permissions on web.
  return false;
}

/** Rebuilds every reminder from the current med list. Call after any change. */
export async function rescheduleDoseReminders(
  _meds: Med[],
  _t: { title: string; body: (medName: string, dosage: string) => string },
): Promise<void> {
  // No-op on web.
}

export async function cancelAllReminders(): Promise<void> {
  // No-op on web.
}
