// Restory primitive tokens — twilight plum / warm sand / soft gold.
// A calm journal domain: night-plum depth, warm sand light mode, soft gold
// accents like lamplight. Never referenced directly in components;
// semantic themes (dark.ts / light.ts) map these.

export const primitives = {
  // Twilight plum scale
  plum950: '#171221',
  plum900: '#221B33',
  plum800: '#2E2444',
  plum700: '#3F3259',
  plum600: '#554673',
  plum500: '#6F5D94',
  plum400: '#9587B9',
  plum300: '#BBAFD1',
  plum200: '#DAD3E4',
  plum100: '#EDE8F2',
  plum50: '#F7F4FA',

  // Warm sand scale
  sand800: '#4F3E26',
  sand700: '#6B5433',
  sand600: '#8A6C40',
  sand500: '#AB8A55',
  sand400: '#C4A973',
  sand300: '#D8C49A',
  sand200: '#E7D9BC',
  sand100: '#F3EBD8',
  sand50: '#FAF6EC',

  // Soft gold accent scale (lamplight)
  gold700: '#8C6A1B',
  gold600: '#A87F24',
  gold500: '#C29438',
  gold400: '#D9AC4E',
  gold300: '#EAC46E',
  gold200: '#F5DDA6',
  gold100: '#FAEED3',

  // Semantic hues (tuned to sit next to plum)
  success: '#7FBF90',
  warning: '#E3C46A',
  danger: '#E88B8B',
  info: '#9FB6D8',
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
