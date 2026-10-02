-- ModestFit cloud-sync reservation (v1 is local-only; no reads/writes).
-- Run order prefix keeps it first; safe to apply on a fresh project.

create table if not exists public.mf_pieces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name_en text not null,
  name_ar text not null default '',
  category text not null,
  color_key text not null,
  color_hex text not null,
  sleeve text not null,
  hem text not null,
  opacity text not null,
  occasions text[] not null default '{}',
  photo_path text,
  wear_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.mf_outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  piece_ids uuid[] not null default '{}',
  occasion text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mf_plan (
  user_id uuid not null,
  day date not null,
  outfit_id uuid references public.mf_outfits(id) on delete cascade,
  occasion text not null,
  worn boolean not null default false,
  primary key (user_id, day)
);

alter table public.mf_pieces enable row level security;
alter table public.mf_outfits enable row level security;
alter table public.mf_plan enable row level security;
-- RLS policies land with the auth/backend pass at launch (YAGNI for v1).
