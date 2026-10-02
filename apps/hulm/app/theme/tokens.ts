// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

// Night plum — the dreaming dark
export const night = {
  100: '#EDE6F7',
  200: '#D9CDEF',
  300: '#B8A9E8',
  400: '#8F7BD4',
  500: '#6E58B8',
  600: '#4E3A8F',
  700: '#372763',
  800: '#2A1D4E',
  900: '#221133',
} as const;

// Moonlit amber — the glow of meaning
export const moon = {
  100: '#FDF3DC',
  200: '#FAE5B4',
  300: '#F6D382',
  400: '#FFB347',
  500: '#F59E2C',
  600: '#D17F16',
} as const;

export const mist = {
  50: '#FAF8FE',
  100: '#F1ECFA',
  200: '#E2D8F2',
  300: '#C9BCE4',
} as const;

export const smoke = {
  400: '#8B8496',
  500: '#5F5866',
  600: '#423C49',
  700: '#2E2833',
} as const;

export const semantic = {
  success: '#3E7C4F',
  warning: '#B45309',
  danger: '#C0392B',
  info: '#6E58B8',
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
