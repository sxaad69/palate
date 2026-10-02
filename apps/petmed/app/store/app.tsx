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
import { localDayKey, type Frequency } from '../lib/schedule';

export const FREE_PET_LIMIT = 1;

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface WeightEntry {
  date: string; // day key
  kg: number;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  birthdate?: string;
  photoUri?: string;
  colorIndex: number;
  notes?: string;
  weightLog: WeightEntry[];
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dose: string;
  frequency: Frequency;
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface DoseEvent {
  key: string;
  medId: string;
  petId: string;
  at: number;
  status: 'given' | 'skipped';
}

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  givenDate: string;
  dueDate?: string;
  notes?: string;
}

export interface VetVisit {
  id: string;
  petId: string;
  date: string;
  vet?: string;
  reason: string;
  notes?: string;
}

const KEY = '@pawscript/state/v1';

interface Persisted {
  onboarded: boolean;
  lang: Lang;
  pets: Pet[];
  meds: Medication[];
  doseEvents: DoseEvent[];
  vaccinations: Vaccination[];
  vetVisits: VetVisit[];
  pro: boolean;
}

function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

interface PawState {
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  lang: Lang;
  setLanguage: (l: Lang) => void;
  pets: Pet[];
  addPet: (p: Omit<Pet, 'id' | 'colorIndex' | 'weightLog'> & { weightLog?: WeightEntry[] }) => string;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  removePet: (id: string) => void;
  meds: Medication[];
  addMedication: (m: Omit<Medication, 'id'>) => string;
  updateMedication: (id: string, patch: Partial<Medication>) => void;
  removeMedication: (id: string) => void;
  logDose: (key: string, medId: string, petId: string, status: 'given' | 'skipped') => void;
  undoDose: (key: string) => void;
  doseEvents: DoseEvent[];
  addWeight: (petId: string, kg: number, date: string) => void;
  vaccinations: Vaccination[];
  addVaccination: (v: Omit<Vaccination, 'id'>) => void;
  removeVaccination: (id: string) => void;
  vetVisits: VetVisit[];
  addVetVisit: (v: Omit<VetVisit, 'id'>) => void;
  removeVetVisit: (id: string) => void;
  isPro: boolean;
  setPro: (v: boolean) => void;
  eraseAll: () => void;
  canAddPet: boolean;
  hydrated: boolean;
}

const PawContext = createContext<PawState | null>(null);

const emptyPersisted: Persisted = {
  onboarded: false,
  lang: 'en',
  pets: [],
  meds: [],
  doseEvents: [],
  vaccinations: [],
  vetVisits: [],
  pro: false,
};

