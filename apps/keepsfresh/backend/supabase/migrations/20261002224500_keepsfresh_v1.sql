-- KeepsFresh v1: local-first. This schema reserves the cloud shape for
-- future household sharing (shared pantry lists across family devices);
-- the app works fully offline on AsyncStorage.
-- Nothing writes here in v1 (no edge function needed — YAGNI).

create table households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table pantry_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade,
  device_id text not null,
  name text not null,
  category text not null,
  location text not null,
  expiry date not null,
  qty numeric not null default 1,
  price_usd numeric,
  added_at timestamptz not null default now()
);

create index pantry_items_household_idx on pantry_items (household_id, expiry);
create index pantry_items_device_idx on pantry_items (device_id, expiry);

alter table households enable row level security;
alter table pantry_items enable row level security;
-- Service role only (future edge functions). No anonymous access in v1.
