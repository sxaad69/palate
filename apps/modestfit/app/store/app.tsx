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
import {
  DEFAULT_PREFS,
  type ModestyPrefs,
  type Occasion,
  type Outfit,
  type OwnedPiece,
  type PieceDef,
  type PlanEntry,
} from '../data/pieces';
import type { ThemeMode } from '../theme/ThemeProvider';

export const FREE_PIECE_LIMIT = 20;

interface ModestFitState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  prefs: ModestyPrefs;
  setPrefs: (p: ModestyPrefs) => void;
  pieces: OwnedPiece[];
  addPiece: (p: OwnedPiece) => boolean; // false = free limit hit
  addStarterPiece: (def: PieceDef) => boolean;
  removePiece: (id: string) => void;
  outfits: Outfit[];
  addOutfit: (o: Omit<Outfit, 'id' | 'createdAt'>) => void;
  removeOutfit: (id: string) => void;
  plan: Record<string, PlanEntry>;
  setPlanEntry: (date: string, entry: PlanEntry | null) => void;
  markWorn: (date: string) => void;
  pieceById: (id: string) => OwnedPiece | undefined;
  outfitById: (id: string) => Outfit | undefined;
  isPro: boolean;
  setPro: (v: boolean) => void;
  hydrated: boolean;
}

const Ctx = createContext<ModestFitState | null>(null);

const KEY = '@modestfit/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  themeMode: ThemeMode;
  prefs: ModestyPrefs;
  pieces: OwnedPiece[];
  outfits: Outfit[];
  plan: Record<string, PlanEntry>;
  pro: boolean;
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function ModestFitProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [prefs, setPrefsState] = useState<ModestyPrefs>(DEFAULT_PREFS);
  const [pieces, setPieces] = useState<OwnedPiece[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [plan, setPlan] = useState<Record<string, PlanEntry>>({});
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
          if (p.prefs) setPrefsState({ ...DEFAULT_PREFS, ...p.prefs });
          setPieces(Array.isArray(p.pieces) ? p.pieces : []);
          setOutfits(Array.isArray(p.outfits) ? p.outfits : []);
          setPlan(p.plan && typeof p.plan === 'object' ? p.plan : {});
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
    const p: Persisted = { onboarded, lang, themeMode, prefs, pieces, outfits, plan, pro: isPro };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, themeMode, prefs, pieces, outfits, plan, isPro]);

  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);

  const setThemeMode = useCallback((m: ThemeMode) => setThemeModeState(m), []);

  const setPrefs = useCallback((p: ModestyPrefs) => setPrefsState(p), []);

  // Gate lives here so every caller gets the same rule.
  const canAddPiece = useCallback(
    (count: number) => isPro || count < FREE_PIECE_LIMIT,
    [isPro],
  );

  const addPiece = useCallback(
    (piece: OwnedPiece) => {
      let ok = false;
      setPieces((prev) => {
        if (!canAddPiece(prev.length)) return prev;
        ok = true;
        return [...prev, piece];
      });
      return ok;
    },
    [canAddPiece],
  );

  const addStarterPiece = useCallback(
    (def: PieceDef) => {
      return addPiece({
        ...def,
        wearCount: 0,
        addedAt: Date.now(),
        id: uid('p'),
      });
    },
    [addPiece],
  );

  const removePiece = useCallback((id: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
    // Keep outfits/plan consistent: drop the piece from outfits.
    setOutfits((prev) =>
      prev.map((o) => ({ ...o, pieceIds: o.pieceIds.filter((pid) => pid !== id) })),
    );
  }, []);

  const addOutfit = useCallback((o: Omit<Outfit, 'id' | 'createdAt'>) => {
    setOutfits((prev) => [...prev, { ...o, id: uid('o'), createdAt: Date.now() }]);
  }, []);

  const removeOutfit = useCallback((id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
    setPlan((prev) => {
      const next = { ...prev };
      for (const [date, entry] of Object.entries(next)) {
        if (entry.outfitId === id) delete next[date];
      }
      return next;
    });
  }, []);

  const setPlanEntry = useCallback((date: string, entry: PlanEntry | null) => {
    setPlan((prev) => {
      const next = { ...prev };
      if (entry) next[date] = entry;
      else delete next[date];
      return next;
    });
  }, []);

  // Marking worn bumps wearCount on every piece in the outfit — the raw
  // material for Insights' most-worn / never-worn stats.
  const markWorn = useCallback(
    (date: string) => {
      setPlan((prevPlan) => {
        const entry = prevPlan[date];
        if (!entry || entry.worn) return prevPlan;
        const next = { ...prevPlan, [date]: { ...entry, worn: true } };
        setPieces((prevPieces) => {
          const outfit = outfits.find((o) => o.id === entry.outfitId);
          if (!outfit) return prevPieces;
          const ids = new Set(outfit.pieceIds);
          return prevPieces.map((p) =>
            ids.has(p.id) ? { ...p, wearCount: p.wearCount + 1 } : p,
          );
        });
        return next;
      });
    },
    [outfits],
  );

  const pieceById = useCallback((id: string) => pieces.find((p) => p.id === id), [pieces]);
  const outfitById = useCallback((id: string) => outfits.find((o) => o.id === id), [outfits]);

  const setPro = useCallback((v: boolean) => {
    setIsPro(v);
    void setProLocal(v);
  }, []);

  const value = useMemo<ModestFitState>(
    () => ({
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      themeMode,
      setThemeMode,
      prefs,
      setPrefs,
      pieces,
      addPiece,
      addStarterPiece,
      removePiece,
      outfits,
      addOutfit,
      removeOutfit,
      plan,
      setPlanEntry,
      markWorn,
      pieceById,
      outfitById,
      isPro,
      setPro,
      hydrated,
    }),
    [
      onboarded, lang, themeMode, prefs, pieces, outfits, plan, isPro, hydrated,
      setLanguage, setThemeMode, setPrefs, addPiece, addStarterPiece, removePiece,
      addOutfit, removeOutfit, setPlanEntry, markWorn, pieceById, outfitById, setPro,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useModestFit(): ModestFitState {
  const s = useContext(Ctx);
  if (!s) throw new Error('useModestFit must be used within ModestFitProvider');
  return s;
}

export { uid };
