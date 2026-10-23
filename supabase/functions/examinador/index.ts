// Examinador IA da plataforma: corrige discursivas pelo espelho da banca e explica questões erradas.
// Publicação: Supabase > Edge Functions > examinador. Segredo necessário: ANTHROPIC_API_KEY.
// A chave fica só no servidor; o site chama esta função com o login do aluno.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const MODELO = Deno.env.get('EXAMINADOR_MODELO') || 'claude-sonnet-5-5';
const BUCKET = 'conteudo';
const LIMITE = { discursiva: 6, questao: 40, analise: 4, chat: 40 }; // por aluno, por dia (administradores sem limite)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const URL_SB = Deno.env.get('SUPABASE_URL')!;
const admin = createClient(URL_SB, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

// conteúdo do cargo, guardado em memória enquanto a função estiver aquecida
const cache = new Map<string, { at: number; data: any }>();
async function arquivo(pasta: string, nome: string) {
  const k = (pasta ? pasta + '/' : '') + nome;
  const c = cache.get(k);
  if (c && Date.now() - c.at < 10 * 60 * 1000) return c.data;
  const r = await admin.storage.from(BUCKET).download(k);
  if (r.error) throw new Error('Conteúdo não encontrado: ' + k);
  const data = JSON.parse(await r.data.text());
  cache.set(k, { at: Date.now(), data });
  return data;
}

async function claude(system: string, user: string, tool: any, maxTokens = 3000) {
  // saída estruturada (JSON Schema) — formato recomendado pela API para os modelos atuais
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODELO, max_tokens: maxTokens,
      system, messages: [{ role: 'user', content: user }],
      output_config: { format: { type: 'json_schema', schema: tool.input_schema } },
    }),
  });
  if (!r.ok) throw new Error('IA indisponível (' + r.status + '): ' + (await r.text()).slice(0, 300));
  const out = await r.json();
  if (out.stop_reason === 'max_tokens') throw new Error('Resposta da IA ficou longa demais; tente de novo.');
  const blk = (out.content || []).find((b: any) => b.type === 'text');
  if (!blk) throw new Error('Resposta da IA sem conteúdo.');
  let dados: any;
  try { dados = JSON.parse(blk.text); } catch { throw new Error('Resposta da IA fora do formato esperado.'); }
  return { dados, uso: out.usage };
}

const lista = { type: 'array', items: { type: 'string' } };

// ---------- discursiva ----------
const TOOL_DISC = {
  name: 'registrar_correcao',
  description: 'Registra a correção da resposta discursiva, tópico por tópico.',
  input_schema: {
    type: 'object',
    properties: {
      topicos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            nota: { type: 'number', description: 'Nota do tópico, de 0 ao valor indicado para o tópico (múltiplos de 0,25; em tópicos de valor menor que 0,25, use múltiplos de 0,05).' },
            aproveitado: { ...lista, description: 'O que a resposta acertou neste tópico (ideias e fundamentos corretos), em frases curtas.' },
            errado: { ...lista, description: 'Afirmações juridicamente incorretas ou contrárias ao espelho, explicando o erro.' },
            faltou: { ...lista, description: 'Ideias ou dispositivos do espelho que não apareceram.' },
            melhorar: { ...lista, description: 'Orientações práticas e específicas para a próxima versão.' },
          },
          required: ['nota', 'aproveitado', 'errado', 'faltou', 'melhorar'],
          additionalProperties: false,
        },
      },
      forma: { ...lista, description: 'Observações sobre estrutura, clareza, norma-padrão, extensão e fundamentação.' },
      roteiro: {
        type: 'array',
        description: 'Roteiro passo a passo de como responder ESTE caso para tirar nota máxima, na ordem ideal, como um professor guiando o aluno ("Comece pela competência…", "Depois aponte…"). 4 a 7 passos.',
        items: { type: 'object', properties: { passo: { type: 'string', description: 'Título curto e imperativo do passo.' }, como: { type: 'string', description: 'O que escrever nesse passo, em 1 a 3 frases.' }, fundamento: { type: 'string', description: 'Dispositivo, súmula ou tese a citar nesse passo (ou vazio).' } }, required: ['passo', 'como', 'fundamento'], additionalProperties: false },
      },
      paragrafo_exemplo: { type: 'string', description: 'Reescrita de UM trecho fraco da resposta do aluno mostrando como ficaria no padrão de nota máxima (máx. 6 linhas).' },
      comentario_geral: { type: 'string', description: 'Parecer do examinador em 2 a 4 frases, em tom de instrutor.' },
    },
    required: ['topicos', 'forma', 'roteiro', 'paragrafo_exemplo', 'comentario_geral'],
    additionalProperties: false,
  },
};
const SYS_DISC = `Você é examinador de provas discursivas jurídicas de concursos públicos, no padrão da banca indicada.
Corrija a resposta do candidato EXCLUSIVAMENTE pelo espelho de correção fornecido, tópico por tópico.
Regras:
- Cada tópico vale o valor indicado. Atribua nota proporcional ao que foi efetivamente escrito e fundamentado. Ideia correta escrita com outras palavras vale; palavra-chave solta sem raciocínio não vale.
- Conclusão contrária ao espelho zera a parte correspondente do tópico.
- Fundamentação (artigo, súmula, tese) conta pontos quando o espelho a exige; citação errada de dispositivo deve ser apontada.
- Não invente entendimento diferente do espelho. Se a resposta trouxer tese alternativa juridicamente defensável que o espelho admite, considere.
- Texto acima do limite máximo de linhas é desconsiderado no excedente.
- Linguagem: português do Brasil, direta, técnica e encorajadora, como um instrutor que quer a aprovação do aluno.
- Responda no formato JSON pedido. Uma entrada em "topicos" para cada tópico, na mesma ordem.`;

