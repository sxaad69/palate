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
  glow: string; // small celebratory accent (waste-saved moments)
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Pantry at night: deep green-ink, never pure black (OLED smear).
// Elevation = lighter surfaces, not shadows.
export const darkColors: ThemeColors = {
  background: p.green950,
  surface: p.green900,
  surfaceAlt: p.green800,
  border: p.green800,
  borderStrong: p.green700,
  textPrimary: p.green100,
  textSecondary: p.green300,
  textTertiary: p.green400,
  textInverse: p.green950,
  accent: p.green400, // lightened ~15% so it doesn't vibrate on dark
  accentMuted: p.green800,
  glow: p.ripe300,
  danger: p.danger300,
  warning: p.ripe300,
  success: p.green300,
  info: '#7AB8C2',
  overlay: 'rgba(11, 29, 18, 0.72)',
};
