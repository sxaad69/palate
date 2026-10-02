// Primitive tokens — raw values. Never referenced directly in components;
// components consume the semantic mappings in light.ts / dark.ts.

// Soft sky blue — primary accent (trust, calm, clarity)
export const sky = {
  50: '#F0F7FC',
  100: '#DCEBF5',
  200: '#B9D9EC',
  300: '#8FC2E0',
  400: '#63A8D1',
  500: '#3E8FC0',
  600: '#2E74A3',
  700: '#265D85',
  800: '#204C6B',
  900: '#1B3F59',
} as const;

// Gentle gold — savings, milestones, celebration (money glows warm)
export const gold = {
  50: '#FDF9EE',
  100: '#FAF0D5',
  200: '#F5E0A8',
  300: '#EFCC74',
  400: '#E9B84A',
  500: '#E2A62B',
  600: '#C78A1F',
  700: '#A66E1B',
  800: '#855A1C',
  900: '#6D4919',
} as const;

// Cool slate neutrals — morning coolness
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
  950: '#0A0F1C',
} as const;

export const semantic = {
  success: '#0E9F6E',
  warning: '#C78A1F',
  danger: '#DC2626',
  info: '#2E74A3',
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
