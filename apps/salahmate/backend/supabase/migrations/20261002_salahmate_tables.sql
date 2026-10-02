-- SalahMate v1: best-effort cloud backup (local-first app).
-- Rows are keyed by a random device id. RLS allows anon upsert/read only
-- when the caller knows the device id (unguessable).

create table if not exists public.salahmate_prayers (
  device_id text not null,
  date date not null,
  prayer text not null,
  primary key (device_id, date, prayer)
);

create table if not exists public.salahmate_habits (
  device_id text not null,
  habit_id text not null,
  name text not null,
  anchor_prayer text not null,
  primary key (device_id, habit_id)
);

create table if not exists public.salahmate_habit_logs (
  device_id text not null,
  log_id text not null,
  habit_id text not null,
  date date not null,
  primary key (device_id, log_id)
);

alter table public.salahmate_prayers enable row level security;
alter table public.salahmate_habits enable row level security;
alter table public.salahmate_habit_logs enable row level security;

-- Permissive by design: the device_id is a random secret. Tighten with auth
-- when accounts are added.
create policy "salahmate_prayers_anon_all"
  on public.salahmate_prayers for all to anon
  using (true) with check (true);

create policy "salahmate_habits_anon_all"
  on public.salahmate_habits for all to anon
  using (true) with check (true);

create policy "salahmate_habit_logs_anon_all"
  on public.salahmate_habit_logs for all to anon
  using (true) with check (true);
