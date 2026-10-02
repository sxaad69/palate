// TwoPurse primitive tokens — warm terracotta + sage on cream.
// Money without the cold bank-blue: homey, warm, trustworthy.
// Never referenced directly in components; semantic themes map these.

export const primitives = {
  // Terracotta brand scale
  terra900: '#4E2413',
  terra700: '#8C4426',
  terra600: '#B85A33',
  terra500: '#C97043',
  terra400: '#D68A5C',
  terra300: '#E4A97E',
  terra200: '#F0C6A4',
  terra100: '#F8DECB',
  terra50: '#FDF1E4',

  // Sage secondary scale
  sage800: '#46523B',
  sage600: '#6E7F60',
  sage500: '#7D8C6F',
  sage400: '#98A686',
  sage300: '#B7C2A8',
  sage200: '#D2D9C4',
  sage100: '#E7EBDB',

  // Cream neutrals (warm)
  cream50: '#FAF6ED',
  cream100: '#F3ECDC',
  cream200: '#E7D9BF',
  ink300: '#B9A98F',
  ink500: '#7E6E56',
  ink700: '#4E4232',
  ink900: '#2B2318',

  // Dark mode warm surfaces (deep espresso, never pure black)
  espresso950: '#1B140E',
  espresso900: '#241B13',
  espresso800: '#2E2419',
  espresso700: '#3B2F20',
  espresso600: '#4C3E2C',

  // Semantic hues (tuned to sit next to terracotta)
  success: '#5E8A5A',
  warning: '#C99A2E',
  danger: '#C0513F',
  info: '#5E8CB8',
} as const;

// Envelope colors — mid-saturation so they read in both light and dark.
export const envelopeColors = [
  '#C1613B', // terracotta
  '#7D8C6F', // sage
  '#D9A441', // honey
  '#C97B84', // dusty rose
  '#4E7D7B', // deep teal
  '#8A5E8C', // plum
  '#5E8CB8', // denim
  '#8C6A4A', // cocoa
] as const;

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