export function PawProvider({ children }: { children: React.ReactNode }) {
  const [onboarded, setOnboardedState] = useState(false);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [pets, setPets] = useState<Pet[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [doseEvents, setDoseEvents] = useState<DoseEvent[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [isPro, setIsProState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load once.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const p = { ...emptyPersisted, ...(JSON.parse(raw) as Partial<Persisted>) };
          setOnboardedState(!!p.onboarded);
          if (p.lang === 'ar' || p.lang === 'en') {
            setLang(p.lang);
            setLangState(p.lang);
          }
          setPets(Array.isArray(p.pets) ? p.pets : []);
          setMeds(Array.isArray(p.meds) ? p.meds : []);
          setDoseEvents(Array.isArray(p.doseEvents) ? p.doseEvents : []);
          setVaccinations(Array.isArray(p.vaccinations) ? p.vaccinations : []);
          setVetVisits(Array.isArray(p.vetVisits) ? p.vetVisits : []);
          setIsProState(!!p.pro);
        } else {
          setIsProState(await isProLocal());
        }
      } catch {
        // start fresh
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    const p: Persisted = {
      onboarded,
      lang,
      pets,
      meds,
      doseEvents,
      vaccinations,
      vetVisits,
      pro: isPro,
    };
    AsyncStorage.setItem(KEY, JSON.stringify(p)).catch(() => {});
  }, [hydrated, onboarded, lang, pets, meds, doseEvents, vaccinations, vetVisits, isPro]);

  const setOnboarded = useCallback((v: boolean) => setOnboardedState(v), []);
  const setLanguage = useCallback((l: Lang) => {
    setLang(l);
    setLangState(l);
  }, []);
  const setPro = useCallback((v: boolean) => {
    setIsProState(v);
    void setProLocal(v);
  }, []);

  const addPet = useCallback((p: Omit<Pet, 'id' | 'colorIndex' | 'weightLog'> & { weightLog?: WeightEntry[] }) => {
    const id = uid();
    setPets((prev) => [
      ...prev,
      { ...p, id, colorIndex: prev.length, weightLog: p.weightLog ?? [] },
    ]);
    return id;
  }, []);

  const updatePet = useCallback((id: string, patch: Partial<Pet>) => {
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  // Cascade: removing a pet removes its meds, dose events, vaccinations, visits.
  const removePet = useCallback((id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    setMeds((prev) => prev.filter((m) => m.petId !== id));
    setDoseEvents((prev) => prev.filter((e) => e.petId !== id));
    setVaccinations((prev) => prev.filter((v) => v.petId !== id));
    setVetVisits((prev) => prev.filter((v) => v.petId !== id));
  }, []);

  const addMedication = useCallback((m: Omit<Medication, 'id'>) => {
    const id = uid();
    setMeds((prev) => [...prev, { ...m, id }]);
    return id;
  }, []);

  const updateMedication = useCallback((id: string, patch: Partial<Medication>) => {
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const removeMedication = useCallback((id: string) => {
    setMeds((prev) => prev.filter((m) => m.id !== id));
    setDoseEvents((prev) => prev.filter((e) => e.medId !== id));
  }, []);

  const logDose = useCallback((key: string, medId: string, petId: string, status: 'given' | 'skipped') => {
    const at = Date.now();
    setDoseEvents((prev) => {
      const rest = prev.filter((e) => e.key !== key);
      return [...rest, { key, medId, petId, at, status }];
    });
  }, []);

  const undoDose = useCallback((key: string) => {
    setDoseEvents((prev) => prev.filter((e) => e.key !== key));
  }, []);

  const addWeight = useCallback((petId: string, kg: number, date: string) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? { ...p, weightLog: [...p.weightLog.filter((w) => w.date !== date), { date, kg }].sort((a, b) => (a.date < b.date ? -1 : 1)) }
          : p,
      ),
    );
  }, []);

  const addVaccination = useCallback((v: Omit<Vaccination, 'id'>) => {
    setVaccinations((prev) => [...prev, { ...v, id: uid() }]);
  }, []);

  const removeVaccination = useCallback((id: string) => {
    setVaccinations((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const addVetVisit = useCallback((v: Omit<VetVisit, 'id'>) => {
    setVetVisits((prev) => [...prev, { ...v, id: uid() }].sort((a, b) => (a.date < b.date ? 1 : -1)));
  }, []);

  const removeVetVisit = useCallback((id: string) => {
    setVetVisits((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const eraseAll = useCallback(() => {
    setPets([]);
    setMeds([]);
    setDoseEvents([]);
    setVaccinations([]);
    setVetVisits([]);
  }, []);

  const canAddPet = isPro || pets.length < FREE_PET_LIMIT;

  const value = useMemo<PawState>(
    () => ({
      onboarded,
      setOnboarded,
      lang,
      setLanguage,
      pets,
      addPet,
      updatePet,
      removePet,
      meds,
      addMedication,
      updateMedication,
      removeMedication,
      logDose,
      undoDose,
      doseEvents,
      addWeight,
      vaccinations,
      addVaccination,
      removeVaccination,
      vetVisits,
      addVetVisit,
      removeVetVisit,
      isPro,
      setPro,
      eraseAll,
      canAddPet,
      hydrated,
    }),
    [
      onboarded, setOnboarded, lang, setLanguage, pets, addPet, updatePet, removePet,
      meds, addMedication, updateMedication, removeMedication, logDose, undoDose,
      doseEvents, addWeight, vaccinations, addVaccination, removeVaccination,
      vetVisits, addVetVisit, removeVetVisit, isPro, setPro, eraseAll, canAddPet, hydrated,
    ],
  );

  return <PawContext.Provider value={value}>{children}</PawContext.Provider>;
}

export function usePaw(): PawState {
  const s = useContext(PawContext);
  if (!s) throw new Error('usePaw must be used within PawProvider');
  return s;
}

export function todayKey(): string {
  return localDayKey(new Date());
}
