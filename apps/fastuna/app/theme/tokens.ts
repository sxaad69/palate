// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.
// Fastuna identity: fresh teal + deep green. Vitality, clarity, discipline.
// (NOT Palate's saffron — that belongs to food.)

export const teal = {
  50: '#EFFDFB',
  100: '#CCFBF1',
  200: '#99F6E4',
  300: '#5EEAD4',
  400: '#2DD4BF',
  500: '#14B8A6',
  600: '#0D9488',
  700: '#0F766E',
  800: '#115E59',
  900: '#134E4A',
} as const;

// Deep green — dark-mode depth and brand moments.
export const pine = {
  800: '#143230',
  900: '#0B1F1C',
  950: '#071412',
} as const;

// Cool slate neutrals to match the teal brand temperature.
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
  info: '#0284C7',
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
