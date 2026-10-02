import { I18nManager } from 'react-native';

// Minimal dictionary — ponytail: full i18n framework is overkill for v1.
// Add keys here as screens need them; English is the fallback.
const en = {
  appName: 'Fable',
  tagline: 'Stories you breathe through',
  continue: 'Continue',
  start: 'Begin',
  library: 'Library',
  progress: 'Progress',
  profile: 'Profile',
  paywallTitle: 'Unlock every story',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  minutes: 'minutes',
  dayStreak: 'day streak',
  sessions: 'sessions',
  favorites: 'Favorites',
  locked: 'Pro',
  free: 'Free',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'Fable',
  tagline: 'قصص تتنفّس من خلالها',
  continue: 'متابعة',
  start: 'ابدأ',
  library: 'المكتبة',
  progress: 'التقدّم',
  profile: 'الحساب',
  paywallTitle: 'افتح كل القصص',
  paywallSubtitle: 'اشتراك أسبوعي · تجربة مجانية · إلغاء في أي وقت',
  minutes: 'دقيقة',
  dayStreak: 'يوم متتالٍ',
  sessions: 'جلسات',
  favorites: 'المفضلة',
  locked: 'Pro',
  free: 'مجاني',
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
