import { sky, navy, semantic } from './tokens';
import type { Colors } from './light';

export const darkColors: Colors = {
  background: navy[900],
  surface: navy[800],
  surfaceAlt: '#182C46',
  border: '#22395A',
  borderStrong: '#31537E',
  textPrimary: '#F0F9FF',
  textSecondary: '#9DB4CC',
  textTertiary: '#5E7A99',
  textInverse: navy[900],
  accent: sky[400],
  accentMuted: 'rgba(56,189,248,0.16)',
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
} as const;
