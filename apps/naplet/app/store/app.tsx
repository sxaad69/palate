import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { syncEventsToServer, fetchEventsFromServer, type ServerEvent } from '../lib/api';
import { isPro as billingIsPro } from '../lib/billing';
import {
  dayKey,
  type BabyEvent,
  type DiaperType,
  type EventKind,
  type FeedType,
} from '../lib/baby';
import { strings, type Language, type Strings } from '../lib/strings';

interface AppState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: Strings;
  babyName: string;
  setBabyName: (n: string) => void;
  useMetric: boolean;
  setUseMetric: (v: boolean) => void;
  use24h: boolean;
  setUse24h: (v: boolean) => void;
  familyCode: string;
  setFamilyCode: (c: string) => void;
  events: BabyEvent[];
  activeSleepId: string | null;
  startSleep: () => void;
  endSleep: () => void;
  addFeed: (f: { feedType: FeedType; side?: 'left' | 'right' | 'both'; amountMl?: number; start?: number; note?: string }) => void;
  addDiaper: (d: { diaperType: DiaperType; start?: number }) => void;
  deleteEvent: (id: string) => void;
  isPro: boolean;
  refreshPro: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);
const STORE_KEY = '@naplet/store/v1';

interface Persisted {
  onboarded: boolean;
  language: Language;
  babyName: string;
  useMetric: boolean;
  use24h: boolean;
  familyCode: string;
  events: BabyEvent[];
}

