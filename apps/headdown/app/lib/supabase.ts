import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ponytail: single shared project for the portfolio's early apps; per-app
// tables are namespaced (dryspell_*). Split into per-app projects at launch
// if any app outgrows the free tier.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null; // local-first v1
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
