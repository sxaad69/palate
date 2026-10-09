import type * as NotificationsType from 'expo-notifications';
import type { Med } from '../store/meds';

// Local dose reminders. Best-effort: scheduling is exact on most devices,
// but delivery should be verified on a real device at launch (see
// BUILD_NOTES.md). The app's logs and schedules work fully without it.

// expo-notifications is loaded LAZILY (dynamic import), never at module top
// level. Its native modules are resolved via requireNativeModule during
// module evaluation, which throws when the native module is missing or
// broken in the build — redboxing the app before the first render (this is
// what killed the CI emulator boot even after setNotificationHandler was
// moved behind try/catch: the import itself threw first). Loading it lazily
// inside a guarded promise keeps reminders best-effort and the app booting.
type N = typeof NotificationsType;

let notificationsPromise: Promise<N | null> | null = null;

function loadNotifications(): Promise<N | null> {
  if (!notificationsPromise) {
    notificationsPromise = import('expo-notifications').catch(() => null);
  }
  return notificationsPromise;
}

let handlerInstalled = false;

async function ensureNotificationHandler(): Promise<void> {
  if (handlerInstalled) return;
  const Notifications = await loadNotifications();
  if (!Notifications) return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerInstalled = true;
  } catch {
    // Native module unavailable — reminders degrade to no-ops.
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  await ensureNotificationHandler();
  const Notifications = await loadNotifications();
  if (!Notifications) return false;
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
  await ensureNotificationHandler();
  const Notifications = await loadNotifications();
  if (!Notifications) return;
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
  await ensureNotificationHandler();
  const Notifications = await loadNotifications();
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
