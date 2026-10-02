// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

// Scrub wine — the uniform: clinical, human, confident
export const wine = {
  100: '#F7E4EA',
  200: '#EEC3D1',
  300: '#DD93AC',
  400: '#C05F80',
  500: '#A63A5C',
  600: '#8E2A4B',
  700: '#72203B',
  800: '#5A1830',
} as const;

// Gold — mastery, streaks, the "you know this cold" accent
export const gold = {
  100: '#FAF0D7',
  200: '#F5E0A8',
  300: '#EECB74',
  400: '#E8B84B',
  500: '#D9A62E',
  600: '#B98620',
} as const;

export const paper = {
  50: '#FDFBF7',
  100: '#F7F1E8',
  200: '#EDE3D3',
  300: '#DCCFB8',
} as const;

export const plumink = {
  400: '#8B8496',
  500: '#5F5866',
  600: '#423C49',
  700: '#2E2833',
  800: '#241F29',
  900: '#1E1420',
} as const;

export const semantic = {
  success: '#15803D',
  warning: '#B45309',
  danger: '#DC2626',
  info: '#8E2A4B',
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
