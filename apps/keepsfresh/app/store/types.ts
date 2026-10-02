import type { FoodCategory, StorageLoc } from '../data/foods';
import { PERISHABILITY as P } from '../data/foods';

export type { FoodCategory, StorageLoc };

export interface PantryItem {
  id: string;
  name: string;
  cat: FoodCategory;
  loc: StorageLoc;
  expiry: number; // epoch ms
  qty: number;
  price: number; // estimated unit price, USD
  addedAt: number;
  defaultId?: string;
}

export interface WasteEvent {
  id: string;
  name: string;
  kind: 'used' | 'wasted';
  value: number;
  at: number;
}

export const FREE_ITEM_LIMIT = 30;

export function daysLeft(expiry: number): number {
  return Math.ceil((expiry - Date.now()) / 86400000);
}

// Waste-risk score: days left × quantity × perishability, as a single
// sortable number. Higher = use it first. Expired items (daysLeft < 0)
// score highest by construction via max(1, 4 - daysLeft).
export function wasteRisk(item: PantryItem): number {
  return P[item.cat] * item.qty * Math.max(1, 4 - daysLeft(item.expiry));
}

export type Urgency = 'expired' | 'soon' | 'week' | 'fresh';

export function urgencyOf(item: PantryItem): Urgency {
  const d = daysLeft(item.expiry);
  if (d < 0) return 'expired';
  if (d <= 2) return 'soon';
  if (d <= 7) return 'week';
  return 'fresh';
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