async function corrigeDiscursiva(pasta: string, id: string, resposta: string, banca: string) {
  const rows = await arquivo(pasta, 'discursivas.json');
  const r = (rows as any[]).find((x) => x.id === id);
  if (!r) throw new Error('Caso não encontrado.');
  const vale = Number(r.pontos) || 2.5;
  const valores: number[] = Array.isArray(r.valores) && r.valores.length === r.topicos.length ? r.valores.map((v: any) => Number(v) || vale) : r.topicos.map(() => vale);
  const pecaTxt = r.peca_correta ? `\nPEÇA CABÍVEL (se o candidato fizer outra peça, a peça é inadequada e os tópicos de conteúdo valem zero): ${r.peca_correta}` : '';
  const user = `BANCA: ${banca || 'Cesgranrio'}
CASO: ${r.titulo}
${r.caso}

COMANDO: ${r.comando}
TÓPICOS (com o valor de cada um):
${r.topicos.map((t: string, i: number) => `${i + 1}. ${t} — vale ${valores[i]} ponto(s)`).join('\n')}${pecaTxt}
LIMITE: ${r.linhas_min} a ${r.linhas_max} linhas.

ESPELHO DE CORREÇÃO:
${r.espelho.map((t: string, i: number) => `Tópico ${i + 1}: ${t}`).join('\n')}

RESPOSTA-MODELO (referência de nota máxima):
${r.modelo}

RESPOSTA DO CANDIDATO:
"""
${resposta}
"""`;
  const { dados, uso } = await claude(SYS_DISC, user, TOOL_DISC, 7000);
  const passo = r.valores ? 0.05 : 0.25;
  const q = (v: number, max: number) => Math.round(Math.max(0, Math.min(max, Number(v) || 0)) / passo) * passo;
  const topicos = (dados.topicos || []).slice(0, r.topicos.length).map((t: any, i: number) => ({ ...t, nota: q(t.nota, valores[i]) }));
  while (topicos.length < r.topicos.length) topicos.push({ nota: 0, aproveitado: [], errado: [], faltou: ['Tópico não avaliado.'], melhorar: [] });
  return { ...dados, topicos, vale, valores, uso };
}

// ---------- questão objetiva ----------
const TOOL_Q = {
  name: 'registrar_explicacao',
  description: 'Explica ao aluno por que errou a questão.',
  input_schema: {
    type: 'object',
    properties: {
      por_que_errou: { type: 'string', description: 'Por que a alternativa marcada está errada e qual raciocínio provavelmente levou a ela.' },
      por_que_certa: { type: 'string', description: 'Por que a alternativa do gabarito está correta.' },
      pegadinha: { type: 'string', description: 'A armadilha típica da banca nesta questão, em uma frase.' },
      fundamento: { type: 'string', description: 'Dispositivo legal, súmula ou tese que resolve a questão, com a ideia central da norma.' },
      dica: { type: 'string', description: 'Uma dica curta de memorização ou de técnica para não errar de novo.' },
    },
    required: ['por_que_errou', 'por_que_certa', 'pegadinha', 'fundamento', 'dica'],
    additionalProperties: false,
  },
};
const SYS_Q = `Você é professor de cursinho preparatório para concursos jurídicos e explica questões objetivas a um aluno que errou.
O gabarito oficial informado é definitivo: explique a partir dele e do comentário fornecido, sem contradizê-los. Se tiver forte dúvida sobre o gabarito, diga apenas que a questão é controversa e recomende conferir a lei.
Seja objetivo e didático, em português do Brasil, no máximo 120 palavras por campo. Não invente números de artigos: use os do comentário ou só cite os que tiver certeza.`;

