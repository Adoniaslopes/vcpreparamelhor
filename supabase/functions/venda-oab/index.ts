// Recebe o aviso de venda da Hotmart ou da Hubla e libera o acesso à plataforma Método Aprovação OAB sozinho.
// Publicação: Supabase > Edge Functions > nova função "venda-oab" (desligar "Verify JWT", pois quem chama é a plataforma de pagamento).
// Segredos (Edge Functions > Secrets):
//   VENDA_CHAVE         palavra secreta que vai no fim da URL do webhook (?chave=...)
//   HOTMART_HOTTOK      (opcional) o "hottok" mostrado na Hotmart > Ferramentas > Webhook
//   SITE_OAB            endereço da plataforma, ex.: https://adoniaslopes.github.io/vcpreparamelhor/oab/
//   PRODUTOS_2FASES     (opcional) códigos de produto/oferta do plano 1ª + 2ª fase, separados por vírgula
// URL para cadastrar no webhook: https://<projeto>.supabase.co/functions/v1/venda-oab?chave=<VENDA_CHAVE>
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const SITE = Deno.env.get('SITE_OAB') || 'https://adoniaslopes.github.io/vcpreparamelhor/oab/';
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });

// procura um valor em vários caminhos possíveis (Hotmart e Hubla mandam formatos diferentes)
function pega(o: any, caminhos: string[]): string {
  for (const c of caminhos) {
    const v = c.split('.').reduce((a: any, k) => (a == null ? undefined : a[k]), o);
    if (v != null && v !== '' && typeof v !== 'object') return String(v);
  }
  return '';
}

const LIBERA = /(PURCHASE_APPROVED|PURCHASE_COMPLETE|APPROVED|COMPLETE|PAID|PAGO|APROVAD|NEWSALE|SALE_APPROVED|INVOICE_PAID|SUBSCRIPTION_ACTIVATED)/i;
const NEGA = /(UNPAID|NOT_PAID|WAITING|PENDING|EXPIRED|OVERDUE|DISAPPROV|REFUSED|RECUSAD|DECLIN|BILLET_PRINTED)/i;
const BLOQUEIA = /(REFUND|CHARGEBACK|CANCEL|REEMBOLS|ESTORN|PROTEST|DISPUTE)/i;

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (req.method !== 'POST') return json({ ok: true, info: 'venda-oab ativa' });

  // 1) segurança: só aceita quem conhece a chave
  const chave = Deno.env.get('VENDA_CHAVE');
  if (!chave || url.searchParams.get('chave') !== chave) return json({ erro: 'não autorizado' }, 401);

  let corpo: any = {};
  try { corpo = await req.json(); } catch { return json({ erro: 'corpo inválido' }, 400); }

  const hottok = Deno.env.get('HOTMART_HOTTOK');
  const tokRecebido = req.headers.get('x-hotmart-hottok') || corpo.hottok || '';
  const ehHotmart = !!tokRecebido || /^PURCHASE_/.test(corpo.event || '');
  if (ehHotmart && hottok && tokRecebido !== hottok) return json({ erro: 'hottok inválido' }, 401);

  // 2) lê os dados da compra
  const origem = ehHotmart ? 'hotmart' : 'hubla';
  const evento = pega(corpo, ['event', 'type', 'evento', 'event.type', 'data.purchase.status', 'status', 'data.status', 'event.invoice.status']);
  const status = pega(corpo, ['data.purchase.status', 'status', 'data.status', 'event.invoice.status', 'event.status']);
  const email = pega(corpo, ['data.buyer.email', 'buyer.email', 'event.userEmail', 'event.user.email', 'event.payer.email', 'event.invoice.payer.email',
    'data.customer.email', 'customer.email', 'payer.email', 'user.email', 'email']).trim().toLowerCase();
  const nome = pega(corpo, ['data.buyer.name', 'buyer.name', 'event.userName', 'event.user.name', 'event.payer.name', 'event.invoice.payer.name',
    'data.customer.name', 'customer.name', 'payer.name', 'user.name', 'name']);
  const transacao = pega(corpo, ['data.purchase.transaction', 'transaction', 'event.invoice.id', 'event.transactionId', 'data.id', 'id']);
  const produto = [pega(corpo, ['data.product.id', 'product.id', 'event.product.id', 'event.groupId', 'data.product.ucode']),
    pega(corpo, ['data.purchase.offer.code', 'offer.code', 'event.offer.id', 'event.invoice.offerId'])].filter(Boolean);

  const ids2 = (Deno.env.get('PRODUTOS_2FASES') || '').split(',').map((s) => s.trim()).filter(Boolean);
  const plano = produto.some((p) => ids2.includes(p)) ? '2fases' : '1fase';
  const sinal = evento + ' ' + status;

  const log = async (resultado: string) => {
    await admin.from('vendas_log').insert({ origem, evento: sinal.trim(), email, resultado, corpo });
  };

  if (!email) { await log('sem e-mail no aviso'); return json({ ok: true, ignorado: 'sem e-mail' }); }

  // 3) reembolso, cancelamento ou chargeback: corta o acesso
  if (BLOQUEIA.test(sinal)) {
    await admin.from('acessos_oab').update({ status: 'cancelado', atualizado_em: new Date().toISOString() }).eq('email', email);
    await log('acesso cancelado');
    return json({ ok: true, acesso: 'cancelado' });
  }

  // 4) compra aprovada: libera o acesso e manda o e-mail para criar a senha
  if (LIBERA.test(sinal) && !NEGA.test(sinal)) {
    const atual = await admin.from('acessos_oab').select('plano').eq('email', email).maybeSingle();
    const planoFinal = atual.data?.plano === '2fases' ? '2fases' : plano; // nunca rebaixa quem já tem as duas fases
    const up = await admin.from('acessos_oab').upsert({ email, nome: nome || null, plano: planoFinal, status: 'ativo', origem, transacao: transacao || null,
      atualizado_em: new Date().toISOString() }, { onConflict: 'email' });
    if (up.error) { await log('erro ao gravar: ' + up.error.message); return json({ erro: up.error.message }, 500); }

    // cria o login se o comprador ainda não tiver conta (e-mail já confirmado, pois veio do checkout)
    const cria = await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: { nome } });
    const novo = !cria.error;
    if (cria.error && !/already|registered|exists/i.test(cria.error.message)) { await log('erro ao criar login: ' + cria.error.message); }

    // e-mail com o link para criar a senha (usa o modelo "Reset password" do Supabase)
    let enviou = 'não';
    if (novo) {
      const r = await admin.auth.resetPasswordForEmail(email, { redirectTo: SITE });
      enviou = r.error ? 'falhou: ' + r.error.message : 'sim';
    }
    await log('acesso liberado (' + planoFinal + ') · login ' + (novo ? 'criado' : 'já existia') + ' · e-mail de senha: ' + enviou);
    return json({ ok: true, acesso: 'ativo', plano: planoFinal, novo });
  }

  await log('evento ignorado');
  return json({ ok: true, ignorado: sinal });
});
