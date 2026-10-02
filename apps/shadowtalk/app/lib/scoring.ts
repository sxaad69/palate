/**
 * Pronunciation scoring — honest v1, extensible future.
 *
 * Real automated pronunciation scoring (comparing a learner's voice to a
 * reference at phoneme level) needs on-device STT/scoring that is not
 * feasible in managed Expo without native modules or a paid cloud API.
 * We do NOT ship fake "AI scores": v1 is TTS model + user recording +
 * side-by-side compare + self-scored stars.
 *
 * The interface below is the documented insertion point: when an on-device
 * scorer becomes available (e.g. a lightweight Wav2Vec2/TFLite phoneme
 * model packaged as an Expo module), implement `ScoringProvider` and swap
 * the export in one place. See BUILD_NOTES.md.
 */
export interface ScoringInput {
  /** Local URI of the learner's recording (m4a). */
  attemptUri: string;
  /** Reference text the learner was trying to say. */
  referenceText: string;
  /** BCP-47 of the target language, e.g. 'en-US' or 'ar-SA'. */
  language: string;
}

export interface ScoringResult {
  /** 1–5 stars, comparable with the self-score scale already in the UI. */
  stars: number;
  /** Machine-readable detail for future UI; null in v1. */
  detail: string | null;
  /** True when the score came from a real scorer; false for the null provider. */
  scoredByModel: boolean;
}

export interface ScoringProvider {
  readonly name: string;
  score(input: ScoringInput): Promise<ScoringResult>;
}

/** v1 provider: no automated scoring. The UI never shows machine scores. */
export class NullScoringProvider implements ScoringProvider {
  readonly name = 'null';
  async score(_input: ScoringInput): Promise<ScoringResult> {
    return { stars: 0, detail: null, scoredByModel: false };
  }
}

export const scoringProvider: ScoringProvider = new NullScoringProvider();