async function explicaQuestao(pasta: string, id: string, marcada: string) {
  const ck = `q:${pasta}:${id}:${marcada}`;
  const c = await admin.from('ia_cache').select('resposta').eq('chave', ck).maybeSingle();
  if (c.data) return { ...c.data.resposta, cache: true };
  const rows = await arquivo(pasta, 'questoes.json');
  const q = (rows as any[]).find((x) => x.id === id);
  if (!q) throw new Error('Questão não encontrada.');
  const alts = ['A', 'B', 'C', 'D', 'E'].filter((l) => q[l.toLowerCase()]).map((l) => `${l}) ${q[l.toLowerCase()]}`).join('\n');
  const user = `DISCIPLINA: ${q.disciplina} · ${q.tema}
ENUNCIADO:
${q.enunciado}

${alts}

GABARITO OFICIAL: ${q.gabarito}
ALTERNATIVA MARCADA PELO ALUNO: ${marcada}
COMENTÁRIO DO BANCO: ${q.comentario || '(sem comentário)'}`;
  const { dados } = await claude(SYS_Q, user, TOOL_Q, 2500);
  await admin.from('ia_cache').upsert({ chave: ck, resposta: dados });
  return dados;
}

// ---------- inglês: ajuda de leitura para quem não domina o idioma ----------
const VOC = { type: 'array', items: { type: 'object', properties: { en: { type: 'string' }, pt: { type: 'string' } }, required: ['en', 'pt'], additionalProperties: false } };
const SCH_ING: Record<string, any> = {
  antes: {
    type: 'object',
    properties: {
      vocabulario: { ...VOC, description: '15 a 25 palavras ou expressões-chave do texto e das alternativas, com o significado em português no contexto.' },
      pergunta_pt: { type: 'string', description: 'Tradução da pergunta (último comando do enunciado).' },
      alternativas_pt: { type: 'array', items: { type: 'object', properties: { letra: { type: 'string' }, pt: { type: 'string' } }, required: ['letra', 'pt'], additionalProperties: false } },
      como_procurar: { type: 'string', description: 'Em qual parágrafo e por quais palavras procurar a resposta, SEM dizer qual alternativa é a correta.' },
    },
    required: ['vocabulario', 'pergunta_pt', 'alternativas_pt', 'como_procurar'], additionalProperties: false,
  },
  depois: {
    type: 'object',
    properties: {
      traducao: { type: 'string', description: 'Tradução fiel do texto completo para o português, mantendo os parágrafos (separe com \\n).' },
      trecho_chave: { type: 'string', description: 'O trecho em inglês do texto que responde à questão, copiado literalmente.' },
      explicacao: { type: 'string', description: 'Por que esse trecho leva ao gabarito, em português simples, para quem não sabe inglês.' },
      tecnica: { type: 'string', description: 'Técnica de prova para resolver esse tipo de questão sem dominar o inglês (cognatos, conectores, referência, ideia principal etc.).' },
    },
    required: ['traducao', 'trecho_chave', 'explicacao', 'tecnica'], additionalProperties: false,
  },
};
const SYS_ING = `Você é professor de inglês instrumental para concursos (banca Cesgranrio) e ajuda um aluno brasileiro que quase não sabe inglês a ler textos de prova.
Responda em português do Brasil, simples e direto. O gabarito oficial informado é definitivo.
No modo "antes", nunca revele nem insinue qual alternativa é a correta: só dê vocabulário, traduções neutras e onde procurar.`;

