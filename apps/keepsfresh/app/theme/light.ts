import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light mode: warm cream paper, deep leaf-ink text.
export const lightColors: ThemeColors = {
  background: p.cream50,
  surface: '#FFFFFF',
  surfaceAlt: p.green100,
  border: p.green200,
  borderStrong: p.green300,
  textPrimary: p.ink900,
  textSecondary: p.ink700,
  textTertiary: p.ink500,
  textInverse: '#FFFFFF',
  accent: p.green700, // white text on this passes AA
  accentMuted: p.green100,
  glow: p.ripe500,
  danger: p.danger500,
  warning: p.ripe500,
  success: p.green600,
  info: p.info500,
  overlay: 'rgba(21, 36, 23, 0.55)',
};
