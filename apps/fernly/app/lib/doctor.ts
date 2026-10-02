// Plant Doctor: rule-based symptom diagnosis. No AI inference, no network —
// a weighted symptom→diagnosis map built from common houseplant problems.
// This is the "disease ID" wedge, done for free.

export interface Symptom {
  id: string;
  en: string;
  ar: string;
}

export const SYMPTOMS: Symptom[] = [
  { id: 'yellow-leaves', en: 'Yellow leaves', ar: 'أوراق صفراء' },
  { id: 'brown-tips', en: 'Brown leaf tips/edges', ar: 'أطراف أوراق بنية' },
  { id: 'drooping', en: 'Drooping / wilting', ar: 'ذبول' },
  { id: 'spots', en: 'Spots on leaves', ar: 'بقع على الأوراق' },
  { id: 'pests-visible', en: 'Visible bugs or webbing', ar: 'حشرات أو خيوط مرئية' },
  { id: 'mushy-stems', en: 'Mushy stems or base', ar: 'سيقان طرية' },
  { id: 'falling-leaves', en: 'Leaves falling off', ar: 'تساقط الأوراق' },
  { id: 'no-growth', en: 'No new growth for months', ar: 'لا نمو جديد منذ شهور' },
  { id: 'white-powder', en: 'White powdery coating', ar: 'طبقة بيضاء بودرية' },
  { id: 'curled-leaves', en: 'Curling leaves', ar: 'أوراق ملتفة' },
];

export type Urgency = 'low' | 'medium' | 'high';

export interface Diagnosis {
  id: string;
  titleEn: string;
  titleAr: string;
  causeEn: string;
  causeAr: string;
  treatmentEn: string;
  treatmentAr: string;
  urgency: Urgency;
  /** symptom ids with weights */
  signals: Record<string, number>;
}

export const DIAGNOSES: Diagnosis[] = [
  {
    id: 'overwatering',
    titleEn: 'Overwatering',
    titleAr: 'إفراط في الري',
    causeEn: 'Roots sitting in waterlogged soil cannot breathe.',
    causeAr: 'الجذور في تربة مشبعة بالماء لا تستطيع التنفس.',
    treatmentEn: 'Let soil dry fully, then water less often. Check drainage holes.',
    treatmentAr: 'دع التربة تجف تماماً، ثم قلل الري. تحقق من فتحات التصريف.',
    urgency: 'high',
    signals: { 'yellow-leaves': 2, 'mushy-stems': 3, drooping: 1, 'falling-leaves': 1 },
  },
  {
    id: 'root-rot',
    titleEn: 'Root rot',
    titleAr: 'تعفن الجذور',
    causeEn: 'Fungal decay of roots from prolonged sogginess.',
    causeAr: 'تعفن فطري للجذور بسبب البلل المستمر.',
    treatmentEn: 'Unpot, trim black mushy roots, repot in fresh dry mix. Act fast.',
    treatmentAr: 'أخرج النبات، قص الجذور السوداء الطرية، وأعد الزراعة في تربة جافة جديدة. تصرف بسرعة.',
    urgency: 'high',
    signals: { 'mushy-stems': 3, 'yellow-leaves': 1, 'falling-leaves': 2 },
  },
  {
    id: 'underwatering',
    titleEn: 'Underwatering',
    titleAr: 'قلة الري',
    causeEn: 'Soil dried out too long between waterings.',
    causeAr: 'جفاف التربة لفترة طويلة بين الريات.',
    treatmentEn: 'Water thoroughly until it drains. Then follow the schedule.',
    treatmentAr: 'اسقِ بغزارة حتى يخرج الماء من الأسفل. ثم اتبع الجدول.',
    urgency: 'medium',
    signals: { drooping: 2, 'brown-tips': 2, 'curled-leaves': 1, 'falling-leaves': 1 },
  },
  {
    id: 'pests',
    titleEn: 'Pest infestation',
    titleAr: 'إصابة حشرية',
    causeEn: 'Sap-sucking insects (mealybugs, spider mites, aphids).',
    causeAr: 'حشرات ماصة للعصارة (بق دقيقي، عناكب حمراء، منّ).',
    treatmentEn: 'Wipe leaves, spray neem oil weekly, isolate the plant.',
    treatmentAr: 'امسح الأوراق، رش زيت النيم أسبوعياً، واعزل النبات.',
    urgency: 'medium',
    signals: { 'pests-visible': 3, spots: 1, 'yellow-leaves': 1, 'curled-leaves': 1 },
  },
  {
    id: 'powdery-mildew',
    titleEn: 'Powdery mildew',
    titleAr: 'البياض الدقيقي',
    causeEn: 'Fungal coating thriving in humid, still air.',
    causeAr: 'طبقة فطرية تزدهر في الهواء الرطب الراكد.',
    treatmentEn: 'Improve airflow, remove affected leaves, apply fungicide or baking-soda spray.',
    treatmentAr: 'حسّن التهوية، أزل الأوراق المصابة، واستخدم مبيد فطري أو رش صودا الخبز.',
    urgency: 'medium',
    signals: { 'white-powder': 3, spots: 1 },
  },
  {
    id: 'sunburn',
    titleEn: 'Sunburn',
    titleAr: 'حروق الشمس',
    causeEn: 'Too much direct sun, too fast.',
    causeAr: 'شمس مباشرة زائدة وبشكل مفاجئ.',
    treatmentEn: 'Move to bright indirect light. Scorched leaves will not heal — new growth will be fine.',
    treatmentAr: 'انقل إلى ضوء ساطع غير مباشر. الأوراق المحروقة لن تشفى — النمو الجديد سيكون بخير.',
    urgency: 'medium',
    signals: { 'brown-tips': 2, spots: 2 },
  },
  {
    id: 'low-light',
    titleEn: 'Too little light',
    titleAr: 'قلة الضوء',
    causeEn: 'Not enough light for photosynthesis and growth.',
    causeAr: 'ضوء غير كافٍ للتمثيل الضوئي والنمو.',
    treatmentEn: 'Move closer to a window or add a grow light.',
    treatmentAr: 'قرّب من النافذة أو أضف مصباح نمو.',
    urgency: 'low',
    signals: { 'no-growth': 3, 'falling-leaves': 1, 'yellow-leaves': 1, 'curled-leaves': 1 },
  },
  {
    id: 'nutrient-deficiency',
    titleEn: 'Nutrient deficiency',
    titleAr: 'نقص المغذيات',
    causeEn: 'Depleted soil after months without feeding.',
    causeAr: 'تربة مستنفدة بعد شهور بلا تسميد.',
    treatmentEn: 'Start a regular fertilizing schedule (see the care tab).',
    treatmentAr: 'ابدأ جدول تسميد منتظم (انظر تبويب العناية).',
    urgency: 'low',
    signals: { 'yellow-leaves': 2, 'no-growth': 2 },
  },
];

const URGENCY_RANK: Record<Urgency, number> = { high: 3, medium: 2, low: 1 };

/**
 * Score diagnoses by weighted symptom matches. Returns the top matches
 * (score > 0), sorted by score then urgency.
 */
export function diagnose(symptomIds: string[]): Diagnosis[] {
  const picked = new Set(symptomIds);
  return DIAGNOSES.map((d) => {
    let score = 0;
    for (const [sym, w] of Object.entries(d.signals)) {
      if (picked.has(sym)) score += w;
    }
    return { d, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || URGENCY_RANK[b.d.urgency] - URGENCY_RANK[a.d.urgency])
    .slice(0, 3)
    .map((r) => r.d);
}
