-- Palate v1: curated dish nutrition + free-scan anti-abuse ledger

create table dishes (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text,
  region text,
  cuisine text,
  serving_size_g int not null default 100,
  calories int not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  fiber_g numeric,
  sodium_mg numeric,
  tags text[] not null default '{}'
);
create index dishes_name_en_idx on dishes (name_en);

create table scan_ledger (
  device_id text primary key,
  free_scans_used int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table dishes enable row level security;
alter table scan_ledger enable row level security;

-- Curated data is public read; only the service-role edge function writes.
create policy "dishes public read" on dishes for select using (true);
-- scan_ledger: no anon/authenticated access; service_role bypasses RLS.
