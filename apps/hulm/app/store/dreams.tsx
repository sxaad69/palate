import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Mood = 'good' | 'neutral' | 'bad';

export interface Dream {
  id: string;
  title: string;
  narrative: string;
  mood: Mood;
  date: string; // ISO
  createdAt: number;
  symbolIds: string[];
}

const KEY = '@hulm:dreams_v1';
const uid = () => `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

interface DreamsState {
  dreams: Dream[];
  pro: boolean;
  onboarded: boolean;
  streak: number;
  recurring: { symbolId: string; count: number }[];
  addDream: (d: Omit<Dream, 'id' | 'createdAt'>) => Dream;
  updateDream: (id: string, patch: Partial<Omit<Dream, 'id'>>) => void;
  deleteDream: (id: string) => void;
  setPro: (v: boolean) => void;
  completeOnboarding: () => void;
  eraseAll: () => void;
}

const Ctx = createContext<DreamsState | null>(null);

function computeStreak(dreams: Dream[]): number {
  const days = new Set(dreams.map((d) => todayKey(new Date(d.createdAt))));
  let n = 0;
  const d = new Date();
  if (!days.has(todayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(todayKey(d))) {
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function DreamsProvider({ children }: { children: React.ReactNode }) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [pro, setPro] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setDreams(data.dreams ?? []);
          setPro(data.pro ?? false);
          setOnboarded(data.onboarded ?? false);
        }
      } catch {
        // fresh start
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ dreams, pro, onboarded })).catch(() => {});
  }, [dreams, pro, onboarded, loaded]);

  const value = useMemo<DreamsState>(() => {
    const counts = new Map<string, number>();
    for (const d of dreams) {
      for (const sid of d.symbolIds) counts.set(sid, (counts.get(sid) ?? 0) + 1);
    }
    const recurring = [...counts.entries()]
      .map(([symbolId, count]) => ({ symbolId, count }))
      .filter((x) => x.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    return {
      dreams,
      pro,
      onboarded,
      streak: computeStreak(dreams),
      recurring,
      addDream: (d) => {
        const dream: Dream = { ...d, id: uid(), createdAt: Date.now() };
        setDreams((prev) => [dream, ...prev]);
        return dream;
      },
      updateDream: (id, patch) =>
        setDreams((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x))),
      deleteDream: (id) => setDreams((prev) => prev.filter((x) => x.id !== id)),
      setPro: (v) => setPro(v),
      completeOnboarding: () => setOnboarded(true),
      eraseAll: () => setDreams([]),
    };
  }, [dreams, pro, onboarded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDreams(): DreamsState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDreams outside provider');
  return v;
}
