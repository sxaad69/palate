import { I18nManager } from 'react-native';

// Minimal dictionary — ponytail: full i18n framework is overkill for v1.
// Add keys here as screens need them; English is the fallback.
const en = {
  appName: 'ModestFit',
  tagline: 'Your modest wardrobe, planned',
  continue: 'Continue',
  start: 'Get started',
  back: 'Back',
  cancel: 'Cancel',
  save: 'Save',
  done: 'Done',
  add: 'Add',
  close: 'Close',
  delete: 'Delete',
  search: 'Search',
  retry: 'Retry',
  free: 'Free',
  pro: 'Pro',

  // Onboarding
  onb1Title: 'Catalog your wardrobe',
  onb1Desc: 'Add your abayas, hijabs, skirts and more — with coverage details that matter to you.',
  onb2Title: 'Plan outfits by occasion',
  onb2Desc: 'Build outfits from your own pieces and plan the week ahead: work, weddings, travel.',
  onb3Title: 'Hijab pairing, done for you',
  onb3Desc: 'Every outfit gets hijab suggestions from your collection, matched by color harmony.',
  langPrompt: 'Choose your language',
  modestyTitle: 'Your modesty preferences',
  modestyDesc: 'The outfit checker will flag any combination that falls short of these.',
  prefSleeve: 'Minimum sleeve length',
  prefHem: 'Minimum hem length',
  prefSheer: 'Fabric opacity',
  sleeve_short: 'Short sleeves',
  sleeve_threeQuarter: 'Three-quarter',
  sleeve_long: 'Long sleeves',
  hem_knee: 'Knee length',
  hem_midi: 'Midi',
  hem_maxi: 'Maxi',
  hem_floor: 'Floor length',
  sheer_opaqueOnly: 'Opaque only',
  sheer_allowSemi: 'Allow semi-sheer',

  // Categories & occasions
  cat_abaya: 'Abayas',
  cat_hijab: 'Hijabs',
  cat_skirt: 'Skirts',
  cat_trousers: 'Trousers',
  cat_top: 'Tops',
  cat_dress: 'Dresses',
  cat_outerwear: 'Outerwear',
  occ_daily: 'Daily',
  occ_work: 'Work',
  occ_wedding: 'Wedding',
  occ_travel: 'Travel',
  occ_evening: 'Evening',

  // Tabs
  tab_wardrobe: 'Wardrobe',
  tab_outfits: 'Outfits',
  tab_planner: 'Planner',
  tab_suggest: 'Ideas',
  tab_profile: 'Profile',

  // Wardrobe
  wardrobeTitle: 'My Wardrobe',
  wardrobeSearch: 'Search pieces…',
  addPiece: 'Add piece',
  starterIdeas: 'Starter ideas',
  emptyWardrobe: 'Your wardrobe is empty',
  emptyWardrobeDesc: 'Add your first piece — or tap + on a starter idea to make it yours.',
  addToWardrobe: 'Add to wardrobe',
  freeLimitTitle: 'Wardrobe full',
  freeLimitDesc: 'The free plan holds 20 pieces. Go Pro for an unlimited wardrobe.',
  goPro: 'Go Pro',
  wears: 'wears',

  // Add piece form
  pieceName: 'Name',
  pieceNamePh: 'e.g. Black linen abaya',
  pieceCategory: 'Category',
  pieceColor: 'Color',
  pieceSleeve: 'Sleeve length',
  pieceHem: 'Hem length',
  pieceOpacity: 'Opacity',
  piecePhoto: 'Photo',
  pickPhoto: 'Add photo',
  changePhoto: 'Change photo',
  sleeve_sleeveless: 'Sleeveless',
  sleeve_na: 'Not applicable',
  hem_short: 'Short',
  opacity_opaque: 'Opaque',
  opacity_semiSheer: 'Semi-sheer',
  opacity_sheer: 'Sheer',

  // Outfits
  outfitsTitle: 'My Outfits',
  createOutfit: 'New outfit',
  outfitName: 'Outfit name',
  outfitNamePh: 'e.g. Friday work look',
  selectPieces: 'Select pieces',
  occasionLabel: 'Occasion',
  modestyOk: 'Meets your modesty preferences',
  modestyFail: 'Needs attention',
  emptyOutfits: 'No outfits yet',
  emptyOutfitsDesc: 'Combine pieces from your wardrobe into saved outfits.',

  // Planner
  plannerTitle: 'Week Planner',
  pickOutfit: 'Choose outfit',
  noOutfit: 'No outfit planned',
  markWorn: 'Mark worn',
  worn: 'Worn',
  planLockedTitle: 'Planner is Pro',
  planLockedDesc: 'Plan your week and track what you wear with ModestFit Pro.',
  weatherNote: 'Weather is manual in this version — dress for the day you see outside.',

  // Suggestions
  suggestTitle: 'Shop your closet',
  suggestDesc: 'Outfit ideas built only from pieces you own.',
  generate: 'Generate ideas',
  regenerate: 'Shuffle',
  hijabPairing: 'Hijab pairing',
  noSuggestions: 'Not enough pieces',
  noSuggestionsDesc: 'Add at least one base piece and one hijab to get ideas.',
  saveOutfit: 'Save as outfit',
  bestMatch: 'Best match',

  // Insights
  insightsTitle: 'Wardrobe insights',
  mostWorn: 'Most worn',
  neverWorn: 'Never worn',
  capsuleTitle: 'Capsule score',
  piecesLabel: 'pieces',
  outfitsLabel: 'outfits',
  insightsLockedTitle: 'Insights are Pro',
  insightsLockedDesc: 'See your most-worn pieces and capsule score with ModestFit Pro.',
  noWears: 'Mark outfits as worn in the Planner to build your stats.',

  // Profile
  profileTitle: 'Profile',
  appearance: 'Appearance',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  language: 'Language',
  modestyPrefs: 'Modesty preferences',
  yourPlan: 'Your plan',
  freePlan: 'Free plan',
  proPlan: 'ModestFit Pro',
  upgrade: 'Upgrade to Pro',
  managePlan: 'Manage subscription',

  // Paywall
  paywallTitle: 'ModestFit Pro',
  paywallSubtitle: 'Weekly plan · free trial · cancel anytime',
  proBullet1: 'Unlimited wardrobe pieces',
  proBullet2: '7-day outfit planner',
  proBullet3: 'Wardrobe insights & capsule score',
  subscribe: 'Start free trial',
  restore: 'Restore purchase',
  cancelAnytime: 'Cancel anytime in Google Play',
  termsNote: 'Payment is charged to your Google Play account after the free trial unless cancelled.',
  alreadyPro: 'You are Pro',
} as const;

