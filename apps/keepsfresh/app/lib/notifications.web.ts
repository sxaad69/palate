import type { PantryItem } from '../store/types';

// Web stub for the notifications module. expo-notifications does not support
// web scheduling; all functions are no-ops. Metro resolves this file instead
// of notifications.ts on web.

export async function rescheduleExpiryReminders(
  _items: PantryItem[],
  _enabled: boolean,
): Promise<void> {
  // No-op on web.
}

export async function requestReminderPermission(): Promise<boolean> {
  // No notification permissions on web.
  return false;
}
