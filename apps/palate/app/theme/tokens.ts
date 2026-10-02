// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

export const saffron = {
  50: '#FDF6E9',
  100: '#FAEBCF',
  200: '#F5D69A',
  300: '#EFBE66',
  400: '#E9A63B',
  500: '#E8930C',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const;

export const stone = {
  50: '#FAF9F7',
  100: '#F5F3F0',
  200: '#E7E2DC',
  300: '#D6CFC6',
  400: '#A8A095',
  500: '#78716C',
  600: '#57534E',
  700: '#44403C',
  800: '#292524',
  900: '#1C1917',
  950: '#131210',
} as const;

export const semantic = {
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#0284C7',
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
