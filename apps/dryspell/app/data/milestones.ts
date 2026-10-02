// Body-recovery milestones. Wellness framing only — celebrated, never
// diagnosing. Every entry carries the "not medical advice" spirit; the app
// also shows a standing disclaimer on the timeline screen.

export interface Milestone {
  /** Days clean needed to reach it. */
  days: number;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
}

export const MILESTONES: Milestone[] = [
  {
    days: 1,
    titleEn: '24 hours clear',
    titleAr: '٢٤ ساعة صافية',
    bodyEn: 'Your sleep starts to settle and hydration improves. The hardest day is behind you.',
    bodyAr: 'يبدأ نومك بالاستقرار ويتحسن ترطيب جسمك. أصعب يوم أصبح خلفك.',
  },
  {
    days: 3,
    titleEn: '3 days — alcohol fully leaves the body',
    titleAr: '٣ أيام — يغادر الكحول الجسم تمامًا',
    bodyEn: 'Cravings often peak around now, then start fading. You are through the sharpest part.',
    bodyAr: 'غالبًا ما يبلغ الاشتهاء ذروته الآن ثم يبدأ بالتلاشي. لقد تجاوزت أصعب مرحلة.',
  },
  {
    days: 7,
    titleEn: 'One full week',
    titleAr: 'أسبوع كامل',
    bodyEn: 'Sleep quality is noticeably better and morning energy is returning. Seven days of proof you can do this.',
    bodyAr: 'جودة النوم أفضل بوضوح وطاقة الصباح تعود. سبعة أيام من الإثبات أنك قادر.',
  },
  {
    days: 14,
    titleEn: 'Two weeks — skin and liver recovering',
    titleAr: 'أسبوعان — البشرة والكبد يتعافيان',
    bodyEn: 'Skin looks healthier as hydration normalizes, and the liver — remarkably resilient — is well into repair.',
    bodyAr: 'تبدو البشرة أكثر صحة مع عودة الترطيب لطبيعته، والكبد — المدهش في قدرته على التعافي — في طريقه للإصلاح.',
  },
  {
    days: 30,
    titleEn: 'One month',
    titleAr: 'شهر كامل',
    bodyEn: 'Blood pressure eases, weight often drops, and your savings are becoming real money. A whole month of clear days.',
    bodyAr: 'ينخفض ضغط الدم، وغالبًا ما ينخفض الوزن، ومدخراتك أصبحت مالًا حقيقيًا. شهر كامل من الأيام الصافية.',
  },
  {
    days: 90,
    titleEn: 'Three months — mind sharpening',
    titleAr: 'ثلاثة أشهر — ذهن أكثر حدة',
    bodyEn: 'Mood steadies and focus sharpens as brain chemistry rebalances. This is where the new normal sets in.',
    bodyAr: 'يستقر المزاج وتزداد حدة التركيز مع إعادة توازن كيمياء الدماغ. هنا يبدأ الوضع الطبيعي الجديد.',
  },
  {
    days: 180,
    titleEn: 'Six months',
    titleAr: 'ستة أشهر',
    bodyEn: 'Immune system stronger, routines rebuilt. Half a year of choosing yourself, every single day.',
    bodyAr: 'جهاز مناعة أقوى وروتين جديد. نصف عام من اختيار نفسك، كل يوم.',
  },
  {
    days: 365,
    titleEn: 'One full year',
    titleAr: 'عام كامل',
    bodyEn: '365 clear days. Look how far the first hard day carried you.',
    bodyAr: '٣٦٥ يومًا صافيًا. انظر إلى أين أوصلك ذلك اليوم الأول الصعب.',
  },
];

/** Next milestone not yet reached, or null when all are reached. */
export function nextMilestone(daysClean: number): Milestone | null {
  for (const m of MILESTONES) {
    if (m.days > daysClean) return m;
  }
  return null;
}
