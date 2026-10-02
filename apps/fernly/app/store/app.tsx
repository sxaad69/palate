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
import { getDeviceId } from '../lib/device';
import { syncToServer, fetchSnapshotFromServer } from '../lib/api';
import { isPro as billingIsPro } from '../lib/billing';
import {
  careStreak,
  dueTasks,
  type CareEvent,
  type CareType,
  type DueTask,
  type Plant,
} from '../lib/plants';
import { strings, type Language, type Strings } from '../lib/strings';

interface AppState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: Strings;
  plants: Plant[];
  addPlant: (p: Omit<Plant, 'id' | 'adoptedAt' | 'archived'>) => void;
  archivePlant: (id: string) => void;
  careEvents: CareEvent[];
  logCare: (plantId: string, type: CareType) => void;
  due: DueTask[];
  streak: number;
  tasksDone: number;
  isPro: boolean;
  refreshPro: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);
const STORE_KEY = '@fernly/store/v1';

interface Persisted {
  onboarded: boolean;
  language: Language;
  plants: Plant[];
  careEvents: CareEvent[];
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboardedState] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [careEvents, setCareEvents] = useState<CareEvent[]>([]);
  const [isPro, setIsPro] = useState(false);
  const hydratedRef = useRef(false);

  const pushSync = (p: Plant[], e: CareEvent[]) => {
    getDeviceId()
      .then((deviceId) => syncToServer(deviceId, p, e))
      .catch(() => {});
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
          if (Array.isArray(d.plants)) setPlants(d.plants);
          if (Array.isArray(d.careEvents)) setCareEvents(d.careEvents);
        }
      } catch {
        // ignore — start fresh
      } finally {
        hydratedRef.current = true;
      }
      try {
        const deviceId = await getDeviceId();
        const snap = await fetchSnapshotFromServer(deviceId);
        if (snap) {
          setPlants((prev) => {
            const ids = new Set(snap.plants.map((p) => p.id));
            return [...snap.plants, ...prev.filter((p) => !ids.has(p.id))];
          });
          setCareEvents((prev) => {
            const ids = new Set(snap.events.map((e) => e.id));
            return [...snap.events, ...prev.filter((e) => !ids.has(e.id))];
          });
        }
      } catch {
        // offline — keep local
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
    const data: Persisted = { onboarded, language, plants, careEvents };
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(data)).catch(() => {});
  }, [onboarded, language, plants, careEvents]);

  const setOnboarded = (v: boolean) => setOnboardedState(v);
  const setLanguage = (l: Language) => {
    setLanguageState(l);
    applyRtl(l);
  };

  const addPlant: AppState['addPlant'] = (p) => {
    const plant: Plant = { ...p, id: uid('p'), adoptedAt: Date.now(), archived: false };
    setPlants((prev) => {
      const next = [...prev, plant];
      pushSync(next, careEvents);
      return next;
    });
  };

  const archivePlant = (id: string) => {
    setPlants((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, archived: true } : p));
      pushSync(next, careEvents);
      return next;
    });
  };

  const logCare = (plantId: string, type: CareType) => {
    const event: CareEvent = { id: uid('c'), plantId, type, at: Date.now() };
    setCareEvents((prev) => {
      const next = [...prev, event];
      pushSync(plants, next);
      return next;
    });
  };

  const due = useMemo(() => dueTasks(plants, careEvents), [plants, careEvents]);
  const streak = useMemo(() => careStreak(careEvents), [careEvents]);
  const tasksDone = careEvents.length;

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
      plants, addPlant, archivePlant, careEvents, logCare,
      due, streak, tasksDone, isPro, refreshPro,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onboarded, language, plants, careEvents, due, streak, tasksDone, isPro, t],
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
