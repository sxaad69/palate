import { violet, slate, semantic } from './tokens';

export const lightColors = {
  background: '#FDF9F3',
  surface: '#FFFFFF',
  surfaceAlt: slate[100],
  border: slate[200],
  borderStrong: slate[300],
  textPrimary: slate[900],
  textSecondary: slate[600],
  textTertiary: slate[400],
  textInverse: '#FFFFFF',
  accent: violet[600],
  accentMuted: violet[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(15,23,42,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
