import { teal, amber, semantic } from './tokens';
import type { Colors } from './light';

// Dark mode: deep teal-black. Amber stays warm and bright for the TAKE action.
export const darkColors: Colors = {
  background: '#0A1514',
  surface: '#101E1C',
  surfaceAlt: '#162825',
  border: '#1F3330',
  borderStrong: '#2C4642',
  textPrimary: '#FAFAF9',
  textSecondary: '#D6D3D1',
  textTertiary: '#78716C',
  textInverse: '#0A1514',
  accent: teal[300],
  accentMuted: 'rgba(124,201,190,0.16)',
  highlight: amber[400],
  highlightMuted: 'rgba(251,191,36,0.14)',
  danger: '#F87171',
  warning: semantic.warning,
  success: '#4ADE80',
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
};