async function ajudaIngles(pasta: string, id: string, modo: string) {
  const m = modo === 'depois' ? 'depois' : 'antes';
  const ck = `ing:${pasta}:${id}:${m}`;
  const c = await admin.from('ia_cache').select('resposta').eq('chave', ck).maybeSingle();
  if (c.data) return { ...c.data.resposta, cache: true };
  const rows = await arquivo(pasta, 'questoes.json');
  const q = (rows as any[]).find((x) => x.id === id);
  if (!q) throw new Error('Questão não encontrada.');
  const alts = ['A', 'B', 'C', 'D', 'E'].filter((l) => q[l.toLowerCase()]).map((l) => `${l}) ${q[l.toLowerCase()]}`).join('\n');
  const user = `MODO: ${m}
ENUNCIADO (texto e pergunta):
${q.enunciado}

${alts}
${m === 'depois' ? `\nGABARITO OFICIAL: ${q.gabarito}\nCOMENTÁRIO: ${q.comentario || ''}` : ''}`;
  const { dados } = await claude(SYS_ING, user, { input_schema: SCH_ING[m] }, m === 'depois' ? 7000 : 3500);
  await admin.from('ia_cache').upsert({ chave: ck, resposta: dados });
  return dados;
}

// ---------- roteiro de resposta (antes de escrever) ----------
const SCH_ROT = {
  type: 'object',
  properties: {
    leitura: { type: 'string', description: 'O que o caso realmente pergunta, em 2 frases simples.' },
    roteiro: TOOL_DISC.input_schema.properties.roteiro,
    estrutura: { type: 'string', description: 'Como distribuir as linhas: introdução, um parágrafo por tópico, conclusão (com nº aproximado de linhas).' },
    armadilhas: { type: 'array', items: { type: 'string' }, description: 'Erros comuns dos candidatos neste caso.' },
  },
  required: ['leitura', 'roteiro', 'estrutura', 'armadilhas'], additionalProperties: false,
};
async function roteiroDiscursiva(pasta: string, id: string, banca: string) {
  const ck = `rot:${pasta}:${id}`;
  const c = await admin.from('ia_cache').select('resposta').eq('chave', ck).maybeSingle();
  if (c.data) return { ...c.data.resposta, cache: true };
  const rows = await arquivo(pasta, 'discursivas.json');
  const r = (rows as any[]).find((x) => x.id === id);
  if (!r) throw new Error('Caso não encontrado.');
  const user = `BANCA: ${banca || 'Cesgranrio'}\nCASO: ${r.titulo}\n${r.caso}\n\nCOMANDO: ${r.comando}\nTÓPICOS:\n${r.topicos.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')}\nLIMITE: ${r.linhas_min} a ${r.linhas_max} linhas.\n\nESPELHO:\n${r.espelho.map((t: string, i: number) => `Tópico ${i + 1}: ${t}`).join('\n')}`;
  const sys = `Você é examinador e professor de discursivas jurídicas. Monte um roteiro de resposta passo a passo, guiando o aluno como um professor ao lado dele ("Comece pela competência…, depois aponte…, feche com…"). Baseie-se no espelho, sem copiar a resposta-modelo. Português do Brasil, direto.`;
  const { dados } = await claude(sys, user, { input_schema: SCH_ROT }, 5000);
  await admin.from('ia_cache').upsert({ chave: ck, resposta: dados });
  return dados;
}

// ---------- conversa com o instrutor ----------
async function claudeTexto(system: string, messages: any[], maxTokens = 2500) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODELO, max_tokens: maxTokens, system, messages }),
  });
  if (!r.ok) throw new Error('IA indisponível (' + r.status + '): ' + (await r.text()).slice(0, 300));
  const out = await r.json();
  return (out.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n').trim();
}
async function contextoChat(pasta: string, ctx: any) {
  if (!ctx || typeof ctx !== 'object') return '';
  if (ctx.tipo === 'discursiva' && ctx.id) {
    const rows = await arquivo(pasta, 'discursivas.json');
    const r = (rows as any[]).find((x) => x.id === ctx.id);
    if (r) return `CONTEXTO: o aluno respondeu a uma discursiva.\nCASO: ${r.titulo}\n${r.caso}\nCOMANDO: ${r.comando}\nTÓPICOS: ${r.topicos.join(' | ')}\nESPELHO: ${r.espelho.map((t: string, i: number) => `(${i + 1}) ${t}`).join(' ')}\nRESPOSTA DO ALUNO: <<<${String(ctx.resposta || '').slice(0, 6000)}>>>\nCORREÇÃO JÁ FEITA (resumo): ${String(ctx.correcao || '').slice(0, 3000)}`;
  }
  if (ctx.tipo === 'questao' && ctx.id) {
    const rows = await arquivo(pasta, 'questoes.json');
    const q = (rows as any[]).find((x) => x.id === ctx.id);
    if (q) return `CONTEXTO: questão objetiva que o aluno está estudando.\n${q.disciplina} · ${q.tema}\n${q.enunciado}\n${['a', 'b', 'c', 'd', 'e'].filter((l) => q[l]).map((l) => `${l.toUpperCase()}) ${q[l]}`).join('\n')}\nGABARITO OFICIAL: ${q.gabarito}\nO ALUNO MARCOU: ${ctx.marcada || '-'}\nCOMENTÁRIO: ${q.comentario || ''}`;
  }
  if (ctx.tipo === 'geral') return 'CONTEXTO: dados de desempenho do aluno (JSON): ' + JSON.stringify(ctx.dados || {}).slice(0, 8000);
  return '';
}
const SYS_CHAT = `Você é o instrutor pessoal do aluno numa plataforma de preparação para concursos jurídicos (banca indicada no contexto, em geral Cesgranrio).
Converse como um professor experiente ao lado do aluno: claro, encorajador, objetivo, em português do Brasil.
- Responda à dúvida com base no contexto fornecido (espelho, gabarito oficial, dados do aluno). O gabarito oficial e o espelho são a referência.
- Quando o aluno pedir como fazer algo, dê um passo a passo numerado.
- Cite dispositivos legais só quando tiver segurança; se não tiver, diga para conferir na lei.
- Respostas curtas (até ~200 palavras), salvo se o aluno pedir mais detalhe. Termine, quando fizer sentido, com uma pergunta ou sugestão de próximo passo.
- Não use tabelas nem títulos com #; use parágrafos curtos e listas numeradas.
- Não faça a prova pelo aluno: em discursivas novas, oriente e corrija, sem entregar o texto pronto completo.`;

