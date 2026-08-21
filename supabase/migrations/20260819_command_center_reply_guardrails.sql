create table if not exists public.command_center_reply_ledger (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  location_id text not null,
  conversation_id text not null,
  contact_id text not null,
  actor_user_id text not null,
  actor_email text not null,
  channel text not null,
  body_hash text not null,
  body_length integer not null check (body_length between 1 and 2000),
  status text not null check (status in ('reserved', 'simulated', 'failed')),
  provider_message_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists command_center_reply_ledger_conversation_idx
  on public.command_center_reply_ledger (conversation_id, created_at desc);

create table if not exists public.command_center_reply_audit_events (
  id uuid primary key default gen_random_uuid(),
  ledger_id uuid references public.command_center_reply_ledger(id),
  idempotency_key text not null,
  event_type text not null,
  location_id text not null,
  conversation_id text not null,
  contact_id text not null,
  actor_user_id text not null,
  actor_email text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists command_center_reply_audit_events_ledger_idx
  on public.command_center_reply_audit_events (ledger_id, created_at asc);

alter table public.command_center_reply_ledger enable row level security;
alter table public.command_center_reply_audit_events enable row level security;

revoke all on public.command_center_reply_ledger from anon, authenticated;
revoke all on public.command_center_reply_audit_events from anon, authenticated;

create or replace function public.prevent_command_center_reply_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'command center reply audit events are append-only';
end;
$$;

drop trigger if exists command_center_reply_audit_append_only
  on public.command_center_reply_audit_events;
create trigger command_center_reply_audit_append_only
before update or delete on public.command_center_reply_audit_events
for each row execute function public.prevent_command_center_reply_audit_mutation();
