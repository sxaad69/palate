import type { Lang } from './i18n';

/** 47 -> "00:47", 2873 -> "47:53", 3723 -> "1:02:03" */
export function fmtDuration(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** "Oct 2, 2026" / Arabic locale equivalent. */
export function fmtDate(ts: number, lang: Lang): string {
  return new Date(ts).toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** 47.5 -> "$47.50" / Arabic locale equivalent. */
export function fmtMoney(amount: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Cost of a meeting: hourlyRate * durationSec / 3600. */
export function meetingCost(hourlyRate: number, durationSec: number): number {
  if (hourlyRate <= 0 || durationSec <= 0) return 0;
  return (hourlyRate * durationSec) / 3600;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
