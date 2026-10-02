-- Fernly: plants + plant_events. Local-first app; server tables are the
-- backup/sync target keyed by device_id. Deny-all RLS; all access via the
-- `fernly` edge function with the service-role key (never from the client).

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  plant_id text not null,
  species_id text not null,
  nickname text not null default '',
  adopted_at_ms bigint not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  unique (device_id, plant_id)
);

create table if not exists public.plant_events (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  event_id text not null,
  plant_id text not null,
  type text not null check (type in ('water','fertilize','mist')),
  at_ms bigint not null,
  created_at timestamptz not null default now(),
  unique (device_id, event_id)
);

create index if not exists plants_device_idx on public.plants (device_id);
create index if not exists plant_events_device_idx
  on public.plant_events (device_id, at_ms desc);

alter table public.plants enable row level security;
alter table public.plant_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plants'
  ) then
    create policy "deny all" on public.plants
      for all using (false) with check (false);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plant_events'
  ) then
    create policy "deny all" on public.plant_events
      for all using (false) with check (false);
  end if;
end $$;
