// ModestFit primitive tokens — warm sand + olive + soft rose.
// Designed from scratch for modest fashion: earthy, elegant, calm.
// Never referenced directly in components; semantic themes (dark.ts /
// light.ts) map these.

export const primitives = {
  // Warm sand scale
  sand50: '#FAF6EE',
  sand100: '#F4EDDF',
  sand200: '#E9DCC4',
  sand300: '#DCC9A6',
  sand400: '#CBB180',
  sand500: '#B89A63',
  sand600: '#9C7F4E',
  sand700: '#7C653E',
  sand800: '#5D4C2F',
  sand900: '#453824',

  // Olive scale (primary brand hue)
  olive50: '#F3F4E8',
  olive100: '#E6E8D2',
  olive200: '#CFD3AC',
  olive300: '#B3B983',
  olive400: '#97A05F',
  olive500: '#7C8547',
  olive600: '#646B3A',
  olive700: '#4F552F',
  olive800: '#3C4025',
  olive900: '#2D301C',

  // Soft rose scale (secondary accent — hijab pairing, highlights)
  rose50: '#FAF0EC',
  rose100: '#F3DCD2',
  rose200: '#E5B7A5',
  rose300: '#D6937C',
  rose400: '#C5735B',
  rose500: '#A95740',
  rose600: '#87452F',
  rose700: '#6B3726',
  rose800: '#522A1E',
  rose900: '#3E2017',

  // Warm charcoal ink
  ink900: '#211D16',
  ink800: '#2E2920',
  ink700: '#3D372B',
  ink600: '#554C3D',

  // Semantic hues (tuned to sit next to sand/olive)
  success: '#5B7A4E',
  warning: '#B98A2E',
  danger: '#B0503C',
  info: '#5B7A96',
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
