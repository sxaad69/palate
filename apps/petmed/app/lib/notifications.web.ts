import type { Medication, Pet } from '../store/app';

// Web stub for local notifications. expo-notifications has no web
// implementation; Metro resolves this file over notifications.ts on web.
// All scheduling is a no-op; the in-app schedule remains the source of truth.

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function rescheduleDoseReminders(
  _meds: Medication[],
  _pets: Pet[],
  _t: { title: string; body: (petName: string, medName: string, dose: string) => string },
): Promise<void> {
  // No-op on web.
}

export async function cancelAllReminders(): Promise<void> {
  // No-op on web.
}
