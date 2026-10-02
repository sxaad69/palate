import { sky, gold, slate, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
export const lightColors = {
  background: slate[50],
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
  // Gold is the savings/celebration highlight — used sparingly, never as body text.
  highlight: gold[600],
  highlightMuted: gold[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(15,23,42,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
