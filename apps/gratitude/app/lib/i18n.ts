import { I18nManager } from 'react-native';

// Minimal dictionary — ponytail: full i18n framework is overkill for v1.
// Add keys here as screens need them; English is the fallback.
const en = {
  appName: 'ThreeGood',
  tagline: 'Three good things, every day',
  continue: 'Continue',
  begin: 'Begin my ritual',
  slide1Title: 'Three good things',
  slide1Body: 'A 60-second evening ritual from positive psychology: name three good things from your day, and watch your outlook shift.',
  slide2Title: 'How it works',
  slide2b1: '☀ Each day brings 3 fresh prompts across 6 themes',
  slide2b2: '✦ Completed days fill your glow jar with light',
  slide2b3: '✉ Every week becomes a letter you can keep',
  slide3Title: 'Make it yours',
  langLabel: 'Language',
  reminderLabel: 'Daily reminder',
  noReminder: 'No reminder',
  today: 'Today',
  jar: 'Jar',
  history: 'History',
  letter: 'Letter',
  profile: 'Profile',
  todayTitle: "Today's ritual",
  streakDays: 'day streak',
  writePlaceholder: 'I am grateful for…',
  completeRitual: 'Complete the ritual',
  ritualDone: 'Ritual complete',
  ritualDoneSub: 'Your jar glows a little brighter tonight.',
  theme_people: 'People',
  theme_senses: 'Senses',
  theme_smallwins: 'Small wins',
  theme_nature: 'Nature',
  theme_challenges: 'Challenges',
  theme_wonder: 'Wonder',
  jarTitle: 'Glow jar',
  jarSub: 'Every completed day adds light.',
  thisWeek: 'this week',
  totalDays: 'days glowing',
  milestonesTitle: 'Jar themes',
  locked: 'Pro',
  tapToApply: 'Tap an unlocked theme to fill your jar with it',
  jarOf: 'of 7 days',
  historyTitle: 'History',
  noEntries: 'No entries yet. Complete today’s ritual to start your jar.',
  currentWeek: 'This week',
  pastLocked: 'Older weeks are kept for Pro members',
  unlockHistory: 'Unlock full history',
  letterTitle: 'Weekly letter',
  letterSub: 'Your week of gratitude, written back to you.',
  shareLetter: 'Share this letter',
  weekOf: 'Week of',
  archiveTitle: 'Past letters',
  exportAll: 'Export everything',
  lettersLockedNote: 'Past letters are kept for Pro members',
  letterEmpty: 'Complete a few days this week and your letter will write itself.',
  letterIntro: 'Dear me, here is what lit up your week:',
  letterOutro: 'Keep going — the jar remembers.',
  appearance: 'Appearance',
  language: 'Language',
  reminder: 'Reminder',
  paywallTitle: 'Go Pro',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  perk1: 'Unlimited history — every day you ever logged',
  perk2: 'All 6 prompt themes (60 prompts, no repeats)',
  perk3: 'Weekly letter archive, shareable anytime',
  perk4: 'Export your whole journal as text',
  proMember: 'Pro member',
  free: 'Free',
  versionLabel: 'ThreeGood 1.0.0 · local-first · your words never leave this phone',
  notifTitle: 'Time for your three good things ☀',
  notifBody: 'Sixty seconds. Three gratitudes. Your jar is waiting.',
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'ThreeGood',
  tagline: 'ثلاثة أشياء جميلة كل يوم',
  continue: 'متابعة',
  begin: 'ابدأ طقوسي',
  slide1Title: 'ثلاثة أشياء جميلة',
  slide1Body: 'طقوس مسائية من علم النفس الإيجابي تستغرق ٦٠ ثانية: اذكر ثلاثة أشياء جميلة في يومك، وشاهد نظرتك للحياة تتغير.',
  slide2Title: 'كيف يعمل',
  slide2b1: '☀ كل يوم يأتي بثلاثة أسئلة جديدة من ٦ مواضيع',
  slide2b2: '✦ الأيام المكتملة تملأ جرّة التوهج بالنور',
  slide2b3: '✉ كل أسبوع يتحول إلى رسالة تحتفظ بها',
  slide3Title: 'اجعله لك',
  langLabel: 'اللغة',
  reminderLabel: 'تذكير يومي',
  noReminder: 'بدون تذكير',
  today: 'اليوم',
  jar: 'الجرّة',
  history: 'السجل',
  letter: 'الرسالة',
  profile: 'الحساب',
  todayTitle: 'طقوس اليوم',
  streakDays: 'يوم متتالٍ',
  writePlaceholder: 'أنا ممتن لـ…',
  completeRitual: 'أكمل الطقوس',
  ritualDone: 'اكتملت الطقوس',
  ritualDoneSub: 'جرّتك تتوهج الليلة أكثر قليلاً.',
  theme_people: 'أشخاص',
  theme_senses: 'الحواس',
  theme_smallwins: 'انتصارات صغيرة',
  theme_nature: 'الطبيعة',
  theme_challenges: 'التحديات',
  theme_wonder: 'الدهشة',
  jarTitle: 'جرّة التوهج',
  jarSub: 'كل يوم مكتمل يضيف نوراً.',
  thisWeek: 'هذا الأسبوع',
  totalDays: 'يوم متوهج',
  milestonesTitle: 'ألوان الجرّة',
  locked: 'Pro',
  tapToApply: 'اضغط على لون مفتوح لتملأ به جرّتك',
  jarOf: 'من ٧ أيام',
  historyTitle: 'السجل',
  noEntries: 'لا إدخالات بعد. أكمل طقوس اليوم لتبدأ جرّتك.',
  currentWeek: 'هذا الأسبوع',
  pastLocked: 'الأسابيع السابقة محفوظة لأعضاء Pro',
  unlockHistory: 'افتح السجل الكامل',
  letterTitle: 'رسالة الأسبوع',
  letterSub: 'أسبوعك من الامتنان، مكتوباً لك.',
  shareLetter: 'شارك هذه الرسالة',
  weekOf: 'أسبوع',
  archiveTitle: 'الرسائل السابقة',
  exportAll: 'صدّر كل شيء',
  lettersLockedNote: 'الرسائل السابقة محفوظة لأعضاء Pro',
  letterEmpty: 'أكمل بضعة أيام هذا الأسبوع وستكتب رسالتك نفسها.',
  letterIntro: 'عزيزي أنا، هذا ما أضاء أسبوعك:',
  letterOutro: 'واصل — الجرّة تتذكر.',
  appearance: 'المظهر',
  language: 'اللغة',
  reminder: 'التذكير',
  paywallTitle: 'اشترك في Pro',
  paywallSubtitle: 'اشتراك أسبوعي · تجربة مجانية · إلغاء في أي وقت',
  perk1: 'سجل غير محدود — كل يوم سجلته يوماً',
  perk2: 'كل مواضيع الأسئلة الستة (٦٠ سؤالاً بلا تكرار)',
  perk3: 'أرشيف رسائل الأسبوع، قابل للمشاركة دائماً',
  perk4: 'صدّر يومياتك كاملة كنص',
  proMember: 'عضو Pro',
  free: 'مجاني',
  versionLabel: 'ThreeGood 1.0.0 · يعمل محلياً · كلماتك لا تغادر هذا الهاتف',
  notifTitle: 'حان وقت الأشياء الثلاثة الجميلة ☀',
  notifBody: 'ستون ثانية. ثلاثة امتنانات. جرّتك بانتظارك.',
  morning: 'صباحاً',
  afternoon: 'ظهراً',
  evening: 'مساءً',
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
