-- Restory v1: local-first. This schema reserves the cloud shape for
-- future cross-device journal sync; the app works fully offline on
-- AsyncStorage. Nothing writes here in v1 (no edge function — YAGNI).

create table restory_entries (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  entry_date date not null,
  mood int check (mood between 1 and 5),
  sleep_quality int check (sleep_quality between 1 and 5),
  bed_time text,
  wake_time text,
  note text,
  created_at timestamptz not null default now(),
  unique (device_id, entry_date)
);

create index restory_entries_device_idx on restory_entries (device_id, entry_date desc);

alter table restory_entries enable row level security;
-- Service role only (future edge functions). No anonymous access in v1.
