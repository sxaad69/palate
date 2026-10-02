// Fasting schedule presets. The wedge: Ramadan, night-shift, and gentle
// presets that Zero/Fastic don't serve — the saturated core (16:8 etc.)
// is table stakes, not the differentiator.

export interface Preset {
  id: string;
  /** fasting hours */
  fastHours: number;
  /** eating window hours */
  eatHours: number;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  /** wedge presets get a badge in the picker */
  wedge?: 'ramadan' | 'night-shift' | 'gentle';
  /** default start-time suggestion (24h "HH:MM"), editable by the user */
  defaultStart?: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'p-16-8',
    fastHours: 16,
    eatHours: 8,
    nameEn: '16:8',
    nameAr: '١٦:٨',
    descEn: 'The classic — skip breakfast, eat 12:00–20:00.',
    descAr: 'الكلاسيكي — تخطَّ الفطور، وكُل من ١٢:٠٠ إلى ٢٠:٠٠.',
    defaultStart: '20:00',
  },
  {
    id: 'p-18-6',
    fastHours: 18,
    eatHours: 6,
    nameEn: '18:6',
    nameAr: '١٨:٦',
    descEn: 'A step up — tighter eating window, deeper fast.',
    descAr: 'خطوة أعلى — نافذة أكل أضيق وصيام أعمق.',
    defaultStart: '20:00',
  },
  {
    id: 'p-20-4',
    fastHours: 20,
    eatHours: 4,
    nameEn: '20:4',
    nameAr: '٢٠:٤',
    descEn: 'Warrior-style — one big evening meal.',
    descAr: 'أسلوب المحارب — وجبة مسائية واحدة كبيرة.',
    defaultStart: '20:00',
  },
  {
    id: 'p-omad',
    fastHours: 23,
    eatHours: 1,
    nameEn: 'OMAD',
    nameAr: 'وجبة واحدة',
    descEn: 'One meal a day — advanced only.',
    descAr: 'وجبة واحدة في اليوم — للمتقدمين فقط.',
    defaultStart: '19:00',
  },
  {
    id: 'p-ramadan',
    fastHours: 15,
    eatHours: 9,
    nameEn: 'Ramadan',
    nameAr: 'رمضان',
    descEn: 'Dawn-to-sunset fasting. Set your suhoor/iftar times to match your area.',
    descAr: 'صيام من الفجر إلى الغروب. اضبط وقتي السحور والإفطار حسب منطقتك.',
    wedge: 'ramadan',
    defaultStart: '03:30',
  },
  {
    id: 'p-night-shift',
    fastHours: 16,
    eatHours: 8,
    nameEn: 'Night shift',
    nameAr: 'الوردية الليلية',
    descEn: 'Inverted schedule — fast through daytime sleep, eat on shift.',
    descAr: 'جدول معكوس — صم أثناء نوم النهار، وكُل أثناء الوردية.',
    wedge: 'night-shift',
    defaultStart: '08:00',
  },
  {
    id: 'p-gentle-14-10',
    fastHours: 14,
    eatHours: 10,
    nameEn: 'Gentle 14:10',
    nameAr: 'هادئ ١٤:١٠',
    descEn: 'A softer start — popular with women 45+. Ease in, no pressure.',
    descAr: 'بداية ألطف — مناسب لمن فوق ٤٥. ابدأ بهدوء وبدون ضغط.',
    wedge: 'gentle',
    defaultStart: '21:00',
  },
];

export function presetById(id: string): Preset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}
