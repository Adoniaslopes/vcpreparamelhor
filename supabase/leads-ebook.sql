-- Leads do e-book gratuito "Chega de Reprovar" (formulário da página /oab/vendas/).
-- Rode uma vez no Supabase: SQL Editor > New query > cole tudo > Run.
create table if not exists public.leads_ebook (
  id bigint generated always as identity primary key,
  nome text,
  email text,
  origem text,
  criado_em timestamptz default now()
);

alter table public.leads_ebook enable row level security;

-- qualquer visitante pode se cadastrar (só inserir; ninguém de fora consegue ler a lista)
drop policy if exists "visitante cadastra" on public.leads_ebook;
create policy "visitante cadastra" on public.leads_ebook
  for insert to anon, authenticated with check (true);

-- o administrador (perfis.admin = true) vê todos os leads
drop policy if exists "admin le leads ebook" on public.leads_ebook;
create policy "admin le leads ebook" on public.leads_ebook
  for select to authenticated using (
    exists (select 1 from public.perfis p where p.id = auth.uid() and p.admin)
  );

-- Para ver os leads: Table Editor > leads_ebook (ordene por criado_em).
