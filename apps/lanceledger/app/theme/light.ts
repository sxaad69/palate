import { pine, mint, paper, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
export const lightColors = {
  background: paper[50],
  surface: '#FFFFFF',
  surfaceAlt: paper[100],
  border: paper[200],
  borderStrong: paper[300],
  textPrimary: paper[900],
  textSecondary: paper[600],
  textTertiary: paper[400],
  textInverse: '#FFFFFF',
  accent: pine[700],
  accentMuted: pine[100],
  // Mint is the profit/growth highlight — positive numbers, funded states.
  highlight: mint[600],
  highlightMuted: '#D9F5E7',
  profit: semantic.success,
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(19,18,9,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
