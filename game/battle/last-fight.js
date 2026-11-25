// last-fight.js (Coven of the Moon Faire, the last-foe job; made new here): the last fight's choice of easy, medium,
// hard or crazy (Moon Faire's final-fight plan; Chris, November 15 and 25), in this game's battle.
//
// Just before the last fight begins, a small card offers the four settings (game/battle/last-fight-data.js: the levels,
// the helpers, the refill, the card's words). The setting is the level of everything in both forms of the fire. Then:
//   form one   the fire with its helpers (two wraiths and two frost wisps), all at the setting's level;
//   the change the party comes to the final form with full HP and MP, every witch up (the plan's refill);
//   form two   the fire alone, at the same level.
// It works by standing in front of CovenBattle.start (game/battle/start.js, unchanged): a fight whose story foes are one
// of the fire's two forms is given the setting's level, the helpers and the refill; every other fight goes through as
// it came. The fire's level reaches the battle through game/encounters/foes.js (its fixedLevel reads
// CovenLastFight.level while the fight is made, and is 20 when no setting is chosen, as in the balance tools).
// Needs start.js and last-fight-data.js loaded before it. window.CovenLastFight is for the page and the checks:
//   level, setting   the setting of the fight being fought (level is null between fights)
//   preset           a setting's id: the next card is skipped and this one taken (checks)
//   shown            true while the card is up; pick(id) presses one of its buttons
(function () {
  'use strict';
  const D = () => window.COVEN_LAST_FIGHT || null;
  const LF = window.CovenLastFight = { level: null, setting: null, preset: null, shown: false, pick: null, fresh: false, asked: 0 };
  const testing = () => /[?&]test\b/.test(location.search) || !!navigator.webdriver;
  // which of the last fight's forms a call to CovenBattle.start is: 0, 1, or -1 for any other fight
  function formOf(o) { const d = D(), f = o && o.story && o.story.foes && o.story.foes[0]; return d && f ? d.forms.indexOf(f.id) : -1; }

  // ---------- the card ----------
  function card(auto) {
    const d = D(), W = d.words || {}, S = W.settings || {};
    return new Promise((resolve) => {
      const box = document.createElement('div');
      box.className = 'coven-last-card'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'covenLastTitle');
      box.style.cssText = 'position:fixed;inset:0;z-index:9600;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,6,16,.72);font-family:"Atkinson Hyperlegible",system-ui,sans-serif';
      const panel = document.createElement('div');
      panel.style.cssText = 'max-width:560px;width:100%;box-sizing:border-box;padding:18px 18px 14px;border-radius:14px;border:1px solid rgba(214,222,255,.5);background:linear-gradient(rgba(70,78,128,.97),rgba(28,32,62,.97));color:#f4f6ff;box-shadow:0 10px 40px rgba(0,0,0,.5)';
      const h = document.createElement('h2'); h.id = 'covenLastTitle'; h.textContent = W.title || '';
      h.style.cssText = 'margin:0 0 6px;font:italic 400 24px/1.15 "IM Fell English",Georgia,serif';
      const p = document.createElement('p'); p.textContent = W.lead || ''; p.style.cssText = 'margin:0 0 14px;font-size:15px;line-height:1.35;color:#d6dcff';
      const grid = document.createElement('div'); grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:10px';
      const buttons = {};
      const done = (s) => { if (!box.parentNode) return; document.removeEventListener('keydown', key, true); box.remove(); LF.shown = false; LF.pick = null; resolve(s); };
      d.settings.forEach((s, i) => {
        const w = S[s.id] || {}, b = document.createElement('button');
        b.type = 'button'; b.dataset.setting = s.id;
        b.style.cssText = 'min-height:64px;padding:8px 10px;border-radius:10px;border:1px solid rgba(214,222,255,.7);background:rgba(18,13,24,.55);color:#f4f6ff;font:700 18px/1.1 "Atkinson Hyperlegible",system-ui,sans-serif;cursor:pointer;touch-action:manipulation';
        const n = document.createElement('span'); n.textContent = w.name || s.id; n.style.display = 'block';
        const l = document.createElement('small'); l.textContent = w.line || ''; l.style.cssText = 'display:block;margin-top:4px;font-weight:400;font-size:13px;color:#c9cff5';
        b.appendChild(n); b.appendChild(l);
        b.addEventListener('click', () => done(s));
        b.addEventListener('focus', () => { b.style.outline = '3px solid #ffd66e'; b.style.outlineOffset = '2px'; });
        b.addEventListener('blur', () => { b.style.outline = ''; });
        buttons[s.id] = b; grid.appendChild(b);
        b.title = String(i + 1);
      });
      const k = document.createElement('p'); k.textContent = W.keys || '';
      k.style.cssText = 'margin:10px 0 0;font-size:12px;color:#9aa3cf'; if (matchMedia && matchMedia('(pointer: coarse)').matches) k.hidden = true;
      panel.appendChild(h); panel.appendChild(p); panel.appendChild(grid); panel.appendChild(k); box.appendChild(panel);
      // keys 1 to 4 choose; Tab and Enter work as on any button
      function key(e) { const i = '1234'.indexOf(e.key); if (i >= 0 && d.settings[i]) { e.preventDefault(); e.stopPropagation(); done(d.settings[i]); } }
      document.addEventListener('keydown', key, true);
      document.body.appendChild(box); LF.shown = true; LF.asked++;
      LF.pick = (id) => { const s = d.settings.find((x) => x.id === id); if (s) done(s); };
      const first = buttons[d.settings[0].id]; if (first) try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); }
      if (auto) setTimeout(() => LF.pick && LF.pick(d.autoPick || d.settings[0].id), 1000 * (d.autoWait || 1));
    });
  }

  // ---------- the last fight's two forms, given the setting ----------
  function install() {
    const CB = window.CovenBattle; if (!CB || CB.__lastFight) return !!CB;
    const start0 = CB.start;
    CB.start = async function (o) {
      const form = formOf(o), d = D();
      if (form < 0) return start0.call(this, o);
      // the final form straight after form one, in the same go, keeps form one's setting; else the card asks
      let s = null;
      if (LF.preset) { s = d.settings.find((x) => x.id === LF.preset) || null; LF.preset = null; }
      if (!s && form === 1 && LF.fresh && LF.setting) s = LF.setting;
      if (!s) s = await card(!!o.auto && testing());
      LF.fresh = false; LF.setting = s; LF.level = s.level;
      const st = Object.assign({}, o.story), lv = (f) => Object.assign({}, f, { level: s.level });
      st.foes = o.story.foes.map(lv);
      if (form === 0) st.foes = st.foes.concat((d.helpers || []).map((id) => ({ id, level: s.level })));
      const o2 = Object.assign({}, o, { story: st });
      if (form === 1 && d.refill) delete o2.party;                // every witch up, full HP and MP
      let r = null;
      try { r = await start0.call(this, o2); } finally { LF.level = null; }
      if (form === 0 && r && r.won) LF.fresh = true;              // form one seen through: the final form comes next
      return r;
    };
    CB.__lastFight = true;
    return true;
  }
  if (!install()) document.addEventListener('DOMContentLoaded', install);
})();
