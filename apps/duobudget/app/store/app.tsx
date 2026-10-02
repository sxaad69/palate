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
import { isProLocal, setProLocal } from '../lib/billing';
import { envelopeColors } from '../theme/tokens';
import { shiftMonth, spentByEnvelope } from '../lib/money';
import type { ThemeMode } from '../theme/ThemeProvider';

export type Spender = 'me' | 'partner';
export type EnvelopeKind = 'joint' | 'mine' | 'theirs';

export interface Envelope {
  id: string;
  name: string;
  amount: number; // monthly planned
  kind: EnvelopeKind;
  color: string;
  rollover: boolean; // move leftover to savings at money date
  isSavings: boolean; // the one savings envelope
  archived: boolean;
  position: number;
}

export interface Expense {
  id: string;
  envelopeId: string;
  amount: number;
  spender: Spender;
  note: string;
  date: number; // epoch ms (the day it happened)
  createdAt: number;
}

/** Rollover credits: monthKey -> envelopeId -> extra available that month. */
export type Credits = Record<string, Record<string, number>>;

export const FREE_ENVELOPE_LIMIT = 6;

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface StarterSpec {
  name: string;
  amount: number;
  kind: EnvelopeKind;
  rollover: boolean;
  isSavings: boolean;
}

/** Starter envelopes created at onboarding (names come from i18n at call site). */
export function makeStarterEnvelopes(specs: StarterSpec[]): Envelope[] {
  return specs.map((s, i) => ({
    id: uid() + i,
    name: s.name,
    amount: s.amount,
    kind: s.kind,
    color: envelopeColors[i % envelopeColors.length] as string,
    rollover: s.rollover,
    isSavings: s.isSavings,
    archived: false,
    position: i,
  }));
}

interface TwoPurseState {
  onboarded: boolean;
  lang: Lang;
  currency: string;
  meName: string;
  partnerName: string;
  envelopes: Envelope[];
  expenses: Expense[];
  credits: Credits;
  moneyDateDone: Record<string, true>;
  isPro: boolean;
  themeMode: ThemeMode;
  hydrated: boolean;

  completeOnboarding: (p: {
    lang: Lang;
    currency: string;
    meName: string;
    partnerName: string;
    starters: StarterSpec[];
  }) => void;
  setLanguage: (l: Lang) => void;
  setCurrency: (c: string) => void;
  setNames: (me: string, partner: string) => void;
  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  saveEnvelope: (e: Omit<Envelope, 'id' | 'position' | 'archived'> & { id?: string }) => Envelope | null;
  archiveEnvelope: (id: string, archived: boolean) => void;
  closeMonth: (monthKey: string) => number; // returns amount rolled to savings
  setPro: (v: boolean) => void;
  setAppThemeMode: (m: ThemeMode) => void;
}

const TwoPurseContext = createContext<TwoPurseState | null>(null);

const KEY = '@twopurse/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  currency: string;
  meName: string;
  partnerName: string;
  themeMode: ThemeMode;
  envelopes: Envelope[];
  expenses: Expense[];
  credits: Credits;
  moneyDateDone: Record<string, true>;
  pro: boolean;
}

const DEFAULTS: Persisted = {
  onboarded: false,
  lang: 'en',
  currency: 'USD',
  meName: '',
  partnerName: '',
  themeMode: 'system',
  envelopes: [],
  expenses: [],
  credits: {},
  moneyDateDone: {},
  pro: false,
};

