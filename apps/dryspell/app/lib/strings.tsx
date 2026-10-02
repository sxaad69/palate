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

const LOCALE_KEY = '@dryspell:locale';

// ponytail: one dictionary per language, typed from `en` so a missing Arabic
// key is a compile error, not a runtime blank. RTL via I18nManager; the flag
// is applied at launch from the stored preference (full mirror needs restart
// on Android — layout uses logical properties so partial mirroring is fine).
const en = {
  // Onboarding
  obTitle: 'A fresh start, one day at a time',
  obSubtitle: 'DrySpell counts your clear days, shows what you save, and walks with you through the hard minutes.',
  obHabitQ: 'What are you stepping back from?',
  obHabitAlcohol: 'Alcohol',
  obHabitSmoking: 'Smoking',
  obHabitOther: 'Something else',
  obSpendQ: 'Roughly how much did it cost you per day?',
  obDateQ: 'When was your last day?',
  obToday: 'Today',
  obYesterday: 'Yesterday',
  obStart: 'Start my count',
  obSkip: 'Skip for now',
  // Dashboard
  dashDays: 'days clear',
  dashDay: 'day clear',
  dashHours: 'hrs',
  dashMins: 'min',
  dashSecs: 'sec',
  dashSaved: 'saved so far',
  dashAvoided: 'drinks avoided',
  dashPledge: 'Daily pledge',
  dashPledgeText: 'I choose a clear day today.',
  dashPledgeDone: 'Pledged for today ✓',
  dashSOS: 'Craving? Tap for SOS',
  dashNextMilestone: 'Next milestone',
  dashEncouragement: 'For today',
  // Milestones
  msTitle: 'Recovery timeline',
  msSubtitle: 'What your body is healing — celebrated, never diagnosing. Not medical advice.',
  msReached: 'Reached',
  msIn: 'in',
  msDays: 'days',
  // Journal
  jTitle: 'Journal',
  jPlaceholder: 'How are you feeling today?',
  jSave: 'Save entry',
  jEmpty: 'No entries yet. Writing helps — even one line.',
  jSaved: 'Saved',
  // Achievements
  achTitle: 'Achievements',
  achUnlocked: 'Unlocked',
  achLocked: 'Locked',
  // SOS
  sosTitle: 'Ride it out',
  sosSubtitle: 'Cravings peak and pass — usually within 10–20 minutes. Stay with this screen.',
  sosBreathe: 'Breathe with the circle',
  sosIn: 'Breathe in',
  sosOut: 'Breathe out',
  sosWhy: 'Your reasons',
  sosWhyEmpty: 'Add your reasons in your profile — they will wait for you here.',
  sosPledge: 'Say your pledge out loud',
  sosDistract: 'Do one small thing',
  sosDistractIdeas: 'Walk around the block · Drink a big glass of water · Call someone · Take a shower',
  sosDone: "You rode it out. That's a win.",
  // Savings goals
  goalTitle: 'Savings goals',
  goalAdd: 'New goal',
  goalName: 'What are you saving for?',
  goalTarget: 'Target amount',
  goalSave: 'Save goal',
  goalOf: 'of',
  // Paywall
  pwTitle: 'Go further with DrySpell Plus',
  pwSubtitle: 'Unlimited journal, full milestone timeline, savings goals, and SOS toolkit.',
  pwWeekly: 'Weekly',
  pwTrial: '7-day free trial, then {price}/week. Cancel anytime.',
  pwCta: 'Start free trial',
  pwRestore: 'Restore purchase',
  pwTerms: 'Payment is charged to your Play account at confirmation. The trial converts to a paid weekly subscription unless cancelled 24h before it ends.',
  pwLater: 'Maybe later',
  // Profile
  pTitle: 'Profile',
  pLanguage: 'Language',
  pAppearance: 'Appearance',
  pLight: 'Light',
  pDark: 'Dark',
  pSystem: 'System',
  pReasons: 'My reasons',
  pReasonsPh: 'One per line — why does a clear day matter to you?',
  pReset: 'Reset my count',
  pResetConfirm: 'Start over from today? Your journal stays.',
  pResetYes: 'Reset',
  pCancel: 'Cancel',
  pGoPlus: 'Get DrySpell Plus',
  pMedical: 'DrySpell is a self-tracking tool, not medical care. If stopping feels unsafe, talk to a qualified professional first.',
  // Tabs
  tabToday: 'Today',
  tabTimeline: 'Timeline',
  tabBadges: 'Badges',
  // Common
  commonContinue: 'Continue',
  commonClose: 'Close',
  commonSave: 'Save',
  currency: '$',
};

type Strings = typeof en;

