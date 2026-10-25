// E-book gratuito "Chega de Reprovar": recebe nome e e-mail da página de vendas,
// grava o lead no Supabase e envia o e-book por e-mail (Brevo).
// Variáveis no Cloudflare Pages (Settings > Variables and Secrets):
//   BREVO_API_KEY    chave de API da Brevo (tipo Secret)
//   EBOOK_REMETENTE  e-mail remetente verificado na Brevo (ex.: contato@lopesaraujoadvogado.com)
// Sem essas variáveis, a página continua funcionando: o lead é gravado e a pessoa baixa o e-book na hora.
const SB_URL = 'https://nzzgfxctuulmudztfdab.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56emdmeGN0dXVsbXVkenRmZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Mjk2NzUsImV4cCI6MjEwNzQwNTY3NX0.fMTVwtQNLWvwPwg6bvN0WNq8uQnGKhRhWD4fcknX7Sw';
const PDF = '/oab/vendas/ebook-chega-de-reprovar.pdf';

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false, erro: 'Dados inválidos.' }, 400); }
  const link = new URL(PDF, request.url).toString();
  if (d.site) return json({ ok: true, enviado: false, link }); // robô (campo invisível preenchido)

  const nome = String(d.nome || '').trim().slice(0, 80);
  const email = String(d.email || '').trim().toLowerCase().slice(0, 120);
  const origem = String(d.origem || 'vendas').trim().slice(0, 60);
  if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, erro: 'Preencha o seu nome e um e-mail válido.' }, 400);
  }

  // 1) grava o lead (se a tabela ainda não existir, segue sem travar)
  try {
    await fetch(SB_URL + '/rest/v1/leads_ebook', {
      method: 'POST',
      headers: { apikey: ANON, Authorization: 'Bearer ' + ANON, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ nome, email, origem })
    });
  } catch (e) { /* sem tabela ou Supabase fora: não impede a entrega */ }

  // 2) envia o e-mail com o e-book
  if (!env.BREVO_API_KEY || !env.EBOOK_REMETENTE) return json({ ok: true, enviado: false, link });
  const primeiro = esc(nome.split(/\s+/)[0]);
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#1C2131;max-width:560px">
    <p>Olá, ${primeiro}!</p>
    <p>Aqui está o seu e-book gratuito <b>Chega de Reprovar</b>, do Método Aprovação OAB.</p>
    <p style="margin:28px 0"><a href="${link}" style="background:#F5C542;color:#1A1404;padding:14px 26px;border-radius:999px;text-decoration:none;font-weight:bold">Baixar o e-book (PDF)</a></p>
    <p>Quer saber quanto falta para os 40 acertos? Faça o diagnóstico gratuito de 80 questões e veja o seu resultado na hora:<br>
    <a href="${new URL('/oab/diagnostico/?utm_source=ebook&utm_medium=email', request.url)}">Fazer o diagnóstico gratuito</a></p>
    <p>Bons estudos,<br>Adonias Lopes de Araújo<br>Advogado · OAB/GO 50.607</p>
  </div>`;
  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Método Aprovação OAB', email: env.EBOOK_REMETENTE },
        to: [{ email, name: nome }],
        subject: 'Seu e-book: Chega de Reprovar',
        htmlContent: html
      })
    });
    return json({ ok: true, enviado: r.ok, link });
  } catch (e) {
    return json({ ok: true, enviado: false, link });
  }
}

export async function onRequest() {
  return json({ ok: false, erro: 'Use o formulário da página.' }, 405);
}
