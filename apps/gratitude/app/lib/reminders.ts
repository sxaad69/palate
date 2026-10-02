import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { t } from './i18n';

// Local-only daily reminder. No server, no push tokens, no OneSignal in v1
// (ponytail: local scheduling covers the habit loop; remote push is a
// launch-scale concern).

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export interface ReminderTime {
  hour: number;
  minute: number;
}

export async function ensureReminder(rt: ReminderTime): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily', {
        name: 'Daily ritual',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    // t() reads the module lang — set via setLang() before scheduling.
    await Notifications.scheduleNotificationAsync({
      content: { title: t().notifTitle, body: t().notifBody },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: rt.hour,
        minute: rt.minute,
        channelId: 'daily',
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelReminder(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // no-op
  }
}
