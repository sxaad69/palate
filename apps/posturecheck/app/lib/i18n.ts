import { I18nManager } from 'react-native';

// Minimal dictionary — ponytail: full i18n framework is overkill for v1.
// English is the fallback; every key exists in both languages.
const en = {
  appName: 'StraightUp',
  tagline: 'Check your posture. Fix the slouch.',
  continue: 'Continue',
  back: 'Back',
  done: 'Done',
  cancel: 'Cancel',
  close: 'Close',
  delete: 'Delete',
  retry: 'Retry',
  on: 'On',
  off: 'Off',
  getStarted: 'Get started',

  home: 'Home',
  exercises: 'Exercises',
  history: 'History',
  profile: 'Profile',

  // Onboarding
  obLangTitle: 'Choose your language',
  ob1Title: 'Your desk is wrecking your posture',
  ob1Body:
    'Hours of sitting pull your head forward and round your shoulders. StraightUp measures it from a single side-profile photo — and shows you exactly what to fix.',
  ob2Title: 'Place the markers, we do the math',
  ob2Body:
    'No fake AI. You drag 5 markers onto your ear, shoulder, hip, knee and ankle. StraightUp computes real angles from your markers and scores them transparently.',
  ob3Title: 'Fix what is actually off',
  ob3Body:
    'Each weak angle gets targeted exercises — chin tucks for forward head, wall angels for rounded shoulders — not generic “sit up straight” advice.',
  ob4Title: 'Camera stays on your phone',
  ob4Body:
    'Photos are analyzed on this device and never uploaded. You can also pick an existing photo from your gallery instead of using the camera.',
  ob5Title: 'How your score is computed',
  ob5B1: 'You place 5 markers: ear, shoulder, hip, knee, ankle.',
  ob5B2: 'We measure 4 angles from your markers — real geometry, shown on screen.',
  ob5B3: 'Each angle is rated good, watch, or poor against clear thresholds.',
  ob5B4: 'Score starts at 100; each weak angle deducts points. The formula is shown with every result.',

  // Home
  latestScore: 'Latest posture score',
  noChecksYet: 'No checks yet',
  noChecksBody: 'Take a side-profile photo to get your first posture score.',
  newCheck: 'New check',
  checksLeft: 'free checks left this month',
  freeChecksLeftOne: '1 free check left this month',
  goPro: 'Go Pro',
  avgScore: 'Avg score',
  totalChecks: 'Checks',
  exercisesDone: 'Exercises done',
  remindersCardTitle: 'Posture nudges',
  remindersCardBody: 'Gentle “unhunch” reminders during the day.',
  howItWorks: 'How scoring works',
  seeExercises: 'Browse exercises',

  // Capture
  captureTitle: 'Take your photo',
  guideTitle: 'Line yourself up',
  guide1: 'Stand in side profile, full body in frame.',
  guide2: 'Phone at hip height, about 3 meters away.',
  guide3: 'Stand naturally — do not pose or suck in.',
  guide4: 'Plain background and good light help a lot.',
  startCamera: 'Start camera',
  chooseGallery: 'Choose from gallery',
  cameraBlockedTitle: 'Camera permission needed',
  cameraBlockedBody: 'StraightUp needs camera access to take your posture photo. You can also pick a photo from your gallery.',
  tapShutter: 'Tap the shutter to capture',
  retake: 'Retake',
  usePhoto: 'Use this photo',

  // Landmarks
  lmTitle: 'Place the markers',
  lmBody: 'Drag each dot onto the right spot on your body. The angles are computed from these positions.',
  lmEar: 'Ear',
  lmShoulder: 'Shoulder',
  lmHip: 'Hip',
  lmKnee: 'Knee',
  lmAnkle: 'Ankle',
  lmReset: 'Reset',
  lmAnalyze: 'Analyze posture',
  lmHonest: 'Angles are computed from your marker positions — no AI involved.',

  // Results
  resultsTitle: 'Your posture report',
  observations: 'Observations',
  recommended: 'Recommended exercises',
  formulaTitle: 'How this score was computed',
  formulaBody:
    'Score starts at 100. Forward head: −12 (watch) / −25 (poor). Shoulder lean: −10 / −20. Hip shift: −10 / −20. Knee bend: −7 / −15. Thresholds are shown under each angle.',
  doneBtn: 'Done',
  newCheckAgain: 'New check',
  sevGood: 'Good',
  sevWatch: 'Watch',
  sevPoor: 'Poor',

  angleHeadForward: 'Forward head',
  angleShoulderLean: 'Shoulder lean',
  angleKneeAngle: 'Knee bend',
  angleHipOffset: 'Hip shift',

  obs_headForward_good_t: 'Head stacked over shoulders',
  obs_headForward_good_d: 'Your ear sits almost directly above your shoulder. Keep it up.',
  obs_headForward_watch_t: 'Mild forward head',
  obs_headForward_watch_d: 'Your head drifts slightly ahead of your shoulders — classic desk-neck territory.',
  obs_headForward_poor_t: 'Forward head posture',
  obs_headForward_poor_d: 'Your head sits well ahead of your shoulders. This loads the neck heavily — chin tucks will help most.',
  obs_shoulderLean_good_t: 'Shoulders stacked over hips',
  obs_shoulderLean_good_d: 'Your shoulder line sits right above your hips. Solid upright base.',
  obs_shoulderLean_watch_t: 'Slight shoulder rounding',
  obs_shoulderLean_watch_d: 'Your shoulders lean a little off the hip line — early rounding.',
  obs_shoulderLean_poor_t: 'Rounded shoulders',
  obs_shoulderLean_poor_d: 'Your shoulders sit clearly ahead of your hips. Chest-opening work is the priority.',
  obs_kneeAngle_good_t: 'Knees nearly straight',
  obs_kneeAngle_good_d: 'Your standing leg line is close to straight. Good foundation.',
  obs_kneeAngle_watch_t: 'Slight knee bend',
  obs_kneeAngle_watch_d: 'Your knees bend a little when standing — check your stance and footwear.',
  obs_kneeAngle_poor_t: 'Noticeable knee bend',
  obs_kneeAngle_poor_d: 'Your knees bend clearly. This often pairs with hips pushed forward.',
  obs_hipOffset_good_t: 'Hips over ankles',
  obs_hipOffset_good_d: 'Your hips sit right above your ankles. Balanced stance.',
  obs_hipOffset_watch_t: 'Hips slightly shifted',
  obs_hipOffset_watch_d: 'Your hips drift a little off the ankle line.',
  obs_hipOffset_poor_t: 'Hips pushed forward',
  obs_hipOffset_poor_d: 'Your hips sit well ahead of your ankles — the classic “desk lean”. Glute and hip-flexor work helps.',

  // Exercises
  exLibrary: 'Exercise library',
  exRecommended: 'For you',
  exMarkDone: 'Mark done',
  exDone: 'Done',
  exMin: 'min',
  exTargets: 'Targets',

  // History
  histEmpty: 'No checks yet',
  histEmptyBody: 'Your posture timeline will appear here after your first check.',
  comparePrev: 'vs previous',
  deleteCheck: 'Delete this check?',
  deleteCheckBody: 'The photo and its analysis will be removed from this device.',
  noPrev: 'First check — this is your baseline.',

  // Profile
  appearance: 'Appearance',
  appearanceLight: 'Light',
  appearanceDark: 'Dark',
  appearanceSystem: 'System',
  language: 'Language',
  reminders: 'Posture nudges',
  remindersBody: 'Local reminders only — nothing leaves your phone.',
  reminderInterval: 'Remind me every',
  interval30: '30 minutes',
  interval60: '1 hour',
  interval120: '2 hours',
  paywallEntry: 'StraightUp Pro',
  paywallEntryBody: 'Unlimited checks, full history, exercise programs.',
  medicalTitle: 'Wellness tool',
  medicalBody:
    'StraightUp is a wellness tool, not a medical device. Scores and exercises are for general awareness and are not a diagnosis. See a clinician for pain or injury.',
  appVersion: 'Version 1.0.0',

  // Paywall — weekly + free trial (deep-dive LTV rule; trial configured in Play Console)
  paywallTitle: 'Stand taller, every week',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  perk1: 'Unlimited posture checks',
  perk2: 'Full history & progress timeline',
  perk3: 'Guided exercise programs',
  startTrial: 'Start free trial',
  paywallNote: 'Free: 3 checks per month. Pro unlocks everything.',

  // Free-limit gate
  limitTitle: 'Monthly free checks used',
  limitBody: 'You get 3 free checks per month. Go Pro for unlimited checks and full history.',
  limitCta: 'See Pro',

  // Notifications
  notifTitle: 'Un-hunch check',
  notifBody: 'Roll your shoulders back, tuck your chin, stand tall for 30 seconds.',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'StraightUp',
  tagline: 'افحص وضعيتك. أصلح الانحناء.',
  continue: 'متابعة',
  back: 'رجوع',
  done: 'تم',
  cancel: 'إلغاء',
  close: 'إغلاق',
  delete: 'حذف',
  retry: 'إعادة المحاولة',
  on: 'مفعّل',
  off: 'مغلق',
  getStarted: 'ابدأ',

  home: 'الرئيسية',
  exercises: 'التمارين',
  history: 'السجل',
  profile: 'الحساب',

  obLangTitle: 'اختر لغتك',
  ob1Title: 'مكتبك يدمّر وضعيتك',
  ob1Body:
    'ساعات الجلوس تسحب رأسك للأمام وتقوّس كتفيك. يقيس StraightUp ذلك من صورة جانبية واحدة — ويوضح لك بالضبط ما يجب إصلاحه.',
  ob2Title: 'ضع العلامات، ونحن نحسب',
  ob2Body:
    'لا ذكاء اصطناعي مزيف. تسحب 5 علامات إلى أذنك وكتفك ووركك وركبتك وكاحلك. يحسب التطبيق زوايا حقيقية من علاماتك ويسجّلها بشفافية.',
  ob3Title: 'أصلح ما هو ضعيف فعلاً',
  ob3Body:
    'كل زاوية ضعيفة تحصل على تمارين مستهدفة — تمارين الذقن للرأس المتقدم، وملائكة الحائط للأكتاف المستديرة — وليس نصيحة عامة.',
  ob4Title: 'الكاميرا تبقى على هاتفك',
  ob4Body:
    'تُحلَّل الصور على هذا الجهاز ولا تُرفع أبداً. يمكنك أيضاً اختيار صورة موجودة من معرض الصور بدل الكاميرا.',
  ob5Title: 'كيف تُحسب نتيجتك',
  ob5B1: 'تضع 5 علامات: الأذن، الكتف، الورك، الركبة، الكاحل.',
  ob5B2: 'نقيس 4 زوايا من علاماتك — هندسة حقيقية تظهر على الشاشة.',
  ob5B3: 'كل زاوية تُقيَّم: جيدة، راقب، أو ضعيفة — بحدود واضحة.',
  ob5B4: 'تبدأ النتيجة من 100؛ كل زاوية ضعيفة تخصم نقاطاً. المعادلة تُعرض مع كل نتيجة.',

  latestScore: 'أحدث نتيجة للوضعية',
  noChecksYet: 'لا فحوصات بعد',
  noChecksBody: 'التقط صورة جانبية للحصول على أول نتيجة لوضعيتك.',
  newCheck: 'فحص جديد',
  checksLeft: 'فحوصات مجانية متبقية هذا الشهر',
  freeChecksLeftOne: 'فحص مجاني واحد متبقٍ هذا الشهر',
  goPro: 'الترقية',
  avgScore: 'متوسط النتيجة',
  totalChecks: 'الفحوصات',
  exercisesDone: 'تمارين منجزة',
  remindersCardTitle: 'تذكيرات الوضعية',
  remindersCardBody: 'تذكيرات لطيفة لـ"فكّ الانحناء" خلال اليوم.',
  howItWorks: 'كيف تُحسب النتيجة',
  seeExercises: 'تصفح التمارين',

  captureTitle: 'التقط صورتك',
  guideTitle: 'اضبط وقفتك',
  guide1: 'قف بشكل جانبي، والجسم كاملاً داخل الإطار.',
  guide2: 'الهاتف على مستوى الورك، على بعد 3 أمتار تقريباً.',
  guide3: 'قف بشكل طبيعي — لا تتكلف ولا تحبس نفسك.',
  guide4: 'خلفية بسيطة وإضاءة جيدة تساعد كثيراً.',
  startCamera: 'تشغيل الكاميرا',
  chooseGallery: 'اختيار من المعرض',
  cameraBlockedTitle: 'يلزم إذن الكاميرا',
  cameraBlockedBody: 'يحتاج StraightUp إلى الكاميرا لالتقاط صورة وضعيتك. يمكنك أيضاً اختيار صورة من معرض الصور.',
  tapShutter: 'اضغط زر الالتقاط',
  retake: 'إعادة الالتقاط',
  usePhoto: 'استخدام هذه الصورة',

  lmTitle: 'ضع العلامات',
  lmBody: 'اسحب كل نقطة إلى مكانها الصحيح على جسمك. تُحسب الزوايا من هذه المواضع.',
  lmEar: 'الأذن',
  lmShoulder: 'الكتف',
  lmHip: 'الورك',
  lmKnee: 'الركبة',
  lmAnkle: 'الكاحل',
  lmReset: 'إعادة ضبط',
  lmAnalyze: 'تحليل الوضعية',
  lmHonest: 'تُحسب الزوايا من مواضع علاماتك — بدون ذكاء اصطناعي.',

  resultsTitle: 'تقرير وضعيتك',
  observations: 'الملاحظات',
  recommended: 'تمارين مقترحة',
  formulaTitle: 'كيف حُسبت هذه النتيجة',
  formulaBody:
    'تبدأ النتيجة من 100. الرأس المتقدم: −12 (راقب) / −25 (ضعيف). ميل الكتف: −10 / −20. انزياح الورك: −10 / −20. انثناء الركبة: −7 / −15. الحدود موضحة تحت كل زاوية.',
  doneBtn: 'تم',
  newCheckAgain: 'فحص جديد',
  sevGood: 'جيدة',
  sevWatch: 'راقب',
  sevPoor: 'ضعيفة',

  angleHeadForward: 'تقدم الرأس',
  angleShoulderLean: 'ميل الكتف',
  angleKneeAngle: 'انثناء الركبة',
  angleHipOffset: 'انزياح الورك',

  obs_headForward_good_t: 'الرأس فوق الكتفين',
  obs_headForward_good_d: 'أذنك تقع تقريباً فوق كتفك مباشرة. استمر.',
  obs_headForward_watch_t: 'تقدم بسيط للرأس',
  obs_headForward_watch_d: 'رأسك يميل قليلاً أمام كتفيك — منطقة "رقبة المكتب" الكلاسيكية.',
  obs_headForward_poor_t: 'وضعية الرأس المتقدم',
  obs_headForward_poor_d: 'رأسك متقدم بوضوح عن كتفيك. هذا يُحمّل الرقبة كثيراً — تمارين سحب الذقن هي الأنفع.',
  obs_shoulderLean_good_t: 'الكتفان فوق الوركين',
  obs_shoulderLean_good_d: 'خط كتفيك فوق وركيك تماماً. قاعدة مستقيمة قوية.',
  obs_shoulderLean_watch_t: 'تقوس بسيط للكتفين',
  obs_shoulderLean_watch_d: 'كتفاك تميلان قليلاً عن خط الورك — بداية تقوس.',
  obs_shoulderLean_poor_t: 'أكتاف مستديرة',
  obs_shoulderLean_poor_d: 'كتفاك متقدمتان بوضوح عن وركيك. تمارين فتح الصدر هي الأولوية.',
  obs_kneeAngle_good_t: 'الركبتان شبه مستقيمتين',
  obs_kneeAngle_good_d: 'خط ساقك أثناء الوقوف قريب من الاستقامة. أساس جيد.',
  obs_kneeAngle_watch_t: 'انثناء بسيط في الركبة',
  obs_kneeAngle_watch_d: 'ركبتاك تنثنيان قليلاً أثناء الوقوف — راجع وقفتك وحذاءك.',
  obs_kneeAngle_poor_t: 'انثناء واضح في الركبة',
  obs_kneeAngle_poor_d: 'ركبتاك تنثنيان بوضوح. غالباً ما يصاحب ذلك دفع الوركين للأمام.',
  obs_hipOffset_good_t: 'الوركان فوق الكاحلين',
  obs_hipOffset_good_d: 'وركاك فوق كاحليك تماماً. وقفة متوازنة.',
  obs_hipOffset_watch_t: 'انزياح بسيط للوركين',
  obs_hipOffset_watch_d: 'وركاك يميلان قليلاً عن خط الكاحل.',
  obs_hipOffset_poor_t: 'الوركان مدفوعان للأمام',
  obs_hipOffset_poor_d: 'وركاك متقدمان بوضوح عن كاحليك — "انحناء المكتب" الكلاسيكي. تمارين الأرداف وعضلات الورك تساعد.',

  exLibrary: 'مكتبة التمارين',
  exRecommended: 'مقترحة لك',
  exMarkDone: 'إنجاز التمرين',
  exDone: 'منجز',
  exMin: 'دقائق',
  exTargets: 'يستهدف',

  histEmpty: 'لا فحوصات بعد',
  histEmptyBody: 'سيظهر خطك الزمني للوضعية هنا بعد أول فحص.',
  comparePrev: 'مقارنة بالسابق',
  deleteCheck: 'حذف هذا الفحص؟',
  deleteCheckBody: 'ستُحذف الصورة وتحليلها من هذا الجهاز.',
  noPrev: 'أول فحص — هذا هو خط الأساس.',

  appearance: 'المظهر',
  appearanceLight: 'فاتح',
  appearanceDark: 'داكن',
  appearanceSystem: 'النظام',
  language: 'اللغة',
  reminders: 'تذكيرات الوضعية',
  remindersBody: 'تذكيرات محلية فقط — لا شيء يغادر هاتفك.',
  reminderInterval: 'ذكّرني كل',
  interval30: '30 دقيقة',
  interval60: 'ساعة',
  interval120: 'ساعتين',
  paywallEntry: 'StraightUp Pro',
  paywallEntryBody: 'فحوصات غير محدودة، سجل كامل، برامج تمارين.',
  medicalTitle: 'أداة للعافية',
  medicalBody:
    'StraightUp أداة للعافية وليس جهازاً طبياً. النتائج والتمارين للتوعية العامة وليست تشخيصاً. راجع مختصاً عند الألم أو الإصابة.',
  appVersion: 'الإصدار 1.0.0',

  paywallTitle: 'قف باستقامة، كل أسبوع',
  paywallSubtitle: 'اشتراك أسبوعي · تجربة مجانية · إلغاء في أي وقت',
  perk1: 'فحوصات وضعية غير محدودة',
  perk2: 'السجل الكامل والخط الزمني للتقدم',
  perk3: 'برامج تمارين موجهة',
  startTrial: 'ابدأ التجربة المجانية',
  paywallNote: 'المجاني: 3 فحوصات شهرياً. Pro يفتح كل شيء.',

  limitTitle: 'استُنفدت الفحوصات المجانية',
  limitBody: 'تحصل على 3 فحوصات مجانية شهرياً. الترقية تفتح فحوصات غير محدودة والسجل الكامل.',
  limitCta: 'عرض Pro',

  notifTitle: 'تذكير فكّ الانحناء',
  notifBody: 'أرجع كتفيك للخلف، واسحب ذقنك للداخل، وقف باستقامة 30 ثانية.',
} as const;

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
