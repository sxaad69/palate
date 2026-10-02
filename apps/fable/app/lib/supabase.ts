import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ponytail: v1 is local-first (AsyncStorage). This client exists so cloud
// sync / cross-device progress can land without a refactor. No calls yet.
const URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  if (!client) client = createClient(URL, ANON);
  return client;
}
