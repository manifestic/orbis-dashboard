create table if not exists public.command_center_tenants (
  location_id text primary key,
  company_id text,
  client_name text not null,
  website_url text,
  logo_url text,
  primary_color text,
  accent_color text,
  ink_color text,
  muted_color text,
  onboarding_status text not null default 'pending'
    check (onboarding_status in ('pending', 'brand_review', 'ready')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists command_center_tenants_company_idx
  on public.command_center_tenants (company_id);

alter table public.command_center_tenants enable row level security;
revoke all on public.command_center_tenants from anon, authenticated;
