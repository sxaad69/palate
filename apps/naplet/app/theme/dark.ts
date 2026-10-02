import { violet, plum, semantic } from './tokens';
import type { Colors } from './light';

export const darkColors: Colors = {
  background: plum[900],
  surface: plum[800],
  surfaceAlt: '#372C4E',
  border: '#4A3D68',
  borderStrong: '#635182',
  textPrimary: '#F5F3FF',
  textSecondary: '#B9AED6',
  textTertiary: '#7A6C99',
  textInverse: plum[900],
  accent: violet[400],
  accentMuted: 'rgba(167,139,250,0.16)',
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
} as const;
