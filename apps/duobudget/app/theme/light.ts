import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light mode: warm cream paper, terracotta ink.
export const lightColors: ThemeColors = {
  background: p.cream50,
  surface: '#FFFDF8',
  surfaceAlt: p.cream100,
  border: p.cream200,
  borderStrong: p.ink300,
  textPrimary: p.ink900,
  textSecondary: p.ink700,
  textTertiary: p.ink500,
  textInverse: '#FFFDF8',
  accent: p.terra600,
  accentMuted: p.terra100,
  danger: p.danger,
  warning: '#A67C1F',
  success: '#3E7A44',
  info: '#3D6FA8',
  overlay: 'rgba(43, 35, 24, 0.55)',
  cardTint: p.terra50,
  savings: p.sage600,
};
