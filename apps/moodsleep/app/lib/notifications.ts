import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getLang } from './i18n';

// Bedtime wind-down nudge: one daily LOCAL notification at the user's
// reminder time. Tapping it opens the app on the 20-second check-in.
// No server, no push token — everything is on-device.

const REMINDER_ID = 'restory-bedtime-nudge';

const COPY = {
  en: {
    title: 'Close the day',
    body: '20 seconds: how did you sleep, how was today?',
  },
  ar: {
    title: 'أغلق اليوم',
    body: '٢٠ ثانية: كيف كان نومك، وكيف كان يومك؟',
  },
} as const;

/** Ask for permission and schedule (or re-schedule) the daily nudge. */
export async function enableBedtimeReminder(hhmm: string): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  const [h, m] = hhmm.split(':').map(Number);
  if (h === undefined || m === undefined || Number.isNaN(h) || Number.isNaN(m)) return false;

  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => {});
  const lang = getLang();
  const copy = COPY[lang];
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: { title: copy.title, body: copy.body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: h, minute: m },
  });
  return true;
}

export async function disableBedtimeReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => {});
}

export function setNotificationHandlerOnce() {
  // Foreground: still show the nudge as a banner.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    void Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    }).catch(() => {});
  }
}
