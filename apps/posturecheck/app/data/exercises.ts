import type { AngleKey } from '../lib/pose';

export interface Exercise {
  id: string;
  name: { en: string; ar: string };
  instructions: { en: string; ar: string };
  minutes: number;
  targets: AngleKey[];
}

// 12 desk-posture exercises. Each maps to the angle(s) it corrects so the
// results screen can prescribe from the actual weak angles — not generic advice.
export const EXERCISES: Exercise[] = [
  {
    id: 'chin-tucks',
    name: { en: 'Chin Tucks', ar: 'سحب الذقن' },
    instructions: {
      en: 'Sit tall. Glide your chin straight back, making a double chin — do not tilt the head down. Hold 5 seconds, release. Repeat 10 times, twice a day.',
      ar: 'اجلس باستقامة. اسحب ذقنك للخلف مباشرة دون إمالة الرأس للأسفل. اثبت 5 ثوانٍ ثم أرخِ. كرر 10 مرات، مرتين يومياً.',
    },
    minutes: 3,
    targets: ['headForward'],
  },
  {
    id: 'neck-side-stretch',
    name: { en: 'Neck Side Stretch', ar: 'تمدد الرقبة الجانبي' },
    instructions: {
      en: 'Sit tall, tilt your right ear toward your right shoulder until you feel a gentle stretch. Hold 20 seconds each side. Keep shoulders down.',
      ar: 'اجلس باستقامة، وأمِل أذنك اليمنى نحو كتفك الأيمن حتى تشعر بتمدد لطيف. اثبت 20 ثانية لكل جهة مع إبقاء الكتفين منخفضين.',
    },
    minutes: 2,
    targets: ['headForward'],
  },
  {
    id: 'wall-angels',
    name: { en: 'Wall Angels', ar: 'ملائكة الحائط' },
    instructions: {
      en: 'Stand with back, head and arms against a wall, elbows bent. Slide arms up overhead keeping contact with the wall, then back down. 10 slow reps.',
      ar: 'قف وظهرك ورأسك وذراعاك على الحائط مع ثني المرفقين. حرّك ذراعيك للأعلى مع الحفاظ على ملامسة الحائط ثم أنزلهما. 10 تكرارات ببطء.',
    },
    minutes: 4,
    targets: ['shoulderLean'],
  },
  {
    id: 'doorway-stretch',
    name: { en: 'Doorway Chest Stretch', ar: 'تمدد الصدر عند الباب' },
    instructions: {
      en: 'Place forearms on a doorframe, elbows at shoulder height. Step through until you feel your chest open. Hold 30 seconds, repeat 3 times.',
      ar: 'ضع ساعديك على إطار الباب والمرفقان بمستوى الكتفين. اخطُ للأمام حتى تشعر بانفتاح صدرك. اثبت 30 ثانية وكرر 3 مرات.',
    },
    minutes: 3,
    targets: ['shoulderLean'],
  },
  {
    id: 'thoracic-extension',
    name: { en: 'Thoracic Extension over Chair', ar: 'تمدد أعلى الظهر فوق الكرسي' },
    instructions: {
      en: 'Sit, clasp hands behind your head. Lean back over the chair top, opening your chest to the ceiling. Hold 5 seconds, repeat 8 times.',
      ar: 'اجلس واشبك يديك خلف رأسك. مِل للخلف فوق ظهر الكرسي فاتحاً صدرك للسقف. اثبت 5 ثوانٍ وكرر 8 مرات.',
    },
    minutes: 3,
    targets: ['shoulderLean'],
  },
  {
    id: 'shoulder-rolls',
    name: { en: 'Shoulder Rolls', ar: 'تدوير الكتفين' },
    instructions: {
      en: 'Lift shoulders to your ears, roll them back and down in slow circles. 10 backward, 10 forward. Do this every hour at your desk.',
      ar: 'ارفع كتفيك نحو أذنيك ثم دوّرهما للخلف والأسفل بحركات دائرية بطيئة. 10 للخلف و10 للأمام. كرر كل ساعة على مكتبك.',
    },
    minutes: 2,
    targets: ['shoulderLean'],
  },
  {
    id: 'cat-cow',
    name: { en: 'Cat-Cow', ar: 'وضعية القطة والبقرة' },
    instructions: {
      en: 'On all fours, arch your back down and lift your head (cow), then round your back up and tuck your chin (cat). Flow slowly for 1 minute.',
      ar: 'على يديك وركبتيك، قوّس ظهرك للأسفل وارفع رأسك، ثم قوّسه للأعلى واسحب ذقنك. تحرك ببطء لمدة دقيقة.',
    },
    minutes: 2,
    targets: ['shoulderLean', 'hipOffset'],
  },
  {
    id: 'hip-flexor-stretch',
    name: { en: 'Kneeling Hip-Flexor Stretch', ar: 'تمدد عضلات الورك' },
    instructions: {
      en: 'Half-kneel, tuck your pelvis under and shift forward until the front of your back hip stretches. Hold 30 seconds each side.',
      ar: 'اركع على ركبة واحدة، واسحب حوضك للداخل ثم مِل للأمام حتى تشعر بتمدد مقدمة الورك الخلفية. اثبت 30 ثانية لكل جهة.',
    },
    minutes: 4,
    targets: ['hipOffset'],
  },
  {
    id: 'glute-bridges',
    name: { en: 'Glute Bridges', ar: 'جسور الأرداف' },
    instructions: {
      en: 'Lie on your back, knees bent, feet flat. Squeeze your glutes and lift your hips until knees-hips-shoulders align. 12 reps, 2 sets.',
      ar: 'استلقِ على ظهرك مع ثني الركبتين. اعصر أردافك وارفع وركيك حتى تستقيم الركبتان والوركان والكتفان. 12 تكراراً، مجموعتان.',
    },
    minutes: 5,
    targets: ['hipOffset'],
  },
  {
    id: 'pelvic-tilts',
    name: { en: 'Standing Pelvic Tilts', ar: 'إمالة الحوض وقوفاً' },
    instructions: {
      en: 'Stand with back against a wall. Flatten your lower back into the wall by tilting your pelvis, hold 5 seconds. 10 reps.',
      ar: 'قف وظهرك على الحائط. الصق أسفل ظهرك بالحائط بإمالة حوضك، اثبت 5 ثوانٍ. 10 تكرارات.',
    },
    minutes: 3,
    targets: ['hipOffset'],
  },
  {
    id: 'quad-stretch',
    name: { en: 'Standing Quad Stretch', ar: 'تمدد الفخذ الأمامي وقوفاً' },
    instructions: {
      en: 'Hold a wall for balance, pull one foot to your glute, knees together. Hold 30 seconds each leg. Keeps the knee tracking straight.',
      ar: 'تمسك بالحائط للتوازن واسحب قدمك نحو الأرداف مع تقارب الركبتين. اثبت 30 ثانية لكل ساق.',
    },
    minutes: 3,
    targets: ['kneeAngle'],
  },
  {
    id: 'hamstring-stretch',
    name: { en: 'Wall Hamstring Stretch', ar: 'تمدد أوتار الركبة' },
    instructions: {
      en: 'Lie on your back, one heel up a wall, leg straight. Scoot closer until you feel a firm stretch behind the thigh. 30 seconds each leg.',
      ar: 'استلقِ على ظهرك وضع كعبك على الحائط والساق مستقيمة. اقترب حتى تشعر بتمدد خلف الفخذ. 30 ثانية لكل ساق.',
    },
    minutes: 4,
    targets: ['kneeAngle'],
  },
];

/** Prescribe exercises from weak angles: poor angles first, deduped. */
export function prescribeFor(weakAngles: AngleKey[], limit = 4): Exercise[] {
  const out: Exercise[] = [];
  for (const angle of weakAngles) {
    for (const ex of EXERCISES) {
      if (ex.targets.includes(angle) && !out.includes(ex)) {
        out.push(ex);
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}
