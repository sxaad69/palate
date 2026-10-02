// Anchor suggestions — existing routines to attach tiny behaviors to.
// The anchor is the whole method: reliable existing routine → tiny behavior.

export interface AnchorSuggestion {
  en: string;
  ar: string;
}

export const ANCHORS: AnchorSuggestion[] = [
  { en: 'brush my teeth', ar: 'أغسل أسناني' },
  { en: 'start the coffee maker', ar: 'أشغّل آلة القهوة' },
  { en: 'sit at my desk', ar: 'أجلس إلى مكتبي' },
  { en: 'get into bed', ar: 'أستلقي في السرير' },
  { en: 'finish lunch', ar: 'أنهي الغداء' },
  { en: 'plug in my phone', ar: 'أوصل هاتفي بالشاحن' },
  { en: 'pour my morning water', ar: 'أسكب ماء الصباح' },
  { en: 'lock the front door', ar: 'أقفل باب البيت' },
  { en: 'start the shower', ar: 'أشغّل الدش' },
  { en: 'put on my shoes', ar: 'ألبس حذائي' },
];

export interface CelebrationOption {
  en: string;
  ar: string;
}

export const CELEBRATIONS: CelebrationOption[] = [
  { en: 'Fist pump', ar: 'أرفع قبضتي' },
  { en: 'Say "That\'s like me!"', ar: 'أقول "هذا يشبهني!"' },
  { en: 'Big smile', ar: 'ابتسامة كبيرة' },
  { en: 'Take a victorious breath', ar: 'آخذ نفساً منتصراً' },
  { en: 'Thumbs up to myself', ar: 'إشارة إعجاب لنفسي' },
  { en: 'Happy dance (3 seconds)', ar: 'رقصة فرح (٣ ثوانٍ)' },
];

export interface RecipeTemplate {
  anchorEn: string;
  anchorAr: string;
  behaviorEn: string;
  behaviorAr: string;
  celebrationEn: string;
  celebrationAr: string;
}

export const TEMPLATES: RecipeTemplate[] = [
  {
    anchorEn: 'brush my teeth',
    anchorAr: 'أغسل أسناني',
    behaviorEn: 'floss one tooth',
    behaviorAr: 'أنظف سناً واحداً بالخيط',
    celebrationEn: 'Fist pump',
    celebrationAr: 'أرفع قبضتي',
  },
  {
    anchorEn: 'start the coffee maker',
    anchorAr: 'أشغّل آلة القهوة',
    behaviorEn: 'take 3 deep breaths',
    behaviorAr: 'آخذ ٣ أنفاس عميقة',
    celebrationEn: 'Big smile',
    celebrationAr: 'ابتسامة كبيرة',
  },
  {
    anchorEn: 'sit at my desk',
    anchorAr: 'أجلس إلى مكتبي',
    behaviorEn: "write today's top priority",
    behaviorAr: 'أكتب أهم أولوية لليوم',
    celebrationEn: 'Say "That\'s like me!"',
    celebrationAr: 'أقول "هذا يشبهني!"',
  },
  {
    anchorEn: 'get into bed',
    anchorAr: 'أستلقي في السرير',
    behaviorEn: 'name one good thing from today',
    behaviorAr: 'أذكر شيئاً جيداً من اليوم',
    celebrationEn: 'Take a victorious breath',
    celebrationAr: 'آخذ نفساً منتصراً',
  },
  {
    anchorEn: 'finish lunch',
    anchorAr: 'أنهي الغداء',
    behaviorEn: 'walk for 2 minutes',
    behaviorAr: 'أمشي لمدة دقيقتين',
    celebrationEn: 'Thumbs up to myself',
    celebrationAr: 'إشارة إعجاب لنفسي',
  },
  {
    anchorEn: 'plug in my phone',
    anchorAr: 'أوصل هاتفي بالشاحن',
    behaviorEn: 'stretch my shoulders once',
    behaviorAr: 'أمدد كتفي مرة واحدة',
    celebrationEn: 'Happy dance (3 seconds)',
    celebrationAr: 'رقصة فرح (٣ ثوانٍ)',
  },
];
