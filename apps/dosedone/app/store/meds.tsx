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

// ponytail: one context is the whole store. Local-first: AsyncStorage is the
// source of truth; Supabase sync is best-effort and never blocks the UI.

export interface Med {
  id: string;
  name: string;
  dosage: string;
  times: string[]; // "HH:MM", sorted
  pillsPerDose: number;
  pillsLeft: number;
  lowThreshold: number;
  createdDate: string; // YYYY-MM-DD
}

export interface DoseLog {
  id: string;
  medId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  takenAt: number;
}

export type DoseStatus = 'taken' | 'due' | 'upcoming' | 'missed';

export interface TodayDose {
  med: Med;
  time: string;
  status: DoseStatus;
  logId: string | null;
}

/** A dose counts as missed 2h after its time if not taken. */
const GRACE_MS = 2 * 3600 * 1000;
/** "Due now" window opens 30 min before the dose time. */
const DUE_BEFORE_MS = 30 * 60 * 1000;

export const FREE_MED_LIMIT = 3;

const todayStr = () => new Date().toISOString().slice(0, 10);

function doseDateTime(date: string, time: string): number {
  return new Date(`${date}T${time}:00`).getTime();
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

interface MedsState {
  onboarded: boolean;
  meds: Med[];
  logs: DoseLog[];
  pro: boolean;
  todayDoses: TodayDose[];
  takenToday: number;
  dueCount: number;
  adherencePct: number; // last 7 days
  streakDays: number;
  lowStockMeds: Med[];
  completeOnboarding: () => void;
  addMed: (m: Omit<Med, 'id' | 'createdDate'>) => string | null;
  updateMed: (id: string, m: Omit<Med, 'id' | 'createdDate'>) => void;
  deleteMed: (id: string) => void;
  takeDose: (medId: string, time: string) => void;
  undoDose: (logId: string) => void;
  refillMed: (id: string, pills: number) => void;
  setPro: (pro: boolean) => void;
  eraseAll: () => void;
}

const STORAGE_KEY = '@dosedone:state/v1';

interface Persisted {
  onboarded: boolean;
  meds: Med[];
  logs: DoseLog[];
  pro: boolean;
}

const DEFAULTS: Persisted = { onboarded: false, meds: [], logs: [], pro: false };

const MedsContext = createContext<MedsState | null>(null);

export function MedsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(DEFAULTS);
  const [now, setNow] = useState(() => Date.now());
  const hydrated = useRef(false);

  // Recompute dose statuses as time passes (due → missed transitions).
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
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
    syncToCloud(state).catch(() => {});
  }, [state]);

  const value = useMemo<MedsState>(() => {
    const patch = (p: Partial<Persisted>) => setState((s) => ({ ...s, ...p }));
    const today = todayStr();

    const logFor = (medId: string, date: string, time: string) =>
      state.logs.find((l) => l.medId === medId && l.date === date && l.time === time) ?? null;

    const statusOf = (med: Med, date: string, time: string, refNow: number): DoseStatus => {
      if (logFor(med.id, date, time)) return 'taken';
      const dt = doseDateTime(date, time);
      if (refNow > dt + GRACE_MS) return 'missed';
      if (refNow >= dt - DUE_BEFORE_MS) return 'due';
      return 'upcoming';
    };

    const todayDoses: TodayDose[] = state.meds.flatMap((med) =>
      med.times.map((time) => {
        const log = logFor(med.id, today, time);
        return { med, time, status: statusOf(med, today, time, now), logId: log?.id ?? null };
      }),
    ).sort((a, b) => a.time.localeCompare(b.time));

    // Last 7 days adherence: scheduled = every dose whose window has passed.
    let taken = 0;
    let scheduled = 0;
    for (let d = 6; d >= 0; d--) {
      const date = addDays(today, -d);
      for (const med of state.meds) {
        if (date < med.createdDate) continue;
        for (const time of med.times) {
          if (doseDateTime(date, time) + GRACE_MS > now) continue;
          scheduled++;
          if (logFor(med.id, date, time)) taken++;
        }
      }
    }

    // Streak: consecutive days (ending today/yesterday) with no missed doses.
    let streakDays = 0;
    for (let d = 0; ; d++) {
      const date = addDays(today, -d);
      let dayScheduled = 0;
      let dayMissed = 0;
      for (const med of state.meds) {
        if (date < med.createdDate) continue;
        for (const time of med.times) {
          if (doseDateTime(date, time) + GRACE_MS > now) continue;
          dayScheduled++;
          if (!logFor(med.id, date, time)) dayMissed++;
        }
      }
      if (dayScheduled === 0) {
        if (d === 0) continue; // today may have no passed doses yet — look back
        break;
      }
      if (dayMissed > 0) break;
      streakDays++;
      if (streakDays > 365) break;
    }

    return {
      ...state,
      todayDoses,
      takenToday: todayDoses.filter((d) => d.status === 'taken').length,
      dueCount: todayDoses.filter((d) => d.status === 'due').length,
      adherencePct: scheduled === 0 ? 0 : Math.round((taken / scheduled) * 100),
      streakDays,
      lowStockMeds: state.meds.filter((m) => m.pillsLeft <= m.lowThreshold),
      completeOnboarding: () => patch({ onboarded: true }),
      addMed: (m) => {
        if (!state.pro && state.meds.length >= FREE_MED_LIMIT) return null;
        const id = `m-${Date.now()}`;
        patch({
          meds: [...state.meds, { ...m, id, createdDate: today }],
        });
        return id;
      },
      updateMed: (id, m) =>
        patch({
          meds: state.meds.map((x) => (x.id === id ? { ...x, ...m, id, createdDate: x.createdDate } : x)),
        }),
      deleteMed: (id) =>
        patch({
          meds: state.meds.filter((x) => x.id !== id),
          logs: state.logs.filter((l) => l.medId !== id),
        }),
      takeDose: (medId, time) => {
        const med = state.meds.find((x) => x.id === medId);
        if (!med || logFor(medId, today, time)) return;
        patch({
          logs: [
            ...state.logs,
            { id: `l-${Date.now()}`, medId, date: today, time, takenAt: Date.now() },
          ],
          meds: state.meds.map((x) =>
            x.id === medId
              ? { ...x, pillsLeft: Math.max(0, x.pillsLeft - x.pillsPerDose) }
              : x,
          ),
        });
      },
      undoDose: (logId) => {
        const log = state.logs.find((l) => l.id === logId);
        if (!log) return;
        const med = state.meds.find((x) => x.id === log.medId);
        patch({
          logs: state.logs.filter((l) => l.id !== logId),
          meds: med
            ? state.meds.map((x) =>
                x.id === med.id ? { ...x, pillsLeft: x.pillsLeft + med.pillsPerDose } : x,
              )
            : state.meds,
        });
      },
      refillMed: (id, pills) =>
        patch({ meds: state.meds.map((x) => (x.id === id ? { ...x, pillsLeft: pills } : x)) }),
      setPro: (pro) => patch({ pro }),
      eraseAll: () => patch({ ...DEFAULTS, onboarded: true }),
    };
  }, [state, now]);

  return <MedsContext.Provider value={value}>{children}</MedsContext.Provider>;
}

async function syncToCloud(state: Persisted): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !state.onboarded) return;
  const deviceId = await getDeviceId();
  await supabase.from('dosedone_meds').upsert(
    state.meds.map((m) => ({
      device_id: deviceId,
      med_id: m.id,
      name: m.name,
      dosage: m.dosage,
      times: m.times,
      pills_per_dose: m.pillsPerDose,
      pills_left: m.pillsLeft,
      low_threshold: m.lowThreshold,
    })),
    { onConflict: 'device_id,med_id' },
  );
  // Logs are append-only; sync the recent ones.
  const recent = state.logs.slice(-500);
  if (recent.length > 0) {
    await supabase.from('dosedone_doses').upsert(
      recent.map((l) => ({
        device_id: deviceId,
        log_id: l.id,
        med_id: l.medId,
        date: l.date,
        time: l.time,
        taken_at: new Date(l.takenAt).toISOString(),
      })),
      { onConflict: 'device_id,log_id' },
    );
  }
}

export function useMeds(): MedsState {
  const ctx = useContext(MedsContext);
  if (!ctx) throw new Error('useMeds must be used within MedsProvider');
  return ctx;
}
