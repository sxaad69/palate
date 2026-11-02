import { SYMBOLS } from '../data/symbols';

export interface DreamReflection {
  archetype: string;
  theme: string;
  reflectionQuestion: string;
  culturalNote: string;
}

export function getDreamReflection(
  narrative: string,
  symbolIds: string[],
  lang: 'en' | 'ar' = 'en',
): DreamReflection {
  const isAr = lang === 'ar';
  const text = narrative.toLowerCase();

  // Find symbols that match
  const matchedSymbols = symbolIds
    .map((id) => SYMBOLS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s);

  // Determine core archetypal pattern based on matched symbols and text
  if (
    symbolIds.includes('water') ||
    symbolIds.includes('sea') ||
    symbolIds.includes('rain') ||
    text.includes('water') ||
    text.includes('بحر') ||
    text.includes('ماء')
  ) {
    return {
      archetype: isAr ? 'الولادة والتجدد (عنصر الماء)' : 'The Rebirth & Purification (Water)',
      theme: isAr
        ? 'يمثل الماء في علم النفس التحليلي اللاوعي العميق والمشاعر الكامنة التي تبحث عن مخرج ونقاء.'
        : 'Water universally reflects the emotional unconscious and feelings seeking release and renewal.',
      reflectionQuestion: isAr
        ? 'ما هي المشاعر التي كنت تكتمها مؤخراً وتحتاج إلى مساحة للتعبير؟'
        : 'What emotions have you been holding back that are asking to be acknowledged?',
      culturalNote: isAr
        ? 'في الموروث الشعبي، يرتبط الماء الصافي بالرزق وتفريج الهم، بينما الموج العالي يرمز لتقلبات الحياة.'
        : 'In regional tradition, clear water signifies relief and provision, while waves represent turbulent life changes.',
    };
  }

  if (
    symbolIds.includes('flying') ||
    symbolIds.includes('bird') ||
    symbolIds.includes('sky') ||
    text.includes('fly') ||
    text.includes('طيران') ||
    text.includes('طير')
  ) {
    return {
      archetype: isAr ? 'التحرر والارتقاء (رمز الطيران)' : 'The Transcendence & Liberation (Ascent)',
      theme: isAr
        ? 'يرمز الطيران إلى الرغبة في التحرر من القيود اليومية والنظر إلى الأمور من زاوية أعلى وأشمل.'
        : 'Flight embodies the psyche’s drive for liberation from earthly constraints and higher perspective.',
      reflectionQuestion: isAr
        ? 'ما هو القيد أو الالتزام الذي تتمنى التحرر منه في هذه المرحلة؟'
        : 'What obligation or boundary are you longing to rise above right now?',
      culturalNote: isAr
        ? 'في التراث، الطيران بسلاسة يشير إلى نيل مرتبة رفيعة أو سفر يحمل في طياته تبدلاً في الأحوال.'
        : 'Historically, peaceful flight symbolizes elevated status or a journey bringing positive transformation.',
    };
  }

  if (
    symbolIds.includes('snake') ||
    symbolIds.includes('shadow') ||
    symbolIds.includes('darkness') ||
    text.includes('snake') ||
    text.includes('ثعبان') ||
    text.includes('ظلام')
  ) {
    return {
      archetype: isAr ? 'مواجهة الظل (The Shadow)' : 'Confronting the Shadow',
      theme: isAr
        ? 'يشير الظل إلى المخاوف الخفية أو الجوانب التي نتجنب مواجهتها في اليقظة.'
        : 'The Shadow archetype highlights unaddressed anxieties or instincts awaiting integration.',
      reflectionQuestion: isAr
        ? 'ما هو الشيء الذي تخشى مواجهته حالياً في حياتك اليومية؟'
        : 'What uncomfortable truth or challenge are you currently avoiding in waking life?',
      culturalNote: isAr
        ? 'في الثقافة الشعبية، الحذر من الخصومة والحرص في العلاقات هما العبرة المستفادة من رموز الزواحف.'
        : 'Cultural lore treats reptilian symbols as prompts for vigilance and healthy boundaries in relationships.',
    };
  }

  // Default introspective reflection
  const primarySymbol = matchedSymbols[0];
  return {
    archetype: isAr ? 'رحلة التأمل الداخلي' : 'The Inner Journey',
    theme: isAr
      ? (primarySymbol ? primarySymbol.themesAr : 'يعكس حلمك معالجة ذهنية لأحداث اليوم وضغوطها بهدف إعادة التوازن الداخلي.')
      : (primarySymbol ? primarySymbol.themes : 'Your psyche is actively processing recent waking experiences to restore emotional balance.'),
    reflectionQuestion: isAr
      ? (primarySymbol ? primarySymbol.promptsAr[0] : 'ما هو الحدث الأبرز الذي ترك أثراً في نفسك قبل النوم؟')
      : (primarySymbol ? primarySymbol.prompts[0] : 'What unresolved moment from your day might your subconscious be revisiting?'),
    culturalNote: isAr
      ? (primarySymbol ? primarySymbol.traditionAr : 'تدوين الأحلام يساعد في تنظيم الأفكار وتصفية الذهن.')
      : (primarySymbol ? primarySymbol.tradition : 'Dream journaling provides clarity and mental grounding over time.'),
  };
}
