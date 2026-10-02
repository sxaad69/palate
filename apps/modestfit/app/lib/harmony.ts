import type { ColorKey } from '../data/pieces';

// Differentiator #2: hijab pairing engine. Pure local color-harmony rules —
// no AI, no API, zero cost. Neutrals pair with anything; tonal matches
// (same family) score highest; classic complements score next.

const NEUTRALS: ReadonlySet<ColorKey> = new Set([
  'black',
  'white',
  'ivory',
  'beige',
  'sand',
  'grey',
  'taupe',
  'brown',
]);

const COMPLEMENTS: Partial<Record<ColorKey, ColorKey[]>> = {
  navy: ['sand', 'beige', 'ivory'],
  olive: ['rose', 'ivory', 'beige'],
  rose: ['olive', 'grey', 'taupe'],
  black: ['white', 'ivory', 'rose'],
  white: ['black', 'navy', 'olive'],
  brown: ['ivory', 'beige', 'rose'],
};

export function isNeutral(c: ColorKey): boolean {
  return NEUTRALS.has(c);
}

/**
 * Harmony score of a hijab color against the base outfit colors.
 * Higher = better pairing. Deterministic so suggestions are stable.
 */
export function hijabScore(hijab: ColorKey, baseColors: ColorKey[]): number {
  let score = 0;
  for (const base of baseColors) {
    if (hijab === base) {
      score += isNeutral(hijab) ? 3 : 5; // tonal monochrome
    } else if (isNeutral(hijab)) {
      score += 4; // neutrals go with everything
    } else if (COMPLEMENTS[base]?.includes(hijab)) {
      score += 3;
    } else if (isNeutral(base)) {
      score += 2; // colorful hijab over neutral base is safe
    } else {
      score += 1;
    }
  }
  return score;
}
