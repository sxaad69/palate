import * as Notifications from 'expo-notifications';

// TendHome: one local notification per task on its due date (9 AM).
// Rebuilt whenever tasks change. Best-effort; the queue is source of truth.

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

export interface DueTask {
  id: string;
  title: string;
  dueAt: number;
}

export async function rescheduleDueReminders(
  tasks: DueTask[],
  t: { title: string; body: (name: string) => string },
): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const now = Date.now();
    for (const task of tasks) {
      // Fire at 9 AM on the due date (or now+1min if already past today).
      const d = new Date(task.dueAt);
      d.setHours(9, 0, 0, 0);
      const fireAt = Math.max(d.getTime(), now + 60000);
      if (fireAt > now + 14 * 86400000) continue; // only the next 2 weeks
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t.title,
          body: t.body(task.title),
          data: { taskId: task.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(fireAt),
        },
      });
    }
  } catch {
    // best effort
  }
}
