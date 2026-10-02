// ShadowSay primitive tokens — warm coral + deep teal + cream.
// Speech energy (coral) on a calm deep-teal base with warm paper neutrals.
// Never referenced directly in components; light.ts / dark.ts map these.

export const primitives = {
  // Coral — the "voice" accent: play, record, score actions
  coral900: '#7A2418',
  coral800: '#962F1F',
  coral700: '#B53F29',
  coral600: '#D05136',
  coral500: '#E5654D',
  coral400: '#EA7F66',
  coral300: '#F29E8A',
  coral200: '#F7C3B4',
  coral100: '#FBE0D7',

  // Deep teal — the calm learning base
  teal950: '#0B1E1F',
  teal900: '#0E2A2B',
  teal800: '#123638',
  teal700: '#174547',
  teal600: '#1D585A',
  teal500: '#266F71',
  teal400: '#35908F',
  teal300: '#63AFAE',
  teal200: '#9FD0CF',
  teal100: '#CDE8E7',

  // Warm paper neutrals (warm grays — a cool gray would clash with coral)
  cream: '#FFF9F0',
  paper50: '#FDF7EC',
  paper100: '#F7EDD9',
  paper200: '#EEDDC0',
  warm600: '#7A6A58',
  warm700: '#5C4F41',
  warm900: '#2E2721',

  // Semantic hues (tuned against coral, not against teal)
  success: '#4C9A6C',
  warning: '#D9A441',
  danger: '#D6534F',
  info: '#5B8DD9',
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
