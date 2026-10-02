import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Distraction {
  at: number;
  kind: 'exit' | 'manual';
}

export interface Session {
  id: string;
  label: string;
  plannedSec: number;
  startedAt: number;
  endedAt: number;
  focusedSec: number;
  distractions: Distraction[];
  completed: boolean;
  strictBroken: boolean;
  reflection: string;
}

export const PRESETS = [25, 50, 90];

const KEY = '@headdown:focus_v1';
const uid = () => `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

interface FocusState {
  sessions: Session[];
  pro: boolean;
  onboarded: boolean;
  strictMode: boolean;
  defaultDuration: number;
  notifyOnEnd: boolean;
  streak: number;
  addSession: (s: Omit<Session, 'id' | 'reflection'>) => Session;
  setReflection: (id: string, text: string) => void;
  setPro: (v: boolean) => void;
  setStrictMode: (v: boolean) => void;
  setDefaultDuration: (v: number) => void;
  setNotifyOnEnd: (v: boolean) => void;
  completeOnboarding: () => void;
  eraseAll: () => void;
}

const Ctx = createContext<FocusState | null>(null);

function computeStreak(sessions: Session[]): number {
  const days = new Set(sessions.filter((s) => s.completed).map((s) => todayKey(new Date(s.startedAt))));
  let n = 0;
  const d = new Date();
  if (!days.has(todayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(todayKey(d))) {
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pro, setPro] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState(25);
  const [notifyOnEnd, setNotifyOnEnd] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setSessions(data.sessions ?? []);
          setPro(data.pro ?? false);
          setOnboarded(data.onboarded ?? false);
          setStrictMode(data.strictMode ?? false);
          setDefaultDuration(data.defaultDuration ?? 25);
          setNotifyOnEnd(data.notifyOnEnd ?? true);
        }
      } catch {
        // fresh start
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      KEY,
      JSON.stringify({ sessions, pro, onboarded, strictMode, defaultDuration, notifyOnEnd }),
    ).catch(() => {});
  }, [sessions, pro, onboarded, strictMode, defaultDuration, notifyOnEnd, loaded]);

  const value = useMemo<FocusState>(
    () => ({
      sessions,
      pro,
      onboarded,
      strictMode,
      defaultDuration,
      notifyOnEnd,
      streak: computeStreak(sessions),
      addSession: (s) => {
        const full: Session = { ...s, id: uid(), reflection: '' };
        setSessions((prev) => [full, ...prev].slice(0, 500));
        return full;
      },
      setReflection: (id, text) =>
        setSessions((prev) => prev.map((x) => (x.id === id ? { ...x, reflection: text } : x))),
      setPro: (v) => setPro(v),
      setStrictMode: (v) => setStrictMode(v),
      setDefaultDuration,
      setNotifyOnEnd,
      completeOnboarding: () => setOnboarded(true),
      eraseAll: () => setSessions([]),
    }),
    [sessions, pro, onboarded, strictMode, defaultDuration, notifyOnEnd],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function focusScore(s: Session): number {
  const elapsed = Math.max(1, s.endedAt - s.startedAt);
  return Math.max(0, Math.min(1, (s.focusedSec * 1000) / elapsed));
}

export function useFocus(): FocusState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFocus outside provider');
  return v;
}
