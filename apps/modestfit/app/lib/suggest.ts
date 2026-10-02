import type { ModestyPrefs, Occasion, OwnedPiece } from '../data/pieces';
import { meetsPrefs } from './modesty';
import { hijabScore } from './harmony';

export interface Suggestion {
  key: string;
  baseIds: string[];
  hijabId: string;
  hijabScore: number;
}

/**
 * "Shop your closet" — combos from OWNED pieces only, filtered by occasion
 * and the user's modesty prefs. Bases are either a single full-coverage
 * piece (abaya/dress) or a top + bottom pair.
 *
 * ponytail: naive O(tops × bottoms × hijabs) scan with a hard cap. Wardrobes
 * are small (free ≤ 20 pieces); fine for v1. Upgrade path: precompute
 * combos when the wardrobe changes if lists ever get long.
 */
export function generateSuggestions(
  pieces: OwnedPiece[],
  occasion: Occasion,
  prefs: ModestyPrefs,
  limit = 6,
): Suggestion[] {
  const owned = pieces.filter((p) => p.occasions.includes(occasion) && meetsPrefs(p, prefs));
  const hijabs = owned.filter((p) => p.category === 'hijab');
  if (hijabs.length === 0) return [];

  const solo = owned.filter((p) => p.category === 'abaya' || p.category === 'dress');
  const tops = owned.filter((p) => p.category === 'top' || p.category === 'outerwear');
  const bottoms = owned.filter((p) => p.category === 'skirt' || p.category === 'trousers');

  const bases: string[][] = solo.map((s) => [s.id]);
  const MAX_PAIRS = 24;
  outer: for (const top of tops) {
    for (const bottom of bottoms) {
      bases.push([top.id, bottom.id]);
      if (bases.length >= solo.length + MAX_PAIRS) break outer;
    }
  }
  if (bases.length === 0) return [];

  const out: Suggestion[] = [];
  for (const baseIds of bases) {
    const baseColors = baseIds
      .map((id) => owned.find((p) => p.id === id)?.colorKey)
      .filter((c): c is NonNullable<typeof c> => !!c);
    const ranked = hijabs
      .filter((h) => !baseIds.includes(h.id))
      .map((h) => ({ h, score: hijabScore(h.colorKey, baseColors) }))
      .sort((a, b) => b.score - a.score || a.h.name.en.localeCompare(b.h.name.en));
    const best = ranked[0];
    if (!best) continue;
    out.push({ key: `${baseIds.join('+')}:${best.h.id}`, baseIds, hijabId: best.h.id, hijabScore: best.score });
  }

  // Deterministic "shuffle": rotate by occasion so each occasion's top
  // picks differ without randomness (stable across renders).
  const offset = occasion.length % Math.max(1, out.length);
  const rotated = [...out.slice(offset), ...out.slice(0, offset)];
  return rotated.slice(0, limit);
}
