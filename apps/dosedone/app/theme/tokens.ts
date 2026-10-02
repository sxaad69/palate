// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

// Deep teal — primary accent (trust, clinical calm)
export const teal = {
  50: '#EFFAF8',
  100: '#D7F0EC',
  200: '#AFE0D8',
  300: '#7CC9BE',
  400: '#45ADA0',
  500: '#269184',
  600: '#1A7569',
  700: '#175E56',
  800: '#154C46',
  900: '#123E3A',
  950: '#072724',
} as const;

// Warm amber — the TAKE action color (attention, warmth)
export const amber = {
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
} as const;

// Warm gray neutrals — high contrast for senior eyes
export const stone = {
  50: '#FAFAF9',
  100: '#F5F5F4',
  200: '#E7E5E4',
  300: '#D6D3D1',
  400: '#A8A29E',
  500: '#78716C',
  600: '#57534E',
  700: '#44403C',
  800: '#292524',
  900: '#1C1917',
} as const;

export const semantic = {
  success: '#15803D',
  warning: '#B45309',
  danger: '#B91C1C',
  info: '#175E56',
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
