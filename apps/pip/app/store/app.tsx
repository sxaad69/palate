import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { getDeviceId } from '../lib/device';
import { logEventToServer, fetchEventsFromServer } from '../lib/api';
import { isPro as billingIsPro } from '../lib/billing';
import {
  computeStats,
  recipeStreak,
  shouldShrink,
  todayKey,
  weekDots,
  type Completion,
  type HabitStats,
  type Recipe,
} from '../lib/habits';
import { strings, type Language, type Strings } from '../lib/strings';

interface AppState {
  onboarded: boolean;
  setOnboarded: (value: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Strings;
  recipes: Recipe[];
  addRecipe: (r: Omit<Recipe, 'id' | 'createdAt' | 'archived'>) => void;
  updateRecipe: (id: string, patch: Partial<Pick<Recipe, 'anchor' | 'behavior' | 'celebration'>>) => void;
  archiveRecipe: (id: string) => void;
  completions: Completion[];
  /** Mark a recipe done for today. Returns false if already done. */
  completeToday: (recipeId: string) => boolean;
  isDoneToday: (recipeId: string) => boolean;
  streakFor: (recipeId: string) => number;
  shrinkFor: (recipeId: string) => boolean;
  weekDotsFor: (recipeId: string) => { date: string; done: boolean }[];
  stats: HabitStats;
  isPro: boolean;
  refreshPro: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

const STORE_KEY = '@pip/store/v1';

interface Persisted {
  onboarded: boolean;
  language: Language;
  recipes: Recipe[];
  completions: Completion[];
}

function uid(): string {
  return `r-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboardedState] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [isPro, setIsPro] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) {
          const d = JSON.parse(raw) as Partial<Persisted>;
          if (typeof d.onboarded === 'boolean') setOnboardedState(d.onboarded);
          if (d.language === 'ar' || d.language === 'en') {
            setLanguageState(d.language);
            applyRtl(d.language);
          }
          if (Array.isArray(d.recipes)) setRecipes(d.recipes);
          if (Array.isArray(d.completions)) setCompletions(d.completions);
        }
      } catch {
        // ignore — start fresh
      } finally {
        hydratedRef.current = true;
      }
      try {
        const deviceId = await getDeviceId();
        const server = await fetchEventsFromServer(deviceId);
        if (server) {
          setCompletions((prev) => {
            const keys = new Set(server.map((c) => `${c.recipeId}:${c.date}`));
            return [...server, ...prev.filter((c) => !keys.has(`${c.recipeId}:${c.date}`))];
          });
        }
      } catch {
        // offline — keep local
      }
      try {
        setIsPro(await billingIsPro());
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const data: Persisted = { onboarded, language, recipes, completions };
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(data)).catch(() => {});
  }, [onboarded, language, recipes, completions]);

  const setOnboarded = (v: boolean) => setOnboardedState(v);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    applyRtl(lang);
  };

  const addRecipe: AppState['addRecipe'] = (r) => {
    setRecipes((prev) => [
      ...prev,
      { ...r, id: uid(), createdAt: Date.now(), archived: false },
    ]);
  };

  const updateRecipe: AppState['updateRecipe'] = (id, patch) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const archiveRecipe = (id: string) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, archived: true } : r)));
  };

  const isDoneToday = (recipeId: string) => {
    const key = todayKey();
    return completions.some((c) => c.recipeId === recipeId && c.date === key);
  };

  const completeToday = (recipeId: string): boolean => {
    if (isDoneToday(recipeId)) return false;
    const entry: Completion = { recipeId, date: todayKey() };
    setCompletions((prev) => [...prev, entry]);
    getDeviceId()
      .then((deviceId) =>
        logEventToServer(deviceId, { recipeId, date: entry.date, kind: 'completed' }),
      )
      .catch(() => {});
    return true;
  };

  const streakFor = (recipeId: string) => recipeStreak(recipeId, completions);
  const shrinkFor = (recipeId: string) => shouldShrink(recipeId, completions);
  const weekDotsFor = (recipeId: string) => weekDots(recipeId, completions);

  const refreshPro = async () => {
    try {
      setIsPro(await billingIsPro());
    } catch {
      // ignore
    }
  };

  const stats = useMemo(() => computeStats(recipes, completions), [recipes, completions]);
  const t = strings[language];

  const value = useMemo<AppState>(
    () => ({
      onboarded,
      setOnboarded,
      language,
      setLanguage,
      t,
      recipes,
      addRecipe,
      updateRecipe,
      archiveRecipe,
      completions,
      completeToday,
      isDoneToday,
      streakFor,
      shrinkFor,
      weekDotsFor,
      stats,
      isPro,
      refreshPro,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onboarded, language, recipes, completions, isPro, stats, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function applyRtl(lang: Language) {
  try {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(lang === 'ar');
  } catch {
    // ignore — non-critical
  }
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
