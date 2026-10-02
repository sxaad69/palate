import { indigo, gold, semantic } from './tokens';
import type { Colors } from './light';

// Dark mode: midnight. Surfaces lift lighter (never pure black); indigo
// lightens and gold stays warm for streaks and the next-prayer hero.
export const darkColors: Colors = {
  background: '#141631',
  surface: '#1E2145',
  surfaceAlt: '#273058',
  border: '#32386E',
  borderStrong: '#464EA9',
  textPrimary: '#FFFEFB',
  textSecondary: '#C6CDEF',
  textTertiary: '#7C88D6',
  textInverse: '#141631',
  accent: indigo[300],
  accentMuted: 'rgba(163,174,229,0.16)',
  highlight: gold[400],
  highlightMuted: 'rgba(251,191,36,0.14)',
  danger: '#F87171',
  warning: semantic.warning,
  success: '#4ADE80',
  info: semantic.info,
  overlay: 'rgba(0,0,0,0.6)',
};
