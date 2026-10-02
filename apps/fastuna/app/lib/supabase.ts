import { createClient } from '@supabase/supabase-js';

// The publishable key is public-by-design: it ships inside client apps and is
// gated by Row Level Security. The secret key must never live in this repo.
// NOTE: Fastuna shares Saad's Supabase project with Palate for now (distinct
// `fasts` table, no collision). A dedicated project per app is recommended
// before launch — see BUILD_NOTES.md.
const SUPABASE_URL = 'https://ajzypbzojvgflajkkwnr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_1peISP0rKj1Pk-N8VWQ9rQ_g49QMZV7';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
