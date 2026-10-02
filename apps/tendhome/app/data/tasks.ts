// Bundled home-maintenance task library. Intervals are sensible defaults —
// seasonal timing varies by climate (the app says so).

export type Category = 'hvac' | 'safety' | 'plumbing' | 'exterior' | 'appliances' | 'general';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface LibraryTask {
  id: string;
  titleEn: string;
  titleAr: string;
  category: Category;
  intervalDays: number;
  minutes: number;
  season?: Season;
  why: string;
  defaultOn: boolean;
}

export const CATEGORIES: { id: Category; en: string; ar: string }[] = [
  { id: 'hvac', en: 'Heating & Cooling', ar: 'التدفئة والتبريد' },
  { id: 'safety', en: 'Safety', ar: 'السلامة' },
  { id: 'plumbing', en: 'Plumbing', ar: 'السباكة' },
  { id: 'exterior', en: 'Exterior', ar: 'الخارج' },
  { id: 'appliances', en: 'Appliances', ar: 'الأجهزة' },
  { id: 'general', en: 'General', ar: 'عام' },
];

export const LIBRARY: LibraryTask[] = [
  // HVAC
  { id: 'hvac-filter', titleEn: 'Replace HVAC filter', titleAr: 'استبدال فلتر التكييف', category: 'hvac', intervalDays: 90, minutes: 15, why: 'A clogged filter strains the system and raises energy bills.', defaultOn: true },
  { id: 'dryer-vent', titleEn: 'Clean dryer vent', titleAr: 'تنظيف فتحة المجفف', category: 'hvac', intervalDays: 180, minutes: 30, why: 'Lint buildup is a leading cause of house fires.', defaultOn: true },
  { id: 'ac-service', titleEn: 'Service the AC unit', titleAr: 'صيانة وحدة التكييف', category: 'hvac', intervalDays: 365, minutes: 60, season: 'spring', why: 'Annual service before summer prevents mid-heatwave breakdowns.', defaultOn: false },
  // Safety
  { id: 'smoke-test', titleEn: 'Test smoke detectors', titleAr: 'اختبار كاشفات الدخان', category: 'safety', intervalDays: 30, minutes: 10, why: 'Press the test button — a dead detector protects no one.', defaultOn: true },
  { id: 'co-test', titleEn: 'Test CO detectors', titleAr: 'اختبار كاشفات أول أكسيد الكربون', category: 'safety', intervalDays: 30, minutes: 10, why: 'Carbon monoxide is odorless. Test monthly.', defaultOn: true },
  { id: 'smoke-battery', titleEn: 'Replace detector batteries', titleAr: 'استبدال بطاريات الكاشفات', category: 'safety', intervalDays: 180, minutes: 20, why: 'Fresh batteries twice a year, even if they still chirp-test fine.', defaultOn: false },
  { id: 'extinguisher', titleEn: 'Check fire extinguisher', titleAr: 'فحص طفاية الحريق', category: 'safety', intervalDays: 180, minutes: 10, why: 'Gauge in the green, pin intact, no corrosion.', defaultOn: false },
  // Plumbing
  { id: 'heater-flush', titleEn: 'Flush water heater', titleAr: 'تنظيف سخان الماء', category: 'plumbing', intervalDays: 365, minutes: 60, why: 'Sediment buildup shortens the tank\u2019s life and wastes energy.', defaultOn: false },
  { id: 'sink-leaks', titleEn: 'Check under sinks for leaks', titleAr: 'فحص التسريبات تحت الأحواض', category: 'plumbing', intervalDays: 90, minutes: 15, why: 'Slow drips rot cabinets long before you notice.', defaultOn: true },
  { id: 'disposal-clean', titleEn: 'Clean garbage disposal', titleAr: 'تنظيف مطحنة النفايات', category: 'plumbing', intervalDays: 30, minutes: 10, why: 'Ice + citrus keeps it fresh and the blades sharp.', defaultOn: false },
  { id: 'sump-test', titleEn: 'Test sump pump', titleAr: 'اختبار مضخة التصريف', category: 'plumbing', intervalDays: 90, minutes: 15, why: 'Pour water in the pit — it should kick on fast.', defaultOn: false },
  // Exterior
  { id: 'gutters', titleEn: 'Clean gutters', titleAr: 'تنظيف المزاريب', category: 'exterior', intervalDays: 180, minutes: 90, season: 'fall', why: 'Clogged gutters rot fascia and flood foundations.', defaultOn: true },
  { id: 'roof-inspect', titleEn: 'Inspect roof', titleAr: 'فحص السقف', category: 'exterior', intervalDays: 365, minutes: 30, season: 'spring', why: 'Look for missing shingles and cracked flashing from the ground.', defaultOn: false },
  { id: 'faucet-winterize', titleEn: 'Winterize exterior faucets', titleAr: 'تجهيز الصنابير الخارجية للشتاء', category: 'exterior', intervalDays: 365, minutes: 20, season: 'fall', why: 'Frozen pipes burst. Shut off, drain, cover.', defaultOn: false },
  { id: 'caulk-check', titleEn: 'Check window & door caulking', titleAr: 'فحص سد النوافذ والأبواب', category: 'exterior', intervalDays: 365, minutes: 45, season: 'fall', why: 'Gaps leak heated/cooled air all year.', defaultOn: false },
  // Appliances
  { id: 'fridge-coils', titleEn: 'Clean refrigerator coils', titleAr: 'تنظيف ملفات الثلاجة', category: 'appliances', intervalDays: 180, minutes: 20, why: 'Dusty coils make the fridge work harder and die sooner.', defaultOn: true },
  { id: 'dishwasher-descale', titleEn: 'Descale dishwasher', titleAr: 'إزالة الترسبات من غسالة الأطباق', category: 'appliances', intervalDays: 90, minutes: 15, why: 'Vinegar cycle keeps spray arms clear and dishes spotless.', defaultOn: false },
  { id: 'oven-clean', titleEn: 'Deep-clean oven', titleAr: 'تنظيف الفرن بعمق', category: 'appliances', intervalDays: 90, minutes: 45, why: 'Baked-on grease becomes a smoke (and fire) risk.', defaultOn: false },
  { id: 'hood-filter', titleEn: 'Clean range hood filter', titleAr: 'تنظيف فلتر شفاط المطبخ', category: 'appliances', intervalDays: 180, minutes: 20, why: 'Grease-clogged filters barely ventilate.', defaultOn: false },
  // General
  { id: 'deep-clean', titleEn: 'Whole-home deep clean', titleAr: 'تنظيف عميق للمنزل', category: 'general', intervalDays: 90, minutes: 180, why: 'Baseboards, vents, behind furniture — the quarterly reset.', defaultOn: false },
  { id: 'attic-pests', titleEn: 'Check attic & basement for pests', titleAr: 'فحص العلية والقبو من الآفات', category: 'general', intervalDays: 180, minutes: 30, why: 'Droppings and gnaw marks caught early save thousands.', defaultOn: false },
  { id: 'mower-service', titleEn: 'Service lawn mower', titleAr: 'صيانة جزازة العشب', category: 'general', intervalDays: 365, minutes: 45, season: 'spring', why: 'Sharp blade + fresh oil before the growing season.', defaultOn: false },
  { id: 'septic-check', titleEn: 'Check septic / drains flow', titleAr: 'فحص الصرف الصحي', category: 'general', intervalDays: 180, minutes: 20, why: 'Slow drains everywhere = a system problem, not a clog.', defaultOn: false },
  { id: 'paint-touchup', titleEn: 'Touch-up paint walkthrough', titleAr: 'جولة ترميم الدهان', category: 'general', intervalDays: 365, minutes: 60, why: 'Small chips become big peels if ignored.', defaultOn: false },
];

export const FREE_TASK_LIMIT = 10;
