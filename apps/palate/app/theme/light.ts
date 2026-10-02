import { saffron, stone, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
export const lightColors = {
  background: stone[50],
  surface: '#FFFFFF',
  surfaceAlt: stone[100],
  border: stone[200],
  borderStrong: stone[300],
  textPrimary: stone[900],
  textSecondary: stone[600],
  textTertiary: stone[400],
  textInverse: '#FFFFFF',
  accent: saffron[600],
  accentMuted: saffron[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(28,25,23,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
