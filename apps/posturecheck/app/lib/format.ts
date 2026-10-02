import { t, type Strings } from './i18n';
import { observationKey, type AngleKey, type Observation, type Severity } from './pose';

// UI text for pose geometry. Kept out of lib/pose.ts so pose stays
// react-native-free (the pose.check.ts self-check compiles it standalone).

export function angleLabel(angle: AngleKey): string {
  const s = t();
  switch (angle) {
    case 'headForward':
      return s.angleHeadForward;
    case 'shoulderLean':
      return s.angleShoulderLean;
    case 'kneeAngle':
      return s.angleKneeAngle;
    case 'hipOffset':
      return s.angleHipOffset;
  }
}

export function observationText(o: Observation): { title: string; detail: string } {
  const dict = t() as unknown as Record<keyof Strings, string>;
  const key = observationKey(o);
  return {
    title: dict[`${key}_t` as keyof Strings] ?? key,
    detail: dict[`${key}_d` as keyof Strings] ?? '',
  };
}

export function severityLabel(sev: Severity): string {
  const s = t();
  return sev === 'good' ? s.sevGood : sev === 'watch' ? s.sevWatch : s.sevPoor;
}
