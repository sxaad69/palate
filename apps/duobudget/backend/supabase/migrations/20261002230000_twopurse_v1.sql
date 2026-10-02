-- TwoPurse v1 — partner cloud-sync schema (RESERVED, no reads/writes in v1).
--
-- v1 is single-device: everything lives in AsyncStorage. This schema reserves
-- the insertion point for v2 partner sync: a household joined via a short
-- share code, envelopes + expenses mirrored per household.
--
-- v2 plan (documented, not built): on "link partner" the device creates a
-- household row, shows the join_code; the partner's device joins with the
-- code, then both devices upsert envelopes/expenses with device_id stamps and
-- last-write-wins merge. RLS policies get added then — see note below.

create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  join_code text not null unique,      -- short code shown to the partner, e.g. "MAPLE-4821"
  name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  label text not null,                 -- display name ("me" / "partner")
  device_id text not null,             -- opaque per-device id, no PII
  created_at timestamptz not null default now(),
  unique (household_id, device_id)
);

create table if not exists envelopes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  name text not null,
  monthly_amount numeric(12,2) not null default 0,
  kind text not null default 'joint' check (kind in ('joint','mine','theirs')),
  color text not null default '#C1613B',
  rollover boolean not null default true,
  is_savings boolean not null default false,
  position integer not null default 0,
  archived boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by_device text
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  envelope_id uuid not null references envelopes(id) on delete cascade,
  amount numeric(12,2) not null,
  spender text not null default 'me' check (spender in ('me','partner')),
  note text not null default '',
  spent_at timestamptz not null default now(),
  device_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_envelopes_household on envelopes(household_id);
create index if not exists idx_expenses_household on expenses(household_id);
create index if not exists idx_expenses_envelope on expenses(envelope_id);
create index if not exists idx_expenses_spent_at on expenses(spent_at);

-- RLS is ON with no permissive policies: deny-all until v2 ships the
-- join-code auth model (policy: member can read/write only rows of
-- households they belong to, proven by device_id + join_code claim).
alter table households enable row level security;
alter table household_members enable row level security;
alter table envelopes enable row level security;
alter table expenses enable row level security;
