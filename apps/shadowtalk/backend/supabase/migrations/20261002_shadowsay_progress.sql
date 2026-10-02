-- ShadowSay cloud-sync reserve schema.
-- v1 does NO reads/writes (YAGNI): everything lives in AsyncStorage + the
-- device document dir. This table reserves the shape for a future
-- "sync progress across devices" launch feature.
-- Run with the Supabase SQL editor or `supabase db push`.

create table if not exists public.shadow_progress (
  user_id uuid primary key,
  -- Mirrors the persisted store shape (@shadowsay/state/v1) minus recordings:
  -- { stats, logs, streakDays... }. Audio files never leave the device.
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Locked down until a sync feature actually needs it: RLS on, no policies,
-- so nothing can read or write this table yet.
alter table public.shadow_progress enable row level security;
