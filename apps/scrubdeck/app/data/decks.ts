// Bundled NCLEX-style study decks. Concise, high-yield, exam-framed.
// Study aid only — not medical advice.

export interface Card {
  id: string;
  front: string;
  back: string;
  tag?: 'high-yield' | 'priority' | 'labs';
}

export interface Deck {
  id: string;
  titleEn: string;
  titleAr: string;
  free: boolean;
  cards: Card[];
}

const fundamentals: Card[] = [
  { id: 'f01', tag: 'labs', front: 'Normal adult vital signs?', back: 'BP <120/80 mmHg · HR 60–100 · RR 12–20 · Temp 36.1–37.2°C · SpO₂ ≥95%' },
  { id: 'f02', front: 'Order of the nursing process (ADPIE)?', back: 'Assessment → Diagnosis → Planning → Implementation → Evaluation' },
  { id: 'f03', tag: 'priority', front: 'Patient falls — your FIRST action?', back: 'Stay with the patient and assess for injury BEFORE calling for help or moving them.' },
  { id: 'f04', tag: 'high-yield', front: 'Single most important infection-control action?', back: 'Hand hygiene — prevents healthcare-associated infections more than anything else.' },
  { id: 'f05', tag: 'priority', front: 'Maslow: which patient do you see first?', back: 'Physiological needs first — airway, breathing, circulation. An ABC problem beats everything.' },
  { id: 'f06', tag: 'labs', front: 'Normal potassium (K⁺)? Signs of imbalance?', back: '3.5–5.0 mEq/L. Low: muscle cramps, U-waves. High: peaked T-waves, cardiac arrest risk.' },
  { id: 'f07', tag: 'labs', front: 'Normal sodium (Na⁺)?', back: '135–145 mEq/L. Low: confusion, seizures. High: thirst, dry mucosa, restlessness.' },
  { id: 'f08', tag: 'labs', front: 'Therapeutic INR on warfarin?', back: '2.0–3.0 (up to 3.5 for mechanical valves). High INR = bleeding risk.' },
  { id: 'f09', front: 'When do you take an apical pulse — and for how long?', back: 'Before digoxin (hold if <60 bpm) and always a FULL 60 seconds.' },
  { id: 'f10', front: "Fowler's position = how many degrees?", back: 'Semi-Fowler\u2019s 30–45°, Fowler\u2019s 45–60°, High Fowler\u2019s 90°. Helps breathing and feeding.' },
  { id: 'f11', tag: 'priority', front: 'The nurse\u2019s role in informed consent?', back: 'Witness only — confirm the patient is informed and signs voluntarily. The PROVIDER explains the procedure.' },
  { id: 'f12', front: 'Normal adult urine output per hour?', back: '≥30 mL/hr. Below that = report it (possible renal failure or shock).' },
];

const pharmacology: Card[] = [
  { id: 'p01', tag: 'high-yield', front: 'Drug suffix "-olol" → class? Nursing watch-outs?', back: 'Beta blockers (metoprolol, atenolol). Monitor HR & BP — hold if HR <60 or SBP <100.' },
  { id: 'p02', tag: 'high-yield', front: 'Drug suffix "-pril" → class? Key side effects?', back: 'ACE inhibitors (lisinopril). Dry cough, angioedema, hyperkalemia. Avoid in pregnancy.' },
  { id: 'p03', tag: 'high-yield', front: 'Drug suffix "-statin" → use? Teaching points?', back: 'HMG-CoA reductase inhibitors — lower cholesterol. Take in the EVENING; report muscle pain; monitor liver.' },
  { id: 'p04', tag: 'high-yield', front: 'Signs of digoxin toxicity? Therapeutic range?', back: 'Vision changes (yellow-green halos), N/V, bradycardia. Range: 0.8–2.0 ng/mL. Antidote: digoxin immune Fab.' },
  { id: 'p05', tag: 'high-yield', front: 'Antidotes: warfarin vs heparin overdose?', back: 'Warfarin → vitamin K. Heparin → protamine sulfate.' },
  { id: 'p06', front: 'Insulin peaks: rapid-acting (lispro) vs NPH?', back: 'Lispro: onset 15 min, peak 1 hr. NPH (intermediate): peak 4–12 hrs — hypoglycemia risk then.' },
  { id: 'p07', tag: 'priority', front: 'Signs of hypoglycemia? Immediate treatment?', back: 'Cold/clammy, tachycardia, confusion ("cold and clammy needs candy"). Give 15g fast carbs, recheck in 15 min.' },
  { id: 'p08', tag: 'high-yield', front: 'Suffix "-azepam"/"-azolam" → class? Antidote?', back: 'Benzodiazepines (lorazepam, midazolam). Antidote: flumazenil. Watch respirations.' },
  { id: 'p09', front: 'Furosemide (Lasix): class + top watch-outs?', back: 'Loop diuretic. Wastes K⁺ (monitor!), ototoxicity with rapid IV push, give in the morning.' },
  { id: 'p10', front: 'Metformin: when do you HOLD it?', back: 'Hold before iodinated contrast dye (lactic acidosis risk) and during acute illness/dehydration. Take with food.' },
  { id: 'p11', tag: 'priority', front: 'Opioid overdose signs? Antidote?', back: 'Pinpoint pupils, respiratory depression, unconsciousness. Antidote: naloxone (Narcan).' },
  { id: 'p12', tag: 'high-yield', front: 'Suffix "-sone"/"-olone" → class? Nursing implications?', back: 'Corticosteroids (prednisone). Never stop abruptly (taper!), monitor glucose, give with food.' },
];

