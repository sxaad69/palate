import { teal, pine, semantic } from './tokens';
import type { Colors } from './light';

// Semantic color mapping for dark mode. Deep pine-green surfaces carry the
// brand (never pure black); accent is lightened so it doesn't vibrate.
export const darkColors: Colors = {
  background: pine[900],
  surface: pine[800],
  surfaceAlt: '#1A3A37',
  border: '#244744',
  borderStrong: '#35605B',
  textPrimary: '#F0FDFA',
  textSecondary: '#9DBDB8',
  textTertiary: '#5E7A76',
  textInverse: pine[900],
  accent: teal[400],
  accentMuted: 'rgba(45,212,191,0.16)',
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
} as const;
