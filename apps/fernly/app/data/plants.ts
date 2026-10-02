// Built-in plant library: care data for common houseplants, offline.
// Intervals in days (0 = not needed).

export interface PlantSpecies {
  id: string;
  nameEn: string;
  nameAr: string;
  waterDays: number;
  fertilizeDays: number;
  mistDays: number;
  lightEn: string;
  lightAr: string;
  tipEn: string;
  tipAr: string;
}

export const SPECIES: PlantSpecies[] = [
  { id: 'monstera', nameEn: 'Monstera', nameAr: 'مونستيرا', waterDays: 7, fertilizeDays: 30, mistDays: 3, lightEn: 'Bright indirect', lightAr: 'ساطع غير مباشر', tipEn: 'Wipe leaves monthly — dust blocks light.', tipAr: 'امسح الأوراق شهرياً — الغبار يحجب الضوء.' },
  { id: 'pothos', nameEn: 'Pothos', nameAr: 'بوتس', waterDays: 7, fertilizeDays: 45, mistDays: 0, lightEn: 'Low to bright indirect', lightAr: 'خافت إلى ساطع غير مباشر', tipEn: 'Nearly unkillable. Trim to encourage bushiness.', tipAr: 'يكاد لا يموت. قلّم لتشجيع الكثافة.' },
  { id: 'snake', nameEn: 'Snake plant', nameAr: 'نبات الثعبان', waterDays: 14, fertilizeDays: 60, mistDays: 0, lightEn: 'Low to bright', lightAr: 'خافت إلى ساطع', tipEn: 'Thrives on neglect. Water only when bone dry.', tipAr: 'يزدهر مع الإهمال. اسقِ فقط عندما يجف تماماً.' },
  { id: 'zz', nameEn: 'ZZ plant', nameAr: 'زاميا', waterDays: 14, fertilizeDays: 60, mistDays: 0, lightEn: 'Low to medium', lightAr: 'خافت إلى متوسط', tipEn: 'Stores water in rhizomes — overwatering kills it.', tipAr: 'يخزن الماء في جذوره — الإفراط في الري يقتله.' },
  { id: 'fiddle', nameEn: 'Fiddle-leaf fig', nameAr: 'تين ورقة الكمان', waterDays: 7, fertilizeDays: 30, mistDays: 0, lightEn: 'Bright indirect', lightAr: 'ساطع غير مباشر', tipEn: 'Hates being moved. Pick a spot and commit.', tipAr: 'يكره التنقل. اختر مكاناً والتزم به.' },
  { id: 'peace-lily', nameEn: 'Peace lily', nameAr: 'زنبق السلام', waterDays: 7, fertilizeDays: 45, mistDays: 3, lightEn: 'Low to medium', lightAr: 'خافت إلى متوسط', tipEn: 'Droops dramatically when thirsty — then perks right up.', tipAr: 'يتدلى بشكل درامي عند العطش — ثم ينتعش فوراً.' },
  { id: 'spider', nameEn: 'Spider plant', nameAr: 'نبات العنكبوت', waterDays: 7, fertilizeDays: 45, mistDays: 0, lightEn: 'Bright indirect', lightAr: 'ساطع غير مباشر', tipEn: 'Brown tips usually mean fluoride — try filtered water.', tipAr: 'الأطراف البنية تعني الفلورايد غالباً — جرّب ماءً مفلتراً.' },
  { id: 'aloe', nameEn: 'Aloe vera', nameAr: 'صبار الألوفيرا', waterDays: 14, fertilizeDays: 90, mistDays: 0, lightEn: 'Bright direct', lightAr: 'ساطع مباشر', tipEn: 'Succulent: drench, then let dry completely.', tipAr: 'نبات عصاري: اغمر بالماء ثم دعه يجف تماماً.' },
  { id: 'rubber', nameEn: 'Rubber plant', nameAr: 'نبات المطاط', waterDays: 7, fertilizeDays: 30, mistDays: 2, lightEn: 'Bright indirect', lightAr: 'ساطع غير مباشر', tipEn: 'Wipe the big leaves — they collect dust fast.', tipAr: 'امسح الأوراق الكبيرة — تجمع الغبار بسرعة.' },
  { id: 'philodendron', nameEn: 'Philodendron', nameAr: 'فيلودندرون', waterDays: 7, fertilizeDays: 30, mistDays: 3, lightEn: 'Medium indirect', lightAr: 'متوسط غير مباشر', tipEn: 'Climbs if you give it a moss pole.', tipAr: 'يتسلق إذا أعطيته عمود طحلب.' },
  { id: 'calathea', nameEn: 'Calathea', nameAr: 'كالاتيا', waterDays: 5, fertilizeDays: 30, mistDays: 2, lightEn: 'Medium indirect', lightAr: 'متوسط غير مباشر', tipEn: 'Dramatic about tap water — rainwater or filtered.', tipAr: 'حساس لماء الصنبور — ماء مطر أو مفلتر.' },
  { id: 'cactus', nameEn: 'Cactus', nameAr: 'صبار', waterDays: 21, fertilizeDays: 90, mistDays: 0, lightEn: 'Bright direct', lightAr: 'ساطع مباشر', tipEn: 'Less is more. When in doubt, do not water.', tipAr: 'القليل أفضل. عند الشك، لا تسقِ.' },
];

export function speciesById(id: string): PlantSpecies | undefined {
  return SPECIES.find((s) => s.id === id);
}
