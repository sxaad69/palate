import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Locale = 'en' | 'ar';

const LOCALE_KEY = '@lanceledger:locale';

const en = {
  // Onboarding
  obTitle: 'Know your number',
  obSubtitle: 'LanceLedger tracks what you earn, what you spend, and which clients actually make you money.',
  obCurrencyQ: 'What currency do you work in?',
  obTaxQ: 'What % of profit should you set aside for taxes?',
  obTaxHint: 'A common rule of thumb is 25–30%. Not tax advice.',
  obStart: 'Start tracking',
  // Dashboard
  dashProfit: 'profit this month',
  dashIncome: 'income',
  dashExpenses: 'expenses',
  dashDeductible: 'deductible',
  dashTaxShield: 'tax shield',
  dashTaxShieldHint: 'set aside from profit',
  dashRecent: 'Recent',
  dashEmpty: 'No transactions yet. Add your first one below.',
  dashAddExpense: 'Add expense',
  dashAddIncome: 'Add income',
  // Add form
  addExpense: 'Add expense',
  addIncome: 'Add income',
  fAmount: 'Amount',
  fCategory: 'Category',
  fVendor: 'Vendor / note',
  fClient: 'Client',
  fNoClient: 'No client',
  fDate: 'Date',
  fDeductible: 'Tax deductible',
  fDeductibleHint: 'Mark if this is a business expense you can deduct.',
  fSave: 'Save',
  fSaved: 'Saved ✓',
  // Categories
  catSoftware: 'Software',
  catEquipment: 'Equipment',
  catTravel: 'Travel',
  catMeals: 'Meals',
  catOffice: 'Office',
  catMarketing: 'Marketing',
  catEducation: 'Education',
  catHealth: 'Health',
  catOther: 'Other',
  // Clients
  clTitle: 'Clients',
  clAdd: 'Add client',
  clName: 'Client name',
  clProfit: 'profit',
  clIncome: 'income',
  clExpenses: 'expenses',
  clEmpty: 'No clients yet. Tag transactions with a client to see who makes you money.',
  clDelete: 'Delete',
  clTransactions: 'Transactions',
  clFreeLimit: 'Free plan: up to 3 clients. Go Plus for unlimited.',
  // Reports
  rpTitle: 'Reports',
  rpMonthPL: 'This month',
  rpDeductible: 'Deductible expenses',
  rpDeductibleHint: 'Flagged as tax deductible this month.',
  rpByCategory: 'Spending by category',
  rpExport: 'Export CSV',
  rpExportHint: 'Plus: send a clean report to your accountant.',
  rpTaxNote: 'Not tax advice. Talk to a qualified professional.',
  // Paywall
  pwTitle: 'Go further with LanceLedger Plus',
  pwSubtitle: 'Unlimited clients, CSV export, and the full deductible tax report.',
  pwWeekly: 'Weekly',
  pwTrial: '7-day free trial, then {price}/week. Cancel anytime.',
  pwCta: 'Start free trial',
  pwRestore: 'Restore purchase',
  pwTerms: 'Payment is charged to your Play account at confirmation. The trial converts to a paid weekly subscription unless cancelled 24h before it ends.',
  pwLater: 'Maybe later',
  // Profile
  pTitle: 'Settings',
  pCurrency: 'Currency',
  pTaxRate: 'Tax set-aside %',
  pLanguage: 'Language',
  pAppearance: 'Appearance',
  pLight: 'Light',
  pDark: 'Dark',
  pSystem: 'System',
  pGoPlus: 'Get LanceLedger Plus',
  pExport: 'Export all data (CSV)',
  pReset: 'Erase all data',
  pResetConfirm: 'Delete every transaction and client? This cannot be undone.',
  pResetYes: 'Erase',
  pCancel: 'Cancel',
  pTaxNote: 'LanceLedger is a record-keeping tool, not tax advice. Talk to a qualified professional.',
  // Tabs
  tabToday: 'Today',
  tabClients: 'Clients',
  tabReports: 'Reports',
  tabAdd: 'Add',
  // Common
  commonClose: 'Close',
  commonSave: 'Save',
  commonCancel: 'Cancel',
  commonDelete: 'Delete',
};

export type Strings = typeof en;

