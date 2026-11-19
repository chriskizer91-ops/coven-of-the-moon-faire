// minimap.js: the map (Coven of the Moon Faire, zone 1, November 18, 2026). A hand-drawn night map, ink and moonlight on
// dark paper: a small one in the corner that follows her, and a big one of the whole zone when the small one is tapped.
//
//   const mm = W3D.miniMap({ root, land, walker });   root: the element to put it in; land: Z.land; walker: W3D.walk's
//   mm.el      the small map's element          mm.big    the big map's element
//   mm.open(true | false)   the big map         mm.draw() draw both now (the checks call it; with ?test there is no timer)
//
// What it is drawn from: the land's own lines (land.js: mapData): the land's bounds, roads, rivers, lakes, each place's
// ground and water, the camp's meadow, how much of a spot is thorn country, and the ground's height (for soft hill
// shading). When the land also gives them it uses: kind(x, z) (water, fen, thorn, open grass, fir forest, and how far
// inside the edge of the walkable land a spot is), wide (the box round everything walkable) and longRoad (the road out of
// the zone). From the places themselves (the walker's zone, if it has them): each place's buildings, jetties, trees and
// walking areas, and the camp's tents and stalls. Nothing is loaded: every mark is drawn here with canvas code.
//
// How it stays cheap: the land is painted once into pictures (one for the zone; for the long road one picture of the
// whole road and, near her, squares of 256 m painted one at a time as she comes to them). Each tick (about 7 a second,
// on a timer, never in the game's frame loop) only copies part of a picture, sets the place marks down and draws her mark.
(function (G) {
  'use strict';
  const W3D = G.W3D;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v), lerp = (a, b, t) => a + (b - a) * t;
  const ss = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const h2 = (i, j, s) => { let n = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(s | 0, 1274126177)) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; };
  const vn = W3D.vnoise || ((x, z) => 0.5 + 0.25 * Math.sin(x * 1.7 + z * 0.9) * Math.cos(z * 1.3 - x * 0.4));
  const segDist = (x, z, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1), 0, 1); return Math.hypot(x - ax - t * dx, z - az - t * dz); };
  const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const rgb = (c, a) => (a == null ? 'rgb(' + c.map(Math.round).join(',') + ')' : 'rgba(' + c.map(Math.round).join(',') + ',' + a + ')');

  // the words the map says (the page may pass its own: o.words)
  const WORDS = { walked: 'walked', toGo: 'to go', km: 'km', m: 'm', north: 'N' };

  // ---- the colours: dark blue paper, the land in moonlit inks ----
  const INK = {
    beyond: [12, 13, 27], paper: [22, 24, 42],
    woods: [30, 46, 54], pine: [22, 37, 45], thorn: [46, 36, 64], open: [62, 78, 76], fen: [42, 55, 50], flat: [92, 80, 70],
    water: [20, 34, 70], waterIn: [36, 56, 98], shore: 'rgba(178,198,232,0.85)',
    road: '#dccca2', roadCase: 'rgba(8,8,20,0.78)', walk: 'rgba(160,150,150,0.20)',
    roof: '#3a3350', roofLit: '#7c7598', ridge: 'rgba(230,222,250,0.75)', window: '#ffcf7a', planks: '#8d7258',
    label: '#f4e4b6', halo: 'rgba(8,8,20,0.92)', gold: 'rgba(232,206,140,0.85)',
  };

  W3D.miniMap = function (o) {
    const L = o.land, D = L.mapData(), WK = o.walker, Z = WK.P || {}, words = Object.assign({}, WORDS, o.words || {});
    const TEST = /[?&]test\b/.test(location.search), PHONE = W3D.quality !== 'high';
    const [BX0, BZ0, BX1, BZ1] = D.bounds;
    const dpr = Math.min(2, G.devicePixelRatio || 1);
    const KIND = typeof D.kind === 'function' ? D.kind : null, thornK = D.thornK || (() => 0);
    const ROADS = (D.roads || []).map((r) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const q of r.pts) { a = Math.min(a, q[0]); b = Math.min(b, q[1]); c = Math.max(c, q[0]); d = Math.max(d, q[1]); } return { pts: r.pts, w: r.w || 3, b: [a - 8, b - 8, c + 8, d + 8] }; });
    const RIVERS = (D.rivers || []).map((r) => ({ pts: r.pts.map((p) => [p[0], p[1], p[2] || 5]) }));
    const LAKES = (D.lakes || []).map((p) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const q of p) { a = Math.min(a, q[0]); b = Math.min(b, q[1]); c = Math.max(c, q[0]); d = Math.max(d, q[1]); } return { poly: p, b: [a, b, c, d] }; });
    const FLATS = D.flats || [];
    const rimBox = (x, z) => Math.min(x - BX0, BX1 - x, z - BZ0, BZ1 - z);

    // ---- the long road: its length, which end is the zone's, where it leaves the zone ----
    let LR = null;
    if (D.longRoad && D.longRoad.pts && D.longRoad.pts.length > 1) {
      let pts = D.longRoad.pts.map((p) => [p[0], p[1]]);
      const cx = (BX0 + BX1) / 2, cz = (BZ0 + BZ1) / 2, e0 = pts[0], e1 = pts[pts.length - 1];
      if (Math.hypot(e1[0] - cx, e1[1] - cz) < Math.hypot(e0[0] - cx, e0[1] - cz)) pts = pts.slice().reverse();
      const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      let s0 = 0;
      for (let i = 1; i < pts.length; i++) if (rimBox(pts[i][0], pts[i][1]) < 0) {
        if (rimBox(pts[i - 1][0], pts[i - 1][1]) < 0) { s0 = cum[i - 1]; break; }
        let a = 0, b = 1; for (let k = 0; k < 24; k++) { const m = (a + b) / 2; if (rimBox(lerp(pts[i - 1][0], pts[i][0], m), lerp(pts[i - 1][1], pts[i][1], m)) < 0) b = m; else a = m; }
        s0 = lerp(cum[i - 1], cum[i], a); break;
      }
      let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const q of pts) { a = Math.min(a, q[0]); b = Math.min(b, q[1]); c = Math.max(c, q[0]); d = Math.max(d, q[1]); }
      LR = { pts, cum, len: cum[cum.length - 1], s0, half: D.longRoad.half || 60, name: D.longRoad.name || '', box: [a, b, c, d] };
    }
    // how far along the long road a spot is (metres from its zone end), and how far from it
    const along = (x, z) => { let best = 1e9, s = 0; const p = LR.pts; for (let i = 0; i + 1 < p.length; i++) { const ax = p[i][0], az = p[i][1], dx = p[i + 1][0] - ax, dz = p[i + 1][1] - az, l2 = dx * dx + dz * dz || 1, t = clamp(((x - ax) * dx + (z - az) * dz) / l2, 0, 1), d = Math.hypot(x - ax - t * dx, z - az - t * dz); if (d < best) { best = d; s = LR.cum[i] + t * Math.sqrt(l2); } } return { s, d: best }; };
    // the box round everything walkable
    const WIDE = D.wide || (LR ? [Math.min(BX0, LR.box[0] - LR.half), Math.min(BZ0, LR.box[1] - LR.half), Math.max(BX1, LR.box[2] + LR.half), Math.max(BZ1, LR.box[3] + LR.half)] : D.bounds);

    // what the ground is at a spot: the land's own kind() if it has one, or worked out from what it gives
    const K = { water: 0, fen: 0, thorn: 0, open: 0, pine: 0, rim: 0 };
    function kindAt(x, z) {
      if (KIND) { const k = KIND(x, z) || {}; K.water = +k.water || 0; K.fen = +k.fen || 0; K.thorn = k.thorn != null ? +k.thorn : thornK(x, z); K.open = +k.open || 0; K.pine = +k.pine || 0; K.rim = k.rim != null ? +k.rim : rimBox(x, z); return K; }
      K.water = 0; K.fen = 0; K.open = 0; K.pine = 0; K.thorn = thornK(x, z); K.rim = rimBox(x, z);
      if (LR && K.rim < 0) K.rim = Math.max(K.rim, LR.half - along(x, z).d);
      return K;
    }

    // ---- the places: their ground, and what the place engine knows of them (buildings, jetties, trees, walking areas) ----
    const parts = Z.parts || [];
    const ICON_OF = { wickhollow: 'town', thornwood: 'thorns', bogmire: 'stilts', 'bogmire-heart': 'pool', cottage: 'cottage', jetty: 'jetty' };
    const PLACES = (D.places || []).map((p) => {
      const part = parts.find((q) => q.name === p.name && Math.abs(q.x0 - p.x0) < 0.5 && Math.abs(q.z0 - p.z0) < 0.5) || null;
      const P = { name: p.name, x0: p.x0, z0: p.z0, x1: p.x1, z1: p.z1, water: p.water || [], buildings: [], jetties: [], trees: [], walk: [], id: part ? part.id : null };
      if (part && part.P && part.P.M) {
        const M = part.P.M, def = part.P.place || {}, wx = (px) => part.ox + M.x(px), wz = (py) => part.oz + M.z(py);
        for (const b of def.buildings || []) if (b.fp && b.fp.length === 4) P.buildings.push({ x0: wx(b.fp[0]), z0: wz(b.fp[1]), x1: wx(b.fp[2]), z1: wz(b.fp[3]), ridge: (b.roof && b.roof.ridge) || 'ns', name: b.id });
        for (const j of def.jetties || []) if (j.r) P.jetties.push({ x0: wx(j.r[0]), z0: wz(j.r[1]), x1: wx(j.r[2]), z1: wz(j.r[3]) });
        for (const t of (G.W3D_TREES && G.W3D_TREES[part.id]) || []) P.trees.push([wx(t[0]), wz(t[1]), t[2] || 1, t[3] || 0]);
        const MP = G.MAPS && def.mapId != null && G.MAPS[def.mapId];
        for (const poly of (MP && MP.walk) || []) P.walk.push(poly.map(([x, y]) => [wx(x), wz(y)]));
        for (const a of def.walkAdd || []) if (a.poly) P.walk.push(a.poly.map(([x, y]) => [wx(x), wz(y)]));
      }
      // its mark: by what it is, or by what stands in it
      P.icon = ICON_OF[P.id] || (P.buildings.length > 3 ? 'town' : P.buildings.length ? 'cottage' : P.jetties.length ? 'jetty' : thornK((p.x0 + p.x1) / 2, (p.z0 + p.z1) / 2) > 0.5 ? 'thorns' : 'woods');
      let ax = (p.x0 + p.x1) / 2, az = (p.z0 + p.z1) / 2;
      const mid = (list) => { let sx = 0, sz = 0, n = 0; for (const b of list) { const w = (b.x1 - b.x0) * (b.z1 - b.z0); sx += (b.x0 + b.x1) / 2 * w; sz += (b.z0 + b.z1) / 2 * w; n += w; } return n ? [sx / n, sz / n] : null; };
      if (P.icon === 'cottage' && P.buildings.length) { const b = P.buildings.slice().sort((a, c) => (c.x1 - c.x0) * (c.z1 - c.z0) - (a.x1 - a.x0) * (a.z1 - a.z0))[0]; ax = (b.x0 + b.x1) / 2; az = (b.z0 + b.z1) / 2; }
      else if (P.icon === 'jetty' && P.jetties.length) { const m = mid(P.jetties); ax = m[0]; az = m[1]; }
      P.ax = clamp(ax, p.x0 + 8, p.x1 - 8); P.az = clamp(az, p.z0 + 8, p.z1 - 8);
      return P;
    });
    const MARKS = PLACES.map((p) => ({ name: p.name, icon: p.icon, x: p.ax, z: p.az })).concat(FLATS.filter((f) => f.name).map((f) => ({ name: f.name, icon: 'tent', x: f.x, z: f.z })));
    const insideRect = (x, z, pad) => { for (const p of PLACES) if (x > p.x0 - pad && x < p.x1 + pad && z > p.z0 - pad && z < p.z1 + pad) return p; return null; };
    const dInRect = (x, z) => { let best = -1e9; for (const p of PLACES) { const d = Math.min(x - p.x0, p.x1 - x, z - p.z0, p.z1 - z); if (d > best) best = d; } return best; };
    const camp = Z.zone && Z.zone.camp ? Z.zone.camp : null;

    // ---- the little marks the land is drawn with (painted once per picture, at its size) ----
    function makeStamps(r) {
      const one = (draw, k) => { const w = Math.ceil(r * (k || 3.4)), c = mkc(w, w), g = c.getContext('2d'); g.translate(w / 2, w / 2); g.lineCap = g.lineJoin = 'round'; draw(g); return c; };
      const crown = (tone) => one((g) => {
        g.fillStyle = 'rgba(4,6,14,0.55)'; g.beginPath(); g.ellipse(r * 0.28, r * 0.36, r * 1.0, r * 0.86, 0, 0, 6.3); g.fill();
        g.fillStyle = rgb(tone); g.beginPath(); g.arc(0, 0, r * 0.92, 0, 6.3); g.fill();
        g.fillStyle = rgb(tone.map((v) => v * 1.45 + 14), 0.75); g.beginPath(); g.arc(-r * 0.3, -r * 0.32, r * 0.46, 0, 6.3); g.fill();
        if (r > 2.2) { g.strokeStyle = 'rgba(6,8,16,0.6)'; g.lineWidth = Math.max(0.6, r * 0.12); g.beginPath(); g.arc(0, 0, r * 0.92, 0.2, 2.9); g.stroke(); }
      });
      const fir = (tone) => one((g) => {
        g.fillStyle = 'rgba(4,6,14,0.55)'; g.beginPath(); g.moveTo(r * 0.3, -r * 1.0); g.lineTo(r * 1.15, r * 1.0); g.lineTo(-r * 0.5, r * 1.0); g.closePath(); g.fill();
        g.fillStyle = rgb(tone); g.beginPath(); g.moveTo(0, -r * 1.25); g.lineTo(r * 0.78, r * 0.85); g.lineTo(-r * 0.78, r * 0.85); g.closePath(); g.fill();
        g.fillStyle = rgb(tone.map((v) => v * 1.5 + 12), 0.8); g.beginPath(); g.moveTo(0, -r * 1.25); g.lineTo(-r * 0.78, r * 0.85); g.lineTo(-r * 0.05, r * 0.85); g.closePath(); g.fill();
      });
      const thorn = (col) => one((g) => {
        const arm = (a, l) => { g.moveTo(0, r * 0.7); const ex = Math.sin(a) * l, ey = r * 0.7 - Math.cos(a) * l; g.lineTo(ex, ey); g.moveTo(ex * 0.55, r * 0.7 + (ey - r * 0.7) * 0.55); g.lineTo(ex * 0.55 + Math.sin(a + 0.9) * l * 0.32, r * 0.7 + (ey - r * 0.7) * 0.55 - Math.cos(a + 0.9) * l * 0.32); };
        const all = () => { g.beginPath(); arm(-0.75, r * 1.25); arm(-0.2, r * 1.5); arm(0.35, r * 1.35); arm(0.9, r * 1.1); g.stroke(); };
        g.strokeStyle = 'rgba(6,4,14,0.8)'; g.lineWidth = Math.max(1.2, r * 0.42); g.translate(r * 0.2, r * 0.25); all();
        g.translate(-r * 0.2, -r * 0.25); g.strokeStyle = col; g.lineWidth = Math.max(0.7, r * 0.2); all();
      }, 4);
      const reeds = one((g) => {
        g.lineWidth = Math.max(0.6, r * 0.16);
        const blade = (x, a, l) => { g.moveTo(x, r * 0.7); g.quadraticCurveTo(x + a * l * 0.3, r * 0.7 - l * 0.6, x + a * l, r * 0.7 - l); };
        g.strokeStyle = 'rgba(6,8,14,0.7)'; g.beginPath(); blade(-r * 0.35 + 0.6, -0.3, r * 1.1); blade(0.6, 0.05, r * 1.4); blade(r * 0.4 + 0.6, 0.35, r); g.stroke();
        g.strokeStyle = 'rgba(176,192,146,0.9)'; g.beginPath(); blade(-r * 0.35, -0.3, r * 1.1); blade(0, 0.05, r * 1.4); blade(r * 0.4, 0.35, r); g.stroke();
      });
      const grass = one((g) => { g.strokeStyle = 'rgba(170,196,180,0.55)'; g.lineWidth = Math.max(0.6, r * 0.14); g.beginPath(); g.moveTo(-r * 0.4, -r * 0.2); g.lineTo(-r * 0.1, r * 0.35); g.lineTo(r * 0.15, -r * 0.35); g.moveTo(r * 0.25, 0); g.lineTo(r * 0.45, r * 0.35); g.lineTo(r * 0.6, -r * 0.05); g.stroke(); });
      return { r, crowns: [crown([40, 62, 66]), crown([34, 54, 60]), crown([48, 70, 70])], firs: [fir([26, 48, 54]), fir([30, 54, 58])], thorns: [thorn('rgba(180,150,218,0.88)'), thorn('rgba(152,124,196,0.88)')], reeds, grass };
    }
    const stampAt = (g, st, x, y, k) => { const w = st.width * k; g.drawImage(st, x - w / 2, y - w / 2, w, w); };

    // the paper's grain: a small square of speckle, laid over everything
    const grain = (() => { const c = mkc(128, 128), g = c.getContext('2d'), im = g.createImageData(128, 128); for (let i = 0; i < 128 * 128; i++) { const v = h2(i % 128, (i / 128) | 0, 91), f = h2(((i % 128) / 6) | 0, ((i / 128) / 2) | 0, 17); const t = clamp(128 + (v - 0.5) * 120 + (f - 0.5) * 40, 0, 255); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = t; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0); return c; })();

    // ---- painting a stretch of the land into a picture: rect [x0, z0, x1, z1] in metres, S pixels a metre ----
    // detail: 'full' (every mark) or 'coarse' (the long road's whole picture: colours, water and roads, fewer marks).
    // It is a job done in slices: step(ms) asks the land about its ground for that long, then returns; once every spot is
    // asked, the last step draws the picture. (Asking the land is the slow part: about 0.01 ms a spot.)
    function paintJob(rect, S, detail) {
      const [x0, z0, x1, z1] = rect, coarse = detail === 'coarse';
      const gs = Math.max(coarse ? 4 : 3.5, 4.5 / S), nx = Math.ceil((x1 - x0) / gs) + 2, nz = Math.ceil((z1 - z0) / gs) + 2, N = nx * nz;
      const near = (b, pad) => b[2] > x0 - pad && b[0] < x1 + pad && b[3] > z0 - pad && b[1] < z1 + pad;
      const placesHere = PLACES.filter((p) => near([p.x0, p.z0, p.x1, p.z1], 10));
      const polyPath = (q, pts) => { q.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) q.lineTo(pts[i][0], pts[i][1]); q.closePath(); };
      // the water drawn as lines (lakes, rivers, and each place's own water inside its ground), as a soft mask, one pixel a spot
      const mask = mkc(nx, nz), mg = mask.getContext('2d');
      mg.setTransform(1 / gs, 0, 0, 1 / gs, -(x0 - gs / 2) / gs, -(z0 - gs / 2) / gs); mg.fillStyle = mg.strokeStyle = '#fff'; mg.lineCap = mg.lineJoin = 'round';
      mg.save(); { mg.beginPath(); mg.rect(x0 - 10, z0 - 10, x1 - x0 + 20, z1 - z0 + 20); for (const p of PLACES) mg.rect(p.x0, p.z0, p.x1 - p.x0, p.z1 - p.z0); mg.clip('evenodd'); }
      for (const l of LAKES) if (near(l.b, 10)) { mg.beginPath(); polyPath(mg, l.poly); mg.fill(); }
      for (const r of RIVERS) for (let i = 0; i + 1 < r.pts.length; i++) { mg.lineWidth = (r.pts[i][2] + r.pts[i + 1][2]) / 2; mg.beginPath(); mg.moveTo(r.pts[i][0], r.pts[i][1]); mg.lineTo(r.pts[i + 1][0], r.pts[i + 1][1]); mg.stroke(); }
      mg.restore();
      for (const p of placesHere) { mg.save(); mg.beginPath(); mg.rect(p.x0, p.z0, p.x1 - p.x0, p.z1 - p.z0); mg.clip(); for (const w of p.water) { mg.beginPath(); polyPath(mg, w); mg.fill(); } mg.restore(); }
      const md = mg.getImageData(0, 0, nx, nz).data;
      const A = { thorn: new Float32Array(N), fen: new Float32Array(N), open: new Float32Array(N), pine: new Float32Array(N), water: new Float32Array(N), rim: new Float32Array(N), di: new Float32Array(N) };
      const Hh = new Float32Array(N);
      let n = 0, spent = 0, gen = null, deadline = 0;
      const job = { done: false, out: null, rect, step(budget) {
        const t = performance.now();
        while (n < N) {
          const i = n % nx, j = (n / nx) | 0, x = x0 + i * gs, z = z0 + j * gs, di = dInRect(x, z), k = kindAt(x, z);
          // past the edge of the land she can walk, only the lie of the land is kept (its open grass and firs, its hills):
          // the land's rules for thorn, fen and water run on out there in straight bands that mean nothing
          const inK = ss(-24, 0, k.rim);
          A.thorn[n] = k.thorn * inK; A.fen[n] = k.fen * inK; A.open[n] = k.open; A.pine[n] = k.pine; A.rim[n] = k.rim; A.di[n] = di;
          // the land's own water outside the places; inside one, the place's own
          A.water[n] = Math.max(di > 0 ? 0 : k.water * (k.rim > -10 ? 1 : 0), md[n * 4 + 3] / 255);
          Hh[n] = L.height ? L.height(x, z) : 0;
          n++;
          if ((n & 63) === 0 && performance.now() - t > budget) break;
        }
        spent += performance.now() - t;
        if (n >= N) {
          // then the drawing, itself in pieces
          const sampleMs = spent; if (!gen) { gen = finish(); job.sampleMs = sampleMs; }
          const t2 = performance.now(); deadline = t + budget;
          for (;;) { const tn = performance.now(), r = gen.next(); job.maxPiece = Math.max(job.maxPiece || 0, performance.now() - tn); if (r.done) { job.out = r.value; job.done = true; break; } if (performance.now() - t > budget) break; }
          spent += performance.now() - t2;
          if (job.done) { job.out.ms = spent; job.out.sampleMs = job.sampleMs; job.out.maxPiece = job.maxPiece; }
        }
        return job.done;
      } };
      return job;

      function* finish() {
      const W = Math.ceil((x1 - x0) * S), H = Math.ceil((z1 - z0) * S);
      const cv = mkc(W, H), g = cv.getContext('2d');
      const world = () => g.setTransform(S, 0, 0, S, -x0 * S, -z0 * S), px = () => g.setTransform(1, 0, 0, 1, 0, 0);
      const linePath = (q, pts) => { q.beginPath(); q.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) q.lineTo(pts[i][0], pts[i][1]); };
      const px1 = 1 / S, PT = [], mark = (n) => PT.push(n + ':' + Math.round(performance.now() - tf)), tf = performance.now();

      // 1. the ground's colour, laid on smooth from the spots: kind, hills, the edge of the land
      const im = g.createImageData(nx, nz), d = im.data, c = [0, 0, 0];
      const mixIn = (col, t) => { if (t <= 0) return; t = Math.min(1, t); c[0] += (col[0] - c[0]) * t; c[1] += (col[1] - c[1]) * t; c[2] += (col[2] - c[2]) * t; };
      for (let j = 0; j < nz; j++) { if (performance.now() > deadline) yield; for (let i = 0; i < nx; i++) {
        const x = x0 + i * gs, z = z0 + j * gs, n = j * nx + i;
        c[0] = INK.woods[0]; c[1] = INK.woods[1]; c[2] = INK.woods[2];
        mixIn(INK.pine, A.pine[n]); mixIn(INK.open, A.open[n]); mixIn(INK.thorn, A.thorn[n]); mixIn(INK.fen, A.fen[n]);
        // hills: lit from the north-west, where the moon is drawn; gently, as the long road climbs a long way
        const hx = (Hh[j * nx + Math.min(nx - 1, i + 1)] - Hh[j * nx + Math.max(0, i - 1)]) / (2 * gs), hz = (Hh[Math.min(nz - 1, j + 1) * nx + i] - Hh[Math.max(0, j - 1) * nx + i]) / (2 * gs);
        const sl = (hx + hz) * 0.7; let lit = 1 + 0.32 * Math.tanh(sl * 6);
        // the paper's slow mottle
        lit *= 0.9 + 0.2 * vn(x / 97 + 3.3, z / 97 + 1.9) + 0.06 * (vn(x / 23 + 7.1, z / 23 + 4.2) - 0.5);
        for (const f of FLATS) { const dd = Math.hypot(x - f.x, z - f.z); if (dd < f.r + 8) mixIn(INK.flat, 1 - ss(f.r * 0.7, f.r + 6, dd)); }
        c[0] *= lit; c[1] *= lit; c[2] *= lit;
        mixIn(INK.water, ss(0.3, 0.7, A.water[n]));
        // the land's edge: a dark hedge just inside it, then the land past it, faint, as if under fog
        const rim = A.rim[n]; if (rim < 16) { const hk = 1 - 0.3 * (1 - ss(0, 16, rim)) * ss(-8, 0, rim); c[0] *= hk; c[1] *= hk; c[2] *= hk; }
        mixIn(INK.beyond, 0.62 * (1 - ss(-14, 1, rim)));
        d[n * 4] = c[0]; d[n * 4 + 1] = c[1]; d[n * 4 + 2] = c[2]; d[n * 4 + 3] = 255;
      } }
      const fc = mkc(nx, nz); fc.getContext('2d').putImageData(im, 0, 0);
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      world(); g.drawImage(fc, x0 - gs / 2, z0 - gs / 2, nx * gs, nz * gs);
      const at = (arr, x, z) => { const fi = clamp((x - x0) / gs, 0, nx - 1.001), fj = clamp((z - z0) / gs, 0, nz - 1.001), i = fi | 0, j = fj | 0, u = fi - i, v = fj - j, n = j * nx + i; return lerp(lerp(arr[n], arr[n + 1], u), lerp(arr[n + nx], arr[n + nx + 1], u), v); };
      g.lineCap = g.lineJoin = 'round';

      mark('// 2. ');
      // 2. the places' walking areas: their lanes and squares, trodden pale (not where a whole place's ground is walkable)
      if (!coarse) for (const p of placesHere) {
        const area = (pts) => { let s = 0; for (let i = 0, k = pts.length - 1; i < pts.length; k = i++) s += (pts[k][0] + pts[i][0]) * (pts[k][1] - pts[i][1]); return Math.abs(s / 2); };
        const lanes = p.walk.filter((w) => area(w) < 0.4 * (p.x1 - p.x0) * (p.z1 - p.z0)); if (!lanes.length) continue;
        g.save(); g.beginPath(); g.rect(p.x0, p.z0, p.x1 - p.x0, p.z1 - p.z0); g.clip(); g.fillStyle = INK.walk; g.beginPath(); for (const w of lanes) polyPath(g, w); g.fill('nonzero'); g.restore();
      }

      mark('// 3. ');
      // 3. water, from the spots (every lake, river, fen pool and place's water alike): softened, laid on smooth, then
      // cut clean, with a pale moonlit shore and a ring of lighter water just inside it, as an old map draws still water
      mark('// 3. ');
      const F = A.water, Fb = new Float32Array(N);
      for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { let sum = 0; for (let b = -1; b <= 1; b++) { const jj = clamp(j + b, 0, nz - 1) * nx; for (let a = -1; a <= 1; a++) sum += F[jj + clamp(i + a, 0, nx - 1)] * (a ? 1 : 2) * (b ? 1 : 2); } Fb[j * nx + i] = sum / 16; }
      A.wet = Fb; yield;
      const fa = mkc(nx, nz), fg = fa.getContext('2d'), fim = fg.createImageData(nx, nz);
      for (let n = 0; n < N; n++) { fim.data[n * 4] = fim.data[n * 4 + 1] = fim.data[n * 4 + 2] = 255; fim.data[n * 4 + 3] = Math.round(Fb[n] * 255); }
      fg.putImageData(fim, 0, 0);
      const wc = mkc(W, H), wg = wc.getContext('2d'); wg.imageSmoothingEnabled = true; wg.imageSmoothingQuality = 'high';
      wg.setTransform(S, 0, 0, S, -x0 * S, -z0 * S); wg.drawImage(fa, x0 - gs / 2, z0 - gs / 2, nx * gs, nz * gs);
      yield;
      const wdat = wg.getImageData(0, 0, W, H), wp = wdat.data, ramp = gs * S * 2, WC = INK.water, RC = INK.waterIn, SC = [178, 198, 232];
      const sw = coarse ? 0.9 : 1.2;   // the shore's width, in pixels
      for (let y = 0; y < H; y++) {
        if ((y & 7) === 7 && performance.now() > deadline) yield;
        for (let x = 0, o = y * W * 4; x < W; x++, o += 4) {
          const a = wp[o + 3] / 255; if (a < 0.38) { wp[o + 3] = 0; continue; }
          const e = (a - 0.46) * ramp;   // about how many pixels inside the shore
          const ring = (coarse ? 0 : 0.42) * ss(1.6, 2.6, e) * (1 - ss(3.4, 4.6, e)), sh = 1 - ss(sw * 0.6, sw + 0.6, e);
          wp[o] = lerp(lerp(WC[0], RC[0], ring), SC[0], sh); wp[o + 1] = lerp(lerp(WC[1], RC[1], ring), SC[1], sh); wp[o + 2] = lerp(lerp(WC[2], RC[2], ring), SC[2], sh);
          wp[o + 3] = 255 * clamp(1 + e / 0.7, 0, 1);
        }
      }
      wg.putImageData(wdat, 0, 0); yield; px(); g.drawImage(wc, 0, 0); world(); yield;
      mark('water');
      // streams too narrow to trace: drawn as lines, with their banks
      for (const r of RIVERS) for (let i = 0; i + 1 < r.pts.length; i++) {
        const a = r.pts[i], b = r.pts[i + 1], w = (a[2] + b[2]) / 2; if (w > gs * 1.3 || !near([Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])], 10)) continue;
        g.strokeStyle = INK.shore; g.lineWidth = Math.max(2.6 * px1, w + 2.2); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
        g.strokeStyle = rgb(INK.water); g.lineWidth = Math.max(1.3 * px1, w); g.stroke();
      }

      mark('// 4. ');
      // 4. the land's woods, thorns, reeds and grass: one mark a few metres apart, where the ground says
      yield;
      const gm = Math.max(6, 5.5 / S), st = makeStamps(Math.min(gm * S * 0.5, coarse ? 3 : 7));
      px();
      const ci0 = Math.floor((x0 - gm) / gm), ci1 = Math.ceil((x1 + gm) / gm), cj0 = Math.floor((z0 - gm) / gm), cj1 = Math.ceil((z1 + gm) / gm);
      const pools = [];
      // where the roads run, as a mask a metre to the pixel, so the marks keep off them
      yield;
      const RM = coarse ? null : (() => { const rw = Math.ceil(x1 - x0), rh = Math.ceil(z1 - z0), c = mkc(rw, rh), q = c.getContext('2d'); q.setTransform(1, 0, 0, 1, -x0, -z0); q.strokeStyle = '#fff'; q.lineCap = q.lineJoin = 'round';
        for (const r of ROADS) if (near(r.b, 10)) { q.lineWidth = r.w + 2.8; linePath(q, r.pts); q.stroke(); } return { d: q.getImageData(0, 0, rw, rh).data, rw, rh }; })();
      const onRoad = (x, z) => { if (!RM) return false; const i = Math.floor(x - x0), j = Math.floor(z - z0); return i >= 0 && j >= 0 && i < RM.rw && j < RM.rh && RM.d[(j * RM.rw + i) * 4 + 3] > 60; };
      yield;
      for (let cj = cj0; cj <= cj1; cj++) { if (performance.now() > deadline) yield; for (let ci = ci0; ci <= ci1; ci++) {
        const x = (ci + 0.1 + 0.8 * h2(ci, cj, 1)) * gm, z = (cj + 0.1 + 0.8 * h2(ci, cj, 2)) * gm;
        if (x < x0 - gm || x > x1 + gm || z < z0 - gm || z > z1 + gm) continue;
        const rim = at(A.rim, x, z); if (rim < 1.5) continue;
        if (at(A.wet, x, z) > 0.12 || insideRect(x, z, 0.5)) continue;
        let inFlat = false; for (const f of FLATS) if (Math.hypot(x - f.x, z - f.z) < f.r + 3) inFlat = true; if (inFlat) continue;
        const t = at(A.thorn, x, z), f0 = at(A.fen, x, z), o0 = at(A.open, x, z), p0 = at(A.pine, x, z);
        const ft = f0 * (1 - t), op = o0 * (1 - t) * (1 - ft), pi = p0 * (1 - t) * (1 - ft) * (1 - op), r1 = h2(ci, cj, 3), r2 = h2(ci, cj, 4), r3 = h2(ci, cj, 5);
        let mark = null, k = 0.85 + 0.3 * r3;
        if (r1 < t) { if (r2 < 0.07 + 0.66 * ss(0.4, 0.6, vn(x / 36 + 7.7, z / 36 + 1.3))) mark = st.thorns[r3 < 0.5 ? 0 : 1]; }
        else if (r1 < t + ft) { if (r2 < 0.05) pools.push([x, z, 1.2 + 1.8 * r3]); else if (r2 < 0.5) mark = st.reeds; }
        else if (r1 < t + ft + op) { if (r2 < 0.05) { mark = st.crowns[(r3 * 3) | 0]; } else if (r2 < 0.3) mark = st.grass; }
        else if (r1 < t + ft + op + pi) { if (r2 < 0.85) mark = st.firs[r3 < 0.5 ? 0 : 1]; }
        else if (r2 < 0.5 + 0.45 * ss(0.3, 0.55, vn(x / 31 + 2.2, z / 31 + 6.1))) mark = st.crowns[(r3 * 3) | 0];
        if (!mark) continue;
        if (onRoad(x, z)) continue;
        if (rim < 16 && mark !== st.reeds && mark !== st.grass) k *= 1.12;   // the hedge at the land's edge: thick
        stampAt(g, mark, (x - x0) * S, (z - z0) * S, k);
      } }
      mark('// the');
      // the fen's small pools
      if (pools.length) { world(); for (const [x, z, r] of pools) { g.fillStyle = INK.shore; g.beginPath(); g.ellipse(x, z, r + Math.max(0.5, 0.8 * px1), r * 0.7 + Math.max(0.5, 0.8 * px1), 0, 0, 6.3); g.fill(); g.fillStyle = rgb(INK.water); g.beginPath(); g.ellipse(x, z, r, r * 0.7, 0, 0, 6.3); g.fill(); } px(); }

      mark('// 5. ');
      // 5. the places' own trees, where the place engine set them
      let nt = 0;
      if (!coarse) for (const p of placesHere) for (const [x, z, sz, kd] of p.trees) {
        if (((++nt) & 31) === 0 && performance.now() > deadline) yield;
        if (x < x0 - 6 || x > x1 + 6 || z < z0 - 6 || z > z1 + 6) continue;
        const r3 = h2(Math.round(x * 7), Math.round(z * 7), 5), mark = kd === 2 ? st.thorns[r3 < 0.5 ? 0 : 1] : kd === 1 ? st.firs[r3 < 0.5 ? 0 : 1] : st.crowns[(r3 * 3) | 0];
        stampAt(g, mark, (x - x0) * S, (z - z0) * S, clamp(0.7 + 0.35 * sz, 0.75, 1.3));
      }

      yield; mark('// 6. ');
      // 6. roads: an ink edge, then pale earth
      world();
      for (const r of ROADS) if (near(r.b, 10)) { g.strokeStyle = INK.roadCase; g.lineWidth = Math.max(r.w + 2.2, (coarse ? 3.4 : 2.6) * px1); linePath(g, r.pts); g.stroke(); }
      for (const r of ROADS) if (near(r.b, 10)) { g.strokeStyle = INK.road; g.lineWidth = Math.max(r.w * 0.9, (coarse ? 1.8 : 1.3) * px1); linePath(g, r.pts); g.stroke(); }

      yield;
      if (!coarse) {
        // 7. jetties: planks over the water
        for (const p of placesHere) for (const j of p.jetties) {
          g.fillStyle = 'rgba(6,6,14,0.7)'; g.fillRect(j.x0 - 0.5, j.z0 - 0.3, j.x1 - j.x0 + 1, j.z1 - j.z0 + 1.1);
          g.fillStyle = INK.planks; g.fillRect(j.x0, j.z0, j.x1 - j.x0, j.z1 - j.z0);
          g.strokeStyle = 'rgba(30,20,14,0.6)'; g.lineWidth = Math.max(0.25, 0.6 * px1); g.beginPath(); const along = j.x1 - j.x0 > j.z1 - j.z0;
          for (let t = 1.2; t < (along ? j.x1 - j.x0 : j.z1 - j.z0); t += 1.4) { if (along) { g.moveTo(j.x0 + t, j.z0); g.lineTo(j.x0 + t, j.z1); } else { g.moveTo(j.x0, j.z0 + t); g.lineTo(j.x1, j.z0 + t); } } g.stroke();
        }
        // 8. buildings: small roofs, lit on the moon's side, with a ridge line and a warm window
        for (const p of placesHere) for (const b of p.buildings) {
          const w = b.x1 - b.x0, h = b.z1 - b.z0, ns = b.ridge !== 'ew';
          g.fillStyle = 'rgba(4,4,12,0.65)'; g.fillRect(b.x0 + 0.8, b.z0 + 1.0, w, h);
          g.fillStyle = INK.roof; g.fillRect(b.x0, b.z0, w, h);
          g.fillStyle = INK.roofLit; if (ns) g.fillRect(b.x0, b.z0, w / 2, h); else g.fillRect(b.x0, b.z0, w, h / 2);
          g.strokeStyle = INK.ridge; g.lineWidth = Math.max(0.35, 0.9 * px1); g.beginPath(); if (ns) { g.moveTo(b.x0 + w / 2, b.z0 + 0.4); g.lineTo(b.x0 + w / 2, b.z1 - 0.4); } else { g.moveTo(b.x0 + 0.4, b.z0 + h / 2); g.lineTo(b.x1 - 0.4, b.z0 + h / 2); } g.stroke();
          g.strokeStyle = 'rgba(6,6,16,0.85)'; g.lineWidth = Math.max(0.3, 0.8 * px1); g.strokeRect(b.x0, b.z0, w, h);
          g.fillStyle = INK.window; const wr = Math.max(0.55, 1.1 * px1); g.beginPath(); g.arc(b.x0 + w * 0.5, b.z1 + 0.2, wr, 0, 6.3); g.fill();
        }
        // 9. the camp: its tents, stalls and wagons, from the camp's own list
        if (camp && near([camp.x - camp.r, camp.z - camp.r, camp.x + camp.r, camp.z + camp.r], 10)) {
          const COL = { red: '#b9473f', blue: '#4f68b8', damask: '#9a74b0' };
          for (const [kd, q] of camp.pieces || []) {
            const x = camp.x + q.x, z = camp.z + q.z, turn = q.face ? Math.atan2(-q.x, -q.z) + (q.turn || 0) * Math.PI / 180 : (q.turn || 0) * Math.PI / 180;
            g.save(); g.translate(x, z); g.rotate(-turn);
            if (kd === 'tentRound') { const r = q.r || 2.5, n = 10; g.fillStyle = 'rgba(4,4,12,0.6)'; g.beginPath(); g.arc(0.6, 0.8, r * 1.05, 0, 6.3); g.fill(); for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? '#efe2c2' : COL[q.canvas] || COL.red; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, i / n * 6.283, (i + 1) / n * 6.283); g.closePath(); g.fill(); } g.fillStyle = '#ffe0a0'; g.beginPath(); g.arc(0, 0, Math.max(0.35, r * 0.14), 0, 6.3); g.fill(); }
            else if (kd === 'tentSquare') { const w = q.w || 3.5, dd = q.d || 3; g.fillStyle = 'rgba(4,4,12,0.6)'; g.fillRect(-w / 2 + 0.6, -dd / 2 + 0.8, w, dd); g.fillStyle = COL[q.canvas] || COL.red; g.fillRect(-w / 2, -dd / 2, w, dd); g.fillStyle = '#efe2c2'; g.fillRect(-w / 2, -dd / 2, w / 2, dd); g.strokeStyle = 'rgba(6,6,16,0.8)'; g.lineWidth = 0.35; g.strokeRect(-w / 2, -dd / 2, w, dd); }
            else if (kd === 'stall' || kd === 'booth') { const w = q.w || 3.2, dd = q.d || 1.7; g.fillStyle = '#c99a5a'; g.fillRect(-w / 2, -dd / 2, w, dd); g.fillStyle = '#efe2c2'; for (let t = 0; t < 4; t += 2) g.fillRect(-w / 2 + t * w / 4, -dd / 2, w / 4, dd); }
            else if (kd === 'wagon') { g.fillStyle = '#7e5a3e'; g.fillRect(-1.6, -0.8, 3.2, 1.6); g.fillStyle = '#c0915a'; g.fillRect(-1.6, -0.8, 3.2, 0.5); }
            else if (kd === 'well') { g.fillStyle = '#9a96a8'; g.beginPath(); g.arc(0, 0, 1.1, 0, 6.3); g.fill(); g.fillStyle = rgb(INK.water); g.beginPath(); g.arc(0, 0, 0.6, 0, 6.3); g.fill(); }
            else if (kd === 'brazier' || kd === 'lanternPost') { g.fillStyle = kd === 'brazier' ? '#ffb060' : '#ffd890'; g.beginPath(); g.arc(0, 0, kd === 'brazier' ? 0.7 : 0.45, 0, 6.3); g.fill(); }
            g.restore();
          }
        }
      }

      yield; mark('// 10.');
      // 10. the paper's grain over all of it
      px(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.22; g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, W, H); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      mark('end'); return { cv, rect, S, samples: N, parts: PT.join(' ') };
      }
    }

    // ---- the pictures: the zone's, made now; the long road's whole picture and its squares, made when needed ----
    // how sharp the zone's picture needs to be: as many pixels a metre as the big map shows, either way up the screen
    const sw = Math.max(G.innerWidth || 0, G.screen ? G.screen.width : 0), sh = Math.max(G.innerHeight || 0, G.screen ? G.screen.height : 0), lo = Math.min(sw, sh), hi = Math.max(sw, sh);
    const bigW = Math.min(1100, Math.max(Math.min(hi - 44, (lo - 44) * (BX1 - BX0) / (BZ1 - BZ0)), lo - 44));
    const S0 = clamp(Math.max(bigW / (BX1 - BX0), 150 / 290) * dpr * 1.05, 1.2, PHONE ? 1.6 : 2.0);
    // the jobs waiting to be painted, done a slice at a time (about 7 thousandths of a second in every 30), so the game
    // never stops for them; with ?test each is done at once, when it is first wanted
    const jobs = []; let workT = 0;
    const want = (job, first) => {
      if (job.done) return job;
      if (TEST) { job.step(1e9); done(job); return job; }
      const i = jobs.indexOf(job); if (i > 0 && first) jobs.splice(i, 1); if (i < 0 || (i > 0 && first)) { if (first) jobs.unshift(job); else jobs.push(job); }
      if (!workT) workT = setTimeout(work, 30); return job;
    };
    function work() {
      workT = 0; const t = performance.now();
      while (jobs.length && performance.now() - t < 7) { const j = jobs[0]; if (j.step(Math.max(1, 7 - (performance.now() - t)))) { jobs.shift(); done(j); } }
      if (jobs.length) workT = setTimeout(work, 24);
    }
    function done(j) { if (j === zoneJob || j === roadJob) bigStatic = null; }
    const MARGIN = 30, ZR = [BX0 - MARGIN, BZ0 - MARGIN, BX1 + MARGIN, BZ1 + MARGIN], zoneJob = paintJob(ZR, S0, 'full');
    let roadJob = null;
    const roadPic = () => { if (!LR) return null; if (!roadJob) { const [a, b, c, d] = WIDE, m = 50 + 0.06 * Math.max(c - a, d - b), w = c - a + 2 * m, h = d - b + 2 * m, S = Math.min(1500 / Math.max(w, h), 1.2); roadJob = paintJob([a - m, b - m, c + m, d + m], S, 'coarse'); } want(roadJob); return roadJob.out; };
    const zonePic = () => want(zoneJob).out;
    const TILE = 256, tiles = new Map(); let tileUse = 0;
    const tileKey = (i, j) => i + ',' + j;
    const tileNeeded = (i, j) => { const r = [i * TILE, j * TILE, (i + 1) * TILE, (j + 1) * TILE]; return !(r[0] >= ZR[0] && r[2] <= ZR[2] && r[1] >= ZR[1] && r[3] <= ZR[3]) && r[2] > WIDE[0] && r[0] < WIDE[2] && r[3] > WIDE[1] && r[1] < WIDE[3]; };
    function tilePic(i, j) {
      const key = tileKey(i, j); let t = tiles.get(key);
      if (!t) { t = paintJob([i * TILE, j * TILE, (i + 1) * TILE, (j + 1) * TILE], Math.min(S0, 1.6), 'full'); tiles.set(key, t);
        if (tiles.size > 24) { let old = null; for (const [k, v] of tiles) if (v.done && (!old || v.use < old[1].use)) old = [k, v]; if (old) tiles.delete(old[0]); } }
      t.use = ++tileUse; want(t, true); return t.out;
    }
    let bigStatic = null;
    zonePic(); if (!TEST && LR) setTimeout(roadPic, 200);

    // ---- where she is ----
    const her = () => { const io = WK.io, M = WK.P.M; return { x: M.x(io.px), z: M.z(io.py), yaw: io.yaw }; };
    const inZone = (x, z) => x > BX0 - 4 && x < BX1 + 4 && z > BZ0 - 4 && z < BZ1 + 4;
    const fmt = (m) => (m >= 995 ? (m / 1000).toFixed(1) + ' ' + words.km : Math.round(m / 10) * 10 + ' ' + words.m);

    // ---- the place marks: small drawings, each painted once at the size it is shown ----
    const iconCache = new Map();
    function icon(kind, s) {
      const key = kind + '@' + s; let c = iconCache.get(key); if (c) return c;
      const P = Math.ceil(s * 0.3); c = mkc(s + 2 * P, s + 2 * P); const g = c.getContext('2d'); g.translate(P + s / 2, P + s / 2); g.lineCap = g.lineJoin = 'round';
      const u = s / 24, lw = Math.max(1, 1.3 * u), INKD = '#0a0a16';
      g.shadowColor = 'rgba(0,0,0,0.75)'; g.shadowBlur = 4 * u; g.shadowOffsetY = 1 * u;
      const shape = (path, fill) => { g.beginPath(); path(); g.fillStyle = fill; g.fill(); g.shadowColor = 'transparent'; g.strokeStyle = INKD; g.lineWidth = lw; g.stroke(); g.shadowColor = 'rgba(0,0,0,0.75)'; };
      const house = (x, y, w, h, rh, wall, roof, win) => {
        shape(() => { g.rect(x - w / 2, y - h, w, h); }, wall);
        shape(() => { g.moveTo(x - w / 2 - 1.2 * u, y - h); g.lineTo(x, y - h - rh); g.lineTo(x + w / 2 + 1.2 * u, y - h); g.closePath(); }, roof);
        g.shadowColor = 'transparent'; g.strokeStyle = 'rgba(235,228,255,0.7)'; g.lineWidth = Math.max(0.8, u); g.beginPath(); g.moveTo(x - w / 2 - 0.4 * u, y - h - 0.6 * u); g.lineTo(x - 0.4 * u, y - h - rh + 1.4 * u); g.stroke(); g.shadowColor = 'rgba(0,0,0,0.75)';
        if (win) { g.fillStyle = INK.window; g.fillRect(x - w * 0.16, y - h * 0.62, w * 0.32, h * 0.32); }
      };
      const waves = (y, x0, x1, col) => { g.shadowColor = 'transparent'; g.strokeStyle = col || 'rgba(170,196,236,0.9)'; g.lineWidth = Math.max(1, 1.2 * u); g.beginPath(); for (let x = x0; x < x1; x += 4 * u) { g.moveTo(x, y); g.quadraticCurveTo(x + 1 * u, y - 1.5 * u, x + 2 * u, y); g.quadraticCurveTo(x + 3 * u, y + 1.5 * u, x + 4 * u, y); } g.stroke(); g.shadowColor = 'rgba(0,0,0,0.75)'; };
      const thornTree = (x, y, h, col) => {
        const draw = () => { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h * 0.55); g.moveTo(x, y - h * 0.3); g.lineTo(x - h * 0.32, y - h * 0.62); g.lineTo(x - h * 0.42, y - h * 0.86); g.moveTo(x - h * 0.32, y - h * 0.62); g.lineTo(x - h * 0.5, y - h * 0.6);
          g.moveTo(x, y - h * 0.45); g.lineTo(x + h * 0.3, y - h * 0.8); g.lineTo(x + h * 0.26, y - h); g.moveTo(x + h * 0.3, y - h * 0.8); g.lineTo(x + h * 0.48, y - h * 0.86); g.moveTo(x, y - h * 0.55); g.lineTo(x - h * 0.06, y - h * 0.95);
          g.moveTo(x + h * 0.15, y - h * 0.6); g.lineTo(x + h * 0.24, y - h * 0.56); g.moveTo(x - h * 0.16, y - h * 0.46); g.lineTo(x - h * 0.24, y - h * 0.4); g.stroke(); };
        g.strokeStyle = INKD; g.lineWidth = Math.max(2.4, 3.4 * u); draw(); g.shadowColor = 'transparent'; g.strokeStyle = col; g.lineWidth = Math.max(1.2, 1.7 * u); draw(); g.shadowColor = 'rgba(0,0,0,0.75)';
      };
      const tuft = (x, y, h) => { g.shadowColor = 'transparent'; for (const [col, wd] of [[INKD, 2.4], ['#b4c492', 1.2]]) { g.strokeStyle = col; g.lineWidth = Math.max(wd * 0.8, wd * u); g.beginPath(); g.moveTo(x - 1.5 * u, y); g.quadraticCurveTo(x - 1.8 * u, y - h * 0.5, x - 3 * u, y - h * 0.85); g.moveTo(x, y); g.lineTo(x + 0.2 * u, y - h); g.moveTo(x + 1.5 * u, y); g.quadraticCurveTo(x + 1.8 * u, y - h * 0.5, x + 3 * u, y - h * 0.8); g.stroke(); } g.shadowColor = 'rgba(0,0,0,0.75)'; };
      if (kind === 'town') {
        house(0, 2 * u, 9 * u, 8 * u, 6 * u, '#a8a0b8', '#4a4266', true);
        house(-6.5 * u, 8 * u, 8 * u, 6.5 * u, 5 * u, '#9890aa', '#5a3e5e', true);
        house(6.5 * u, 8.5 * u, 8 * u, 6 * u, 4.6 * u, '#a29ab0', '#3e4e6a', true);
      } else if (kind === 'cottage') {
        shape(() => { g.rect(4 * u, -9 * u, 2.6 * u, 6 * u); }, '#8a8296');
        g.shadowColor = 'transparent'; g.strokeStyle = 'rgba(220,220,240,0.6)'; g.lineWidth = Math.max(0.9, 1.1 * u); g.beginPath(); g.moveTo(5.3 * u, -10 * u); g.bezierCurveTo(3 * u, -12 * u, 8 * u, -13 * u, 5.5 * u, -15.5 * u); g.stroke(); g.shadowColor = 'rgba(0,0,0,0.75)';
        house(0, 8 * u, 15 * u, 8 * u, 7.5 * u, '#b0a698', '#5c4a40', false);
        g.fillStyle = INK.window; g.fillRect(-5 * u, 2 * u, 3 * u, 2.6 * u); g.fillRect(2.4 * u, 2 * u, 3 * u, 2.6 * u); g.fillStyle = '#3a2a26'; g.fillRect(-1.2 * u, 3 * u, 2.6 * u, 5 * u);
      } else if (kind === 'jetty') {
        g.shadowColor = 'transparent'; g.fillStyle = 'rgba(30,52,96,0.9)'; g.beginPath(); g.ellipse(0, 6 * u, 11.5 * u, 5 * u, 0, 0, 6.3); g.fill(); g.shadowColor = 'rgba(0,0,0,0.75)';
        waves(8 * u, -9 * u, 9 * u);
        shape(() => { g.rect(-11 * u, -1 * u, 15 * u, 3.4 * u); }, '#a8845e');
        g.shadowColor = 'transparent'; g.strokeStyle = INKD; g.lineWidth = Math.max(1.2, 1.6 * u); g.beginPath(); for (const x of [-8, -3, 2]) { g.moveTo(x * u, 2.4 * u); g.lineTo(x * u, 6 * u); } g.stroke();
        g.strokeStyle = 'rgba(60,40,24,0.8)'; g.lineWidth = Math.max(0.6, 0.7 * u); g.beginPath(); for (let x = -9; x < 4; x += 2.2) { g.moveTo(x * u, -1 * u); g.lineTo(x * u, 2.4 * u); } g.stroke(); g.shadowColor = 'rgba(0,0,0,0.75)';
        shape(() => { g.moveTo(4 * u, 3 * u); g.lineTo(12 * u, 3 * u); g.quadraticCurveTo(11 * u, 6.5 * u, 8 * u, 6.5 * u); g.quadraticCurveTo(5 * u, 6.5 * u, 4 * u, 3 * u); g.closePath(); }, '#7a5a40');
        g.shadowColor = 'transparent'; g.strokeStyle = '#d8ccb0'; g.lineWidth = Math.max(0.8, 0.9 * u); g.beginPath(); g.moveTo(8 * u, 3 * u); g.lineTo(8 * u, -6 * u); g.stroke(); g.shadowColor = 'rgba(0,0,0,0.75)';
        shape(() => { g.moveTo(8.4 * u, -6 * u); g.lineTo(12 * u, 1.6 * u); g.lineTo(8.4 * u, 1.6 * u); g.closePath(); }, '#e6dcc4');
      } else if (kind === 'stilts') {
        g.shadowColor = 'transparent'; g.fillStyle = 'rgba(30,52,96,0.9)'; g.beginPath(); g.ellipse(0, 8.5 * u, 12 * u, 3.6 * u, 0, 0, 6.3); g.fill(); g.shadowColor = 'rgba(0,0,0,0.75)';
        const legs = (x0, x1, y0, y1) => { g.shadowColor = 'transparent'; g.strokeStyle = INKD; g.lineWidth = Math.max(1.6, 2.2 * u); g.beginPath(); for (const x of [x0, (x0 + x1) / 2, x1]) { g.moveTo(x, y0); g.lineTo(x, y1); } g.stroke(); g.strokeStyle = '#a08a6c'; g.lineWidth = Math.max(0.8, 1 * u); g.stroke(); g.shadowColor = 'rgba(0,0,0,0.75)'; };
        legs(-9 * u, -1 * u, -1 * u, 9 * u); legs(3 * u, 9.5 * u, 1 * u, 9.5 * u);
        house(-5 * u, -1 * u, 9 * u, 6 * u, 5 * u, '#968a7a', '#4e5a48', true);
        house(6.3 * u, 1 * u, 7 * u, 5 * u, 4 * u, '#8e8474', '#5a4e44', true);
        waves(9.5 * u, -10 * u, 10 * u);
      } else if (kind === 'pool') {
        tuft(-9.5 * u, 3 * u, 8 * u); tuft(9.5 * u, 4 * u, 7 * u);
        shape(() => { g.ellipse(0, 3 * u, 9.5 * u, 6 * u, 0, 0, 6.3); }, '#0c1430');
        g.shadowColor = 'transparent'; g.strokeStyle = 'rgba(178,198,232,0.9)'; g.lineWidth = Math.max(1, 1.2 * u); g.beginPath(); g.ellipse(0, 3 * u, 9.5 * u, 6 * u, 0, 0, 6.3); g.stroke();
        g.strokeStyle = 'rgba(120,150,210,0.5)'; g.beginPath(); g.ellipse(0, 3.4 * u, 6.2 * u, 3.6 * u, 0, 0, 6.3); g.stroke();
        g.fillStyle = 'rgba(230,236,255,0.85)'; g.beginPath(); g.arc(-2.6 * u, 1.2 * u, 1.6 * u, 0, 6.3); g.fill(); g.fillStyle = '#0c1430'; g.beginPath(); g.arc(-1.9 * u, 0.8 * u, 1.4 * u, 0, 6.3); g.fill();
        tuft(-4 * u, 9.6 * u, 6 * u); tuft(5 * u, 9.4 * u, 5 * u); g.shadowColor = 'rgba(0,0,0,0.75)';
      } else if (kind === 'thorns') {
        thornTree(-5 * u, 10 * u, 17 * u, '#c4a2ee'); thornTree(5.5 * u, 10 * u, 13 * u, '#a888d8');
      } else if (kind === 'tent') {
        // a striped big top: its stripes fanning from the peak, a pennant on the pole, the door
        g.save(); g.beginPath(); g.moveTo(0, -8 * u); g.lineTo(-11 * u, 0); g.lineTo(-11 * u, 9 * u); g.lineTo(11 * u, 9 * u); g.lineTo(11 * u, 0); g.closePath(); g.fillStyle = '#efe2c2'; g.fill(); g.clip(); g.shadowColor = 'transparent';
        g.fillStyle = '#c0453c'; for (let i = -5; i <= 5; i += 2) { g.beginPath(); g.moveTo(0, -8 * u); g.lineTo(i * 2.2 * u, 0); g.lineTo(i * 2.2 * u, 9 * u); g.lineTo((i + 1) * 2.2 * u, 9 * u); g.lineTo((i + 1) * 2.2 * u, 0); g.closePath(); g.fill(); }
        g.fillStyle = 'rgba(10,8,20,0.25)'; g.fillRect(-11 * u, 0, 22 * u, 9 * u); g.restore();
        g.strokeStyle = INKD; g.lineWidth = lw; g.beginPath(); g.moveTo(0, -8 * u); g.lineTo(-11 * u, 0); g.lineTo(-11 * u, 9 * u); g.lineTo(11 * u, 9 * u); g.lineTo(11 * u, 0); g.closePath(); g.moveTo(-11 * u, 0); g.lineTo(11 * u, 0); g.stroke();
        g.fillStyle = '#2a1420'; g.beginPath(); g.moveTo(-2.6 * u, 9 * u); g.lineTo(0, 2.5 * u); g.lineTo(2.6 * u, 9 * u); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,200,120,0.85)'; g.beginPath(); g.moveTo(-1.4 * u, 9 * u); g.lineTo(0, 5 * u); g.lineTo(1.4 * u, 9 * u); g.closePath(); g.fill();
        g.strokeStyle = '#d8ccb0'; g.lineWidth = Math.max(0.8, u); g.beginPath(); g.moveTo(0, -8 * u); g.lineTo(0, -13 * u); g.stroke();
        shape(() => { g.moveTo(0.4 * u, -13 * u); g.lineTo(6 * u, -11.4 * u); g.lineTo(0.4 * u, -9.8 * u); g.closePath(); }, '#ffd36b');
      } else {
        shape(() => { g.arc(0, -2 * u, 8 * u, 0, 6.3); }, '#3e6066'); g.fillStyle = '#6a8a88'; g.beginPath(); g.arc(-2.5 * u, -4.5 * u, 3.5 * u, 0, 6.3); g.fill();
        shape(() => { g.rect(-1.2 * u, 5 * u, 2.4 * u, 5 * u); }, '#5a4636');
      }
      iconCache.set(key, c); return c;
    }
    const putIcon = (q, kind, x, y, s, a) => { const c = icon(kind, Math.round(s)); q.globalAlpha = a == null ? 1 : a; q.drawImage(c, Math.round(x - c.width / 2), Math.round(y - c.height / 2)); q.globalAlpha = 1; };

    // her mark: a pointed mark in moon gold, the way she faces, in a soft halo that breathes
    function drawHer(q, x, y, yaw, R, t) {
      const fx = Math.sin(yaw), fz = Math.cos(yaw), sx = -fz, sz = fx;   // forward and to the side, on the map (x right, z down)
      const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 1.1);
      const gr = q.createRadialGradient(x, y, R * 0.3, x, y, R * (2.4 + 0.9 * pulse));
      gr.addColorStop(0, 'rgba(255,226,150,' + (0.55 - 0.15 * pulse) + ')'); gr.addColorStop(1, 'rgba(255,226,150,0)');
      q.fillStyle = gr; q.beginPath(); q.arc(x, y, R * (2.4 + 0.9 * pulse), 0, 6.3); q.fill();
      q.strokeStyle = 'rgba(255,236,190,' + (0.55 * (1 - pulse)).toFixed(3) + ')'; q.lineWidth = Math.max(1, R * 0.16); q.beginPath(); q.arc(x, y, R * (1.25 + 1.1 * pulse), 0, 6.3); q.stroke();
      const P = (f, s) => [x + fx * f * R + sx * s * R, y + fz * f * R + sz * s * R];
      const pts = [P(1.75, 0), P(-0.85, 0.95), P(-0.35, 0), P(-0.85, -0.95)];
      q.beginPath(); pts.forEach((p, i) => (i ? q.lineTo(p[0], p[1]) : q.moveTo(p[0], p[1]))); q.closePath();
      q.lineJoin = 'round'; q.lineWidth = Math.max(2, R * 0.42); q.strokeStyle = 'rgba(8,8,20,0.95)'; q.stroke();
      q.fillStyle = '#ffd36b'; q.fill();
      q.beginPath(); const a = P(1.75, 0), b = P(-0.35, 0), c = P(-0.85, 0.95); q.moveTo(a[0], a[1]); q.lineTo(b[0], b[1]); q.lineTo(c[0], c[1]); q.closePath(); q.fillStyle = '#fff4d4'; q.fill();
    }

    // copy the part of a picture that falls in a view: the view is (vx0, vz0) at the canvas's top left, k pixels a metre
    function blit(q, sh, vx0, vz0, k, W, H) {
      const [a, b, c, d] = sh.rect, ix0 = Math.max(a, vx0), iz0 = Math.max(b, vz0), ix1 = Math.min(c, vx0 + W / k), iz1 = Math.min(d, vz0 + H / k);
      if (ix1 <= ix0 || iz1 <= iz0) return;
      q.drawImage(sh.cv, (ix0 - a) * sh.S, (iz0 - b) * sh.S, (ix1 - ix0) * sh.S, (iz1 - iz0) * sh.S, (ix0 - vx0) * k, (iz0 - vz0) * k, (ix1 - ix0) * k, (iz1 - iz0) * k);
    }

    // ---- the two views ----
    const mk = (cls, label) => { const c = document.createElement('canvas'); c.className = cls; c.setAttribute('role', 'button'); c.setAttribute('aria-label', label); o.root.appendChild(c); return c; };
    const small = mk('mini', 'The map. Tap to make it big'), big = mk('bigmap', 'The map. Tap to close it');
    big.style.display = 'none';
    let isOpen = false, bigKey = '';
    const T0 = performance.now(), now = () => (performance.now() - T0) / 1000;
    const VIEW = 290;   // metres across the small map
    let smallFrame = null, smallKey = '';
    const NAMEFONT = 'Georgia, "Times New Roman", serif';

    function drawSmall() {
      const r = small.getBoundingClientRect(); if (!r.width) return;
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr); if (small.width !== w || small.height !== h) { small.width = w; small.height = h; }
      const q = small.getContext('2d'), k = w / VIEW, P = her(), vx0 = P.x - w / 2 / k, vz0 = P.z - h / 2 / k, rad = 13 * dpr;
      q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, w, h);
      q.save(); q.beginPath(); q.roundRect ? q.roundRect(0, 0, w, h, rad) : q.rect(0, 0, w, h); q.clip();
      q.fillStyle = rgb(INK.beyond); q.fillRect(0, 0, w, h);
      q.imageSmoothingEnabled = true; q.imageSmoothingQuality = 'high';
      // off the zone's picture: the long road's whole picture, then its squares near her (one new square a tick)
      const needOut = vx0 < ZR[0] || vz0 < ZR[1] || vx0 + VIEW > ZR[2] || vz0 + h / k > ZR[3];
      if (needOut && LR) {
        const rp = roadPic(); if (rp) blit(q, rp, vx0, vz0, k, w, h);
        for (let j = Math.floor(vz0 / TILE); j <= Math.floor((vz0 + h / k) / TILE); j++) for (let i = Math.floor(vx0 / TILE); i <= Math.floor((vx0 + w / k) / TILE); i++) {
          if (!tileNeeded(i, j)) continue; const t = tilePic(i, j); if (t) blit(q, t, vx0, vz0, k, w, h);
        }
      }
      const zp = zonePic(); if (zp) blit(q, zp, vx0, vz0, k, w, h);
      // the place marks in view, fainter where they would sit under her
      const isz = (w / dpr < 135 ? 19 : 22) * dpr;
      for (const m of MARKS) { const x = (m.x - vx0) * k, y = (m.z - vz0) * k; if (x < -isz || y < -isz || x > w + isz || y > h + isz) continue; putIcon(q, m.icon, x, y, isz, 0.3 + 0.7 * ss(10 * dpr, 34 * dpr, Math.hypot(x - w / 2, y - h / 2))); }
      // the frame: a soft dark edge, her mark, the border and north
      const key = w + 'x' + h;
      if (smallKey !== key) { smallKey = key; smallFrame = mkc(w, h); const f = smallFrame.getContext('2d');
        const vg = f.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.74); vg.addColorStop(0, 'rgba(6,6,16,0)'); vg.addColorStop(1, 'rgba(6,6,16,0.6)'); f.fillStyle = vg; f.fillRect(0, 0, w, h);
        f.lineWidth = 2 * dpr; f.strokeStyle = 'rgba(6,6,16,0.95)'; f.beginPath(); f.roundRect ? f.roundRect(1 * dpr, 1 * dpr, w - 2 * dpr, h - 2 * dpr, rad) : f.rect(1 * dpr, 1 * dpr, w - 2 * dpr, h - 2 * dpr); f.stroke();
        f.lineWidth = 1 * dpr; f.strokeStyle = INK.gold; f.beginPath(); f.roundRect ? f.roundRect(3.5 * dpr, 3.5 * dpr, w - 7 * dpr, h - 7 * dpr, rad - 3 * dpr) : f.rect(3.5 * dpr, 3.5 * dpr, w - 7 * dpr, h - 7 * dpr); f.stroke();
        northMark(f, w - 15 * dpr, 17 * dpr, 7.5 * dpr);
      }
      q.drawImage(smallFrame, 0, 0);
      drawHer(q, w / 2, h / 2, P.yaw, 6.2 * dpr, now());
      q.restore();
    }
    // north: a small needle with N under it
    function northMark(f, x, y, s) {
      f.save(); f.lineJoin = 'round';
      f.fillStyle = 'rgba(6,6,16,0.55)'; f.beginPath(); f.arc(x, y + s * 0.35, s * 1.55, 0, 6.3); f.fill();
      f.beginPath(); f.moveTo(x, y - s * 1.05); f.lineTo(x + s * 0.48, y + s * 0.15); f.lineTo(x - s * 0.48, y + s * 0.15); f.closePath(); f.fillStyle = '#f4e4b6'; f.fill();
      f.font = '700 ' + Math.round(s * 1.05) + 'px ' + NAMEFONT; f.textAlign = 'center'; f.textBaseline = 'top'; f.fillStyle = '#f4e4b6'; f.fillText(words.north, x, y + s * 0.25);
      f.restore();
    }

    // ---- the big map: the whole zone (or, out on the long road, the whole road), with names that never overlap ----
    function bigLayout(mode) {
      const rp = 40 + 0.06 * Math.max(WIDE[2] - WIDE[0], WIDE[3] - WIDE[1]);   // room round the long road for north, the close mark and the flag
      const box = mode === 'zone' ? [BX0 - 6, BZ0 - 6, BX1 + 6, BZ1 + 6] : [WIDE[0] - rp, WIDE[1] - rp, WIDE[2] + rp, WIDE[3] + rp];
      const bw = box[2] - box[0], bh = box[3] - box[1], vw = G.innerWidth || 1280, vh = G.innerHeight || 720;
      const pad = vw < 520 || vh < 520 ? 8 : 12, availW = vw - 20, availH = vh - 20;
      let mw = Math.min(availW - 2 * pad, (availH - 2 * pad) * bw / bh, 1100); const mh = mw * bw ? mw * bh / bw : 0;
      return { box, pad, k: mw / bw, mw, mh, cw: Math.round(mw + 2 * pad), ch: Math.round(mh + 2 * pad) };
    }
    function buildBig(mode) {
      const Lb = bigLayout(mode), cw = Lb.cw, ch = Lb.ch, W = Math.round(cw * dpr), H = Math.round(ch * dpr);
      big.style.width = cw + 'px'; big.style.height = ch + 'px'; if (big.width !== W || big.height !== H) { big.width = W; big.height = H; }
      const cv = mkc(W, H), q = cv.getContext('2d'), pad = Lb.pad * dpr, kk = Lb.k * dpr, [bx0, bz0] = Lb.box;
      const X = (x) => pad + (x - bx0) * kk, Y = (z) => pad + (z - bz0) * kk, rad = 14 * dpr;
      // paper and frame
      q.fillStyle = rgb(INK.paper); q.beginPath(); q.roundRect ? q.roundRect(0, 0, W, H, rad) : q.rect(0, 0, W, H); q.fill();
      q.save(); q.beginPath(); q.rect(pad, pad, W - 2 * pad, H - 2 * pad); q.clip(); q.fillStyle = rgb(INK.beyond); q.fillRect(0, 0, W, H);
      q.imageSmoothingEnabled = true; q.imageSmoothingQuality = 'high';
      if (mode === 'road' && roadPic()) blit(q, roadPic(), bx0 - pad / kk, bz0 - pad / kk, kk, W, H);
      if (zonePic()) blit(q, zonePic(), bx0 - pad / kk, bz0 - pad / kk, kk, W, H);
      const vg = q.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.55); vg.addColorStop(0, 'rgba(6,6,16,0)'); vg.addColorStop(1, 'rgba(6,6,16,0.5)'); q.fillStyle = vg; q.fillRect(0, 0, W, H);
      q.restore();
      q.lineWidth = 1.2 * dpr; q.strokeStyle = INK.gold; q.strokeRect(pad - 3.5 * dpr, pad - 3.5 * dpr, W - 2 * pad + 7 * dpr, H - 2 * pad + 7 * dpr);
      q.lineWidth = 1.5 * dpr; q.strokeStyle = 'rgba(6,6,16,0.9)'; q.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);
      for (const [x, y] of [[pad - 3.5 * dpr, pad - 3.5 * dpr], [W - pad + 3.5 * dpr, pad - 3.5 * dpr], [pad - 3.5 * dpr, H - pad + 3.5 * dpr], [W - pad + 3.5 * dpr, H - pad + 3.5 * dpr]]) { q.fillStyle = INK.gold; q.beginPath(); q.moveTo(x, y - 4 * dpr); q.lineTo(x + 4 * dpr, y); q.lineTo(x, y + 4 * dpr); q.lineTo(x - 4 * dpr, y); q.closePath(); q.fill(); }
      const taken = [];   // boxes names must keep clear of: [x0, y0, x1, y1]
      // north (top left), the close mark (top right), the scale (bottom left)
      const ns = 9 * dpr; northMark(q, pad + 18 * dpr, pad + 18 * dpr, ns); taken.push([pad, pad, pad + 36 * dpr, pad + 40 * dpr]);
      const xr = 15 * dpr, xx = W - pad - xr - 6 * dpr, xy = pad + xr + 6 * dpr;
      q.fillStyle = 'rgba(8,8,22,0.82)'; q.beginPath(); q.arc(xx, xy, xr, 0, 6.3); q.fill(); q.lineWidth = 1.2 * dpr; q.strokeStyle = INK.gold; q.stroke();
      q.strokeStyle = '#f4e4b6'; q.lineWidth = 2.2 * dpr; q.lineCap = 'round'; q.beginPath(); q.moveTo(xx - 5.5 * dpr, xy - 5.5 * dpr); q.lineTo(xx + 5.5 * dpr, xy + 5.5 * dpr); q.moveTo(xx + 5.5 * dpr, xy - 5.5 * dpr); q.lineTo(xx - 5.5 * dpr, xy + 5.5 * dpr); q.stroke();
      taken.push([xx - xr - 4 * dpr, xy - xr - 4 * dpr, xx + xr + 4 * dpr, xy + xr + 4 * dpr]);
      const fs = clamp(Lb.mw / 60, 12.5, 16) * dpr;
      {
        const lens = mode === 'zone' ? [100, 200, 500] : [500, 1000, 2000]; let len = lens[lens.length - 1]; for (const m of lens.slice().reverse()) if (m * kk >= 30 * dpr) len = m;   // 100 m, unless that would be too short to see
        const bl = len * kk, sx = pad + 14 * dpr, sy = H - pad - 14 * dpr, bh = 4.5 * dpr;
        q.fillStyle = 'rgba(8,8,22,0.6)'; q.fillRect(sx - 6 * dpr, sy - fs - 12 * dpr, bl + 12 * dpr, fs + bh + 18 * dpr);
        for (let i = 0; i < 4; i++) { q.fillStyle = i % 2 ? '#1a1a30' : '#f4e4b6'; q.fillRect(sx + i * bl / 4, sy - bh, bl / 4, bh); }
        q.strokeStyle = '#f4e4b6'; q.lineWidth = 1 * dpr; q.strokeRect(sx, sy - bh, bl, bh);
        q.font = '600 ' + Math.round(fs * 0.9) + 'px ' + NAMEFONT; q.textAlign = 'left'; q.textBaseline = 'bottom'; q.fillStyle = '#f4e4b6';
        q.fillText(len >= 1000 ? len / 1000 + ' ' + words.km : len + ' ' + words.m, sx, sy - bh - 3 * dpr);
        taken.push([sx - 6 * dpr, sy - fs - 12 * dpr, sx + Math.max(bl, 60 * dpr) + 6 * dpr, sy + 6 * dpr]);
      }
      let infoY = 0;
      const items = [];   // what gets a name: { name, x, y (canvas pixels), s (its mark's size, 0 for none), icon }
      if (mode === 'zone') {
        const is = clamp(Lb.mw / 36, 18, 30) * dpr;
        for (const m of MARKS) items.push({ name: m.name, x: X(m.x), y: Y(m.z), s: is, icon: m.icon });
        if (LR && LR.name) { const p = LR.pts, e = (() => { let s = LR.s0 - 30; for (let i = 0; i + 1 < p.length; i++) if (LR.cum[i + 1] >= s) { const t = (s - LR.cum[i]) / (LR.cum[i + 1] - LR.cum[i] || 1); return [lerp(p[i][0], p[i + 1][0], t), lerp(p[i][1], p[i + 1][1], t)]; } return p[0]; })(); items.push({ name: LR.name, x: X(e[0]), y: Y(e[1]), s: 8 * dpr, icon: null, small: true }); }
      } else {
        const zc = [(BX0 + BX1) / 2, (BZ0 + BZ1) / 2]; items.push({ name: (Z.place && Z.place.name) || '', x: X(zc[0]), y: Y(zc[1]), s: (BX1 - BX0) * kk * 0.9, icon: null });
        if (LR.name) { const mi = Math.floor(LR.pts.length / 2), m = LR.pts[mi]; items.push({ name: LR.name, x: X(m[0]), y: Y(m[1]), s: 10 * dpr, icon: null }); }
        // the walked / to go line: at the foot of the map, or at its head if the road runs under the foot
        q.font = '600 ' + Math.round(fs * 1.05) + 'px ' + NAMEFONT; const iw = q.measureText(fmt(4444) + ' ' + words.walked + ', ' + fmt(4444) + ' ' + words.toGo).width + 30 * dpr, ih = fs * 1.9;
        let best = null;
        for (const y of [H - pad - 24 * dpr, pad + 26 * dpr]) {
          const b = [W / 2 - iw / 2, y - ih / 2, W / 2 + iw / 2, y + ih / 2]; let bad = 0;
          for (let i = 0; i < LR.pts.length; i++) { const x = X(LR.pts[i][0]), yy = Y(LR.pts[i][1]); if (x > b[0] - 8 * dpr && x < b[2] + 8 * dpr && yy > b[1] - 8 * dpr && yy < b[3] + 8 * dpr) bad++; }
          for (const tb of taken) if (Math.min(b[2], tb[2]) > Math.max(b[0], tb[0]) && Math.min(b[3], tb[3]) > Math.max(b[1], tb[1])) bad += 1000;
          if (!best || bad < best.bad) best = { bad, y, b };
        }
        infoY = best.y; taken.push(best.b);
        // the far end of the road: a small flag
        const fe = LR.pts[LR.pts.length - 1], fx = X(fe[0]), fy = Y(fe[1]), u = dpr;
        q.lineCap = 'round'; q.strokeStyle = 'rgba(8,8,20,0.9)'; q.lineWidth = 3.4 * u; q.beginPath(); q.moveTo(fx, fy); q.lineTo(fx, fy - 15 * u); q.stroke();
        q.strokeStyle = '#e8dcc0'; q.lineWidth = 1.6 * u; q.stroke();
        q.fillStyle = '#ffd36b'; q.strokeStyle = 'rgba(8,8,20,0.9)'; q.lineWidth = 1.2 * u; q.beginPath(); q.moveTo(fx + 0.8 * u, fy - 15 * u); q.lineTo(fx + 10 * u, fy - 11.5 * u); q.lineTo(fx + 0.8 * u, fy - 8 * u); q.closePath(); q.fill(); q.stroke();
        q.fillStyle = '#e8dcc0'; q.beginPath(); q.arc(fx, fy, 2.4 * u, 0, 6.3); q.fill();
        taken.push([fx - 6 * u, fy - 18 * u, fx + 13 * u, fy + 4 * u]);
      }
      for (const it of items) if (it.icon) taken.push([it.x - it.s * 0.55, it.y - it.s * 0.6, it.x + it.s * 0.55, it.y + it.s * 0.55]);
      // names: each tries below, above, right and left of its mark, on one line or two, and takes the clearest
      const font = (it) => '600 ' + Math.round(it.small ? fs * 0.86 : fs) + 'px ' + NAMEFONT;
      const ovl = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
      const placed = [];
      const order = items.map((it, i) => i).sort((a, b) => items[a].y - items[b].y);
      for (const i of order) {
        const it = items[i]; if (!it.name) continue; q.font = font(it);
        const lines1 = [it.name], sp = it.name.split(' '); let lines2 = null;
        if (sp.length > 1) { let best = null; for (let c = 1; c < sp.length; c++) { const l = [sp.slice(0, c).join(' '), sp.slice(c).join(' ')], m = Math.max(q.measureText(l[0]).width, q.measureText(l[1]).width); if (!best || m < best[0]) best = [m, l]; } lines2 = best[1]; }
        const lh = (it.small ? fs * 0.86 : fs) * 1.12, half = it.s / 2, gap = 3 * dpr;
        let pick = null;
        for (const lines of lines2 ? [lines1, lines2] : [lines1]) {
          const tw = Math.max(...lines.map((l) => q.measureText(l).width)), th = lh * lines.length;
          const cands = [[it.x - tw / 2, it.y + half + gap, 0], [it.x - tw / 2, it.y - half - gap - th, 1], [it.x + half + gap * 2, it.y - th / 2, 2], [it.x - half - gap * 2 - tw, it.y - th / 2, 2],
            [it.x + half * 0.6, it.y + half + gap, 3], [it.x - half * 0.6 - tw, it.y + half + gap, 3], [it.x + half * 0.6, it.y - half - gap - th, 4], [it.x - half * 0.6 - tw, it.y - half - gap - th, 4]];
          for (const [cx, cy, pen] of cands) {
            const b = [cx - 3 * dpr, cy - 1 * dpr, cx + tw + 3 * dpr, cy + th + 1 * dpr]; let cost = pen * 2 + (lines.length - 1) * 5;
            const out = Math.max(0, pad + 4 * dpr - b[0]) + Math.max(0, b[2] - (W - pad - 4 * dpr)) + Math.max(0, pad + 4 * dpr - b[1]) + Math.max(0, b[3] - (H - pad - 4 * dpr)); cost += out * 50;
            for (const tb of taken.concat(placed.map((p) => p.b))) cost += ovl(b, tb) / (dpr * dpr) * 2;
            if (!pick || cost < pick.cost) pick = { cost, b, lines, cx, cy, tw, lh };
          }
          if (pick.cost < 8) break;
        }
        placed.push(Object.assign(pick, { it }));
      }
      // marks, then names on top of everything
      for (const it of items) if (it.icon) putIcon(q, it.icon, it.x, it.y, it.s);
      q.textAlign = 'center'; q.textBaseline = 'top'; q.lineJoin = 'round';
      for (const p of placed) {
        q.font = font(p.it); q.lineWidth = 3.4 * dpr; q.strokeStyle = INK.halo; q.fillStyle = p.it.small ? '#d8ccb0' : INK.label;
        p.lines.forEach((l, i) => { const x = p.cx + p.tw / 2, y = p.cy + i * p.lh; q.strokeText(l, x, y); q.fillText(l, x, y); });
      }
      bigStatic = { cv, X, Y, mode, W, H, pad, kk, fs, infoY };
    }
    function drawBig() {
      const P = her(), mode = LR && !inZone(P.x, P.z) ? 'road' : 'zone', key = mode + ':' + (G.innerWidth || 0) + 'x' + (G.innerHeight || 0);
      if (!bigStatic || bigKey !== key) { bigKey = key; buildBig(mode); }
      const B = bigStatic, q = big.getContext('2d');
      q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, B.W, B.H); q.drawImage(B.cv, 0, 0);
      q.save(); q.beginPath(); q.rect(B.pad, B.pad, B.W - 2 * B.pad, B.H - 2 * B.pad); q.clip();
      drawHer(q, B.X(P.x), B.Y(P.z), P.yaw, (mode === 'road' ? 6.5 : 7) * dpr, now());
      q.restore();
      if (mode === 'road') {
        const a = along(P.x, P.z), walked = Math.max(0, a.s - LR.s0), left = Math.max(0, LR.len - a.s);
        const s = fmt(walked) + ' ' + words.walked + ', ' + fmt(left) + ' ' + words.toGo;
        q.font = '600 ' + Math.round(B.fs * 1.05) + 'px ' + NAMEFONT; const tw = q.measureText(s).width, x = B.W / 2, y = B.infoY;
        q.fillStyle = 'rgba(8,8,22,0.78)'; q.beginPath(); q.roundRect ? q.roundRect(x - tw / 2 - 12 * dpr, y - B.fs * 0.85, tw + 24 * dpr, B.fs * 1.7, 10 * dpr) : q.rect(x - tw / 2 - 12 * dpr, y - B.fs * 0.85, tw + 24 * dpr, B.fs * 1.7); q.fill(); q.strokeStyle = INK.gold; q.lineWidth = 1 * dpr; q.stroke();
        q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillStyle = INK.label; q.fillText(s, x, y + 1 * dpr);
      }
    }

    const timing = { get zone() { return zoneJob.out ? { ms: +zoneJob.out.ms.toFixed(1), asking: +zoneJob.out.sampleMs.toFixed(1), parts: zoneJob.out.parts, longestPiece: +zoneJob.out.maxPiece.toFixed(1), size: [zoneJob.out.cv.width, zoneJob.out.cv.height], spots: zoneJob.out.samples } : null; }, scale: +S0.toFixed(2) };
    const api = {
      el: small, big, names: MARKS.map((m) => m.name), timing,
      open(on) { isOpen = !!on; big.style.display = isOpen ? 'block' : 'none'; if (isOpen) drawBig(); },
      draw() { const t = performance.now(); drawSmall(); if (isOpen) drawBig(); timing.lastDraw = +(performance.now() - t).toFixed(2); },
      // for the checks
      road: () => { const r = roadPic(); return r ? { ms: +r.ms.toFixed(1), asking: +r.sampleMs.toFixed(1), longestPiece: +r.maxPiece.toFixed(1), parts: r.parts, size: [r.cv.width, r.cv.height], spots: r.samples } : null; },
      tiles: () => ({ n: tiles.size, ms: [...tiles.values()].filter((t) => t.done).map((t) => +t.out.ms.toFixed(1)) }),
      waiting: () => jobs.length,
      layout: () => (bigStatic ? { mode: bigStatic.mode, w: bigStatic.W / dpr, h: bigStatic.H / dpr } : null),
      dispose() { clearInterval(timer); clearTimeout(workT); G.removeEventListener('resize', onResize); small.remove(); big.remove(); },
    };
    small.addEventListener('click', () => api.open(true)); big.addEventListener('click', () => api.open(false));
    for (const c of [small, big]) for (const ev of ['pointerdown', 'touchstart', 'mousedown']) c.addEventListener(ev, (e) => e.stopPropagation());   // a tap on the map is not a step or a look
    const onResize = () => { bigStatic = null; if (isOpen) drawBig(); };
    G.addEventListener('resize', onResize);
    let timer = 0;
    if (!TEST) timer = setInterval(() => { if (!document.hidden) api.draw(); }, 140);
    api.draw();
    return api;
  };
})(window);
