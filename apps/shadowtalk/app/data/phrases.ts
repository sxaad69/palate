// Bundled phrase packs — written for this app, practical and modern.
// Travel/Work/Daily: EN model for Arabic speakers learning English.
// arabic: AR model for English speakers learning Arabic.
// Each phrase carries a phonetic hint line (respelling / transliteration).
// 10 phrases per pack × 4 packs = 40.

export type PackId = 'travel' | 'work' | 'daily' | 'arabic';
export type PackDirection = 'ar-en' | 'en-ar';
export type TtsLang = 'en-US' | 'ar-SA';

export interface Pack {
  id: PackId;
  direction: PackDirection;
  icon: string; // text glyph, dependency-free
}

export const PACKS: Pack[] = [
  { id: 'travel', direction: 'ar-en', icon: '✈' },
  { id: 'work', direction: 'ar-en', icon: '💼' },
  { id: 'daily', direction: 'ar-en', icon: '☀' },
  { id: 'arabic', direction: 'en-ar', icon: '🌙' },
];

export interface Phrase {
  id: string;
  pack: PackId;
  /** The sentence the learner shadows — spoken by the on-device TTS model. */
  text: string;
  /** Translation in the learner's source language. */
  translation: string;
  /** Phonetic hint: respelling (EN) or Latin transliteration (AR). */
  phonetic: string;
  lang: TtsLang;
}

function en(pack: PackId, id: string, text: string, translation: string, phonetic: string): Phrase {
  return { id, pack, text, translation, phonetic, lang: 'en-US' };
}
function ar(pack: PackId, id: string, text: string, translation: string, phonetic: string): Phrase {
  return { id, pack, text, translation, phonetic, lang: 'ar-SA' };
}

