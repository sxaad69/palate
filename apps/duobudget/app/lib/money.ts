import type { Envelope, Expense, Spender } from '../store/app';

// Currencies offered at onboarding. Kept small on purpose (ponytail).
export const CURRENCIES = ['USD', 'EUR', 'SAR', 'EGP', 'AED', 'KWD', 'QAR', 'GBP'] as const;
export type Currency = (typeof CURRENCIES)[number];

export function formatMoney(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/** Month key like "2026-10". */
export function monthKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split('-').map(Number) as [number, number];
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(key: string, locale: string): string {
  const [y, m] = key.split('-').map(Number) as [number, number];
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(y, m - 1, 1),
  );
}

/** Expenses that fall inside a month key. */
export function expensesInMonth(expenses: Expense[], key: string): Expense[] {
  return expenses.filter((e) => monthKey(e.date) === key);
}

export function spentByEnvelope(
  expenses: Expense[],
  key: string,
): Record<string, { total: number; me: number; partner: number }> {
  const out: Record<string, { total: number; me: number; partner: number }> = {};
  for (const e of expensesInMonth(expenses, key)) {
    const cur = out[e.envelopeId] ?? { total: 0, me: 0, partner: 0 };
    cur.total += e.amount;
    if (e.spender === ('me' as Spender)) cur.me += e.amount;
    else cur.partner += e.amount;
    out[e.envelopeId] = cur;
  }
  return out;
}

/**
 * What's available to spend: planned + rollover credits recorded for this month.
 * Credits are written by the money-date rollover into the *next* month.
 */
export function envelopeAvailable(
  env: Envelope,
  key: string,
  credits: Record<string, Record<string, number>>,
): number {
  return env.amount + (credits[key]?.[env.id] ?? 0);
}

/** Shareable plain-text monthly summary (partner handoff, no accounts). */
export function buildSummary(
  key: string,
  envelopes: Envelope[],
  expenses: Expense[],
  currency: string,
  locale: string,
  names: { me: string; partner: string },
  s: { title: string; planned: string; spent: string; left: string; whoSpentWhat: string },
): string {
  const perEnv = spentByEnvelope(expenses, key);
  const active = envelopes.filter((e) => !e.archived);
  const lines = active.map((e) => {
    const spent = perEnv[e.id]?.total ?? 0;
    const left = e.amount - spent;
    return `• ${e.name}: ${formatMoney(spent, currency, locale)} / ${formatMoney(e.amount, currency, locale)} (${formatMoney(left, currency, locale)} left)`;
  });
  const totalPlanned = active.reduce((a, e) => a + e.amount, 0);
  const totalSpent = Object.values(perEnv).reduce((a, x) => a + x.total, 0);
  const me = Object.values(perEnv).reduce((a, x) => a + x.me, 0);
  const partner = Object.values(perEnv).reduce((a, x) => a + x.partner, 0);
  return [
    `${s.title} — ${monthLabel(key, locale)}`,
    `${s.planned}: ${formatMoney(totalPlanned, currency, locale)}`,
    `${s.spent}: ${formatMoney(totalSpent, currency, locale)}`,
    `${s.left}: ${formatMoney(totalPlanned - totalSpent, currency, locale)}`,
    '',
    ...lines,
    '',
    `${s.whoSpentWhat}: ${names.me} ${formatMoney(me, currency, locale)} · ${names.partner} ${formatMoney(partner, currency, locale)}`,
  ].join('\n');
}

/** CSV export of a month's expenses (Pro). */
export function buildCsv(
  key: string,
  envelopes: Envelope[],
  expenses: Expense[],
  names: { me: string; partner: string },
): string {
  const byId = new Map(envelopes.map((e) => [e.id, e.name]));
  const rows = expensesInMonth(expenses, key).map((e) =>
    [
      new Date(e.date).toISOString().slice(0, 10),
      `"${(byId.get(e.envelopeId) ?? '').replace(/"/g, '""')}"`,
      e.amount.toFixed(2),
      e.spender === 'me' ? names.me : names.partner,
      `"${(e.note ?? '').replace(/"/g, '""')}"`,
    ].join(','),
  );
  return ['date,envelope,amount,spender,note', ...rows].join('\n');
}