const ar: Record<keyof typeof en, string> = {
  appName: 'ModestFit',
  tagline: 'خزانة ملابسك المحتشمة، مخططة',
  continue: 'متابعة',
  start: 'ابدئي',
  back: 'رجوع',
  cancel: 'إلغاء',
  save: 'حفظ',
  done: 'تم',
  add: 'إضافة',
  close: 'إغلاق',
  delete: 'حذف',
  search: 'بحث',
  retry: 'إعادة المحاولة',
  free: 'مجاني',
  pro: 'Pro',

  onb1Title: 'وثّقي خزانتك',
  onb1Desc: 'أضيفي عباياتك وحجاباتك وتنانيرك وغيرها — مع تفاصيل التغطية التي تهمك.',
  onb2Title: 'خططي إطلالاتك حسب المناسبة',
  onb2Desc: 'ركّبي إطلالات من قطعك الخاصة وخططي للأسبوع: عمل، أفراح، سفر.',
  onb3Title: 'تنسيق الحجاب جاهز لك',
  onb3Desc: 'كل إطلالة تحصل على اقتراحات حجاب من مجموعتك، متناسقة بالألوان.',
  langPrompt: 'اختاري لغتك',
  modestyTitle: 'تفضيلات الاحتشام',
  modestyDesc: 'فاحص الإطلالات سينبهك لأي تركيبة لا تحقق هذه التفضيلات.',
  prefSleeve: 'أقل طول للأكمام',
  prefHem: 'أقل طول للتنورة/الفستان',
  prefSheer: 'شفافية القماش',
  sleeve_short: 'أكمام قصيرة',
  sleeve_threeQuarter: 'أكمام ثلاثة أرباع',
  sleeve_long: 'أكمام طويلة',
  hem_knee: 'بطول الركبة',
  hem_midi: 'ميدي',
  hem_maxi: 'ماكسي',
  hem_floor: 'بطول الأرض',
  sheer_opaqueOnly: 'غير شفاف فقط',
  sheer_allowSemi: 'السماح بشبه الشفاف',

  cat_abaya: 'عبايات',
  cat_hijab: 'حجابات',
  cat_skirt: 'تنانير',
  cat_trousers: 'بناطيل',
  cat_top: 'بلوزات',
  cat_dress: 'فساتين',
  cat_outerwear: 'معاطف',
  occ_daily: 'يومي',
  occ_work: 'عمل',
  occ_wedding: 'زفاف',
  occ_travel: 'سفر',
  occ_evening: 'مساء',

  tab_wardrobe: 'الخزانة',
  tab_outfits: 'الإطلالات',
  tab_planner: 'المخطط',
  tab_suggest: 'أفكار',
  tab_profile: 'الحساب',

  wardrobeTitle: 'خزانتي',
  wardrobeSearch: 'ابحثي في القطع…',
  addPiece: 'إضافة قطعة',
  starterIdeas: 'أفكار جاهزة',
  emptyWardrobe: 'خزانتك فارغة',
  emptyWardrobeDesc: 'أضيفي أول قطعة — أو اضغطي + على فكرة جاهزة لتملكّيها.',
  addToWardrobe: 'أضيفي للخزانة',
  freeLimitTitle: 'الخزانة ممتلئة',
  freeLimitDesc: 'الخطة المجانية تتسع لـ 20 قطعة. انتقلي إلى Pro لخزانة بلا حدود.',
  goPro: 'انتقلي إلى Pro',
  wears: 'مرة',

  pieceName: 'الاسم',
  pieceNamePh: 'مثال: عباية كتان سوداء',
  pieceCategory: 'الفئة',
  pieceColor: 'اللون',
  pieceSleeve: 'طول الأكمام',
  pieceHem: 'طول القطعة',
  pieceOpacity: 'الشفافية',
  piecePhoto: 'الصورة',
  pickPhoto: 'إضافة صورة',
  changePhoto: 'تغيير الصورة',
  sleeve_sleeveless: 'بدون أكمام',
  sleeve_na: 'لا ينطبق',
  hem_short: 'قصير',
  opacity_opaque: 'غير شفاف',
  opacity_semiSheer: 'شبه شفاف',
  opacity_sheer: 'شفاف',

  outfitsTitle: 'إطلالاتي',
  createOutfit: 'إطلالة جديدة',
  outfitName: 'اسم الإطلالة',
  outfitNamePh: 'مثال: إطلالة العمل',
  selectPieces: 'اختاري القطع',
  occasionLabel: 'المناسبة',
  modestyOk: 'تحقق تفضيلات الاحتشام',
  modestyFail: 'تحتاج مراجعة',
  emptyOutfits: 'لا إطلالات بعد',
  emptyOutfitsDesc: 'ركّبي قطع خزانتك في إطلالات محفوظة.',

  plannerTitle: 'مخطط الأسبوع',
  pickOutfit: 'اختاري إطلالة',
  noOutfit: 'لا إطلالة مخططة',
  markWorn: 'سجّلي اللبس',
  worn: 'تم اللبس',
  planLockedTitle: 'المخطط حصري لـ Pro',
  planLockedDesc: 'خططي أسبوعك وتتبعي ما تلبسينه مع ModestFit Pro.',
  weatherNote: 'الطقس يدوي في هذه النسخة — البسي حسب ما ترينه خارجاً.',

  suggestTitle: 'تسوّقي من خزانتك',
  suggestDesc: 'أفكار إطلالات من قطع تملكينها فقط.',
  generate: 'ولّدي أفكاراً',
  regenerate: 'خلط',
  hijabPairing: 'تنسيق الحجاب',
  noSuggestions: 'قطع غير كافية',
  noSuggestionsDesc: 'أضيفي قطعة أساسية وحجاباً واحداً على الأقل للحصول على أفكار.',
  saveOutfit: 'احفظي كإطلالة',
  bestMatch: 'أفضل تطابق',

  insightsTitle: 'تحليلات الخزانة',
  mostWorn: 'الأكثر لبساً',
  neverWorn: 'لم تُلبس أبداً',
  capsuleTitle: 'نتيجة الكبسولة',
  piecesLabel: 'قطعة',
  outfitsLabel: 'إطلالة',
  insightsLockedTitle: 'التحليلات حصرية لـ Pro',
  insightsLockedDesc: 'شاهدي أكثر قطعك لبساً ونتيجة الكبسولة مع ModestFit Pro.',
  noWears: 'سجّلي اللبس من المخطط لبناء إحصاءاتك.',

  profileTitle: 'الحساب',
  appearance: 'المظهر',
  themeLight: 'فاتح',
  themeDark: 'داكن',
  themeSystem: 'النظام',
  language: 'اللغة',
  modestyPrefs: 'تفضيلات الاحتشام',
  yourPlan: 'خطتك',
  freePlan: 'الخطة المجانية',
  proPlan: 'ModestFit Pro',
  upgrade: 'الترقية إلى Pro',
  managePlan: 'إدارة الاشتراك',

  paywallTitle: 'ModestFit Pro',
  paywallSubtitle: 'اشتراك أسبوعي · تجربة مجانية · إلغاء في أي وقت',
  proBullet1: 'قطع خزانة بلا حدود',
  proBullet2: 'مخطط إطلالات لـ 7 أيام',
  proBullet3: 'تحليلات الخزانة ونتيجة الكبسولة',
  subscribe: 'ابدئي التجربة المجانية',
  restore: 'استعادة الشراء',
  cancelAnytime: 'إلغاء في أي وقت من Google Play',
  termsNote: 'يُخصم الدفع من حساب Google Play بعد التجربة المجانية ما لم يتم الإلغاء.',
  alreadyPro: 'أنت مشتركة في Pro',
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
