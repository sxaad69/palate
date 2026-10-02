// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

// Ember — intensity, the "do the work" accent
export const ember = {
  100: '#FFE9DC',
  200: '#FFCFAE',
  300: '#FFAB7A',
  400: '#FF8145',
  500: '#FF5C1C',
  600: '#E8480C',
  700: '#BE3A0B',
} as const;

// Ink — deep, calm, distraction-free
export const ink = {
  50: '#FAF8F4',
  100: '#F1EDE6',
  200: '#E2DCD2',
  300: '#C9C2B4',
  400: '#8F887A',
  500: '#5C564B',
  600: '#3E3A33',
  700: '#2A2723',
  800: '#1D1B18',
  900: '#16161A',
} as const;

export const semantic = {
  success: '#15803D',
  warning: '#B45309',
  danger: '#DC2626',
  info: '#FF5C1C',
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
