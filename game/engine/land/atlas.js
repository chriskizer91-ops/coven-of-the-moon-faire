// atlas.js: the 3D map of Aethermoor's land, read as data, so a zone's hills and shores can be the map's
// (Coven of the Moon Faire, November 18, 2026).
// The two pictures are Envoi's (game/art/world/, made there from Chris's day atlas of Aethermoor, 4608 x 3072, north up):
// one holds how high each spot stands, the other what kind of ground it is. One pixel of them = 4 atlas pixels = 40 m.
//   await W3D.atlas.load(heightPicture, kindsPicture)
//   W3D.atlas.at(ax, ay, out)   at a spot in atlas pixels (1 atlas pixel = 10 m): out.h metres above the sea;
//                               out.hw the height of the water there, or of the nearest water; out.water, out.fen, out.open, out.pine 0 to 1 (how much of each that spot is, softened)
// Kinds, as Envoi's map names them: 0 sea, 1 river, 2 lake, 3 pine forest, 4 leafy forest, 5 grass, 6 farmland, 7 fen,
// 8 beach, 9 desert, 10 red mesa, 11 grey rock, 12 snow.
(function (G) {
  'use strict';
  const W3D = G.W3D;
  const A = W3D.atlas = { ready: false, W: 0, H: 0 };
  let HT, HW, MW, MF, MO, MP;
  const pic = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('The map of Aethermoor\'s land did not open')); i.src = src; });
  const pixels = (im) => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0); return g.getImageData(0, 0, im.width, im.height).data; };
  A.load = async function (hSrc, kSrc) {
    if (A.ready) return A;
    const [hi, ki] = await Promise.all([pic(hSrc), pic(kSrc)]);
    const hd = pixels(hi), kd = pixels(ki), w = A.W = hi.width, h = A.H = hi.height, n = w * h;
    HT = new Float32Array(n); const mw = new Float32Array(n), mf = new Float32Array(n), mo = new Float32Array(n), mp = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      HT[i] = ((hd[i * 4] * 256 + hd[i * 4 + 1]) / 10 - 100) * 10; const k = kd[i * 4];
      mw[i] = k <= 2 ? 1 : 0; mf[i] = k === 7 ? 1 : 0; mo[i] = k === 5 || k === 6 || k === 8 ? 1 : 0; mp[i] = k === 3 ? 1 : 0;
    }
    // each kind's edge softened a little (a pixel is 40 m), so shores and the fen's edge are not cut in squares
    const soft = (m) => { const o = new Float32Array(n); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue; const q = dx && dy ? 1 : dx || dy ? 2 : 4; s += m[Y * w + X] * q; c += q; } o[y * w + x] = s / c; } return o; };
    // the water's own height at every spot: on water, its surface (the sea's is 0: under the sea the height picture holds
    // the sea bed); beside water, the nearest water's, carried eight pixels out, so a lake is level right up its banks
    HW = new Float32Array(n); let known = new Uint8Array(n);
    for (let i = 0; i < n; i++) if (mw[i]) { HW[i] = kd[i * 4] === 0 ? 0 : HT[i]; known[i] = 1; }
    for (let pass = 0; pass < 8; pass++) { const nk = known.slice(); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (known[i]) continue; let sm = 0, c = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue; const j = Y * w + X; if (known[j]) { sm += HW[j]; c++; } }
      if (c) { HW[i] = sm / c; nk[i] = 1; } } known = nk; }
    for (let i = 0; i < n; i++) if (!known[i]) HW[i] = HT[i];
    MW = soft(mw); MF = soft(soft(mf)); MO = soft(soft(mo)); MP = soft(soft(mp));
    A.kindAt = (ax, ay) => kd[(Math.max(0, Math.min(h - 1, Math.floor(ay / 4))) * w + Math.max(0, Math.min(w - 1, Math.floor(ax / 4)))) * 4];
    A.ready = true; return A;
  };
  A.at = function (ax, ay, out) {
    const w = A.W, h = A.H, fx = Math.max(0, Math.min(w - 1.001, ax / 4 - 0.5)), fy = Math.max(0, Math.min(h - 1.001, ay / 4 - 0.5));
    const i = Math.floor(fx), j = Math.floor(fy), u = fx - i, v = fy - j, a = j * w + i, b = a + 1, c = a + w, d = c + 1;
    const w00 = (1 - u) * (1 - v), w10 = u * (1 - v), w01 = (1 - u) * v, w11 = u * v;
    out.h = HT[a] * w00 + HT[b] * w10 + HT[c] * w01 + HT[d] * w11;
    out.hw = HW[a] * w00 + HW[b] * w10 + HW[c] * w01 + HW[d] * w11;
    out.water = MW[a] * w00 + MW[b] * w10 + MW[c] * w01 + MW[d] * w11;
    out.fen = MF[a] * w00 + MF[b] * w10 + MF[c] * w01 + MF[d] * w11;
    out.open = MO[a] * w00 + MO[b] * w10 + MO[c] * w01 + MO[d] * w11;
    out.pine = MP[a] * w00 + MP[b] * w10 + MP[c] * w01 + MP[d] * w11;
    return out;
  };
})(window);
