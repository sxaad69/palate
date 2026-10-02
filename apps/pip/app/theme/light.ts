import { sky, slate, semantic } from './tokens';

export const lightColors = {
  background: '#F7FAFC',
  surface: '#FFFFFF',
  surfaceAlt: slate[100],
  border: slate[200],
  borderStrong: slate[300],
  textPrimary: slate[900],
  textSecondary: slate[600],
  textTertiary: slate[400],
  textInverse: '#FFFFFF',
  accent: sky[600],
  accentMuted: sky[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(15,23,42,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
