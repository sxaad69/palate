-- ScrubDeck v1: best-effort cloud backup (local-first app).
-- Rows are keyed by a random device id. RLS allows anon upsert/read only
-- when the caller knows the device id (unguessable).

create table if not exists public.scrubdeck_progress (
  device_id text not null,
  card_id text not null,
  ease double precision not null default 2.5,
  interval_days integer not null default 0,
  next_due bigint not null default 0,
  reps integer not null default 0,
  attempts integer not null default 0,
  last_rating smallint,
  primary key (device_id, card_id)
);

create table if not exists public.scrubdeck_custom_decks (
  device_id text not null,
  deck_id text not null,
  title text not null,
  primary key (device_id, deck_id)
);

create table if not exists public.scrubdeck_custom_cards (
  device_id text not null,
  card_id text not null,
  deck_id text not null,
  front text not null,
  back text not null,
  primary key (device_id, card_id)
);

alter table public.scrubdeck_progress enable row level security;
alter table public.scrubdeck_custom_decks enable row level security;
alter table public.scrubdeck_custom_cards enable row level security;

-- Permissive by design: the device_id is a random secret. Tighten with auth
-- when accounts are added.
create policy "scrubdeck_progress_anon_all"
  on public.scrubdeck_progress for all to anon
  using (true) with check (true);

create policy "scrubdeck_custom_decks_anon_all"
  on public.scrubdeck_custom_decks for all to anon
  using (true) with check (true);

create policy "scrubdeck_custom_cards_anon_all"
  on public.scrubdeck_custom_cards for all to anon
  using (true) with check (true);
