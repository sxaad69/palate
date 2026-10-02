// KeepsFresh primitive tokens — fresh herb greens + warm cream.
// Kitchen domain: produce-aisle greens, paper-bag cream neutrals.
// Never referenced directly in components; semantic themes
// (dark.ts / light.ts) map these.

export const primitives = {
  // Leaf green scale
  green950: '#0B1D12',
  green900: '#142F1D',
  green800: '#1D4A29',
  green700: '#265F32',
  green600: '#2F7D3D',
  green500: '#459A52',
  green400: '#6AB273',
  green300: '#97CB9E',
  green200: '#C2E0C6',
  green100: '#DFEFDF',
  green50: '#F1F8F2',

  // Warm cream neutrals (warm brand -> warm grays, never cool)
  cream500: '#C9B98E',
  cream400: '#DCCFAE',
  cream300: '#EAE2CC',
  cream200: '#F2EDDD',
  cream100: '#F7F2E6',
  cream50: '#FCFAF4',

  // Deep ink for text (green-tinted, not neutral black)
  ink900: '#152417',
  ink700: '#2C4030',
  ink500: '#5A6E5E',
  ink300: '#9AA89D',

  // Urgency / semantic hues (tuned to sit next to green)
  ripe500: '#C96A2B', // warm amber-orange for "use soon"
  ripe300: '#E8A15C',
  danger500: '#C0392B',
  danger300: '#E88A7A',
  info500: '#2E7D8A',
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
