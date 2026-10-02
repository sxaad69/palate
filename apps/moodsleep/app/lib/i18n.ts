import { I18nManager } from 'react-native';

// Minimal dictionary — ponytail: full i18n framework is overkill for v1.
// Add keys here as screens need them; English is the fallback.
const en = {
  appName: 'Restory',
  tagline: 'Your sleep writes your days',
  continue: 'Continue',
  start: 'Begin',
  today: 'Today',
  insights: 'Insights',
  progress: 'Progress',
  profile: 'Profile',
  // Today screen
  goodMorning: 'Good morning',
  goodAfternoon: 'Good afternoon',
  goodEvening: 'Good evening',
  goodNight: 'Good night',
  lastNight: 'Last night',
  howDidYouSleep: 'How did you sleep?',
  sleepQuality: 'Sleep quality',
  bedtime: 'Bedtime',
  wakeTime: 'Wake time',
  todaysMood: "Today's mood",
  howAreYouFeeling: 'How are you feeling?',
  note: 'Note (optional)',
  notePlaceholder: 'One line about the day…',
  saved: 'Saved',
  sleepFirstHint: 'Log last night first — everything else pairs with it.',
  // Mood labels (1–5)
  mood1: 'Rough',
  mood2: 'Low',
  mood3: 'Okay',
  mood4: 'Good',
  mood5: 'Great',
  // Sleep-quality labels (1–5)
  sleep1: 'Restless',
  sleep2: 'Light',
  sleep3: 'Okay',
  sleep4: 'Deep',
  sleep5: 'Amazing',
  // Insights
  sleepMoodLink: 'Sleep → mood',
  liftSuffix: 'mood points after 4★+ sleep',
  notEnoughData: 'Log a few more nights to unlock this insight.',
  yourSweetSpot: 'Your sweet spot',
  avgBedtimeGoodNights: 'Avg. bedtime on 4★+ nights',
  avgSleepLength: 'Avg. sleep on 4★+ nights',
  hoursShort: 'h',
  thisWeek: 'This week',
  moodTab: 'Mood',
  sleepTab: 'Sleep',
  restStory: 'Your rest story',
  keepLogging: 'Keep logging — your rest story appears after 3 nights.',
  proLockedTitle: 'Your sleep has a story to tell',
  proLockedBody: 'Unlock the mood↔sleep correlation, weekly rest stories, and unlimited history.',
  unlockPro: 'Unlock Restory Pro',
  // Progress
  dayStreak: 'day streak',
  checkIns: 'check-ins',
  nightsLogged: 'nights logged',
  history: 'History',
  recentDays: 'Recent days',
  freeHistoryCap: 'Free shows the last 7 days — Pro keeps your whole story.',
  noEntriesYet: 'No entries yet. Tonight, log your sleep — it takes 20 seconds.',
  // Profile
  appearance: 'Appearance',
  language: 'Language',
  bedtimeReminder: 'Bedtime reminder',
  reminderDesc: 'A gentle nudge to close the day in 20 seconds.',
  reminderTime: 'Reminder time',
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  exportCsv: 'Export data (CSV)',
  exportHint: 'Sends your journal as a CSV via the share sheet.',
  paywallTitle: 'Unlock your rest story',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  proMember: 'Pro member',
  // Paywall perks
  perkHistory: 'Unlimited history — every night, forever',
  perkInsights: 'Sleep ↔ mood correlation insights',
  perkStory: 'Weekly rest story, written from your data',
  perkExport: 'CSV export of your whole journal',
  free: 'Free',
  locked: 'Pro',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'Restory',
  tagline: 'نومك يكتب أيامك',
  continue: 'متابعة',
  start: 'ابدأ',
  today: 'اليوم',
  insights: 'الرؤى',
  progress: 'التقدّم',
  profile: 'الحساب',
  goodMorning: 'صباح الخير',
  goodAfternoon: 'طاب يومك',
  goodEvening: 'مساء الخير',
  goodNight: 'ليلة سعيدة',
  lastNight: 'الليلة الماضية',
  howDidYouSleep: 'كيف كان نومك؟',
  sleepQuality: 'جودة النوم',
  bedtime: 'وقت النوم',
  wakeTime: 'وقت الاستيقاظ',
  todaysMood: 'مزاج اليوم',
  howAreYouFeeling: 'كيف تشعر؟',
  note: 'ملاحظة (اختياري)',
  notePlaceholder: 'سطر واحد عن اليوم…',
  saved: 'تم الحفظ',
  sleepFirstHint: 'سجّل نوم الليلة الماضية أولًا — كل شيء آخر يقترن به.',
  mood1: 'يوم صعب',
  mood2: 'منخفض',
  mood3: 'عادي',
  mood4: 'جيد',
  mood5: 'رائع',
  sleep1: 'متقطع',
  sleep2: 'خفيف',
  sleep3: 'عادي',
  sleep4: 'عميق',
  sleep5: 'ممتاز',
  sleepMoodLink: 'النوم ← المزاج',
  liftSuffix: 'نقطة مزاج بعد نوم ٤★ فأكثر',
  notEnoughData: 'سجّل بضع ليالٍ أخرى لفتح هذه الرؤية.',
  yourSweetSpot: 'وقتك المثالي',
  avgBedtimeGoodNights: 'متوسط وقت النوم في ليالي ٤★ فأكثر',
  avgSleepLength: 'متوسط النوم في ليالي ٤★ فأكثر',
  hoursShort: 'س',
  thisWeek: 'هذا الأسبوع',
  moodTab: 'المزاج',
  sleepTab: 'النوم',
  restStory: 'قصة راحتك',
  keepLogging: 'واصل التسجيل — ستظهر قصة راحتك بعد ٣ ليالٍ.',
  proLockedTitle: 'نومك يحمل قصة تستحق أن تُروى',
  proLockedBody: 'افتح رؤية الارتباط بين النوم والمزاج، وقصص الراحة الأسبوعية، وسجلًا غير محدود.',
  unlockPro: 'افتح Restory Pro',
  dayStreak: 'يوم متتالٍ',
  checkIns: 'تسجيلات',
  nightsLogged: 'ليالٍ مسجلة',
  history: 'السجل',
  recentDays: 'الأيام الأخيرة',
  freeHistoryCap: 'المجاني يعرض آخر ٧ أيام — Pro يحتفظ بقصتك كاملة.',
  noEntriesYet: 'لا تسجيلات بعد. الليلة، سجّل نومك — يستغرق ٢٠ ثانية.',
  appearance: 'المظهر',
  language: 'اللغة',
  bedtimeReminder: 'تذكير النوم',
  reminderDesc: 'تذكير لطيف لإغلاق اليوم في ٢٠ ثانية.',
  reminderTime: 'وقت التذكير',
  system: 'النظام',
  light: 'فاتح',
  dark: 'داكن',
  exportCsv: 'تصدير البيانات (CSV)',
  exportHint: 'يرسل يومياتك كملف CSV عبر قائمة المشاركة.',
  paywallTitle: 'افتح قصة راحتك',
  paywallSubtitle: 'اشتراك أسبوعي · تجربة مجانية · إلغاء في أي وقت',
  proMember: 'عضو Pro',
  perkHistory: 'سجل غير محدود — كل ليلة، للأبد',
  perkInsights: 'رؤى الارتباط بين النوم والمزاج',
  perkStory: 'قصة راحة أسبوعية مكتوبة من بياناتك',
  perkExport: 'تصدير CSV ليومياتك كاملة',
  free: 'مجاني',
  locked: 'Pro',
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
