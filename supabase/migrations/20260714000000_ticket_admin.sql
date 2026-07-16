alter table public.tickets add column if not exists updated_at timestamptz not null default now();
alter table public.tickets add column if not exists assigned_admin uuid references auth.users(id);

alter table public.tickets drop constraint if exists tickets_status_check;
alter table public.tickets add constraint tickets_status_check
  check (status in ('aberto', 'em_atendimento', 'resolvido', 'cancelado'));

create table if not exists public.ticket_replies (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  author_role text not null check (author_role in ('admin', 'client')),
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists ticket_replies_ticket_id_idx on public.ticket_replies(ticket_id);

alter table public.ticket_replies enable row level security;
grant select on public.ticket_replies to authenticated;
grant all on public.ticket_replies to service_role;

drop policy if exists "Clients read replies of own tickets" on public.ticket_replies;
create policy "Clients read replies of own tickets" on public.ticket_replies
  for select to authenticated
  using (exists (
    select 1 from public.tickets t
    where t.id = ticket_replies.ticket_id and t.owner_id = (select auth.uid())
  ));
