import type { DueTask } from './notifications';

// Web stub for due-task reminders. expo-notifications has no web
// implementation; Metro resolves this file over notifications.ts on web.

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function rescheduleDueReminders(
  _tasks: DueTask[],
  _t: { title: string; body: (name: string) => string },
): Promise<void> {
  // No-op on web.
}
