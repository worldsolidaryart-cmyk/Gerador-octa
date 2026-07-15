create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  description text,
  category text not null default 'outros' check (category in ('manutenção', 'financeiro', 'técnico', 'outros')),
  status text not null default 'aberto' check (status in ('aberto', 'em_atendimento', 'resolvido')),
  created_at timestamptz not null default now()
);

alter table public.tickets enable row level security;

grant select, insert on public.tickets to authenticated;
grant all on public.tickets to service_role;

create policy "Clients read own tickets" on public.tickets
  for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Clients create own tickets" on public.tickets
  for insert to authenticated
  with check ((select auth.uid()) = owner_id);
