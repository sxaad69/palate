import { I18nManager } from 'react-native';

// Minimal dictionary — full i18n framework is overkill for v1.
// English is the fallback. Add keys as screens need them.
const en = {
  appName: 'ShadowSay',
  tagline: 'Shadow. Speak. Sound native.',
  continue: 'Continue',
  start: 'Start practicing',
  packs: 'Packs',
  progress: 'Progress',
  profile: 'Profile',
  paywallTitle: 'Unlock every pack',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  dayStreak: 'day streak',
  phrases: 'phrases',
  stars: 'stars',
  completed: 'completed',
  locked: 'Pro',
  free: 'Free',
  yourInterface: 'Your language',
  learningDirection: 'Learning direction',
  dirArEn: 'Arabic → English',
  dirEnAr: 'English → Arabic',
  ttsRate: 'Model voice speed',
  appearance: 'Appearance',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  onboarding1Title: 'Hear it like a native',
  onboarding1Body: 'Play a native-model phrase and catch the rhythm, stress, and flow — no dry drills.',
  onboarding2Title: 'Shadow it out loud',
  onboarding2Body: 'Record your voice right after the model. We need microphone access so you can hear yourself back.',
  onboarding3Title: 'Compare and score',
  onboarding3Body: 'Play model and your attempt side by side, then score yourself 1–5 stars. Honest reps beat fake AI scores.',
  onboardingMicNote: 'Recordings stay on your device and are never uploaded.',
  pickYourLanguage: 'Pick your app language',
  pickDirection: 'Which direction will you practice?',
  listen: 'Listen',
  record: 'Record',
  stop: 'Stop',
  playModel: 'Play model',
  playMine: 'Play my attempt',
  selfScore: 'Score your attempt',
  nextPhrase: 'Next phrase',
  retry: 'Try again',
  noAttempt: 'Record an attempt first',
  packTravel: 'Travel',
  packWork: 'Work',
  packDaily: 'Daily Life',
  packArabic: 'Arabic for English Speakers',
  ofPhrases: 'of',
  dayLimitReached: 'Daily practice limit reached — go Pro for unlimited practice.',
  goPro: 'Go Pro',
  tryFreeTrial: 'Start free trial',
  maybeLater: 'Maybe later',
  signInLater: 'Purchases restore automatically',
  attemptsLeft: 'attempts left today',
  weekly: 'week',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'ShadowSay',
  tagline: 'ظِلّ، تكَلَّم، وكُن كالناطقين',
  continue: 'متابعة',
  start: 'ابدأ التدريب',
  packs: 'الحزم',
  progress: 'التقدّم',
  profile: 'الحساب',
  paywallTitle: 'افتح كل الحزم',
  paywallSubtitle: 'اشتراك أسبوعي · تجربة مجانية · إلغاء في أي وقت',
  dayStreak: 'يوم متتالٍ',
  phrases: 'عبارة',
  stars: 'نجوم',
  completed: 'مكتملة',
  locked: 'Pro',
  free: 'مجاني',
  yourInterface: 'لغة التطبيق',
  learningDirection: 'اتجاه التعلّم',
  dirArEn: 'عربي ← إنجليزي',
  dirEnAr: 'إنجليزي ← عربي',
  ttsRate: 'سرعة صوت النموذج',
  appearance: 'المظهر',
  light: 'فاتح',
  dark: 'داكن',
  system: 'النظام',
  onboarding1Title: 'استمع كالناطقين',
  onboarding1Body: 'شغّل عبارة بصوت نموذج والتقط الإيقاع والتشديد والانسيابية — بلا تدريبات جافة.',
  onboarding2Title: 'كرّرها بصوت عالٍ',
  onboarding2Body: 'سجّل صوتك بعد النموذج مباشرة. نحتاج صلاحية الميكروفون لتسمع نفسك لاحقاً.',
  onboarding3Title: 'قارن وقيّم نفسك',
  onboarding3Body: 'شغّل النموذج ومحاولتك جنباً إلى جنب، ثم قيّم نفسك من ١ إلى ٥ نجوم. التكرار الصادق أفضل من تقييم آلي مزيّف.',
  onboardingMicNote: 'التسجيلات تبقى على جهازك ولا تُرفع أبداً.',
  pickYourLanguage: 'اختر لغة التطبيق',
  pickDirection: 'في أي اتجاه ستتدرب؟',
  listen: 'استمع',
  record: 'سجّل',
  stop: 'أوقف',
  playModel: 'شغّل النموذج',
  playMine: 'شغّل محاولتي',
  selfScore: 'قيّم محاولتك',
  nextPhrase: 'العبارة التالية',
  retry: 'حاول مجدداً',
  noAttempt: 'سجّل محاولة أولاً',
  packTravel: 'السفر',
  packWork: 'العمل',
  packDaily: 'الحياة اليومية',
  packArabic: 'العربية للناطقين بالإنجليزية',
  ofPhrases: 'من',
  dayLimitReached: 'بلغت حد التدريب اليومي — انتقل إلى Pro لتدريب غير محدود.',
  goPro: 'انتقل إلى Pro',
  tryFreeTrial: 'ابدأ التجربة المجانية',
  maybeLater: 'لاحقاً',
  signInLater: 'تُستعاد المشتريات تلقائياً',
  attemptsLeft: 'محاولة متبقية اليوم',
  weekly: 'أسبوع',
};

export type Lang = 'en' | 'ar';
export type Strings = typeof en;

let lang: Lang = I18nManager.isRTL ? 'ar' : 'en';

export function setLang(l: Lang) {
  lang = l;
  const rtl = l === 'ar';
  if (I18nManager.isRTL !== rtl) {
    I18nManager.forceRTL(rtl);
    // v1 sets UI language at onboarding; live toggle is a launch concern.
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
