import { ember, ink, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
export const lightColors = {
  background: ink[50],
  surface: '#FFFFFF',
  surfaceAlt: ink[100],
  border: ink[200],
  borderStrong: ink[300],
  textPrimary: ink[900],
  textSecondary: ink[500],
  textTertiary: ink[400],
  textInverse: '#FFFFFF',
  accent: ember[500],
  accentMuted: ember[100],
  highlight: ember[500],
  highlightMuted: ember[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  record: semantic.danger,
  overlay: 'rgba(22,22,26,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
