import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light mode: warm cream morning — friendly, not clinical.
// Accent teal is darkened for ≥4.5:1 contrast on cream.
export const lightColors: ThemeColors = {
  background: p.cream50,
  surface: '#FFFFFF',
  surfaceAlt: p.cream100,
  border: p.cream200,
  borderStrong: p.cream300,
  textPrimary: p.bark900,
  textSecondary: p.bark700,
  textTertiary: p.bark500,
  textInverse: '#FFFFFF',
  accent: p.teal700,
  accentMuted: p.teal100,
  doseAction: p.amber700,
  danger: p.danger,
  warning: p.warning,
  success: p.success,
  info: p.info,
  overlay: 'rgba(59, 47, 35, 0.55)',
};