export function TwoPurseProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<Persisted>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  // Mirror for read-before-write helpers (saveEnvelope limit, closeMonth math).
  const ref = React.useRef(s);
  ref.current = s;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const p = JSON.parse(raw) as Partial<Persisted>;
          const pro = !!p.pro || (await isProLocal());
          setS({ ...DEFAULTS, ...p, pro });
          if (p.lang === 'ar' || p.lang === 'en') setLang(p.lang);
        } else {
          const pro = await isProLocal();
          setS((prev) => ({ ...prev, pro }));
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
    AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
  }, [hydrated, s]);

  const completeOnboarding: TwoPurseState['completeOnboarding'] = useCallback((p) => {
    setLang(p.lang);
    setS((prev) => ({
      ...prev,
      onboarded: true,
      lang: p.lang,
      currency: p.currency,
      meName: p.meName,
      partnerName: p.partnerName,
      envelopes: makeStarterEnvelopes(p.starters),
    }));
  }, []);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setS((prev) => ({ ...prev, lang: l }));
  }, []);

  const setCurrency = useCallback((c: string) => {
    setS((prev) => ({ ...prev, currency: c }));
  }, []);

  const setNames = useCallback((me: string, partner: string) => {
    setS((prev) => ({ ...prev, meName: me, partnerName: partner }));
  }, []);

  const addExpense: TwoPurseState['addExpense'] = useCallback((e) => {
    const full: Expense = { ...e, id: uid(), createdAt: Date.now() };
    setS((prev) => ({ ...prev, expenses: [...prev.expenses, full] }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setS((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }));
  }, []);

  // Returns the saved envelope, or null when the free limit blocks creation.
  // ponytail: limit check lives here (one guard, not one per caller).
  const saveEnvelope: TwoPurseState['saveEnvelope'] = useCallback((e) => {
    const cur = ref.current;
    const active = cur.envelopes.filter((x) => !x.archived);
    if (!e.id && !cur.pro && active.length >= FREE_ENVELOPE_LIMIT) return null;
    if (e.id) {
      setS((prev) => ({
        ...prev,
        envelopes: prev.envelopes.map((x) =>
          x.id === e.id ? { ...x, ...e, id: x.id, archived: x.archived } : x,
        ),
      }));
      return cur.envelopes.find((x) => x.id === e.id) ?? null;
    }
    const env: Envelope = { ...e, id: uid(), archived: false, position: cur.envelopes.length };
    setS((prev) => ({ ...prev, envelopes: [...prev.envelopes, env] }));
    return env;
  }, []);

  const archiveEnvelope = useCallback((id: string, archived: boolean) => {
    setS((prev) => ({
      ...prev,
      envelopes: prev.envelopes.map((x) => (x.id === id ? { ...x, archived } : x)),
    }));
  }, []);

  // Money-date rollover: leftover from rollover envelopes -> savings, next month.
  const closeMonth = useCallback((monthKey: string): number => {
    const cur = ref.current;
    if (cur.moneyDateDone[monthKey]) return 0;
    const perEnv = spentByEnvelope(cur.expenses, monthKey);
    const envelopes = [...cur.envelopes];
    let savings = envelopes.find((e) => e.isSavings && !e.archived);
    if (!savings) {
      savings = {
        id: uid(),
        name: 'Savings',
        amount: 0,
        kind: 'joint',
        color: envelopeColors[1] as string,
        rollover: false,
        isSavings: true,
        archived: false,
        position: envelopes.length,
      };
      envelopes.push(savings);
    }
    let rolled = 0;
    for (const e of envelopes) {
      if (e.archived || e.isSavings || !e.rollover) continue;
      const leftover = e.amount - (perEnv[e.id]?.total ?? 0);
      if (leftover > 0) rolled += leftover;
    }
    const next = shiftMonth(monthKey, 1);
    const nextCredits = { ...(cur.credits[next] ?? {}) };
    if (rolled > 0 && savings) {
      nextCredits[savings.id] = (nextCredits[savings.id] ?? 0) + rolled;
    }
    setS((prev) => ({
      ...prev,
      envelopes,
      credits: { ...prev.credits, [next]: nextCredits },
      moneyDateDone: { ...prev.moneyDateDone, [monthKey]: true },
    }));
    return rolled;
  }, []);

  const setPro = useCallback((v: boolean) => {
    setS((prev) => ({ ...prev, pro: v }));
    void setProLocal(v);
  }, []);

  const setAppThemeMode = useCallback((m: ThemeMode) => {
    setS((prev) => ({ ...prev, themeMode: m }));
  }, []);

  const value = useMemo<TwoPurseState>(
    () => ({
      onboarded: s.onboarded,
      lang: s.lang,
      currency: s.currency,
      meName: s.meName,
      partnerName: s.partnerName,
      envelopes: s.envelopes,
      expenses: s.expenses,
      credits: s.credits,
      moneyDateDone: s.moneyDateDone,
      isPro: s.pro,
      themeMode: s.themeMode,
      hydrated,
      completeOnboarding,
      setLanguage,
      setCurrency,
      setNames,
      addExpense,
      deleteExpense,
      saveEnvelope,
      archiveEnvelope,
      closeMonth,
      setPro,
      setAppThemeMode,
    }),
    [
      s,
      hydrated,
      completeOnboarding,
      setLanguage,
      setCurrency,
      setNames,
      addExpense,
      deleteExpense,
      saveEnvelope,
      archiveEnvelope,
      closeMonth,
      setPro,
      setAppThemeMode,
    ],
  );

  return <TwoPurseContext.Provider value={value}>{children}</TwoPurseContext.Provider>;
}

export function useTwoPurse(): TwoPurseState {
  const s = useContext(TwoPurseContext);
  if (!s) throw new Error('useTwoPurse must be used within TwoPurseProvider');
  return s;
}
