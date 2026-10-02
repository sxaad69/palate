import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';
// Light mode: soft dawn — pale indigo surfaces, deeper indigo text.
export const lightColors: ThemeColors = {
  background: p.indigo50,
  surface: '#FFFFFF',
  surfaceAlt: p.indigo100,
  border: p.indigo200,
  borderStrong: p.indigo300,
  textPrimary: p.indigo900,
  textSecondary: p.indigo600,
  textTertiary: p.indigo500,
  textInverse: '#FFFFFF',
  accent: p.lavender700,
  accentMuted: p.lavender200,
  breathGlow: p.ember500,
  danger: '#C24B4B',
  warning: '#B98A2E',
  success: '#3E8E57',
  info: '#3D5FA8',
  overlay: 'rgba(18, 23, 46, 0.55)',
};
