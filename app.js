/* Acesso: login, cadastro, aprovação, recuperação de senha, administração e carga do conteúdo. */
(function () {
  'use strict';
  var cfg = window.PET_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  var ARQS = ['questoes.json', 'materiais.json', 'trilhas.json', 'sinopses.json', 'discursivas.json', 'prova2023.json'];
  var BUCKET = 'conteudo';
  var NOME_PLAT = 'Plataforma de Estudos para Concursos da Petrobras e Transpetro';
  // cargo "Advogado(a) – Transpetro": o primeiro, cujos arquivos ficam na raiz do depósito
  var CARGO_LEGADO = {id: 'advogado-transpetro', nome: 'Advogado(a) Júnior', empresa: 'Transpetro', pasta: ''};
  var cargos = [], cargo = null;
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* ignora */ } }
  function caminho(c, nome) { return (c && c.pasta ? c.pasta + '/' : '') + nome; }
  function rotulo(c) { return c.nome + (c.empresa ? ' · ' + c.empresa : ''); }

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function views(name) {
    document.querySelectorAll('[data-view]').forEach(function (v) { v.hidden = v.dataset.view !== name; });
    $('topo').hidden = !(name === 'app' || name === 'admin' || name === 'cargos');
  }
  function msg(id, text, ok) { var m = $(id); m.textContent = text || ''; m.className = 'ac-msg' + (text ? (ok ? ' ok' : ' bad') : ''); }
  function contato() {
    return cfg.contato ? ' Se precisar de ajuda, fale com o administrador: ' + cfg.contato : '';
  }
  function traduz(e) {
    var m = String((e && (e.message || e.error_description)) || e || '');
    if (/Invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
    if (/Email not confirmed/i.test(m)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
    if (/already registered|already exists/i.test(m)) return 'Este e-mail já tem cadastro. Use “Entrar” ou “Esqueci minha senha”.';
    if (/Password should be at least|weak/i.test(m)) return 'A senha precisa ter pelo menos 8 caracteres.';
    if (/rate limit|too many/i.test(m)) return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.';
    if (/not authorized/i.test(m)) return 'Não foi possível enviar o e-mail agora.' + contato();
    if (/Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com o servidor. Verifique sua internet.';
    return 'Não foi possível concluir: ' + m;
  }

  if (!cfg.url || !cfg.anonKey || /COLE_AQUI/.test(cfg.url + cfg.anonKey)) { views('semconfig'); return; }

  var sb = window.supabase.createClient(cfg.url, cfg.anonKey, {auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true}});
  window.PET_SB = sb;
  var perfil = null, appIniciado = false, entrando = false;
  var recuperando = /type=recovery/.test(location.hash + location.search);

  // ---------- telas de acesso ----------
  document.querySelectorAll('[data-ir]').forEach(function (a) {
    a.addEventListener('click', function (ev) { ev.preventDefault(); ['login-msg', 'cad-msg', 'rec-msg'].forEach(function (m) { msg(m, ''); }); views(a.dataset.ir); });
  });

  $('form-login').addEventListener('submit', async function (ev) {
    ev.preventDefault(); var b = ev.submitter || this.querySelector('button'); b.disabled = true; msg('login-msg', 'Entrando…', true);
    var r = await sb.auth.signInWithPassword({email: $('login-email').value.trim(), password: $('login-senha').value});
    b.disabled = false;
    if (r.error) { msg('login-msg', traduz(r.error)); return; }
    msg('login-msg', '');
    entrar(r.data.session);
  });

  $('form-cad').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var nome = $('cad-nome').value.trim(), email = $('cad-email').value.trim(), s1 = $('cad-senha').value, s2 = $('cad-senha2').value;
    if (nome.length < 3) { msg('cad-msg', 'Informe seu nome completo.'); return; }
    if (s1.length < 8) { msg('cad-msg', 'A senha precisa ter pelo menos 8 caracteres.'); return; }
    if (s1 !== s2) { msg('cad-msg', 'As duas senhas não conferem.'); return; }
    var b = this.querySelector('button'); b.disabled = true; msg('cad-msg', 'Criando seu cadastro…', true);
    var r = await sb.auth.signUp({email: email, password: s1, options: {data: {nome: nome}, emailRedirectTo: location.origin + location.pathname}});
    b.disabled = false;
    if (r.error) { msg('cad-msg', traduz(r.error)); return; }
    if (r.data && r.data.user && Array.isArray(r.data.user.identities) && r.data.user.identities.length === 0) {
      msg('cad-msg', 'Este e-mail já tem cadastro. Use “Entrar” ou “Esqueci minha senha”.'); return;
    }
    if (!r.data.session) { msg('cad-msg', 'Cadastro recebido. Abra o e-mail que enviamos e clique no link de confirmação; depois aguarde a liberação do acesso.', true); return; }
    entrar(r.data.session);
  });

  $('form-rec').addEventListener('submit', async function (ev) {
    ev.preventDefault(); var b = this.querySelector('button'); b.disabled = true; msg('rec-msg', 'Enviando…', true);
    var r = await sb.auth.resetPasswordForEmail($('rec-email').value.trim(), {redirectTo: location.origin + location.pathname});
    b.disabled = false;
    if (r.error) { msg('rec-msg', traduz(r.error)); return; }
    msg('rec-msg', 'Se o e-mail estiver cadastrado, você vai receber um link para criar uma nova senha. Confira também a caixa de spam.' + contato(), true);
  });

  $('form-nova').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var s1 = $('nova-senha').value, s2 = $('nova-senha2').value;
    if (s1.length < 8) { msg('nova-msg', 'A senha precisa ter pelo menos 8 caracteres.'); return; }
    if (s1 !== s2) { msg('nova-msg', 'As duas senhas não conferem.'); return; }
    var r = await sb.auth.updateUser({password: s1});
    if (r.error) { msg('nova-msg', traduz(r.error)); return; }
    recuperando = false;
    msg('nova-msg', 'Senha alterada.', true);
    var s = await sb.auth.getSession(); entrar(s.data.session);
  });

  async function sair() {
    try { await sb.auth.signOut(); } catch (e) { /* ignora */ }
    location.replace(location.pathname);
  }
  document.querySelectorAll('[data-sair]').forEach(function (b) { b.addEventListener('click', sair); });

  // ---------- após o login ----------
  async function entrar(session) {
    if (!session || recuperando || entrando) return;
    entrando = true;
    window.PET_UID = session.user.id;
    var r = await sb.from('perfis').select('*').eq('id', session.user.id).maybeSingle();
    if (r.error || !r.data) {
      $('espera-titulo').textContent = 'Cadastro incompleto';
      $('espera-texto').textContent = 'Não encontramos seu perfil de aluno. ' + (r.error ? traduz(r.error) : '') + contato();
      views('espera'); return;
    }
    perfil = r.data;
    var hoje = new Date().toISOString().slice(0, 10);
    var vencido = perfil.expira_em && perfil.expira_em < hoje;
    if (!perfil.admin && (perfil.status !== 'aprovado' || vencido)) {
      var t = {pendente: ['Cadastro recebido', 'Seu acesso está aguardando liberação. Pode deixar esta página aberta: assim que o acesso for aprovado, a plataforma abre sozinha. Se fechar, basta entrar de novo com seu e-mail e senha.'],
               bloqueado: ['Acesso suspenso', 'Seu acesso à plataforma está suspenso.']}[perfil.status] || ['Acesso indisponível', ''];
      if (perfil.status === 'aprovado' && vencido) t = ['Acesso expirado', 'O prazo do seu acesso terminou em ' + new Date(perfil.expira_em + 'T12:00').toLocaleDateString('pt-BR') + '.'];
      $('espera-titulo').textContent = t[0];
      $('espera-texto').textContent = t[1] + contato();
      views('espera');
      // aguardando liberação: verifica a cada 15 s e entra sozinho assim que for aprovado
      if (perfil.status === 'pendente' && !window.__petEspera) {
        window.__petEspera = setInterval(async function () {
          var q = await sb.from('perfis').select('status, expira_em, admin').eq('id', session.user.id).maybeSingle();
          if (q.data && (q.data.admin || q.data.status === 'aprovado')) {
            clearInterval(window.__petEspera); window.__petEspera = null; entrando = false;
            var s = await sb.auth.getSession(); entrar(s.data.session || session);
          }
        }, 15000);
      }
      entrando = false; return;
    }
    $('topo-nome').textContent = perfil.nome || session.user.email;
    $('btn-admin').hidden = !perfil.admin;
    $('btn-app').hidden = true;
    if (perfil.admin) contarPendentes();
    await carregarCargos();
    var salvo = lsGet('pet-cargo-' + session.user.id);
    var esc = cargos.find(function (c) { return c.id === salvo; }) || (cargos.length === 1 ? cargos[0] : null);
    if (esc) abrirCargo(esc); else mostrarCargos();
  }

  // ---------- cargos ----------
  async function carregarCargos() {
    cargos = [];
    try {
      var r = await sb.storage.from(BUCKET).download('cargos.json');
      if (!r.error) { var l = JSON.parse(await r.data.text()); if (Array.isArray(l)) cargos = l.filter(function (c) { return c && c.id && c.nome; }); }
    } catch (e) { /* sem catálogo: usa o cargo original */ }
    if (!cargos.length) cargos = [Object.assign({}, CARGO_LEGADO)];
    if (!perfil.admin) cargos = cargos.filter(function (c) { return c.ativo !== false; }); // cargo sem conteúdo fica oculto para alunos
    cargos.forEach(function (c) { if (c.pasta == null) c.pasta = c.id === CARGO_LEGADO.id ? '' : c.id; });
  }
  // lista de áreas: Advogado(a) primeiro, as demais em ordem alfabética
  function ordenarAreas() {
    return cargos.slice().sort(function (x, y) {
      if (x.id === CARGO_LEGADO.id) return -1; if (y.id === CARGO_LEGADO.id) return 1;
      return rotulo(x).localeCompare(rotulo(y), 'pt-BR');
    });
  }
  function preencherArea(sel, atualId) {
    sel.replaceChildren();
    ordenarAreas().forEach(function (c) { sel.append(new Option(rotulo(c) + (c.ativo === false ? ' (sem conteúdo)' : ''), c.id)); });
    if (atualId && sel.querySelector('option[value="' + atualId + '"]')) sel.value = atualId;
  }
  function escolherCargo(id) {
    var c = cargos.find(function (x) { return x.id === id; }); if (!c) return;
    lsSet('pet-cargo-' + window.PET_UID, c.id);
    if (appIniciado) location.reload(); else abrirCargo(c);
  }
  function mostrarCargos() {
    preencherArea($('cg-cargo'), lsGet('pet-cargo-' + window.PET_UID));
    views('cargos');
  }
  $('cg-entrar').addEventListener('click', function () { escolherCargo($('cg-cargo').value); });
  $('a-abrir').addEventListener('click', function () {
    var id = $('a-cargo').value;
    if (cargo && id === cargo.id) return;
    escolherCargo(id);
  });
  function abrirCargo(c) {
    cargo = c; window.PET_CARGO = c.id;
    preencherArea($('a-cargo'), c.id);
    $('topo-cargo').textContent = rotulo(c);
    var t = document.getElementById('titulo'); if (t) t.textContent = NOME_PLAT;
    var h = document.getElementById('pe-head'); if (h) h.setAttribute('data-kicker', ((c.banca || 'Cesgranrio') + ' · ' + rotulo(c)).toUpperCase());
    document.title = c.nome + ' · ' + NOME_PLAT;
    views('app');
    iniciarApp();
  }

  // ---------- conteúdo ----------
  async function baixar(nome, versao) {
    var chave = 'https://pet-conteudo.local/' + nome + '?v=' + encodeURIComponent(versao || '0');
    var cache = null;
    try { cache = await caches.open('pet-conteudo-v1'); var hit = await cache.match(chave); if (hit) return await hit.json(); } catch (e) { cache = null; }
    var r = await sb.storage.from(BUCKET).download(nome);
    if (r.error) throw r.error;
    var txt = await r.data.text();
    var json = JSON.parse(txt);
    if (cache) {
      try {
        var velhas = await cache.keys();
        await Promise.all(velhas.filter(function (k) { return k.url.indexOf('.local/' + nome + '?') > -1; }).map(function (k) { return cache.delete(k); }));
        await cache.put(chave, new Response(txt, {headers: {'Content-Type': 'application/json'}}));
      } catch (e) { /* cache é só conveniência */ }
    }
    return json;
  }
  async function iniciarApp() {
    if (appIniciado) return; appIniciado = true;
    var versoes = {};
    try {
      var l = await sb.storage.from(BUCKET).list(cargo.pasta || '', {limit: 100});
      (l.data || []).forEach(function (f) { versoes[f.name] = f.updated_at || f.created_at || ''; });
    } catch (e) { /* segue sem versão */ }
    var faltando = ARQS.filter(function (n) { return !versoes[n]; });
    if (faltando.length === ARQS.length) {
      $('aviso-conteudo').hidden = false;
      $('aviso-conteudo').textContent = perfil && perfil.admin
        ? 'O conteúdo deste cargo ainda não foi publicado. Abra “Administração”, escolha o cargo “' + rotulo(cargo) + '” e envie os arquivos.'
        : 'O conteúdo deste cargo ainda não foi publicado. Escolha outra área no quadro “Área de estudo”.' + contato();
    }
    for (var i = 0; i < ARQS.length; i++) {
      var nome = ARQS[i], id = nome.replace('.json', '');
      if (!versoes[nome] && (id === 'discursivas' || id === 'prova2023') && faltando.length < ARQS.length) { window.__pet.set(id, []); continue; } // opcionais
      try { window.__pet.set(id, await baixar(caminho(cargo, nome), versoes[nome])); }
      catch (e) { console.error(nome, e); window.__pet.fail(id); }
    }
  }

  // ---------- administração ----------
  $('btn-admin').addEventListener('click', function () { views('admin'); $('btn-admin').hidden = true; $('btn-app').hidden = false; carregarAlunos(); desenharSelCargo(); listarConteudo(); });
  $('btn-app').addEventListener('click', function () { $('btn-admin').hidden = false; $('btn-app').hidden = true; if (cargo) views('app'); else mostrarCargos(); });
  $('ad-filtro').addEventListener('change', desenharAlunos);
  $('ad-busca').addEventListener('input', desenharAlunos);
  var alunos = [];

  async function contarPendentes() {
    var r = await sb.from('perfis').select('id', {count: 'exact', head: true}).eq('status', 'pendente');
    var n = r.count || 0;
    $('btn-admin').textContent = n ? 'Administração (' + n + ' pendente' + (n > 1 ? 's' : '') + ')' : 'Administração';
  }
  async function carregarAlunos() {
    $('ad-lista').replaceChildren(el('p', 'ac-nota', 'Carregando cadastros…'));
    var r = await sb.from('perfis').select('*').order('criado_em', {ascending: false});
    if (r.error) { $('ad-lista').replaceChildren(el('p', 'ac-msg bad', traduz(r.error))); return; }
    alunos = r.data || [];
    desenharAlunos();
  }
  function fmtData(s) { return s ? new Date(s).toLocaleDateString('pt-BR') : '—'; }
  function desenharAlunos() {
    var f = $('ad-filtro').value, q = $('ad-busca').value.trim().toLowerCase();
    var cont = {pendente: 0, aprovado: 0, bloqueado: 0};
    alunos.forEach(function (a) { cont[a.status] = (cont[a.status] || 0) + 1; });
    $('ad-resumo').textContent = alunos.length + ' cadastro(s): ' + cont.pendente + ' pendente(s), ' + cont.aprovado + ' aprovado(s), ' + cont.bloqueado + ' bloqueado(s).';
    var lista = alunos.filter(function (a) { return (f === 'todos' || a.status === f) && (!q || (a.nome + ' ' + a.email).toLowerCase().indexOf(q) > -1); });
    var box = $('ad-lista'); box.replaceChildren();
    if (!lista.length) { box.append(el('p', 'ac-nota', 'Nenhum cadastro neste filtro.')); return; }
    lista.forEach(function (a) {
      var row = el('div', 'ad-row');
      var info = el('div', 'ad-info');
      var nome = el('div', 'ad-nome', a.nome || '(sem nome)');
      if (a.admin) nome.append(el('span', 'ad-tag adm', 'administrador'));
      info.append(nome, el('div', 'ad-email', a.email), el('div', 'ad-meta', 'Cadastro em ' + fmtData(a.criado_em) + (a.aprovado_em ? ' · aprovado em ' + fmtData(a.aprovado_em) : '')));
      var st = el('span', 'ad-tag ' + a.status, {pendente: 'pendente', aprovado: 'aprovado', bloqueado: 'bloqueado'}[a.status]);
      var val = el('label', 'ad-val'); val.append('Acesso até ');
      var inp = document.createElement('input'); inp.type = 'date'; inp.value = a.expira_em || ''; inp.title = 'Deixe em branco para acesso sem prazo';
      val.append(inp);
      var acts = el('div', 'ad-acts');
      function botao(txt, cls, campos) {
        var b = el('button', 'ac-btn ' + cls, txt);
        b.addEventListener('click', async function () {
          b.disabled = true;
          var up = Object.assign({expira_em: inp.value || null}, campos);
          var r = await sb.from('perfis').update(up).eq('id', a.id);
          b.disabled = false;
          if (r.error) { alert(traduz(r.error)); return; }
          Object.assign(a, up); desenharAlunos(); contarPendentes();
        });
        return b;
      }
      if (a.status !== 'aprovado') acts.append(botao('Aprovar', 'ok', {status: 'aprovado', aprovado_em: new Date().toISOString()}));
      if (a.status !== 'bloqueado' && a.id !== window.PET_UID) acts.append(botao('Bloquear', 'bad', {status: 'bloqueado'}));
      acts.append(botao('Salvar prazo', 'ghost', {}));
      row.append(info, st, val, acts);
      box.append(row);
    });
  }

  var adCargo = null;
  function desenharSelCargo() {
    var sel = $('ad-cargo'); var atual = adCargo ? adCargo.id : (cargo ? cargo.id : '');
    sel.replaceChildren();
    cargos.slice().sort(function (a, b) { return rotulo(a).localeCompare(rotulo(b)); }).forEach(function (c) { var o = new Option(rotulo(c) + (c.ativo === false ? ' (sem conteúdo, oculto para alunos)' : ''), c.id); sel.append(o); });
    sel.value = cargos.some(function (c) { return c.id === atual; }) ? atual : (cargos[0] || {}).id;
    adCargo = cargos.find(function (c) { return c.id === sel.value; }) || null;
  }
  $('ad-cargo').addEventListener('change', function () { adCargo = cargos.find(function (c) { return c.id === $('ad-cargo').value; }) || null; listarConteudo(); });
  function slug(t) { return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50); }
  async function salvarCatalogo() {
    var lista = cargos.map(function (c) { return {id: c.id, nome: c.nome, empresa: c.empresa || '', banca: c.banca || 'Cesgranrio', descricao: c.descricao || '', pasta: c.pasta, ativo: c.ativo !== false}; });
    var blob = new Blob([JSON.stringify(lista, null, 1)], {type: 'application/json'});
    return sb.storage.from(BUCKET).upload('cargos.json', blob, {upsert: true, contentType: 'application/json', cacheControl: '30'});
  }
  $('ad-novo').addEventListener('click', async function () {
    var nome = $('ad-novo-nome').value.trim(), emp = $('ad-novo-emp').value;
    if (nome.length < 3) { msg('ad-novo-msg', 'Informe o nome do cargo, por exemplo “Engenharia de Petróleo”.'); return; }
    var id = slug(nome + '-' + emp);
    if (cargos.some(function (c) { return c.id === id; })) { msg('ad-novo-msg', 'Esse cargo já existe.'); return; }
    var antes = cargos.slice();
    cargos.push({id: id, nome: nome, empresa: emp, banca: 'Cesgranrio', pasta: id, ativo: false});
    this.disabled = true; var r = await salvarCatalogo(); this.disabled = false;
    if (r.error) { cargos = antes; msg('ad-novo-msg', traduz(r.error)); return; }
    $('ad-novo-nome').value = ''; msg('ad-novo-msg', 'Cargo criado. Agora envie os arquivos dele abaixo.', true);
    adCargo = cargos[cargos.length - 1]; desenharSelCargo(); listarConteudo();
  });
  async function listarConteudo() {
    if (!adCargo) desenharSelCargo();
    var box = $('ad-arquivos'); box.replaceChildren(el('p', 'ac-nota', 'Verificando arquivos…'));
    var r = await sb.storage.from(BUCKET).list(adCargo ? adCargo.pasta : '', {limit: 100});
    if (r.error) { box.replaceChildren(el('p', 'ac-msg bad', traduz(r.error))); return; }
    var m = {}; (r.data || []).forEach(function (f) { m[f.name] = f; });
    box.replaceChildren();
    ARQS.forEach(function (n) {
      var f = m[n], li = el('div', 'ad-arq ' + (f ? 'ok' : 'falta'));
      li.append(el('b', null, n), el('span', null, f ? ((f.metadata && f.metadata.size ? (f.metadata.size / 1048576).toFixed(2) + ' MB · ' : '') + 'enviado em ' + new Date(f.updated_at || f.created_at).toLocaleString('pt-BR')) : 'ainda não enviado'));
      box.append(li);
    });
  }
  $('ad-enviar').addEventListener('click', async function () {
    var files = [].slice.call($('ad-files').files || []);
    if (!adCargo) { msg('ad-up-msg', 'Escolha o cargo.'); return; }
    if (!files.length) { msg('ad-up-msg', 'Selecione os arquivos da pasta “conteudo” do cargo.'); return; }
    var ruins = files.filter(function (f) { return ARQS.indexOf(f.name) < 0; });
    if (ruins.length) { msg('ad-up-msg', 'Arquivo não reconhecido: ' + ruins.map(function (f) { return f.name; }).join(', ') + '. Envie apenas ' + ARQS.join(', ') + '.'); return; }
    this.disabled = true;
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      msg('ad-up-msg', 'Enviando ' + f.name + ' (' + (i + 1) + ' de ' + files.length + ')…', true);
      try { JSON.parse(await f.text()); } catch (e) { msg('ad-up-msg', f.name + ' não é um arquivo válido.'); this.disabled = false; return; }
      var r = await sb.storage.from(BUCKET).upload(caminho(adCargo, f.name), f, {upsert: true, contentType: 'application/json', cacheControl: '60'});
      if (r.error) { msg('ad-up-msg', f.name + ': ' + traduz(r.error)); this.disabled = false; return; }
    }
    this.disabled = false;
    if (files.some(function (f) { return f.name === 'questoes.json'; })) adCargo.ativo = true;
    var rc = await salvarCatalogo(); if (rc.error) console.error(rc.error); // mantém o catálogo de cargos gravado
    msg('ad-up-msg', 'Conteúdo de “' + rotulo(adCargo) + '” publicado. Recarregue a página para ver a plataforma atualizada.', true);
    listarConteudo();
  });

  // ---------- sessão ----------
  sb.auth.onAuthStateChange(function (evt, session) {
    if (evt === 'PASSWORD_RECOVERY') { recuperando = true; views('nova'); return; }
    if (evt === 'SIGNED_IN' && session && !perfil && !recuperando) entrar(session);
  });
  (async function () {
    var s = await sb.auth.getSession();
    if (recuperando) { views('nova'); return; }
    if (s.data && s.data.session) entrar(s.data.session); else views('login');
  })();
})();
