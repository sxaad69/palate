import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PrayerKey } from './prayer';

export type Locale = 'en' | 'ar';

const LOCALE_KEY = '@salahmate:locale';

const en = {
  // Prayer names (transliteration + Arabic shown together in UI)
  prFajr: 'Fajr', prFajrAr: 'الفجر',
  prSunrise: 'Sunrise', prSunriseAr: 'الشروق',
  prDhuhr: 'Dhuhr', prDhuhrAr: 'الظهر',
  prAsr: 'Asr', prAsrAr: 'العصر',
  prMaghrib: 'Maghrib', prMaghribAr: 'المغرب',
  prIsha: 'Isha', prIshaAr: 'العشاء',
  // Onboarding
  obTitle: 'Your day, anchored in prayer',
  obSubtitle: 'Accurate prayer times, plus habits that ride on them.',
  obLocation: 'Use my location for prayer times',
  obLocationNote: 'Or we use Riyadh as a default. Times are calculated — verify with your local mosque.',
  obMethod: 'Calculation method',
  obStart: 'Begin',
  // Today
  tdNext: 'Next prayer',
  tdIn: 'in',
  tdToday: "Today's prayers",
  tdHabits: 'Habits',
  tdHabitsEmpty: 'Attach a habit to a prayer — e.g. "read after Fajr".',
  tdMarkDone: 'Mark prayed',
  tdPrayed: 'Prayed ✓',
  tdUndo: 'Undo',
  tdDhikr: 'Dhikr counter',
  // Habits
  hbTitle: 'Habits',
  hbAdd: 'Add habit',
  hbName: 'Habit (e.g. Read 2 pages)',
  hbAnchor: 'After which prayer?',
  hbSave: 'Save habit',
  hbEmpty: 'No habits yet. Anchor one to a prayer.',
  hbStreak: 'day streak',
  hbDelete: 'Delete',
  hbFreeLimit: 'Free plan: up to 3 habits. Go Plus for unlimited.',
  // Dhikr
  dkTitle: 'Dhikr',
  dkTarget: 'Target',
  dkTap: 'Tap to count',
  dkReset: 'Reset',
  dkDone: 'MashaAllah! Target reached.',
  // Progress
  pgTitle: 'Progress',
  pgPrayerWeek: 'Prayers this week',
  pgStreak: 'Perfect days in a row',
  pgScore: "Today's score",
  pgOf: 'of',
  // Paywall
  pwTitle: 'SalahMate Plus',
  pwSubtitle: 'Unlimited habits, custom dhikr targets, and prayer reminders.',
  pwWeekly: 'Weekly',
  pwTrial: '7-day free trial, then {price}/week. Cancel anytime.',
  pwCta: 'Start free trial',
  pwRestore: 'Restore purchase',
  pwTerms: 'Payment is charged to your Play account at confirmation. The trial converts to a paid weekly subscription unless cancelled 24h before it ends.',
  pwLater: 'Maybe later',
  // Settings
  sTitle: 'Settings',
  sLocation: 'Location',
  sUseDevice: 'Use device location',
  sMethod: 'Calculation method',
  sReminders: 'Prayer reminders',
  sLanguage: 'Language',
  sAppearance: 'Appearance',
  sLight: 'Light',
  sDark: 'Dark',
  sSystem: 'System',
  sGoPlus: 'Get SalahMate Plus',
  sErase: 'Erase all data',
  sEraseConfirm: 'Delete all records? This cannot be undone.',
  sEraseYes: 'Erase',
  sCancel: 'Cancel',
  sVerify: 'Prayer times are calculated. Please verify with your local mosque.',
  // Tabs
  tabToday: 'Today',
  tabHabits: 'Habits',
  tabDhikr: 'Dhikr',
  tabProgress: 'Progress',
  // Notifications
  notifTitle: (p: string) => `Time for ${p}`,
  notifBody: 'May your prayer be accepted.',
  // Common
  commonClose: 'Close',
  commonSave: 'Save',
  commonCancel: 'Cancel',
  commonDelete: 'Delete',
};

export type Strings = typeof en;

