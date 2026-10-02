import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DECKS, type Deck, type Card } from '../data/decks';
import { initialSchedule, review, isDue, isMastered, type Schedule } from '../lib/sm2';

export const FREE_DAILY_CAP = 20;
export type Grade = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy → SM-2 1,3,4,5

const KEY = '@scrubdeck:study_v1';
const uid = () => `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export interface GradeEvent {
  at: number;
  good: boolean; // rating >= 3
}

interface StudyState {
  progress: Record<string, Schedule>;
  days: string[];
  pro: boolean;
  onboarded: boolean;
  customDecks: Deck[];
  totalReviews: number;
  gradeEvents: GradeEvent[];
  streak: number;
  reviewsToday: number;
  allDecks: Deck[];
  dueCards: Card[];
  gradeCard: (id: string, grade: Grade) => void;
  addDeck: (title: string) => Deck;
  addCard: (deckId: string, front: string, back: string) => void;
  deleteDeck: (deckId: string) => void;
  setPro: (v: boolean) => void;
  completeOnboarding: () => void;
  eraseAll: () => void;
}

const Ctx = createContext<StudyState | null>(null);

const GRADE_TO_SM2: Record<Grade, 1 | 2 | 3 | 4 | 5> = { 1: 1, 2: 3, 3: 4, 4: 5 };

function computeStreak(days: string[]): number {
  const set = new Set(days);
  let s = 0;
  const d = new Date();
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1);
  while (set.has(todayKey(d))) {
    s += 1;
    d.setDate(d.getDate() - 1);
  }
  return s;
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Record<string, Schedule>>({});
  const [days, setDays] = useState<string[]>([]);
  const [pro, setPro] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [customDecks, setCustomDecks] = useState<Deck[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [gradeEvents, setGradeEvents] = useState<GradeEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setProgress(data.progress ?? {});
          setDays(data.days ?? []);
          setPro(data.pro ?? false);
          setOnboarded(data.onboarded ?? false);
          setCustomDecks(data.customDecks ?? []);
          setTotalReviews(data.totalReviews ?? 0);
          setGradeEvents(data.gradeEvents ?? []);
        }
      } catch {
        // fresh start
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      KEY,
      JSON.stringify({ progress, days, pro, onboarded, customDecks, totalReviews, gradeEvents }),
    ).catch(() => {});
  }, [progress, days, pro, onboarded, customDecks, totalReviews, gradeEvents, loaded]);

  const value = useMemo<StudyState>(() => {
    const allDecks = [...DECKS.filter((d) => d.free || pro), ...customDecks];
    const pool = allDecks.flatMap((d) => d.cards);
    const now = Date.now();
    const dueCards = pool
      .filter((c) => isDue(progress[c.id], now))
      .sort((a, b) => (progress[a.id]?.nextDue ?? 0) - (progress[b.id]?.nextDue ?? 0));
    const tk = todayKey();
    const reviewsToday = gradeEvents.filter(
      (e) => new Date(e.at).toISOString().slice(0, 10) === tk,
    ).length;
    return {
      progress,
      days,
      pro,
      onboarded,
      customDecks,
      totalReviews,
      gradeEvents,
      streak: computeStreak(days),
      reviewsToday,
      allDecks,
      dueCards,
      gradeCard: (id, grade) => {
        const sm2 = GRADE_TO_SM2[grade];
        const t = Date.now();
        setProgress((prev) => ({
          ...prev,
          [id]: review(prev[id] ?? initialSchedule(t), sm2, t),
        }));
        setTotalReviews((n) => n + 1);
        setGradeEvents((prev) => [...prev.slice(-500), { at: t, good: sm2 >= 3 }]);
        setDays((prev) => (prev.includes(tk) ? prev : [...prev, tk]));
      },
      addDeck: (title) => {
        const deck: Deck = { id: `custom-${uid()}`, titleEn: title, titleAr: title, free: true, cards: [] };
        setCustomDecks((prev) => [...prev, deck]);
        return deck;
      },
      addCard: (deckId, front, back) =>
        setCustomDecks((prev) =>
          prev.map((d) =>
            d.id === deckId
              ? { ...d, cards: [...d.cards, { id: `cc-${uid()}`, front, back }] }
              : d,
          ),
        ),
      deleteDeck: (deckId) => setCustomDecks((prev) => prev.filter((d) => d.id !== deckId)),
      setPro: (v) => setPro(v),
      completeOnboarding: () => setOnboarded(true),
      eraseAll: () => {
        setProgress({});
        setDays([]);
        setCustomDecks([]);
        setTotalReviews(0);
        setGradeEvents([]);
      },
    };
  }, [progress, days, pro, onboarded, customDecks, totalReviews, gradeEvents]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { isMastered };

export function useStudy(): StudyState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStudy outside provider');
  return v;
}
