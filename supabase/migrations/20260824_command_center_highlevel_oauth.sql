create table if not exists public.command_center_highlevel_oauth (
  scope_key text primary key,
  location_id text unique,
  company_id text,
  access_token_ciphertext text not null,
  refresh_token_ciphertext text not null,
  token_expires_at timestamptz not null,
  scope text,
  user_type text not null check (user_type in ('Company', 'Location')),
  app_id text,
  version_id text,
  status text not null default 'connected' check (status in ('connected', 'error', 'revoked')),
  last_error text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists command_center_highlevel_oauth_company_idx
  on public.command_center_highlevel_oauth (company_id);

create table if not exists public.command_center_highlevel_webhooks (
  webhook_id text primary key,
  event_type text not null,
  location_id text,
  received_at timestamptz not null default now()
);

alter table public.command_center_highlevel_oauth enable row level security;
alter table public.command_center_highlevel_webhooks enable row level security;
revoke all on public.command_center_highlevel_oauth from anon, authenticated;
revoke all on public.command_center_highlevel_webhooks from anon, authenticated;
