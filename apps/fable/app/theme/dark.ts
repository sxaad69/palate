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
  breathGlow: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Dark is the primary experience: evening sessions, dim rooms.
// Surfaces get LIGHTER with elevation (never pure black — OLED smear).
export const darkColors: ThemeColors = {
  background: p.indigo950,
  surface: p.indigo900,
  surfaceAlt: p.indigo800,
  border: p.indigo700,
  borderStrong: p.indigo600,
  textPrimary: p.indigo100,
  textSecondary: p.indigo300,
  textTertiary: p.indigo400,
  textInverse: p.indigo950,
  accent: p.lavender400,
  accentMuted: p.lavender700,
  breathGlow: p.ember300,
  danger: p.danger,
  warning: p.warning,
  success: p.success,
  info: p.info,
  overlay: 'rgba(11, 14, 31, 0.72)',
};
