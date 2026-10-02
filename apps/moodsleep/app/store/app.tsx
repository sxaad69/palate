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
import { dayStr } from '../lib/insights';

export interface DayEntry {
  date: string; // YYYY-MM-DD, local
  mood: number | null; // 1..5
  sleepQuality: number | null; // 1..5 (the sleep leading into this day)
  bedTime: string | null; // "HH:MM"
  wakeTime: string | null; // "HH:MM"
  note: string | null;
}

export interface EntryPatch {
  mood?: number | null;
  sleepQuality?: number | null;
  bedTime?: string | null;
  wakeTime?: string | null;
  note?: string | null;
}

interface RestoryState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  entries: DayEntry[];
  /** Today (local date), created on first tap. */
  today: DayEntry;
  /** Auto-saves every change — the journal is always current. */
  updateToday: (patch: EntryPatch) => void;
  reminderTime: string | null; // "HH:MM" or null = disabled
  setReminderTime: (v: string | null) => void;
  streak: number;
  totalCheckIns: number;
  nightsLogged: number;
  isPro: boolean;
  setPro: (v: boolean) => void;
}

const RestoryContext = createContext<RestoryState | null>(null);

const KEY = '@restory/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  entries: DayEntry[];
  reminderTime: string | null;
  pro: boolean;
}

const blankEntry = (date: string): DayEntry => ({
  date,
  mood: null,
  sleepQuality: null,
  bedTime: null,
  wakeTime: null,
  note: null,
});

function hasAnyLog(e: DayEntry): boolean {
  return e.mood !== null || e.sleepQuality !== null;
}

function computeStreak(entries: DayEntry[]): number {
  const days = new Set(entries.filter(hasAnyLog).map((e) => e.date));
  let streak = 0;
  const d = new Date();
  // If today has no log yet, streak counts back from yesterday.
  if (!days.has(dayStr(d))) d.setDate(d.getDate() - 1);
  while (days.has(dayStr(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function RestoryProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [reminderTime, setReminderTimeState] = useState<string | null>(null);
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
          setEntries(Array.isArray(p.entries) ? p.entries : []);
          setReminderTimeState(typeof p.reminderTime === 'string' ? p.reminderTime : null);
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
    const p: Persisted = { onboarded, lang, entries, reminderTime, pro: isPro };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, entries, reminderTime, isPro]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);

  const todayDate = dayStr(new Date());

  const updateToday = useCallback(
    (patch: EntryPatch) => {
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.date === todayDate);
        if (idx === -1) return [...prev, { ...blankEntry(todayDate), ...patch }];
        const next = [...prev];
        next[idx] = { ...next[idx]!, ...patch };
        return next;
      });
    },
    [todayDate],
  );

  const setReminderTime = useCallback((v: string | null) => {
    setReminderTimeState(v);
  }, []);

  const setPro = useCallback((v: boolean) => {
    setIsPro(v);
    void setProLocal(v);
  }, []);

  const value = useMemo<RestoryState>(() => {
    const logged = entries.filter(hasAnyLog);
    const today = entries.find((e) => e.date === todayDate) ?? blankEntry(todayDate);
    return {
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      entries,
      today,
      updateToday,
      reminderTime,
      setReminderTime,
      streak: computeStreak(entries),
      totalCheckIns: logged.length,
      nightsLogged: entries.filter((e) => e.sleepQuality !== null).length,
      isPro,
      setPro,
    };
  }, [
    onboarded,
    lang,
    entries,
    todayDate,
    updateToday,
    reminderTime,
    setReminderTime,
    isPro,
    setPro,
  ]);

  return <RestoryContext.Provider value={value}>{children}</RestoryContext.Provider>;
}

export function useRestory(): RestoryState {
  const s = useContext(RestoryContext);
  if (!s) throw new Error('useRestory must be used within RestoryProvider');
  return s;
}
