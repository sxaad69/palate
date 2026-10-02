import type { TextStyle } from 'react-native';

// System fonts (San Francisco / Roboto) — never overridden without a brand reason.
// Senior-first scale: every step is 2sp larger than the portfolio default.
// Body text is 18sp — readable without glasses for most seniors.
export const typography = {
  display: { fontSize: 36, lineHeight: 44, fontWeight: '700' },
  h1: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '500' },
  h3: { fontSize: 22, lineHeight: 30, fontWeight: '500' },
  body: { fontSize: 18, lineHeight: 28, fontWeight: '400' },
  bodySmall: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  overline: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
