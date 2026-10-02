-- StraightUp v1: local-first. This schema reserves the cloud shape for
-- future cross-device sync; the app works fully offline on AsyncStorage
-- (photos stay in the app document directory, never uploaded).
-- Nothing writes here in v1 (no edge function needed — YAGNI).

create table posturecheck_checks (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  score int not null check (score between 0 and 100),
  angles jsonb not null,
  observations jsonb not null,
  provider_id text not null default 'manual-v1',
  photo_storage_path text,
  created_at timestamptz not null default now()
);

create index posturecheck_checks_device_idx on posturecheck_checks (device_id, created_at desc);

create table posturecheck_exercise_log (
  device_id text not null,
  exercise_id text not null,
  completed_at timestamptz not null default now(),
  primary key (device_id, exercise_id, completed_at)
);

alter table posturecheck_checks enable row level security;
alter table posturecheck_exercise_log enable row level security;
-- Service role only (future edge functions). No anonymous access in v1.
