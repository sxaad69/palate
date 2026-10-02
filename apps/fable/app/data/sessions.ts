// Fable session catalog: 12 sessions, 4 story arcs.
// Each session is a chapter: narration beats advance in sync with breath
// phases (not counting). Beats cycle for the session duration.
// Patterns: inhale / hold / exhale / rest in seconds.

export interface BreathPattern {
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

export interface StoryArc {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  mood: 'calm' | 'energy' | 'sleep' | 'balance';
}

export interface Session {
  id: string;
  arcId: string;
  chapter: number;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  minutes: number;
  pattern: BreathPattern;
  introEn: string;
  introAr: string;
  beatsEn: string[];
  beatsAr: string[];
  outroEn: string;
  outroAr: string;
  free: boolean;
}

export const ARCS: StoryArc[] = [
  {
    id: 'tide-house',
    titleEn: 'The Tide House',
    titleAr: 'بيت المدّ',
    descEn: 'A cottage at the edge of the water, where the tide sets the rhythm.',
    descAr: 'كوخ على حافة الماء، حيث يحدّد المدّ الإيقاع.',
    mood: 'calm',
  },
  {
    id: 'ember-pine',
    titleEn: 'Ember & Pine',
    titleAr: 'الجمر والصنوبر',
    descEn: 'A mountain climb at dawn — kindling focus, breath by breath.',
    descAr: 'تسلّق جبلي عند الفجر — إشعال التركيز، نفسًا بعد نفس.',
    mood: 'energy',
  },
  {
    id: 'night-train',
    titleEn: 'Night Train',
    titleAr: 'قطار الليل',
    descEn: 'Board the sleeper car. The valley passes. You arrive rested.',
    descAr: 'اصعد إلى عربة النوم. يمرّ الوادي. وتصل مرتاحًا.',
    mood: 'sleep',
  },
  {
    id: 'greenhouse',
    titleEn: 'The Greenhouse',
    titleAr: 'الدفيئة',
    descEn: 'Rain on glass, soil, slow green things. A reset in three chapters.',
    descAr: 'مطر على الزجاج، تربة، أشياء خضراء بطيئة. إعادة ضبط في ثلاثة فصول.',
    mood: 'balance',
  },
];

const CALM_4_6: BreathPattern = { inhale: 4, hold: 0, exhale: 6, rest: 1 };
const BOX_4: BreathPattern = { inhale: 4, hold: 4, exhale: 4, rest: 2 };
const SLEEP_478: BreathPattern = { inhale: 4, hold: 7, exhale: 8, rest: 1 };
const COHERENT_5: BreathPattern = { inhale: 5, hold: 0, exhale: 5, rest: 1 };

export const SESSIONS: Session[] = [
  // ——— ARC 1: The Tide House (calm, 4-6) ———
  {
    id: 'tide-1-arrival',
    arcId: 'tide-house',
    chapter: 1,
    titleEn: 'Arrival',
    titleAr: 'الوصول',
    descEn: 'You push open the blue door. The sea has been waiting.',
    descAr: 'تدفع الباب الأزرق. كان البحر بانتظارك.',
    minutes: 5,
    pattern: CALM_4_6,
    introEn: 'Settle in. Let the tide teach you its rhythm — in with the wave, out with the foam.',
    introAr: 'استقرّ. دع المدّ يعلّمك إيقاعه — ادخل مع الموجة، واخرج مع الزبد.',
    beatsEn: [
      'The wave gathers… and releases.',
      'Salt on the air. Shoulders drop.',
      'The tide does not hurry. Neither do you.',
      'Each out-breath lays something down on the sand.',
    ],
    beatsAr: [
      'تتجمّع الموجة… ثم تنطلق.',
      'ملح في الهواء. الكتفان يسترخيان.',
      'المدّ لا يستعجل. وأنت أيضًا.',
      'كل زفير يضع شيئًا على الرمال.',
    ],
    outroEn: 'The house is quiet. The tide keeps your rhythm now.',
    outroAr: 'البيت هادئ. والمدّ يحفظ إيقاعك الآن.',
    free: true,
  },
  {
    id: 'tide-2-high-water',
    arcId: 'tide-house',
    chapter: 2,
    titleEn: 'High Water',
    titleAr: 'المدّ العالي',
    descEn: 'The water rises to the step. You breathe with its fullness.',
    descAr: 'يرتفع الماء إلى العتبة. تتنفس مع امتلائه.',
    minutes: 8,
    pattern: CALM_4_6,
    introEn: 'The tide is high today. Breathe into the fullness — there is room for all of it.',
    introAr: 'المدّ عالٍ اليوم. تنفّس في الامتلاء — هناك متّسع لكل شيء.',
    beatsEn: [
      'Water laps the third step. In… and out.',
      'Buoys nod in the distance. Steady.',
      'Fullness is not heaviness. Let it float.',
      'The gulls cry once, then settle.',
    ],
    beatsAr: [
      'يلاطم الماء العتبة الثالثة. شهيق… وزفير.',
      'العوامات تومئ من بعيد. بثبات.',
      'الامتلاء ليس ثقلًا. دعه يطفو.',
      'تصرخ النوارس مرة، ثم تهدأ.',
    ],
    outroEn: 'High water, held lightly. Well breathed.',
    outroAr: 'مدّ عالٍ، ممسوك بخفة. أحسنت التنفس.',
    free: true,
  },
  {
    id: 'tide-3-low-water',
    arcId: 'tide-house',
    chapter: 3,
    titleEn: 'Low Water',
    titleAr: 'الجزر',
    descEn: 'The tide pulls back, revealing what the day buried.',
    descAr: 'ينحسر المدّ، كاشفًا ما دفنه النهار.',
    minutes: 10,
    pattern: CALM_4_6,
    introEn: 'Low water. What the tide takes out, it takes gently. Let it carry the day away.',
    introAr: 'الجزر. ما يأخذه المدّ، يأخذه بلطف. دعه يحمل النهار بعيدًا.',
    beatsEn: [
      'Wet sand mirrors the sky. Breathe it clear.',
      'A crab sidesteps. Nothing to chase.',
      'The pools hold the light a little longer.',
      'Out with the foam. Out with the noise.',
    ],
    beatsAr: [
      'الرمال الرطبة تعكس السماء. تنفّسها صافية.',
      'سرطان يمشي جانبًا. لا شيء يُطارَد.',
      'البرك تحتفظ بالضوء قليلًا بعد.',
      'مع الزبد. مع الضجيج. إلى الخارج.',
    ],
    outroEn: 'The tide will return. You will be here, breathing.',
    outroAr: 'سيعود المدّ. وستكون هنا، تتنفس.',
    free: false,
  },
  // ——— ARC 2: Ember & Pine (energy, box) ———
  {
    id: 'ember-1-kindling',
    arcId: 'ember-pine',
    chapter: 1,
    titleEn: 'Kindling',
    titleAr: 'الحطب',
    descEn: 'First light on the trail. Small breaths wake the fire.',
    descAr: 'أول الضوء على الدرب. أنفاس صغيرة توقظ النار.',
    minutes: 5,
    pattern: BOX_4,
    introEn: 'Dawn on the mountain. We start the fire the way the pines do — steady, even, patient.',
    introAr: 'الفجر على الجبل. نشعل النار كما تفعل أشجار الصنوبر — بثبات وتساوٍ وصبر.',
    beatsEn: [
      'Strike the match. In — hold — out — rest.',
      'The kindling catches. Feel the warmth rise.',
      'Even breaths, even flames.',
      'The forest wakes around you.',
    ],
    beatsAr: [
      'أشعل العود. شهيق — احبس — زفير — استرح.',
      'اشتعل الحطب. اشعر بالدفء يتصاعد.',
      'أنفاس متساوية، لهب متساوٍ.',
      'تستيقظ الغابة حولك.',
    ],
    outroEn: 'The fire is lit. Carry it up the trail.',
    outroAr: 'النار مشتعلة. احملها معك إلى الدرب.',
    free: true,
  },
  {
    id: 'ember-2-the-climb',
    arcId: 'ember-pine',
    chapter: 2,
    titleEn: 'The Climb',
    titleAr: 'الصعود',
    descEn: 'Switchbacks and thin air. Your breath is the rope.',
    descAr: 'منعطفات وهواء خفيف. نَفَسُك هو الحبل.',
    minutes: 8,
    pattern: BOX_4,
    introEn: 'The trail steepens. Four counts in, four held, four out — your breath is the rope. Climb.',
    introAr: 'يشتدّ الدرب. أربع عدّات شهيق، أربع حبس، أربع زفير — نَفَسُك هو الحبل. اصعد.',
    beatsEn: [
      'First switchback. Legs steady, breath steadier.',
      'The air thins. You do not.',
      'Halfway cairn. Look back at how far.',
      'The summit is a decision, not a place.',
    ],
    beatsAr: [
      'المنعطف الأول. الساقان ثابتتان، والنفَس أثبت.',
      'يخفّ الهواء. وأنت لا تخفّ.',
      'رجم المنتصف. انظر إلى ما قطعته.',
      'القمة قرار، ليست مكانًا.',
    ],
    outroEn: 'Above the treeline now. The fire climbs with you.',
    outroAr: 'فوق خط الأشجار الآن. والنار تصعد معك.',
    free: false,
  },
  {
    id: 'ember-3-summit',
    arcId: 'ember-pine',
    chapter: 3,
    titleEn: 'Summit',
    titleAr: 'القمة',
    descEn: 'Wind, distance, clarity. Breathe at the top of the morning.',
    descAr: 'ريح، وبُعد، وصفاء. تنفّس في أعلى الصباح.',
    minutes: 10,
    pattern: BOX_4,
    introEn: 'Summit. The whole valley below you, the whole day ahead. Breathe like you own the morning.',
    introAr: 'القمة. الوادي كله تحتك، والنهار كله أمامك. تنفّس كأنك تملك الصباح.',
    beatsEn: [
      'Wind combs the pines far below.',
      'Clarity is just breath, repeated.',
      'Name one thing you will carry down.',
      'The ember is a lantern now.',
    ],
    beatsAr: [
      'الريح تمشط الصنوبر في الأسفل.',
      'الصفاء ليس إلا نفَسًا يتكرر.',
      'سَمِّ شيئًا واحدًا ستحمله معك إلى الأسفل.',
      'الجمرة أصبحت مصباحًا الآن.',
    ],
    outroEn: 'Descend when ready. The mountain stays with you.',
    outroAr: 'انزل عندما تكون مستعدًا. الجبل يبقى معك.',
    free: false,
  },
  // ——— ARC 3: Night Train (sleep, 4-7-8) ———
  {
    id: 'train-1-boarding',
    arcId: 'night-train',
    chapter: 1,
    titleEn: 'Boarding',
    titleAr: 'الصعود',
    descEn: 'Platform nine, last train. Your berth is turned down.',
    descAr: 'الرصيف التاسع، القطار الأخير. سريرك مُجهَّز.',
    minutes: 8,
    pattern: SLEEP_478,
    introEn: 'All aboard. Find your berth, pull the blanket up. We breathe the train to sleep — four in, seven held, eight released.',
    introAr: 'الجميع على متن القطار. جد سريرك، واسحب الغطاء. سننوّم القطار بالتنفس — أربع شهيق، سبع حبس، ثمانٍ إطلاق.',
    beatsEn: [
      'The whistle sighs. The wheels begin.',
      'Click-clack. In… hold… let everything go.',
      'The city lights thin, then vanish.',
      'Your berth rocks you like a held breath.',
    ],
    beatsAr: [
      'تتنهد الصافرة. وتبدأ العجلات.',
      'طق-طق. شهيق… احبس… أطلق كل شيء.',
      'تخفّ أضواء المدينة، ثم تختفي.',
      'سريرك يهدهدك كنفَس محبوس.',
    ],
    outroEn: 'We are moving through the dark, safely. Sleep is the destination.',
    outroAr: 'نعبر الظلام بأمان. النوم هو الوجهة.',
    free: true,
  },
  {
    id: 'train-2-valley',
    arcId: 'night-train',
    chapter: 2,
    titleEn: 'Through the Valley',
    titleAr: 'عبر الوادي',
    descEn: 'Moonlit fields slide past. The carriage hums low.',
    descAr: 'حقول مقمرة تنزلق. والعربة تهمس بخفوت.',
    minutes: 10,
    pattern: SLEEP_478,
    introEn: 'Deep in the valley now. The moon keeps pace with the train. Slower breaths, longer holds — let the night do the work.',
    introAr: 'في عمق الوادي الآن. القمر يواكب القطار. أنفاس أبطأ، وحبس أطول — دع الليل يعمل.',
    beatsEn: [
      'A river keeps us company, silver and silent.',
      'The long exhale is a tunnel — cool and dark.',
      'No stations now. Nothing is required of you.',
      'The valley widens. So does the quiet.',
    ],
    beatsAr: [
      'نهر يرافقنا، فضيّ وصامت.',
      'الزفير الطويل نفق — بارد ومظلم.',
      'لا محطات الآن. لا شيء مطلوب منك.',
      'يتسع الوادي. ويتسع الصمت.',
    ],
    outroEn: 'The valley holds you. Drift deeper.',
    outroAr: 'الوادي يحتضنك. انغمس أعمق.',
    free: false,
  },
  {
    id: 'train-3-terminus',
    arcId: 'night-train',
    chapter: 3,
    titleEn: 'Terminus',
    titleAr: 'المحطة الأخيرة',
    descEn: 'Dawn at the end of the line. You arrive rested.',
    descAr: 'الفجر في نهاية الخط. تصل مرتاحًا.',
    minutes: 12,
    pattern: SLEEP_478,
    introEn: 'Last chapter of the night. The brakes sigh, the sky pales. A few more long breaths, and we arrive.',
    introAr: 'الفصل الأخير من الليل. تتنهد المكابح، ويشحب السماء. بضع أنفاس طويلة أخرى، ونصل.',
    beatsEn: [
      'Pale light at the window. Almost there.',
      'The longest exhale yet — lay the night down.',
      'Terminus. The doors open onto morning.',
      'You slept through the whole dark. Well traveled.',
    ],
    beatsAr: [
      'ضوء شاحب عند النافذة. اقتربنا.',
      'أطول زفير بعد — ضع الليل جانبًا.',
      'المحطة الأخيرة. تنفتح الأبواب على الصباح.',
      'نمتَ طوال الظلام. رحلة موفقة.',
    ],
    outroEn: 'End of the line. Begin the day, rested.',
    outroAr: 'نهاية الخط. ابدأ النهار، مرتاحًا.',
    free: false,
  },
  // ——— ARC 4: The Greenhouse (balance, coherent 5-5) ———
  {
    id: 'green-1-seed',
    arcId: 'greenhouse',
    chapter: 1,
    titleEn: 'Seed',
    titleAr: 'البذرة',
    descEn: 'Small brown things, full of instruction. Plant one breath at a time.',
    descAr: 'أشياء بنية صغيرة، مليئة بالتعليمات. ازرع نفَسًا واحدًا في كل مرة.',
    minutes: 5,
    pattern: COHERENT_5,
    introEn: 'The greenhouse is warm. We plant the way seeds do — five in, five out, no rush, no force.',
    introAr: 'الدفيئة دافئة. نزرع كما تفعل البذور — خمس شهيق، خمس زفير، دون عجلة أو قسر.',
    beatsEn: [
      'Press the seed in. Dark, warm, patient.',
      'Water it with one slow breath.',
      'Nothing visible yet. Everything happening.',
      'Balance is the seed’s whole strategy.',
    ],
    beatsAr: [
      'اغرس البذرة. ظلام، دفء، صبر.',
      'اسقها بنفَس بطيء واحد.',
      'لا شيء مرئي بعد. وكل شيء يحدث.',
      'التوازن هو استراتيجية البذرة كلها.',
    ],
    outroEn: 'Planted. Now we wait the growing way — breathing.',
    outroAr: 'زُرعت. والآن ننتظر على طريقة النمو — بالتنفس.',
    free: true,
  },
  {
    id: 'green-2-rain',
    arcId: 'greenhouse',
    chapter: 2,
    titleEn: 'Rain',
    titleAr: 'المطر',
    descEn: 'Rain on the glass roof. The seedlings drink.',
    descAr: 'مطر على السقف الزجاجي. والشتلات تشرب.',
    minutes: 8,
    pattern: COHERENT_5,
    introEn: 'Rain. The glass roof turns it to music. Breathe even as the drops — five and five.',
    introAr: 'المطر. السقف الزجاجي يحوّله إلى موسيقى. تنفّس بانتظام كالقطرات — خمس وخمس.',
    beatsEn: [
      'Each drop finds a leaf. Each breath finds its pair.',
      'The air smells of soil and beginning.',
      'Green pushes up, pale and certain.',
      'You are the weather inside the glass.',
    ],
    beatsAr: [
      'كل قطرة تجد ورقة. وكل نفَس يجد شريكه.',
      'الهواء برائحة التراب والبداية.',
      'الأخضر يدفع إلى الأعلى، شاحبًا وواثقًا.',
      'أنت الطقس داخل الزجاج.',
    ],
    outroEn: 'The rain eases. Everything is taller.',
    outroAr: 'يخفّ المطر. وكل شيء أصبح أطول.',
    free: false,
  },
  {
    id: 'green-3-bloom',
    arcId: 'greenhouse',
    chapter: 3,
    titleEn: 'Bloom',
    titleAr: 'الإزهار',
    descEn: 'What was planted opens. Breathe with it.',
    descAr: 'ما زُرع يتفتح. تنفّس معه.',
    minutes: 10,
    pattern: COHERENT_5,
    introEn: 'Bloom. The greenhouse did its slow work, and so did you. Five in, five out — open with it.',
    introAr: 'الإزهار. قامت الدفيئة بعملها البطيء، وأنت أيضًا. خمس شهيق، خمس زفير — تفتّح معها.',
    beatsEn: [
      'Petals, unhurried. Your ribs do the same.',
      'Color was always the plan.',
      'Bees approve. The whole glass house hums.',
      'What you planted in chapter one — look.',
    ],
    beatsAr: [
      'بتلات، دون عجلة. وضلوعك تفعل الشيء نفسه.',
      'اللون كان الخطة دائمًا.',
      'النحل موافق. البيت الزجاجي كله يطنّ.',
      'ما زرعته في الفصل الأول — انظر.',
    ],
    outroEn: 'The arc is complete. The greenhouse keeps growing — so do you.',
    outroAr: 'اكتملت الحكاية. الدفيئة تواصل النمو — وأنت أيضًا.',
    free: false,
  },
];

export function getArc(id: string): StoryArc | undefined {
  return ARCS.find((a) => a.id === id);
}

export function getSession(id: string): Session | undefined {
  return SESSIONS.find((s) => s.id === id);
}

export function sessionsForArc(arcId: string): Session[] {
  return SESSIONS.filter((s) => s.arcId === arcId).sort((a, b) => a.chapter - b.chapter);
}

/** Total seconds for one full breath cycle of a pattern. */
export function cycleSeconds(p: BreathPattern): number {
  return p.inhale + p.hold + p.exhale + p.rest;
}
