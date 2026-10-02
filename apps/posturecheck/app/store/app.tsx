import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLang, setLang, type Lang } from '../lib/i18n';
import { isProLocal, setProLocal } from '../lib/billing';
import { deleteCheckPhoto } from '../lib/photos';
import { cancelNudges, scheduleNudges } from '../lib/notifications';
import type { AngleReadings, Observation } from '../lib/pose';
import type { ThemeMode } from '../theme/ThemeProvider';

export const FREE_CHECKS_PER_MONTH = 3;

export interface CheckRecord {
  id: string;
  at: number; // epoch ms
  photoUri: string; // stored in app document dir
  score: number; // 0..100
  angles: AngleReadings;
  observations: Observation[];
  providerId: string;
}

export interface Reminders {
  enabled: boolean;
  intervalMin: 30 | 60 | 120;
}

interface PostureState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  checks: CheckRecord[];
  addCheck: (c: Omit<CheckRecord, 'id' | 'at'>) => CheckRecord;
  deleteCheck: (id: string) => void;
  latestCheck: CheckRecord | null;
  avgScore: number | null;
  checksThisMonth: number;
  canCheck: boolean;
  exerciseDone: Record<string, number[]>; // exerciseId -> timestamps
  toggleExerciseDoneToday: (id: string) => void;
  exercisesDoneToday: (id: string) => boolean;
  totalExercisesDone: number;
  reminders: Reminders;
  setReminders: (r: Reminders) => void;
  isPro: boolean;
  setPro: (v: boolean) => void;
}

const PostureContext = createContext<PostureState | null>(null);

const KEY = '@straightup/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  themeMode: ThemeMode;
  checks: CheckRecord[];
  exerciseDone: Record<string, number[]>;
  reminders: Reminders;
  pro: boolean;
}

function makeId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function monthKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function PostureProvider({
  children,
  initialThemeMode,
}: {
  children: React.ReactNode;
  initialThemeMode?: ThemeMode;
}) {
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialThemeMode ?? 'system');
  const [checks, setChecks] = useState<CheckRecord[]>([]);
  const [exerciseDone, setExerciseDone] = useState<Record<string, number[]>>({});
  const [reminders, setRemindersState] = useState<Reminders>({ enabled: false, intervalMin: 60 });
  const [isPro, setIsPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load once.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const p = JSON.parse(raw) as Persisted;
          setOnboarded(!!p.onboarded);
          if (p.lang === 'ar' || p.lang === 'en') {
            setLang(p.lang);
            setLangState(p.lang);
          }
          if (p.themeMode === 'light' || p.themeMode === 'dark' || p.themeMode === 'system') {
            setThemeModeState(p.themeMode);
          }
          setChecks(Array.isArray(p.checks) ? p.checks : []);
          setExerciseDone(p.exerciseDone && typeof p.exerciseDone === 'object' ? p.exerciseDone : {});
          if (p.reminders && typeof p.reminders.enabled === 'boolean') {
            setRemindersState({
              enabled: p.reminders.enabled,
              intervalMin: p.reminders.intervalMin === 30 || p.reminders.intervalMin === 120 ? p.reminders.intervalMin : 60,
            });
          }
          setIsPro(!!p.pro);
        } else {
          setIsPro(await isProLocal());
        }
      } catch {
        // start fresh
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    const p: Persisted = { onboarded, lang, themeMode, checks, exerciseDone, reminders, pro: isPro };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, themeMode, checks, exerciseDone, reminders, isPro]);

  // Apply reminder schedule whenever the setting changes (post-hydration).
  useEffect(() => {
    if (!hydrated) return;
    if (reminders.enabled) void scheduleNudges(reminders.intervalMin);
    else void cancelNudges();
  }, [hydrated, reminders]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);

  const setThemeMode = useCallback((m: ThemeMode) => setThemeModeState(m), []);

  const addCheck = useCallback((c: Omit<CheckRecord, 'id' | 'at'>) => {
    const rec: CheckRecord = { ...c, id: makeId(), at: Date.now() };
    setChecks((prev) => [rec, ...prev]);
    return rec;
  }, []);

  const deleteCheck = useCallback((id: string) => {
    setChecks((prev) => {
      const rec = prev.find((c) => c.id === id);
      if (rec) void deleteCheckPhoto(rec.photoUri);
      return prev.filter((c) => c.id !== id);
    });
  }, []);

  const toggleExerciseDoneToday = useCallback((id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setExerciseDone((prev) => {
      const stamps = prev[id] ?? [];
      const doneToday = stamps.some((ts) => new Date(ts).toISOString().slice(0, 10) === today);
      return {
        ...prev,
        [id]: doneToday
          ? stamps.filter((ts) => new Date(ts).toISOString().slice(0, 10) !== today)
          : [...stamps, Date.now()],
      };
    });
  }, []);

  const exercisesDoneToday = useCallback(
    (id: string) => {
      const today = new Date().toISOString().slice(0, 10);
      return (exerciseDone[id] ?? []).some((ts) => new Date(ts).toISOString().slice(0, 10) === today);
    },
    [exerciseDone],
  );

  const setReminders = useCallback((r: Reminders) => setRemindersState(r), []);

  const setPro = useCallback((v: boolean) => {
    setIsPro(v);
    void setProLocal(v);
  }, []);

  const value = useMemo<PostureState>(() => {
    const sorted = [...checks].sort((a, b) => b.at - a.at);
    const mk = monthKey(Date.now());
    const checksThisMonth = checks.filter((c) => monthKey(c.at) === mk).length;
    return {
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      themeMode,
      setThemeMode,
      checks: sorted,
      addCheck,
      deleteCheck,
      latestCheck: sorted[0] ?? null,
      avgScore:
        checks.length > 0
          ? Math.round(checks.reduce((s, c) => s + c.score, 0) / checks.length)
          : null,
      checksThisMonth,
      canCheck: isPro || checksThisMonth < FREE_CHECKS_PER_MONTH,
      exerciseDone,
      toggleExerciseDoneToday,
      exercisesDoneToday,
      totalExercisesDone: Object.values(exerciseDone).reduce((s, a) => s + a.length, 0),
      reminders,
      setReminders,
      isPro,
      setPro,
    };
  }, [
    onboarded, lang, themeMode, checks, exerciseDone, reminders, isPro,
    setLanguage, setThemeMode, addCheck, deleteCheck,
    toggleExerciseDoneToday, exercisesDoneToday, setReminders, setPro,
  ]);

  return <PostureContext.Provider value={value}>{children}</PostureContext.Provider>;
}

export function usePosture(): PostureState {
  const s = useContext(PostureContext);
  if (!s) throw new Error('usePosture must be used within PostureProvider');
  return s;
}