export const PHRASES: Phrase[] = [
  // ---- Travel (AR → EN) ----
  en('travel', 'travel-1', 'Where is the nearest subway station?', 'أين أقرب محطة مترو؟', 'wair iz the NEAR-uhst SUB-way STAY-shun'),
  en('travel', 'travel-2', "I'd like to check in, please.", 'أود تسجيل الوصول، من فضلك.', 'eyed LYKE tu CHEK in, pleez'),
  en('travel', 'travel-3', 'How much is a ticket to the airport?', 'كم سعر التذكرة إلى المطار؟', 'hao MUCH iz uh TIK-ut tu thee AIR-port'),
  en('travel', 'travel-4', 'Can you call a taxi for me?', 'هل يمكنك طلب تاكسي لي؟', 'kan yoo KAL uh TAK-see for mee'),
  en('travel', 'travel-5', 'Is breakfast included?', 'هل الفطور مشمول؟', 'iz BREK-fuhst in-KLOOD-ud'),
  en('travel', 'travel-6', 'Where can I buy a SIM card?', 'أين يمكنني شراء شريحة اتصال؟', 'wair kan ey BY uh SIM kard'),
  en('travel', 'travel-7', 'I need a room for two nights.', 'أحتاج غرفة لليلتين.', 'ey NEED uh ROOM for TOO nyts'),
  en('travel', 'travel-8', 'What time does the museum open?', 'متى يفتح المتحف؟', 'wat TYM duz the myoo-ZEE-um OH-pun'),
  en('travel', 'travel-9', 'Could you take our photo, please?', 'هل يمكنك التقاط صورة لنا، من فضلك؟', 'kud yoo TAYK ow-er FOH-toh, pleez'),
  en('travel', 'travel-10', 'My flight is delayed.', 'رحلتي تأخرت.', 'my FLYT iz dee-LAYD'),

  // ---- Work (AR → EN) ----
  en('work', 'work-1', 'Can we schedule a call this week?', 'هل يمكننا جدولة مكالمة هذا الأسبوع؟', 'kan wee SKEDJ-ool uh KAL this WEEK'),
  en('work', 'work-2', "I'll send you the report by Friday.", 'سأرسل لك التقرير بحلول يوم الجمعة.', 'eyel SEND yoo the ree-PORT by FRY-dee'),
  en('work', 'work-3', 'Let me check with my team.', 'دعني أتحقق مع فريقي.', 'let mee CHEK with my TEEM'),
  en('work', 'work-4', 'Could you please repeat that?', 'هل يمكنك تكرار ذلك، من فضلك؟', 'kud yoo PLEEZ ree-PEET that'),
  en('work', 'work-5', "Let's meet at ten o'clock.", 'لنتقابل في الساعة العاشرة.', 'lets MEET at TEN uh-KLAK'),
  en('work', 'work-6', "I'm working from home today.", 'أعمل من المنزل اليوم.', 'eyem WURK-ing from HOHM tuh-DAY'),
  en('work', 'work-7', "What's the deadline for this task?", 'ما الموعد النهائي لهذه المهمة؟', 'wats the DED-lyne for this TASK'),
  en('work', 'work-8', "I'll follow up with you tomorrow.", 'سأتابع معك غداً.', 'eyel FOL-oh UP with yoo tuh-MOR-oh'),
  en('work', 'work-9', 'Thank you for your time today.', 'شكراً لوقتك اليوم.', 'THANK yoo for yor TYM tuh-DAY'),
  en('work', 'work-10', 'Can we push this to next week?', 'هل يمكننا تأجيل هذا إلى الأسبوع المقبل؟', 'kan wee PUSH this tu NEKST week'),

  // ---- Daily life (AR → EN) ----
  en('daily', 'daily-1', "What's for dinner tonight?", 'ما العشاء الليلة؟', 'wats for DIN-er tuh-NYT'),
  en('daily', 'daily-2', 'I need to buy some groceries.', 'أحتاج شراء بعض البقالة.', 'ey NEED tu BY sum GROH-sreez'),
  en('daily', 'daily-3', "It's a beautiful day today.", 'اليوم يوم جميل.', 'its uh BYOO-tuh-ful DAY tuh-DAY'),
  en('daily', 'daily-4', 'Can you help me with this?', 'هل يمكنك مساعدتي في هذا؟', 'kan yoo HELP mee with this'),
  en('daily', 'daily-5', 'See you tomorrow!', 'أراك غداً!', 'SEE yoo tuh-MOR-oh'),
  en('daily', 'daily-6', 'What time is lunch?', 'متى موعد الغداء؟', 'wat TYM iz LUNCH'),
  en('daily', 'daily-7', "I'm running a bit late.", 'أنا متأخر قليلاً.', 'eyem RUN-ing uh bit LAYT'),
  en('daily', 'daily-8', 'That sounds great.', 'هذا يبدو رائعاً.', 'that SOWNDZ grayt'),
  en('daily', 'daily-9', 'Have a nice day!', 'أتمنى لك يوماً سعيداً!', 'hav uh NYSS day'),
  en('daily', 'daily-10', "I'm really tired today.", 'أنا متعب جداً اليوم.', 'eyem REE-uh-lee TYRD tuh-DAY'),

  // ---- Arabic for English speakers (EN → AR) ----
  ar('arabic', 'arabic-1', 'كم السعر؟', 'How much is it?', 'kam as-siʿr?'),
  ar('arabic', 'arabic-2', 'أين الحمام؟', 'Where is the bathroom?', 'ayna al-ḥammām?'),
  ar('arabic', 'arabic-3', 'شكراً جزيلاً', 'Thank you very much', 'shukran jazīlan'),
  ar('arabic', 'arabic-4', 'صباح الخير', 'Good morning', 'ṣabāḥ al-khayr'),
  ar('arabic', 'arabic-5', 'مع السلامة', 'Goodbye', 'maʿa as-salāma'),
  ar('arabic', 'arabic-6', 'أنا لا أفهم', "I don't understand", 'anā lā afham'),
  ar('arabic', 'arabic-7', 'تكلم ببطء من فضلك', 'Speak slowly, please', 'takallam bi-buṭʾ min faḍlak'),
  ar('arabic', 'arabic-8', 'أين محطة القطار؟', 'Where is the train station?', 'ayna maḥaṭṭat al-qiṭār?'),
  ar('arabic', 'arabic-9', 'أحتاج مساعدة', 'I need help', 'aḥtāju musāʿada'),
  ar('arabic', 'arabic-10', 'الفاتورة من فضلك', 'The bill, please', 'al-fātūra min faḍlak'),
];

export function phrasesForPack(pack: PackId): Phrase[] {
  return PHRASES.filter((p) => p.pack === pack);
}

/** The single free pack for a learning direction. */
export function freePackFor(direction: PackDirection): PackId {
  return direction === 'ar-en' ? 'travel' : 'arabic';
}
