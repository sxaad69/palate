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
import type { ExpenseCategory } from '../data/categories';
import type { Currency } from '../lib/strings';

// ponytail: one context is the whole store. Local-first: AsyncStorage is the
// source of truth; Supabase sync is best-effort and never blocks the UI.

export interface Transaction {
  id: string;
  kind: 'expense' | 'income';
  amount: number;
  category: ExpenseCategory | null; // expenses only
  vendor: string; // vendor or note
  clientId: string | null;
  date: string; // YYYY-MM-DD
  deductible: boolean; // expenses only
  createdAt: number;
}

export interface Client {
  id: string;
  name: string;
}

export interface ClientStats {
  income: number;
  expenses: number;
  profit: number;
}

interface LedgerState {
  onboarded: boolean;
  currency: Currency;
  taxRate: number; // % of profit to set aside
  clients: Client[];
  transactions: Transaction[];
  pro: boolean;
  // derived (current month)
  monthKey: string;
  monthIncome: number;
  monthExpenses: number;
  monthProfit: number;
  monthDeductible: number;
  taxShield: number;
  // actions
  completeOnboarding: (o: { currency: Currency; taxRate: number }) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addClient: (name: string) => string | null; // returns id or null when limit hit
  deleteClient: (id: string) => void;
  setCurrency: (c: Currency) => void;
  setTaxRate: (r: number) => void;
  setPro: (pro: boolean) => void;
  eraseAll: () => void;
  clientStats: (clientId: string) => ClientStats;
  buildCsv: () => string;
}

const STORAGE_KEY = '@lanceledger:state/v1';
export const FREE_CLIENT_LIMIT = 3;

const monthKeyOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

interface Persisted {
  onboarded: boolean;
  currency: Currency;
  taxRate: number;
  clients: Client[];
  transactions: Transaction[];
  pro: boolean;
}

const DEFAULTS: Persisted = {
  onboarded: false,
  currency: '$',
  taxRate: 25,
  clients: [],
  transactions: [],
  pro: false,
};

const LedgerContext = createContext<LedgerState | null>(null);

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(DEFAULTS);
  const hydrated = useRef(false);
  const currentMonth = monthKeyOf(new Date());

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

  const value = useMemo<LedgerState>(() => {
    const patch = (p: Partial<Persisted>) => setState((s) => ({ ...s, ...p }));

    const monthTx = state.transactions.filter((t) => t.date.startsWith(currentMonth));
    const monthIncome = monthTx.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);
    const monthExpenses = monthTx.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
    const monthProfit = monthIncome - monthExpenses;
    const monthDeductible = monthTx
      .filter((t) => t.kind === 'expense' && t.deductible)
      .reduce((s, t) => s + t.amount, 0);

    const clientStats = (clientId: string): ClientStats => {
      const tx = state.transactions.filter((t) => t.clientId === clientId);
      const income = tx.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = tx.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
      return { income, expenses, profit: income - expenses };
    };

    const buildCsv = (): string => {
      const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
      const header = 'date,kind,amount,currency,category,vendor,client,deductible';
      const clientName = (id: string | null) =>
        state.clients.find((c) => c.id === id)?.name ?? '';
      const rows = [...state.transactions]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((t) =>
          [
            t.date,
            t.kind,
            t.amount,
            state.currency,
            t.category ?? '',
            t.vendor,
            clientName(t.clientId),
            t.deductible ? 'yes' : 'no',
          ]
            .map(esc)
            .join(','),
        );
      return [header, ...rows].join('\n');
    };

    return {
      ...state,
      monthKey: currentMonth,
      monthIncome,
      monthExpenses,
      monthProfit,
      monthDeductible,
      taxShield: Math.max(0, monthProfit) * (state.taxRate / 100),
      completeOnboarding: (o) => patch({ onboarded: true, ...o }),
      addTransaction: (t) =>
        patch({
          transactions: [
            { ...t, id: `t-${Date.now()}`, createdAt: Date.now() },
            ...state.transactions,
          ],
        }),
      deleteTransaction: (id) =>
        patch({ transactions: state.transactions.filter((t) => t.id !== id) }),
      addClient: (name) => {
        if (!state.pro && state.clients.length >= FREE_CLIENT_LIMIT) return null;
        const id = `c-${Date.now()}`;
        patch({ clients: [...state.clients, { id, name: name.trim() }] });
        return id;
      },
      deleteClient: (id) =>
        patch({
          clients: state.clients.filter((c) => c.id !== id),
          transactions: state.transactions.map((t) =>
            t.clientId === id ? { ...t, clientId: null } : t,
          ),
        }),
      setCurrency: (currency) => patch({ currency }),
      setTaxRate: (taxRate) => patch({ taxRate }),
      setPro: (pro) => patch({ pro }),
      eraseAll: () => patch({ ...DEFAULTS, onboarded: true }),
      clientStats,
      buildCsv,
    };
  }, [state, currentMonth]);

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

// ponytail: fire-and-forget cloud backup. One device id, two tables.
async function syncToCloud(state: Persisted): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !state.onboarded) return;
  const deviceId = await getDeviceId();
  await supabase.from('lanceledger_clients').upsert(
    state.clients.map((c) => ({ device_id: deviceId, client_id: c.id, name: c.name })),
    { onConflict: 'device_id,client_id' },
  );
  await supabase.from('lanceledger_transactions').upsert(
    state.transactions.map((t) => ({
      device_id: deviceId,
      tx_id: t.id,
      kind: t.kind,
      amount: t.amount,
      category: t.category,
      vendor: t.vendor,
      client_id: t.clientId,
      date: t.date,
      deductible: t.deductible,
      currency: state.currency,
    })),
    { onConflict: 'device_id,tx_id' },
  );
}

export function useLedger(): LedgerState {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error('useLedger must be used within LedgerProvider');
  return ctx;
}

export function formatMoney(currency: string, amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 2 });
  return `${sign}${currency}${abs}`;
}