// ---------- instrutor: análise do diagnóstico e plano ----------
const SCH_DIAG = {
  type: 'object',
  properties: {
    resumo: { type: 'string', description: 'Leitura do momento do aluno em 3 a 5 frases, em tom de instrutor, falando diretamente com ele (você).' },
    riscos: { type: 'array', items: { type: 'string' }, description: 'Riscos de eliminação pelas regras do edital, com números. Vazio se não houver.' },
    pontos_fortes: { type: 'array', items: { type: 'string' } },
    prioridades: {
      type: 'array',
      description: '3 a 6 prioridades em ordem, considerando peso na prova e desempenho.',
      items: { type: 'object', properties: { disciplina: { type: 'string' }, assunto: { type: 'string' }, por_que: { type: 'string' }, como: { type: 'string' } }, required: ['disciplina', 'assunto', 'por_que', 'como'], additionalProperties: false },
    },
    semana: {
      type: 'array',
      description: 'Plano dos próximos 7 dias, um item por dia, respeitando as horas por dia do aluno.',
      items: { type: 'object', properties: { dia: { type: 'string' }, foco: { type: 'string' }, tarefas: { type: 'string' } }, required: ['dia', 'foco', 'tarefas'], additionalProperties: false },
    },
    meta: { type: 'string', description: 'Meta mensurável para o próximo diagnóstico ou simulado.' },
    mensagem: { type: 'string', description: 'Frase final de incentivo, sincera e concreta.' },
  },
  required: ['resumo', 'riscos', 'pontos_fortes', 'prioridades', 'semana', 'meta', 'mensagem'],
  additionalProperties: false,
};
const SYS_DIAG = `Você é o instrutor pessoal de um candidato a concurso público e acompanha o aluno do diagnóstico até a prova.
Analise os dados de desempenho fornecidos (não invente números) junto com as regras e os pesos da prova, e oriente o aluno.
Prioridades: 1) não ser eliminado (mínimos do edital, não zerar disciplinas básicas); 2) ganhar pontos onde a prova tem mais questões e o aluno erra mais; 3) consolidar pontos fortes.
Seja direto, prático e humano, em português do Brasil, falando com o aluno (você). Use os nomes de disciplinas e assuntos como vieram nos dados.`;

async function analisaDiagnostico(dados: any) {
  const user = 'DADOS DO ALUNO (JSON):\n' + JSON.stringify(dados).slice(0, 12000);
  const { dados: out } = await claude(SYS_DIAG, user, { input_schema: SCH_DIAG }, 9000);
  return out;
}

