// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

// Midnight indigo — primary accent (night sky, devotion)
export const indigo = {
  50: '#EEF0FB',
  100: '#E0E3F8',
  200: '#C6CDEF',
  300: '#A3AEE5',
  400: '#7C88D6',
  500: '#5B64C4',
  600: '#464EA9',
  700: '#3A4089',
  800: '#32386E',
  900: '#1E2145',
  950: '#141631',
} as const;

// Soft gold — crescent accents, streaks, celebration
export const gold = {
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
} as const;

// Warm ivory neutrals
export const ivory = {
  50: '#FFFEFB',
  100: '#FAF8F2',
  200: '#F0EBDF',
  300: '#E0D8C3',
  400: '#B8AC8F',
  500: '#8A7D63',
  600: '#665C48',
  700: '#4C4536',
  800: '#332E24',
  900: '#211D16',
} as const;

export const semantic = {
  success: '#15803D',
  warning: '#B45309',
  danger: '#B91C1C',
  info: '#3A4089',
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
