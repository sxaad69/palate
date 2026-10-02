// lib/pose.ts — honest posture geometry for StraightUp.
//
// v1 HONESTY CONTRACT (see BUILD_NOTES.md): there is no on-device ML pose
// estimation in managed Expo without native modules, so v1 does NOT ship
// fake AI scores. The user places 5 anatomical markers by hand and THIS
// module computes real 2D geometry from those positions. The score is a
// transparent, documented formula — shown in-app — not a black box.
//
// ponytail: 2D side-profile only; assumes the photo is taken from the side
// at hip height (the capture screen enforces this via guides). Marker
// placement error is the dominant noise source — hence wide "watch" bands.

export type LandmarkKey = 'ear' | 'shoulder' | 'hip' | 'knee' | 'ankle';

/** Normalized 0..1 photo coordinates, origin top-left (matches RN layout). */
export interface Landmark {
  x: number;
  y: number;
}

export const LANDMARK_ORDER: LandmarkKey[] = ['ear', 'shoulder', 'hip', 'knee', 'ankle'];

export const DEFAULT_LANDMARKS: Record<LandmarkKey, Landmark> = {
  ear: { x: 0.52, y: 0.1 },
  shoulder: { x: 0.55, y: 0.28 },
  hip: { x: 0.55, y: 0.52 },
  knee: { x: 0.56, y: 0.75 },
  ankle: { x: 0.55, y: 0.95 },
};

export type AngleKey = 'headForward' | 'shoulderLean' | 'kneeAngle' | 'hipOffset';

// ---------------------------------------------------------------------------
// Provider interface — the insertion point for future on-device ML.
// ---------------------------------------------------------------------------

/**
 * A PoseProvider turns a photo into 5 anatomical landmarks.
 * v1 ships ManualLandmarkProvider (user drags markers). A future build can
 * drop in an MLKitPoseProvider / MediaPipePoseProvider implementing this
 * exact interface — the scoring pipeline below does not change.
 */
export interface PoseProvider {
  readonly id: string;
  /** Returns landmarks, or null when the provider cannot detect them. */
  detectLandmarks(photoUri: string): Promise<Record<LandmarkKey, Landmark> | null>;
}

/** v1 implementation: no automatic detection — the landmark screen collects
 *  user-placed markers, so this always returns null by design. */
export class ManualLandmarkProvider implements PoseProvider {
  readonly id = 'manual-v1';
  async detectLandmarks(_photoUri: string): Promise<null> {
    return null;
  }
}

export const ACTIVE_PROVIDER: PoseProvider = new ManualLandmarkProvider();

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

export interface AngleReadings {
  /** Ear vs shoulder verticality, degrees. 0 = perfectly stacked. */
  headForwardDeg: number;
  /** Shoulder vs hip verticality, degrees. 0 = shoulders over hips. */
  shoulderLeanDeg: number;
  /** Interior angle at the knee, degrees. 180 = straight leg. */
  kneeAngleDeg: number;
  /** |hip.x - ankle.x| as % of hip→ankle body height. 0 = hips over ankles. */
  hipOffsetPct: number;
}

