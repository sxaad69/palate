import type { Lang } from './i18n';
import { fmtDate, fmtDuration, fmtMoney } from './format';
import type { ActionItem } from '../store/app';

/**
 * Local template-based summary (v1).
 *
 * Honest scope: without an STT module there is no transcript to summarize, so
 * the summary is assembled from what the app actually knows — title, date,
 * duration, cost, user notes, and action items. It is deterministic,
 * offline, and free. When an STT provider lands (see lib/stt.ts), the
 * transcript text feeds the same template plus a keyword-extracted
 * "key points" section.
 */
export interface SummaryInput {
  title: string;
  createdAt: number;
  durationSec: number;
  hourlyRate: number;
  cost: number;
  notes: string;
  transcript: string;
  actions: ActionItem[];
}

export function buildSummary(m: SummaryInput, lang: Lang): string {
  const done = m.actions.filter((a) => a.done).length;
  const open = m.actions.length - done;
  if (lang === 'ar') {
    const lines = [
      `اجتماع «${m.title}» بتاريخ ${fmtDate(m.createdAt, lang)} — المدة ${fmtDuration(m.durationSec)}.`,
    ];
    if (m.hourlyRate > 0) {
      lines.push(`التكلفة التقديرية للاجتماع: ${fmtMoney(m.cost, lang)} (بأجر ${fmtMoney(m.hourlyRate, lang)}/ساعة).`);
    }
    if (m.notes.trim()) lines.push(`ملاحظات: ${m.notes.trim()}`);
    if (m.actions.length > 0) {
      lines.push(`المهام: ${m.actions.length} (${done} منجزة، ${open} مفتوحة).`);
    } else {
      lines.push('لا توجد مهام مسجلة بعد — أضفها من الأسفل.');
    }
    return lines.join('\n');
  }
  const lines = [
    `“${m.title}” on ${fmtDate(m.createdAt, lang)} — ${fmtDuration(m.durationSec)} long.`,
  ];
  if (m.hourlyRate > 0) {
    lines.push(
      `Estimated meeting cost: ${fmtMoney(m.cost, lang)} at ${fmtMoney(m.hourlyRate, lang)}/hour.`,
    );
  }
  if (m.notes.trim()) lines.push(`Notes: ${m.notes.trim()}`);
  if (m.actions.length > 0) {
    lines.push(`Action items: ${m.actions.length} total (${done} done, ${open} open).`);
  } else {
    lines.push('No action items yet — add them below.');
  }
  return lines.join('\n');
}
