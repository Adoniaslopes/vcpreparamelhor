/* Método On Top OAB — plataforma de estudos para a 1ª fase do Exame de Ordem.
   Fluxo: perfil → diagnóstico (prova completa de 80 questões) → relatório → escolha das 4 disciplinas
   de domínio → cronograma pelos 5 passos → painel, sinopses, exercícios, provas anteriores e estúdio de áudio. */
(function () {
  'use strict';
  var D = OAB.DISC, DM = {};
  D.forEach(function (d) { DM[d.id] = d; });
  var QM = {};
  function indexarQ() { QM = {}; OAB.Q.forEach(function (q) { QM[q.id] = q; }); }
  indexarQ();
  var EXAMES = [
    {n: 47, ed: '2026.2'}, {n: 46, ed: '2026.1'}, {n: 45, ed: '2025.3'}, {n: 44, ed: '2025.2'}, {n: 43, ed: '2025.1'},
    {n: 42, ed: '2024.3'}, {n: 41, ed: '2024.2'}, {n: 40, ed: '2024.1'}, {n: 39, ed: '2023.3'}, {n: 38, ed: '2023.2'}
  ];
  var SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  var CARGO = 'oab-1fase';
  var PASSO_COR = {1: '#9CC3FF', 2: '#E6C24E', 3: '#8FE3B5', 4: '#F7B5C9', 5: '#C9B6FF'};

  // ---------- utilidades ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
  function pct(x) { return x == null ? '—' : Math.round(x * 100) + '%'; }
  function hojeISO() { return iso(new Date()); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function dataDe(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmtData(s, ano) { var d = dataDe(s); return d.toLocaleDateString('pt-BR', ano ? {day: '2-digit', month: '2-digit', year: 'numeric'} : {day: '2-digit', month: '2-digit'}); }
  function diasAte(s) { return Math.round((dataDe(s) - dataDe(hojeISO())) / 864e5); }
  function toast(t) { var e = document.createElement('div'); e.className = 'toast'; e.textContent = t; document.body.appendChild(e); setTimeout(function () { e.remove(); }, 2200); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* armazenamento indisponível */ } }
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }


  // confirmação dentro da página (funciona também onde a caixa nativa do navegador é bloqueada)
  function confirmar(texto, rotulo, fn) {
    var f = document.createElement('div'); f.className = 'modal';
    f.innerHTML = '<div class="modal-c" role="dialog" aria-modal="true"><p>' + esc(texto) + '</p><div class="chips"><button class="btn pri" data-m="ok">' + esc(rotulo) + '</button><button class="btn" data-m="no">Cancelar</button></div></div>';
    document.body.appendChild(f);
    f.addEventListener('click', function (e) { e.stopPropagation(); var b = e.target.closest('[data-m]'); if (!b && e.target !== f) return; f.remove(); if (b && b.dataset.m === 'ok') fn(); });
    f.querySelector('[data-m="ok"]').focus();
  }
  var ARTEFATO = !!window.ONTOP_ARTEFATO;

  // ---------- estado ----------
  var KEY = 'ontop-oab-v1';
  function novoEstado() {
    return {v: 1, seed: Math.floor(Math.random() * 1e9), perfil: null,
      diag: {resp: {}, atual: 0, ini: null, fim: null, seg: 0}, dominio: null, crono: null,
      hist: [], feito: {}, provas: {}, at: Date.now()};
  }
  var S = carregar();
  function carregar() {
    try { var s = JSON.parse(lsGet(KEY)); if (s && s.v === 1) return s; } catch (e) { /* estado inválido */ }
    return novoEstado();
  }
  var syncT = null;
  function salvar() {
    S.at = Date.now(); lsSet(KEY, JSON.stringify(S));
    if (nuvem.ativo) { clearTimeout(syncT); syncT = setTimeout(nuvem.enviar, 1500); }
  }

  // alternativas embaralhadas de forma estável por aluno (a banca não tem letra preferida)
  function ordemAlt(q) {
    var r = rng(hash(q.id + ':' + S.seed)), o = [0, 1, 2, 3];
    for (var i = 3; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = o[i]; o[i] = o[j]; o[j] = t; }
    return o;
  }

  // ---------- estatística ----------
  var DIAG = [];
  function montarDiag() { DIAG = []; D.forEach(function (d) { OAB.Q.forEach(function (q) { if (q.d === d.id && q.diag) DIAG.push(q.id); }); }); }
  montarDiag();
  function diagFeito() { return !!S.diag.fim; }
  function diagPorDisc() {
    var r = {}; D.forEach(function (d) { r[d.id] = {n: 0, ok: 0}; });
    DIAG.forEach(function (id) { var q = QM[id], a = S.diag.resp[id]; r[q.d].n++; if (a === q.c) r[q.d].ok++; });
    return r;
  }
  function notaDiag() { var n = 0; DIAG.forEach(function (id) { if (S.diag.resp[id] === QM[id].c) n++; }); return n; }
  // "ate" (opcional) = carimbo de tempo: calcula o estado como estava naquele momento
  function treinoDisc(d, ate) {
    var h = S.hist.filter(function (x) { return QM[x.q] && QM[x.q].d === d && (ate == null || x.t <= ate); }).slice(-30);
    var of = oficiaisDisc(d, ate);
    return {n: h.length + of.n, ok: h.filter(function (x) { return x.ok; }).length + of.ok};
  }
  // domínio estimado: diagnóstico + treino recente (o treino pesa mais quando há volume)
  function dominio(d, ate, dgCache) {
    var temDiag = diagFeito() && (ate == null || S.diag.fim <= ate);
    var dg = temDiag ? (dgCache || diagPorDisc())[d] : null, tr = treinoDisc(d, ate);
    var a = dg && dg.n ? dg.ok / dg.n : null, b = tr.n ? tr.ok / tr.n : null;
    if (a == null) return b;
    if (b == null || tr.n < 5) return a;
    var w = Math.min(0.75, tr.n / 20);
    return a * (1 - w) + b * w;
  }
  function projecao(ate) {
    var s = 0, dg = diagFeito() ? diagPorDisc() : null;
    D.forEach(function (d) { var x = dominio(d.id, ate, dg); s += d.q * (x == null ? 0.25 : x); });
    return s;
  }
  var META = {etica: 0.75, dom: 0.75, B: 0.45, C: 0.5, A: 0.45};
  function metaDisc(d) { if (d.id === 'etica') return META.etica; if (S.dominio && S.dominio.indexOf(d.id) > -1) return META.dom; return META[d.g]; }
  function recomendar() {
    var dg = diagFeito() ? diagPorDisc() : null, af = (S.perfil && S.perfil.afin) || [];
    return D.filter(function (d) { return d.g !== 'C' && d.id !== 'etica'; }).map(function (d) {
      var acc = dg ? dg[d.id].ok / dg[d.id].n : 0.5;
      return {id: d.id, s: d.q * (0.5 * acc + 0.3 * (af.indexOf(d.id) > -1 ? 1 : 0) + 0.2)};
    }).sort(function (a, b) { return b.s - a.s; }).slice(0, 4).map(function (x) { return x.id; });
  }
  function ultimaTentativa() {
    var u = {};
    if (diagFeito()) DIAG.forEach(function (id) { u[id] = {ok: S.diag.resp[id] === QM[id].c, t: S.diag.fim}; });
    S.hist.forEach(function (h) { if (QM[h.q]) u[h.q] = {ok: h.ok, t: h.t}; });
    return u;
  }
  function errosAtuais() { var u = ultimaTentativa(); return Object.keys(u).filter(function (id) { return !u[id].ok; }); }
  function sequencia() {
    var dias = {}; S.hist.forEach(function (h) { dias[iso(new Date(h.t))] = 1; });
    Object.keys(S.feito).forEach(function (k) { if (S.feito[k]) dias[k.slice(0, 10)] = 1; });
    var n = 0, d = new Date();
    if (!dias[iso(d)]) d.setDate(d.getDate() - 1);
    while (dias[iso(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // ---------- cronograma (Método dos 5 Passos) ----------
  function rodizio(ids, pesos, n) {
    var cur = ids.map(function () { return 0; }), tot = pesos.reduce(function (a, b) { return a + b; }, 0), out = [];
    for (var k = 0; k < n; k++) {
      var best = 0;
      for (var i = 0; i < ids.length; i++) { cur[i] += pesos[i]; if (cur[i] > cur[best]) best = i; }
      cur[best] -= tot; out.push(ids[best]);
    }
    return out;
  }
  function gerarCrono() {
    var p = S.perfil; if (!p || !S.dominio) return [];
    var ini = S.crono && S.crono.ini ? S.crono.ini : hojeISO();
    var fim = dataDe(p.prova); fim.setDate(fim.getDate() - 1);
    var datas = [];
    for (var d = dataDe(ini); d <= fim; d.setDate(d.getDate() + 1)) if (p.dias.indexOf(d.getDay()) > -1) datas.push(iso(d));
    var N = datas.length; if (!N) return [];
    var rev = N >= 28 ? 14 : Math.max(1, Math.round(N * 0.2)), resto = N - rev, cons = Math.round(resto * 0.35), constr = resto - cons;
    var dg = diagFeito() ? diagPorDisc() : null;
    var acc = function (id) { return dg ? dg[id].ok / dg[id].n : 0.5; };
    var dom = S.dominio.slice();
    var seqDom = rodizio(dom, dom.map(function (id) { return DM[id].q * (1.6 - acc(id)); }), N * 2);
    var sec = D.filter(function (d) { return d.id !== 'etica' && dom.indexOf(d.id) < 0; })
      .sort(function (a, b) { return (a.g === b.g ? 0 : a.g < b.g ? -1 : 1) || b.q * (1 - acc(b.id)) - a.q * (1 - acc(a.id)); })
      .map(function (d) { return d.id; });
    var M = p.horas * 60, et = Math.max(15, Math.min(30, Math.round(M * 0.15))), au = 10, R = Math.max(30, M - et - au);
    var iDom = 0, iSec = 0, iEx = 0, out = [];
    function prox() { return seqDom[iDom++ % seqDom.length]; }
    function proxSec() { return sec[iSec++ % sec.length]; }
    datas.forEach(function (dt, i) {
      var fase = i < constr ? 1 : i < constr + cons ? 2 : 3;
      var dd = dataDe(dt), prox7 = new Date(dd); prox7.setDate(dd.getDate() + 1);
      var ultimoDaSemana = true;
      for (var k = 1; k < 7; k++) { var x = new Date(dd); x.setDate(dd.getDate() + k); if (x.getDay() === 0) break; if (p.dias.indexOf(x.getDay()) > -1 && iso(x) <= datas[N - 1]) { ultimoDaSemana = false; break; } }
      var semanaN = Math.floor(i / Math.max(1, p.dias.length));
      var simulado = ultimoDaSemana && N > 6 && (fase > 1 || semanaN % 2 === 1);
      var it = [];
      if (simulado) {
        var ex = EXAMES[iEx++ % EXAMES.length];
        it.push({p: 1, min: Math.min(M, 300), txt: (M >= 300 ? 'Resolva a prova do ' : 'Resolva metade (40 questões) da prova do ') + ex.n + 'º Exame (' + ex.ed + ') e marque no cartão-resposta', link: '#provas/' + ex.n});
        it.push({p: 4, min: Math.max(15, M - Math.min(M, 300) - au), txt: 'Corrija pelo gabarito oficial e anote no resumo os assuntos que errou', link: '#provas/' + ex.n});
        it.push({p: 5, min: au, txt: 'Grave 3 minutos sobre o tema que mais errou no simulado', link: '#estudio'});
        out.push({data: dt, fase: fase, sim: true, it: it}); return;
      }
      it.push({p: 2, min: et, d: 'etica', txt: 'Estatuto e Código de Ética: leia 10 artigos e faça 5 questões de Ética', link: '#exercicios/etica'});
      var a = prox(), tema;
      if (fase === 1) {
        if (R >= 150) {
          var b = prox(); if (b === a) b = prox();
          it.push({p: 4, min: Math.round(R * 0.25), d: a, txt: 'Sinopse de ' + DM[a].nome + ': leia e escreva seu resumo de 1 página', link: '#sinopses/' + a});
          it.push({p: 3, min: Math.round(R * 0.4), d: a, txt: 'Exercícios de ' + DM[a].nome + ' (sua disciplina de domínio)', link: '#exercicios/' + a});
          it.push({p: 3, min: R - Math.round(R * 0.25) - Math.round(R * 0.4), d: b, txt: 'Exercícios de ' + DM[b].nome, link: '#exercicios/' + b});
        } else {
          it.push({p: 4, min: Math.round(R * 0.35), d: a, txt: 'Sinopse de ' + DM[a].nome + ': leia e escreva seu resumo de 1 página', link: '#sinopses/' + a});
          it.push({p: 3, min: R - Math.round(R * 0.35), d: a, txt: 'Exercícios de ' + DM[a].nome + ' (sua disciplina de domínio)', link: '#exercicios/' + a});
        }
        tema = DM[a].nome;
      } else if (fase === 2) {
        var s = proxSec();
        it.push({p: 3, min: Math.round(R * 0.55), d: a, txt: 'Exercícios de ' + DM[a].nome + ' e revisão do seu resumo', link: '#exercicios/' + a});
        it.push({p: 4, min: R - Math.round(R * 0.55), d: s, txt: 'Pontos rápidos: sinopse e questões de ' + DM[s].nome + ' (' + DM[s].q + ' questões na prova)', link: '#sinopses/' + s});
        tema = DM[s].nome;
      } else {
        var s2 = proxSec();
        it.push({p: 3, min: Math.round(R * 0.3), txt: 'Revisão de erros: refaça as questões que você errou', link: '#exercicios/erros'});
        it.push({p: 4, min: Math.round(R * 0.4), d: a, txt: 'Releia seu resumo e a sinopse de ' + DM[a].nome, link: '#sinopses/' + a});
        it.push({p: 4, min: R - Math.round(R * 0.3) - Math.round(R * 0.4), d: s2, txt: 'Sinopse relâmpago de ' + DM[s2].nome + ' (pegadinhas e lei seca)', link: '#sinopses/' + s2});
        tema = DM[a].nome;
      }
      it.push({p: 5, min: au, txt: 'Grave 3 minutos explicando ' + tema + ' com suas palavras', link: '#estudio'});
      out.push({data: dt, fase: fase, it: it});
    });
    return out;
  }
  var cronoCache = null;
  function crono() { if (!cronoCache) cronoCache = gerarCrono(); return cronoCache; }
  function invalidarCrono() { cronoCache = null; }

  // ---------- componentes ----------
  function tagDisc(id) { var d = DM[id]; return '<span class="tag"><span class="pt" style="background:' + d.cor + '"></span>' + esc(d.curto) + '</span>'; }
  function barra(nome, cor, v, meta, extra) {
    return '<div class="barra"><span class="nm"><span class="pt" style="background:' + cor + '"></span>' + nome + (extra || '') + '</span>' +
      '<span class="trilho"><i style="width:' + (v == null ? 0 : Math.round(v * 100)) + '%;background:' + cor + '"></i>' +
      (meta != null ? '<b style="left:' + Math.round(meta * 100) + '%" title="Meta"></b>' : '') + '</span><span class="vl">' + pct(v) + '</span></div>';
  }
  function passoTag(n) { return '<span class="passo" style="background:' + PASSO_COR[n] + '">Passo ' + n + '</span>'; }
  // 80 bolhas da prova: cada disciplina pinta quantas questões você já "garante"
  function cartaoProva() {
    var h = '';
    D.forEach(function (d) {
      var x = dominio(d.id), cheias = x == null ? 0 : Math.round(d.q * x);
      for (var i = 0; i < d.q; i++) h += '<span title="' + esc(d.nome) + '" style="' + (i < cheias ? 'background:' + d.cor + ';border-color:' + d.cor : 'border-color:' + d.cor + 'AA') + '"></span>';
    });
    return '<div class="cartao" aria-label="Mapa das 80 questões: bolhas preenchidas são questões que você já tende a acertar">' + h + '</div>';
  }


  // ---------- boletim do desempenho (formato de previsão do tempo na TV) ----------
  var DIAS_EXT = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
  function clima(p) {
    if (p == null) return {n: 'sem dados', s: ''};
    var sol = '<circle cx="14" cy="13" r="6.5" fill="#FFC93C"/><g stroke="#FFC93C" stroke-width="2" stroke-linecap="round"><path d="M14 2v3M14 21v3M3 13h3M22 13h3M6.2 5.2l2 2M19.8 5.2l-2 2M6.2 20.8l2-2"/></g>';
    var nuvem = function (c) { return '<path d="M11 30h17a6 6 0 0 0 0-12 8 8 0 0 0-15.3 2.2A5 5 0 0 0 11 30z" fill="' + c + '"/>'; };
    var gotas = '<g stroke="#5BC0FF" stroke-width="2" stroke-linecap="round"><path d="M14 33l-1.5 3M20 33l-1.5 3M26 33l-1.5 3"/></g>';
    var raio = '<path d="M21 27l-4 6h4l-2 5 6-8h-4l2-3z" fill="#FFD43B"/>';
    var svg = function (x) { return '<svg viewBox="0 0 38 38" width="34" height="34" aria-hidden="true">' + x + '</svg>'; };
    if (p >= 0.7) return {n: 'tempo firme', s: svg('<g transform="translate(5 5)">' + sol + '</g>')};
    if (p >= 0.5) return {n: 'sol entre nuvens', s: svg(sol + nuvem('#E8EEF8'))};
    if (p >= 0.4) return {n: 'instável', s: svg(nuvem('#C9D3E3') + gotas)};
    return {n: 'tempestade', s: svg(nuvem('#8E9BB3') + raio + gotas)};
  }
  function curva(pts) {
    if (pts.length < 2) return '';
    var d = 'M' + pts[0].x + ' ' + pts[0].y;
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + (p1.x + (p2.x - p0.x) / 6) + ' ' + (p1.y + (p2.y - p0.y) / 6) + ' ' + (p2.x - (p3.x - p1.x) / 6) + ' ' + (p2.y - (p3.y - p1.y) / 6) + ' ' + p2.x + ' ' + p2.y;
    }
    return d;
  }
  // o: {titulo, fonte, legA, legB, cols:[{rot, sub, a (0-1), aTxt, b (0-1), bTxt, ico (0-1), leg, val}], tag, manchete, linha, ticker:[...], abas}
  function boletim(o) {
    var n = o.cols.length;
    var pa = o.cols.map(function (c, i) { return {x: (i + 0.5) / n * 100, y: 42 - Math.max(0, Math.min(1, c.a)) * 24}; });
    var pb = o.cols.map(function (c, i) { return c.b == null ? null : {x: (i + 0.5) / n * 100, y: 90 - Math.max(0, Math.min(1, c.b)) * 24}; });
    var pbOk = pb.filter(Boolean);
    var pontos = function (ps, txts, cls) {
      return ps.map(function (p, i) { return p ? '<span class="tv-pt ' + cls + '" style="left:' + p.x + '%;top:' + p.y + '%"></span><span class="tv-vl" style="left:' + p.x + '%;top:' + p.y + '%">' + esc(txts[i]) + '</span>' : ''; }).join('');
    };
    var agora = new Date();
    return '<section class="tv" aria-label="' + esc(o.titulo) + '">' +
      '<div class="tv-cab"><div class="tv-tit">' + esc(o.titulo) + '</div><div class="tv-fonte">FONTE: ' + esc(o.fonte) + '</div>' +
      '<div class="tv-leg"><span><i style="background:#F2C230"></i>' + esc(o.legA) + '</span>' + (o.legB ? '<span><i style="background:#47B2FF"></i>' + esc(o.legB) + '</span>' : '') + '</div>' +
      (o.abas || '') + '</div>' +
      '<div class="tv-rolo"><div class="tv-painel" style="--n:' + n + '">' +
      '<div class="tv-cols">' + o.cols.map(function (c) { return '<div><b>' + esc(c.rot) + '</b>' + (c.sub ? '<small>' + esc(c.sub) + '</small>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="tv-graf"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + curva(pa) + '" fill="none" stroke="#F2C230" stroke-width="3" vector-effect="non-scaling-stroke"/>' +
      '<path d="' + curva(pbOk) + '" fill="none" stroke="#47B2FF" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>' +
      pontos(pa, o.cols.map(function (c) { return c.aTxt; }), 'am') + pontos(pb, o.cols.map(function (c) { return c.bTxt; }), 'az') + '</div>' +
      '<div class="tv-rod">' + o.cols.map(function (c) { var k = clima(c.ico); return '<div title="' + esc(k.n) + '">' + k.s + '<span><small>' + esc(c.leg || k.n) + '</small><b>' + esc(c.val) + '</b></span></div>'; }).join('') + '</div>' +
      '</div></div>' +
      '<div class="tv-lt"><span class="tv-tag">' + esc(o.tag) + '</span><div class="tv-man"><b>' + esc(o.manchete) + '</b><span>' + esc(o.linha) + '</span></div></div>' +
      ((o.ticker || []).length ? '<div class="tv-tick"><span class="tv-hora">' + String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0') + '</span><span class="tv-tx">' + (o.ticker || []).map(esc).join(' <i>▸</i> ') + '</span></div>' : '<div style="height:20px"></div>') +
      '</section>';
  }
  function juntar(l) { return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1]; }
  function tempoTxt(lista) {
    var bom = lista.filter(function (x) { return x.p != null && x.p >= 0.7; }).map(function (x) { return x.nome; });
    var ruim = lista.filter(function (x) { return x.p != null && x.p < 0.4; }).map(function (x) { return x.nome; });
    var t = [];
    if (bom.length) t.push('tempo firme em ' + juntar(bom.slice(0, 3)));
    if (ruim.length) t.push('tempestade em ' + juntar(ruim.slice(0, 3)));
    if (!t.length) return 'Tempo variável, sem extremos';
    t[0] = t[0].charAt(0).toUpperCase() + t[0].slice(1);
    return t.join('; ');
  }

  var vistaDiag = 'grupos';
  function boletimDiag() {
    var dg = diagPorDisc(), n = notaDiag(), cols;
    var acc = function (ids) { var t = 0, ok = 0; ids.forEach(function (id) { t += dg[id].n; ok += dg[id].ok; }); return {t: t, ok: ok, p: t ? ok / t : 0}; };
    var metaMed = function (ids) { var t = 0, m = 0; ids.forEach(function (id) { t += DM[id].q; m += DM[id].q * metaDisc(DM[id]); }); return t ? m / t : 0; };
    if (vistaDiag === 'grupos') {
      var gr = [['ÉTICA', 'Passo 2', ['etica']]].concat(['A', 'B', 'C'].map(function (g) {
        return ['GRUPO ' + g, {A: 'decidem a prova', B: 'meio-campo', C: 'pontos rápidos'}[g], D.filter(function (d) { return d.g === g && d.id !== 'etica'; }).map(function (d) { return d.id; })];
      }));
      cols = gr.map(function (x) { var r = acc(x[2]), m = metaMed(x[2]); return {rot: x[0], sub: x[1], a: r.p, aTxt: pct(r.p), b: m, bTxt: pct(m), ico: r.p, leg: 'acertos', val: r.ok + '/' + r.t}; });
    } else {
      cols = D.filter(function (d) { return d.g === vistaDiag; }).map(function (d) {
        var r = dg[d.id], p = r.ok / r.n;
        return {rot: d.curto.toUpperCase(), sub: d.q + ' questões', a: p, aTxt: pct(p), b: metaDisc(d), bTxt: pct(metaDisc(d)), ico: p, leg: 'acertos', val: r.ok + '/' + r.n};
      });
    }
    var abas = '<div class="tv-abas" role="tablist">' + [['grupos', 'Por grupo'], ['A', 'Grupo A'], ['B', 'Grupo B'], ['C', 'Grupo C']].map(function (x) {
      return '<button role="tab" aria-selected="' + (vistaDiag === x[0]) + '" data-vdiag="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>';
    return boletim({titulo: 'SEU DIAGNÓSTICO, DISCIPLINA POR DISCIPLINA', fonte: 'PROVA DIAGNÓSTICA DE ' + fmtData(iso(new Date(S.diag.fim)), true),
      legA: 'acerto no diagnóstico', legB: 'sua meta', cols: cols, abas: abas, tag: 'DIAGNÓSTICO',
      manchete: n >= 40 ? 'NOTA ' + n + ' DE 80: VOCÊ JÁ PASSARIA HOJE' : 'NOTA ' + n + ' DE 80: FALTAM ' + (40 - n) + ' ACERTOS',
      linha: tempoTxt(D.map(function (d) { return {nome: d.curto, p: dg[d.id].ok / dg[d.id].n}; })),
      ticker: D.map(function (d) { return d.curto.toUpperCase() + ' ' + dg[d.id].ok + '/' + dg[d.id].n; })});
  }
  function boletimDias() {
    var dias = {}, ordem = [];
    S.hist.forEach(function (h) { var k = iso(new Date(h.t)); if (!dias[k]) { dias[k] = {n: 0, ok: 0, fim: 0}; ordem.push(k); } dias[k].n++; if (h.ok) dias[k].ok++; dias[k].fim = Math.max(dias[k].fim, h.t); });
    ordem = ordem.sort().slice(-6);
    if (!ordem.length) return '';
    var hj = hojeISO(), cols = ordem.map(function (k) {
      var x = dias[k], p = x.ok / x.n, pr = projecao(x.fim);
      return {rot: k === hj ? 'HOJE' : DIAS_EXT[dataDe(k).getDay()], sub: fmtData(k), a: p, aTxt: pct(p), b: pr / 80, bTxt: Math.round(pr) + ' pts', ico: p, leg: 'questões', val: String(x.n)};
    });
    var agora = projecao(), antes = cols.length > 1 ? projecao(dias[ordem[0]].fim) : null, dif = antes == null ? 0 : Math.round(agora) - Math.round(antes);
    var dd = D.map(function (d) { return {nome: d.curto, p: dominio(d.id)}; });
    return boletim({titulo: 'SEU DESEMPENHO NOS ÚLTIMOS DIAS', fonte: 'SEUS TREINOS', legA: 'acerto do dia', legB: 'nota projetada (de 80)', cols: cols,
      tag: 'BOLETIM DO DESEMPENHO', manchete: 'NOTA PROJETADA: ' + Math.round(agora) + ' PONTOS' + (agora >= 40 ? ', ACIMA DO CORTE' : ''),
      linha: (dif ? (dif > 0 ? 'Subiu ' : 'Caiu ') + Math.abs(dif) + (Math.abs(dif) === 1 ? ' ponto' : ' pontos') + ' no período. ' : 'Estável no período. ') + tempoTxt(dd),
      ticker: D.filter(function (d) { return dominio(d.id) != null; }).map(function (d) { return d.curto.toUpperCase() + ' ' + pct(dominio(d.id)); })});
  }
  function boletimSessao() {
    var l = (S.sessoes || []).slice(-5); if (!l.length) return '';
    var nomeModo = function (m) { return m === 'mix' ? 'Treino do dia' : m === 'erros' ? 'Revisão de erros' : DM[m] ? DM[m].curto : m; };
    var cols = l.map(function (x, i) {
      var p = x.n ? x.ok / x.n : 0, d = new Date(x.t);
      return {rot: i === l.length - 1 ? 'AGORA' : DIAS_EXT[d.getDay()], sub: nomeModo(x.modo), a: p, aTxt: pct(p), b: x.proj / 80, bTxt: Math.round(x.proj) + ' pts', ico: p, leg: 'acertos', val: x.ok + '/' + x.n};
    });
    var u = l[l.length - 1], ant = l.length > 1 ? l[l.length - 2] : null, dif = ant ? Math.round(u.proj) - Math.round(ant.proj) : 0;
    var porD = {}; (u.det || []).forEach(function (r) { if (!porD[r.d]) porD[r.d] = {n: 0, ok: 0}; porD[r.d].n++; if (r.ok) porD[r.d].ok++; });
    var ds = Object.keys(porD);
    var h = boletim({titulo: 'SEUS ÚLTIMOS TREINOS', fonte: 'SESSÕES DE QUESTÕES', legA: 'acerto na sessão', legB: 'nota projetada (de 80)', cols: cols,
      tag: 'TREINO CONCLUÍDO', manchete: 'ACERTO DE ' + pct(u.n ? u.ok / u.n : 0) + ' EM ' + nomeModo(u.modo).toUpperCase(),
      linha: 'Nota projetada: ' + Math.round(u.proj) + ' pontos' + (ant ? (dif ? ' (' + (dif > 0 ? '+' : '') + dif + ' desde o treino anterior)' : ' (estável)') : ''),
      ticker: ds.map(function (d) { return DM[d].curto.toUpperCase() + ' ' + porD[d].ok + '/' + porD[d].n; })});
    if (ds.length > 1) {
      h += boletim({titulo: 'ESTE TREINO, POR DISCIPLINA', fonte: 'SESSÃO DE AGORA', legA: 'acerto na disciplina', legB: 'seu domínio acumulado',
        cols: ds.slice(0, 8).map(function (d) { var r = porD[d], p = r.ok / r.n, dm = dominio(d); return {rot: DM[d].curto.toUpperCase(), sub: DM[d].q + ' questões na prova', a: p, aTxt: pct(p), b: dm, bTxt: pct(dm), ico: p, leg: 'acertos', val: r.ok + '/' + r.n}; }),
        tag: 'RAIO-X', manchete: tempoTxt(ds.map(function (d) { return {nome: DM[d].curto, p: porD[d].ok / porD[d].n}; })).toUpperCase(),
        linha: 'Revise a sinopse das disciplinas com tempestade antes do próximo treino.', ticker: []});
    }
    return h;
  }

  // ---------- telas ----------
  var R = {};

  R.boasvindas = function () {
    var p = S.perfil || {nome: (nuvem.nome || ''), prova: OAB.EXAME.data, dias: [1, 2, 3, 4, 5, 6], horas: 3, afin: []};
    var dias = SEMANA.map(function (s, i) { return '<button type="button" class="chip" data-dia="' + i + '" aria-pressed="' + (p.dias.indexOf(i) > -1) + '">' + s + '</button>'; }).join('');
    var af = D.filter(function (d) { return d.id !== 'etica'; }).map(function (d) {
      return '<button type="button" class="chip" data-af="' + d.id + '" aria-pressed="' + (p.afin.indexOf(d.id) > -1) + '"><span class="pt" style="background:' + d.cor + '"></span>' + esc(d.curto) + '</button>';
    }).join('');
    var horas = ''; for (var h = 1; h <= 8; h++) horas += '<option value="' + h + '"' + (h === p.horas ? ' selected' : '') + '>' + h + (h === 1 ? ' hora' : ' horas') + '</option>';
    return '<section class="hero" style="grid-template-columns:1fr"><div><div class="marca" style="color:#fff;margin-bottom:14px"><span class="bolha cheia"></span><span class="bolha"></span> Método On Top OAB</div>' +
      '<h1>Você não precisa saber tudo.<br>Precisa saber o certo.</h1>' +
      '<p class="sub">O método que aprovou o Dr. Adonias Lopes há 10 anos — e que ele testou de novo refazendo as duas últimas provas sem estudar: 56 e 65 pontos de aproveitamento. Primeiro você faz uma prova completa; depois a plataforma mostra onde estão seus pontos e monta o seu cronograma.</p></div></section>' +
      '<div class="grade g2"><div class="bloco"><h2>Como funciona</h2><ol class="passos-lista">' +
      OAB.PASSOS.map(function (s) { return '<li><span class="n">' + s.n + '</span><div><b>' + esc(s.nome) + '.</b> <span class="sub">' + esc(s.txt) + '</span></div></li>'; }).join('') +
      '</ol></div><form class="bloco" id="f-perfil"><h2>Seu ponto de partida</h2>' +
      '<label>Como podemos te chamar?<input id="p-nome" required value="' + esc(p.nome) + '"></label>' +
      '<label>Data da prova<input type="date" id="p-prova" required value="' + esc(p.prova) + '"></label>' +
      '<p class="peq sub" style="margin-top:-.6rem">Padrão: 1ª fase do ' + OAB.EXAME.nome + ', ' + fmtData(OAB.EXAME.data, true) + '.</p>' +
      '<label>Horas de estudo por dia<select id="p-horas">' + horas + '</select></label>' +
      '<div style="margin-bottom:1rem"><div style="font-weight:500;font-size:.9rem;margin-bottom:.4rem">Dias em que você estuda</div><div class="chips">' + dias + '</div></div>' +
      '<div style="margin-bottom:1rem"><div style="font-weight:500;font-size:.9rem">Disciplinas com que você tem mais afinidade</div><p class="peq sub" style="margin:.2rem 0 .5rem">Marque as que você gosta ou já domina. Ética entra para todos, todos os dias.</p><div class="chips">' + af + '</div></div>' +
      '<button class="btn pri" type="submit">' + (S.perfil ? 'Salvar perfil' : 'Começar pelo diagnóstico') + '</button><p class="msg" id="p-msg"></p></form></div>';
  };
  R.perfil = function () {
    return R.boasvindas() + '<div class="grade g2" style="margin-top:16px"><div class="bloco"><h2>Aparência</h2><div class="chips">' +
      ['auto', 'light', 'dark'].map(function (t) { return '<button class="chip" data-tema="' + t + '" aria-pressed="' + ((lsGet('ontop-tema') || 'auto') === t) + '">' + {auto: 'Automático', light: 'Claro', dark: 'Escuro'}[t] + '</button>'; }).join('') +
      '</div></div><div class="bloco"><h2>Seus dados</h2><p class="sub peq">' + (nuvem.ativo ? 'Seu progresso é salvo na sua conta.' : 'Seu progresso fica salvo neste navegador. Faça uma cópia de segurança de vez em quando.') + '</p>' +
      '<div class="chips">' + (ARTEFATO ? '' : '<button class="btn mini" data-act="backup">Baixar cópia</button>') + '<label class="btn mini" style="margin:0">Restaurar cópia<input type="file" id="restaurar" accept=".json" hidden></label>' +
      '<button class="btn mini" data-act="zerar">Apagar tudo e recomeçar</button></div></div></div>';
  };

  R.painel = function () {
    var p = S.perfil, falta = diasAte(p.prova), proj = projecao();
    var h = '<section class="hero"><div><h1>Olá, ' + esc(p.nome.split(' ')[0]) + '.</h1><p class="sub">' +
      (falta > 0 ? 'Faltam <b style="color:#fff">' + falta + ' dias</b> para a sua prova (' + fmtData(p.prova, true) + ').' : 'Dia de prova. Você se preparou para isto.') + '</p>' +
      '<div class="meta-linha"><div><span class="num">' + (diagFeito() ? notaDiag() : '—') + '</span><small>no diagnóstico</small></div>' +
      '<div><span class="num">' + (diagFeito() ? Math.round(proj) : '—') + '</span><small>nota projetada hoje</small></div>' +
      '<div><span class="num" style="color:#E6C24E">40</span><small>para passar</small></div></div>' +
      (diagFeito() ? '' : '<p style="margin-top:18px"><a class="btn ouro" href="#diagnostico">Fazer o diagnóstico</a></p>') +
      '</div><div><p class="sub peq" style="margin-bottom:8px">As 80 questões da prova. Bolhas cheias são as que você já tende a acertar.</p>' + cartaoProva() + '</div></section>';
    if (!diagFeito()) return h + '<div class="vazio"><h2>Comece pelo diagnóstico</h2><p>Uma prova completa, com a mesma distribuição da FGV, mostra em quais disciplinas você já pontua e em quais está perdendo pontos. Com ela, o relatório indica suas 4 disciplinas de domínio e o cronograma é gerado.</p><a class="btn pri" href="#diagnostico">Fazer o diagnóstico</a></div>';
    if (!S.dominio) return h + '<div class="vazio"><h2>Escolha suas 4 disciplinas de domínio</h2><p>Seu relatório está pronto. Confirme as disciplinas e gere o cronograma.</p><a class="btn pri" href="#relatorio">Ver relatório</a></div>';
    h += boletimDias() || boletimDiag();
    var c = crono(), hj = hojeISO(), dia = c.find(function (x) { return x.data >= hj; });
    var miss = '';
    if (!dia) miss = '<p>Seu cronograma terminou. Bom exame!</p>';
    else {
      miss = '<p class="sub peq">' + (dia.data === hj ? 'Hoje' : 'Próximo dia de estudo: ' + fmtData(dia.data)) + ' · ' + ['', 'Construção', 'Consolidação', 'Revisão final'][dia.fase] + '</p>' + tarefasHTML(dia);
    }
    var tr = S.hist.length, ok = S.hist.filter(function (x) { return x.ok; }).length;
    var tot = 0, fe = 0; c.forEach(function (x) { x.it.forEach(function (_, i) { tot++; if (S.feito[x.data + ':' + i]) fe++; }); });
    h += '<div class="grade g2"><div class="bloco"><h2>Missão do dia</h2>' + miss + '</div><div class="pilha"><div class="kpis">' +
      '<div class="kpi"><div class="num">' + sequencia() + '</div><div class="sub">dias seguidos</div></div>' +
      '<div class="kpi"><div class="num">' + tr + '</div><div class="sub">questões de treino</div></div>' +
      '<div class="kpi"><div class="num">' + (tr ? pct(ok / tr) : '—') + '</div><div class="sub">acerto no treino</div></div>' +
      '<div class="kpi"><div class="num">' + (tot ? pct(fe / tot) : '—') + '</div><div class="sub">do cronograma feito</div></div></div>' +
      '<div class="bloco"><h3>Temas para revisar</h3>' + temasRevisar() + '</div></div></div>';
    h += '<div class="bloco" style="margin-top:16px"><div class="cab" style="margin-bottom:12px"><h2 style="margin:0">Domínio por disciplina</h2><span class="sub peq">Traço = sua meta · <span class="dom-mark">★</span> = disciplina de domínio</span></div><div class="barras">' +
      D.map(function (d) { return barra(esc(d.curto), d.cor, dominio(d.id), metaDisc(d), S.dominio.indexOf(d.id) > -1 ? ' <span class="dom-mark">★</span>' : ''); }).join('') + '</div></div>';
    return h;
  };
  function temasRevisar() {
    var er = errosAtuais(), cont = {};
    er.forEach(function (id) { var q = QM[id], k = q.d + '|' + q.t; cont[k] = (cont[k] || 0) + 1; });
    errosOficiais().forEach(function (e) { var k = e.d + '|' + e.t + ' (' + e.ex + 'º Exame)'; cont[k] = (cont[k] || 0) + 1; });
    var l = Object.keys(cont).sort(function (a, b) { return cont[b] - cont[a]; }).slice(0, 6);
    if (!l.length) return '<p class="sub">Nenhum erro pendente. Continue treinando.</p>';
    return '<div class="pilha" style="font-size:.92rem">' + l.map(function (k) { var x = k.split('|'); return '<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span>' + tagDisc(x[0]) + ' ' + esc(x[1]) + '</span><a class="btn mini" href="#sinopses/' + x[0] + '">Revisar</a></div>'; }).join('') +
      '</div><p style="margin:12px 0 0"><a class="btn mini" href="#exercicios/erros">Refazer ' + er.length + ' questões erradas</a></p>';
  }
  function tarefasHTML(dia) {
    return '<div class="tarefas">' + dia.it.map(function (t, i) {
      var k = dia.data + ':' + i, f = !!S.feito[k];
      return '<div class="tarefa' + (f ? ' feita' : '') + '"><input type="checkbox" data-feito="' + k + '"' + (f ? ' checked' : '') + ' aria-label="Concluída"><span class="tx">' + passoTag(t.p) + ' ' + esc(t.txt) + ' <span class="sub">· ' + t.min + ' min</span></span>' +
        (t.link ? '<a class="btn mini" href="' + t.link + '">Abrir</a>' : '') + '</div>';
    }).join('') + '</div>';
  }

  // ---------- diagnóstico ----------
  var cron = null;
  R.diagnostico = function () {
    var g = S.diag;
    if (g.fim) {
      var n = notaDiag();
      return '<div class="cab"><div><h1>Diagnóstico concluído</h1><p class="sub">Feito em ' + fmtData(iso(new Date(g.fim)), true) + '. Você acertou ' + n + ' de 80.</p></div></div>' + boletimDiag() +
        '<div class="grade g2"><div class="bloco"><h2>Seu cartão-resposta</h2>' + cartaoDiag(true) + '<p class="peq sub" style="margin-top:12px">Verde: acerto. Vermelho: erro. Tracejado: marcou "não sei".</p></div>' +
        '<div class="bloco"><h2>Próximo passo</h2><p>O relatório mostra seus pontos fortes e fracos e indica as 4 disciplinas de domínio que vão sustentar sua aprovação.</p><a class="btn pri" href="#relatorio">Ver meu relatório</a>' +
        '<p style="margin-top:18px" class="peq sub">Quer medir de novo depois de semanas de estudo? Você pode refazer o diagnóstico. As alternativas mudam de ordem.</p><button class="btn mini" data-act="refazer-diag">Refazer diagnóstico</button></div></div>';
    }
    if (!g.ini) {
      var dist = D.map(function (d) { return '<span class="tag"><span class="pt" style="background:' + d.cor + '"></span>' + esc(d.curto) + ' · ' + d.q + '</span>'; }).join(' ');
      return '<div class="cab"><div><h1>Diagnóstico</h1><p class="sub">Uma prova completa de 80 questões, na distribuição da FGV.</p></div></div>' +
        '<div class="grade g2"><div class="bloco"><h2>Antes de começar</h2><ul style="padding-left:1.2rem;margin:0">' +
        '<li>Responda como no dia da prova. São 5 horas na prova real; aqui o tempo é só uma referência.</li>' +
        '<li>Se não fizer ideia da resposta, use <b>Não sei</b> em vez de chutar. O diagnóstico fica mais fiel.</li>' +
        '<li>Pode parar e continuar depois: suas respostas ficam salvas.</li>' +
        '<li>As questões são inéditas, escritas sobre os temas que a FGV mais repete.</li></ul>' +
        '<p style="margin-top:16px"><button class="btn pri" data-act="iniciar-diag">Começar a prova</button></p></div>' +
        '<div class="bloco"><h2>Distribuição</h2><div class="chips">' + dist + '</div></div></div>';
    }
    var i = g.atual, q = QM[DIAG[i]], d = DM[q.d], o = ordemAlt(q), r = g.resp[q.id];
    var resp = Object.keys(g.resp).length;
    return '<div class="cab"><div><h1 style="font-size:1.6rem">Diagnóstico</h1><p class="sub">Questão ' + (i + 1) + ' de 80 · ' + resp + ' respondidas</p></div><div class="sub" id="relogio" aria-live="off">' + relogio() + '</div></div>' +
      '<div class="prog"><i style="width:' + (resp / 80 * 100) + '%"></i></div>' +
      '<div class="grade" style="grid-template-columns:minmax(0,1fr) minmax(220px,300px);align-items:start" id="diag-grid"><div class="questao">' +
      '<p>' + tagDisc(q.d) + '</p><div class="enun">' + esc(q.e) + '</div><div class="alts">' +
      o.map(function (oi, k) { return '<button class="alt' + (r === oi ? ' sel' : '') + '" data-diag-alt="' + oi + '"><span class="lt">' + 'ABCD'[k] + '</span><span>' + esc(q.a[oi]) + '</span></button>'; }).join('') +
      '</div><div class="barra-q"><div class="chips"><button class="btn" data-act="d-ant"' + (i === 0 ? ' disabled' : '') + '>Anterior</button><button class="btn" data-diag-alt="-1"' + (r === -1 ? ' style="border-color:var(--tinta)"' : '') + '>Não sei</button></div>' +
      (i < 79 ? '<button class="btn pri" data-act="d-prox">Próxima</button>' : '<button class="btn ouro" data-act="d-fim">Entregar a prova</button>') + '</div></div>' +
      '<div class="bloco"><h3>Cartão-resposta</h3>' + cartaoDiag(false) + '<p style="margin:14px 0 0"><button class="btn mini" data-act="d-fim">Entregar a prova</button></p></div></div>';
  };
  function relogio() { var s = S.diag.seg || 0; return 'Tempo: ' + Math.floor(s / 3600) + 'h' + String(Math.floor(s / 60) % 60).padStart(2, '0') + ' de 5h00'; }
  function cartaoDiag(final) {
    return '<div class="cartao">' + DIAG.map(function (id, i) {
      var r = S.diag.resp[id], cls = '';
      if (final) cls = r === QM[id].c ? 'ok' : r === -1 ? 'er ns' : 'er';
      else { if (r != null) cls = r === -1 ? 'ns' : 'resp'; if (i === S.diag.atual) cls += ' atual'; }
      return final ? '<span class="' + cls + '" title="' + esc(DM[QM[id].d].curto) + '">' + (i + 1) + '</span>' : '<button class="' + cls + '" data-ir-q="' + i + '" aria-label="Questão ' + (i + 1) + '">' + (i + 1) + '</button>';
    }).join('') + '</div>';
  }
  function pararRelogio() { if (cron) { clearInterval(cron); cron = null; } }
  function ligarRelogio() {
    pararRelogio();
    cron = setInterval(function () { if (document.hidden) return; S.diag.seg = (S.diag.seg || 0) + 1; var e = $('#relogio'); if (e) e.textContent = relogio(); if (S.diag.seg % 30 === 0) salvar(); }, 1000);
  }

  // ---------- relatório ----------
  var escolha = null;
  R.relatorio = function () {
    if (!diagFeito()) return '<div class="vazio"><h1>Relatório</h1><p>O relatório aparece depois do diagnóstico.</p><a class="btn pri" href="#diagnostico">Fazer o diagnóstico</a></div>';
    var dg = diagPorDisc(), n = notaDiag(), passa = n >= 40;
    if (!escolha) escolha = (S.dominio || recomendar()).slice();
    var grupos = ['A', 'B', 'C'].map(function (g) {
      var t = 0, ok = 0; D.forEach(function (d) { if (d.g === g) { t += dg[d.id].n; ok += dg[d.id].ok; } });
      return '<div class="kpi" style="border-top:4px solid ' + OAB.GRUPOS[g].cor + '"><div class="num">' + ok + '<span class="sub" style="font-size:1rem">/' + t + '</span></div><div class="sub">' + esc(OAB.GRUPOS[g].nome) + '</div></div>';
    }).join('');
    var ord = D.slice().sort(function (a, b) { return dg[b.id].ok / dg[b.id].n - dg[a.id].ok / dg[a.id].n; });
    var fortes = ord.filter(function (d) { return dg[d.id].ok / dg[d.id].n >= 0.7; });
    var fracos = ord.filter(function (d) { return dg[d.id].ok / dg[d.id].n < 0.4; }).sort(function (a, b) { return b.q - a.q; });
    var rec = recomendar();
    var cand = D.filter(function (d) { return d.g !== 'C' && d.id !== 'etica'; });
    // fórmula da aprovação
    var tEt = 8 * META.etica, tDom = 0, tOut = 0, qDom = 0, qOut = 0;
    D.forEach(function (d) { if (d.id === 'etica') return; if (escolha.indexOf(d.id) > -1) { tDom += d.q * META.dom; qDom += d.q; } else { tOut += d.q * META[d.g]; qOut += d.q; } });
    var tot = tEt + tDom + tOut;
    return '<div class="cab"><div><h1>Seu relatório</h1><p class="sub">Diagnóstico de ' + fmtData(iso(new Date(S.diag.fim)), true) + '</p></div>' + (ARTEFATO ? '' : '<button class="btn mini noprint" data-act="imprimir">Imprimir ou salvar em PDF</button>') + '</div>' +
      '<section class="hero" style="grid-template-columns:auto 1fr"><div><div class="num" style="font-size:4.2rem;color:' + (passa ? '#7BE3A8' : '#FF8A98') + '">' + n + '</div><div class="sub">de 80 questões</div></div>' +
      '<div><h2 style="color:#fff">' + (passa ? 'Hoje você já seria aprovado na 1ª fase.' : 'Faltam ' + (40 - n) + ' acertos para a aprovação.') + '</h2><p class="sub">' +
      (passa ? 'O trabalho agora é proteger essa nota e criar margem: o cronograma reforça suas disciplinas de domínio e transforma pontos fracos de baixo peso em pontos rápidos.' :
        'Não é preciso dominar as 20 disciplinas. A conta abaixo mostra como chegar lá concentrando energia onde a prova paga mais.') + '</p></div></section>' +
      boletimDiag() +
      '<div class="kpis" style="margin-bottom:16px">' + grupos + '</div>' +
      '<div class="grade g2"><div class="bloco"><h2>Acerto por disciplina</h2><div class="barras">' +
      D.map(function (d) { return barra(esc(d.curto), d.cor, dg[d.id].ok / dg[d.id].n, null, ' <span class="sub peq">(' + dg[d.id].ok + '/' + dg[d.id].n + ')</span>'); }).join('') + '</div></div>' +
      '<div class="pilha"><div class="bloco"><h3>Onde você já pontua</h3>' + (fortes.length ? '<div class="chips">' + fortes.map(function (d) { return tagDisc(d.id); }).join('') + '</div>' : '<p class="sub">Nenhuma disciplina acima de 70% ainda. Normal no começo.</p>') + '</div>' +
      '<div class="bloco"><h3>Onde está perdendo mais pontos</h3>' + (fracos.length ? '<p class="peq sub">Ordenadas pelo peso na prova.</p><div class="chips">' + fracos.map(function (d) { return tagDisc(d.id); }).join('') + '</div>' : '<p class="sub">Nenhuma disciplina abaixo de 40%.</p>') + '</div>' +
      '<div class="bloco"><h3>Ética: ' + dg.etica.ok + ' de 8</h3><p class="peq">' + (dg.etica.ok >= 6 ? 'Ótimo começo na disciplina mais previsível da prova. O Passo 2 mantém isso todos os dias.' : 'Ética vale 8 questões e é a mais previsível da prova. O Passo 2 coloca o Estatuto na sua rotina diária.') + '</p></div></div></div>' +
      '<div class="bloco" style="margin-top:16px"><h2>Suas 4 disciplinas de domínio</h2><p>Escolha 4 disciplinas de peso para se tornar forte. A sugestão combina seu desempenho no diagnóstico, suas afinidades e o número de questões de cada uma. Você pode trocar.</p><div class="chips" id="dom-chips">' +
      cand.map(function (d) { return '<button class="chip" data-dom="' + d.id + '" aria-pressed="' + (escolha.indexOf(d.id) > -1) + '"><span class="pt" style="background:' + d.cor + '"></span>' + esc(d.curto) + ' · ' + d.q + 'q · ' + pct(dg[d.id].ok / dg[d.id].n) + (rec.indexOf(d.id) > -1 ? ' ★' : '') + '</button>'; }).join('') +
      '</div><p class="peq sub" style="margin-top:8px">★ sugestão da plataforma · ' + escolha.length + ' de 4 escolhidas</p>' +
      '<h3 style="margin-top:20px">A fórmula da aprovação</h3><div class="formula">' +
      '<div class="termo"><small>Ética · 8 questões a 75%</small><span class="num">' + tEt.toFixed(0) + '</span></div><span class="op">+</span>' +
      '<div class="termo"><small>Domínio · ' + qDom + ' questões a 75%</small><span class="num">' + tDom.toFixed(1).replace('.', ',') + '</span></div><span class="op">+</span>' +
      '<div class="termo"><small>Demais · ' + qOut + ' questões a 45–50%</small><span class="num">' + tOut.toFixed(1).replace('.', ',') + '</span></div><span class="op">=</span>' +
      '<div class="termo total"><small>Nota-meta</small><span class="num">' + Math.round(tot) + '</span></div></div>' +
      '<p class="peq sub" style="margin-top:10px">Com 40 acertos você passa. A meta deixa margem de segurança sem exigir que você domine tudo.</p>' +
      '<p style="margin-top:16px" class="noprint"><button class="btn pri" data-act="gerar-crono"' + (escolha.length !== 4 ? ' disabled' : '') + '>' + (S.dominio ? 'Atualizar meu cronograma' : 'Gerar meu cronograma') + '</button></p></div>';
  };

  // ---------- cronograma ----------
  var verTudo = false;
  R.cronograma = function () {
    if (!S.dominio) return '<div class="vazio"><h1>Cronograma</h1><p>O cronograma é gerado a partir do relatório do diagnóstico.</p><a class="btn pri" href="' + (diagFeito() ? '#relatorio' : '#diagnostico') + '">' + (diagFeito() ? 'Ver relatório' : 'Fazer o diagnóstico') + '</a></div>';
    var c = crono();
    if (!c.length) return '<div class="vazio"><h1>Cronograma</h1><p>Não há dias de estudo entre hoje e a data da prova. Confira a data e os dias da semana no seu perfil.</p><a class="btn" href="#perfil">Abrir perfil</a></div>';
    var hj = hojeISO(), tot = 0, fe = 0;
    c.forEach(function (x) { x.it.forEach(function (_, i) { tot++; if (S.feito[x.data + ':' + i]) fe++; }); });
    var fases = [1, 2, 3].map(function (f) { var ds = c.filter(function (x) { return x.fase === f; }); return ds.length ? '<span class="fase">' + ['', 'Construção', 'Consolidação', 'Revisão final'][f] + ': ' + fmtData(ds[0].data) + ' a ' + fmtData(ds[ds.length - 1].data) + '</span>' : ''; }).join(' ');
    var lista = verTudo ? c : c.filter(function (x) { return x.data >= hj; }).slice(0, S.perfil.dias.length * 2);
    var sem = {}, ordem = [];
    lista.forEach(function (x) { var d = dataDe(x.data); d.setDate(d.getDate() - d.getDay()); var k = iso(d); if (!sem[k]) { sem[k] = []; ordem.push(k); } sem[k].push(x); });
    return '<div class="cab"><div><h1>Seu cronograma</h1><p class="sub">' + c.length + ' dias de estudo até ' + fmtData(S.perfil.prova, true) + ' · ' + S.perfil.horas + 'h por dia · ' + pct(tot ? fe / tot : 0) + ' concluído</p></div>' +
      '<div class="chips noprint"><button class="btn mini" data-act="ver-tudo">' + (verTudo ? 'Ver só as próximas semanas' : 'Ver o cronograma inteiro') + '</button>' + (ARTEFATO ? '' : '<button class="btn mini" data-act="imprimir">Imprimir</button>') + '</div></div>' +
      '<div class="bloco" style="margin-bottom:16px"><div class="chips">' + fases + '</div><p class="peq sub" style="margin:10px 0 0">Domínio: ' + S.dominio.map(tagDisc).join(' ') + ' · Legenda: ' + [1, 2, 3, 4, 5].map(function (n) { return passoTag(n) + ' ' + esc(OAB.PASSOS[n - 1].nome); }).join(' · ') + '</p></div>' +
      ordem.map(function (k) {
        return '<div class="bloco semana"><h3><span>Semana de ' + fmtData(k) + '</span></h3>' + sem[k].map(function (x) {
          var d = dataDe(x.data);
          return '<div class="dia' + (x.data === hj ? ' hoje' : '') + '"><div class="dt">' + SEMANA[d.getDay()] + ', ' + fmtData(x.data) + '<small>' + (x.sim ? 'Simulado' : ['', 'Construção', 'Consolidação', 'Revisão'][x.fase]) + '</small></div>' + tarefasHTML(x) + '</div>';
        }).join('') + '</div>';
      }).join('');
  };

  // ---------- sinopses ----------
  R.sinopses = function (arg) {
    if (arg && DM[arg]) {
      var d = DM[arg], s = OAB.SIN[arg];
      return '<p class="noprint"><a href="#sinopses" class="link">Todas as sinopses</a></p><div class="cab"><div><h1 style="color:' + d.cor + '">' + esc(d.nome) + '</h1><p class="sub">' + d.q + ' questões na prova · ' + esc(OAB.GRUPOS[d.g].nome) + (S.dominio && S.dominio.indexOf(d.id) > -1 ? ' · <span class="dom-mark">★ disciplina de domínio</span>' : '') + '</p></div>' +
        '<div class="chips noprint"><a class="btn pri" href="#exercicios/' + arg + '">Praticar ' + esc(d.curto) + '</a><a class="btn" href="#estudio">Gravar explicação</a></div></div>' +
        '<div class="grade" style="grid-template-columns:minmax(0,1.6fr) minmax(240px,1fr);align-items:start" id="sin-grid"><div class="bloco" style="border-top:5px solid ' + d.cor + '"><h2>O que mais cai</h2>' +
        s.tm.map(function (t) { return '<div class="tema"><h3>' + esc(t.t) + '</h3><ul>' + t.p.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>'; }).join('') +
        '</div><div class="pilha"><div class="peg"><h3>Pegadinhas da banca</h3><ul>' + s.pg.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="bloco"><h3>Lei seca obrigatória</h3><ul style="padding-left:1.2rem;margin:0">' + s.lei.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        blocoCaiu(arg) + '<div class="bloco"><h3>Passo 4 · seu resumo</h3><p class="peq">Depois de ler, escreva à mão uma página com o que você lembra. O que não veio à memória é o que você revisa amanhã.</p></div></div></div>';
    }
    return '<div class="cab"><div><h1>Sinopses</h1><p class="sub">Uma página por disciplina, com o que a FGV mais cobra. Ordenadas pelo peso na prova.</p></div></div>' +
      ['A', 'B', 'C'].map(function (g) {
        return '<h2 style="margin-top:22px">' + esc(OAB.GRUPOS[g].nome) + '</h2><div class="grade g3">' + D.filter(function (d) { return d.g === g; }).map(function (d) {
          var x = dominio(d.id);
          return '<a class="disc-card" href="#sinopses/' + d.id + '" style="--c:' + d.cor + '"><span class="sub peq">' + d.q + ' questões' + (S.dominio && S.dominio.indexOf(d.id) > -1 ? ' · <span class="dom-mark">★ domínio</span>' : '') + '</span><h3>' + esc(d.nome) + '</h3><span class="sub peq">' + OAB.SIN[d.id].tm.length + ' temas · domínio ' + pct(x) + '</span></a>';
        }).join('') + '</div>';
      }).join('');
  };

  // ---------- exercícios ----------
  var sess = null;
  function poolDisc(d) {
    var u = ultimaTentativa(), tr = {}; S.hist.forEach(function (h) { tr[h.q] = 1; });
    var l = OAB.Q.filter(function (q) { return q.d === d; });
    return l.sort(function (a, b) {
      var pa = !tr[a.id] ? (a.diag ? 1 : 0) : (u[a.id] && !u[a.id].ok ? 2 : 3), pb = !tr[b.id] ? (b.diag ? 1 : 0) : (u[b.id] && !u[b.id].ok ? 2 : 3);
      return pa - pb;
    }).map(function (q) { return q.id; });
  }
  function novaSessao(modo) {
    var l;
    if (modo === 'erros') l = errosAtuais();
    else if (modo === 'mix') {
      var r = rng(Date.now() & 0xffffffff), ds = (S.dominio || []).concat(['etica']);
      var pesos = D.map(function (d) { return ds.indexOf(d.id) > -1 ? 3 : 1; });
      var seq = rodizio(D.map(function (d) { return d.id; }), pesos, 10), usados = {};
      l = seq.map(function (d) { var p = poolDisc(d).filter(function (id) { return !usados[id]; }); var id = p[Math.floor(r() * Math.min(3, p.length))]; if (id) usados[id] = 1; return id; }).filter(Boolean);
    } else l = poolDisc(modo);
    sess = {modo: modo, l: l, i: 0, resp: {}, ok: 0};
  }
  R.exercicios = function (arg) {
    if (arg) {
      if (!sess || sess.modo !== arg) novaSessao(arg);
      if (!sess.l.length) return '<p><a class="link" href="#exercicios">Voltar</a></p><div class="vazio"><h2>Nada por aqui</h2><p>' + (arg === 'erros' ? 'Você não tem questões erradas pendentes.' : 'Sem questões nesta disciplina ainda.') + '</p></div>';
      if (sess.i >= sess.l.length) {
        var n = Object.keys(sess.resp).length;
        if (!sess.registrada && n) {
          sess.registrada = true; S.sessoes = S.sessoes || [];
          S.sessoes.push({t: Date.now(), modo: sess.modo, n: n, ok: sess.ok, proj: projecao(), det: Object.keys(sess.resp).map(function (id) { return {d: QM[id].d, ok: sess.resp[id] === QM[id].c}; })});
          if (S.sessoes.length > 60) S.sessoes = S.sessoes.slice(-60); salvar();
        }
        return '<p><a class="link" href="#exercicios">Voltar</a></p><div class="bloco questao"><h1>Sessão concluída</h1><p class="num">' + sess.ok + '/' + n + '</p><p class="sub">acertos nesta sessão</p><div class="chips"><button class="btn pri" data-act="ex-novo">Treinar de novo</button><a class="btn" href="#painel">Ir para o painel</a></div></div>' + boletimSessao();
      }
      var id = sess.l[sess.i], q = QM[id], o = ordemAlt(q), r = sess.resp[id];
      var titulo = arg === 'erros' ? 'Revisão de erros' : arg === 'mix' ? 'Treino do dia' : DM[arg].nome;
      return '<p><a class="link" href="#exercicios">Exercícios</a></p><div class="cab"><div><h1 style="font-size:1.6rem">' + esc(titulo) + '</h1><p class="sub">Questão ' + (sess.i + 1) + ' de ' + sess.l.length + ' · ' + sess.ok + ' acertos</p></div></div>' +
        '<div class="prog"><i style="width:' + (sess.i / sess.l.length * 100) + '%"></i></div><div class="questao"><p>' + tagDisc(q.d) + ' <span class="sub peq">' + esc(q.t) + (q.ex ? ' · ' + q.ex + 'º Exame' : '') + '</span></p><div class="enun">' + esc(q.e) + '</div><div class="alts">' +
        o.map(function (oi, k) {
          var cls = r == null ? '' : oi === q.c ? ' cert' : oi === r ? ' errd' : '';
          return '<button class="alt' + cls + '" data-ex-alt="' + oi + '"' + (r != null ? ' disabled' : '') + '><span class="lt">' + 'ABCD'[k] + '</span><span>' + esc(q.a[oi]) + '</span></button>';
        }).join('') + '</div>' +
        (r != null ? '<div class="coment"><b>' + (r === q.c ? 'Correto.' : 'A resposta é a letra ' + 'ABCD'[o.indexOf(q.c)] + '.') + '</b> ' + esc(q.x) + '</div>' : '') +
        '<div class="barra-q">' + (r == null ? '<button class="btn" data-ex-alt="-1">Não sei</button><span></span>' : '<a class="btn mini" href="#sinopses/' + q.d + '">Ver sinopse</a><button class="btn pri" data-act="ex-prox">' + (sess.i + 1 < sess.l.length ? 'Próxima' : 'Ver resultado') + '</button>') + '</div></div>';
    }
    var er = errosAtuais().length;
    return '<div class="cab"><div><h1>Exercícios</h1><p class="sub">Questões no estilo FGV com comentário e fundamento legal.</p></div></div>' +
      '<div class="grade g3" style="margin-bottom:22px"><a class="disc-card" href="#exercicios/mix" style="--c:var(--dourado)"><h3>Treino do dia</h3><span class="sub peq">10 questões, com mais peso nas suas disciplinas de domínio e em Ética.</span></a>' +
      '<a class="disc-card" href="#exercicios/erros" style="--c:var(--vermelho)"><h3>Revisão de erros</h3><span class="sub peq">' + er + ' questões que você errou na última tentativa.</span></a></div>' +
      '<div class="bloco"><table class="t"><thead><tr><th>Disciplina</th><th>Na prova</th><th>Banco</th><th>Domínio</th><th></th></tr></thead><tbody>' +
      D.map(function (d) {
        var nq = OAB.Q.filter(function (q) { return q.d === d.id; }).length;
        return '<tr><td>' + tagDisc(d.id) + (S.dominio && S.dominio.indexOf(d.id) > -1 ? ' <span class="dom-mark">★</span>' : '') + '</td><td>' + d.q + '</td><td>' + nq + '</td><td>' + pct(dominio(d.id)) + '</td><td><a class="btn mini" href="#exercicios/' + d.id + '">Treinar</a></td></tr>';
      }).join('') + '</tbody></table></div>';
  };

  // ---------- provas anteriores (Passo 1): treino com prova oficial ----------
  // O aluno resolve no caderno oficial (Tipo 1) e marca aqui; a plataforma corrige pelo gabarito e desmonta por disciplina.
  var LETRAS = 'ABCD';
  function oficial(n) { S.oficiais = S.oficiais || {}; return S.oficiais[n] || null; }
  function corrigirOficial(n) {
    var p = OAB.PROVAS[n], o = oficial(n), porD = {}, nota = 0, erros = [];
    D.forEach(function (d) { porD[d.id] = {n: 0, ok: 0}; });
    for (var q = 1; q <= 80; q++) {
      var g = p.gab[q - 1], r = o && o.resp[q], d = OAB.discDaQuestao(q), ok = g === 'X' || r === g;
      porD[d].n++; if (ok) { porD[d].ok++; nota++; } else erros.push({q: q, d: d, r: r || '', g: g, t: p.temas.split('|')[q - 1]});
    }
    return {nota: nota, porD: porD, erros: erros};
  }
  // conta as provas oficiais concluídas como evidência de domínio por disciplina
  function oficiaisDisc(d, ate) {
    var r = {n: 0, ok: 0};
    Object.keys(S.oficiais || {}).forEach(function (n) {
      var o = S.oficiais[n]; if (!o.fim || (ate != null && o.fim > ate) || !OAB.PROVAS[n]) return;
      var c = corrigirOficial(n).porD[d]; r.n += c.n; r.ok += c.ok;
    });
    return r;
  }
  function errosOficiais() {
    var l = [];
    Object.keys(S.oficiais || {}).forEach(function (n) { if (S.oficiais[n].fim) corrigirOficial(n).erros.forEach(function (e) { e.ex = n; l.push(e); }); });
    return l;
  }
  function temasProvas(d) {
    var l = [];
    EXAMES.forEach(function (e) {
      var p = OAB.PROVAS[e.n]; if (!p) return;
      var t = p.temas.split('|');
      OAB.FAIXAS.forEach(function (f) { if (f[0] !== d) return; for (var q = f[1]; q <= f[2]; q++) l.push({ex: e.n, q: q, t: t[q - 1], anulada: p.gab[q - 1] === 'X'}); });
    });
    return l;
  }
  function boletimOficial(n, res) {
    var cols;
    if (vistaDiag === 'grupos') {
      cols = [['ÉTICA', 'Passo 2', ['etica']]].concat(['A', 'B', 'C'].map(function (g) {
        return ['GRUPO ' + g, {A: 'decidem a prova', B: 'meio-campo', C: 'pontos rápidos'}[g], D.filter(function (d) { return d.g === g && d.id !== 'etica'; }).map(function (d) { return d.id; })];
      })).map(function (x) {
        var t = 0, ok = 0, m = 0, mq = 0;
        x[2].forEach(function (id) { t += res.porD[id].n; ok += res.porD[id].ok; mq += DM[id].q; m += DM[id].q * metaDisc(DM[id]); });
        return {rot: x[0], sub: x[1], a: ok / t, aTxt: pct(ok / t), b: m / mq, bTxt: pct(m / mq), ico: ok / t, leg: 'acertos', val: ok + '/' + t};
      });
    } else {
      cols = D.filter(function (d) { return d.g === vistaDiag; }).map(function (d) {
        var r = res.porD[d.id], p = r.ok / r.n;
        return {rot: d.curto.toUpperCase(), sub: r.n + ' questões', a: p, aTxt: pct(p), b: metaDisc(d), bTxt: pct(metaDisc(d)), ico: p, leg: 'acertos', val: r.ok + '/' + r.n};
      });
    }
    var abas = '<div class="tv-abas" role="tablist">' + [['grupos', 'Por grupo'], ['A', 'Grupo A'], ['B', 'Grupo B'], ['C', 'Grupo C']].map(function (x) {
      return '<button role="tab" aria-selected="' + (vistaDiag === x[0]) + '" data-vdiag="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>';
    return boletim({titulo: 'SUA PROVA DO ' + n + 'º EXAME', fonte: 'GABARITO OFICIAL DA FGV · CADERNO TIPO 1', legA: 'seu acerto', legB: 'sua meta', cols: cols, abas: abas,
      tag: 'PROVA OFICIAL', manchete: 'NOTA ' + res.nota + ' DE 80: ' + (res.nota >= 40 ? 'APROVADO NA 1ª FASE' : 'FALTARAM ' + (40 - res.nota) + ' ACERTOS'),
      linha: tempoTxt(D.map(function (d) { return {nome: d.curto, p: res.porD[d.id].ok / res.porD[d.id].n}; })),
      ticker: D.map(function (d) { return d.curto.toUpperCase() + ' ' + res.porD[d.id].ok + '/' + res.porD[d.id].n; })});
  }
  function blocoCaiu(d) {
    var l = temasProvas(d); if (!l.length) return '';
    return '<div class="bloco"><h3>O que caiu nas últimas 10 provas</h3><p class="peq sub">Assunto de cada questão, do 47º ao 38º Exame (resumo aproximado).</p><ul class="caiu">' +
      l.map(function (x) { return '<li><span class="tag">' + x.ex + 'º · q' + x.q + '</span> ' + esc(x.t) + '</li>'; }).join('') + '</ul></div>';
  }
  R.provas = function (arg) {
    var n = arg && OAB.PROVAS[arg] ? +arg : null;
    if (n) return telaProva(n);
    var feitas = EXAMES.filter(function (e) { var o = oficial(e.n); return o && o.fim; });
    var graf = '';
    if (feitas.length) {
      var w = 560, hgt = 170, l = feitas.slice().reverse();
      var pts = l.map(function (e, i) { var nt = corrigirOficial(e.n).nota; return {x: l.length === 1 ? w / 2 : 40 + i * (w - 80) / (l.length - 1), y: hgt - 26 - (nt / 80) * (hgt - 50), nt: nt, e: e}; });
      var yc = hgt - 26 - (40 / 80) * (hgt - 50);
      graf = '<svg viewBox="0 0 ' + w + ' ' + hgt + '" style="width:100%;max-width:640px;height:auto" role="img" aria-label="Evolução das notas nas provas oficiais">' +
        '<line x1="20" x2="' + (w - 10) + '" y1="' + yc + '" y2="' + yc + '" stroke="var(--dourado)" stroke-dasharray="5 5"/><text x="22" y="' + (yc - 6) + '" font-size="12" fill="var(--tinta2)">40 = aprovação</text>' +
        (pts.length > 1 ? '<polyline fill="none" stroke="var(--tinta)" stroke-width="2.5" points="' + pts.map(function (p) { return p.x + ',' + p.y; }).join(' ') + '"/>' : '') +
        pts.map(function (p) { return '<circle cx="' + p.x + '" cy="' + p.y + '" r="5" fill="var(--papel2)" stroke="var(--tinta)" stroke-width="2.5"/><text x="' + p.x + '" y="' + (p.y - 11) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tinta)">' + p.nt + '</text><text x="' + p.x + '" y="' + (hgt - 6) + '" text-anchor="middle" font-size="11" fill="var(--tinta2)">' + p.e.n + 'º</text>'; }).join('') + '</svg>';
    }
    return '<div class="cab"><div><h1>Provas anteriores</h1><p class="sub">Passo 1 · Conheça seu inimigo. As 10 últimas provas da 1ª fase, do 38º ao 47º Exame, corrigidas pelo gabarito oficial.</p></div></div>' +
      '<div class="bloco" style="margin-bottom:16px"><h2>Como treinar com a prova oficial</h2><ol class="passos-lista">' +
      '<li><span class="n">1</span><div>Abra o caderno <b>Tipo 1 (branco)</b> do exame escolhido.</div></li>' +
      '<li><span class="n">2</span><div>Resolva em até 5 horas e marque suas respostas no cartão-resposta da plataforma.</div></li>' +
      '<li><span class="n">3</span><div>Toque em <b>Corrigir</b>. Questões anuladas valem ponto para todos, como na prova real.</div></li>' +
      '<li><span class="n">4</span><div>Veja o boletim por disciplina e os assuntos que você errou. Eles entram no seu relatório e no cronograma.</div></li></ol></div>' +
      '<div class="grade g2"><div class="bloco"><table class="t"><thead><tr><th>Exame</th><th>Data</th><th>Situação</th><th></th></tr></thead><tbody>' +
      EXAMES.map(function (e) {
        var o = oficial(e.n), st = !o ? '<span class="sub">não iniciada</span>' : o.fim ? '<b>' + corrigirOficial(e.n).nota + '</b>/80' : '<span class="tag">em andamento · ' + Object.keys(o.resp).length + '/80</span>';
        return '<tr><td><b>' + e.n + 'º</b></td><td>' + fmtData(OAB.PROVAS[e.n].data, true) + '</td><td>' + st + '</td><td><a class="btn mini" href="#provas/' + e.n + '">' + (!o ? 'Resolver' : o.fim ? 'Ver resultado' : 'Continuar') + '</a></td></tr>';
      }).join('') + '</tbody></table></div><div class="bloco"><h2>Sua evolução</h2>' + (graf || '<p class="sub">Corrija a primeira prova para ver o gráfico.</p>') +
      (nuvem.admin ? '<div style="margin-top:20px;border-top:1px solid var(--linha);padding-top:14px"><h3>Administração · importar questões</h3><p class="peq sub">Envie um arquivo questoes-provas.json (formato do banco, com o campo "ex" = número do exame).</p><input type="file" id="imp-provas" accept=".json"><p class="msg" id="imp-msg"></p></div>' : '') +
      '</div></div>';
  };
  function telaProva(n) {
    var p = OAB.PROVAS[n], o = oficial(n);
    var links = '<a class="btn" href="https://jurisway.org.br/provas/oab/eou/' + n + '" target="_blank" rel="noopener">Abrir o caderno do ' + n + 'º Exame</a> <a class="btn" href="https://oab.fgv.br/" target="_blank" rel="noopener">Site da FGV</a>';
    var topo = '<p class="noprint"><a href="#provas" class="link">Provas anteriores</a></p>';
    if (!o) {
      return topo + '<div class="cab"><div><h1>' + n + 'º Exame de Ordem</h1><p class="sub">Edição ' + p.ed + ' · aplicada em ' + fmtData(p.data, true) + '</p></div></div>' +
        '<div class="bloco questao"><p>Use o caderno <b>Tipo 1 (branco)</b>. A ordem das questões dos outros tipos é diferente e a correção sairia errada.</p><p class="chips">' + links + '</p>' +
        '<p class="peq sub">Gabarito: ' + esc(p.fonte) + '.</p><button class="btn pri" data-act="of-iniciar" data-ex="' + n + '">Começar a prova</button></div>';
    }
    if (o.fim) {
      var res = corrigirOficial(n);
      return topo + '<div class="cab"><div><h1>' + n + 'º Exame: ' + res.nota + ' de 80</h1><p class="sub">Corrigida em ' + fmtData(iso(new Date(o.fim)), true) + ' pelo gabarito oficial (caderno Tipo 1).</p></div>' +
        '<div class="chips noprint"><button class="btn mini" data-act="of-refazer" data-ex="' + n + '">Refazer esta prova</button></div></div>' + boletimOficial(n, res) +
        '<div class="bloco"><h2>Questões que você errou (' + res.erros.length + ')</h2>' + (res.erros.length ? '<div style="overflow-x:auto"><table class="t"><thead><tr><th>Nº</th><th>Disciplina</th><th>Assunto</th><th>Você</th><th>Gabarito</th><th></th></tr></thead><tbody>' +
        res.erros.map(function (e) { return '<tr><td><b>' + e.q + '</b></td><td>' + tagDisc(e.d) + '</td><td>' + esc(e.t) + '</td><td>' + (e.r || '<span class="sub">branco</span>') + '</td><td><b>' + e.g + '</b></td><td><a class="btn mini" href="#sinopses/' + e.d + '">Sinopse</a></td></tr>'; }).join('') +
        '</tbody></table></div><p class="peq sub" style="margin-top:10px">O assunto é um resumo aproximado. Releia a questão no caderno para entender o erro.</p>' : '<p>Gabaritou. Impressionante.</p>') + '</div>';
    }
    var resp = Object.keys(o.resp).length;
    return topo + '<div class="cab"><div><h1 style="font-size:1.6rem">' + n + 'º Exame · cartão-resposta</h1><p class="sub">' + resp + ' de 80 marcadas · caderno Tipo 1</p></div><div class="sub" id="relogio-of">' + relogioOf(o) + '</div></div>' +
      '<div class="prog"><i style="width:' + (resp / 80 * 100) + '%"></i></div><p class="chips noprint">' + links + '</p>' +
      '<div class="grade g2">' + OAB.FAIXAS.map(function (f) {
        var d = DM[f[0]], h = '<div class="bloco cr"><h3><span class="pt" style="background:' + d.cor + '"></span> ' + esc(d.nome) + '</h3>';
        for (var q = f[1]; q <= f[2]; q++) {
          h += '<div class="cr-l"><b>' + q + '</b>' + LETRAS.split('').map(function (L) { return '<button class="cr-b' + (o.resp[q] === L ? ' on' : '') + '" data-of="' + n + ':' + q + ':' + L + '" aria-label="Questão ' + q + ', letra ' + L + '" aria-pressed="' + (o.resp[q] === L) + '">' + L + '</button>'; }).join('') + '</div>';
        }
        return h + '</div>';
      }).join('') + '</div><p style="margin-top:16px"><button class="btn ouro" data-act="of-corrigir" data-ex="' + n + '">Corrigir a prova</button></p>';
  }
  function relogioOf(o) { var s = o.seg || 0; return 'Tempo: ' + Math.floor(s / 3600) + 'h' + String(Math.floor(s / 60) % 60).padStart(2, '0') + ' de 5h00'; }
  var cronOf = null;
  function ligarRelogioOf(n) {
    if (cronOf) clearInterval(cronOf);
    cronOf = setInterval(function () { var o = oficial(n); if (!o || o.fim || document.hidden) return; o.seg = (o.seg || 0) + 1; var e = $('#relogio-of'); if (e) e.textContent = relogioOf(o); if (o.seg % 30 === 0) salvar(); }, 1000);
  }

  // ---------- estúdio de áudio (Passo 5) ----------
  var gravador = null, pedacos = [];
  function idb() {
    return new Promise(function (ok, er) {
      try { var r = indexedDB.open('ontop-audios', 1); r.onupgradeneeded = function () { r.result.createObjectStore('a', {keyPath: 'id'}); }; r.onsuccess = function () { ok(r.result); }; r.onerror = function () { er(r.error); }; } catch (e) { er(e); }
    });
  }
  function idbTx(modo, fn) { return idb().then(function (db) { return new Promise(function (ok, er) { var t = db.transaction('a', modo), s = t.objectStore('a'), r = fn(s); t.oncomplete = function () { ok(r && r.result); }; t.onerror = function () { er(t.error); }; }); }); }
  R.estudio = function () {
    setTimeout(listarAudios, 0);
    return '<div class="cab"><div><h1>Estúdio de áudio</h1><p class="sub">Passo 5 · Grave o que estudou. Explicar em voz alta, com suas palavras, revela o que você ainda não entendeu.</p></div></div>' +
      '<div class="grade g2"><div class="bloco"><h2>Nova gravação</h2><label>Disciplina<select id="au-d">' + D.map(function (d) { return '<option value="' + d.id + '">' + esc(d.nome) + '</option>'; }).join('') + '</select></label>' +
      '<label>Tema<input id="au-t" placeholder="Ex.: prescrição disciplinar"></label>' +
      '<div style="display:flex;gap:16px;align-items:center"><button class="rec" id="au-rec" aria-label="Gravar"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3m5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9z"/></svg></button><span id="au-st" class="sub">Toque para gravar. Fale por 2 a 3 minutos.</span></div>' +
      '<p class="peq sub" style="margin-top:14px">Roteiro: 1) o que é; 2) o artigo de lei; 3) a pegadinha que a banca usa; 4) um exemplo.</p></div>' +
      '<div class="bloco"><h2>Suas gravações</h2><div id="au-lista" class="pilha"><p class="sub">Carregando…</p></div><p class="peq sub" style="margin-top:12px">Os áudios ficam guardados neste aparelho.</p></div></div>';
  };
  function listarAudios() {
    var el = $('#au-lista'); if (!el) return;
    idbTx('readonly', function (s) { return s.getAll(); }).then(function (l) {
      l = (l || []).sort(function (a, b) { return b.id - a.id; });
      if (!l.length) { el.innerHTML = '<p class="sub">Nenhuma gravação ainda.</p>'; return; }
      el.innerHTML = l.map(function (a) { return '<div><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span>' + tagDisc(a.d) + ' ' + esc(a.t || 'Sem tema') + ' <span class="sub peq">' + new Date(a.id).toLocaleDateString('pt-BR') + '</span></span><button class="link" data-au-del="' + a.id + '">Apagar</button></div><audio controls preload="none" style="width:100%;margin-top:6px" src="' + URL.createObjectURL(a.blob) + '"></audio></div>'; }).join('');
    }).catch(function () { el.innerHTML = '<p class="sub">Este navegador não permite guardar áudios.</p>'; });
  }
  function alternarGravacao() {
    var st = $('#au-st'), bt = $('#au-rec');
    if (gravador && gravador.state === 'recording') { gravador.stop(); return; }
    if (!navigator.mediaDevices || !window.MediaRecorder) { st.textContent = 'Este navegador não permite gravar áudio. Use o gravador do celular.'; return; }
    navigator.mediaDevices.getUserMedia({audio: true}).then(function (stream) {
      pedacos = []; gravador = new MediaRecorder(stream);
      gravador.ondataavailable = function (e) { if (e.data.size) pedacos.push(e.data); };
      gravador.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); }); bt.classList.remove('on'); st.textContent = 'Gravação salva.';
        var a = {id: Date.now(), d: $('#au-d').value, t: $('#au-t').value.trim(), blob: new Blob(pedacos, {type: gravador.mimeType || 'audio/webm'})};
        idbTx('readwrite', function (s) { return s.put(a); }).then(listarAudios).catch(function () { st.textContent = 'Não foi possível guardar a gravação.'; });
      };
      gravador.start(); bt.classList.add('on'); st.textContent = 'Gravando… toque de novo para parar.';
    }).catch(function () { st.textContent = 'Permita o uso do microfone para gravar.'; });
  }

  // ---------- roteador ----------
  var rota = '';
  function render() {
    var h = (location.hash || '#painel').slice(1).split('/'), r = h[0] || 'painel', arg = h[1];
    if (!S.perfil && r !== 'perfil') r = 'boasvindas';
    if (!R[r]) r = 'painel';
    if (r !== 'diagnostico') pararRelogio();
    if (cronOf) { clearInterval(cronOf); cronOf = null; }
    if (r !== 'relatorio') escolha = null;
    if (r !== 'exercicios' || (sess && sess.modo !== arg)) { if (r !== 'exercicios') sess = null; }
    var main = $('#main');
    main.innerHTML = R[r](arg);
    $$('#menu a').forEach(function (a) { a.classList.toggle('on', a.dataset.r === r); });
    if (r === 'diagnostico' && S.diag.ini && !S.diag.fim) ligarRelogio();
    if (r === 'provas' && arg && oficial(arg) && !oficial(arg).fim) ligarRelogioOf(arg);
    var mud = rota !== location.hash; rota = location.hash;
    if (mud) { window.scrollTo(0, 0); main.focus({preventScroll: true}); }
    ajustarGrades();
  }
  function ajustarGrades() { ['#diag-grid', '#sin-grid'].forEach(function (s) { var g = $(s); if (g && window.innerWidth < 860) g.style.gridTemplateColumns = '1fr'; }); }
  window.addEventListener('hashchange', render);
  window.addEventListener('resize', function () { ajustarGrades(); });

  // ---------- eventos ----------
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('button, [data-feito]'); if (!t) return;
    var ds = t.dataset;
    if (ds.dia != null) { t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') !== 'true'); return; }
    if (ds.af) { t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') !== 'true'); return; }
    if (ds.vdiag) { vistaDiag = ds.vdiag; render(); return; }
    if (ds.of) {
      var pz = ds.of.split(':'), oo = oficial(pz[0]); if (!oo || oo.fim) return;
      if (oo.resp[pz[1]] === pz[2]) delete oo.resp[pz[1]]; else oo.resp[pz[1]] = pz[2];
      salvar();
      $$('[data-of^="' + pz[0] + ':' + pz[1] + ':"]').forEach(function (b) { var on = oo.resp[pz[1]] === b.dataset.of.split(':')[2]; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      var nr = Object.keys(oo.resp).length, sb = $('.cab .sub'), pg = $('.prog i'); if (sb) sb.textContent = nr + ' de 80 marcadas · caderno Tipo 1'; if (pg) pg.style.width = (nr / 80 * 100) + '%';
      return;
    }
    if (ds.tema) { lsSet('ontop-tema', ds.tema); aplicarTema(); render(); return; }
    if (ds.dom) {
      var i = escolha.indexOf(ds.dom);
      if (i > -1) escolha.splice(i, 1); else if (escolha.length < 4) escolha.push(ds.dom); else { toast('Escolha no máximo 4. Desmarque uma antes.'); return; }
      render(); return;
    }
    if (ds.diagAlt != null) { S.diag.resp[DIAG[S.diag.atual]] = +ds.diagAlt; if (S.diag.atual < 79) S.diag.atual++; salvar(); render(); return; }
    if (ds.irQ != null) { S.diag.atual = +ds.irQ; salvar(); render(); return; }
    if (ds.exAlt != null) {
      var id = sess.l[sess.i], q = QM[id], r = +ds.exAlt; sess.resp[id] = r; if (r === q.c) sess.ok++;
      S.hist.push({q: id, ok: r === q.c, t: Date.now()}); if (S.hist.length > 4000) S.hist = S.hist.slice(-4000);
      salvar(); render(); return;
    }
    if (ds.auDel) { idbTx('readwrite', function (s) { return s.delete(+ds.auDel); }).then(listarAudios); return; }
    if (t.id === 'au-rec') { alternarGravacao(); return; }
    var a = ds.act; if (!a) return;
    if (a === 'of-iniciar') { S.oficiais = S.oficiais || {}; S.oficiais[ds.ex] = {resp: {}, ini: Date.now(), fim: null, seg: 0}; salvar(); render(); return; }
    if (a === 'of-corrigir') {
      var ofo = oficial(ds.ex), fz = 80 - Object.keys(ofo.resp).length;
      var fecha = function () { ofo.fim = Date.now(); S.provas[ds.ex] = {nota: corrigirOficial(ds.ex).nota, t: Date.now()}; salvar(); window.scrollTo(0, 0); render(); };
      if (fz) confirmar('Faltam ' + fz + ' questões sem marcação. Elas contam como erro (salvo as anuladas).', 'Corrigir mesmo assim', fecha); else fecha();
      return;
    }
    if (a === 'of-refazer') { confirmar('Apagar suas respostas do ' + ds.ex + 'º Exame e começar de novo?', 'Refazer a prova', function () { delete S.oficiais[ds.ex]; delete S.provas[ds.ex]; salvar(); render(); }); return; }
    if (a === 'iniciar-diag') { S.diag.ini = Date.now(); S.diag.atual = 0; salvar(); render(); }
    else if (a === 'd-prox') { S.diag.atual = Math.min(79, S.diag.atual + 1); salvar(); render(); }
    else if (a === 'd-ant') { S.diag.atual = Math.max(0, S.diag.atual - 1); salvar(); render(); }
    else if (a === 'd-fim') {
      var faltam = 80 - Object.keys(S.diag.resp).length;
      var entregar = function () { S.diag.fim = Date.now(); pararRelogio(); invalidarCrono(); salvar(); location.hash = '#relatorio'; };
      if (faltam) confirmar('Você deixou ' + faltam + ' questões em branco. Elas contam como erro.', 'Entregar mesmo assim', entregar); else entregar();
    }
    else if (a === 'refazer-diag') {
      confirmar('Refazer o diagnóstico apaga as respostas atuais dele. Seu treino e cronograma continuam.', 'Refazer diagnóstico', function () {
        S.diag = {resp: {}, atual: 0, ini: null, fim: null, seg: 0}; S.seed = Math.floor(Math.random() * 1e9); salvar(); render();
      });
    }
    else if (a === 'gerar-crono') {
      S.dominio = escolha.slice(); S.crono = {ini: hojeISO(), at: Date.now()}; invalidarCrono(); salvar(); toast('Cronograma gerado.'); location.hash = '#cronograma';
    }
    else if (a === 'ver-tudo') { verTudo = !verTudo; render(); }
    else if (a === 'imprimir') { window.print(); }
    else if (a === 'ex-prox') { sess.i++; render(); }
    else if (a === 'ex-novo') { novaSessao(sess.modo); render(); }
    else if (a === 'backup') {
      var b = new Blob([JSON.stringify(S)], {type: 'application/json'}), u = URL.createObjectURL(b), l = document.createElement('a');
      l.href = u; l.download = 'on-top-oab-backup-' + hojeISO() + '.json'; document.body.appendChild(l); l.click(); l.remove();
    }
    else if (a === 'zerar') { confirmar('Apagar todo o seu progresso neste aparelho' + (nuvem.ativo ? ' e na sua conta' : '') + '?', 'Apagar tudo', function () { S = novoEstado(); invalidarCrono(); salvar(); location.hash = '#perfil'; render(); }); }
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.dataset.feito) { S.feito[t.dataset.feito] = t.checked; if (!t.checked) delete S.feito[t.dataset.feito]; salvar(); t.closest('.tarefa').classList.toggle('feita', t.checked); return; }
    if (t.dataset.prova) { var v = t.value === '' ? null : Math.max(0, Math.min(80, parseInt(t.value, 10))); S.provas[t.dataset.prova] = {nota: v, t: Date.now()}; salvar(); render(); return; }
    if (t.id === 'restaurar' && t.files[0]) {
      t.files[0].text().then(function (x) { var s = JSON.parse(x); if (!s || s.v !== 1) throw 0; S = s; invalidarCrono(); salvar(); toast('Cópia restaurada.'); render(); }).catch(function () { toast('Arquivo inválido.'); });
      return;
    }
    if (t.id === 'imp-provas' && t.files[0]) { nuvem.importar(t.files[0]); }
  });
  document.addEventListener('submit', function (ev) {
    if (ev.target.id !== 'f-perfil') return;
    ev.preventDefault();
    var dias = $$('[data-dia][aria-pressed="true"]').map(function (b) { return +b.dataset.dia; });
    var afin = $$('[data-af][aria-pressed="true"]').map(function (b) { return b.dataset.af; });
    var prova = $('#p-prova').value, m = $('#p-msg');
    if (!dias.length) { m.className = 'msg bad'; m.textContent = 'Escolha pelo menos um dia de estudo.'; return; }
    if (diasAte(prova) < 1) { m.className = 'msg bad'; m.textContent = 'A data da prova precisa ser depois de hoje.'; return; }
    var novo = !S.perfil;
    S.perfil = {nome: $('#p-nome').value.trim(), prova: prova, dias: dias, horas: +$('#p-horas').value, afin: afin};
    invalidarCrono(); salvar();
    if (novo) location.hash = '#diagnostico'; else { toast('Perfil salvo.'); render(); }
  });

  function aplicarTema() { var t = lsGet('ontop-tema') || 'auto'; if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); }
  aplicarTema();

  // ---------- conta e nuvem (Supabase, opcional) ----------
  var cfg = window.ONTOP_CONFIG || {};
  var nuvem = {ativo: false, admin: false, nome: '', sb: null, uid: null};
  nuvem.enviar = async function () {
    try {
      var r = await nuvem.sb.from('progresso').select('estado').eq('user_id', nuvem.uid).maybeSingle();
      var e = (r.data && r.data.estado) || {}; if (!e.cargos) { var leg = {}; if (e.state) leg['advogado-transpetro'] = e; e = {cargos: leg}; }
      e.cargos[CARGO] = S;
      await nuvem.sb.from('progresso').upsert({user_id: nuvem.uid, estado: e, atualizado_em: new Date().toISOString()});
    } catch (err) { console.warn('sincronização falhou', err); }
  };
  nuvem.importar = async function (f) {
    var m = $('#imp-msg');
    try {
      var l = JSON.parse(await f.text()); if (!Array.isArray(l)) throw new Error('O arquivo precisa conter uma lista de questões.');
      var r = await nuvem.sb.storage.from('conteudo').upload('oab/questoes-provas.json', new Blob([JSON.stringify(l)], {type: 'application/json'}), {upsert: true, contentType: 'application/json', cacheControl: '60'});
      if (r.error) throw r.error;
      m.className = 'msg ok'; m.textContent = l.length + ' questões publicadas. Elas aparecem para os alunos na próxima vez que entrarem.';
    } catch (e) { m.className = 'msg bad'; m.textContent = 'Não foi possível importar: ' + (e.message || e); }
  };
  async function carregarProvasOficiais() {
    try {
      var r = await nuvem.sb.storage.from('conteudo').download('oab/questoes-provas.json');
      if (r.error || !r.data) return;
      var l = JSON.parse(await r.data.text());
      l.forEach(function (q) { if (q && q.id && DM[q.d] && Array.isArray(q.a) && q.a.length === 4 && !QM[q.id]) { q.diag = false; OAB.Q.push(q); } });
      indexarQ();
    } catch (e) { /* sem provas importadas */ }
  }
  function iniciarApp() { $('#acesso').hidden = true; $('#app').hidden = false; render(); }
  function acView(n) { $$('[data-ac]').forEach(function (s) { s.hidden = s.dataset.ac !== n; }); }
  function msg(id, t, ok) { var e = $('#' + id); e.textContent = t || ''; e.className = 'msg' + (t ? (ok ? ' ok' : ' bad') : ''); }
  function traduz(e) {
    var m = String((e && (e.message || e.error_description)) || e || '');
    if (/Invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
    if (/Email not confirmed/i.test(m)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
    if (/already registered|already exists/i.test(m)) return 'Este e-mail já tem cadastro. Use "Entrar".';
    if (/Password should be at least|weak/i.test(m)) return 'A senha precisa ter pelo menos 8 caracteres.';
    if (/rate limit|too many/i.test(m)) return 'Muitas tentativas. Aguarde alguns minutos.';
    if (/Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com o servidor. Verifique sua internet.';
    return 'Não foi possível concluir: ' + m;
  }
  function contato() { return cfg.contato ? ' Dúvidas: ' + cfg.contato + '.' : ''; }

  if (!cfg.url || !cfg.anonKey || !window.supabase) { iniciarApp(); return; }

  var sb = window.supabase.createClient(cfg.url, cfg.anonKey, {auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true}});
  nuvem.sb = sb;
  var recuperando = /type=recovery/.test(location.hash + location.search), entrando = false;
  $('#acesso').hidden = false; acView(recuperando ? 'nova' : 'login');
  $$('[data-ac-ir]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); acView(a.dataset.acIr); }); });
  $$('[data-sair]').forEach(function (b) { b.addEventListener('click', async function () { try { await sb.auth.signOut(); } catch (e) { /* ignora */ } location.replace(location.pathname); }); });
  $('#f-login').addEventListener('submit', async function (e) {
    e.preventDefault(); msg('l-msg', 'Entrando…', true);
    var r = await sb.auth.signInWithPassword({email: $('#l-email').value.trim(), password: $('#l-senha').value});
    if (r.error) { msg('l-msg', traduz(r.error)); return; } msg('l-msg', ''); entrar(r.data.session);
  });
  $('#f-cad').addEventListener('submit', async function (e) {
    e.preventDefault(); msg('c-msg', 'Criando seu cadastro…', true);
    var r = await sb.auth.signUp({email: $('#c-email').value.trim(), password: $('#c-senha').value, options: {data: {nome: $('#c-nome').value.trim()}, emailRedirectTo: location.origin + location.pathname}});
    if (r.error) { msg('c-msg', traduz(r.error)); return; }
    if (r.data && r.data.user && Array.isArray(r.data.user.identities) && !r.data.user.identities.length) { msg('c-msg', 'Este e-mail já tem cadastro. Use "Entrar".'); return; }
    if (!r.data.session) { msg('c-msg', 'Cadastro recebido. Confirme pelo link enviado ao seu e-mail e aguarde a liberação do acesso.', true); return; }
    entrar(r.data.session);
  });
  $('#f-rec').addEventListener('submit', async function (e) {
    e.preventDefault(); msg('r-msg', 'Enviando…', true);
    var r = await sb.auth.resetPasswordForEmail($('#r-email').value.trim(), {redirectTo: location.origin + location.pathname});
    msg('r-msg', r.error ? traduz(r.error) : 'Se o e-mail estiver cadastrado, você receberá um link para criar nova senha.' + contato(), !r.error);
  });
  $('#f-nova').addEventListener('submit', async function (e) {
    e.preventDefault();
    var r = await sb.auth.updateUser({password: $('#n-senha').value});
    if (r.error) { msg('n-msg', traduz(r.error)); return; }
    recuperando = false; var s = await sb.auth.getSession(); entrar(s.data.session);
  });
  async function entrar(session) {
    if (!session || recuperando || entrando) return;
    entrando = true;
    var uid = session.user.id;
    var r = await sb.from('perfis').select('*').eq('id', uid).maybeSingle();
    if (r.error || !r.data) { $('#e-tit').textContent = 'Cadastro incompleto'; $('#e-txt').textContent = 'Não encontramos seu perfil de aluno.' + contato(); acView('espera'); entrando = false; return; }
    var p = r.data, vencido = p.expira_em && p.expira_em < hojeISO();
    if (!p.admin && (p.status !== 'aprovado' || vencido)) {
      $('#e-tit').textContent = p.status === 'pendente' ? 'Cadastro recebido' : vencido ? 'Acesso expirado' : 'Acesso suspenso';
      $('#e-txt').textContent = (p.status === 'pendente' ? 'Seu acesso está aguardando liberação. Deixe esta página aberta: ela abre sozinha quando o acesso for aprovado.' : '') + contato();
      acView('espera'); entrando = false;
      if (p.status === 'pendente') setTimeout(function () { entrar(session); }, 15000);
      return;
    }
    nuvem.ativo = true; nuvem.uid = uid; nuvem.admin = !!p.admin; nuvem.nome = p.nome || '';
    KEY = 'ontop-oab-v1-' + uid; S = carregar();
    try {
      var g = await sb.from('progresso').select('estado').eq('user_id', uid).maybeSingle();
      var rem = g.data && g.data.estado && g.data.estado.cargos && g.data.estado.cargos[CARGO];
      if (rem && rem.v === 1 && (rem.at || 0) > (S.at || 0)) { S = rem; lsSet(KEY, JSON.stringify(S)); }
    } catch (e) { /* segue com o local */ }
    await carregarProvasOficiais();
    invalidarCrono();
    $('#lat-nome').textContent = (p.nome || session.user.email) + ' · perfil';
    $('#btn-sair').hidden = false;
    iniciarApp();
  }
  sb.auth.getSession().then(function (s) { if (s.data.session && !recuperando) entrar(s.data.session); });
  sb.auth.onAuthStateChange(function (ev, s) { if (ev === 'PASSWORD_RECOVERY') { recuperando = true; acView('nova'); } });
})();
