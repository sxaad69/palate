-- Pip: habit_events table. Local-first app; server table is the backup/sync
-- target. Deny-all RLS; all access via the `habits` edge function with the
-- service-role key (never from the client).

create table if not exists public.habit_events (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  recipe_id text not null,
  event_date date not null,
  kind text not null default 'completed'
    check (kind in ('completed', 'shrunk')),
  created_at timestamptz not null default now(),
  unique (device_id, recipe_id, event_date, kind)
);

create index if not exists habit_events_device_idx
  on public.habit_events (device_id, event_date desc);

alter table public.habit_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'habit_events'
  ) then
    create policy "deny all" on public.habit_events
      for all using (false) with check (false);
  end if;
end $$;
