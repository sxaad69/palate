-- Fastuna: fasts log. One row per completed-or-ended fast, keyed by device_id.
-- The edge function writes with the service role; clients never touch this
-- table directly (same trust model as Palate's meals ledger).

create table if not exists public.fasts (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  target_hours numeric not null,
  preset_id text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists fasts_device_id_idx on public.fasts (device_id);
create index if not exists fasts_device_created_idx on public.fasts (device_id, created_at desc);

-- No public access: only the service role (via edge functions) reads/writes.
alter table public.fasts enable row level security;

drop policy if exists "no public access" on public.fasts;
create policy "no public access" on public.fasts
  for all
  using (false)
  with check (false);