function uid(): string {
  return `e-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function toServer(e: BabyEvent): ServerEvent {
  return {
    id: e.id, kind: e.kind, start: e.start, end: e.end,
    feedType: e.feedType, side: e.side, amountMl: e.amountMl,
    diaperType: e.diaperType, note: e.note, updatedAt: e.updatedAt,
  };
}

function fromServer(s: ServerEvent): BabyEvent {
  return {
    id: s.id, kind: s.kind, start: s.start, end: s.end,
    feedType: s.feedType, side: s.side, amountMl: s.amountMl,
    diaperType: s.diaperType, note: s.note, updatedAt: s.updatedAt ?? 0,
  };
}

/** Union by id; last-write-wins via updatedAt (server copy is authoritative only when newer). */
function mergeEvents(local: BabyEvent[], server: BabyEvent[]): BabyEvent[] {
  const byId = new Map<string, BabyEvent>();
  for (const e of local) byId.set(e.id, e);
  for (const e of server) {
    const cur = byId.get(e.id);
    if (!cur || e.updatedAt >= cur.updatedAt) byId.set(e.id, e);
  }
  return [...byId.values()];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboardedState] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [babyName, setBabyNameState] = useState('');
  const [useMetric, setUseMetricState] = useState(true);
  const [use24h, setUse24hState] = useState(false);
  const [familyCode, setFamilyCodeState] = useState('');
  const [events, setEvents] = useState<BabyEvent[]>([]);
  const [isPro, setIsPro] = useState(false);
  const hydratedRef = useRef(false);
  const familyRef = useRef('');

  const activeSleepId = useMemo(() => {
    const s = events
      .filter((e) => e.kind === 'sleep' && e.end == null)
      .sort((a, b) => b.start - a.start)[0];
    return s ? s.id : null;
  }, [events]);

  const pushSync = (next: BabyEvent[]) => {
    const code = familyRef.current.trim();
    if (!code) return;
    syncEventsToServer(code, next.map(toServer)).catch(() => {});
  };

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) {
          const d = JSON.parse(raw) as Partial<Persisted>;
          if (typeof d.onboarded === 'boolean') setOnboardedState(d.onboarded);
          if (d.language === 'ar' || d.language === 'en') {
            setLanguageState(d.language);
            applyRtl(d.language);
          }
          if (typeof d.babyName === 'string') setBabyNameState(d.babyName);
          if (typeof d.useMetric === 'boolean') setUseMetricState(d.useMetric);
          if (typeof d.use24h === 'boolean') setUse24hState(d.use24h);
          if (typeof d.familyCode === 'string') {
            setFamilyCodeState(d.familyCode);
            familyRef.current = d.familyCode;
          }
          if (Array.isArray(d.events)) setEvents(d.events);
        }
      } catch {
        // ignore — start fresh
      } finally {
        hydratedRef.current = true;
      }
      const code = familyRef.current.trim();
      if (code) {
        try {
          const server = await fetchEventsFromServer(code);
          if (server) setEvents((prev) => mergeEvents(prev, server.map(fromServer)));
        } catch {
          // offline — keep local
        }
      }
      try {
        setIsPro(await billingIsPro());
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const data: Persisted = {
      onboarded, language, babyName, useMetric, use24h, familyCode, events,
    };
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(data)).catch(() => {});
  }, [onboarded, language, babyName, useMetric, use24h, familyCode, events]);

  const setOnboarded = (v: boolean) => setOnboardedState(v);
  const setLanguage = (l: Language) => {
    setLanguageState(l);
    applyRtl(l);
  };
  const setBabyName = (n: string) => setBabyNameState(n);
  const setUseMetric = (v: boolean) => setUseMetricState(v);
  const setUse24h = (v: boolean) => setUse24hState(v);
  const setFamilyCode = (c: string) => {
    const code = c.trim().toUpperCase().slice(0, 12);
    setFamilyCodeState(code);
    familyRef.current = code;
    if (code) {
      fetchEventsFromServer(code)
        .then((server) => {
          if (server) {
            setEvents((prev) => {
              const merged = mergeEvents(prev, server.map(fromServer));
              pushSync(merged);
              return merged;
            });
          }
        })
        .catch(() => {});
    }
  };

  const mutate = (fn: (prev: BabyEvent[]) => BabyEvent[]) => {
    setEvents((prev) => {
      const next = fn(prev);
      pushSync(next);
      return next;
    });
  };

  const startSleep = () => {
    if (activeSleepId) return;
    const now = Date.now();
    mutate((prev) => [
      ...prev,
      { id: uid(), kind: 'sleep' as EventKind, start: now, updatedAt: now },
    ]);
  };

  const endSleep = () => {
    if (!activeSleepId) return;
    const now = Date.now();
    mutate((prev) =>
      prev.map((e) => (e.id === activeSleepId ? { ...e, end: now, updatedAt: now } : e)),
    );
  };

  const addFeed: AppState['addFeed'] = (f) => {
    const now = Date.now();
    const start = f.start ?? now;
    mutate((prev) => [
      ...prev,
      {
        id: uid(), kind: 'feed' as EventKind, start, end: start,
        feedType: f.feedType, side: f.side, amountMl: f.amountMl,
        note: f.note, updatedAt: now,
      },
    ]);
  };

  const addDiaper: AppState['addDiaper'] = (d) => {
    const now = Date.now();
    const start = d.start ?? now;
    mutate((prev) => [
      ...prev,
      { id: uid(), kind: 'diaper' as EventKind, start, end: start, diaperType: d.diaperType, updatedAt: now },
    ]);
  };

  const deleteEvent = (id: string) => {
    mutate((prev) => prev.filter((e) => e.id !== id));
  };

  const refreshPro = async () => {
    try {
      setIsPro(await billingIsPro());
    } catch {
      // ignore
    }
  };

  const t = strings[language];

  const value = useMemo<AppState>(
    () => ({
      onboarded, setOnboarded, language, setLanguage, t,
      babyName, setBabyName, useMetric, setUseMetric, use24h, setUse24h,
      familyCode, setFamilyCode, events, activeSleepId,
      startSleep, endSleep, addFeed, addDiaper, deleteEvent,
      isPro, refreshPro,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onboarded, language, babyName, useMetric, use24h, familyCode, events, activeSleepId, isPro, t],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function applyRtl(lang: Language) {
  try {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(lang === 'ar');
  } catch {
    // ignore — non-critical
  }
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { dayKey };
