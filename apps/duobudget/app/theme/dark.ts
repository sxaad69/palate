import { primitives as p } from './tokens';

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
  danger: string;
  warning: string;
  success: string;
  info: string;
  overlay: string;
  // Extra semantic roles for the envelope domain
  cardTint: string; // soft wash behind envelope cards
  savings: string; // savings-envelope accent
}

// Dark mode: deep espresso surfaces that get LIGHTER with elevation.
export const darkColors: ThemeColors = {
  background: p.espresso950,
  surface: p.espresso900,
  surfaceAlt: p.espresso800,
  border: p.espresso700,
  borderStrong: p.espresso600,
  textPrimary: p.cream100,
  textSecondary: p.cream200,
  textTertiary: p.ink300,
  textInverse: p.cream50,
  accent: p.terra400,
  accentMuted: p.espresso700,
  danger: '#E07A63',
  warning: '#E0B85C',
  success: '#8AB886',
  info: '#8AAFD6',
  overlay: 'rgba(27, 20, 14, 0.72)',
  cardTint: p.espresso800,
  savings: p.sage300,
};
