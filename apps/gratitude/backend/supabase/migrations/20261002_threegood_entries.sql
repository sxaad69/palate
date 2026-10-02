-- ThreeGood (gratitude journal) — entries schema.
-- Reserved for future cloud sync. v1 is local-first (AsyncStorage);
-- NO reads/writes against this table yet, no edge function (YAGNI).

create table if not exists threegood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null,
  items jsonb not null default '[]'::jsonb,   -- exactly 3 gratitude strings
  prompt_ids text[] not null default '{}',     -- prompt ids shown that day
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table threegood_entries enable row level security;

create policy "users manage own entries"
  on threegood_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
