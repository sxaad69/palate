// Web stub for the notifications module. Metro resolves `notifications.web.ts`
// instead of `notifications.ts` on web, so the native expo-notifications
// module is never loaded. Bedtime reminders are a no-op on web.

/** Ask for permission and schedule (or re-schedule) the daily nudge. */
export async function enableBedtimeReminder(_hhmm: string): Promise<boolean> {
  // No local notifications on web.
  return false;
}

export async function disableBedtimeReminder(): Promise<void> {
  // No-op on web.
}

export function setNotificationHandlerOnce() {
  // No-op on web.
}
