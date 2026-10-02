import { night, moon, mist, smoke, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
export const lightColors = {
  background: mist[50],
  surface: '#FFFFFF',
  surfaceAlt: mist[100],
  border: mist[200],
  borderStrong: mist[300],
  textPrimary: night[900],
  textSecondary: smoke[600],
  textTertiary: smoke[400],
  textInverse: '#FFFFFF',
  accent: night[600],
  accentMuted: night[100],
  highlight: moon[400],
  highlightMuted: moon[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  record: semantic.danger,
  overlay: 'rgba(34,17,51,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
