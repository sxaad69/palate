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
  doseAction: string; // the big "GIVE" color — warm amber
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Dark mode: warm charcoal (never pure black — OLED smear). Surfaces get
// LIGHTER with elevation. Teal/amber are lightened 10-20% for dark bg.
export const darkColors: ThemeColors = {
  background: p.char900,
  surface: p.char800,
  surfaceAlt: p.char700,
  border: p.char600,
  borderStrong: p.char500,
  textPrimary: p.cream50,
  textSecondary: p.cream200,
  textTertiary: p.bark400,
  textInverse: p.char900,
  accent: p.teal300,
  accentMuted: p.teal900,
  doseAction: p.amber300,
  danger: '#E87A7A',
  warning: '#E8C15C',
  success: '#7BC98E',
  info: '#8AA6E6',
  overlay: 'rgba(20, 17, 12, 0.72)',
};
