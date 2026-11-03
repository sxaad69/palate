import { primitives as p } from './tokens';
import type { ThemeColors } from './dark';

// Light: Quiet luxury atelier — warm alabaster pearl, deep midnight noir accents, champagne gold.
export const lightColors: ThemeColors = {
  background: '#FDFBF7',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F4EE',
  border: '#E8E3D8',
  borderStrong: '#D1C8B4',
  textPrimary: '#161412',
  textSecondary: '#5A5348',
  textTertiary: '#9E9484',
  textInverse: '#FFFFFF',
  accent: '#161412',
  accentMuted: '#EFECE4',
  gold: '#C5A059',
  goldMuted: '#F9F4EB',
  rose: p.rose600,
  roseMuted: p.rose100,
  danger: '#A03E2B',
  warning: '#96660F',
  success: '#3E6B34',
  info: '#3D5F80',
  overlay: 'rgba(22, 20, 18, 0.60)',
};
