import { ember, semantic } from './tokens';
import type { Colors } from './light';

// Dark mode: true ink. Ember glows like a furnace.
export const darkColors: Colors = {
  background: '#16161A',
  surface: '#1F1F24',
  surfaceAlt: '#2A2A31',
  border: '#3A3A42',
  borderStrong: '#52525C',
  textPrimary: '#F5F3EE',
  textSecondary: '#B9B4A9',
  textTertiary: '#6E6A61',
  textInverse: '#16161A',
  accent: ember[400],
  accentMuted: 'rgba(255,129,69,0.14)',
  highlight: ember[400],
  highlightMuted: 'rgba(255,129,69,0.14)',
  danger: '#F87171',
  warning: semantic.warning,
  success: '#4ADE80',
  info: ember[400],
  record: '#F87171',
  overlay: 'rgba(0,0,0,0.6)',
};
