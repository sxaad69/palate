import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, type ThemeColors } from './dark';
import { lightColors } from './light';
import { spacing, radii, petColors } from './tokens';
import { typography, type Typography } from './typography';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: Typography;
  petColors: typeof petColors;
  mode: Exclude<ThemeMode, 'system'>;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  // Pet care is a daytime product: fall back to light when system unknown.
  const mode: Exclude<ThemeMode, 'system'> =
    themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;

  const value = useMemo<Theme>(
    () => ({
      colors: mode === 'dark' ? darkColors : lightColors,
      spacing,
      radii,
      typography,
      petColors,
      mode,
      themeMode,
      setThemeMode,
      isDark: mode === 'dark',
    }),
    [mode, themeMode],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const t = useContext(ThemeContext);
  if (!t) throw new Error('useTheme must be used within ThemeProvider');
  return t;
}
