import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLang, setLang, type Lang } from '../lib/i18n';
import { isProLocal, setProLocal } from '../lib/billing';
import { rescheduleExpiryReminders } from '../lib/notifications';
import {
  FREE_ITEM_LIMIT,
  daysLeft,
  newId,
  urgencyOf,
  wasteRisk,
  type PantryItem,
  type Urgency,
  type WasteEvent,
} from './types';
import type { ThemeMode } from '../theme/ThemeProvider';

interface KeepsState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  themeMode: ThemeMode;
  setTheme: (m: ThemeMode) => void;
  reminders: boolean;
  setReminders: (v: boolean) => void;
  items: PantryItem[];
  addItem: (i: Omit<PantryItem, 'id' | 'addedAt'>) => boolean;
  updateItem: (id: string, patch: Partial<PantryItem>) => void;
  removeItem: (id: string) => void;
  markUsed: (id: string) => void;
  markWasted: (id: string) => void;
  canAdd: boolean;
  // Derived
  byUrgency: (u: Urgency) => PantryItem[];
  alertQueue: PantryItem[];
  savedTotal: number;
  savedCount: number;
  wastedThisWeek: { count: number; value: number };
  usedThisWeek: { count: number; value: number };
  expiringThisWeek: number;
  isPro: boolean;
  setPro: (v: boolean) => void;
}

const KeepsContext = createContext<KeepsState | null>(null);

const KEY = '@keepsfresh/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  themeMode: ThemeMode;
  reminders: boolean;
  items: PantryItem[];
  events: WasteEvent[];
  pro: boolean;
}

export function KeepsProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [reminders, setRemindersState] = useState(false);
  const [items, setItems] = useState<PantryItem[]>([]);
  const [events, setEvents] = useState<WasteEvent[]>([]);
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
          if (p.themeMode) setThemeMode(p.themeMode);
          setRemindersState(!!p.reminders);
          setItems(Array.isArray(p.items) ? p.items : []);
          setEvents(Array.isArray(p.events) ? p.events : []);
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
    const p: Persisted = { onboarded, lang, themeMode, reminders, items, events, pro: isPro };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, themeMode, reminders, items, events, isPro]);

  // Re-schedule local expiry reminders whenever items or the toggle change.
  // Debounced via ref so rapid edits don't thrash the scheduler.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void rescheduleExpiryReminders(items, reminders);
    }, 800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [hydrated, items, reminders]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);

  const setTheme = useCallback((m: ThemeMode) => setThemeMode(m), []);

  const setReminders = useCallback((v: boolean) => setRemindersState(v), []);

  const addItem = useCallback(
    (i: Omit<PantryItem, 'id' | 'addedAt'>): boolean => {
      if (!isPro && items.length >= FREE_ITEM_LIMIT) return false;
      setItems((prev) => [
        ...prev,
        { ...i, id: newId(), addedAt: Date.now() },
      ]);
      return true;
    },
    [isPro, items.length],
  );

  const updateItem = useCallback((id: string, patch: Partial<PantryItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const logEvent = useCallback((item: PantryItem, kind: 'used' | 'wasted') => {
    setEvents((prev) => [
      ...prev,
      {
        id: newId(),
        name: item.name,
        kind,
        value: item.price * item.qty,
        at: Date.now(),
      },
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const markUsed = useCallback(
    (id: string) => {
      const item = items.find((it) => it.id === id);
      if (!item) return;
      logEvent(item, 'used');
      removeItem(id);
    },
    [items, logEvent, removeItem],
  );

  const markWasted = useCallback(
    (id: string) => {
      const item = items.find((it) => it.id === id);
      if (!item) return;
      logEvent(item, 'wasted');
      removeItem(id);
    },
    [items, logEvent, removeItem],
  );

  const setPro = useCallback((v: boolean) => {
    setIsPro(v);
    void setProLocal(v);
  }, []);

  const value = useMemo<KeepsState>(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    const weekEvents = events.filter((e) => e.at >= weekAgo);
    const sum = (es: WasteEvent[]) => ({
      count: es.length,
      value: es.reduce((s, e) => s + e.value, 0),
    });
    const sorted = [...items].sort((a, b) => wasteRisk(b) - wasteRisk(a));
    return {
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      themeMode,
      setTheme,
      reminders,
      setReminders,
      items,
      addItem,
      updateItem,
      removeItem,
      markUsed,
      markWasted,
      canAdd: isPro || items.length < FREE_ITEM_LIMIT,
      byUrgency: (u: Urgency) =>
        items
          .filter((it) => urgencyOf(it) === u)
          .sort((a, b) => wasteRisk(b) - wasteRisk(a)),
      alertQueue: sorted.filter((it) => daysLeft(it.expiry) <= 2),
      savedTotal: events
        .filter((e) => e.kind === 'used')
        .reduce((s, e) => s + e.value, 0),
      savedCount: events.filter((e) => e.kind === 'used').length,
      wastedThisWeek: sum(weekEvents.filter((e) => e.kind === 'wasted')),
      usedThisWeek: sum(weekEvents.filter((e) => e.kind === 'used')),
      expiringThisWeek: items.filter((it) => {
        const d = daysLeft(it.expiry);
        return d >= 0 && d <= 7;
      }).length,
      isPro,
      setPro,
    };
  }, [
    onboarded, lang, themeMode, reminders, items, events, isPro,
    setLanguage, setTheme, setReminders, addItem, updateItem,
    removeItem, markUsed, markWasted, setPro,
  ]);

  return <KeepsContext.Provider value={value}>{children}</KeepsContext.Provider>;
}

export function useKeeps(): KeepsState {
  const s = useContext(KeepsContext);
  if (!s) throw new Error('useKeeps must be used within KeepsProvider');
  return s;
}
