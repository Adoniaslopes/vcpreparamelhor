/* Camada de compatibilidade: oferece à plataforma as mesmas funções que ela usava
   dentro do Claude (dash.* para os dados e claude.use para o salvamento),
   agora atendidas pelo Supabase. */
(function () {
  'use strict';
  var data = {}, calcs = {}, subs = [];
  ['questoes', 'sinopses', 'materiais', 'trilhas', 'discursivas', 'prova2023'].forEach(function (k) { data[k] = {status: 'loading', data: null}; });

  function recompute() {
    Object.keys(calcs).forEach(function (id) {
      var c = calcs[id];
      var ins = c.inputs.map(function (i) { return data[i] || {status: 'missing'}; });
      if (ins.every(function (x) { return x.status === 'ok'; })) {
        try { data[id] = {status: 'ok', data: c.fn.apply(null, ins.map(function (x) { return x.data; }))}; }
        catch (e) { console.error(e); data[id] = {status: 'error', data: null}; }
      } else {
        data[id] = {status: ins.some(function (x) { return x.status === 'error' || x.status === 'missing'; }) ? 'error' : 'loading', data: null};
      }
    });
  }
  function emit() {
    recompute();
    subs.forEach(function (f) { try { f(); } catch (e) { console.error(e); } });
  }

  window.dash = {
    data: function (id) { return data[id] || {status: 'missing', data: null}; },
    calc: function (id, c) { calcs[id] = c; recompute(); },
    onData: function (f) { subs.push(f); setTimeout(function () { try { f(); } catch (e) { console.error(e); } }, 0); },
    setLink: function (id) { try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignora */ } }
  };

  window.__pet = {
    set: function (id, rows) { data[id] = {status: 'ok', data: rows}; emit(); },
    fail: function (id) { data[id] = {status: 'error', data: null}; emit(); }
  };

  window.claude = {
    use: async function (cap) {
      var sb = window.PET_SB, uid = window.PET_UID;
      if (!sb || !uid) return null;
      if (cap === 'user') return {id: async function () { return uid; }};
      if (cap === 'db') {
        return {
          doc: function () {
            return {
              get: async function () {
                var r = await sb.from('progresso').select('estado').eq('user_id', uid).maybeSingle();
                if (r.error) throw r.error;
                return {exists: !!r.data, data: function () { return r.data ? r.data.estado : null; }};
              },
              set: async function (obj) {
                var r = await sb.from('progresso').upsert({user_id: uid, estado: obj, atualizado_em: new Date().toISOString()});
                if (r.error) throw r.error;
              }
            };
          }
        };
      }
      return null;
    }
  };
})();
