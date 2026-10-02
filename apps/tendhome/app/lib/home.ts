import type { HomeTask } from '../store/home';

// Derived task logic. Pure, no React.

export type TaskStatus = 'new' | 'overdue' | 'due-soon' | 'ok';

export function nextDue(task: HomeTask): number {
  if (task.lastDone) return task.lastDone + task.intervalDays * 86400000;
  return Date.now(); // never done → due now, get started
}

export function statusOf(task: HomeTask, now = Date.now()): TaskStatus {
  if (!task.lastDone) return 'new';
  const due = nextDue(task);
  if (due <= now) return 'overdue';
  if (due <= now + 7 * 86400000) return 'due-soon';
  return 'ok';
}

/** Attention queue: new → overdue → due-soon, then by due date. */
export function attentionQueue(tasks: HomeTask[], now = Date.now()): HomeTask[] {
  const rank: Record<TaskStatus, number> = { new: 0, overdue: 1, 'due-soon': 2, ok: 3 };
  return tasks
    .filter((t) => t.enabled)
    .slice()
    .sort((a, b) => {
      const r = rank[statusOf(a, now)] - rank[statusOf(b, now)];
      if (r !== 0) return r;
      return nextDue(a) - nextDue(b);
    });
}

export function dueLabel(task: HomeTask, t: { overdue: string; dueIn: string; dueNow: string; newTask: string; days: string; day: string }, now = Date.now()): string {
  const st = statusOf(task, now);
  if (st === 'new') return t.newTask;
  const diffDays = Math.round((nextDue(task) - now) / 86400000);
  if (st === 'overdue') {
    const d = Math.max(1, -diffDays);
    return `${t.overdue} ${d} ${d === 1 ? t.day : t.days}`;
  }
  if (diffDays <= 0) return t.dueNow;
  return `${t.dueIn} ${diffDays} ${diffDays === 1 ? t.day : t.days}`;
}
