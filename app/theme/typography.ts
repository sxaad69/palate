import type { TextStyle } from 'react-native';

// System fonts (San Francisco / Roboto) — never overridden without a brand reason.
// NOTE: BRAND.md lists h2/h3 as "semibold" but also caps weights at 400/500/700,
// so 500 (medium) is used — the closest allowed weight.
export const typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  h1: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  h2: { fontSize: 20, lineHeight: 28, fontWeight: '500' },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '500' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
