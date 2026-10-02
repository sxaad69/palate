import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLang, setLang, type Lang } from '../lib/i18n';
import { deleteRecording } from '../lib/audio';
import { isProLocal, setProLocal } from '../lib/billing';
import type { ThemeMode } from '../theme/ThemeProvider';

export interface ActionItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export interface Meeting {
  id: string;
  title: string;
  createdAt: number; // epoch ms
  durationSec: number;
  audioUri: string | null;
  transcript: string; // v1: user-pasted/edited; STT feeds this later (lib/stt.ts)
  summary: string; // local template build (lib/summary.ts)
  notes: string;
  actions: ActionItem[];
  hourlyRate: number; // captured at record time; 0 = timer off
  cost: number; // computed at stop
}

export const FREE_MEETINGS_PER_MONTH = 5;
export const FREE_MAX_DURATION_SEC = 30 * 60;

interface MeetBriefState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  defaultRate: number;
  setDefaultRate: (r: number) => void;
  meetings: Meeting[];
  addMeeting: (m: Meeting) => void;
  updateMeeting: (id: string, patch: Partial<Meeting>) => void;
  removeMeeting: (id: string) => void;
  addAction: (meetingId: string, text: string) => void;
  toggleAction: (meetingId: string, actionId: string) => void;
  editAction: (meetingId: string, actionId: string, text: string) => void;
  removeAction: (meetingId: string, actionId: string) => void;
  meetingsThisMonth: number;
  totalSeconds: number;
  totalActionsDone: number;
  totalActions: number;
  totalCost: number;
  isPro: boolean;
  setPro: (v: boolean) => void;
}

const MeetBriefContext = createContext<MeetBriefState | null>(null);

const KEY = '@meetbrief/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  themeMode: ThemeMode;
  defaultRate: number;
  meetings: Meeting[];
  pro: boolean;
}

function sanitizeMeetings(raw: unknown): Meeting[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (m): m is Meeting =>
      !!m && typeof m.id === 'string' && typeof m.title === 'string',
  );
}

export function MeetBriefProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [defaultRate, setDefaultRateState] = useState(0);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
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
          if (p.themeMode === 'light' || p.themeMode === 'dark' || p.themeMode === 'system') {
            setThemeModeState(p.themeMode);
          }
          if (typeof p.defaultRate === 'number' && p.defaultRate >= 0) {
            setDefaultRateState(p.defaultRate);
          }
          setMeetings(sanitizeMeetings(p.meetings));
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
    const p: Persisted = { onboarded, lang, themeMode, defaultRate, meetings, pro: isPro };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, themeMode, defaultRate, meetings, isPro]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);

  const setThemeMode = useCallback((m: ThemeMode) => setThemeModeState(m), []);

  const setDefaultRate = useCallback((r: number) => setDefaultRateState(Math.max(0, r)), []);

  const addMeeting = useCallback((m: Meeting) => {
    setMeetings((prev) => [m, ...prev]);
  }, []);

  const updateMeeting = useCallback((id: string, patch: Partial<Meeting>) => {
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const removeMeeting = useCallback((id: string) => {
    setMeetings((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target) deleteRecording(target.audioUri);
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const mutateActions = useCallback(
    (meetingId: string, fn: (actions: ActionItem[]) => ActionItem[]) => {
      setMeetings((prev) =>
        prev.map((m) => (m.id === meetingId ? { ...m, actions: fn(m.actions) } : m)),
      );
    },
    [],
  );

  const addAction = useCallback(
    (meetingId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      mutateActions(meetingId, (actions) => [
        ...actions,
        { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, text: trimmed, done: false, createdAt: Date.now() },
      ]);
    },
    [mutateActions],
  );

  const toggleAction = useCallback(
    (meetingId: string, actionId: string) => {
      mutateActions(meetingId, (actions) =>
        actions.map((a) => (a.id === actionId ? { ...a, done: !a.done } : a)),
      );
    },
    [mutateActions],
  );

  const editAction = useCallback(
    (meetingId: string, actionId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      mutateActions(meetingId, (actions) =>
        actions.map((a) => (a.id === actionId ? { ...a, text: trimmed } : a)),
      );
    },
    [mutateActions],
  );

  const removeAction = useCallback(
    (meetingId: string, actionId: string) => {
      mutateActions(meetingId, (actions) => actions.filter((a) => a.id !== actionId));
    },
    [mutateActions],
  );

  const setPro = useCallback((v: boolean) => {
    setIsPro(v);
    void setProLocal(v);
  }, []);

  const value = useMemo<MeetBriefState>(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    return {
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      themeMode,
      setThemeMode,
      defaultRate,
      setDefaultRate,
      meetings,
      addMeeting,
      updateMeeting,
      removeMeeting,
      addAction,
      toggleAction,
      editAction,
      removeAction,
      meetingsThisMonth: meetings.filter((m) => m.createdAt >= monthStart).length,
      totalSeconds: meetings.reduce((s, m) => s + m.durationSec, 0),
      totalActionsDone: meetings.reduce((s, m) => s + m.actions.filter((a) => a.done).length, 0),
      totalActions: meetings.reduce((s, m) => s + m.actions.length, 0),
      totalCost: meetings.reduce((s, m) => s + m.cost, 0),
      isPro,
      setPro,
    };
  }, [
    onboarded, lang, themeMode, defaultRate, meetings, isPro,
    setLanguage, setThemeMode, setDefaultRate, addMeeting, updateMeeting,
    removeMeeting, addAction, toggleAction, editAction, removeAction, setPro,
  ]);

  return <MeetBriefContext.Provider value={value}>{children}</MeetBriefContext.Provider>;
}

export function useMeetBrief(): MeetBriefState {
  const s = useContext(MeetBriefContext);
  if (!s) throw new Error('useMeetBrief must be used within MeetBriefProvider');
  return s;
}
