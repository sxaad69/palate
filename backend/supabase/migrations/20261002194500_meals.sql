-- Persistent meal log. One row per logged plate-group.
-- device_id is the client-supplied identifier (same as scan_ledger);
-- no auth yet, so only the service role touches this table.
create table meals (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  dish_id text,
  name_en text not null,
  name_ar text,
  cuisine text,
  region text,
  meal_type text,
  tags text[] not null default '{}',
  allergens text[] not null default '{}',
  plates numeric not null default 1,
  portion_g int,
  calories int not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  fiber_g numeric,
  sodium_mg numeric,
  logged_date date not null,
  created_at timestamptz not null default now()
);

create index meals_device_date_idx on meals (device_id, logged_date desc);

alter table meals enable row level security;
-- No anonymous access: only the service role (edge functions) touches this.
