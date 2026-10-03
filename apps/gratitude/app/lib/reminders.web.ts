import type { ReminderTime } from './reminders';

// Web stub for daily reminders. expo-notifications has no web
// implementation; Metro resolves this file over reminders.ts on web.

export async function ensureReminder(_rt: ReminderTime): Promise<boolean> {
  // No-op on web.
  return false;
}

export async function cancelReminder(): Promise<void> {
  // No-op on web.
}
