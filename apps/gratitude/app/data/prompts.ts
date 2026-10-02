// ThreeGood prompt library: 60 gratitude prompts across 6 themes (10 each).
// Written for the app (warm, specific, non-cheesy). Rotated deterministically
// by day so day 47 never feels like day 1.

export type PromptTheme = 'people' | 'senses' | 'small-wins' | 'nature' | 'challenges' | 'wonder';

export interface Prompt {
  id: string;
  theme: PromptTheme;
  en: string;
  ar: string;
}

export const THEMES: PromptTheme[] = ['people', 'senses', 'small-wins', 'nature', 'challenges', 'wonder'];

// Free tier unlocks these themes; the other three are Pro.
export const FREE_THEMES: PromptTheme[] = ['people', 'senses', 'small-wins'];

const p = (id: string, theme: PromptTheme, en: string, ar: string): Prompt => ({ id, theme, en, ar });

export const PROMPTS: Prompt[] = [
  // ——— people ———
  p('people-1', 'people', 'Someone who made you smile today', 'شخص جعلك تبتسم اليوم'),
  p('people-2', 'people', 'A person who believes in you', 'شخص يؤمن بك'),
  p('people-3', 'people', 'An old friend you have been thinking of', 'صديق قديم تفكر فيه هذه الأيام'),
  p('people-4', 'people', 'Someone who helped you recently', 'شخص ساعدك مؤخراً'),
  p('people-5', 'people', 'A small kindness from a stranger', 'لطف صغير من غريب'),
  p('people-6', 'people', 'Someone who taught you something', 'شخص علّمك شيئاً'),
  p('people-7', 'people', 'A family member you appreciate', 'فرد من عائلتك تقدّره'),
  p('people-8', 'people', 'Someone you laughed with this week', 'شخص ضحكت معه هذا الأسبوع'),
  p('people-9', 'people', 'A mentor, teacher, or role model', 'مرشد أو معلم أو قدوة'),
  p('people-10', 'people', 'Someone who forgave you', 'شخص سامحك'),

  // ——— senses ———
  p('senses-1', 'senses', 'A taste you enjoyed today', 'مذاق استمتعت به اليوم'),
  p('senses-2', 'senses', 'A sound that comforted you', 'صوت أراحك'),
  p('senses-3', 'senses', 'Something beautiful you saw', 'شيء جميل رأيته'),
  p('senses-4', 'senses', 'A smell that took you somewhere good', 'رائحة أخذتك إلى مكان جميل'),
  p('senses-5', 'senses', 'The feeling of warm water', 'شعور الماء الدافئ'),
  p('senses-6', 'senses', 'Your favorite song right now', 'أغنيتك المفضلة حالياً'),
  p('senses-7', 'senses', 'The texture of something you touched', 'ملمس شيء لمسته اليوم'),
  p('senses-8', 'senses', 'Morning light through the window', 'ضوء الصباح من النافذة'),
  p('senses-9', 'senses', 'A meal that really hit the spot', 'وجبة أشبعتك تماماً'),
  p('senses-10', 'senses', 'Quiet after a noisy day', 'الهدوء بعد يوم صاخب'),

  // ——— small-wins ———
  p('smallwins-1', 'small-wins', 'Something you finished today', 'شيء أنجزته اليوم'),
  p('smallwins-2', 'small-wins', 'A problem you solved', 'مشكلة قمت بحلها'),
  p('smallwins-3', 'small-wins', 'A habit you are keeping', 'عادة تحافظ عليها'),
  p('smallwins-4', 'small-wins', 'Something you did for your health', 'شيء فعلته من أجل صحتك'),
  p('smallwins-5', 'small-wins', 'A bill you were able to pay', 'فاتورة استطعت دفعها'),
  p('smallwins-6', 'small-wins', 'Something you learned this week', 'شيء تعلمته هذا الأسبوع'),
  p('smallwins-7', 'small-wins', 'A fear you faced', 'خوف واجهته'),
  p('smallwins-8', 'small-wins', 'Your tidy room, desk, or inbox', 'غرفتك أو مكتبك أو بريدك المرتب'),
  p('smallwins-9', 'small-wins', 'Getting somewhere on time', 'وصولك في الموعد'),
  p('smallwins-10', 'small-wins', 'Saying no when you needed to', 'قولك "لا" عندما احتجت إلى ذلك'),

  // ——— nature ———
  p('nature-1', 'nature', 'The sky today', 'سماء اليوم'),
  p('nature-2', 'nature', 'A tree or plant you noticed', 'شجرة أو نبتة لاحظتها'),
  p('nature-3', 'nature', 'Fresh air on your face', 'هواء نقي على وجهك'),
  p('nature-4', 'nature', 'Rain, sun, or wind you felt', 'مطر أو شمس أو نسيم شعرت به'),
  p('nature-5', 'nature', 'A bird, cat, or other creature', 'طير أو قطة أو مخلوق آخر'),
  p('nature-6', 'nature', 'The season you are in', 'الفصل الذي تعيشه الآن'),
  p('nature-7', 'nature', 'The stars or the moon', 'النجوم أو القمر'),
  p('nature-8', 'nature', 'Water — sea, river, or tap', 'الماء — بحر أو نهر أو صنبور'),
  p('nature-9', 'nature', 'The color of a flower', 'لون زهرة ما'),
  p('nature-10', 'nature', 'The ground under your feet', 'الأرض تحت قدميك'),

  // ——— challenges ———
  p('challenges-1', 'challenges', 'A hard thing that taught you', 'شيء صعب علّمك درساً'),
  p('challenges-2', 'challenges', 'A setback you are growing from', 'انتكاسة تنمو منها'),
  p('challenges-3', 'challenges', 'Something difficult you survived', 'شيء صعب تجاوزته'),
  p('challenges-4', 'challenges', 'A weakness you are working on', 'نقطة ضعف تعمل على تحسينها'),
  p('challenges-5', 'challenges', 'A "no" that redirected you well', '"لا" غيّرت مسارك نحو الأفضل'),
  p('challenges-6', 'challenges', 'A mistake that made you wiser', 'خطأ جعلك أكثر حكمة'),
  p('challenges-7', 'challenges', 'Patience you are practicing', 'صبر تمارسه هذه الأيام'),
  p('challenges-8', 'challenges', 'Something you are still figuring out', 'شيء ما زلت تحاول فهمه'),
  p('challenges-9', 'challenges', 'A burden that got lighter', 'عبء خفّ عن كاهلك'),
  p('challenges-10', 'challenges', 'Your own resilience', 'صمودك أنت'),

  // ——— wonder ———
  p('wonder-1', 'wonder', 'Something that amazed you lately', 'شيء أدهشك مؤخراً'),
  p('wonder-2', 'wonder', 'A coincidence that felt like a gift', 'مصادفة بدت كأنها هدية'),
  p('wonder-3', 'wonder', 'Something bigger than you', 'شيء أكبر منك'),
  p('wonder-4', 'wonder', 'A memory you treasure', 'ذكرى تعتز بها'),
  p('wonder-5', 'wonder', 'Hope you hold for tomorrow', 'أمل تحتفظ به للغد'),
  p('wonder-6', 'wonder', 'Something free that you enjoy', 'شيء مجاني تستمتع به'),
  p('wonder-7', 'wonder', 'The fact that you are here, reading this', 'حقيقة أنك هنا تقرأ هذا'),
  p('wonder-8', 'wonder', 'A dream you are holding onto', 'حلم تتمسك به'),
  p('wonder-9', 'wonder', 'Laughter — yours or someone else’s', 'الضحك — ضحكتك أو ضحكة أحدهم'),
  p('wonder-10', 'wonder', 'An ordinary moment that felt rich', 'لحظة عادية بدت غنية بالمعنى'),
];

/**
 * Today's 3 prompts, deterministic by local day. The flattened pool is
 * interleaved across themes (t0p0, t1p0, …) so consecutive days draw from
 * different themes and the rotation never repeats within 20/60 days.
 * ponytail: O(n) build once per call is fine — 60 items, called on render.
 */
export function promptsForDay(dayIndex: number, pro: boolean): Prompt[] {
  const themes = pro ? THEMES : FREE_THEMES;
  const pool: Prompt[] = [];
  for (let round = 0; round < 10; round++) {
    for (const theme of themes) {
      const found = PROMPTS.find((x) => x.theme === theme && x.id.endsWith(`-${round + 1}`));
      if (found) pool.push(found);
    }
  }
  const out: Prompt[] = [];
  for (let s = 0; s < 3; s++) {
    const pick = pool[(dayIndex * 3 + s) % pool.length];
    if (pick) out.push(pick);
  }
  return out;
}
