// Runnable self-check for lib/pose.ts — the one non-trivial logic module.
// No test framework, no @types/node (tiny local assert instead). Run:
//   node node_modules/typescript/bin/tsc lib/pose.ts lib/pose.check.ts \
//     --ignoreConfig --outDir /tmp/posecheck --module commonjs --target es2020 \
//     --strict --esModuleInterop && node /tmp/posecheck/pose.check.js
import {
  ManualLandmarkProvider,
  analyzeAngles,
  computeAngles,
  scorePosture,
  type Landmark,
  type LandmarkKey,
} from './pose';

function ok(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`assertion failed: ${msg}`);
}
function eq<T>(a: T, b: T, msg = ''): void {
  if (a !== b) throw new Error(`assertion failed${msg ? `: ${msg}` : ''} (got ${a}, want ${b})`);
}

function m(o: Record<LandmarkKey, [number, number]>): Record<LandmarkKey, Landmark> {
  return {
    ear: { x: o.ear[0], y: o.ear[1] },
    shoulder: { x: o.shoulder[0], y: o.shoulder[1] },
    hip: { x: o.hip[0], y: o.hip[1] },
    knee: { x: o.knee[0], y: o.knee[1] },
    ankle: { x: o.ankle[0], y: o.ankle[1] },
  };
}

// 1. Perfectly stacked skeleton -> 100, all good.
{
  const angles = computeAngles(
    m({ ear: [0.5, 0.1], shoulder: [0.5, 0.3], hip: [0.5, 0.5], knee: [0.5, 0.75], ankle: [0.5, 0.95] }),
  );
  ok(Math.abs(angles.headForwardDeg) < 0.01, `head ${angles.headForwardDeg}`);
  ok(Math.abs(angles.kneeAngleDeg - 180) < 0.01, `knee ${angles.kneeAngleDeg}`);
  const obs = analyzeAngles(angles);
  ok(obs.every((o) => o.severity === 'good'), JSON.stringify(obs));
  eq(scorePosture(obs), 100, 'perfect score');
}

// 2. Forward head (ear 0.12 ahead over 0.20 vertical -> ~31 deg = poor) -> 75.
{
  const angles = computeAngles(
    m({ ear: [0.62, 0.1], shoulder: [0.5, 0.3], hip: [0.5, 0.5], knee: [0.5, 0.75], ankle: [0.5, 0.95] }),
  );
  const obs = analyzeAngles(angles);
  const head = obs.find((o) => o.angle === 'headForward');
  eq(head?.severity, 'poor');
  eq(scorePosture(obs), 75);
}

// 3. Forward head poor + bent knee poor -> 100 - 25 - 15 = 60.
{
  const angles = computeAngles(
    m({ ear: [0.62, 0.1], shoulder: [0.5, 0.3], hip: [0.5, 0.5], knee: [0.58, 0.75], ankle: [0.5, 0.95] }),
  );
  const obs = analyzeAngles(angles);
  const knee = obs.find((o) => o.angle === 'kneeAngle');
  eq(knee?.severity, 'poor');
  eq(scorePosture(obs), 60);
}

// 4. Watch band: slight shoulder lean (~8 deg) deducts 10 -> 90.
{
  const angles = computeAngles(
    m({ ear: [0.53, 0.1], shoulder: [0.53, 0.3], hip: [0.5, 0.5], knee: [0.5, 0.75], ankle: [0.5, 0.95] }),
  );
  // dx=0.03, dy=0.20 -> atan2(0.03,0.20) ~= 8.5 deg
  ok(angles.shoulderLeanDeg > 5 && angles.shoulderLeanDeg < 12, `lean ${angles.shoulderLeanDeg}`);
  const obs = analyzeAngles(angles);
  eq(obs.find((o) => o.angle === 'shoulderLean')?.severity, 'watch');
  eq(scorePosture(obs), 90);
}

// 5. Manual provider is honest: never claims detection.
{
  const p = new ManualLandmarkProvider();
  eq(p.id, 'manual-v1');
  p.detectLandmarks('file://x.jpg').then((r) => eq(r, null));
}

// 6. Score floor: worst case never goes negative.
{
  const angles = computeAngles(
    m({ ear: [0.8, 0.1], shoulder: [0.4, 0.3], hip: [0.6, 0.5], knee: [0.35, 0.75], ankle: [0.6, 0.95] }),
  );
  const score = scorePosture(analyzeAngles(angles));
  ok(score >= 0 && score <= 100, `score ${score}`);
}

console.log('pose.check: all assertions passed');
