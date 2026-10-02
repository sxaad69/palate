import * as Speech from 'expo-speech';
import { getLang } from './i18n';

// On-device TTS storyteller. No streaming, no API cost, works offline.
// Guidance density is the differentiator: Full narrates story beats,
// Minimal speaks only phase cues, Silent is text + visuals + haptics.
export type GuidanceDensity = 'full' | 'minimal' | 'silent';

let density: GuidanceDensity = 'minimal';

export function setGuidanceDensity(d: GuidanceDensity) {
  density = d;
}

export function getGuidanceDensity(): GuidanceDensity {
  return density;
}

const PHASE_CUES: Record<string, { en: string; ar: string }> = {
  inhale: { en: 'breathe in', ar: 'شهيق' },
  hold: { en: 'hold', ar: 'احبس' },
  exhale: { en: 'let go', ar: 'زفير' },
  rest: { en: 'rest', ar: 'استرح' },
};

export async function stopNarration(): Promise<void> {
  try {
    await Speech.stop();
  } catch {
    // never break a session over TTS
  }
}

/** Speak a story beat (full density only). */
export function narrateBeat(text: string): void {
  if (density !== 'full') return;
  const lang = getLang();
  Speech.speak(text, {
    language: lang === 'ar' ? 'ar-SA' : 'en-US',
    rate: 0.92, // unhurried storyteller pace
    onError: () => {},
  });
}

/** Speak a short phase cue (full + minimal density). */
export function cuePhase(phase: keyof typeof PHASE_CUES): void {
  if (density === 'silent') return;
  const lang = getLang();
  const text = PHASE_CUES[phase]?.[lang];
  if (!text) return;
  Speech.speak(text, {
    language: lang === 'ar' ? 'ar-SA' : 'en-US',
    rate: 0.95,
    onError: () => {},
  });
}

/** Session intro line, spoken once at session start (full density). */
export function narrateIntro(text: string): void {
  if (density !== 'full') return;
  const lang = getLang();
  Speech.speak(text, {
    language: lang === 'ar' ? 'ar-SA' : 'en-US',
    rate: 0.9,
    onError: () => {},
  });
}