const ar: Strings = {
  prFajr: 'الفجر', prFajrAr: 'Fajr',
  prSunrise: 'الشروق', prSunriseAr: 'Sunrise',
  prDhuhr: 'الظهر', prDhuhrAr: 'Dhuhr',
  prAsr: 'العصر', prAsrAr: 'Asr',
  prMaghrib: 'المغرب', prMaghribAr: 'Maghrib',
  prIsha: 'العشاء', prIshaAr: 'Isha',
  obTitle: 'يومك، مرتكز على الصلاة',
  obSubtitle: 'مواقيت صلاة دقيقة، وعادات تركب عليها.',
  obLocation: 'استخدام موقعي لمواقيت الصلاة',
  obLocationNote: 'أو نستخدم الرياض كافتراضي. المواقيت محسوبة — تحقق مع مسجدك المحلي.',
  obMethod: 'طريقة الحساب',
  obStart: 'ابدأ',
  tdNext: 'الصلاة التالية',
  tdIn: 'بعد',
  tdToday: 'صلوات اليوم',
  tdHabits: 'العادات',
  tdHabitsEmpty: 'اربط عادة بصلاة — مثال: "اقرأ بعد الفجر".',
  tdMarkDone: 'تمت الصلاة',
  tdPrayed: 'صليت ✓',
  tdUndo: 'تراجع',
  tdDhikr: 'عداد الذكر',
  hbTitle: 'العادات',
  hbAdd: 'أضف عادة',
  hbName: 'العادة (مثال: اقرأ صفحتين)',
  hbAnchor: 'بعد أي صلاة؟',
  hbSave: 'حفظ العادة',
  hbEmpty: 'لا عادات بعد. اربط واحدة بصلاة.',
  hbStreak: 'أيام متتالية',
  hbDelete: 'حذف',
  hbFreeLimit: 'الخطة المجانية: حتى ٣ عادات. الترقية لبلس لعدد غير محدود.',
  dkTitle: 'الذكر',
  dkTarget: 'الهدف',
  dkTap: 'اضغط للعد',
  dkReset: 'صفّر',
  dkDone: 'ما شاء الله! بلغت الهدف.',
  pgTitle: 'التقدم',
  pgPrayerWeek: 'صلوات هذا الأسبوع',
  pgStreak: 'أيام كاملة متتالية',
  pgScore: 'نقاط اليوم',
  pgOf: 'من',
  pwTitle: 'صلاح‌ميت بلس',
  pwSubtitle: 'عادات غير محدودة، أهداف ذكر مخصصة، وتذكيرات الصلاة.',
  pwWeekly: 'أسبوعي',
  pwTrial: 'تجربة مجانية ٧ أيام، ثم {price}/أسبوع. ألغِ في أي وقت.',
  pwCta: 'ابدأ التجربة المجانية',
  pwRestore: 'استعادة الشراء',
  pwTerms: 'يُخصم الدفع من حساب Play عند التأكيد. تتحول التجربة إلى اشتراك أسبوعي مدفوع ما لم تُلغَ قبل ٢٤ ساعة من انتهائها.',
  pwLater: 'لاحقًا',
  sTitle: 'الإعدادات',
  sLocation: 'الموقع',
  sUseDevice: 'استخدام موقع الجهاز',
  sMethod: 'طريقة الحساب',
  sReminders: 'تذكيرات الصلاة',
  sLanguage: 'اللغة',
  sAppearance: 'المظهر',
  sLight: 'فاتح',
  sDark: 'داكن',
  sSystem: 'النظام',
  sGoPlus: 'احصل على صلاح‌ميت بلس',
  sErase: 'مسح كل البيانات',
  sEraseConfirm: 'حذف كل السجلات؟ لا يمكن التراجع.',
  sEraseYes: 'امسح',
  sCancel: 'إلغاء',
  sVerify: 'مواقيت الصلاة محسوبة. يرجى التحقق مع مسجدك المحلي.',
  tabToday: 'اليوم',
  tabHabits: 'العادات',
  tabDhikr: 'الذكر',
  tabProgress: 'التقدم',
  notifTitle: (p: string) => `حان وقت ${p}`,
  notifBody: 'تقبل الله صلاتك.',
  commonClose: 'إغلاق',
  commonSave: 'حفظ',
  commonCancel: 'إلغاء',
  commonDelete: 'حذف',
};

export function prayerName(key: PrayerKey, t: Strings, locale: Locale): string {
  const main = (() => {
    switch (key) {
      case 'fajr': return t.prFajr;
      case 'sunrise': return t.prSunrise;
      case 'dhuhr': return t.prDhuhr;
      case 'asr': return t.prAsr;
      case 'maghrib': return t.prMaghrib;
      case 'isha': return t.prIsha;
    }
  })();
  const alt = (() => {
    switch (key) {
      case 'fajr': return t.prFajrAr;
      case 'sunrise': return t.prSunriseAr;
      case 'dhuhr': return t.prDhuhrAr;
      case 'asr': return t.prAsrAr;
      case 'maghrib': return t.prMaghribAr;
      case 'isha': return t.prIshaAr;
    }
  })();
  return main === alt ? main : `${main} · ${alt}`;
}

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
