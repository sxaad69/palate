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
  brand: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Dark: deep navy surfaces, lime accent pops like a gym-light.
export const darkColors: ThemeColors = {
  background: p.navy950,
  surface: p.navy900,
  surfaceAlt: p.navy800,
  border: p.navy700,
  borderStrong: p.navy600,
  textPrimary: p.navy100,
  textSecondary: p.navy300,
  textTertiary: p.navy400,
  textInverse: p.navy950,
  accent: p.lime400,
  accentMuted: p.navy700,
  brand: p.lime500,
  danger: '#E07A70',
  warning: '#E0B44A',
  success: '#5FC482',
  info: '#6FA3E8',
  overlay: 'rgba(8, 17, 32, 0.72)',
};
