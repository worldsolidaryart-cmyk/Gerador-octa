create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text,
  email text,
  bill_value numeric,
  stage text not null default 'leads' check (stage in ('leads', 'proposal', 'negotiation', 'closed', 'implantação')),
  assigned_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;
grant all on public.leads to service_role;
-- Sem policy para "authenticated": só os endpoints de admin (service_role) tocam nessa tabela.
