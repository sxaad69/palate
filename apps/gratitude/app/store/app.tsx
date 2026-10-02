import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLang, setLang, t, type Lang } from '../lib/i18n';
import { promptsForDay, type Prompt } from '../data/prompts';
import type { ReminderTime } from '../lib/reminders';
import { isProLocal, setProLocal } from '../lib/billing';

export interface DayEntry {
  date: string; // local YYYY-MM-DD
  items: string[]; // exactly 3
  promptIds: string[];
  completedAt: number;
}

/** Jar milestones: streak length unlocks a new jar glow theme. */
export interface JarMilestone {
  days: number;
  themeId: string;
  color: string; // fill color for the jar light
}

export const JAR_MILESTONES: JarMilestone[] = [
  { days: 0, themeId: 'dawn', color: '#F6D8AC' },
  { days: 7, themeId: 'honey', color: '#E0953A' },
  { days: 14, themeId: 'amber', color: '#C97E24' },
  { days: 30, themeId: 'ember', color: '#B4552D' },
  { days: 60, themeId: 'rose', color: '#D97B8C' },
  { days: 100, themeId: 'starlight', color: '#8FA8D9' },
  { days: 365, themeId: 'aurora', color: '#7FB069' },
];

const KEY = '@threegood/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  reminder: ReminderTime | null;
  entries: DayEntry[];
  jarThemeId: string;
  pro: boolean;
}

export function dayKey(ts: number): string {
  const d = new Date(ts);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function dayIndex(ts: number): number {
  return Math.floor(ts / 86400000);
}

function computeStreak(entries: DayEntry[]): number {
  const days = new Set(entries.map((e) => e.date));
  let streak = 0;
  const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** Monday 00:00 local of the week containing ts. */
export function weekStart(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - dow);
  return d.getTime();
}

export function weekLabel(startMs: number): string {
  const d = new Date(startMs);
  const end = new Date(startMs + 6 * 86400000);
  const f = (x: Date) => `${x.getDate()}/${x.getMonth() + 1}`;
  return `${f(d)} – ${f(end)}`;
}

function prettyDay(dateStr: string, lang: Lang): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

interface TGState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  reminder: ReminderTime | null;
  setReminder: (r: ReminderTime | null) => void;
  entries: DayEntry[];
  entryFor: (date: string) => DayEntry | undefined;
  todayPrompts: Prompt[];
  saveToday: (items: string[]) => void;
  streak: number;
  entriesThisWeek: number;
  jarThemeId: string;
  setJarThemeId: (id: string) => void;
  jarMilestones: { milestone: JarMilestone; unlocked: boolean }[];
  weekEntries: (startMs: number) => DayEntry[];
  letterForWeek: (startMs: number) => string;
  weekStarts: () => number[]; // all weeks with entries, newest first
  isPro: boolean;
  setPro: (v: boolean) => void;
}

const TGContext = createContext<TGState | null>(null);

export function TGProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [reminder, setReminderState] = useState<ReminderTime | null>(null);
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [jarThemeId, setJarThemeIdState] = useState('dawn');
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
          setReminderState(p.reminder ?? null);
          setEntries(Array.isArray(p.entries) ? p.entries : []);
          if (typeof p.jarThemeId === 'string') setJarThemeIdState(p.jarThemeId);
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
    const p: Persisted = { onboarded, lang, reminder, entries, jarThemeId, pro: isPro };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, reminder, entries, jarThemeId, isPro]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);

  const setReminder = useCallback((r: ReminderTime | null) => {
    setReminderState(r);
  }, []);

  const entryFor = useCallback(
    (date: string) => entries.find((e) => e.date === date),
    [entries],
  );

  const saveToday = useCallback(
    (items: string[]) => {
      const date = dayKey(Date.now());
      const promptIds = promptsForDay(dayIndex(Date.now()), isPro).map((p) => p.id);
      const entry: DayEntry = { date, items, promptIds, completedAt: Date.now() };
      setEntries((prev) => {
        const rest = prev.filter((e) => e.date !== date);
        return [...rest, entry];
      });
    },
    [isPro],
  );

  const setJarThemeId = useCallback((id: string) => setJarThemeIdState(id), []);

  const setPro = useCallback((v: boolean) => {
    setIsPro(v);
    void setProLocal(v);
  }, []);

  const weekEntries = useCallback(
    (startMs: number) => {
      const end = startMs + 7 * 86400000;
      return entries
        .filter((e) => {
          const [y, m, d] = e.date.split('-').map(Number);
          const ts = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1).getTime();
          return ts >= startMs && ts < end;
        })
        .sort((a, b) => (a.date < b.date ? -1 : 1));
    },
    [entries],
  );

  const letterForWeek = useCallback(
    (startMs: number) => {
      const s = t();
      const days = weekEntries(startMs);
      const lines: string[] = [
        `☀ ${s.appName} — ${s.weekOf} ${weekLabel(startMs)}`,
        '',
        s.letterIntro,
        '',
      ];
      for (const e of days) {
        lines.push(`· ${prettyDay(e.date, getLang())}`);
        for (const item of e.items) lines.push(`  – ${item}`);
        lines.push('');
      }
      lines.push(s.letterOutro);
      return lines.join('\n');
    },
    [weekEntries],
  );

  const weekStarts = useCallback(() => {
    const set = new Set<number>();
    for (const e of entries) {
      const [y, m, d] = e.date.split('-').map(Number);
      set.add(weekStart(new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1).getTime()));
    }
    return [...set].sort((a, b) => b - a);
  }, [entries]);

  const value = useMemo<TGState>(() => {
    const streak = computeStreak(entries);
    const ws = weekStart(Date.now());
    return {
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      reminder,
      setReminder,
      entries,
      entryFor,
      todayPrompts: promptsForDay(dayIndex(Date.now()), isPro),
      saveToday,
      streak,
      entriesThisWeek: weekEntries(ws).length,
      jarThemeId,
      setJarThemeId,
      jarMilestones: JAR_MILESTONES.map((m) => ({ milestone: m, unlocked: streak >= m.days })),
      weekEntries,
      letterForWeek,
      weekStarts,
      isPro,
      setPro,
    };
  }, [onboarded, lang, reminder, entries, isPro, jarThemeId, setLanguage, setReminder, entryFor, saveToday, setJarThemeId, weekEntries, letterForWeek, weekStarts, setPro]);

  return <TGContext.Provider value={value}>{children}</TGContext.Provider>;
}

export function useTG(): TGState {
  const s = useContext(TGContext);
  if (!s) throw new Error('useTG must be used within TGProvider');
  return s;
}
