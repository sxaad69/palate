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
  record: string;
  money: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
}

// Dark: surfaces get LIGHTER with elevation (never pure black — OLED smear).
// Brand blue is lightened ~15% so it doesn't vibrate on dark slate.
export const darkColors: ThemeColors = {
  background: p.slate950,
  surface: p.slate900,
  surfaceAlt: p.slate800,
  border: p.slate800,
  borderStrong: p.slate700,
  textPrimary: p.slate100,
  textSecondary: p.slate300,
  textTertiary: p.slate500,
  textInverse: p.slate950,
  accent: p.blue400,
  accentMuted: p.blue800,
  record: p.recordDark,
  money: p.moneyDark,
  danger: p.dangerDark,
  warning: p.warningDark,
  success: p.successDark,
  info: p.blue400,
  overlay: 'rgba(2, 6, 23, 0.72)',
};
