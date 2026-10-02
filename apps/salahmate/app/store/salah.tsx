import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabase } from '../lib/supabase';
import { getDeviceId } from '../lib/device';
import { TRACKED_PRAYERS, type PrayerKey } from '../lib/prayer';
import type { CalcMethod } from '../lib/prayer';
import { FALLBACK_COORDS } from '../lib/location';

// ponytail: one context is the whole store. Local-first: AsyncStorage is the
// source of truth; Supabase sync is best-effort and never blocks the UI.

export interface Habit {
  id: string;
  name: string;
  anchorPrayer: PrayerKey;
  createdDate: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
}

export interface PrayerLog {
  date: string;
  prayer: PrayerKey;
}

export const FREE_HABIT_LIMIT = 3;
export const DHIKR_TARGETS = [33, 100, 500, 1000] as const;

const todayStr = () => new Date().toISOString().slice(0, 10);

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

interface HabitToday {
  habit: Habit;
  done: boolean;
  streak: number;
}

interface SalahState {
  onboarded: boolean;
  lat: number;
  lng: number;
  useDeviceLocation: boolean;
  methodId: CalcMethod['id'];
  remindersOn: boolean;
  prayerLogs: PrayerLog[];
  habits: Habit[];
  habitLogs: HabitLog[];
  dhikrCount: number;
  dhikrTarget: number;
  pro: boolean;
  // derived
  prayedToday: PrayerKey[];
  habitsToday: HabitToday[];
  prayerStreak: number;
  weekPrayerCount: number;
  todayScore: { done: number; total: number };
  // actions
  completeOnboarding: (o: {
    lat: number;
    lng: number;
    useDeviceLocation: boolean;
    methodId: CalcMethod['id'];
  }) => void;
  togglePrayer: (prayer: PrayerKey) => void;
  addHabit: (name: string, anchorPrayer: PrayerKey) => string | null;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string) => void;
  incrementDhikr: () => void;
  resetDhikr: () => void;
  setDhikrTarget: (n: number) => void;
  setMethod: (m: CalcMethod['id']) => void;
  setLocation: (lat: number, lng: number, useDevice: boolean) => void;
  setRemindersOn: (on: boolean) => void;
  setPro: (pro: boolean) => void;
  eraseAll: () => void;
}

const STORAGE_KEY = '@salahmate:state/v1';

interface Persisted {
  onboarded: boolean;
  lat: number;
  lng: number;
  useDeviceLocation: boolean;
  methodId: CalcMethod['id'];
  remindersOn: boolean;
  prayerLogs: PrayerLog[];
  habits: Habit[];
  habitLogs: HabitLog[];
  dhikrCount: number;
  dhikrTarget: number;
  dhikrDate: string;
  pro: boolean;
}

const DEFAULTS: Persisted = {
  onboarded: false,
  lat: FALLBACK_COORDS.lat,
  lng: FALLBACK_COORDS.lng,
  useDeviceLocation: true,
  methodId: 'MWL',
  remindersOn: true,
  prayerLogs: [],
  habits: [],
  habitLogs: [],
  dhikrCount: 0,
  dhikrTarget: 33,
  dhikrDate: todayStr(),
  pro: false,
};

const SalahContext = createContext<SalahState | null>(null);

