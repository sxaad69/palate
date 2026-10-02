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
import { logFastToServer, fetchFastsFromServer } from '../lib/api';
import { isPro as billingIsPro } from '../lib/billing';
import {
  computeStats,
  computeStreak,
  type FastEntry,
  type FastStats,
} from '../lib/fasting';
import { presetById } from '../data/presets';
import { strings, type Language, type Strings } from '../lib/strings';

export interface ActiveFast {
  startedAt: number;
  targetHours: number;
  presetId: string;
}

export interface Achievement {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  unlocked: boolean;
}

interface AppState {
  goal: string | null;
  setGoal: (goal: string) => void;
  onboarded: boolean;
  setOnboarded: (value: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Strings;
  presetId: string;
  setPresetId: (id: string) => void;
  activeFast: ActiveFast | null;
  startFast: (presetId?: string, startedAt?: number) => void;
  /** End the current fast. Completed = ran to (or past) the target. */
  endFast: () => void;
  /** Shift the active fast's start time (e.g. "I actually started earlier"). */
  adjustStart: (deltaMs: number) => void;
  fasts: FastEntry[];
  streak: number;
  stats: FastStats;
  achievements: Achievement[];
  isPro: boolean;
  refreshPro: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

const STORE_KEY = '@fastuna/store/v1';

interface Persisted {
  goal: string | null;
  onboarded: boolean;
  language: Language;
  presetId: string;
  fasts: FastEntry[];
  activeFast: ActiveFast | null;
}

function achievementsFor(fasts: FastEntry[], streak: number): Achievement[] {
  const completed = fasts.filter((f) => f.completed);
  const has24h = completed.some((f) => f.endedAt - f.startedAt >= 24 * 3_600_000);
  const defs: Omit<Achievement, 'unlocked'>[] = [
    { id: 'a-first', nameEn: 'First fast', nameAr: 'أول صيام', descEn: 'Complete your first fast.', descAr: 'أكمل أول صيام لك.' },
    { id: 'a-ten', nameEn: 'Ten club', nameAr: 'نادي العشرة', descEn: 'Complete 10 fasts.', descAr: 'أكمل ١٠ مرات صيام.' },
    { id: 'a-streak-7', nameEn: 'Week warrior', nameAr: 'محارب الأسبوع', descEn: '7-day streak.', descAr: '٧ أيام متتالية.' },
    { id: 'a-24h', nameEn: 'Marathon', nameAr: 'الماراثون', descEn: 'Complete a 24-hour fast.', descAr: 'أكمل صيام ٢٤ ساعة.' },
    { id: 'a-streak-30', nameEn: 'Monthly master', nameAr: 'سيد الشهر', descEn: '30-day streak.', descAr: '٣٠ يوماً متتالية.' },
  ];
  const unlocked: Record<string, boolean> = {
    'a-first': completed.length >= 1,
    'a-ten': completed.length >= 10,
    'a-streak-7': streak >= 7,
    'a-24h': has24h,
    'a-streak-30': streak >= 30,
  };
  return defs.map((d) => ({ ...d, unlocked: unlocked[d.id] ?? false }));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goal, setGoalState] = useState<string | null>(null);
  const [onboarded, setOnboardedState] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [presetId, setPresetIdState] = useState('p-16-8');
  const [fasts, setFasts] = useState<FastEntry[]>([]);
  const [activeFast, setActiveFast] = useState<ActiveFast | null>(null);
  const [isPro, setIsPro] = useState(false);
  const hydratedRef = useRef(false);

  // Load persisted state once.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) {
          const d = JSON.parse(raw) as Partial<Persisted>;
          if (d.goal !== undefined) setGoalState(d.goal);
          if (typeof d.onboarded === 'boolean') setOnboardedState(d.onboarded);
          if (d.language === 'ar' || d.language === 'en') {
            setLanguageState(d.language);
            applyRtl(d.language);
          }
          if (typeof d.presetId === 'string') setPresetIdState(d.presetId);
          if (Array.isArray(d.fasts)) setFasts(d.fasts);
          if (d.activeFast) setActiveFast(d.activeFast);
        }
      } catch {
        // ignore — start fresh
      } finally {
        hydratedRef.current = true;
      }
      // Server is the backup of record: merge on launch (server wins on id).
      try {
        const deviceId = await getDeviceId();
        const serverFasts = await fetchFastsFromServer(deviceId);
        if (serverFasts) {
          setFasts((prev) => {
            const ids = new Set(serverFasts.map((f) => f.id));
            const localOnly = prev.filter((f) => !ids.has(f.id));
            return [...serverFasts, ...localOnly];
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

  // Persist on every change, never before the initial load.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const data: Persisted = { goal, onboarded, language, presetId, fasts, activeFast };
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(data)).catch(() => {});
  }, [goal, onboarded, language, presetId, fasts, activeFast]);

  const setGoal = (g: string) => setGoalState(g);
  const setOnboarded = (v: boolean) => setOnboardedState(v);
  const setPresetId = (id: string) => setPresetIdState(id);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    applyRtl(lang);
  };

  const startFast = (pid?: string, startedAt?: number) => {
    const preset = presetById(pid ?? presetId);
    setActiveFast({
      startedAt: startedAt ?? Date.now(),
      targetHours: preset.fastHours,
      presetId: preset.id,
    });
  };

  const endFast = () => {
    if (!activeFast) return;
    const endedAt = Date.now();
    const elapsedHrs = (endedAt - activeFast.startedAt) / 3_600_000;
    const entry: FastEntry = {
      id: `fast-${endedAt}`,
      startedAt: activeFast.startedAt,
      endedAt,
      targetHours: activeFast.targetHours,
      presetId: activeFast.presetId,
      completed: elapsedHrs >= activeFast.targetHours * 0.9,
    };
    setFasts((prev) => [entry, ...prev]);
    setActiveFast(null);
    // Fire-and-forget server backup.
    getDeviceId()
      .then((deviceId) =>
        logFastToServer(deviceId, {
          startedAt: entry.startedAt,
          endedAt: entry.endedAt,
          targetHours: entry.targetHours,
          presetId: entry.presetId,
          completed: entry.completed,
        }),
      )
      .catch(() => {});
  };

  const adjustStart = (deltaMs: number) => {
    setActiveFast((prev) =>
      prev ? { ...prev, startedAt: prev.startedAt + deltaMs } : prev,
    );
  };

  const refreshPro = async () => {
    try {
      setIsPro(await billingIsPro());
    } catch {
      // ignore
    }
  };

  const streak = useMemo(() => computeStreak(fasts), [fasts]);
  const stats = useMemo(() => computeStats(fasts), [fasts]);
  const achievements = useMemo(() => achievementsFor(fasts, streak), [fasts, streak]);
  const t = strings[language];

  const value = useMemo<AppState>(
    () => ({
      goal,
      setGoal,
      onboarded,
      setOnboarded,
      language,
      setLanguage,
      t,
      presetId,
      setPresetId,
      activeFast,
      startFast,
      endFast,
      adjustStart,
      fasts,
      streak,
      stats,
      achievements,
      isPro,
      refreshPro,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [goal, onboarded, language, presetId, activeFast, fasts, isPro, streak, stats, achievements, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function applyRtl(lang: Language) {
  try {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(lang === 'ar');
    // NOTE: RN applies the direction fully on reload; in-app text swaps
    // immediately, layout mirrors after restart. Documented in BUILD_NOTES.
  } catch {
    // ignore — non-critical
  }
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
