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
  /** Soft moon/lamp glow — sleep-section highlights, selected faces. */
  glow: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Twilight is the natural home: journaling happens at the edges of the day.
// Surfaces get LIGHTER with elevation (never pure black — OLED smear).
export const darkColors: ThemeColors = {
  background: p.plum950,
  surface: p.plum900,
  surfaceAlt: p.plum800,
  border: p.plum700,
  borderStrong: p.plum600,
  textPrimary: p.plum100,
  textSecondary: p.plum300,
  textTertiary: p.plum400,
  textInverse: p.plum950,
  accent: p.gold300,
  accentMuted: p.gold700,
  glow: p.gold400,
  danger: p.danger,
  warning: p.warning,
  success: p.success,
  info: p.info,
  overlay: 'rgba(23, 18, 33, 0.72)',
};
