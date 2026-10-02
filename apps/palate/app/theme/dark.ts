import { saffron, semantic } from './tokens';
import type { Colors } from './light';

// Semantic color mapping for dark mode. Surfaces get lighter (never pure
// black); accent is lightened so it doesn't vibrate on dark backgrounds.
export const darkColors: Colors = {
  background: '#131210',
  surface: '#1E1C19',
  surfaceAlt: '#262320',
  border: '#332F2B',
  borderStrong: '#4A443D',
  textPrimary: '#F5F3F0',
  textSecondary: '#A8A095',
  textTertiary: '#6B6259',
  textInverse: '#1C1917',
  accent: saffron[400],
  accentMuted: 'rgba(232,147,12,0.16)',
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
};
