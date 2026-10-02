import * as Notifications from 'expo-notifications';
import {
  TRACKED_PRAYERS,
  type PrayerTimesMap,
} from './prayer';

// Prayer reminders: one-time local notifications for today's upcoming
// prayers, rebuilt whenever the app starts or settings change. Times shift
// daily, so daily (not repeating) triggers are used.

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

export async function reschedulePrayerReminders(
  times: PrayerTimesMap,
  enabled: Record<string, boolean>,
  t: { title: (prayerName: string) => string; body: string },
  prayerName: (key: string) => string,
): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const now = Date.now();
    for (const key of TRACKED_PRAYERS) {
      if (!enabled[key]) continue;
      const at = times[key].getTime();
      if (at <= now + 60000) continue; // skip past prayers
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t.title(prayerName(key)),
          body: t.body,
          data: { prayer: key },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: times[key],
        },
      });
    }
  } catch {
    // Reminders are best-effort; the in-app timetable is the source of truth.
  }
}
