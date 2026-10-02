import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light: morning closet — warm ivory, deep olive text, sand surfaces.
export const lightColors: ThemeColors = {
  background: p.sand50,
  surface: '#FFFFFF',
  surfaceAlt: p.sand100,
  border: p.sand200,
  borderStrong: p.sand400,
  textPrimary: p.ink900,
  textSecondary: p.ink600,
  textTertiary: p.sand500,
  textInverse: '#FFFFFF',
  accent: p.olive600,
  accentMuted: p.olive100,
  rose: p.rose600,
  roseMuted: p.rose100,
  danger: '#A03E2B',
  warning: '#96660F',
  success: '#3E6B34',
  info: '#3D5F80',
  overlay: 'rgba(33, 29, 22, 0.55)',
};
