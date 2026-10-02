import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light is the primary experience: paper-like background, ink text,
// signal-blue actions. Business users read this in daylight.
export const lightColors: ThemeColors = {
  background: p.slate50,
  surface: '#FFFFFF',
  surfaceAlt: p.slate100,
  border: p.slate200,
  borderStrong: p.slate300,
  textPrimary: p.slate900,
  textSecondary: p.slate600,
  textTertiary: p.slate400,
  textInverse: '#FFFFFF',
  accent: p.blue600,
  accentMuted: p.blue100,
  record: p.record,
  money: p.money,
  danger: p.danger,
  warning: p.warning,
  success: p.success,
  info: p.blue600,
  overlay: 'rgba(2, 6, 23, 0.55)',
};
