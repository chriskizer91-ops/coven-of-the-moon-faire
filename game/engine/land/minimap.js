// minimap.js: a small map of the zone in the corner, showing where she is; tap it for a big one with the names
// (Coven of the Moon Faire, zone 1, November 18, 2026).
// It is drawn from the land's own lines (land.js: mapData), so it is always the land as built: the woods and the thorn
// country, the lakes and rivers, the roads, each place's own ground and water, the Moon Faire's camp. North is up.
//   const mm = W3D.miniMap({ root, land, walker });   root: the element to put it in; land: Z.land; walker: W3D.walk's
//   mm.open(true | false)   the big map;   mm.el   the small map's element
// It redraws six times a second: the picture of the land is made once, and only her mark moves.
(function (G) {
  'use strict';
  const W3D = G.W3D;
  W3D.miniMap = function (o) {
    const D = o.land.mapData(), [BX0, BZ0, BX1, BZ1] = D.bounds, LW = BX1 - BX0, LH = BZ1 - BZ0;
    const BASE = 1000, k = BASE / LW, X = (x) => (x - BX0) * k, Y = (z) => (z - BZ0) * k;
    // ---- the land, drawn once ----
    const base = document.createElement('canvas'); base.width = BASE; base.height = Math.round(LH * k);
    const g = base.getContext('2d');
    for (let py = 0; py < base.height; py += 8) for (let px = 0; px < BASE; px += 8) {
      const t = D.thornK(BX0 + (px + 4) / k, BZ0 + (py + 4) / k), c = (a, b) => Math.round(a + (b - a) * t);
      g.fillStyle = 'rgb(' + c(26, 44) + ',' + c(42, 36) + ',' + c(44, 66) + ')'; g.fillRect(px, py, 8, 8);
    }
    const poly = (pts) => { g.beginPath(); pts.forEach(([x, z], i) => (i ? g.lineTo(X(x), Y(z)) : g.moveTo(X(x), Y(z)))); g.closePath(); };
    g.lineJoin = g.lineCap = 'round';
    g.fillStyle = '#3a54a0'; for (const l of D.lakes) { poly(l); g.fill(); }
    g.strokeStyle = '#3a54a0'; for (const r of D.rivers) for (let i = 0; i + 1 < r.pts.length; i++) { g.lineWidth = Math.max(2.5, (r.pts[i][2] + r.pts[i + 1][2]) / 2 * k); g.beginPath(); g.moveTo(X(r.pts[i][0]), Y(r.pts[i][1])); g.lineTo(X(r.pts[i + 1][0]), Y(r.pts[i + 1][1])); g.stroke(); }
    for (const p of D.places) { g.fillStyle = 'rgba(70,72,104,0.7)'; g.fillRect(X(p.x0), Y(p.z0), (p.x1 - p.x0) * k, (p.z1 - p.z0) * k); }
    g.save(); g.fillStyle = 'rgba(58,84,160,0.75)';
    for (const p of D.places) { g.save(); g.beginPath(); g.rect(X(p.x0), Y(p.z0), (p.x1 - p.x0) * k, (p.z1 - p.z0) * k); g.clip(); for (const w of p.water) { poly(w); g.fill(); } g.restore(); }
    g.restore();
    for (const f of D.flats) { g.fillStyle = 'rgba(232,170,96,0.45)'; g.beginPath(); g.arc(X(f.x), Y(f.z), f.r * k, 0, 6.3); g.fill(); }
    g.strokeStyle = '#c9b391'; for (const r of D.roads) { g.lineWidth = Math.max(2.5, r.w * k * 1.3); g.beginPath(); r.pts.forEach(([x, z], i) => (i ? g.lineTo(X(x), Y(z)) : g.moveTo(X(x), Y(z)))); g.stroke(); }
    g.lineWidth = 2; g.strokeStyle = 'rgba(232,222,190,0.8)'; for (const p of D.places) g.strokeRect(X(p.x0), Y(p.z0), (p.x1 - p.x0) * k, (p.z1 - p.z0) * k);
    g.strokeStyle = 'rgba(240,186,110,0.9)'; for (const f of D.flats) { g.beginPath(); g.arc(X(f.x), Y(f.z), f.r * k, 0, 6.3); g.stroke(); }
    const names = D.places.map((p) => ({ name: p.name, x: (p.x0 + p.x1) / 2, z: p.z0 })).concat(D.flats.filter((f) => f.name).map((f) => ({ name: f.name, x: f.x, z: f.z - f.r })));

    // ---- the two views: the small one in the corner, the big one over the middle ----
    const dpr = Math.min(2, G.devicePixelRatio || 1);
    const mk = (cls, label) => { const c = document.createElement('canvas'); c.className = cls; c.setAttribute('role', 'button'); c.setAttribute('aria-label', label); o.root.appendChild(c); return c; };
    const small = mk('mini', 'The map. Tap to make it big'), big = mk('bigmap', 'The map. Tap to close it');
    big.style.display = 'none';
    let isOpen = false;
    function draw(c, withNames) {
      const r = c.getBoundingClientRect(); if (!r.width) return;
      const w = Math.round(r.width * dpr), h = Math.round(r.width * LH / LW * dpr); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
      const q = c.getContext('2d'), s = w / BASE; q.imageSmoothingQuality = 'high'; q.drawImage(base, 0, 0, w, h);
      if (withNames) { q.font = '600 ' + Math.round(13 * dpr) + 'px Georgia, serif'; q.textAlign = 'center'; q.textBaseline = 'bottom'; q.lineWidth = 3 * dpr; q.strokeStyle = 'rgba(10,10,28,0.85)'; q.fillStyle = '#ffe6a8';
        for (const n of names) { const x = X(n.x) * s, y = Y(n.z) * s - 4 * dpr; q.strokeText(n.name, x, y); q.fillText(n.name, x, y); } }
      // her mark: a bright dot with a wedge the way she faces
      const io = o.walker.io, M = o.walker.P.M, x = X(M.x(io.px)) * s, y = Y(M.z(io.py)) * s, R = (withNames ? 6 : 4.5) * dpr, fx = Math.sin(io.yaw), fz = Math.cos(io.yaw);
      q.fillStyle = 'rgba(255,240,200,0.28)'; q.beginPath(); q.arc(x, y, R * 2.4, 0, 6.3); q.fill();
      q.fillStyle = '#fff4d0'; q.beginPath(); q.moveTo(x + fx * R * 2.3, y + fz * R * 2.3); q.lineTo(x - fz * R * 0.9, y + fx * R * 0.9); q.lineTo(x + fz * R * 0.9, y - fx * R * 0.9); q.closePath(); q.fill();
      q.fillStyle = '#ff5a5a'; q.strokeStyle = '#fff'; q.lineWidth = 1.5 * dpr; q.beginPath(); q.arc(x, y, R, 0, 6.3); q.fill(); q.stroke();
    }
    const api = { el: small, big, names, open(on) { isOpen = on; big.style.display = on ? 'block' : 'none'; if (on) draw(big, true); }, draw() { draw(small, false); if (isOpen) draw(big, true); } };
    small.addEventListener('click', () => api.open(true)); big.addEventListener('click', () => api.open(false));
    for (const c of [small, big]) for (const ev of ['pointerdown', 'touchstart', 'mousedown']) c.addEventListener(ev, (e) => e.stopPropagation());   // a tap on the map is not a step or a look
    if (!/[?&]test\b/.test(location.search)) setInterval(api.draw, 160);
    api.draw();
    return api;
  };
})(window);
