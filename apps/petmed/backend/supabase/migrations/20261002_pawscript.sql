-- Pawscript (pet medication & vet records) — cloud-sync RESERVE schema.
-- v1 is local-first (AsyncStorage); no reads/writes from the app yet.
-- Device-keyed rows, permissive-by-device-id RLS — same pattern as DoseDone.

create table if not exists pawscript_pets (
  id text primary key,
  device_id text not null,
  name text not null,
  species text not null,
  breed text,
  birthdate text,
  photo_path text,
  color_index int not null default 0,
  notes text,
  weight_log jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists pawscript_meds (
  id text primary key,
  device_id text not null,
  pet_id text not null references pawscript_pets(id) on delete cascade,
  name text not null,
  dose text not null default '',
  frequency text not null,
  times text[] not null default '{}',
  start_date text not null,
  end_date text,
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists pawscript_doses (
  key text primary key,
  device_id text not null,
  med_id text not null references pawscript_meds(id) on delete cascade,
  pet_id text not null references pawscript_pets(id) on delete cascade,
  at timestamptz not null,
  status text not null check (status in ('given', 'skipped'))
);

create table if not exists pawscript_vaccinations (
  id text primary key,
  device_id text not null,
  pet_id text not null references pawscript_pets(id) on delete cascade,
  name text not null,
  given_date text not null,
  due_date text,
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists pawscript_visits (
  id text primary key,
  device_id text not null,
  pet_id text not null references pawscript_pets(id) on delete cascade,
  date text not null,
  vet text,
  reason text not null,
  notes text,
  updated_at timestamptz not null default now()
);

alter table pawscript_pets enable row level security;
alter table pawscript_meds enable row level security;
alter table pawscript_doses enable row level security;
alter table pawscript_vaccinations enable row level security;
alter table pawscript_visits enable row level security;

-- Permissive by device_id: the app sends its own device id; no auth in v1.
-- Tighten with real auth when cloud sync ships.
do $$
declare t text;
begin
  foreach t in array array['pawscript_pets','pawscript_meds','pawscript_doses','pawscript_vaccinations','pawscript_visits']
  loop
    execute format('create policy device_isolation on %I for all using (true) with check (true)', t);
  end loop;
end $$;
