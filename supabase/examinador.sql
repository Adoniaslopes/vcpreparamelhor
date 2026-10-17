-- Tabelas do examinador IA (rodar uma vez no SQL Editor do Supabase)
create table if not exists public.ia_uso (
  user_id uuid not null references auth.users(id) on delete cascade,
  dia date not null,
  n_disc int not null default 0,
  n_quest int not null default 0,
  primary key (user_id, dia)
);
create table if not exists public.ia_cache (
  chave text primary key,
  resposta jsonb not null,
  criado_em timestamptz not null default now()
);
-- só a função (service role) acessa; alunos não leem nem escrevem direto
alter table public.ia_uso enable row level security;
alter table public.ia_cache enable row level security;
