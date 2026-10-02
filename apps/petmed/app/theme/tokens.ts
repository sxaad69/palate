// Pawscript primitive tokens — playful teal, warm amber, cream.
// Friendly pet-care warmth; NOT clinical. Warm neutrals throughout
// (a warm brand with cool grays would look generic). Never referenced
// directly in components; semantic themes (dark.ts / light.ts) map these.

export const primitives = {
  // Playful teal scale (brand primary)
  teal900: '#0B4A44',
  teal700: '#0E7A6E',
  teal600: '#0E9E8E',
  teal500: '#1FBFA9',
  teal300: '#63D9C4',
  teal200: '#A8EBDD',
  teal100: '#D3F6EE',

  // Warm amber scale (dose action / highlights)
  amber700: '#B45309',
  amber600: '#D97706',
  amber500: '#F2A83D',
  amber300: '#F8C876',
  amber200: '#FBDD9E',
  amber100: '#FCEFD3',

  // Cream / warm neutrals
  cream50: '#FFFBF3',
  cream100: '#FAF3E4',
  cream200: '#F0E6CF',
  cream300: '#E2D3B2',
  bark900: '#3B2F23',
  bark700: '#5C4C39',
  bark500: '#7A6A54',
  bark400: '#A89372',

  // Dark-mode warm charcoal
  char900: '#14110C',
  char800: '#1F1B14',
  char700: '#292419',
  char600: '#3A3222',
  char500: '#4E4430',

  // Semantic hues (tuned to sit next to teal/amber)
  success: '#2F8F4E',
  warning: '#B98A2E',
  danger: '#C24B4B',
  info: '#3D7AB0',
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

// Per-pet color-coding for the multi-pet dose timeline.
export const petColors = [
  '#0E9E8E', // teal
  '#E8862E', // amber-orange
  '#E8604C', // coral
  '#7C6CF0', // violet
  '#DE5E8B', // rose
  '#3E9BD6', // sky
] as const;
