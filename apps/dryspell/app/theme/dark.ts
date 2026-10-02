import { sky, gold, semantic } from './tokens';
import type { Colors } from './light';

// Dark mode: deep night blue. Surfaces get lighter (never pure black);
// sky lightens so it doesn't vibrate; gold warms the savings highlights.
export const darkColors: Colors = {
  background: '#0A0F1C',
  surface: '#111A2C',
  surfaceAlt: '#182238',
  border: '#243049',
  borderStrong: '#33415E',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#5B6B85',
  textInverse: '#0A0F1C',
  accent: sky[400],
  accentMuted: 'rgba(99,168,209,0.16)',
  highlight: gold[400],
  highlightMuted: 'rgba(233,184,74,0.14)',
  danger: semantic.danger,
  warning: semantic.warning,
  success: semantic.success,
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
};
