import { night, moon, semantic } from './tokens';
import type { Colors } from './light';

// Dark mode: the dream itself. Amber glows like moonlight.
export const darkColors: Colors = {
  background: '#221133',
  surface: '#2E1D4A',
  surfaceAlt: '#3A2659',
  border: '#4E3A76',
  borderStrong: '#665091',
  textPrimary: '#F2EDFB',
  textSecondary: '#C4B8E0',
  textTertiary: '#8B7BAE',
  textInverse: '#221133',
  accent: night[300],
  accentMuted: 'rgba(184,169,232,0.14)',
  highlight: moon[400],
  highlightMuted: 'rgba(255,179,71,0.14)',
  danger: '#F87171',
  warning: semantic.warning,
  success: '#4ADE80',
  info: night[300],
  record: '#F87171',
  overlay: 'rgba(0,0,0,0.6)',
};
