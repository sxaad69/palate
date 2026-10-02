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

const LOCALE_KEY = '@dosedone:locale';

// Senior-friendly copy: short sentences, plain words, no jargon.
const en = {
  // Onboarding
  obTitle: 'Never miss a dose again',
  obSubtitle: 'DoseDone reminds you, with big buttons and simple words.',
  obStep1: 'Add your medicines.',
  obStep2: 'We remind you at the right time.',
  obStep3: 'Tap the big TAKE button. Done.',
  obEnable: 'Turn on reminders',
  obSkip: 'Skip for now',
  obStart: 'Get started',
  // Today
  todayTitle: "Today's doses",
  todayEmpty: 'No medicines yet. Tap Medicines to add one.',
  take: 'TAKE',
  taken: 'Taken ✓',
  missed: 'Missed',
  upcoming: 'Upcoming',
  dueNow: 'Due now',
  undo: 'Undo',
  lowStock: 'Running low',
  refill: 'I refilled',
  // Meds
  medsTitle: 'Medicines',
  medAdd: 'Add medicine',
  medName: 'Medicine name',
  medDosage: 'Dose (e.g. 1 pill, 10mg)',
  medTimes: 'Times per day',
  medAddTime: 'Add time',
  medPills: 'Pills in the bottle',
  medLowAt: 'Warn me when below',
  medSave: 'Save medicine',
  medDelete: 'Delete',
  medEdit: 'Edit',
  medEmpty: 'No medicines yet.',
  medFreeLimit: 'Free plan: up to 3 medicines. Go Plus for unlimited.',
  // Adherence
  adhTitle: 'How I am doing',
  adhWeek: 'This week',
  adhPercent: 'of doses taken',
  adhStreak: 'day streak',
  adhStreakDays: 'days in a row with no missed doses',
  adhEmpty: 'Take your first dose to start tracking.',
  // Caregiver
  cgTitle: 'For family',
  cgSubtitle: 'Show this screen to your family. It tells them how you are doing.',
  cgTaken: 'doses taken this week',
  cgMissed: 'doses missed this week',
  cgMeds: 'medicines',
  // Paywall
  pwTitle: 'DoseDone Plus',
  pwSubtitle: 'Unlimited medicines, refill alerts, and the family report.',
  pwWeekly: 'Weekly',
  pwTrial: '7-day free trial, then {price}/week. Cancel anytime.',
  pwCta: 'Start free trial',
  pwRestore: 'Restore purchase',
  pwTerms: 'Payment is charged to your Play account at confirmation. The trial converts to a paid weekly subscription unless cancelled 24h before it ends.',
  pwLater: 'Maybe later',
  // Settings
  sTitle: 'Settings',
  sLanguage: 'Language',
  sAppearance: 'Appearance',
  sLight: 'Light',
  sDark: 'Dark',
  sSystem: 'System',
  sGoPlus: 'Get DoseDone Plus',
  sErase: 'Erase all data',
  sEraseConfirm: 'Delete every medicine and record? This cannot be undone.',
  sEraseYes: 'Erase',
  sCancel: 'Cancel',
  sMedical: 'DoseDone reminds you. It does not prescribe. Always follow your doctor.',
  // Tabs
  tabToday: 'Today',
  tabMeds: 'Medicines',
  tabProgress: 'Progress',
  tabFamily: 'Family',
  // Reminders
  notifTitle: 'Time for your medicine',
  // Common
  commonClose: 'Close',
  commonSave: 'Save',
  commonCancel: 'Cancel',
  commonDelete: 'Delete',
};

type Strings = typeof en;

const ar: Strings = {
  obTitle: 'لا تفوّت جرعة أبدًا',
  obSubtitle: 'دوز‌دان يذكرك، بأزرار كبيرة وكلمات بسيطة.',
  obStep1: 'أضف أدويتك.',
  obStep2: 'نذكرك في الوقت المناسب.',
  obStep3: 'اضغط زر «تم» الكبير. انتهى.',
  obEnable: 'تفعيل التذكيرات',
  obSkip: 'تخطَّ الآن',
  obStart: 'ابدأ',
  todayTitle: 'جرعات اليوم',
  todayEmpty: 'لا أدوية بعد. اضغط «الأدوية» لإضافة دواء.',
  take: 'تم ✓',
  taken: 'تم تناولها ✓',
  missed: 'فائتة',
  upcoming: 'قادمة',
  dueNow: 'حان وقتها',
  undo: 'تراجع',
  lowStock: 'على وشك النفاد',
  refill: 'أعدت التعبئة',
  medsTitle: 'الأدوية',
  medAdd: 'أضف دواء',
  medName: 'اسم الدواء',
  medDosage: 'الجرعة (مثال: حبة، ١٠ ملغ)',
  medTimes: 'مرات في اليوم',
  medAddTime: 'أضف وقتًا',
  medPills: 'الحبوب في العلبة',
  medLowAt: 'نبهني عندما تقل عن',
  medSave: 'حفظ الدواء',
  medDelete: 'حذف',
  medEdit: 'تعديل',
  medEmpty: 'لا أدوية بعد.',
  medFreeLimit: 'الخطة المجانية: حتى ٣ أدوية. الترقية لبلس لعدد غير محدود.',
  adhTitle: 'كيف أسير',
  adhWeek: 'هذا الأسبوع',
  adhPercent: 'من الجرعات تم تناولها',
  adhStreak: 'أيام متتالية',
  adhStreakDays: 'أيام متتالية دون جرعات فائتة',
  adhEmpty: 'تناول أول جرعة لبدء التتبع.',
  cgTitle: 'للعائلة',
  cgSubtitle: 'أرِ هذه الشاشة لعائلتك. تخبرهم كيف تسير أمورك.',
  cgTaken: 'جرعات تم تناولها هذا الأسبوع',
  cgMissed: 'جرعات فائتة هذا الأسبوع',
  cgMeds: 'أدوية',
  pwTitle: 'دوز‌دان بلس',
  pwSubtitle: 'أدوية غير محدودة، تنبيهات إعادة التعبئة، وتقرير العائلة.',
  pwWeekly: 'أسبوعي',
  pwTrial: 'تجربة مجانية ٧ أيام، ثم {price}/أسبوع. ألغِ في أي وقت.',
  pwCta: 'ابدأ التجربة المجانية',
  pwRestore: 'استعادة الشراء',
  pwTerms: 'يُخصم الدفع من حساب Play عند التأكيد. تتحول التجربة إلى اشتراك أسبوعي مدفوع ما لم تُلغَ قبل ٢٤ ساعة من انتهائها.',
  pwLater: 'لاحقًا',
  sTitle: 'الإعدادات',
  sLanguage: 'اللغة',
  sAppearance: 'المظهر',
  sLight: 'فاتح',
  sDark: 'داكن',
  sSystem: 'النظام',
  sGoPlus: 'احصل على دوز‌دان بلس',
  sErase: 'مسح كل البيانات',
  sEraseConfirm: 'حذف كل الأدوية والسجلات؟ لا يمكن التراجع.',
  sEraseYes: 'امسح',
  sCancel: 'إلغاء',
  sMedical: 'دوز‌دان يذكرك. لا يصف الدواء. اتبع طبيبك دائمًا.',
  tabToday: 'اليوم',
  tabMeds: 'الأدوية',
  tabProgress: 'تقدمي',
  tabFamily: 'العائلة',
  notifTitle: 'حان وقت دوائك',
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

export type StringsType = Strings;
