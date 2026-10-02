// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

// Terracotta — clay, warmth, the tended home
export const clay = {
  100: '#F9E8DD',
  200: '#F2CDAF',
  300: '#E8A87E',
  400: '#DB7F52',
  500: '#C75B39',
  600: '#A8482A',
  700: '#86381F',
} as const;

// Brass — the "all healthy" accent
export const brass = {
  100: '#FAF0D7',
  200: '#F3DF9F',
  300: '#E9C86E',
  400: '#D9A441',
  500: '#BE8A2B',
} as const;

export const cream = {
  50: '#FAF7F0',
  100: '#F3EDE1',
  200: '#E7DCC8',
  300: '#D5C6AB',
} as const;

export const charcoal = {
  400: '#8A8378',
  500: '#5F594E',
  600: '#413C35',
  700: '#2E2A25',
  800: '#232019',
  900: '#1D1A15',
} as const;

export const semantic = {
  success: '#3E7C4F',
  warning: '#B45309',
  danger: '#C0392B',
  info: '#C75B39',
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
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
