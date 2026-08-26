create table if not exists public.command_center_ai_reviews (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  location_id text not null,
  conversation_id text not null,
  contact_id text not null default '',
  contract_version text not null,
  suggestion_version text not null,
  suggestion_hash text not null,
  provider text,
  mode text,
  status text not null check (status in ('proposed', 'approved', 'rejected', 'dismissed', 'expired')),
  summary text not null,
  next_action text not null,
  draft text not null,
  edited_draft text,
  risk_flags jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  context_completeness text not null check (context_completeness in ('complete', 'bounded', 'failed')),
  context_message_count integer not null default 0 check (context_message_count >= 0),
  context_limit integer check (context_limit is null or context_limit > 0),
  created_by_user_id text not null,
  created_by_email text not null,
  decision_by_user_id text,
  decision_by_email text,
  decision_at timestamptz,
  draft_version integer not null default 1 check (draft_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists command_center_ai_reviews_location_idx
  on public.command_center_ai_reviews (location_id, created_at desc);

create index if not exists command_center_ai_reviews_conversation_idx
  on public.command_center_ai_reviews (conversation_id, created_at desc);

create table if not exists public.command_center_ai_review_events (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.command_center_ai_reviews(id),
  idempotency_key text not null unique,
  location_id text not null,
  conversation_id text not null,
  contact_id text not null default '',
  event_type text not null check (event_type in ('suggestion_created', 'draft_edited', 'approved', 'rejected', 'dismissed', 'expired')),
  status text not null check (status in ('proposed', 'approved', 'rejected', 'dismissed', 'expired')),
  actor_user_id text not null,
  actor_email text not null,
  draft_version integer not null check (draft_version > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists command_center_ai_review_events_review_idx
  on public.command_center_ai_review_events (review_id, created_at asc);

alter table public.command_center_ai_reviews enable row level security;
alter table public.command_center_ai_review_events enable row level security;

revoke all on public.command_center_ai_reviews from anon, authenticated;
revoke all on public.command_center_ai_review_events from anon, authenticated;

create or replace function public.prevent_command_center_ai_review_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'command center AI review events are append-only';
end;
$$;

drop trigger if exists command_center_ai_review_event_append_only
  on public.command_center_ai_review_events;
create trigger command_center_ai_review_event_append_only
before update or delete on public.command_center_ai_review_events
for each row execute function public.prevent_command_center_ai_review_event_mutation();
