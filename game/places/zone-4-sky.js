// zone-4-sky.js: zone 4's sky (Coven of the Moon Faire, November 24, 2026). Made new for this zone: the first three
// zones have one night sky and no stars ("the stars only come back at the story's end": game/engine/place/core.js).
// Zone 4 needs three things that sky cannot do:
//   dawn    over Misthollow and the Moonwell the sky is a pale, cold morning that never turns ("never dark, never warm")
//   stars   when the fire has ended and the moon has set, the stars come out ("I'd forgotten the stars")
//   moon    the moon goes down ("The moon's setting, Halcyon. Let it.")
// It is the place engine's own night sky (the same colours, moon and clouds, word for word in the shader), with those
// three added. Nothing of the engine is changed: the zone's one sky is given this in place of its own, once the page
// is built.
//   const sky = W3D.zone4Sky(Z)      Z: what the walker walks (W.P)
//   sky.set({ dawn, stars, moon })    each 0 to 1: how much of the dawn, how much of the stars, how far the moon has set
(function (G) {
  'use strict';
  const W3D = G.W3D;
  W3D.zone4Sky = function (Z) {
    const T = G.THREE, U = Z.U, mesh = Z.sky || (Z.scene && Z.scene.children.find((o) => o.name === 'sky'));
    if (!mesh) return { set() {}, mesh: null };
    const HIGH = new T.Vector3(-0.45, 0.42, -0.79).normalize(), SET = new T.Vector3(-0.47, -0.16, -0.82).normalize();
    const mat = new T.ShaderMaterial({
      uniforms: { uMoonDir: { value: HIGH.clone() }, uTime: U.uTime, uFog: U.uFog, uDawn: { value: 0 }, uStars: { value: 0 } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position = p.xyww; }',
      fragmentShader: `varying vec3 vD; uniform vec3 uMoonDir, uFog; uniform float uTime, uDawn, uStars;
        float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
        void main(){
          vec3 d = normalize(vD); float y = max(d.y, 0.0);
          // the night, as zones 1 to 3 have it
          vec3 top = vec3(0.075, 0.06, 0.17), mid = vec3(0.16, 0.13, 0.32), low = vec3(0.24, 0.24, 0.44);
          vec3 c = mix(low, mid, smoothstep(0.0, 0.22, y)); c = mix(c, top, smoothstep(0.2, 0.85, y));
          // when the moon has gone the sky is darker and plainer: the deep blue of a clear night
          c = mix(c, c * vec3(0.42, 0.5, 0.7), uStars);
          // the dawn that never turns: pale, cold and without colour, a little brighter low down
          vec3 dc = mix(vec3(0.80, 0.83, 0.90), vec3(0.50, 0.55, 0.68), smoothstep(0.0, 0.75, y));
          c = mix(c, dc, uDawn);
          c = mix(sqrt(uFog) * 1.08, c, smoothstep(-0.05, 0.06, d.y));   // below the horizon: the fog, as the fogged ground shows it
          float m = dot(d, uMoonDir), up = smoothstep(-0.06, 0.02, uMoonDir.y);
          float disc = smoothstep(0.99935, 0.99955, m) * up;
          vec2 mp = d.xz * 60.0; float mare = n2(mp) * 0.5 + n2(mp * 2.3) * 0.3;
          vec3 moon = mix(vec3(1.0, 0.97, 0.9), vec3(0.78, 0.8, 0.86), smoothstep(0.45, 0.75, mare));
          c += (vec3(0.32, 0.33, 0.52) * pow(max(m, 0.0), 120.0) + vec3(0.12, 0.12, 0.22) * pow(max(m, 0.0), 12.0)) * up * (1.0 - 0.7 * uDawn);
          // thin clouds, drifting slowly (fewer under the stars)
          vec2 cp = d.xz / (d.y + 0.12) * 1.6 + vec2(uTime * 0.004, 0.0);
          float cl = smoothstep(0.55, 0.85, n2(cp * vec2(1.0, 3.0)) * 0.65 + n2(cp * 3.1) * 0.35) * smoothstep(0.03, 0.25, y) * (1.0 - 0.75 * uStars);
          vec3 cloudNight = c * 0.55 + vec3(0.18, 0.17, 0.3) * (0.5 + pow(max(m, 0.0), 30.0) * 1.5 * up);
          c = mix(c, mix(cloudNight, c * 1.06, uDawn), cl * 0.6);
          // the stars: one in about every sixty small squares of sky, each with its own size and its own slow twinkle
          if (uStars > 0.0) { vec2 sp = vec2(atan(d.z, d.x) * 1.0, asin(clamp(d.y, -1.0, 1.0))) * 110.0; sp.x *= max(0.25, cos(asin(clamp(d.y, -1.0, 1.0))));
            vec2 cell = floor(sp), f = fract(sp) - 0.5; float h = h21(cell), on = step(0.983, h);
            vec2 o = (vec2(h21(cell + 7.3), h21(cell + 3.1)) - 0.5) * 0.6; float r = length(f - o), big = h21(cell + 11.7);
            float s = on * smoothstep(0.10 + 0.10 * big, 0.0, r) * (0.55 + 0.45 * sin(uTime * (0.6 + 1.6 * big) + h * 40.0));
            c += vec3(0.86, 0.9, 1.0) * s * (0.6 + 0.9 * big) * uStars * smoothstep(0.02, 0.2, d.y) * (1.0 - cl * 0.8); }
          c = mix(c, mix(moon, vec3(0.93, 0.94, 0.97), uDawn * 0.6), disc * (1.0 - cl * 0.5));
          gl_FragColor = vec4(c, 1.0);
        }`,
      side: T.BackSide, depthWrite: false,
    });
    const old = mesh.material; mesh.material = mat; if (old && old.dispose) old.dispose();
    const state = { dawn: 0, stars: 0, moon: 0 };
    return { mesh, mat, state,
      set(o) { if (o.dawn != null) state.dawn = mat.uniforms.uDawn.value = Math.max(0, Math.min(1, o.dawn));
        if (o.stars != null) state.stars = mat.uniforms.uStars.value = Math.max(0, Math.min(1, o.stars));
        if (o.moon != null) { state.moon = Math.max(0, Math.min(1, o.moon)); mat.uniforms.uMoonDir.value.copy(HIGH).lerp(SET, state.moon).normalize(); } } };
  };
})(window);
