-- Portais compartilhados e propostas. Execute no projeto Supabase vinculado.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'partner' check (role in ('partner', 'client', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_number text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  customer_email text not null,
  customer_name text,
  generator_kva integer,
  commercial_model text,
  investment numeric,
  proposal_content text not null,
  created_at timestamptz not null default now()
);
create index if not exists proposals_owner_id_idx on public.proposals(owner_id);

alter table public.profiles enable row level security;
alter table public.proposals enable row level security;
grant usage on schema public to service_role;
grant all privileges on table public.profiles, public.proposals to service_role;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select
  to authenticated using ((select auth.uid()) = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update
  to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Clients read own proposals" on public.proposals;
create policy "Clients read own proposals" on public.proposals for select
  to authenticated using ((select auth.uid()) = owner_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', ''),
    coalesce(new.raw_app_meta_data ->> 'role', 'partner')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
