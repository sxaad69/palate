// ThreeGood primitive tokens — sunrise warmth. Morning light, not neon.
// Warm cream/peach/gold brand scale + warm-brown neutrals (warm brand ->
// warm grays; cool grays would clash). Never referenced directly in
// components; semantic themes (dark.ts / light.ts) map these.

export const primitives = {
  // Cream (light surfaces)
  cream50: '#FFFBF4',
  cream100: '#FFF5E6',
  cream200: '#FBE9D0',
  cream300: '#F6D8AC',

  // Peach → gold brand scale
  peach400: '#F0BE85',
  gold500: '#E0953A',
  gold600: '#C97E24',
  gold700: '#9E5F14',
  ember800: '#6E4211',

  // Warm bark neutrals
  bark50: '#FFF1DC',
  bark200: '#D9B98A',
  bark400: '#A98F74',
  bark600: '#6B4E30',
  bark700: '#4E3A24',
  bark800: '#3B2B1A',
  bark900: '#2E2114',
  bark950: '#221810',

  // Ink (light-mode text): warm dark brown, not pure black
  ink900: '#3A2A1A',
  ink600: '#7A5C40',

  // Semantic hues (tuned to sit next to gold)
  success: '#4C9455',
  warning: '#C77E1F',
  danger: '#C05145',
  info: '#4E7FA3',
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
