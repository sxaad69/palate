import { leaf, forest, semantic } from './tokens';
import type { Colors } from './light';

export const darkColors: Colors = {
  background: forest[900],
  surface: forest[800],
  surfaceAlt: '#22331A',
  border: '#33482A',
  borderStrong: '#4A6339',
  textPrimary: '#F7FEE7',
  textSecondary: '#B3C49C',
  textTertiary: '#6E8459',
  textInverse: forest[900],
  accent: leaf[400],
  accentMuted: 'rgba(163,230,53,0.16)',
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
} as const;
