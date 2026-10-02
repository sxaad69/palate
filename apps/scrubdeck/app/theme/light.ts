import { wine, gold, paper, plumink, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
export const lightColors = {
  background: paper[50],
  surface: '#FFFFFF',
  surfaceAlt: paper[100],
  border: paper[200],
  borderStrong: paper[300],
  textPrimary: plumink[900],
  textSecondary: plumink[600],
  textTertiary: plumink[400],
  textInverse: '#FFFFFF',
  accent: wine[600],
  accentMuted: wine[100],
  highlight: gold[400],
  highlightMuted: gold[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  record: semantic.danger,
  overlay: 'rgba(30,20,32,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
