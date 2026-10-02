import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import type { Lang } from './i18n';
import { fmtDate, fmtDuration, fmtMoney } from './format';
import type { Meeting } from '../store/app';

/**
 * Instant share pack — differentiator #4. One formatted text block, ready
 * for WhatsApp / email / any share target, in EN or AR.
 */
export function buildShareText(m: Meeting, lang: Lang): string {
  const done = m.actions.filter((a) => a.done);
  const open = m.actions.filter((a) => !a.done);
  const box = (d: boolean) => (d ? '[x]' : '[ ]');
  if (lang === 'ar') {
    const parts = [
      `📋 ${m.title}`,
      `🕒 ${fmtDuration(m.durationSec)} · ${fmtDate(m.createdAt, lang)}`,
    ];
    if (m.hourlyRate > 0) parts.push(`💰 التكلفة التقديرية: ${fmtMoney(m.cost, lang)}`);
    if (m.summary.trim()) parts.push(`\n📝 الملخص:\n${m.summary.trim()}`);
    if (m.actions.length > 0) {
      parts.push(
        `\n✅ المهام (${done.length}/${m.actions.length} منجزة):\n` +
          [...open, ...done].map((a) => `${box(a.done)} ${a.text}`).join('\n'),
      );
    }
    if (m.notes.trim()) parts.push(`\n🗒️ ملاحظات:\n${m.notes.trim()}`);
    parts.push('\n— عبر MeetBrief');
    return parts.join('\n');
  }
  const parts = [
    `📋 ${m.title}`,
    `🕒 ${fmtDuration(m.durationSec)} · ${fmtDate(m.createdAt, lang)}`,
  ];
  if (m.hourlyRate > 0) parts.push(`💰 Est. cost: ${fmtMoney(m.cost, lang)}`);
  if (m.summary.trim()) parts.push(`\n📝 Summary:\n${m.summary.trim()}`);
  if (m.actions.length > 0) {
    parts.push(
      `\n✅ Action items (${done.length}/${m.actions.length} done):\n` +
        [...open, ...done].map((a) => `${box(a.done)} ${a.text}`).join('\n'),
    );
  }
  if (m.notes.trim()) parts.push(`\n🗒️ Notes:\n${m.notes.trim()}`);
  parts.push('\n— via MeetBrief');
  return parts.join('\n');
}

export async function shareMeeting(m: Meeting, lang: Lang): Promise<void> {
  await Share.share({ message: buildShareText(m, lang), title: m.title });
}

export async function copyShareText(m: Meeting, lang: Lang): Promise<void> {
  await Clipboard.setStringAsync(buildShareText(m, lang));
}
