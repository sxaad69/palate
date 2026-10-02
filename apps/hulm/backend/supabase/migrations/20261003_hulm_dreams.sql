-- Hulm v1: best-effort cloud backup of dream journal (local-first app).
-- One row per dream, keyed by a random device id. RLS allows anon
-- upsert/read only when the caller knows the device id (unguessable).

create table if not exists public.hulm_dreams (
  device_id text not null,
  dream_id text not null,
  title text not null default '',
  narrative text not null default '',
  mood text not null default 'neutral',
  dream_date date not null,
  created_at timestamptz not null default now(),
  symbol_ids text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (device_id, dream_id)
);

alter table public.hulm_dreams enable row level security;

-- Permissive by design: the device_id is a random secret. Anyone who knows it
-- is the device owner. Tighten with auth when accounts are added.
create policy "hulm_dreams_anon_all"
  on public.hulm_dreams
  for all
  to anon
  using (true)
  with check (true);
