import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light mode: warm paper — the phrase cards read like language flashcards.
export const lightColors: ThemeColors = {
  background: p.cream,
  surface: '#FFFDF8',
  surfaceAlt: p.paper100,
  border: p.paper200,
  borderStrong: p.warm600,
  textPrimary: p.warm900,
  textSecondary: p.warm700,
  textTertiary: p.warm600,
  textInverse: p.cream,
  accent: p.coral600,
  accentMuted: p.coral100,
  deep: p.teal800,
  danger: p.danger,
  warning: p.warning,
  success: p.success,
  info: p.info,
  overlay: 'rgba(11, 30, 31, 0.45)',
};
