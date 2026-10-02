import { I18nManager } from 'react-native';

// Minimal dictionary — ponytail: full i18n framework is overkill for v1.
// English is the fallback. Call-site names (meName/partnerName) come from store.
const en = {
  appName: 'TwoPurse',
  tagline: 'One budget, two people',

  // Onboarding
  slide1Title: 'Money fights, solved gently',
  slide1Body:
    'Most couples argue about spending, not about money. TwoPurse gives every dirham a home before the month starts.',
  slide2Title: 'Envelopes, not spreadsheets',
  slide2Body:
    'Each spending category is an envelope with a monthly amount. Both of you log spending and see what\u2019s left at a glance.',
  slide3Title: 'A monthly money date',
  slide3Body:
    'At month\u2019s end, sit down together: see what you spent, roll leftovers into savings, and start fresh.',
  language: 'Language',
  currency: 'Currency',
  yourName: 'Your name',
  partnerName: 'Partner\u2019s name',
  you: 'You',
  partner: 'Partner',
  continue: 'Continue',
  back: 'Back',
  getStarted: 'Get started',
  done: 'Done',
  save: 'Save',
  cancel: 'Cancel',
  ok: 'OK',

  // Tabs
  envelopes: 'Envelopes',
  moneyDate: 'Money date',
  profile: 'Profile',

  // Envelopes home
  leftToSpend: 'left to spend',
  spent: 'spent',
  planned: 'planned',
  joint: 'Joint',
  addEnvelope: 'New envelope',
  editEnvelope: 'Edit envelope',
  noEnvelopes: 'No envelopes yet. Create your first one below.',
  envelopeName: 'Name',
  monthlyAmount: 'Monthly amount',
  owner: 'Owner',
  ownerJoint: 'Ours (joint)',
  ownerMine: 'Mine',
  ownerTheirs: 'Theirs',
  color: 'Color',
  rolloverToggle: 'Roll leftover into savings',
  rolloverHint: 'At your money date, whatever is left in this envelope moves to Savings.',
  archive: 'Archive envelope',
  unarchive: 'Restore envelope',
  recentExpenses: 'This month\u2019s spending',
  noExpensesYet: 'Nothing logged yet this month.',
  overspentBy: 'over by',
  savings: 'Savings',
  totalPlanned: 'Planned',
  totalSpent: 'Spent',
  totalLeft: 'Left',
  allSpent: 'Fully spent',
  perPerson: 'per person',

  // Add expense
  addExpense: 'Add expense',
  amount: 'Amount',
  pickEnvelope: 'Envelope',
  whoSpent: 'Who spent it?',
  me: 'Me',
  note: 'Note',
  noteOptional: 'Note (optional)',
  date: 'Date',
  today: 'Today',
  saveExpense: 'Save expense',
  amountRequired: 'Enter an amount first.',

  // Free limit
  limitTitle: 'Envelope limit reached',
  limitBody: 'The free plan includes 6 envelopes. TwoPurse Pro unlocks unlimited envelopes.',
  goPro: 'Go Pro',

  // Money date
  reviewFor: 'Reviewing',
  biggestEnvelope: 'Biggest envelope',
  whoSpentWhat: 'Who spent what',
  savingsRate: 'saved this month',
  rolloverTitle: 'Close the month',
  rolloverBody:
    'Move leftovers from rollover envelopes into Savings, then start the new month fresh.',
  rolloverButton: 'Roll over & close month',
  rolloverDone: 'Month closed — leftovers moved to Savings.',
  shareSummary: 'Share summary',
  exportCsv: 'Export CSV',
  csvCopied: 'CSV copied — paste it into any spreadsheet.',
  summaryShared: 'Summary ready to send to your partner.',
  noData: 'No spending logged this month yet.',

  // Paywall
  paywallTitle: 'TwoPurse Pro',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  perk1: 'Unlimited envelopes (free: 6)',
  perk2: 'Money-date reports & trends',
  perk3: 'Export your data as CSV',
  startTrial: 'Start free trial',
  continueFree: 'Continue with free',

  // Profile
  appearance: 'Appearance',
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  dataNote: 'Your money data stays on this device. Nothing is uploaded.',
  proActive: 'Pro active',
  getPro: 'Get TwoPurse Pro',
  version: 'Version',
  deleteExpense: 'Delete',
  confirmArchive: 'Archived envelopes are hidden from the budget. You can restore them anytime.',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'TwoPurse',
  tagline: 'ميزانية واحدة لشخصين',

  slide1Title: 'خلافات المال، بحلٍّ لطيف',
  slide1Body:
    'معظم الأزواج يتشاجرون حول الإنفاق لا حول المال نفسه. TwoPurse يعطي كل درهم بيتاً قبل أن يبدأ الشهر.',
  slide2Title: 'مظاريف، لا جداول',
  slide2Body:
    'كل فئة إنفاق هي مظروف بمبلغ شهري. كلاكما يسجّل المصروف ويرى المتبقي بنظرة واحدة.',
  slide3Title: 'موعد مالي شهري',
  slide3Body:
    'في نهاية الشهر، اجلسا معاً: راجعا ما أنفقتما، وحوّلا الفائض إلى الادخار، وابدآ من جديد.',
  language: 'اللغة',
  currency: 'العملة',
  yourName: 'اسمك',
  partnerName: 'اسم الشريك',
  you: 'أنت',
  partner: 'الشريك',
  continue: 'متابعة',
  back: 'رجوع',
  getStarted: 'ابدأ',
  done: 'تم',
  save: 'حفظ',
  cancel: 'إلغاء',
  ok: 'حسناً',

  envelopes: 'المظاريف',
  moneyDate: 'الموعد المالي',
  profile: 'الحساب',

  leftToSpend: 'متبقٍّ للإنفاق',
  spent: 'أُنفق',
  planned: 'المخطط',
  joint: 'مشترك',
  addEnvelope: 'مظروف جديد',
  editEnvelope: 'تعديل المظروف',
  noEnvelopes: 'لا مظاريف بعد. أنشئ أول مظروف أدناه.',
  envelopeName: 'الاسم',
  monthlyAmount: 'المبلغ الشهري',
  owner: 'المالك',
  ownerJoint: 'لنا (مشترك)',
  ownerMine: 'لي',
  ownerTheirs: 'للشريك',
  color: 'اللون',
  rolloverToggle: 'ترحيل الفائض إلى الادخار',
  rolloverHint: 'في الموعد المالي، يُنقل ما تبقى في هذا المظروف إلى الادخار.',
  archive: 'أرشفة المظروف',
  unarchive: 'استعادة المظروف',
  recentExpenses: 'مصروف هذا الشهر',
  noExpensesYet: 'لا مصروف مسجّل بعد هذا الشهر.',
  overspentBy: 'تجاوز بمقدار',
  savings: 'الادخار',
  totalPlanned: 'المخطط',
  totalSpent: 'المنفَق',
  totalLeft: 'المتبقي',
  allSpent: 'أُنفق بالكامل',
  perPerson: 'للشخص',

  addExpense: 'إضافة مصروف',
  amount: 'المبلغ',
  pickEnvelope: 'المظروف',
  whoSpent: 'من أنفق؟',
  me: 'أنا',
  note: 'ملاحظة',
  noteOptional: 'ملاحظة (اختياري)',
  date: 'التاريخ',
  today: 'اليوم',
  saveExpense: 'حفظ المصروف',
  amountRequired: 'أدخل المبلغ أولاً.',

  limitTitle: 'بلغت حد المظاريف',
  limitBody: 'الخطة المجانية تشمل 6 مظاريف. TwoPurse Pro يفتح مظاريف غير محدودة.',
  goPro: 'اشترك في Pro',

  reviewFor: 'مراجعة',
  biggestEnvelope: 'أكبر مظروف',
  whoSpentWhat: 'من أنفق ماذا',
  savingsRate: 'ادُّخر هذا الشهر',
  rolloverTitle: 'إغلاق الشهر',
  rolloverBody: 'انقل الفائض من مظاريف الترحيل إلى الادخار، ثم ابدأ شهراً جديداً.',
  rolloverButton: 'ترحيل الفائض وإغلاق الشهر',
  rolloverDone: 'أُغلق الشهر — نُقل الفائض إلى الادخار.',
  shareSummary: 'مشاركة الملخص',
  exportCsv: 'تصدير CSV',
  csvCopied: 'نُسخ CSV — الصقه في أي جدول.',
  summaryShared: 'الملخص جاهز لإرساله إلى شريكك.',
  noData: 'لا مصروف مسجّل بعد هذا الشهر.',

  paywallTitle: 'TwoPurse Pro',
  paywallSubtitle: 'اشتراك أسبوعي · تجربة مجانية · إلغاء في أي وقت',
  perk1: 'مظاريف غير محدودة (المجاني: 6)',
  perk2: 'تقارير الموعد المالي والاتجاهات',
  perk3: 'تصدير بياناتك كملف CSV',
  startTrial: 'ابدأ التجربة المجانية',
  continueFree: 'المتابعة بالمجاني',

  appearance: 'المظهر',
  system: 'النظام',
  light: 'فاتح',
  dark: 'داكن',
  dataNote: 'بياناتك المالية تبقى على هذا الجهاز. لا يُرفع شيء.',
  proActive: 'Pro مفعّل',
  getPro: 'احصل على TwoPurse Pro',
  version: 'الإصدار',
  deleteExpense: 'حذف',
  confirmArchive: 'المظاريف المؤرشفة تُخفى من الميزانية. يمكنك استعادتها في أي وقت.',
};

export type Lang = 'en' | 'ar';
export type Strings = typeof en;

let lang: Lang = I18nManager.isRTL ? 'ar' : 'en';

export function setLang(l: Lang) {
  lang = l;
  const rtl = l === 'ar';
  if (I18nManager.isRTL !== rtl) {
    I18nManager.forceRTL(rtl);
    // ponytail: full reload-on-toggle is a launch concern; v1 sets at onboarding.
  }
}

export function getLang(): Lang {
  return lang;
}

export function t(): Strings {
  return lang === 'ar' ? (ar as unknown as Strings) : en;
}

export function isRTL(): boolean {
  return lang === 'ar';
}
