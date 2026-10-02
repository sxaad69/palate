import { primitives as p } from './tokens';

// Semantic color contract both themes must satisfy. Plain `string` fields:
// both themes share the same keys, only values differ (literals would make
// the union unassignable).
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
  deep: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Dark mode: deep teal, not black. Elevation = lighter surfaces.
// Coral accent is lifted one step (coral400) so it doesn't vibrate on teal950.
export const darkColors: ThemeColors = {
  background: p.teal950,
  surface: p.teal900,
  surfaceAlt: p.teal800,
  border: p.teal700,
  borderStrong: p.teal500,
  textPrimary: p.cream,
  textSecondary: p.teal200,
  textTertiary: p.teal300,
  textInverse: p.teal950,
  accent: p.coral400,
  accentMuted: p.teal800,
  deep: p.teal300,
  danger: '#E87A7A',
  warning: p.warning,
  success: '#7BC98E',
  info: '#8AA6E6',
  overlay: 'rgba(0, 0, 0, 0.55)',
};
