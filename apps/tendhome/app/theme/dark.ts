import { clay, brass, semantic } from './tokens';
import type { Colors } from './light';

// Dark mode: warm charcoal. Terracotta glows, brass marks healthy.
export const darkColors: Colors = {
  background: '#1D1A15',
  surface: '#282219',
  surfaceAlt: '#332B20',
  border: '#453A2A',
  borderStrong: '#5C4E38',
  textPrimary: '#F5F0E6',
  textSecondary: '#C4BBA6',
  textTertiary: '#8A8071',
  textInverse: '#1D1A15',
  accent: clay[400],
  accentMuted: 'rgba(219,127,82,0.14)',
  highlight: brass[400],
  highlightMuted: 'rgba(217,164,65,0.14)',
  danger: '#F87171',
  warning: semantic.warning,
  success: '#4ADE80',
  info: clay[400],
  record: '#F87171',
  overlay: 'rgba(0,0,0,0.6)',
};
