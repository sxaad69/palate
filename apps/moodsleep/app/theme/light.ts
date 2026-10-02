import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light mode: warm sand morning — pale sand surfaces, deep plum text,
// a darker gold accent so it holds contrast on light backgrounds.
export const lightColors: ThemeColors = {
  background: p.sand50,
  surface: '#FFFDF6',
  surfaceAlt: p.sand100,
  border: p.sand200,
  borderStrong: p.sand300,
  textPrimary: p.plum800,
  textSecondary: p.plum600,
  textTertiary: p.plum500,
  textInverse: '#FFFFFF',
  accent: p.gold700,
  accentMuted: p.gold200,
  glow: p.gold500,
  danger: '#C24B4B',
  warning: '#9A7A22',
  success: '#3E8E57',
  info: '#3D5FA8',
  overlay: 'rgba(46, 36, 68, 0.5)',
};
