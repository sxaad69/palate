// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

// Deep pine green — primary accent (money, trust, quiet precision)
export const pine = {
  50: '#EFF6F1',
  100: '#DCEBE2',
  200: '#B9D8C6',
  300: '#8DBFA4',
  400: '#5DA37E',
  500: '#38855F',
  600: '#266A4B',
  700: '#1E553D',
  800: '#194433',
  900: '#123626',
  950: '#0A2418',
} as const;

// Mint — profit, growth, positive numbers
export const mint = {
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981',
  600: '#059669',
} as const;

// Warm paper neutrals
export const paper = {
  50: '#FBFAF7',
  100: '#F4F2EC',
  200: '#E8E4D9',
  300: '#D6D0BF',
  400: '#AAA294',
  500: '#7E7768',
  600: '#5E594D',
  700: '#48443B',
  800: '#302D27',
  900: '#1D1B17',
  950: '#131209',
} as const;

export const semantic = {
  success: '#15803D',
  warning: '#B45309',
  danger: '#DC2626',
  info: '#1E553D',
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
