import { indigo, gold, ivory, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
export const lightColors = {
  background: ivory[50],
  surface: '#FFFFFF',
  surfaceAlt: ivory[100],
  border: ivory[200],
  borderStrong: ivory[300],
  textPrimary: ivory[900],
  textSecondary: ivory[600],
  textTertiary: ivory[400],
  textInverse: '#FFFFFF',
  accent: indigo[800],
  accentMuted: indigo[100],
  // Gold is the streak/celebration highlight — never body text.
  highlight: gold[600],
  highlightMuted: gold[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(33,29,22,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
