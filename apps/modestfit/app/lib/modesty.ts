import type { Hem, ModestyPrefs, PieceDef, Sleeve } from '../data/pieces';

// Differentiator #1: modesty-first outfit checker. No competitor does this
// systematically — every piece carries coverage attributes and every outfit
// is checked against the user's own minimums.

const SLEEVE_RANK: Record<Sleeve, number> = {
  sleeveless: 0,
  short: 1,
  threeQuarter: 2,
  long: 3,
  na: 99, // hijabs/skirts/trousers: sleeve doesn't apply
};

const HEM_RANK: Record<Hem, number> = {
  short: 0,
  knee: 1,
  midi: 2,
  maxi: 3,
  floor: 4,
  na: 99, // hijabs: hem doesn't apply
};

export type ModestyIssue =
  | { kind: 'sleeve'; pieceId: string }
  | { kind: 'hem'; pieceId: string }
  | { kind: 'sheer'; pieceId: string };

/** Pieces that fail a user's modesty preferences, with per-piece reasons. */
export function checkOutfit(pieces: PieceDef[], prefs: ModestyPrefs): ModestyIssue[] {
  const issues: ModestyIssue[] = [];
  for (const piece of pieces) {
    if (SLEEVE_RANK[piece.sleeve] < SLEEVE_RANK[prefs.minSleeve]) {
      issues.push({ kind: 'sleeve', pieceId: piece.id });
    }
    if (HEM_RANK[piece.hem] < HEM_RANK[prefs.minHem]) {
      issues.push({ kind: 'hem', pieceId: piece.id });
    }
    if (prefs.sheer === 'opaqueOnly' && piece.opacity !== 'opaque') {
      issues.push({ kind: 'sheer', pieceId: piece.id });
    } else if (prefs.sheer === 'allowSemi' && piece.opacity === 'sheer') {
      issues.push({ kind: 'sheer', pieceId: piece.id });
    }
  }
  return issues;
}

export function meetsPrefs(piece: PieceDef, prefs: ModestyPrefs): boolean {
  return checkOutfit([piece], prefs).length === 0;
}
