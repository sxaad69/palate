import { wine, gold, semantic } from './tokens';
import type { Colors } from './light';

// Dark mode: deep plum. Wine glows, gold marks mastery.
export const darkColors: Colors = {
  background: '#1E1420',
  surface: '#2A1E2B',
  surfaceAlt: '#352635',
  border: '#453344',
  borderStrong: '#5A4359',
  textPrimary: '#F7F2F7',
  textSecondary: '#C4B8C4',
  textTertiary: '#8B7E8B',
  textInverse: '#1E1420',
  accent: wine[300],
  accentMuted: 'rgba(221,147,172,0.14)',
  highlight: gold[400],
  highlightMuted: 'rgba(232,184,75,0.14)',
  danger: '#F87171',
  warning: semantic.warning,
  success: '#4ADE80',
  info: wine[300],
  record: '#F87171',
  overlay: 'rgba(0,0,0,0.6)',
};
