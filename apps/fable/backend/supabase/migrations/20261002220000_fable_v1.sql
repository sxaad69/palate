-- Fable v1: local-first. This schema reserves the cloud shape for
-- future cross-device sync; the app works fully offline on AsyncStorage.
-- Nothing writes here in v1 (no edge function needed — YAGNI).

create table fable_progress (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  session_id text not null,
  minutes int not null,
  completed_at timestamptz not null default now()
);

create index fable_progress_device_idx on fable_progress (device_id, completed_at desc);

create table fable_favorites (
  device_id text not null,
  session_id text not null,
  created_at timestamptz not null default now(),
  primary key (device_id, session_id)
);

alter table fable_progress enable row level security;
alter table fable_favorites enable row level security;
-- Service role only (future edge functions). No anonymous access in v1.
