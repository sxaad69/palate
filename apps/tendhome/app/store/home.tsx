import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIBRARY, FREE_TASK_LIMIT, type Category, type Season } from '../data/tasks';

export interface HomeTask {
  id: string;
  titleEn: string;
  titleAr: string;
  category: Category;
  intervalDays: number;
  minutes: number;
  season?: Season;
  why: string;
  enabled: boolean;
  lastDone: number | null;
  custom: boolean;
}

export interface Completion {
  id: string;
  taskId: string;
  at: number;
  cost: number;
}

const KEY = '@tendhome:home_v1';
const uid = () => `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

interface HomeState {
  tasks: HomeTask[];
  completions: Completion[];
  pro: boolean;
  onboarded: boolean;
  remindersOn: boolean;
  enabledCount: number;
  canEnable: boolean;
  toggleTask: (id: string) => void;
  markDone: (id: string, cost: number) => void;
  addCustom: (title: string, category: Category, intervalDays: number, minutes: number) => void;
  updateCustom: (id: string, patch: Partial<Pick<HomeTask, 'titleEn' | 'titleAr' | 'intervalDays' | 'minutes' | 'category'>>) => void;
  deleteTask: (id: string) => void;
  setPro: (v: boolean) => void;
  setRemindersOn: (v: boolean) => void;
  completeOnboarding: () => void;
  eraseAll: () => void;
}

const Ctx = createContext<HomeState | null>(null);

function seed(): HomeTask[] {
  return LIBRARY.map((t) => ({
    id: t.id,
    titleEn: t.titleEn,
    titleAr: t.titleAr,
    category: t.category,
    intervalDays: t.intervalDays,
    minutes: t.minutes,
    season: t.season,
    why: t.why,
    enabled: t.defaultOn,
    lastDone: null,
    custom: false,
  }));
}

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<HomeTask[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [pro, setPro] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [remindersOn, setRemindersOn] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setTasks(data.tasks?.length ? data.tasks : seed());
          setCompletions(data.completions ?? []);
          setPro(data.pro ?? false);
          setOnboarded(data.onboarded ?? false);
          setRemindersOn(data.remindersOn ?? true);
        } else {
          setTasks(seed());
        }
      } catch {
        setTasks(seed());
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      KEY,
      JSON.stringify({ tasks, completions, pro, onboarded, remindersOn }),
    ).catch(() => {});
  }, [tasks, completions, pro, onboarded, remindersOn, loaded]);

  const value = useMemo<HomeState>(() => {
    const enabledCount = tasks.filter((t) => t.enabled).length;
    const canEnable = pro || enabledCount < FREE_TASK_LIMIT;
    return {
      tasks,
      completions,
      pro,
      onboarded,
      remindersOn,
      enabledCount,
      canEnable,
      toggleTask: (id) =>
        setTasks((prev) => {
          const task = prev.find((t) => t.id === id);
          if (!task) return prev;
          if (!task.enabled && !canEnable) return prev; // UI shows paywall instead
          return prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t));
        }),
      markDone: (id, cost) => {
        const at = Date.now();
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, lastDone: at } : t)));
        setCompletions((prev) => [{ id: uid(), taskId: id, at, cost }, ...prev].slice(0, 1000));
      },
      addCustom: (title, category, intervalDays, minutes) =>
        setTasks((prev) => [
          ...prev,
          {
            id: `custom-${uid()}`,
            titleEn: title,
            titleAr: title,
            category,
            intervalDays,
            minutes,
            why: '',
            enabled: true,
            lastDone: null,
            custom: true,
          },
        ]),
      updateCustom: (id, patch) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      deleteTask: (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setCompletions((prev) => prev.filter((c) => c.taskId !== id));
      },
      setPro: (v) => setPro(v),
      setRemindersOn: (v) => setRemindersOn(v),
      completeOnboarding: () => setOnboarded(true),
      eraseAll: () => {
        setTasks(seed());
        setCompletions([]);
      },
    };
  }, [tasks, completions, pro, onboarded, remindersOn]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHome(): HomeState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useHome outside provider');
  return v;
}
