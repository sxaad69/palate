import { I18nManager } from 'react-native';

// Minimal dictionary — ponytail: full i18n framework is overkill for v1.
// Add keys here as screens need them; English is the fallback.
const en = {
  appName: 'MeetBrief',
  tagline: 'Record. Recap. Follow through.',
  meetings: 'Meetings',
  record: 'Record',
  stats: 'Stats',
  profile: 'Profile',
  continue: 'Continue',
  getStarted: 'Get started',
  cancel: 'Cancel',
  delete: 'Delete',
  save: 'Save',
  done: 'Done',
  edit: 'Edit',
  ok: 'OK',
  close: 'Close',
  copy: 'Copy',
  copied: 'Copied to clipboard',
  share: 'Share',

  // Onboarding
  ob1Title: 'Never miss a detail',
  ob1Body: 'Hit record when the meeting starts. MeetBrief captures high-quality audio right on your phone — no bots, no invites, no accounts.',
  ob2Title: 'Actions, not walls of text',
  ob2Body: 'Every meeting ends with a checkable action list and a one-tap share pack. Optional: track what the meeting costs you per hour.',
  ob3Title: 'Private by design',
  ob3Body: 'Recordings stay on this device. Nothing uploads, nothing streams to a cloud. Your conversations are yours.',
  micRationale: 'MeetBrief needs microphone access to record your meetings. Audio never leaves this device.',
  allowMic: 'Allow microphone access',
  micGranted: 'Microphone ready',
  micDenied: 'Microphone access was denied. You can enable it later in system settings.',
  language: 'Language',

  // Meetings list
  searchPlaceholder: 'Search meetings…',
  emptyTitle: 'No meetings yet',
  emptyBody: 'Record your first meeting and MeetBrief will keep the recap and action items here.',
  recordNow: 'Record a meeting',
  deleteMeeting: 'Delete meeting?',
  deleteMeetingBody: 'The recording and all its notes will be permanently removed from this device.',
  actionsCount: 'actions',
  actionsDoneCount: 'done',

  // Record screen
  meetingTitle: 'Meeting title',
  titlePlaceholder: 'e.g. Weekly sync with Acme',
  hourlyRate: 'Hourly rate',
  ratePlaceholder: '0',
  costTimer: 'Meeting cost timer',
  costTimerHelp: 'Shows what this meeting costs as it runs.',
  tapToStart: 'Tap to start recording',
  recording: 'Recording',
  paused: 'Paused',
  pause: 'Pause',
  resume: 'Resume',
  stop: 'Stop & save',
  saving: 'Saving…',
  estCost: 'Est. cost',
  free: 'Free',
  micUnavailable: 'Microphone unavailable on this device.',
  maxDurationNote: 'Free plan: recordings up to 30 min',
  limitTitle: 'Monthly limit reached',
  limitBody: 'The free plan includes 5 meetings per month. Upgrade for unlimited meetings and longer recordings.',
  goPro: 'Go Pro',

  // Meeting detail
  summary: 'Summary',
  regenerate: 'Regenerate',
  actionItems: 'Action items',
  addAction: 'Add action item',
  actionPlaceholder: 'e.g. Send the proposal by Friday',
  notes: 'Notes',
  notesPlaceholder: 'Jot down anything the recap missed…',
  transcript: 'Transcript',
  transcriptPlaceholder: 'Paste a transcript here, or wait for auto-transcription (coming soon).',
  transcriptComing: 'Auto-transcription is coming soon — the summary above is built from your notes and action items.',
  playback: 'Playback',
  noAudio: 'No audio saved for this meeting.',
  sharePack: 'Share recap',
  deleteAction: 'Delete action item?',

  // Stats
  meetingsRecorded: 'Meetings recorded',
  hoursRecorded: 'Hours recorded',
  actionsCompleted: 'Actions completed',
  thisMonth: 'This month',
  trackedCost: 'Tracked meeting cost',
  statsEmpty: 'Stats appear after your first recording.',

  // Profile
  appearance: 'Appearance',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  defaultRate: 'Default hourly rate',
  defaultRateHelp: 'Pre-fills the cost timer on the record screen.',
  plan: 'Plan',
  freePlan: 'Free — 5 meetings/month',
  proPlan: 'Pro — unlimited',
  upgrade: 'Upgrade to Pro',
  privacyTitle: 'Your data stays yours',
  privacyBody: 'Recordings, transcripts and notes are stored only on this device. MeetBrief has no account system and sends your audio nowhere.',
  version: 'Version',

  // Paywall
  paywallTitle: 'MeetBrief Pro',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  pwUnlimited: 'Unlimited meetings',
  pwLonger: 'Recordings longer than 30 min',
  pwExport: 'Export audio + full share packs',
  pwSupport: 'Support indie development',
  subscribe: 'Start free trial',
  priceLoading: 'Loading price…',
  purchaseError: 'Purchase could not be completed. Please try again.',
  purchaseNote: 'Payment is handled by Google Play. The free trial is configured on the subscription product.',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'MeetBrief',
  tagline: 'سجّل. لخّص. تابع.',
  meetings: 'الاجتماعات',
  record: 'تسجيل',
  stats: 'الإحصائيات',
  profile: 'الحساب',
  continue: 'متابعة',
  getStarted: 'ابدأ',
  cancel: 'إلغاء',
  delete: 'حذف',
  save: 'حفظ',
  done: 'تم',
  edit: 'تعديل',
  ok: 'حسنًا',
  close: 'إغلاق',
  copy: 'نسخ',
  copied: 'تم النسخ إلى الحافظة',
  share: 'مشاركة',

  ob1Title: 'لا يفوتك أي تفصيل',
  ob1Body: 'اضغط تسجيل عند بدء الاجتماع. يلتقط MeetBrief صوتًا عالي الجودة على هاتفك مباشرة — بلا روبوتات ولا دعوات ولا حسابات.',
  ob2Title: 'مهام، لا جدران نصية',
  ob2Body: 'ينتهي كل اجتماع بقائمة مهام قابلة للتحديد وحزمة مشاركة بنقرة واحدة. اختياريًا: تتبّع تكلفة الاجتماع بالساعة.',
  ob3Title: 'خصوصية بالتصميم',
  ob3Body: 'تبقى التسجيلات على هذا الجهاز. لا شيء يُرفع ولا شيء يُبث إلى سحابة. محادثاتك ملك لك.',
  micRationale: 'يحتاج MeetBrief إلى إذن الميكروفون لتسجيل اجتماعاتك. لا يغادر الصوت هذا الجهاز أبدًا.',
  allowMic: 'السماح بالوصول إلى الميكروفون',
  micGranted: 'الميكروفون جاهز',
  micDenied: 'تم رفض إذن الميكروفون. يمكنك تفعيله لاحقًا من إعدادات النظام.',
  language: 'اللغة',

  searchPlaceholder: 'ابحث في الاجتماعات…',
  emptyTitle: 'لا اجتماعات بعد',
  emptyBody: 'سجّل اجتماعك الأول وسيحتفظ MeetBrief بالملخص والمهام هنا.',
  recordNow: 'سجّل اجتماعًا',
  deleteMeeting: 'حذف الاجتماع؟',
  deleteMeetingBody: 'سيتم حذف التسجيل وجميع الملاحظات نهائيًا من هذا الجهاز.',
  actionsCount: 'مهام',
  actionsDoneCount: 'منجزة',

  meetingTitle: 'عنوان الاجتماع',
  titlePlaceholder: 'مثال: الاجتماع الأسبوعي مع أكمي',
  hourlyRate: 'الأجر بالساعة',
  ratePlaceholder: '0',
  costTimer: 'مؤقت تكلفة الاجتماع',
  costTimerHelp: 'يعرض تكلفة الاجتماع أثناء انعقاده.',
  tapToStart: 'اضغط لبدء التسجيل',
  recording: 'جارٍ التسجيل',
  paused: 'متوقف مؤقتًا',
  pause: 'إيقاف مؤقت',
  resume: 'استئناف',
  stop: 'إيقاف وحفظ',
  saving: 'جارٍ الحفظ…',
  estCost: 'التكلفة التقديرية',
  free: 'مجاني',
  micUnavailable: 'الميكروفون غير متاح على هذا الجهاز.',
  maxDurationNote: 'الخطة المجانية: تسجيل حتى ٣٠ دقيقة',
  limitTitle: 'بلغت الحد الشهري',
  limitBody: 'تشمل الخطة المجانية ٥ اجتماعات شهريًا. رقِّ للاجتماعات غير المحدودة والتسجيلات الأطول.',
  goPro: 'الترقية إلى Pro',

  summary: 'الملخص',
  regenerate: 'إعادة توليد',
  actionItems: 'المهام',
  addAction: 'إضافة مهمة',
  actionPlaceholder: 'مثال: إرسال العرض بحلول الجمعة',
  notes: 'ملاحظات',
  notesPlaceholder: 'دوّن أي شيء فاته الملخص…',
  transcript: 'النص المفرّغ',
  transcriptPlaceholder: 'الصق النص المفرّغ هنا، أو انتظر التفريغ التلقائي (قريبًا).',
  transcriptComing: 'التفريغ التلقائي قادم قريبًا — الملخص أعلاه مبني على ملاحظاتك ومهامك.',
  playback: 'التشغيل',
  noAudio: 'لا يوجد صوت محفوظ لهذا الاجتماع.',
  sharePack: 'مشاركة الملخص',
  deleteAction: 'حذف المهمة؟',

  meetingsRecorded: 'اجتماعات مسجلة',
  hoursRecorded: 'ساعات مسجلة',
  actionsCompleted: 'مهام منجزة',
  thisMonth: 'هذا الشهر',
  trackedCost: 'تكلفة الاجتماعات المتتبعة',
  statsEmpty: 'تظهر الإحصائيات بعد أول تسجيل.',

  appearance: 'المظهر',
  themeLight: 'فاتح',
  themeDark: 'داكن',
  themeSystem: 'النظام',
  defaultRate: 'الأجر الافتراضي بالساعة',
  defaultRateHelp: 'يُعبأ تلقائيًا في مؤقت التكلفة بشاشة التسجيل.',
  plan: 'الخطة',
  freePlan: 'مجانية — ٥ اجتماعات شهريًا',
  proPlan: 'Pro — غير محدودة',
  upgrade: 'الترقية إلى Pro',
  privacyTitle: 'بياناتك ملكك',
  privacyBody: 'تُخزّن التسجيلات والنصوص والملاحظات على هذا الجهاز فقط. لا نظام حسابات في MeetBrief ولا يُرسل صوتك إلى أي مكان.',
  version: 'الإصدار',

  paywallTitle: 'MeetBrief Pro',
  paywallSubtitle: 'خطة أسبوعية · تجربة مجانية · إلغاء في أي وقت',
  pwUnlimited: 'اجتماعات غير محدودة',
  pwLonger: 'تسجيلات أطول من ٣٠ دقيقة',
  pwExport: 'تصدير الصوت وحزم المشاركة الكاملة',
  pwSupport: 'دعم التطوير المستقل',
  subscribe: 'ابدأ التجربة المجانية',
  priceLoading: 'جارٍ تحميل السعر…',
  purchaseError: 'تعذّر إتمام الشراء. حاول مجددًا.',
  purchaseNote: 'تتم معالجة الدفع عبر Google Play. التجربة المجانية مضبوطة على منتج الاشتراك.',
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
