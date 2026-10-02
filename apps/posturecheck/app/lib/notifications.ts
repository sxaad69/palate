// lib/notifications.ts — local "unhunch" nudges only. No server, no push
// token, no data leaves the phone (declared as such in data-safety).
import * as Notifications from 'expo-notifications';
import { t } from './i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotifPermission(): Promise<boolean> {
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted || cur.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const next = await Notifications.requestPermissionsAsync();
  return !!next.granted;
}

/** Replace any scheduled nudges with a repeating interval reminder. */
export async function scheduleNudges(intervalMinutes: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const s = t();
  await Notifications.scheduleNotificationAsync({
    content: { title: s.notifTitle, body: s.notifBody },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: intervalMinutes * 60, repeats: true },
  });
}

export async function cancelNudges(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
