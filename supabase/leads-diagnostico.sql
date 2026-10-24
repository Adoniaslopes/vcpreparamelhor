-- Leads do diagnóstico gratuito (página /oab/diagnostico/).
-- Rode uma vez no Supabase: SQL Editor > New query > cole tudo > Run.
-- Cada pessoa que se cadastra no diagnóstico gratuito vira uma linha aqui, com o WhatsApp e a nota.

create table if not exists public.leads_diagnostico (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  email text,
  whatsapp text,
  aceite_contato boolean default false,
  origem text,
  respondidas int default 0,
  nota int,
  concluido_em timestamptz,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

alter table public.leads_diagnostico enable row level security;

-- a própria pessoa cria e atualiza a sua linha (e só a sua)
drop policy if exists "lead grava a propria linha" on public.leads_diagnostico;
create policy "lead grava a propria linha" on public.leads_diagnostico
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "lead atualiza a propria linha" on public.leads_diagnostico;
create policy "lead atualiza a propria linha" on public.leads_diagnostico
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "lead le a propria linha" on public.leads_diagnostico;
create policy "lead le a propria linha" on public.leads_diagnostico
  for select to authenticated using (id = auth.uid());

-- o administrador (perfis.admin = true) vê todos os leads
drop policy if exists "admin le leads" on public.leads_diagnostico;
create policy "admin le leads" on public.leads_diagnostico
  for select to authenticated using (
    exists (select 1 from public.perfis p where p.id = auth.uid() and p.admin)
  );

-- Para ver os leads: Table Editor > leads_diagnostico (ordene por criado_em).
