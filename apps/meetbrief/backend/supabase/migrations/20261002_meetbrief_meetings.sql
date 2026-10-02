-- MeetBrief cloud-sync schema (RESERVED — v1 is local-only).
--
-- This migration reserves the server-side shape for a future opt-in cloud
-- sync. The v1 app performs NO reads or writes against Supabase: recordings,
-- transcripts, notes and action items live in AsyncStorage + the app's
-- document directory on-device only (see privacy-policy.md). Do not add an
-- edge function or client calls until the launch checklist in BUILD_NOTES.md
-- explicitly asks for them (YAGNI).

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  recorded_at timestamptz not null default now(),
  duration_sec integer not null default 0 check (duration_sec >= 0),
  summary text not null default '',
  transcript text not null default '',
  notes text not null default '',
  hourly_rate numeric not null default 0 check (hourly_rate >= 0),
  cost numeric not null default 0 check (cost >= 0),
  audio_path text, -- storage object path; null until sync ships
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  text text not null default '',
  done boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists action_items_meeting_id_idx on public.action_items (meeting_id);
create index if not exists meetings_user_id_recorded_at_idx on public.meetings (user_id, recorded_at desc);

alter table public.meetings enable row level security;
alter table public.action_items enable row level security;

drop policy if exists "users manage own meetings" on public.meetings;
create policy "users manage own meetings" on public.meetings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own action items" on public.action_items;
create policy "users manage own action items" on public.action_items
  for all using (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  );
