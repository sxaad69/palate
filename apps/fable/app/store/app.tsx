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
import { getGuidanceDensity, setGuidanceDensity, type GuidanceDensity } from '../lib/speech';
import { isProLocal, setProLocal } from '../lib/billing';

export interface SessionLog {
  sessionId: string;
  minutes: number;
  at: number; // epoch ms
}

interface FableState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  guidance: GuidanceDensity;
  setGuidance: (g: GuidanceDensity) => void;
  logs: SessionLog[];
  logSession: (sessionId: string, minutes: number) => void;
  favorites: string[];
  toggleFavorite: (sessionId: string) => void;
  streak: number;
  totalMinutes: number;
  sessionsThisWeek: number;
  isPro: boolean;
  setPro: (v: boolean) => void;
}

const FableContext = createContext<FableState | null>(null);

const KEY = '@fable/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  guidance: GuidanceDensity;
  logs: SessionLog[];
  favorites: string[];
  pro: boolean;
}

function dayStr(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function computeStreak(logs: SessionLog[]): number {
  const days = new Set(logs.map((l) => dayStr(l.at)));
  let streak = 0;
  const d = new Date();
  // If today has no session yet, streak counts back from yesterday.
  if (!days.has(dayStr(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayStr(d.getTime()))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function FableProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [guidance, setGuidanceState] = useState<GuidanceDensity>(getGuidanceDensity());
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
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
          if (p.guidance) {
            setGuidanceDensity(p.guidance);
            setGuidanceState(p.guidance);
          }
          setLogs(Array.isArray(p.logs) ? p.logs : []);
          setFavorites(Array.isArray(p.favorites) ? p.favorites : []);
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
    const p: Persisted = { onboarded, lang, guidance, logs, favorites, pro: isPro };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, guidance, logs, favorites, isPro]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);

  const setGuidance = useCallback((g: GuidanceDensity) => {
    setGuidanceDensity(g);
    setGuidanceState(g);
  }, []);

  const logSession = useCallback((sessionId: string, minutes: number) => {
    setLogs((prev) => [...prev, { sessionId, minutes, at: Date.now() }]);
  }, []);

  const toggleFavorite = useCallback((sessionId: string) => {
    setFavorites((prev) =>
      prev.includes(sessionId) ? prev.filter((f) => f !== sessionId) : [...prev, sessionId],
    );
  }, []);

  const setPro = useCallback((v: boolean) => {
    setIsPro(v);
    void setProLocal(v);
  }, []);

  const value = useMemo<FableState>(() => {
    const totalMinutes = logs.reduce((s, l) => s + l.minutes, 0);
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    return {
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      guidance,
      setGuidance,
      logs,
      logSession,
      favorites,
      toggleFavorite,
      streak: computeStreak(logs),
      totalMinutes,
      sessionsThisWeek: logs.filter((l) => l.at >= weekAgo).length,
      isPro,
      setPro,
    };
  }, [onboarded, lang, logs, favorites, isPro, guidance, setLanguage, setGuidance, logSession, toggleFavorite, setPro]);

  return <FableContext.Provider value={value}>{children}</FableContext.Provider>;
}

export function useFable(): FableState {
  const s = useContext(FableContext);
  if (!s) throw new Error('useFable must be used within FableProvider');
  return s;
}
