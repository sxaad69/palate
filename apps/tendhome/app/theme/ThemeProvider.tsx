import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme, I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, type Colors } from './light';
import { darkColors } from './dark';
import { spacing, radii } from './tokens';
import { typography } from './typography';

export type ColorScheme = 'light' | 'dark';
export type ColorSchemePreference = ColorScheme | 'system';
export type ThemeMode = ColorSchemePreference;
export type Lang = 'en' | 'ar';

const LANG_KEY = '@echominutes:lang';
const MODE_KEY = '@echominutes:mode';

export interface Theme {
  colors: Colors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  colorScheme: ColorScheme;
  isDark: boolean;
  /** The user's chosen appearance preference (system/light/dark). */
  preference: ColorSchemePreference;
  setColorScheme: (preference: ColorSchemePreference) => void;
  /** Alias kept for settings screens. */
  mode: ColorSchemePreference;
  setMode: (mode: ColorSchemePreference) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme: ColorScheme =
    useColorScheme() === 'dark' ? 'dark' : 'light';
  const [preference, setPreference] = useState<ColorSchemePreference>('system');
  const [lang, setLangState] = useState<Lang>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [l, m] = await Promise.all([
          AsyncStorage.getItem(LANG_KEY),
          AsyncStorage.getItem(MODE_KEY),
        ]);
        if (l === 'ar' || l === 'en') setLangState(l);
        if (m === 'light' || m === 'dark' || m === 'system') setPreference(m);
      } catch {
        // defaults stand
      }
      setReady(true);
    })();
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(LANG_KEY, l).catch(() => {});
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(l === 'ar');
  };

  const setMode = (m: ColorSchemePreference) => {
    setPreference(m);
    AsyncStorage.setItem(MODE_KEY, m).catch(() => {});
  };

  const colorScheme: ColorScheme =
    preference === 'system' ? systemScheme : preference;

  const theme = useMemo<Theme>(
    () => ({
      colors: colorScheme === 'dark' ? darkColors : lightColors,
      spacing,
      radii,
      typography,
      colorScheme,
      isDark: colorScheme === 'dark',
      preference,
      setColorScheme: setMode,
      mode: preference,
      setMode,
      lang,
      setLang,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorScheme, preference, lang, ready],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within a ThemeProvider');
  return theme;
}
