// flame-lean.js: every flame on the land leans toward the north-east, as the story's lines say (the left-overs job,
// November 25, 2026). The numbers are here, in one place; the place engine (engine/place/core.js) bends each flame.
//
// What the lines say (game/talk/zone-1.js to zone-4.js, and docs/lore/story-page.md):
//   "Every flame in the camp is leaning north-east."  (and the Grey Hat's pennant, zones 2 and 3: "North-east, always.")
//   Odile measures the lean in fingers' widths: "two at dusk, then three, then four" ("Four fingers now", stage 2);
//   after the great wraith, "They lean a finger less than at dusk", but "the lamps still lean".
//   Zone 2: "The flames lean harder here than at the lake." Zone 3: "The lean's worse up here."
//   Old Bridie, after the great wraith: "There. It's standing almost straight. I'll trim it and leave it be."
//   At the Faire, at the end: "Every flame standing straight. Not a finger's lean."
// Which way is north: on every zone's land, north is -z and east is +x (each land lies on the map of Aethermoor by a
// shift and a scale and no turn: game/places/zone-N.js, atlas.map; the small map draws -z at the top, under its N).
//
// THE NUMBERS A PERSON MAY CHANGE
(function (G) {
  'use strict';
  const W3D = G.W3D = G.W3D || {};
  W3D.FLAME_LEAN = {
    on: true,              // false: every flame stands straight, as before
    strength: 1,           // how far they all lean: 1 as below, 0.5 half as far, 2 twice as far
    toward: 45,            // which way, in degrees from north round toward east: 0 north, 45 north-east (the lines), 90 east
    fingerDegrees: 3.5,    // one of Odile's fingers' widths of lean, as degrees from upright
    flicker: 0.22,         // how much a flame wavers about its lean, as a share of it (0: not at all)
    // how many fingers the flames lean, on each zone's land, at each stage of its story (0 to 4). On zone 1 the stages
    // are dusk, asked, home, the fen, after the great wraith. Left-overs' reading of the lines: a proposal.
    fingers: { z1: [2, 3, 4, 4, 1], z2: [5, 5, 5, 5, 5], z3: [6, 6, 6, 6, 6], z4: [6, 6, 6, 6, 0], faire: [0, 0, 0, 0, 0] },
    elsewhere: 2,          // a page with no story (a test page): fingers
    bridieAfter: 0.25,     // Old Bridie's lamp once the great wraith has passed (zone 1, stage 4): fingers ("almost straight")
  };
  // ---- below here: how the numbers reach the flames (no numbers to change) ----
  const D = W3D.FLAME_LEAN;
  let U = null, last = -1, bridie = 0;
  // the shared values every leaning flame reads: uLean = (east, tan of the lean, south), uLeanF = how much it wavers
  function uniforms() {
    if (U || !G.THREE) return U;
    U = W3D.LEAN_U = W3D.LEAN_U || { uLean: { value: new G.THREE.Vector3(0, 0, 0) }, uLeanF: { value: 0 } };
    return U;
  }
  // how many fingers now, from the story on this page
  function fingers() {
    const S = G.__story; if (!S) return D.elsewhere;
    const key = (W3D.STORY && S.cfg === W3D.STORY.faire) ? 'faire' : S.zone, row = D.fingers[key];
    let st = 0; try { st = S.state().stage | 0; } catch (e) {}
    return row ? row[Math.max(0, Math.min(row.length - 1, st))] : D.elsewhere;
  }
  function refresh(now) {
    const u = uniforms(); if (!u) return;
    const t = typeof performance !== 'undefined' ? performance.now() : 0;
    if (!now && t - last < 400) return; last = t;
    const a = D.toward * Math.PI / 180, f = D.on ? fingers() : 0, deg = f * D.fingerDegrees * D.strength;
    u.uLean.value.set(Math.sin(a), Math.tan(Math.min(60, deg) * Math.PI / 180), -Math.cos(a));     // east is +x, north is -z
    u.uLeanF.value = D.on ? D.flicker : 0;
    // Old Bridie's lamp: as the rest, but almost straight once the great wraith has passed
    const S = G.__story; let st = 0; try { st = S ? S.state().stage | 0 : 0; } catch (e) {}
    const fb = (S && S.zone === 'z1' && st >= 4) ? D.bridieAfter : f;
    bridie = D.on ? Math.tan(Math.min(60, fb * D.fingerDegrees * D.strength) * Math.PI / 180) : 0;
  }
  // one flame of its own, for a lamp the place engine does not build (Old Bridie's): a small tongue of fire, its root
  // at (0, 0, 0) and h tall, leaning by the same numbers. time: the place's own clock uniform ({ value: seconds }).
  function flame(h, time, who) {
    const T = G.THREE, u = uniforms(); refresh(true);
    const pts = []; for (let i = 0; i <= 10; i++) { const v = i / 10, r = Math.sin(Math.PI * Math.pow(v, 0.62)) * (1 - v * 0.55) * 0.32; pts.push(new T.Vector2(Math.max(0.0001, r), v)); }
    const g = new T.LatheGeometry(pts, 10); g.scale(h, h, h);
    const mine = { value: 0 };
    const m = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: { uLean: u.uLean, uLeanF: u.uLeanF, uMine: mine, uTime: time || { value: 0 }, uH: { value: h } },
      vertexShader: 'uniform vec3 uLean; uniform float uLeanF, uMine, uTime, uH; varying float vY; varying vec3 vN, vV;' +
        'void main(){ vec3 p = position; vY = p.y / uH; vec4 w = modelMatrix * vec4(p, 1.0);' +
        ' float fl = 1.0 + uLeanF * (0.55 * sin(uTime * 7.3 + w.x * 3.1 + w.z * 2.3) + 0.45 * sin(uTime * 12.9 - w.x * 5.7 + w.z * 4.1));' +
        ' w.xz += vec2(uLean.x, uLean.z) * uMine * p.y * fl; w.y += p.y * 0.08 * uLeanF * sin(uTime * 9.1 + w.x * 2.0);' +
        ' vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: 'varying float vY; varying vec3 vN, vV;' +
        'void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 0.8); vec3 c = mix(vec3(1.0, 0.92, 0.62), vec3(1.0, 0.45, 0.12), smoothstep(0.15, 0.95, vY));' +
        ' float a = e * (1.0 - smoothstep(0.7, 1.0, vY)) * 1.15; gl_FragColor = vec4(c * a, 1.0); }' });
    const mesh = new T.Mesh(g, m); mesh.renderOrder = 5; mesh.name = 'leaning-flame';
    mesh.onBeforeRender = () => { refresh(); mine.value = who === 'bridie' ? bridie : u.uLean.value.y; };
    return mesh;
  }
  W3D.flameLean = { refresh, flame, uniforms, fingers };
  uniforms(); refresh(true);
})(window);
