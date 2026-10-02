-- Naplet: baby_events. Local-first app; server table is the family-sync
-- target (keyed by family_code, a short code shared across caregiver phones).
-- Deny-all RLS; all access via the `naplet` edge function with the
-- service-role key (never from the client).

create table if not exists public.baby_events (
  id uuid primary key default gen_random_uuid(),
  family_code text not null,
  event_id text not null,
  kind text not null check (kind in ('sleep','feed','diaper')),
  start_ms bigint not null,
  end_ms bigint,
  feed_type text check (feed_type in ('breast','bottle','solid')),
  side text check (side in ('left','right','both')),
  amount_ml integer,
  diaper_type text check (diaper_type in ('wet','dirty','mixed')),
  note text,
  updated_at_ms bigint not null default 0,
  created_at timestamptz not null default now(),
  unique (family_code, event_id)
);

create index if not exists baby_events_family_idx
  on public.baby_events (family_code, start_ms desc);

alter table public.baby_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'baby_events'
  ) then
    create policy "deny all" on public.baby_events
      for all using (false) with check (false);
  end if;
end $$;
