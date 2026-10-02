// SM-2-lite spaced repetition for phrases. Pure, no React.
// Honest design: the schedule adapts to the learner's own ratings.

export interface Schedule {
  ease: number;
  intervalDays: number;
  nextDue: number; // epoch ms
  reps: number;
  attempts: number;
  lastRating: number | null;
}

export function initialSchedule(now: number): Schedule {
  return { ease: 2.5, intervalDays: 0, nextDue: now, reps: 0, attempts: 0, lastRating: null };
}

export function review(s: Schedule, rating: 1 | 2 | 3 | 4 | 5, now: number): Schedule {
  const attempts = s.attempts + 1;
  if (rating < 3) {
    // Didn't stick — back to the front of the queue, due now.
    return { ease: Math.max(1.3, s.ease - 0.2), intervalDays: 0, nextDue: now, reps: 0, attempts, lastRating: rating };
  }
  const reps = s.reps + 1;
  let intervalDays: number;
  if (reps === 1) intervalDays = 1;
  else if (reps === 2) intervalDays = 6;
  else intervalDays = Math.round(s.intervalDays * s.ease);
  const ease = Math.max(
    1.3,
    s.ease + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)),
  );
  return {
    ease,
    intervalDays,
    nextDue: now + intervalDays * 86_400_000,
    reps,
    attempts,
    lastRating: rating,
  };
}

export function isDue(s: Schedule | undefined, now: number): boolean {
  if (!s) return true; // never practiced → due
  return s.nextDue <= now;
}

export function isMastered(s: Schedule | undefined): boolean {
  return !!s && s.intervalDays >= 21 && (s.lastRating ?? 0) >= 4;
}
