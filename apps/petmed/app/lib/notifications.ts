import * as Notifications from 'expo-notifications';
import type { Medication, Pet } from '../store/app';

// Local dose reminders. Best-effort: scheduling is exact on most devices,
// but delivery should be verified on a real device at launch (see
// BUILD_NOTES.md). The app's logs and schedules work fully without it.

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/** Rebuilds every reminder from the current med list. Call after any med change. */
export async function rescheduleDoseReminders(
  meds: Medication[],
  pets: Pet[],
  t: { title: string; body: (petName: string, medName: string, dose: string) => string },
): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const petNames = new Map(pets.map((p) => [p.id, p.name]));
    for (const med of meds) {
      for (const time of med.times) {
        const parts = time.split(':').map(Number);
        const hour = parts[0] ?? NaN;
        const minute = parts[1] ?? NaN;
        if (Number.isNaN(hour) || Number.isNaN(minute)) continue;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t.title,
            body: t.body(petNames.get(med.petId) ?? '', med.name, med.dose),
            data: { medId: med.id, petId: med.petId, time },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
          },
        });
      }
    }
  } catch {
    // Reminders are best-effort; the in-app schedule is the source of truth.
  }
}

export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
