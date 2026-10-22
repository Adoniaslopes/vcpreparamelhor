/* Disciplinas da 1ª fase do Exame de Ordem (FGV) — distribuição das 80 questões
   observada nos exames recentes (o edital não fixa a quantidade; revisar a cada edital).
   Grupo A = 6 a 8 questões · Grupo B = 4 a 5 · Grupo C = 2 ("pontos rápidos"). */
window.OAB = window.OAB || {};
OAB.EXAME = { nome: '48º Exame de Ordem', data: '2027-01-10', corte: 40, total: 80 };
OAB.DISC = [
  { id: 'etica',  nome: 'Ética Profissional',            curto: 'Ética',        q: 8, g: 'A', cor: '#E8B931' },
  { id: 'civil',  nome: 'Direito Civil',                 curto: 'Civil',        q: 6, g: 'A', cor: '#4C8DFF' },
  { id: 'pcivil', nome: 'Direito Processual Civil',      curto: 'Proc. Civil',  q: 6, g: 'A', cor: '#2EC4B6' },
  { id: 'const',  nome: 'Direito Constitucional',        curto: 'Constitucional', q: 6, g: 'A', cor: '#FF6B6B' },
  { id: 'penal',  nome: 'Direito Penal',                 curto: 'Penal',        q: 6, g: 'A', cor: '#B678FF' },
  { id: 'ppenal', nome: 'Direito Processual Penal',      curto: 'Proc. Penal',  q: 6, g: 'A', cor: '#FF9F43' },
  { id: 'adm',    nome: 'Direito Administrativo',        curto: 'Administrativo', q: 5, g: 'B', cor: '#5AD07A' },
  { id: 'trab',   nome: 'Direito do Trabalho',           curto: 'Trabalho',     q: 5, g: 'B', cor: '#F368E0' },
  { id: 'ptrab',  nome: 'Direito Processual do Trabalho', curto: 'Proc. Trabalho', q: 5, g: 'B', cor: '#C56CF0' },
  { id: 'trib',   nome: 'Direito Tributário',            curto: 'Tributário',   q: 5, g: 'B', cor: '#48DBFB' },
  { id: 'emp',    nome: 'Direito Empresarial',           curto: 'Empresarial',  q: 4, g: 'B', cor: '#FECA57' },
  { id: 'dh',     nome: 'Direitos Humanos',              curto: 'Dir. Humanos', q: 2, g: 'C', cor: '#A3CB38' },
  { id: 'cdc',    nome: 'Direito do Consumidor',         curto: 'Consumidor',   q: 2, g: 'C', cor: '#12CBC4' },
  { id: 'eca',    nome: 'Estatuto da Criança e do Adolescente', curto: 'ECA',   q: 2, g: 'C', cor: '#FDA7DF' },
  { id: 'amb',    nome: 'Direito Ambiental',             curto: 'Ambiental',    q: 2, g: 'C', cor: '#009432' },
  { id: 'intl',   nome: 'Direito Internacional',         curto: 'Internacional', q: 2, g: 'C', cor: '#0652DD' },
  { id: 'filo',   nome: 'Filosofia do Direito',          curto: 'Filosofia',    q: 2, g: 'C', cor: '#9980FA' },
  { id: 'eleit',  nome: 'Direito Eleitoral',             curto: 'Eleitoral',    q: 2, g: 'C', cor: '#EE5A24' },
  { id: 'fin',    nome: 'Direito Financeiro',            curto: 'Financeiro',   q: 2, g: 'C', cor: '#1289A7' },
  { id: 'prev',   nome: 'Direito Previdenciário',        curto: 'Previdenciário', q: 2, g: 'C', cor: '#D980FA' }
];
OAB.GRUPOS = {
  A: { nome: 'Grupo A — as que decidem a prova', cor: '#E8B931' },
  B: { nome: 'Grupo B — o meio-campo', cor: '#4C8DFF' },
  C: { nome: 'Grupo C — pontos rápidos', cor: '#5AD07A' }
};
/* Os 5 passos do Método Aprovação OAB */
OAB.PASSOS = [
  { n: 1, nome: 'Conheça seu inimigo', txt: 'Resolva as provas anteriores antes de qualquer teoria. A banca repete temas, estilos e pegadinhas.' },
  { n: 2, nome: 'Estatuto todos os dias', txt: 'Ética são 8 questões e a matéria mais previsível da prova. Lei 8.906/94 e Código de Ética, um pouco por dia, sem falhar.' },
  { n: 3, nome: '4 disciplinas de domínio', txt: 'Você não precisa saber tudo. Escolha 4 disciplinas de peso em que tem afinidade e torne-se forte nelas.' },
  { n: 4, nome: 'Resumos inteligentes', txt: 'Uma página por tema, com o que a banca cobra. Revisar a sinopse vale mais que reler o livro.' },
  { n: 5, nome: 'Grave o que estudou', txt: 'Explique em áudio, com suas palavras, o tema do dia. Ouça no trânsito, na fila, antes de dormir.' }
];
