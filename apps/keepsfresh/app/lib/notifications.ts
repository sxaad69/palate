import * as Notifications from 'expo-notifications';
import { getLang, type Lang } from './i18n';
import type { PantryItem } from '../store/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function daysLeft(expiry: number): number {
  return Math.ceil((expiry - Date.now()) / 86400000);
}

function bodyFor(item: PantryItem, lang: Lang): string {
  const d = daysLeft(item.expiry);
  if (lang === 'ar') {
    if (d <= 0) return `انتهت صلاحية ${item.name} — تخلّص منه أو سجّله.`;
    if (d === 1) return `${item.name} ينتهي غداً — استخدمه اليوم!`;
    return `${item.name} ينتهي خلال يومين — خطط لاستخدامه.`;
  }
  if (d <= 0) return `${item.name} has expired — toss it or log it.`;
  if (d === 1) return `${item.name} expires tomorrow — use it today!`;
  return `${item.name} expires in 2 days — plan to use it.`;
}

// ponytail: cancel-all + reschedule is O(n) and n is capped at hundreds of
// items. A per-item diff would be more code for no user-visible gain.
export async function rescheduleExpiryReminders(
  items: PantryItem[],
  enabled: boolean,
): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled) return;
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;
    const lang = getLang();
    const title = lang === 'ar' ? 'KeepsFresh — تذكير' : 'KeepsFresh reminder';
    for (const item of items) {
      const d = daysLeft(item.expiry);
      if (d < 0 || d > 2) continue;
      // Fire at 9:00 AM local on the reminder day (today if already past).
      const fire = new Date();
      fire.setHours(9, 0, 0, 0);
      if (fire.getTime() < Date.now()) fire.setTime(Date.now() + 60 * 1000);
      await Notifications.scheduleNotificationAsync({
        content: { title, body: bodyFor(item, lang) },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fire },
      });
    }
  } catch {
    // notifications are best-effort; never break the pantry over them
  }
}

export async function requestReminderPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}
