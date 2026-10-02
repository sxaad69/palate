import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light: light-gray (navy-tinted) background, confident navy actions,
// lime reserved for scores / highlights / markers.
export const lightColors: ThemeColors = {
  background: p.navy50,
  surface: '#FFFFFF',
  surfaceAlt: p.navy100,
  border: p.navy200,
  borderStrong: p.navy300,
  textPrimary: p.navy900,
  textSecondary: p.navy600,
  textTertiary: p.navy500,
  textInverse: '#FFFFFF',
  accent: p.navy700,
  accentMuted: p.navy100,
  brand: p.lime500,
  danger: p.danger,
  warning: p.warning,
  success: p.success,
  info: p.info,
  overlay: 'rgba(13, 27, 48, 0.55)',
};
