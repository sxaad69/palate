import { teal, amber, stone, semantic } from './tokens';

// Semantic color mapping for light mode — this is what components consume.
// Senior-first: pure-white background, near-black text, AAA contrast.
export const lightColors = {
  background: '#FFFFFF',
  surface: stone[50],
  surfaceAlt: stone[100],
  border: stone[200],
  borderStrong: stone[300],
  textPrimary: stone[900],
  textSecondary: stone[600],
  textTertiary: stone[400],
  textInverse: '#FFFFFF',
  accent: teal[700],
  accentMuted: teal[100],
  // Amber is the TAKE action color — high-attention, never body text.
  highlight: amber[500],
  highlightMuted: amber[100],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(28,25,23,0.5)',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