export function SalahProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(DEFAULTS);
  const hydrated = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Persisted>;
          const merged = { ...DEFAULTS, ...parsed };
          // New day → dhikr counter restarts.
          if (merged.dhikrDate !== todayStr()) {
            merged.dhikrCount = 0;
            merged.dhikrDate = todayStr();
          }
          setState(merged);
        }
      } catch {
        // ignore — start fresh
      } finally {
        hydrated.current = true;
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    syncToCloud(state).catch(() => {});
  }, [state]);

  const value = useMemo<SalahState>(() => {
    const patch = (p: Partial<Persisted>) => setState((s) => ({ ...s, ...p }));
    const today = todayStr();

    const prayedToday = state.prayerLogs
      .filter((l) => l.date === today)
      .map((l) => l.prayer);

    const habitDoneOn = (habitId: string, date: string) =>
      state.habitLogs.some((l) => l.habitId === habitId && l.date === date);

    const habitStreak = (habitId: string): number => {
      let s = 0;
      for (let d = 0; ; d++) {
        const date = addDays(today, -d);
        const habit = state.habits.find((h) => h.id === habitId);
        if (!habit || date < habit.createdDate) break;
        if (!habitDoneOn(habitId, date)) {
          // Today not done yet doesn't break the streak.
          if (d === 0) continue;
          break;
        }
        s++;
        if (s > 365) break;
      }
      return s;
    };

    const habitsToday: HabitToday[] = state.habits.map((habit) => ({
      habit,
      done: habitDoneOn(habit.id, today),
      streak: habitStreak(habit.id),
    }));

    // Perfect-day streak: days with all 5 prayers done.
    let prayerStreak = 0;
    for (let d = 0; ; d++) {
      const date = addDays(today, -d);
      const done = TRACKED_PRAYERS.filter((p) =>
        state.prayerLogs.some((l) => l.date === date && l.prayer === p),
      ).length;
      if (done === 5) {
        prayerStreak++;
      } else if (d === 0 && done > 0) {
        continue; // today in progress — look back
      } else {
        break;
      }
      if (prayerStreak > 365) break;
    }

    let weekPrayerCount = 0;
    for (let d = 0; d < 7; d++) {
      const date = addDays(today, -d);
      weekPrayerCount += state.prayerLogs.filter((l) => l.date === date).length;
    }

    const habitsDone = habitsToday.filter((h) => h.done).length;

    return {
      ...state,
      prayedToday,
      habitsToday,
      prayerStreak,
      weekPrayerCount,
      todayScore: {
        done: prayedToday.length + habitsDone,
        total: TRACKED_PRAYERS.length + habitsToday.length,
      },
      completeOnboarding: (o) => patch({ onboarded: true, ...o }),
      togglePrayer: (prayer) => {
        const exists = state.prayerLogs.some((l) => l.date === today && l.prayer === prayer);
        patch({
          prayerLogs: exists
            ? state.prayerLogs.filter((l) => !(l.date === today && l.prayer === prayer))
            : [...state.prayerLogs, { date: today, prayer }],
        });
      },
      addHabit: (name, anchorPrayer) => {
        if (!state.pro && state.habits.length >= FREE_HABIT_LIMIT) return null;
        const id = `h-${Date.now()}`;
        patch({
          habits: [...state.habits, { id, name: name.trim(), anchorPrayer, createdDate: today }],
        });
        return id;
      },
      deleteHabit: (id) =>
        patch({
          habits: state.habits.filter((h) => h.id !== id),
          habitLogs: state.habitLogs.filter((l) => l.habitId !== id),
        }),
      toggleHabit: (habitId) => {
        const done = habitDoneOn(habitId, today);
        patch({
          habitLogs: done
            ? state.habitLogs.filter((l) => !(l.habitId === habitId && l.date === today))
            : [...state.habitLogs, { id: `hl-${Date.now()}`, habitId, date: today }],
        });
      },
      incrementDhikr: () => patch({ dhikrCount: state.dhikrCount + 1 }),
      resetDhikr: () => patch({ dhikrCount: 0 }),
      setDhikrTarget: (n) => patch({ dhikrTarget: n, dhikrCount: 0 }),
      setMethod: (methodId) => patch({ methodId }),
      setLocation: (lat, lng, useDeviceLocation) => patch({ lat, lng, useDeviceLocation }),
      setRemindersOn: (remindersOn) => patch({ remindersOn }),
      setPro: (pro) => patch({ pro }),
      eraseAll: () => patch({ ...DEFAULTS, onboarded: true }),
    };
  }, [state]);

  return <SalahContext.Provider value={value}>{children}</SalahContext.Provider>;
}

async function syncToCloud(state: Persisted): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !state.onboarded) return;
  const deviceId = await getDeviceId();
  if (state.prayerLogs.length > 0) {
    await supabase.from('salahmate_prayers').upsert(
      state.prayerLogs.slice(-1000).map((l) => ({
        device_id: deviceId,
        date: l.date,
        prayer: l.prayer,
      })),
      { onConflict: 'device_id,date,prayer' },
    );
  }
  if (state.habits.length > 0) {
    await supabase.from('salahmate_habits').upsert(
      state.habits.map((h) => ({
        device_id: deviceId,
        habit_id: h.id,
        name: h.name,
        anchor_prayer: h.anchorPrayer,
      })),
      { onConflict: 'device_id,habit_id' },
    );
  }
  if (state.habitLogs.length > 0) {
    await supabase.from('salahmate_habit_logs').upsert(
      state.habitLogs.slice(-1000).map((l) => ({
        device_id: deviceId,
        log_id: l.id,
        habit_id: l.habitId,
        date: l.date,
      })),
      { onConflict: 'device_id,log_id' },
    );
  }
}

export function useSalah(): SalahState {
  const ctx = useContext(SalahContext);
  if (!ctx) throw new Error('useSalah must be used within SalahProvider');
  return ctx;
}