function dist(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Deviation of a segment from vertical, in degrees (direction-agnostic:
 *  works whether the user faces left or right). */
function angleFromVertical(dx: number, dy: number): number {
  return (Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI;
}

export function computeAngles(m: Record<LandmarkKey, Landmark>): AngleReadings {
  const bodyHeight = Math.max(dist(m.hip, m.ankle), 1e-6);
  const headForwardDeg = angleFromVertical(m.ear.x - m.shoulder.x, m.ear.y - m.shoulder.y);
  const shoulderLeanDeg = angleFromVertical(
    m.shoulder.x - m.hip.x,
    m.shoulder.y - m.hip.y,
  );
  const hipOffsetPct = (Math.abs(m.hip.x - m.ankle.x) / bodyHeight) * 100;

  // Interior knee angle via dot product at the knee vertex.
  const toHip = { x: m.hip.x - m.knee.x, y: m.hip.y - m.knee.y };
  const toAnkle = { x: m.ankle.x - m.knee.x, y: m.ankle.y - m.knee.y };
  const denom = Math.max(Math.hypot(toHip.x, toHip.y) * Math.hypot(toAnkle.x, toAnkle.y), 1e-9);
  const cos = Math.min(1, Math.max(-1, (toHip.x * toAnkle.x + toHip.y * toAnkle.y) / denom));
  const kneeAngleDeg = (Math.acos(cos) * 180) / Math.PI;

  return { headForwardDeg, shoulderLeanDeg, kneeAngleDeg, hipOffsetPct };
}

// ---------------------------------------------------------------------------
// Scoring — transparent, documented, shown in-app.
// ---------------------------------------------------------------------------

export type Severity = 'good' | 'watch' | 'poor';

export interface Observation {
  angle: AngleKey;
  severity: Severity;
  /** Raw measured value (deg for angles, pct for hipOffset). */
  value: number;
}

interface Threshold {
  watchAt: number;
  poorAt: number;
  /** Higher value = worse when true (all four are "higher is worse" here,
   *  with kneeAngle measured as deviation-from-180 internally). */
  watchDeduction: number;
  poorDeduction: number;
}

const THRESHOLDS: Record<AngleKey, Threshold> = {
  headForward: { watchAt: 10, poorAt: 20, watchDeduction: 12, poorDeduction: 25 },
  shoulderLean: { watchAt: 5, poorAt: 12, watchDeduction: 10, poorDeduction: 20 },
  hipOffset: { watchAt: 5, poorAt: 10, watchDeduction: 10, poorDeduction: 20 },
  // kneeAngle stored as deviation from 180 so "higher is worse" holds.
  kneeAngle: { watchAt: 10, poorAt: 20, watchDeduction: 7, poorDeduction: 15 },
};

function kneeDeviation(a: AngleReadings): number {
  return Math.abs(180 - a.kneeAngleDeg);
}

function valueFor(angle: AngleKey, a: AngleReadings): number {
  switch (angle) {
    case 'headForward':
      return a.headForwardDeg;
    case 'shoulderLean':
      return a.shoulderLeanDeg;
    case 'kneeAngle':
      return kneeDeviation(a);
    case 'hipOffset':
      return a.hipOffsetPct;
  }
}

export function analyzeAngles(a: AngleReadings): Observation[] {
  return (Object.keys(THRESHOLDS) as AngleKey[]).map((angle) => {
    const t = THRESHOLDS[angle];
    const value = valueFor(angle, a);
    const severity: Severity = value >= t.poorAt ? 'poor' : value >= t.watchAt ? 'watch' : 'good';
    // Report the human-readable value (knee as the actual interior angle).
    const display = angle === 'kneeAngle' ? a.kneeAngleDeg : value;
    return { angle, severity, value: Math.round(display * 10) / 10 };
  });
}

/** Score starts at 100; each weak angle deducts a fixed amount.
 *  Worst possible: 100 − (25+20+20+15) = 20. Never negative. */
export function scorePosture(observations: Observation[]): number {
  let score = 100;
  for (const o of observations) {
    const t = THRESHOLDS[o.angle];
    if (o.severity === 'poor') score -= t.poorDeduction;
    else if (o.severity === 'watch') score -= t.watchDeduction;
  }
  return Math.max(0, Math.round(score));
}

/** i18n key stem for an observation, e.g. 'obs_headForward_poor' (+_t / +_d). */
export function observationKey(o: Observation): string {
  return `obs_${o.angle}_${o.severity}`;
}

/** Display string for a raw value: "14°" or "8%". */
export function formatValue(o: Observation): string {
  return o.angle === 'hipOffset' ? `${o.value}%` : `${o.value}°`;
}
