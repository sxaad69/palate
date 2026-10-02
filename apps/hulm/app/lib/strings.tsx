import React, { createContext, useContext, useEffect } from 'react';
import { I18nManager } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const en = {
  dir: 'ltr' as 'ltr' | 'rtl',
  // Onboarding
  ob1Title: 'Dreams are for reflecting',
  ob1Body: 'Hulm is a dream journal with a symbol lexicon — write your dreams down before they fade.',
  ob2Title: 'Symbols, not verdicts',
  ob2Body: 'We match your words against traditional symbols. You decide what fits — we never claim certainty.',
  ob3Title: 'Not a religious ruling',
  ob3Body: 'This is for reflection and journaling — not tafsir al-ahlam. For religious questions, ask a scholar.',
  obStart: 'Begin journaling',
  // Journal
  journal: 'Journal',
  logDream: 'Log a dream',
  emptyTitle: 'No dreams yet',
  emptyBody: 'Log last night\u2019s dream — even fragments count.',
  dayStreak: 'day streak',
  // Form
  dreamTitle: 'Title',
  titlePlaceholder: 'e.g. The flood and the staircase',
  narrative: 'What happened?',
  narrativePlaceholder: 'Write everything you remember…',
  mood: 'How did you wake up feeling?',
  moodGood: 'Peaceful',
  moodNeutral: 'Neutral',
  moodBad: 'Uneasy',
  symbolsFound: 'Symbols we noticed — tap to confirm',
  noSymbols: 'No symbols matched. Browse the lexicon and add what fits.',
  browseSymbols: 'Browse symbols',
  saveDream: 'Save dream',
  needNarrative: 'Write a little of the dream first.',
  // Detail
  reflect: 'Reflect',
  confirmedSymbols: 'Symbols',
  yourWords: 'Your words',
  disclaimerShort: 'For reflection — not a religious ruling.',
  deleteDream: 'Delete dream',
  deleteConfirm: 'Delete this dream entry?',
  cancel: 'Cancel',
  editDream: 'Edit',
  // Symbols
  symbols: 'Symbols',
  searchSymbols: 'Search symbols…',
  plus: 'Plus',
  themes: 'Themes',
  reflectOn: 'Reflect on this',
  traditionalNote: 'Traditional association',
  traditionLabel: 'Cultural tradition — not a scholarly ruling.',
  // Insights
  insights: 'Insights',
  recurring: 'Recurring symbols',
  totalDreams: 'Dreams logged',
  activeDays: 'Nights journaled',
  moodMix: 'Waking moods',
  plusLocked: 'Insights are a Plus feature.',
  noData: 'Log a few dreams to see patterns.',
  times: 'times',
  // Paywall
  payTitle: 'Hulm Plus',
  payBody: 'The full lexicon and your patterns. Reflection, deeper.',
  f1: 'All 47 dream symbols',
  f2: 'Recurring-symbol insights',
  f3: 'Mood & pattern trends',
  weeklyTrial: 'Start free trial',
  payNote: 'Weekly plan · free trial · cancel anytime',
  upgrade: 'Go Plus',
  later: 'Later',
  // Settings
  settings: 'Settings',
  language: 'Language',
  english: 'English',
  arabic: 'العربية',
  appearance: 'Appearance',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  disclaimerTitle: 'Please read',
  disclaimerBody: 'Hulm is a journaling and reflection tool. Symbol meanings are cultural traditions and reflective prompts — not religious rulings (tafsir al-ahlam) and not professional advice. For religious questions about dreams, consult a qualified scholar.',
  eraseAll: 'Erase all data',
  eraseConfirm: 'Erase all dreams? This cannot be undone.',
  version: 'Hulm 1.0',
};

export type Strings = typeof en;

