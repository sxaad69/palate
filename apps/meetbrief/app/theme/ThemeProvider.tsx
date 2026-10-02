import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, type ThemeColors } from './dark';
import { lightColors } from './light';
import { spacing, radii } from './tokens';
import { typography, type Typography } from './typography';
import { useMeetBrief } from '../store/app';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: Typography;
  mode: Exclude<ThemeMode, 'system'>;
  isDark: boolean;
}

const ThemeContext = createContext<Theme | null>(null);

// themeMode lives in the store (persisted); this provider only resolves it
// against the system scheme. Provider order: MeetBriefProvider > ThemeProvider.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeMode } = useMeetBrief();
  const system = useColorScheme();
  // Business app: light is the primary experience.
  const mode: Exclude<ThemeMode, 'system'> =
    themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;

  const value = useMemo<Theme>(
    () => ({
      colors: mode === 'dark' ? darkColors : lightColors,
      spacing,
      radii,
      typography,
      mode,
      isDark: mode === 'dark',
    }),
    [mode],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const t = useContext(ThemeContext);
  if (!t) throw new Error('useTheme must be used within ThemeProvider');
  return t;
}
