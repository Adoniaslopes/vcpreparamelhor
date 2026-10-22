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
