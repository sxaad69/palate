import type { Medication, Pet, Vaccination, VetVisit, DoseEvent } from '../store/app';
import { adherence, localDayKey } from './schedule';
import type { Strings } from './i18n';

// One-tap compiled summary for the vet appointment (differentiator #3):
// pet info, current meds + 7d adherence, vaccination status, recent notes.
// Shared as plain text via the OS share sheet.

export function buildVetPrepSheet(
  pet: Pet,
  meds: Medication[],
  vaccinations: Vaccination[],
  visits: VetVisit[],
  doseEvents: DoseEvent[],
  t: Strings,
): string {
  const lines: string[] = [];
  lines.push(`🐾 ${t.prepTitle} — ${pet.name}`);
  if (pet.breed) lines.push(pet.breed);
  if (pet.birthdate) lines.push(pet.birthdate);
  lines.push('');

  lines.push(`💊 ${t.prepMeds}:`);
  if (meds.length === 0) {
    lines.push('  —');
  } else {
    for (const m of meds) {
      const a = adherence(m, doseEvents, 7);
      lines.push(`  • ${m.name} — ${m.dose} (${m.times.join(', ')})`);
      lines.push(`    ${t.prepAdherence}: ${a.pct}% (${a.given}/${a.expected})`);
    }
  }
  lines.push('');

  lines.push(`⚖️ ${t.prepWeight}:`);
  const w = pet.weightLog[pet.weightLog.length - 1];
  lines.push(w ? `  ${w.kg} kg (${w.date})` : '  —');
  lines.push('');

  lines.push(`💉 ${t.prepVaccines}:`);
  const today = localDayKey(new Date());
  if (vaccinations.length === 0) {
    lines.push('  —');
  } else {
    for (const v of vaccinations) {
      const status = v.dueDate
        ? v.dueDate < today
          ? `⚠️ ${t.overdueBadge} (${v.dueDate})`
          : `${t.dueDate}: ${v.dueDate}`
        : '';
      lines.push(`  • ${v.name} — ${t.givenDate}: ${v.givenDate}${status ? ` — ${status}` : ''}`);
    }
  }
  lines.push('');

  lines.push(`🩺 ${t.prepVisits}:`);
  const recent = visits.slice(0, 3);
  if (recent.length === 0) {
    lines.push('  —');
  } else {
    for (const v of recent) {
      lines.push(`  • ${v.date} — ${v.reason}${v.vet ? ` (${v.vet})` : ''}`);
      if (v.notes) lines.push(`    ${v.notes}`);
    }
  }

  if (pet.notes) {
    lines.push('');
    lines.push(`📝 ${t.prepNotes}: ${pet.notes}`);
  }

  lines.push('');
  lines.push(t.prepGenerated);
  return lines.join('\n');
}
