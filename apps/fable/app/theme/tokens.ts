// Fable primitive tokens — deep indigo / night blue, soft lavender accents.
// Dark-first: breathwork happens in dim rooms. Never referenced directly
// in components; semantic themes (dark.ts / light.ts) map these.

export const primitives = {
  // Indigo night scale
  indigo950: '#0B0E1F',
  indigo900: '#12172E',
  indigo800: '#1A2140',
  indigo700: '#232C52',
  indigo600: '#2E3A68',
  indigo500: '#3D4C84',
  indigo400: '#5A6DA6',
  indigo300: '#8A99C4',
  indigo200: '#B9C2DE',
  indigo100: '#DDE2F0',
  indigo50: '#F1F3F9',

  // Lavender accent scale
  lavender700: '#6C5FC7',
  lavender600: '#7E72D8',
  lavender500: '#948AE6',
  lavender400: '#ACA4EF',
  lavender300: '#C4BDF5',
  lavender200: '#DCD8FA',
  lavender100: '#EDEBFD',

  // Warm breath accent (used sparingly — the "exhale" glow)
  ember500: '#E8A15C',
  ember300: '#F2C48D',

  // Semantic hues (tuned to sit next to indigo)
  success: '#7BC98E',
  warning: '#E8C15C',
  danger: '#E87A7A',
  info: '#8AA6E6',
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