const ar: Strings = {
  dir: 'rtl',
  ob1Title: 'الأحلام للتأمل',
  ob1Body: 'حُلم مفكرة أحلام مع معجم رموز — اكتب أحلامك قبل أن تتلاشى.',
  ob2Title: 'رموز لا أحكام',
  ob2Body: 'نطابق كلماتك مع رموز تقليدية. أنت تقرر ما يناسب — ولا ندعي اليقين أبدًا.',
  ob3Title: 'ليست فتوى دينية',
  ob3Body: 'هذا للتأمل والتدوين — وليس تفسيرًا شرعيًا للأحلام. للأسئلة الدينية اسأل عالمًا.',
  obStart: 'ابدأ التدوين',
  journal: 'المفكرة',
  logDream: 'سجل حلمًا',
  emptyTitle: 'لا أحلام بعد',
  emptyBody: 'سجل حلم الليلة الماضية — حتى الشذرات تُحتسب.',
  dayStreak: 'يوم متتالي',
  dreamTitle: 'العنوان',
  titlePlaceholder: 'مثال: الفيضان والدرج',
  narrative: 'ماذا حدث؟',
  narrativePlaceholder: 'اكتب كل ما تتذكره…',
  mood: 'كيف استيقظت؟',
  moodGood: 'مطمئن',
  moodNeutral: 'عادي',
  moodBad: 'منزعج',
  symbolsFound: 'رموز لاحظناها — اضغط للتأكيد',
  noSymbols: 'لا رموز مطابقة. تصفح المعجم وأضف ما يناسب.',
  browseSymbols: 'تصفح الرموز',
  saveDream: 'حفظ الحلم',
  needNarrative: 'اكتب شيئًا من الحلم أولًا.',
  reflect: 'تأمل',
  confirmedSymbols: 'الرموز',
  yourWords: 'كلماتك',
  disclaimerShort: 'للتأمل — وليست فتوى دينية.',
  deleteDream: 'حذف الحلم',
  deleteConfirm: 'حذف هذه المدخلة؟',
  cancel: 'إلغاء',
  editDream: 'تعديل',
  symbols: 'الرموز',
  searchSymbols: 'ابحث في الرموز…',
  plus: 'بلس',
  themes: 'الموضوعات',
  reflectOn: 'تأمل في هذا',
  traditionalNote: 'ارتباط تقليدي',
  traditionLabel: 'تراث ثقافي — وليس حكمًا شرعيًا.',
  insights: 'الرؤى',
  recurring: 'الرموز المتكررة',
  totalDreams: 'الأحلام المسجلة',
  activeDays: 'ليالٍ مدونة',
  moodMix: 'أمزجة الاستيقاظ',
  plusLocked: 'الرؤى ميزة بلس.',
  noData: 'سجل بعض الأحلام لرؤية الأنماط.',
  times: 'مرات',
  payTitle: 'حُلم بلس',
  payBody: 'المعجم الكامل وأنماطك. تأمل أعمق.',
  f1: 'جميع رموز الأحلام الـ٤٧',
  f2: 'رؤى الرموز المتكررة',
  f3: 'اتجاهات المزاج والأنماط',
  weeklyTrial: 'ابدأ التجربة المجانية',
  payNote: 'خطة أسبوعية · تجربة مجانية · ألغِ في أي وقت',
  upgrade: 'اشترك في بلس',
  later: 'لاحقًا',
  settings: 'الإعدادات',
  language: 'اللغة',
  english: 'English',
  arabic: 'العربية',
  appearance: 'المظهر',
  light: 'فاتح',
  dark: 'داكن',
  system: 'النظام',
  disclaimerTitle: 'يرجى القراءة',
  disclaimerBody: 'حُلم أداة تدوين وتأمل. معاني الرموز تراث ثقافي وأسئلة تأملية — وليست أحكامًا شرعية في تفسير الأحلام ولا نصيحة مهنية. للأسئلة الدينية عن الأحلام استشر عالمًا مؤهلًا.',
  eraseAll: 'مسح كل البيانات',
  eraseConfirm: 'مسح كل الأحلام؟ لا يمكن التراجع.',
  version: 'حُلم ١٫٠',
};

const Ctx = createContext<Strings>(en);

export function StringsProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useTheme();
  const value = lang === 'ar' ? ar : en;
  useEffect(() => {
    I18nManager.forceRTL(lang === 'ar');
    I18nManager.allowRTL(true);
  }, [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStrings(): { t: Strings } {
  return { t: useContext(Ctx) };
}