const medsurg: Card[] = [
  { id: 'm01', tag: 'priority', front: 'Classic MI presentation? First nursing actions (MONA)?', back: 'Crushing chest pain → left arm/jaw, diaphoresis, nausea. MONA: Morphine, O₂, Nitroglycerin, Aspirin.' },
  { id: 'm02', tag: 'high-yield', front: 'Stroke: FAST? tPA window?', back: 'Face droop, Arm drift, Speech difficulty, Time to call. tPA within 3–4.5 hours of onset.' },
  { id: 'm03', tag: 'high-yield', front: 'DKA: hallmark signs? Treatment?', back: 'Kussmaul respirations, fruity breath, glucose >250. Treatment: IV regular insulin + fluids + correct K⁺.' },
  { id: 'm04', front: 'Left-sided vs right-sided heart failure signs?', back: 'LEFT = lungs (crackles, dyspnea, pink frothy sputum). RIGHT = systemic (JVD, peripheral edema, hepatomegaly).' },
  { id: 'm05', front: 'COPD nursing priorities?', back: 'Pursed-lip breathing, O₂ at 1–2 L/min (CO₂ retainers!), barrel chest. Never high-flow O₂.' },
  { id: 'm06', tag: 'priority', front: 'Tension pneumothorax: key signs?', back: 'Absent breath sounds + tracheal deviation AWAY from affected side + hyperresonance. Chest tube needed.' },
  { id: 'm07', tag: 'priority', front: 'Post-op: most dangerous EARLY complication?', back: 'Hemorrhage — check vitals and dressing frequently in the first 24 hrs. Then infection.' },
  { id: 'm08', front: 'NG tube placement: gold-standard check?', back: 'X-ray. Bedside: aspirate pH ≤5.5. Never use the "whoosh" air test.' },
  { id: 'm09', tag: 'high-yield', front: 'DI vs SIADH — how do you tell them apart?', back: 'DI: huge dilute urine output, hypernatremia, thirsty. SIADH: fluid retained, concentrated urine, hyponatremia.' },
  { id: 'm10', tag: 'high-yield', front: "Addison's vs Cushing's?", back: 'Addison\u2019s (low cortisol): hypotension, bronze skin, K⁺ up, Na⁺ down. Cushing\u2019s (high): moon face, buffalo hump, hyperglycemia.' },
  { id: 'm11', front: 'Burns: Rule of Nines?', back: 'Head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%.' },
  { id: 'm12', tag: 'priority', front: 'EARLIEST signs of shock?', back: 'Tachycardia and restlessness/anxiety — before BP drops. Rising HR + anxious patient = act now.' },
];

const maternalPeds: Card[] = [
  { id: 'o01', tag: 'high-yield', front: 'APGAR stands for? Normal score?', back: 'Appearance, Pulse, Grimace, Activity, Respiration. 7–10 normal, 4–6 moderate, 0–3 resuscitate.' },
  { id: 'o02', tag: 'priority', front: 'Preeclampsia: defining signs? Seizure drug?', back: 'HTN + proteinuria after 20 weeks. Seizure prevention: magnesium sulfate (watch for toxicity: loss of reflexes).' },
  { id: 'o03', front: 'Postpartum fundal check: what\u2019s normal? Boggy uterus = ?', back: 'Firm, midline, at/below umbilicus. Boggy → MASSAGE the fundus (atony = #1 hemorrhage cause).' },
  { id: 'o04', front: "Naegele's rule for due date?", back: 'First day of LMP: +7 days, −3 months, +1 year.' },
  { id: 'o05', tag: 'labs', front: 'Normal fetal heart rate?', back: '110–160 bpm. Bradycardia <110 or tachy >160 = notify provider.' },
  { id: 'o06', tag: 'labs', front: 'Normal newborn vitals?', back: 'HR 110–160, RR 30–60, Temp 36.5–37.5°C.' },
  { id: 'o07', front: 'First Hep B vaccine: when?', back: 'At birth (within 24 hours).' },
  { id: 'o08', tag: 'priority', front: 'Earliest signs of dehydration in an infant?', back: 'Sunken fontanel, fewer wet diapers, no tears when crying, dry mucosa.' },
  { id: 'o09', front: 'Birth weight milestones?', back: 'Doubles by 6 months, triples by 12 months.' },
  { id: 'o10', tag: 'high-yield', front: 'Eclampsia treatment? MgSO₄ toxicity antidote?', back: 'Magnesium sulfate stops seizures. Toxicity signs: ↓reflexes, ↓RR, ↓urine. Antidote: calcium gluconate.' },
  { id: 'o11', tag: 'high-yield', front: 'Placenta previa vs abruptio placentae?', back: 'PREVIA: painless, bright-red bleeding. ABRUPTIO: painful, dark-red bleeding, rigid board-like abdomen.' },
  { id: 'o12', tag: 'priority', front: '#1 cause of postpartum hemorrhage?', back: 'Uterine atony (boggy uterus) — massage fundus, ensure bladder is empty.' },
];

export const DECKS: Deck[] = [
  { id: 'fundamentals', titleEn: 'Fundamentals', titleAr: 'أساسيات التمريض', free: true, cards: fundamentals },
  { id: 'pharmacology', titleEn: 'Pharmacology', titleAr: 'علم الأدوية', free: false, cards: pharmacology },
  { id: 'medsurg', titleEn: 'Med-Surg', titleAr: 'الباطنية والجراحة', free: false, cards: medsurg },
  { id: 'maternal-peds', titleEn: 'Maternal & Peds', titleAr: 'الأمومة والأطفال', free: false, cards: maternalPeds },
];

export const ALL_CARDS: Card[] = DECKS.flatMap((d) => d.cards);

export function deckOf(cardId: string): Deck | undefined {
  return DECKS.find((d) => d.cards.some((c) => c.id === cardId));
}
