-- CONFIGURAÇÃO COMPLETA DO MÉTODO APROVAÇÃO OAB (pode rodar mais de uma vez; não apaga nada)
-- Supabase > SQL Editor > New query > colar tudo > Run

-- ===== acessos-oab.sql =====
-- Acessos vendidos da plataforma Método Aprovação OAB (rodar uma vez no SQL Editor do Supabase)
-- Cada compra aprovada na Hotmart/Hubla grava uma linha aqui pela função "venda-oab".
-- Fica separado de perfis.status para que comprador da OAB não ganhe acesso à plataforma da Transpetro.
create table if not exists public.acessos_oab (
  email text primary key,                         -- sempre em minúsculas
  nome text,
  plano text not null default '1fase',            -- '1fase' ou '2fases'
  status text not null default 'ativo',           -- 'ativo' ou 'cancelado' (reembolso/chargeback)
  origem text,                                    -- 'hotmart', 'hubla' ou 'manual'
  transacao text,
  aprovado_1fase_em date,                         -- preenchido quando o aluno for aprovado na 1ª fase
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
alter table public.acessos_oab enable row level security;

-- o aluno só enxerga a própria linha (pelo e-mail do login)
drop policy if exists "aluno le o proprio acesso" on public.acessos_oab;
create policy "aluno le o proprio acesso" on public.acessos_oab
  for select using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- administradores (perfis.admin = true) leem e editam tudo
drop policy if exists "admin gerencia acessos" on public.acessos_oab;
create policy "admin gerencia acessos" on public.acessos_oab
  for all using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.admin))
  with check (exists (select 1 from public.perfis p where p.id = auth.uid() and p.admin));

-- registro bruto de cada aviso recebido (para conferir se algo der errado)
create table if not exists public.vendas_log (
  id bigint generated always as identity primary key,
  recebido_em timestamptz not null default now(),
  origem text,
  evento text,
  email text,
  resultado text,
  corpo jsonb
);
alter table public.vendas_log enable row level security;
drop policy if exists "admin le vendas" on public.vendas_log;
create policy "admin le vendas" on public.vendas_log
  for select using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.admin));

-- Liberar alguém manualmente (cortesia, venda por fora):
-- insert into public.acessos_oab (email, nome, plano, origem) values ('aluno@email.com', 'Nome', '1fase', 'manual')
--   on conflict (email) do update set status = 'ativo', atualizado_em = now();

-- ===== leads-diagnostico.sql =====
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

-- ============================================================
-- Garantia: todo cadastro do diagnóstico vira lead automaticamente,
-- mesmo que a pessoa feche a página logo depois de se cadastrar.
-- ============================================================
create or replace function public.novo_lead_diagnostico() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'origem', '') like 'diagnostico-gratis%' then
    insert into public.leads_diagnostico (id, nome, email, whatsapp, aceite_contato, origem, criado_em)
    values (new.id, new.raw_user_meta_data ->> 'nome', lower(new.email), new.raw_user_meta_data ->> 'whatsapp',
            coalesce((new.raw_user_meta_data ->> 'aceite_contato')::boolean, false), new.raw_user_meta_data ->> 'origem', new.created_at)
    on conflict (id) do nothing;
  end if;
  return new;
end $$;

drop trigger if exists ao_cadastrar_lead_diagnostico on auth.users;
create trigger ao_cadastrar_lead_diagnostico after insert on auth.users
  for each row execute function public.novo_lead_diagnostico();

-- Recupera quem se cadastrou antes de esta tabela existir
insert into public.leads_diagnostico (id, nome, email, whatsapp, aceite_contato, origem, criado_em)
select id, raw_user_meta_data ->> 'nome', lower(email), raw_user_meta_data ->> 'whatsapp',
       coalesce((raw_user_meta_data ->> 'aceite_contato')::boolean, false), raw_user_meta_data ->> 'origem', created_at
from auth.users where coalesce(raw_user_meta_data ->> 'origem', '') like 'diagnostico-gratis%'
on conflict (id) do nothing;

-- ============================================================
-- Lista pronta para contato (campanhas, WhatsApp, remarketing).
-- Mostra só quem aceitou contato e marca quem já tem acesso liberado (perfis.status = aprovado).
-- Para baixar: Table Editor > leads_para_contato > Export > CSV.
-- ============================================================
create or replace view public.leads_para_contato with (security_invoker = true) as
select l.nome, l.whatsapp, l.email, l.origem,
       l.respondidas, l.nota,
       case when l.concluido_em is not null then 'terminou'
            when coalesce(l.respondidas, 0) > 0 then 'parou no meio'
            else 'só se cadastrou' end as situacao,
       coalesce(p.status = 'aprovado' or p.admin, false) as comprou,
       l.criado_em, l.concluido_em
from public.leads_diagnostico l
left join public.perfis p on p.id = l.id
where l.aceite_contato
order by l.criado_em desc;

-- ===== leads-ebook.sql =====
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
