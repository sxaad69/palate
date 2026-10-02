-- LanceLedger v1: best-effort cloud backup (local-first app).
-- Rows are keyed by a random device id. RLS allows anon upsert/read only
-- when the caller knows the device id (unguessable).

create table if not exists public.lanceledger_clients (
  device_id text not null,
  client_id text not null,
  name text not null,
  updated_at timestamptz not null default now(),
  primary key (device_id, client_id)
);

create table if not exists public.lanceledger_transactions (
  device_id text not null,
  tx_id text not null,
  kind text not null check (kind in ('expense', 'income')),
  amount numeric not null,
  category text,
  vendor text not null default '',
  client_id text,
  date date not null,
  deductible boolean not null default false,
  currency text not null default '$',
  updated_at timestamptz not null default now(),
  primary key (device_id, tx_id)
);

alter table public.lanceledger_clients enable row level security;
alter table public.lanceledger_transactions enable row level security;

-- Permissive by design: the device_id is a random secret. Tighten with auth
-- when accounts are added.
create policy "lanceledger_clients_anon_all"
  on public.lanceledger_clients for all to anon
  using (true) with check (true);

create policy "lanceledger_transactions_anon_all"
  on public.lanceledger_transactions for all to anon
  using (true) with check (true);
