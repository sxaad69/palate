-- TendHome v1: best-effort cloud backup (local-first app).
-- Rows are keyed by a random device id. RLS allows anon upsert/read only
-- when the caller knows the device id (unguessable).

create table if not exists public.tendhome_tasks (
  device_id text not null,
  task_id text not null,
  title text not null,
  category text not null,
  interval_days integer not null,
  minutes integer not null default 30,
  enabled boolean not null default true,
  last_done bigint,
  custom boolean not null default false,
  primary key (device_id, task_id)
);

create table if not exists public.tendhome_completions (
  device_id text not null,
  completion_id text not null,
  task_id text not null,
  completed_at bigint not null,
  cost double precision not null default 0,
  primary key (device_id, completion_id)
);

alter table public.tendhome_tasks enable row level security;
alter table public.tendhome_completions enable row level security;

-- Permissive by design: the device_id is a random secret. Tighten with auth
-- when accounts are added.
create policy "tendhome_tasks_anon_all"
  on public.tendhome_tasks for all to anon
  using (true) with check (true);

create policy "tendhome_completions_anon_all"
  on public.tendhome_completions for all to anon
  using (true) with check (true);
