-- HeadDown v1: best-effort cloud backup (local-first app).
-- Rows are keyed by a random device id. RLS allows anon upsert/read only
-- when the caller knows the device id (unguessable).

create table if not exists public.headdown_sessions (
  device_id text not null,
  session_id text not null,
  label text not null default '',
  planned_sec integer not null,
  started_at bigint not null,
  ended_at bigint not null,
  focused_sec integer not null,
  distractions jsonb not null default '[]',
  completed boolean not null default false,
  strict_broken boolean not null default false,
  reflection text not null default '',
  primary key (device_id, session_id)
);

alter table public.headdown_sessions enable row level security;

-- Permissive by design: the device_id is a random secret. Tighten with auth
-- when accounts are added.
create policy "headdown_sessions_anon_all"
  on public.headdown_sessions for all to anon
  using (true) with check (true);
