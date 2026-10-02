import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light mode: soft morning cream. Ink-brown text (never pure black),
// deeper gold accent for ≥4.5:1 contrast on cream.
export const lightColors: ThemeColors = {
  background: p.cream50,
  surface: '#FFFFFF',
  surfaceAlt: p.cream100,
  border: p.cream200,
  borderStrong: p.cream300,
  textPrimary: p.ink900,
  textSecondary: p.ink600,
  textTertiary: p.bark400,
  textInverse: '#FFFFFF',
  accent: p.gold600,
  accentMuted: p.cream200,
  glow: p.gold500,
  danger: '#A63E34',
  warning: '#9E5F14',
  success: '#3A7A44',
  info: '#3D6B8A',
  overlay: 'rgba(58, 42, 26, 0.55)',
};
