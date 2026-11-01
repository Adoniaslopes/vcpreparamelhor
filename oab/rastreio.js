/* Rastreio do Método Aprovação OAB
   1) Guarda de onde a pessoa veio na primeira visita (anúncio da Meta, Google etc.)
      e repassa essa origem para o cadastro do diagnóstico e para o checkout da Kiwify.
   2) Carrega o Pixel da Meta (se o ID estiver preenchido em oab/config.js) e registra:
      PageView, Lead (e-book e diagnóstico concluído), CompleteRegistration (cadastro
      no diagnóstico) e InitiateCheckout (clique no botão de compra). */
(function () {
  'use strict';
  var CFG = (window.ONTOP_CONFIG || {}), PIXEL = String(CFG.metaPixelId || '').trim();
  var CHAVE = 'oab_origem', INTERNAS = {vendas: 1, diagnostico: 1, ebook: 1};

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } }
  function limpa(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 40); }

  // ---------- origem da primeira visita ----------
  var q = new URLSearchParams(location.search);
  var fonte = limpa(q.get('utm_source'));
  if (fonte && INTERNAS[fonte]) fonte = '';
  if (!fonte && q.get('fbclid')) fonte = 'meta';       // a Meta acrescenta fbclid em todo clique de anúncio
  if (!fonte && q.get('gclid')) fonte = 'google';
  if (fonte && !lsGet(CHAVE)) {
    var camp = limpa(q.get('utm_campaign'));
    lsSet(CHAVE, fonte + (camp ? '.' + camp : ''));
  }
  function origem() { return lsGet(CHAVE) || ''; }

  // ---------- Pixel da Meta ----------
  if (PIXEL && /^\d{6,20}$/.test(PIXEL)) {
    /* código base oficial do Pixel da Meta */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
  }

  function evento(nome, dados, unico) {
    if (unico) { var k = 'oab_ev_' + unico; if (lsGet(k)) return; lsSet(k, '1'); }
    try { if (window.fbq) window.fbq('track', nome, dados || {}); } catch (e) { /* nada */ }
  }

  // acrescenta a origem como utm_source num link (ex.: checkout da Kiwify)
  function comOrigem(url) {
    var o = origem(); if (!o || !url || url.charAt(0) === '#') return url;
    try {
      var u = new URL(url, location.href);
      if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', o.split('.')[0]);
      if (!u.searchParams.get('utm_campaign') && o.indexOf('.') > 0) u.searchParams.set('utm_campaign', o.slice(o.indexOf('.') + 1));
      return u.toString();
    } catch (e) { return url; }
  }

  window.Rastreio = {origem: origem, evento: evento, comOrigem: comOrigem};
})();
