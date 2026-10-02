import * as Notifications from 'expo-notifications';
import type { Med } from '../store/meds';

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

/** Rebuilds every reminder from the current med list. Call after any change. */
export async function rescheduleDoseReminders(
  meds: Med[],
  t: { title: string; body: (medName: string, dosage: string) => string },
): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const med of meds) {
      for (const time of med.times) {
        const [hour, minute] = time.split(':').map(Number);
        if (Number.isNaN(hour) || Number.isNaN(minute)) continue;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t.title,
            body: t.body(med.name, med.dosage),
            data: { medId: med.id, time },
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
