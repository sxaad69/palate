import { primitives as p } from './tokens';

// Structural interface (not literal union) so the light theme can differ.
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  accent: string;
  accentMuted: string;
  rose: string;
  roseMuted: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Dark: evening closet — warm charcoal, olive lightened for contrast.
export const darkColors: ThemeColors = {
  background: p.ink900,
  surface: p.ink800,
  surfaceAlt: p.ink700,
  border: p.ink600,
  borderStrong: p.sand700,
  textPrimary: p.sand100,
  textSecondary: p.sand300,
  textTertiary: p.sand400,
  textInverse: p.ink900,
  accent: p.olive300,
  accentMuted: p.olive800,
  rose: p.rose300,
  roseMuted: p.rose900,
  danger: '#D98A76',
  warning: '#D9B25C',
  success: '#8FBF7F',
  info: '#8AA6C4',
  overlay: 'rgba(33, 29, 22, 0.72)',
};
