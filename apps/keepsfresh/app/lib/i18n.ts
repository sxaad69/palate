import { I18nManager } from 'react-native';

// Minimal dictionary — ponytail: full i18n framework is overkill for v1.
// Add keys here as screens need them; English is the fallback.
const en = {
  appName: 'KeepsFresh',
  tagline: 'Nothing in your fridge goes to waste',
  continue: 'Continue',
  start: 'Get started',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  done: 'Done',
  search: 'Search',
  add: 'Add',
  free: 'Free',
  pro: 'Pro',
  // Tabs
  pantry: 'Pantry',
  alerts: 'Alerts',
  stats: 'Stats',
  profile: 'Profile',
  // Pantry
  useSoon: 'Use soon',
  thisWeek: 'This week',
  fresh: 'Fresh',
  expired: 'Expired',
  emptyPantry: 'Your pantry is empty',
  emptyPantryBody: 'Add your first item — we’ll pre-fill the expiry date from our food database.',
  addItem: 'Add item',
  noResults: 'No items match your search',
  expiresToday: 'Expires today',
  expiresTomorrow: 'Expires tomorrow',
  freeLimitTitle: 'Pantry is full',
  freeLimitBody: 'Free tracks up to 30 items. Go Pro for unlimited items.',
  // Add / edit
  addItemTitle: 'Add item',
  editItemTitle: 'Edit item',
  itemName: 'Item name',
  itemNamePlaceholder: 'e.g. Milk',
  category: 'Category',
  location: 'Stored in',
  locPantry: 'Pantry',
  locFridge: 'Fridge',
  locFreezer: 'Freezer',
  expiry: 'Expiry',
  expiryInDays: 'days from today',
  quantity: 'Quantity',
  smartDefault: 'Smart default',
  smartDefaultBody: 'usually keeps {days} days in the {loc}. Adjust if needed.',
  noMatch: 'Not in our database — add it manually below.',
  nameRequired: 'Give the item a name',
  price: 'Est. price (USD)',
  // Alerts
  alertsTitle: 'Use soon',
  alertsBody: 'Items expiring within 2 days, sorted by waste risk.',
  noAlerts: 'Nothing expiring soon. Nicely stocked.',
  reminders: 'Expiry reminders',
  remindersOn: 'On — we’ll remind you before food spoils',
  remindersOff: 'Off',
  // Stats
  statsTitle: 'Waste saved',
  wasteSaved: 'Money saved',
  itemsSaved: 'Items saved',
  wastedWeek: 'Wasted this week',
  expiringWeek: 'Expiring this week',
  tracked: 'Items tracked',
  weeklyReport: 'Weekly waste report',
  wastedItems: 'wasted',
  usedItems: 'used up',
  reportLocked: 'Weekly waste reports are a Pro feature.',
  exportBtn: 'Export pantry (CSV)',
  // Profile
  appearance: 'Appearance',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',
  language: 'Language',
  notifications: 'Notifications',
  unlockPro: 'Go Pro — unlimited items',
  proActive: 'Pro is active',
  restorePurchases: 'Restore purchases',
  aboutTitle: 'About KeepsFresh',
  aboutBody: 'Your pantry, expiry dates, and reminders all live on this device. Nothing is uploaded.',
  version: 'Version 1.0.0',
  // Paywall
  paywallTitle: 'Never throw food away again',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  paywallBullets: 'Unlimited items|Weekly waste reports|Pantry export (CSV)',
  weeklyPlan: 'Weekly',
  trialNote: 'Start with a free trial',
  buyCta: 'Continue',
  restore: 'Restore purchase',
  priceLoading: 'Loading price…',
  termsNote: 'Payment is charged to your Google Play account. Cancel anytime.',
  cancelAnytime: 'Cancel anytime',
  // Item actions
  markUsed: 'Used up',
  markWasted: 'Wasted',
  confirmWaste: 'Log as wasted?',
  confirmWasteBody: 'This counts against your weekly waste report.',
  yes: 'Yes',
  risk: 'waste risk',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'KeepsFresh',
  tagline: 'لا شيء في ثلاجتك يذهب هدراً',
  continue: 'متابعة',
  start: 'ابدأ',
  save: 'حفظ',
  cancel: 'إلغاء',
  delete: 'حذف',
  edit: 'تعديل',
  done: 'تم',
  search: 'بحث',
  add: 'إضافة',
  free: 'مجاني',
  pro: 'Pro',
  pantry: 'المخزن',
  alerts: 'التنبيهات',
  stats: 'الإحصائيات',
  profile: 'الحساب',
  useSoon: 'استخدم قريباً',
  thisWeek: 'هذا الأسبوع',
  fresh: 'طازج',
  expired: 'منتهي الصلاحية',
  emptyPantry: 'مخزنك فارغ',
  emptyPantryBody: 'أضف أول صنف — سنملأ تاريخ الانتهاء تلقائياً من قاعدة بيانات الأطعمة.',
  addItem: 'إضافة صنف',
  noResults: 'لا توجد أصناف مطابقة للبحث',
  expiresToday: 'ينتهي اليوم',
  expiresTomorrow: 'ينتهي غداً',
  freeLimitTitle: 'المخزن ممتلئ',
  freeLimitBody: 'الخطة المجانية تتسع لـ 30 صنفاً. اشترك في Pro لأصناف غير محدودة.',
  addItemTitle: 'إضافة صنف',
  editItemTitle: 'تعديل الصنف',
  itemName: 'اسم الصنف',
  itemNamePlaceholder: 'مثال: حليب',
  category: 'الفئة',
  location: 'محفوظ في',
  locPantry: 'المخزن',
  locFridge: 'الثلاجة',
  locFreezer: 'الفريزر',
  expiry: 'تاريخ الانتهاء',
  expiryInDays: 'يوم من اليوم',
  quantity: 'الكمية',
  smartDefault: 'اقتراح ذكي',
  smartDefaultBody: 'يبقى عادة {days} يوم في {loc}. عدّل حسب الحاجة.',
  noMatch: 'غير موجود في قاعدة البيانات — أضفه يدوياً أدناه.',
  nameRequired: 'أدخل اسم الصنف',
  price: 'السعر التقريبي (دولار)',
  alertsTitle: 'استخدم قريباً',
  alertsBody: 'الأصناف التي تنتهي خلال يومين، مرتبة حسب خطر الهدر.',
  noAlerts: 'لا شيء على وشك الانتهاء. مخزون ممتاز.',
  reminders: 'تذكيرات الانتهاء',
  remindersOn: 'مفعّلة — سنذكّرك قبل فساد الطعام',
  remindersOff: 'معطّلة',
  statsTitle: 'الهدر الذي وفّرته',
  wasteSaved: 'الأموال الموفّرة',
  itemsSaved: 'الأصناف الموفّرة',
  wastedWeek: 'هُدر هذا الأسبوع',
  expiringWeek: 'ينتهي هذا الأسبوع',
  tracked: 'الأصناف المتتبعة',
  weeklyReport: 'تقرير الهدر الأسبوعي',
  wastedItems: 'هُدر',
  usedItems: 'استُهلك',
  reportLocked: 'تقارير الهدر الأسبوعية ميزة Pro.',
  exportBtn: 'تصدير المخزن (CSV)',
  appearance: 'المظهر',
  themeSystem: 'النظام',
  themeLight: 'فاتح',
  themeDark: 'داكن',
  language: 'اللغة',
  notifications: 'الإشعارات',
  unlockPro: 'اشترك في Pro — أصناف غير محدودة',
  proActive: 'اشتراك Pro مفعّل',
  restorePurchases: 'استعادة المشتريات',
  aboutTitle: 'عن KeepsFresh',
  aboutBody: 'مخزنك وتواريخ الانتهاء والتذكيرات كلها على هذا الجهاز. لا يُرفع أي شيء.',
  version: 'الإصدار 1.0.0',
  paywallTitle: 'لا ترمِ الطعام أبداً بعد اليوم',
  paywallSubtitle: 'اشتراك أسبوعي · تجربة مجانية · إلغاء في أي وقت',
  paywallBullets: 'أصناف غير محدودة|تقارير الهدر الأسبوعية|تصدير المخزن (CSV)',
  weeklyPlan: 'أسبوعي',
  trialNote: 'ابدأ بتجربة مجانية',
  buyCta: 'متابعة',
  restore: 'استعادة الشراء',
  priceLoading: 'جارٍ تحميل السعر…',
  termsNote: 'يُخصم الدفع من حساب Google Play. يمكنك الإلغاء في أي وقت.',
  cancelAnytime: 'إلغاء في أي وقت',
  markUsed: 'استُهلك',
  markWasted: 'هُدر',
  confirmWaste: 'تسجيل كهدر؟',
  confirmWasteBody: 'سيُحتسب هذا في تقرير الهدر الأسبوعي.',
  yes: 'نعم',
  risk: 'خطر الهدر',
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

// Simple day pluralization for countdown labels.
export function daysLabel(n: number): string {
  if (lang === 'ar') {
    if (n === 1) return 'يوم واحد';
    if (n === 2) return 'يومان';
    return `${n} أيام`;
  }
  return n === 1 ? '1 day' : `${n} days`;
}