// ---------- entrada ----------
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const auth = req.headers.get('Authorization') || '';
    const u = await admin.auth.getUser(auth.replace(/^Bearer\s+/i, ''));
    if (u.error || !u.data.user) return json({ erro: 'Faça login para usar o examinador.' }, 401);
    const uid = u.data.user.id;
    const p = await admin.from('perfis').select('status, expira_em, admin').eq('id', uid).maybeSingle();
    const hoje = new Date().toISOString().slice(0, 10);
    const ehAdmin = !!p.data?.admin;
    const body = await req.json();
    const pastaReq = String(body.pasta || '');
    let liberado = !!p.data && p.data.status === 'aprovado' && !(p.data.expira_em && p.data.expira_em < hoje);
    if (pastaReq.startsWith('oab')) {
      // plataforma da OAB: vale a compra registrada em acessos_oab; a 2ª fase exige o plano das duas fases
      const ac = await admin.from('acessos_oab').select('status, plano').eq('email', String(u.data.user.email || '').toLowerCase()).maybeSingle();
      if (!ac.error && ac.data) liberado = ac.data.status === 'ativo' && (pastaReq !== 'oab-2fase' || ac.data.plano === '2fases');
    }
    if (!ehAdmin && !liberado) return json({ erro: 'Acesso não liberado para este recurso.' }, 403);

    const tipo = ['questao', 'ingles', 'diagnostico', 'roteiro', 'chat'].includes(body.tipo) ? body.tipo : 'discursiva';
    const pasta = String(body.pasta || '').replace(/[^a-z0-9_-]/gi, '');

    // limite diário por aluno
    if (body.tipo === 'status') return json({ ok: true, ativo: !!Deno.env.get('ANTHROPIC_API_KEY') });
    const us = await admin.from('ia_uso').select('n_disc, n_quest, n_chat').eq('user_id', uid).eq('dia', hoje).maybeSingle();
    const nd = us.data?.n_disc || 0, nq = us.data?.n_quest || 0, nc = us.data?.n_chat || 0;
    if (!ehAdmin && tipo === 'chat' && nc >= LIMITE.chat) return json({ erro: `Limite diário de ${LIMITE.chat} mensagens com o instrutor atingido. Amanhã libera de novo.`, limite: true }, 429);
    if (!ehAdmin && tipo === 'discursiva' && nd >= LIMITE.discursiva) return json({ erro: `Limite diário de ${LIMITE.discursiva} correções pelo examinador atingido. Amanhã libera de novo.`, limite: true }, 429);
    if (!ehAdmin && tipo === 'diagnostico' && nd >= LIMITE.discursiva + LIMITE.analise) return json({ erro: 'Limite diário de análises atingido. Amanhã libera de novo.', limite: true }, 429);
    if (!ehAdmin && ['questao', 'ingles', 'roteiro'].includes(tipo) && nq >= LIMITE.questao) return json({ erro: `Limite diário de ${LIMITE.questao} explicações atingido. Amanhã libera de novo.`, limite: true }, 429);

    let out: any;
    if (tipo === 'discursiva') {
      const resposta = String(body.resposta || '').slice(0, 9000);
      if (resposta.trim().length < 80) return json({ erro: 'Resposta muito curta para correção.' }, 400);
      out = await corrigeDiscursiva(pasta, String(body.id), resposta, String(body.banca || ''));
    } else if (tipo === 'chat') {
      const ctxTxt = await contextoChat(pasta, body.ctx);
      const msgs = (Array.isArray(body.msgs) ? body.msgs : []).slice(-12).map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 3000) })).filter((m: any) => m.content);
      if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return json({ erro: 'Mensagem vazia.' }, 400);
      out = { resposta: await claudeTexto(SYS_CHAT + (ctxTxt ? '\n\n' + ctxTxt : ''), msgs) };
    } else if (tipo === 'roteiro') {
      out = await roteiroDiscursiva(pasta, String(body.id), String(body.banca || ''));
    } else if (tipo === 'diagnostico') {
      out = await analisaDiagnostico(body.dados || {});
    } else if (tipo === 'ingles') {
      out = await ajudaIngles(pasta, String(body.id), String(body.modo || 'antes'));
    } else {
      out = await explicaQuestao(pasta, String(body.id), String(body.marcada || '').toUpperCase().slice(0, 1));
    }
    if (!out.cache) await admin.from('ia_uso').upsert({ user_id: uid, dia: hoje, n_disc: nd + (tipo === 'discursiva' || tipo === 'diagnostico' ? 1 : 0), n_quest: nq + (['questao', 'ingles', 'roteiro'].includes(tipo) ? 1 : 0), n_chat: nc + (tipo === 'chat' ? 1 : 0) });
    return json({ ok: true, ...out });
  } catch (e) {
    return json({ erro: String((e as Error).message || e) }, 500);
  }
});
