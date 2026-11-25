// party-view.js: the party on the land's screen, as little as possible (Coven, the fights job, step 3). Chris wants
// uncluttered phone screens: one small button in the bottom right corner, the party's level and one bar for its health,
// big enough for a thumb. Tap it for the four witches, the experience, the shards and the herbs, and the two things the
// party can do there: rest (only at the Moon Faire's camp) and start afresh. Nothing goes over the middle of the screen.
//
//   const V = CovenPartyView.create({ root, party, rest, afresh })
//   V.refresh()                 after the party changes
//   V.atCamp(on)                at the camp: a Rest button beside it while anyone is hurt
//   V.offer(label, tap)         one more button beside it (the gate's), or V.offer(null)
//   V.close()                   closes the panel
(function () {
  'use strict';
  const CSS = `
#cvParty{position:absolute;right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:4;display:flex;flex-direction:row-reverse;align-items:flex-end;gap:8px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
#cvParty button{appearance:none;font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
#cvPill{display:flex;align-items:center;gap:9px;min-height:48px;padding:0 14px;border-radius:24px;border:1px solid rgba(214,222,255,.45);background:rgba(14,14,36,.62);color:#f0ecff}
#cvPill b{font-size:15px;font-weight:600;white-space:nowrap}
#cvPill .bar{width:58px;height:7px;border-radius:4px;background:rgba(255,255,255,.16);overflow:hidden}
#cvPill .bar i{display:block;height:100%;width:100%;border-radius:4px;background:#8dffb0;transition:width .4s}
#cvPill .bar i.low{background:#ffd66e}#cvPill .bar i.danger{background:#ff8a8a}
.cvBtn{min-height:48px;padding:0 16px;border-radius:24px;border:1px solid rgba(255,230,168,.7);background:rgba(70,56,110,.82);color:#fff3d6;font-size:15px;white-space:nowrap}
#cvPanel{position:absolute;right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(70px + env(safe-area-inset-bottom,0px));z-index:6;width:min(300px,calc(100vw - 24px));max-height:calc(100% - 84px);overflow:auto;box-sizing:border-box;padding:10px 12px;border-radius:16px;background:rgba(14,12,34,.9);border:1px solid rgba(214,222,255,.3);color:#f0ecff;font:13px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:none}
#cvPanel h3{margin:0 0 6px;font:400 17px/1.2 Georgia,"Times New Roman",serif;color:#ffe6a8}
#cvPanel .w{margin:0 0 5px}
#cvPanel .w .top{display:flex;justify-content:space-between;gap:8px}
#cvPanel .w .top small{color:#b8b4e0;font-size:12.5px;white-space:nowrap}
#cvPanel .g{height:5px;border-radius:3px;background:rgba(255,255,255,.14);overflow:hidden;margin-top:3px}
#cvPanel .g i{display:block;height:100%;background:#8dffb0}#cvPanel .g.mp{height:3px;margin-top:2px}#cvPanel .g.mp i{background:#9db8ff}#cvPanel .g.xp i{background:#ffd66e}
#cvPanel .line{margin:6px 0 0;color:#d8d4f4}
#cvPanel .row{display:flex;gap:8px;margin-top:10px}
#cvPanel .row button{flex:1;min-height:44px;border-radius:14px;border:1px solid rgba(214,222,255,.3);background:rgba(40,36,80,.6);color:#f0ecff;font-size:14px}
#cvPanel .row button:disabled{opacity:.45;cursor:default}
#cvPanel .row button.warn{border-color:rgba(255,160,160,.6)}
#cvPanel .note{margin:6px 0 0;color:#b8b4e0;font-size:12.5px}`;
  const nf = (n) => Math.round(n).toLocaleString('en-US');
  function create(o) {
    const P = o.party;
    if (!document.getElementById('cvPartyStyle')) { const st = document.createElement('style'); st.id = 'cvPartyStyle'; st.textContent = CSS; document.head.appendChild(st); }
    const box = document.createElement('div'); box.id = 'cvParty';
    box.innerHTML = '<button id="cvPill" aria-label="The party"><b></b><span class="bar"><i></i></span></button>';
    const pill = box.querySelector('#cvPill'), lv = pill.querySelector('b'), bar = pill.querySelector('i');
    const restB = document.createElement('button'); restB.className = 'cvBtn'; restB.textContent = 'Rest'; restB.hidden = true; box.appendChild(restB);
    const offerB = document.createElement('button'); offerB.className = 'cvBtn'; offerB.hidden = true; box.appendChild(offerB);
    const panel = document.createElement('div'); panel.id = 'cvPanel';
    o.root.appendChild(box); o.root.appendChild(panel);
    let camp = false, offerTap = null, sure = 0;
    function refresh() {
      const h = P.health();
      lv.textContent = 'Level ' + P.level;
      bar.style.width = (100 * h).toFixed(0) + '%'; bar.className = h < 0.25 ? 'danger' : h < 0.55 ? 'low' : '';
      pill.setAttribute('aria-label', 'The party: level ' + P.level + ', ' + Math.round(100 * h) + '% of its health. Tap for more.');
      restB.hidden = !(camp && !P.whole());
      if (panel.style.display === 'block') draw();
    }
    function draw() {
      let s = '<h3>The coven, level ' + P.level + '</h3>';
      for (const id of P.witches()) {
        const hp = P.hp(id), mh = P.maxHp(id), mm = P.maxMp(id);
        s += '<div class="w"><div class="top"><span>' + P.name(id) + '</span><small>' + nf(hp) + ' / ' + nf(mh) + ' HP' + (mm ? ' · ' + nf(P.mp(id)) + ' / ' + nf(mm) + ' MP' : '') + '</small></div>' +
          '<div class="g"><i style="width:' + (100 * hp / mh).toFixed(0) + '%"></i></div>' + (mm ? '<div class="g mp"><i style="width:' + (100 * P.mp(id) / mm).toFixed(0) + '%"></i></div>' : '') + '</div>';
      }
      s += '<div class="line">' + (P.xpNeed ? nf(P.xp) + ' of ' + nf(P.xpNeed) + ' experience to level ' + (P.level + 1) : 'The highest level') + '</div><div class="g xp"><i style="width:' + (100 * P.xpPart).toFixed(0) + '%"></i></div>';
      const herbs = Object.keys(P.herbs).filter((k) => P.herbs[k] > 0).map((k) => (window.BattleRules.HERBS[k] || { name: k.replace(/-/g, ' ') }).name + ' ' + P.herbs[k]);   // (a herb the battle does not know yet, such as zone 4's white sage, is shown by its own name)
      s += '<div class="line">' + nf(P.shards) + ' sunstone shards · fights ' + P.fights.won + ' won, ' + P.fights.fled + ' run from, ' + P.fights.lost + ' lost</div><div class="line" style="font-size:12.5px;color:#c8c4ea">' + (herbs.length ? herbs.join(' · ') : 'No herbs') + '</div>';
      s += '<div class="row"><button data-k="rest"' + (camp && !P.whole() ? '' : ' disabled') + '>Rest</button><button data-k="afresh" class="warn">' + (sure ? 'Tap again: start afresh' : 'Start afresh') + '</button></div>';
      s += '<p class="note">' + (camp ? (P.whole() ? 'Everyone is rested.' : 'Rest here: everyone whole again.') : 'Rest at the Moon Faire’s camp.') + (sure ? ' Starting afresh forgets the levels, the shards and the herbs.' : '') + '</p>';
      panel.innerHTML = s;
      panel.querySelector('[data-k="rest"]').onclick = () => { if (o.rest) o.rest(); };
      panel.querySelector('[data-k="afresh"]').onclick = () => { if (!sure) { sure = 1; draw(); setTimeout(() => { if (sure) { sure = 0; if (panel.style.display === 'block') draw(); } }, 4000); return; } sure = 0; if (o.afresh) o.afresh(); draw(); };
    }
    const close = () => { panel.style.display = 'none'; sure = 0; };
    pill.addEventListener('click', () => { if (panel.style.display === 'block') close(); else { panel.style.display = 'block'; draw(); } });
    restB.addEventListener('click', () => { if (o.rest) o.rest(); });
    offerB.addEventListener('click', () => { if (offerTap) offerTap(); });
    refresh();
    return {
      refresh, close,
      atCamp(on) { if (camp !== !!on) { camp = !!on; refresh(); } },
      offer(label, tap) { offerTap = tap || null; offerB.hidden = !label; if (label) offerB.textContent = label; },
      hide(on) { box.style.display = on ? 'none' : ''; if (on) close(); },
      get el() { return box; },
    };
  }
  window.CovenPartyView = { create };
})();
