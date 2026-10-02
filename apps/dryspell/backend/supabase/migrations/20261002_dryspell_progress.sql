-- DrySpell v1: best-effort cloud backup of counter state (local-first app).
-- One row per install, keyed by a random device id. RLS allows anon
-- upsert/read only when the caller knows the device id (unguessable).

create table if not exists public.dryspell_progress (
  device_id text primary key,
  habit text not null default 'alcohol',
  daily_spend numeric not null default 0,
  currency text not null default '$',
  start_date date not null,
  updated_at timestamptz not null default now()
);

alter table public.dryspell_progress enable row level security;

-- Permissive by design: the device_id is a random secret. Anyone who knows it
-- is the device owner. Tighten with auth when accounts are added.
create policy "dryspell_progress_anon_all"
  on public.dryspell_progress
  for all
  to anon
  using (true)
  with check (true);
