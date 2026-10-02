import type { Strings } from '../lib/strings';

export const EXPENSE_CATEGORIES = [
  'software',
  'equipment',
  'travel',
  'meals',
  'office',
  'marketing',
  'education',
  'health',
  'other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export function categoryLabel(cat: ExpenseCategory, t: Strings): string {
  switch (cat) {
    case 'software': return t.catSoftware;
    case 'equipment': return t.catEquipment;
    case 'travel': return t.catTravel;
    case 'meals': return t.catMeals;
    case 'office': return t.catOffice;
    case 'marketing': return t.catMarketing;
    case 'education': return t.catEducation;
    case 'health': return t.catHealth;
    case 'other': return t.catOther;
  }
}
