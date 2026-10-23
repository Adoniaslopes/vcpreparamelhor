// Entrega o conteúdo da plataforma OAB só para quem está logado e tem acesso ativo.
// O aluno manda o token de login do Supabase; a função confere o usuário e o acesso antes de responder.
const SB_URL = 'https://nzzgfxctuulmudztfdab.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56emdmeGN0dXVsbXVkenRmZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Mjk2NzUsImV4cCI6MjEwNzQwNTY3NX0.fMTVwtQNLWvwPwg6bvN0WNq8uQnGKhRhWD4fcknX7Sw';
const PERMITIDOS = new Set(['q1', 'q2', 'q3', 'q4', 'sinopses', 'sinopses-ext1', 'sinopses-ext2', 'provas', 'fase2']);
const permitido = (n) => PERMITIDOS.has(n) || /^cad\d{2}$/.test(n);

const nega = (status) => new Response(status === 401 ? 'Faça login para acessar.' : 'Acesso não liberado para este e-mail.', {
  status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
});

export async function onRequestGet(ctx) {
  try { return await entregar(ctx); }
  catch (e) { return new Response('Servidor de login indisponível. Tente de novo em instantes.', { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
}

async function entregar({ request, params, env }) {
  const nome = String(params.arquivo || '').replace(/\.js$/, '');
  if (!permitido(nome)) return new Response('Não encontrado', { status: 404 });

  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return nega(401);
  const h = { apikey: ANON, Authorization: 'Bearer ' + token };

  const u = await fetch(SB_URL + '/auth/v1/user', { headers: h });
  if (!u.ok) return nega(401);
  const user = await u.json();
  const email = String(user.email || '').toLowerCase();

  const [pr, ac] = await Promise.all([
    fetch(`${SB_URL}/rest/v1/perfis?select=status,admin,expira_em&id=eq.${user.id}`, { headers: h }),
    fetch(`${SB_URL}/rest/v1/acessos_oab?select=status&email=eq.${encodeURIComponent(email)}`, { headers: h })
  ]);
  const perfil = pr.ok ? (await pr.json())[0] : null;
  let ok = !!(perfil && perfil.admin);
  if (!ok) {
    if (ac.ok) {
      const a = (await ac.json())[0];
      ok = !!(a && a.status === 'ativo');
    } else {
      // tabela de vendas ainda não criada: vale a liberação manual do perfil (mesma regra da plataforma)
      const hoje = new Date().toISOString().slice(0, 10);
      ok = !!(perfil && perfil.status === 'aprovado' && !(perfil.expira_em && perfil.expira_em < hoje));
    }
  }
  if (!ok) return nega(403);

  const r = await env.ASSETS.fetch(new URL('/oab/privado/' + nome + '.js', request.url));
  if (!r.ok) return new Response('Conteúdo indisponível', { status: 502 });
  return new Response(r.body, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'private, no-store' }
  });
}
