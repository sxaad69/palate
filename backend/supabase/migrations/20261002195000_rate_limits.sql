-- IP rate-limit buckets for edge functions (fixed 60s windows).
create table rate_limits (
  ip text not null,
  window_start timestamptz not null,
  count int not null default 1,
  primary key (ip, window_start)
);

alter table rate_limits enable row level security;
-- Service role only (edge functions).
