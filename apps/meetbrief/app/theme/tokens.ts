// MeetBrief primitive tokens — boardroom slate + signal blue.
// Professional/efficient tone for freelancers and small teams. Cool slate
// neutrals pair with the cool signal-blue brand (never mix warm grays here).
// Never referenced directly in components; semantic themes map these.

export const primitives = {
  // Slate scale (cool neutrals)
  slate950: '#020617',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',

  // Signal blue scale (brand)
  blue800: '#1E40AF',
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue300: '#93C5FD',
  blue200: '#BFDBFE',
  blue100: '#DBEAFE',
  blue50: '#EFF6FF',

  // Recording red + money amber (tuned to sit next to slate/blue)
  record: '#DC2626',
  recordDark: '#F87171',
  money: '#B45309',
  moneyDark: '#FBBF24',

  // Semantic hues
  success: '#16A34A',
  successDark: '#4ADE80',
  warning: '#B45309',
  warningDark: '#FBBF24',
  danger: '#DC2626',
  dangerDark: '#F87171',
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
