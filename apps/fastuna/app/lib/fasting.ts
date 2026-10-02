// Pure fasting logic: stages, streaks, stats. No React, no storage —
// the store owns state, this owns math. (ponytail: one runnable check at
// the bottom would need a test runner; the store screen exercises it.)

export interface FastEntry {
  id: string;
  startedAt: number; // epoch ms
  endedAt: number; // epoch ms
  targetHours: number;
  presetId: string;
  completed: boolean;
}

export interface Stage {
  /** hours into the fast when this stage begins */
  fromHour: number;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
}

// Plain-language timeline. Informational only — the app carries a
// "not medical advice" disclaimer next to this.
export const STAGES: Stage[] = [
  {
    fromHour: 0,
    nameEn: 'Settling in',
    nameAr: 'التهيئة',
    descEn: 'Blood sugar stabilizes after your last meal.',
    descAr: 'يستقر سكر الدم بعد وجبتك الأخيرة.',
  },
  {
    fromHour: 4,
    nameEn: 'Fat burning',
    nameAr: 'حرق الدهون',
    descEn: 'Insulin drops and your body starts tapping fat stores.',
    descAr: 'ينخفض الأنسولين ويبدأ الجسم باستخدام مخزون الدهون.',
  },
  {
    fromHour: 8,
    nameEn: 'Deep burn',
    nameAr: 'الحرق العميق',
    descEn: 'Glycogen runs low — fat becomes the main fuel.',
    descAr: 'ينفد الجليكوجين — وتصبح الدهون الوقود الرئيسي.',
  },
  {
    fromHour: 12,
    nameEn: 'Ketosis begins',
    nameAr: 'بداية الكيتوزية',
    descEn: 'Ketone production ramps up; many people feel clearer.',
    descAr: 'يزداد إنتاج الكيتونات؛ ويشعر كثيرون بصفاء ذهني.',
  },
  {
    fromHour: 16,
    nameEn: 'Autophagy',
    nameAr: 'الالتهام الذاتي',
    descEn: 'Cellular cleanup processes peak in this window.',
    descAr: 'تبلغ عمليات تنظيف الخلايا ذروتها في هذه النافذة.',
  },
  {
    fromHour: 24,
    nameEn: 'Extended fast',
    nameAr: 'الصيام الممتد',
    descEn: 'You are past 24 hours — stay hydrated and listen to your body.',
    descAr: 'تجاوزت ٢٤ ساعة — حافظ على الترطيب واستمع لجسمك.',
  },
];

/** The latest stage reached at `elapsedHours`. */
export function stageFor(elapsedHours: number): Stage {
  let current = STAGES[0];
  for (const s of STAGES) {
    if (elapsedHours >= s.fromHour) current = s;
    else break;
  }
  return current;
}

function dayKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Consecutive days (ending today or yesterday) with at least one completed
 * fast. ponytail: O(n log n) sort on a list that stays tiny; fine.
 */
export function computeStreak(fasts: FastEntry[]): number {
  const days = new Set(
    fasts.filter((f) => f.completed).map((f) => dayKey(f.endedAt)),
  );
  if (days.size === 0) return 0;
  const today = new Date();
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // Allow the streak to survive if today has no fast yet — start counting
  // from yesterday in that case.
  if (!days.has(dayKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (days.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface FastStats {
  totalFasts: number;
  totalHours: number;
  longestHours: number;
  completionRate: number; // 0..1
}

export function computeStats(fasts: FastEntry[]): FastStats {
  const totalFasts = fasts.length;
  const totalHours =
    Math.round(
      (fasts.reduce((s, f) => s + (f.endedAt - f.startedAt), 0) / 3_600_000) * 10,
    ) / 10;
  const longestHours =
    totalFasts === 0
      ? 0
      : Math.round(
          (Math.max(...fasts.map((f) => f.endedAt - f.startedAt)) / 3_600_000) * 10,
        ) / 10;
  const completed = fasts.filter((f) => f.completed).length;
  return {
    totalFasts,
    totalHours,
    longestHours,
    completionRate: totalFasts === 0 ? 0 : completed / totalFasts,
  };
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
