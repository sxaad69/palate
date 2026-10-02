import { clay, brass, cream, charcoal, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
export const lightColors = {
  background: cream[50],
  surface: '#FFFFFF',
  surfaceAlt: cream[100],
  border: cream[200],
  borderStrong: cream[300],
  textPrimary: charcoal[900],
  textSecondary: charcoal[600],
  textTertiary: charcoal[400],
  textInverse: '#FFFFFF',
  accent: clay[500],
  accentMuted: clay[100],
  highlight: brass[400],
  highlightMuted: brass[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  record: semantic.danger,
  overlay: 'rgba(29,26,21,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