const ar: Strings = {
  obTitle: 'بداية جديدة، يومًا بيوم',
  obSubtitle: 'دراي‌سبيل يحسب أيامك الصافية، ويُظهر ما توفره، ويرافقك في الدقائق الصعبة.',
  obHabitQ: 'ما الذي تبتعد عنه؟',
  obHabitAlcohol: 'الكحول',
  obHabitSmoking: 'التدخين',
  obHabitOther: 'شيء آخر',
  obSpendQ: 'كم كانت تكلفتك اليومية تقريبًا؟',
  obDateQ: 'متى كان آخر يوم؟',
  obToday: 'اليوم',
  obYesterday: 'أمس',
  obStart: 'ابدأ العد',
  obSkip: 'تخطَّ الآن',
  dashDays: 'أيام صافية',
  dashDay: 'يوم صافٍ',
  dashHours: 'ساعة',
  dashMins: 'دقيقة',
  dashSecs: 'ثانية',
  dashSaved: 'وفّرت حتى الآن',
  dashAvoided: 'مشروبات تجنبتها',
  dashPledge: 'تعهّد اليوم',
  dashPledgeText: 'أختار يومًا صافيًا اليوم.',
  dashPledgeDone: 'تم التعهد اليوم ✓',
  dashSOS: 'اشتهاء؟ اضغط للمساعدة',
  dashNextMilestone: 'الإنجاز التالي',
  dashEncouragement: 'لهذا اليوم',
  msTitle: 'خط التعافي الزمني',
  msSubtitle: 'ما الذي يتعافى في جسمك — نحتفل به دون تشخيص. ليست نصيحة طبية.',
  msReached: 'تم الوصول',
  msIn: 'خلال',
  msDays: 'أيام',
  jTitle: 'اليوميات',
  jPlaceholder: 'كيف تشعر اليوم؟',
  jSave: 'حفظ المدخلة',
  jEmpty: 'لا مدخلات بعد. الكتابة تساعد — ولو سطرًا واحدًا.',
  jSaved: 'تم الحفظ',
  achTitle: 'الإنجازات',
  achUnlocked: 'مفتوح',
  achLocked: 'مغلق',
  sosTitle: 'تجاوزها',
  sosSubtitle: 'الاشتهاء يبلغ ذروته ثم يمر — عادة خلال ١٠–٢٠ دقيقة. ابقَ مع هذه الشاشة.',
  sosBreathe: 'تنفس مع الدائرة',
  sosIn: 'شهيق',
  sosOut: 'زفير',
  sosWhy: 'أسبابك',
  sosWhyEmpty: 'أضف أسبابك في ملفك — ستكون بانتظارك هنا.',
  sosPledge: 'قل تعهدك بصوت عالٍ',
  sosDistract: 'افعل شيئًا صغيرًا',
  sosDistractIdeas: 'امشِ حول المبنى · اشرب كوب ماء كبيرًا · اتصل بشخص · خذ دشًا',
  sosDone: 'لقد تجاوزتها. هذا انتصار.',
  goalTitle: 'أهداف التوفير',
  goalAdd: 'هدف جديد',
  goalName: 'لماذا تدخر؟',
  goalTarget: 'المبلغ المستهدف',
  goalSave: 'حفظ الهدف',
  goalOf: 'من',
  pwTitle: 'اذهب أبعد مع دراي‌سبيل بلس',
  pwSubtitle: 'يوميات غير محدودة، الخط الزمني الكامل، أهداف التوفير، ومجموعة الطوارئ.',
  pwWeekly: 'أسبوعي',
  pwTrial: 'تجربة مجانية ٧ أيام، ثم {price}/أسبوع. ألغِ في أي وقت.',
  pwCta: 'ابدأ التجربة المجانية',
  pwRestore: 'استعادة الشراء',
  pwTerms: 'يُخصم الدفع من حساب Play عند التأكيد. تتحول التجربة إلى اشتراك أسبوعي مدفوع ما لم تُلغَ قبل ٢٤ ساعة من انتهائها.',
  pwLater: 'لاحقًا',
  pTitle: 'الملف',
  pLanguage: 'اللغة',
  pAppearance: 'المظهر',
  pLight: 'فاتح',
  pDark: 'داكن',
  pSystem: 'النظام',
  pReasons: 'أسبابي',
  pReasonsPh: 'سبب في كل سطر — لماذا يهمك اليوم الصافي؟',
  pReset: 'صفّر العد',
  pResetConfirm: 'تبدأ من جديد اليوم؟ يومياتك تبقى.',
  pResetYes: 'صفّر',
  pCancel: 'إلغاء',
  pGoPlus: 'احصل على دراي‌سبيل بلس',
  pMedical: 'دراي‌سبيل أداة تتبع ذاتي وليست رعاية طبية. إذا كان التوقف غير آمن، تحدث مع مختص أولًا.',
  tabToday: 'اليوم',
  tabTimeline: 'الخط الزمني',
  tabBadges: 'الأوسمة',
  commonContinue: 'متابعة',
  commonClose: 'إغلاق',
  commonSave: 'حفظ',
  currency: '$',
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