const ar: Strings = {
  obTitle: 'اعرف رقمك',
  obSubtitle: 'لانس‌لدجر يتتبع ما تكسبه وما تنفقه وأي العملاء يحققون لك الربح فعلًا.',
  obCurrencyQ: 'بأي عملة تعمل؟',
  obTaxQ: 'ما النسبة التي يجب تخصيصها للضرائب من الربح؟',
  obTaxHint: 'القاعدة الشائعة ٢٥–٣٠٪. ليست نصيحة ضريبية.',
  obStart: 'ابدأ التتبع',
  dashProfit: 'ربح هذا الشهر',
  dashIncome: 'الدخل',
  dashExpenses: 'المصروفات',
  dashDeductible: 'قابل للخصم',
  dashTaxShield: 'درع الضرائب',
  dashTaxShieldHint: 'يُخصص من الربح',
  dashRecent: 'الأحدث',
  dashEmpty: 'لا معاملات بعد. أضف أول معاملة بالأسفل.',
  dashAddExpense: 'أضف مصروفًا',
  dashAddIncome: 'أضف دخلًا',
  addExpense: 'إضافة مصروف',
  addIncome: 'إضافة دخل',
  fAmount: 'المبلغ',
  fCategory: 'الفئة',
  fVendor: 'المورّد / ملاحظة',
  fClient: 'العميل',
  fNoClient: 'بدون عميل',
  fDate: 'التاريخ',
  fDeductible: 'قابل للخصم الضريبي',
  fDeductibleHint: 'حدد إذا كان مصروف عمل يمكنك خصمه.',
  fSave: 'حفظ',
  fSaved: 'تم الحفظ ✓',
  catSoftware: 'برمجيات',
  catEquipment: 'معدات',
  catTravel: 'سفر',
  catMeals: 'وجبات',
  catOffice: 'مكتب',
  catMarketing: 'تسويق',
  catEducation: 'تعليم',
  catHealth: 'صحة',
  catOther: 'أخرى',
  clTitle: 'العملاء',
  clAdd: 'أضف عميلًا',
  clName: 'اسم العميل',
  clProfit: 'الربح',
  clIncome: 'الدخل',
  clExpenses: 'المصروفات',
  clEmpty: 'لا عملاء بعد. اربط المعاملات بعميل لتعرف من يحقق لك الربح.',
  clDelete: 'حذف',
  clTransactions: 'المعاملات',
  clFreeLimit: 'الخطة المجانية: حتى ٣ عملاء. الترقية لبلس لعملاء غير محدودين.',
  rpTitle: 'التقارير',
  rpMonthPL: 'هذا الشهر',
  rpDeductible: 'المصروفات القابلة للخصم',
  rpDeductibleHint: 'تم تحديدها كقابلة للخصم الضريبي هذا الشهر.',
  rpByCategory: 'الإنفاق حسب الفئة',
  rpExport: 'تصدير CSV',
  rpExportHint: 'بلس: أرسل تقريرًا نظيفًا لمحاسبك.',
  rpTaxNote: 'ليست نصيحة ضريبية. تحدث مع مختص مؤهل.',
  pwTitle: 'اذهب أبعد مع لانس‌لدجر بلس',
  pwSubtitle: 'عملاء غير محدودين، تصدير CSV، وتقرير الخصم الضريبي الكامل.',
  pwWeekly: 'أسبوعي',
  pwTrial: 'تجربة مجانية ٧ أيام، ثم {price}/أسبوع. ألغِ في أي وقت.',
  pwCta: 'ابدأ التجربة المجانية',
  pwRestore: 'استعادة الشراء',
  pwTerms: 'يُخصم الدفع من حساب Play عند التأكيد. تتحول التجربة إلى اشتراك أسبوعي مدفوع ما لم تُلغَ قبل ٢٤ ساعة من انتهائها.',
  pwLater: 'لاحقًا',
  pTitle: 'الإعدادات',
  pCurrency: 'العملة',
  pTaxRate: 'نسبة تخصيص الضرائب ٪',
  pLanguage: 'اللغة',
  pAppearance: 'المظهر',
  pLight: 'فاتح',
  pDark: 'داكن',
  pSystem: 'النظام',
  pGoPlus: 'احصل على لانس‌لدجر بلس',
  pExport: 'تصدير كل البيانات (CSV)',
  pReset: 'مسح كل البيانات',
  pResetConfirm: 'حذف كل المعاملات والعملاء؟ لا يمكن التراجع.',
  pResetYes: 'امسح',
  pCancel: 'إلغاء',
  pTaxNote: 'لانس‌لدجر أداة حفظ سجلات وليست نصيحة ضريبية. تحدث مع مختص مؤهل.',
  tabToday: 'اليوم',
  tabClients: 'العملاء',
  tabReports: 'التقارير',
  tabAdd: 'إضافة',
  commonClose: 'إغلاق',
  commonSave: 'حفظ',
  commonCancel: 'إلغاء',
  commonDelete: 'حذف',
};

const dictionaries: Record<Locale, Strings> = { en, ar };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Strings;
  rtl: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LOCALE_KEY);
        if (saved === 'ar' || saved === 'en') {
          setLocaleState(saved);
          applyRtl(saved);
        }
      } catch {
        // ignore — default English
      }
    })();
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    applyRtl(l);
    AsyncStorage.setItem(LOCALE_KEY, l).catch(() => {});
  };

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale], rtl: locale === 'ar' }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function applyRtl(locale: Locale) {
  try {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(locale === 'ar');
  } catch {
    // ignore — layout uses logical properties
  }
}

export function useStrings(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useStrings must be used within LocaleProvider');
  return ctx;
}

export const CURRENCIES = ['$', '€', '£', '₹', 'ر.س', 'د.إ', '₺', '₦', '₱'] as const;
export type Currency = (typeof CURRENCIES)[number];
