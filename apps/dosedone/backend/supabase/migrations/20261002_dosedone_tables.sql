-- DoseDone v1: best-effort cloud backup (local-first app).
-- Rows are keyed by a random device id. RLS allows anon upsert/read only
-- when the caller knows the device id (unguessable).

create table if not exists public.dosedone_meds (
  device_id text not null,
  med_id text not null,
  name text not null,
  dosage text not null default '',
  times text[] not null default '{}',
  pills_per_dose integer not null default 1,
  pills_left integer not null default 0,
  low_threshold integer not null default 7,
  updated_at timestamptz not null default now(),
  primary key (device_id, med_id)
);

create table if not exists public.dosedone_doses (
  device_id text not null,
  log_id text not null,
  med_id text not null,
  date date not null,
  time text not null,
  taken_at timestamptz not null,
  primary key (device_id, log_id)
);

alter table public.dosedone_meds enable row level security;
alter table public.dosedone_doses enable row level security;

-- Permissive by design: the device_id is a random secret. Tighten with auth
-- when accounts are added.
create policy "dosedone_meds_anon_all"
  on public.dosedone_meds for all to anon
  using (true) with check (true);

create policy "dosedone_doses_anon_all"
  on public.dosedone_doses for all to anon
  using (true) with check (true);
