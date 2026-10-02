-- Purchase ledger for server-side receipt verification.
-- provisional=true rows were accepted before the Play Developer API service
-- account was wired; they need reconciliation once verification is live.
create table purchase_ledger (
  purchase_token text primary key,
  product_id text not null,
  platform text not null default 'android',
  verified boolean not null default false,
  provisional boolean not null default true,
  expiry_ms bigint,
  created_at timestamptz not null default now()
);

alter table purchase_ledger enable row level security;
-- No anonymous access: only the service role (edge functions) touches this.
