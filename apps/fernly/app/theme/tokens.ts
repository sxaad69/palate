// Primitive tokens — raw values. Components consume light.ts / dark.ts.
// Fernly identity: garden leaf green + warm cream + deep forest. Alive, earthy.
// (NOT Palate's saffron, NOT Fastuna's clinical teal, NOT Pip's sky,
//  NOT Salahly's indigo/gold, NOT Naplet's violet.)

export const leaf = {
  100: '#ECFCCB',
  200: '#D9F99D',
  300: '#BEF264',
  400: '#A3E635',
  500: '#84CC16',
  600: '#65A30D',
  700: '#4D7C0F',
  800: '#3F6212',
} as const;

// Deep forest — dark-mode depth.
export const forest = {
  800: '#16210F',
  900: '#0C1A0C',
  950: '#060D06',
} as const;

export const slate = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
} as const;

export const semantic = {
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#4D7C0F',
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
