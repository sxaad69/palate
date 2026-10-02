import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLang, setLang, type Lang } from '../lib/i18n';
import { getVoiceRate, setVoiceRate } from '../lib/model';
import { isProLocal, setProLocal } from '../lib/billing';
import { freePackFor, phrasesForPack, type PackDirection, type PackId } from '../data/phrases';

/** Free tier: 10 recorded attempts per day (unlimited on Pro). */
export const FREE_PRACTICES_PER_DAY = 10;

export interface PhraseStat {
  stars: number;
  attempts: number;
  lastAt: number;
}

export interface PracticeLog {
  at: number; // epoch ms
  phraseId: string;
}

interface ShadowState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  direction: PackDirection;
  setDirection: (d: PackDirection) => void;
  voiceRate: number;
  setVoiceRate: (r: number) => void;
  stats: Record<string, PhraseStat>;
  logs: PracticeLog[];
  scorePhrase: (phraseId: string, stars: number) => void;
  /** Register a finished recording attempt. Returns false if the free daily cap is hit. */
  consumeAttempt: () => boolean;
  attemptsLeftToday: number;
  streak: number;
  phrasesCompleted: number;
  starsEarned: number;
  packProgress: (pack: PackId) => { done: number; total: number };
  isPro: boolean;
  setPro: (v: boolean) => void;
}

const ShadowContext = createContext<ShadowState | null>(null);

const KEY = '@shadowsay/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  direction: PackDirection;
  voiceRate: number;
  stats: Record<string, PhraseStat>;
  logs: PracticeLog[];
  attemptsDay: { date: string; count: number };
  pro: boolean;
}

function dayStr(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function computeStreak(logs: PracticeLog[]): number {
  const days = new Set(logs.map((l) => dayStr(l.at)));
  let streak = 0;
  const d = new Date();
  if (!days.has(dayStr(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayStr(d.getTime()))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function ShadowProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [direction, setDirectionState] = useState<PackDirection>('ar-en');
  const [voiceRate, setVoiceRateState] = useState(getVoiceRate());
  const [stats, setStats] = useState<Record<string, PhraseStat>>({});
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [attemptsDay, setAttemptsDay] = useState({ date: dayStr(Date.now()), count: 0 });
  const [isPro, setIsPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);

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
          if (p.direction === 'ar-en' || p.direction === 'en-ar') setDirectionState(p.direction);
          if (typeof p.voiceRate === 'number') {
            setVoiceRate(p.voiceRate);
            setVoiceRateState(p.voiceRate);
          }
          setStats(p.stats ?? {});
          setLogs(Array.isArray(p.logs) ? p.logs : []);
          const today = dayStr(Date.now());
          setAttemptsDay(
            p.attemptsDay?.date === today ? p.attemptsDay : { date: today, count: 0 },
          );
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

  useEffect(() => {
    if (!hydrated) return;
    const p: Persisted = { onboarded, lang, direction, voiceRate, stats, logs, attemptsDay, pro: isPro };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, direction, voiceRate, stats, logs, attemptsDay, isPro]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);

  const setDirection = useCallback((d: PackDirection) => setDirectionState(d), []);

  const setVoiceRateCb = useCallback((r: number) => {
    setVoiceRate(r);
    setVoiceRateState(r);
  }, []);

  const scorePhrase = useCallback((phraseId: string, stars: number) => {
    setStats((prev) => ({
      ...prev,
      [phraseId]: {
        stars,
        attempts: (prev[phraseId]?.attempts ?? 0) + 1,
        lastAt: Date.now(),
      },
    }));
    setLogs((prev) => [...prev, { at: Date.now(), phraseId }]);
  }, []);

  const consumeAttempt = useCallback((): boolean => {
    if (isPro) return true;
    const today = dayStr(Date.now());
    const base = attemptsDay.date === today ? attemptsDay : { date: today, count: 0 };
    if (base.count >= FREE_PRACTICES_PER_DAY) return false;
    setAttemptsDay({ date: today, count: base.count + 1 });
    return true;
  }, [isPro, attemptsDay]);

  const setPro = useCallback((v: boolean) => {
    setIsPro(v);
    void setProLocal(v);
  }, []);

  const value = useMemo<ShadowState>(() => {
    const statsList = Object.values(stats);
    const phrasesCompleted = statsList.filter((s) => s.stars > 0).length;
    const starsEarned = statsList.reduce((s, x) => s + x.stars, 0);
    const today = dayStr(Date.now());
    return {
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      direction,
      setDirection,
      voiceRate,
      setVoiceRate: setVoiceRateCb,
      stats,
      logs,
      scorePhrase,
      consumeAttempt,
      attemptsLeftToday: isPro
        ? Infinity
        : Math.max(0, FREE_PRACTICES_PER_DAY - (attemptsDay.date === today ? attemptsDay.count : 0)),
      streak: computeStreak(logs),
      phrasesCompleted,
      starsEarned,
      packProgress: (pack: PackId) => {
        const all = phrasesForPack(pack);
        return {
          total: all.length,
          done: all.filter((p) => (stats[p.id]?.stars ?? 0) > 0).length,
        };
      },
      isPro,
      setPro,
    };
  }, [
    onboarded, lang, direction, voiceRate, stats, logs, attemptsDay, isPro,
    setLanguage, setDirection, setVoiceRateCb, scorePhrase, consumeAttempt, setPro,
  ]);

  return <ShadowContext.Provider value={value}>{children}</ShadowContext.Provider>;
}

export function useShadow(): ShadowState {
  const s = useContext(ShadowContext);
  if (!s) throw new Error('useShadow must be used within ShadowProvider');
  return s;
}
