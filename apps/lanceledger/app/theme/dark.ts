import { mint, semantic } from './tokens';
import type { Colors } from './light';

// Dark mode: deep forest. Surfaces lift lighter (never pure black);
// pine lightens to mint so it doesn't vibrate on dark backgrounds.
export const darkColors: Colors = {
  background: '#0A1A13',
  surface: '#0F211A',
  surfaceAlt: '#152A20',
  border: '#1E3529',
  borderStrong: '#2C4A39',
  textPrimary: '#F4F2EC',
  textSecondary: '#AAA294',
  textTertiary: '#5E594D',
  textInverse: '#0A1A13',
  accent: mint[400],
  accentMuted: 'rgba(52,211,153,0.14)',
  highlight: mint[400],
  highlightMuted: 'rgba(52,211,153,0.12)',
  profit: mint[400],
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
};
