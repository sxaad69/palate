// Primitive tokens — raw values. Components consume light.ts / dark.ts.
// Naplet identity: soft violet + deep plum night + warm cream. Gentle,
// sleepy, warm — a 3am-friendly palette.
// (NOT Palate's saffron, NOT Fastuna's teal, NOT Pip's sky, NOT Salahly's indigo/gold.)

export const violet = {
  100: '#EDE9FE',
  200: '#DDD6FE',
  300: '#C4B5FD',
  400: '#A78BFA',
  500: '#8B5CF6',
  600: '#7C3AED',
  700: '#6D28D9',
} as const;

// Deep plum — night-mode depth.
export const plum = {
  800: '#2A2138',
  900: '#1E1B2E',
  950: '#141122',
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
  info: '#7C3AED',
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
