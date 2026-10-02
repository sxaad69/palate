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

// ponytail: one tiny context is the whole store — no state library for a
// handful of values. Local-first: everything persists to AsyncStorage;
// the backend sync is best-effort and never blocks the UI.

export type Habit = 'alcohol' | 'smoking' | 'other';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
}

interface SobrietyState {
  onboarded: boolean;
  habit: Habit;
  dailySpend: number;
  currency: string;
  startDate: string; // YYYY-MM-DD of the last day (count starts next day)
  reasons: string[];
  journal: JournalEntry[];
  goals: SavingsGoal[];
  pledgeDate: string | null; // YYYY-MM-DD of last pledge
  pro: boolean;
  // derived
  daysClean: number;
  secondsClean: number;
  moneySaved: number;
  // actions
  completeOnboarding: (o: {
    habit: Habit;
    dailySpend: number;
    currency: string;
    startDate: string;
  }) => void;
  addJournal: (text: string) => void;
  deleteJournal: (id: string) => void;
  setReasons: (reasons: string[]) => void;
  addGoal: (name: string, target: number) => void;
  removeGoal: (id: string) => void;
  pledgeToday: () => void;
  resetCount: () => void;
  setPro: (pro: boolean) => void;
}

const STORAGE_KEY = '@dryspell:state/v1';

const todayStr = () => new Date().toISOString().slice(0, 10);

function daysBetween(from: string, to: string): number {
  const ms = new Date(to + 'T12:00:00Z').getTime() - new Date(from + 'T12:00:00Z').getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

interface Persisted {
  onboarded: boolean;
  habit: Habit;
  dailySpend: number;
  currency: string;
  startDate: string;
  reasons: string[];
  journal: JournalEntry[];
  goals: SavingsGoal[];
  pledgeDate: string | null;
  pro: boolean;
}

const DEFAULTS: Persisted = {
  onboarded: false,
  habit: 'alcohol',
  dailySpend: 0,
  currency: '$',
  startDate: todayStr(),
  reasons: [],
  journal: [],
  goals: [],
  pledgeDate: null,
  pro: false,
};

const SobrietyContext = createContext<SobrietyState | null>(null);

export function SobrietyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(DEFAULTS);
  const [now, setNow] = useState(() => Date.now());
  const hydrated = useRef(false);

  // Tick every second so the live counter moves. One interval, whole app.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Persisted>;
          setState({ ...DEFAULTS, ...parsed });
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
    // Best-effort cloud sync; never blocks.
    syncToCloud(state).catch(() => {});
  }, [state]);

  const daysClean = state.onboarded ? daysBetween(state.startDate, todayStr()) : 0;
  const secondsClean = state.onboarded
    ? Math.max(0, Math.floor((now - new Date(state.startDate + 'T12:00:00Z').getTime()) / 1000))
    : 0;
  const moneySaved = daysClean * state.dailySpend;

  const value = useMemo<SobrietyState>(() => {
    const patch = (p: Partial<Persisted>) => setState((s) => ({ ...s, ...p }));
    return {
      ...state,
      daysClean,
      secondsClean,
      moneySaved,
      completeOnboarding: (o) =>
        patch({ onboarded: true, ...o }),
      addJournal: (text) =>
        patch({
          journal: [
            { id: `j-${Date.now()}`, date: todayStr(), text, createdAt: Date.now() },
            ...state.journal,
          ],
        }),
      deleteJournal: (id) => patch({ journal: state.journal.filter((j) => j.id !== id) }),
      setReasons: (reasons) => patch({ reasons }),
      addGoal: (name, target) =>
        patch({ goals: [...state.goals, { id: `g-${Date.now()}`, name, target }] }),
      removeGoal: (id) => patch({ goals: state.goals.filter((g) => g.id !== id) }),
      pledgeToday: () => patch({ pledgeDate: todayStr() }),
      resetCount: () => patch({ startDate: todayStr(), pledgeDate: null }),
      setPro: (pro) => patch({ pro }),
    };
  }, [state, daysClean, secondsClean, moneySaved]);

  return <SobrietyContext.Provider value={value}>{children}</SobrietyContext.Provider>;
}

// ponytail: fire-and-forget cloud backup of the counter state. One row per
// device, upserted. The app works fully offline without it.
async function syncToCloud(state: Persisted): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !state.onboarded) return;
  const deviceId = await getDeviceId();
  await supabase.from('dryspell_progress').upsert(
    {
      device_id: deviceId,
      habit: state.habit,
      daily_spend: state.dailySpend,
      currency: state.currency,
      start_date: state.startDate,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'device_id' },
  );
}

export function useSobriety(): SobrietyState {
  const ctx = useContext(SobrietyContext);
  if (!ctx) throw new Error('useSobriety must be used within SobrietyProvider');
  return ctx;
}
