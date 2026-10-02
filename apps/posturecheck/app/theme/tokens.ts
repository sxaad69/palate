// StraightUp primitive tokens — confident navy + energizing lime + cool light gray.
// Posture/body domain: upright, active, clinical-but-friendly. Never referenced
// directly in components; semantic themes (dark.ts / light.ts) map these.

export const primitives = {
  // Confident navy scale (cool; light gray surfaces are navy-tinted, never warm)
  navy950: '#081120',
  navy900: '#0D1B30',
  navy800: '#14263F',
  navy700: '#1D3554',
  navy600: '#2A4A70',
  navy500: '#3B6491',
  navy400: '#6186B3',
  navy300: '#93AFCC',
  navy200: '#C3D3E6',
  navy100: '#DFE7F1',
  navy50: '#F1F4F9',

  // Energizing lime scale — scores, markers, CTAs in dark mode
  lime700: '#557A00',
  lime600: '#6E9A00',
  lime500: '#86B800',
  lime400: '#A3D11F',
  lime300: '#C0E45C',
  lime200: '#DFF39E',
  lime100: '#F2FAD6',

  // Semantic hues (tuned to sit next to navy/lime)
  success: '#3E9E5C',
  warning: '#C08A1A',
  danger: '#D0493F',
  info: '#3D7BC4',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 999,
} as const;
