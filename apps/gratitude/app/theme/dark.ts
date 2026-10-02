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
  glow: string; // the jar's light
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Dark: deep warm bark, not pure black. Surfaces get LIGHTER with elevation.
export const darkColors: ThemeColors = {
  background: p.bark950,
  surface: p.bark900,
  surfaceAlt: p.bark800,
  border: p.bark700,
  borderStrong: p.bark600,
  textPrimary: p.bark50,
  textSecondary: p.bark200,
  textTertiary: p.bark400,
  textInverse: p.bark950,
  accent: p.peach400,
  accentMuted: p.bark800,
  glow: p.gold500,
  danger: p.danger,
  warning: p.warning,
  success: p.success,
  info: p.info,
  overlay: 'rgba(34, 24, 16, 0.72)',
};
