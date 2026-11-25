// flame-lean.js: every flame on the land leans toward the north-east, as the story's lines say (the left-overs job,
// November 25, 2026). The numbers are here, in one place; the place engine (engine/place/core.js) bends each flame.
//
// What the lines say (game/talk/zone-1.js to zone-4.js, and docs/lore/story-page.md):
//   "Every flame in the camp is leaning north-east."  (and the Grey Hat's pennant, zones 2 and 3: "North-east, always.")
//   Odile measures the lean in fingers' widths: "two at dusk, then three, then four" ("Four fingers now", stage 2);
//   after the great wraith, "They lean a finger less than at dusk", but "the lamps still lean".
//   Zone 2: "The flames lean harder here than at the lake." Zone 3: "The lean's worse up here."
//   Old Bridie, after the great wraith: "There. It's standing almost straight. I'll trim it and leave it be."
//     (Her lantern is a painted picture from the Faire's kit, its flames painted on its glass: it cannot lean without
//     being made again, so it stands as it is. The left-overs job's slip lists it with the others that cannot.)
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
    fingerDegrees: 5,      // one of Odile's fingers' widths of lean, as degrees from upright
    flicker: 0.22,         // how much a flame wavers about its lean, as a share of it (0: not at all)
    // how many fingers the flames lean, on each zone's land, at each stage of its story (0 to 4). On zone 1 the stages
    // are dusk, asked, home, the fen, after the great wraith. Left-overs' reading of the lines: a proposal.
    fingers: { z1: [2, 3, 4, 4, 1], z2: [5, 5, 5, 5, 5], z3: [6, 6, 6, 6, 6], z4: [6, 6, 6, 6, 0], faire: [0, 0, 0, 0, 0] },
    elsewhere: 2,          // a page with no story (a test page): fingers
  };
  // ---- below here: how the numbers reach the flames (no numbers to change) ----
  const D = W3D.FLAME_LEAN;
  let U = null, last = -1;
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
  }
  W3D.flameLean = { refresh, uniforms, fingers };
  uniforms(); refresh(true);
})(window);
