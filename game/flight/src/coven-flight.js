// coven-flight.js: one flight between two landings, for Coven of the Moon Faire (the flight job, November 23, 2026).
//
// This is Chris's airship game, Skies of Aethermoor, cut down to a single flight. It is made from Skies' own
// src/game/main.js: its camera, its aiming and locking on, how shots land, the raiders' tags and the screen's
// read-outs are Skies', kept as they were. What is taken out: the title, the port, the shop, the shards, the waves and
// the saving. What is new here: a flight starts over one landing and ends near another; a light marks the way; the
// raiders come once, as many as the flight is long; and the page talks to the game round it by messages.
//
// It runs in a frame of its own (the rest of the game draws with an older three.js), packed into one piece of text by
// tools/flight-build.mjs. game/flight/flight.js starts it and listens. Every number and every word comes from
// game/flight/flight-data.js, sent in with the "start" message: none is written here.
//
// Messages in (from the page that holds the frame):   start { opts }, pause { on }, stop, key { ... }, test { id, cmd, args }
// Messages out:   loaded, ready, raiders, clear, end { arrived, why, ... }, error { message }, test-reply { id, value }
import * as THREE from 'three';
import { loadShipArt } from './ship/materials.js';
import { buildShip } from './ship/build.js';
import { FLEET, STATS } from './ships/index.js';
import { makeWorld, SUN, HAZE, MAP, THINNING } from './game/world.js';
import { makeInput } from './game/input.js';
import { makeFlyer, WIND } from './game/flight.js';
import { makeBolts, makeGunnery, batteryFor, intercept } from './game/guns.js';
import { makeRaiders } from './game/raiders.js';
import { hitZones, firstHit } from './game/damage.js';
import { makeSmoke, smokeFrom } from './game/effects.js';
import minimapUrl from '../assets/map/minimap-night.webp';

const $ = (id) => document.getElementById(id);
const host = window.parent;
const post = (type, more = {}) => { try { host.postMessage({ coven: 'flight', type, ...more }, '*'); } catch { /* the page is gone */ } };
const PARTS = ['hull', 'sails', 'crystals'];
const say = (text, vars = {}) => String(text ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const compassDeg = (heading) => ((180 - THREE.MathUtils.radToDeg(heading)) % 360 + 360) % 360; // north is up the map (-z)

let api = null; // the flight, once it has begun

async function begin(o) {
  const D = o.data, Wd = D.words, test = !!o.test;
  const touch = o.touch ?? (matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1 && matchMedia('(hover: none)').matches);
  if (touch) document.body.classList.add('touch');

  // ---------- the words on the screen, all from the data file ----------
  const R = FLEET.find((s) => s.id === o.ship) ?? FLEET[0], shipW = Wd.ships[R.id] ?? { name: R.id, cls: R.id };
  const names = { from: o.from.name, to: o.to.name, ship: shipW.name };
  $('loading').textContent = Wd.loading;
  $('ship-name').textContent = shipW.name; $('ship-cls').textContent = say(Wd.shipLine, { cls: shipW.cls, length: R.length });
  for (const k of [...PARTS, 'surge', 'fps']) $(`w-${k}`).textContent = Wd[k];
  $('btn-fire').textContent = Wd.fire; $('btn-surge').textContent = Wd.surge;
  $('btn-pause').setAttribute('aria-label', Wd.pauseLabel); $('minimap').setAttribute('aria-label', Wd.mapLabel);
  $('btn-pause').hidden = !D.buttons.pause; $('btn-back').hidden = !D.buttons.turnBack;
  $('paused-title').textContent = Wd.paused[0]; $('paused-line').textContent = Wd.paused[1];
  $('btn-resume').textContent = Wd.resume; $('btn-back').textContent = Wd.turnBack;
  $('btn-help').textContent = Wd.keysButton; $('help-title').textContent = Wd.keysTitle;
  $('help-keys').innerHTML = ''; for (const [k, v] of Wd.keys) { const dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = k; dd.textContent = v; $('help-keys').append(dt, dd); }
  $('lock-hint').textContent = Wd.lockHint; $('lock-hint').dataset.nolock = Wd.noLockHint;
  $('hint').textContent = touch ? Wd.hintTouch : Wd.hintMouse;

  // ---------- the picture ----------
  const canvas = $('stage');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.6 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(HAZE, 4000, 34000);
  const camera = new THREE.PerspectiveCamera(55, 1, 1, 70000);
  const [world, art] = await Promise.all([makeWorld(renderer), loadShipArt(renderer)]);
  scene.add(world.group);

  // the night sky lights the brass a little; the moon lights the ship and throws her shadows on her own deck
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene(); envScene.add(world.group.children[0].clone());
  scene.environment = pmrem.fromScene(envScene, 0.04, 1, 60000).texture;
  scene.environmentIntensity = 2.2;
  const hemi = new THREE.HemisphereLight(0x8fa4e8, 0x2a2440, 0.85);
  const moon = new THREE.DirectionalLight(0xc9d6ff, 1.7);
  moon.castShadow = true; moon.shadow.mapSize.set(touch ? 1024 : 2048, touch ? 1024 : 2048);
  moon.shadow.bias = -0.0004; moon.shadow.normalBias = 0.04;
  scene.add(hemi, moon, moon.target);

  // ---------- the way: from one landing to the other, in the map's metres (the atlas is 4608 by 3072, 5 m a pixel) ----------
  const spot = (a) => new THREE.Vector3((a[0] / 4608 - 0.5) * MAP.w, 0, (a[1] / 3072 - 0.5) * MAP.h);
  const A = spot(o.from.atlas), B = spot(o.to.atlas), total = Math.hypot(B.x - A.x, B.z - A.z);
  const toGo = (p) => Math.hypot(B.x - p.x, B.z - p.z);
  const plan = D.raiders.find((r) => total / 1000 <= r.upToKm) ?? D.raiders[D.raiders.length - 1];
  const skies = D.skies[plan.skies] ?? D.skies.fair;
  const H0 = 14 + 3.2 * STATS[R.id].speed; // her own top speed (flight.js)
  const hurry = clamp(total / H0 / (D.minutes * 60), 1, D.hurry.most);
  WIND.dir = 0; WIND.strength = D.wind;

  // the light that marks the landing: a tall pale-gold beam, seen from the far end of the flight
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(55, 55, 3200, 20, 1, true).translate(0, 1600, 0), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false,
    uniforms: { uTime: world.time },
    // how squarely each spot of the beam faces the eye is worked out level with the ground, at every spot, so the beam
    // is as bright from 300 m as from 8 km
    vertexShader: 'varying float vY; varying vec3 vN; varying vec3 vW; void main() { vY = uv.y; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normal; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `varying float vY; varying vec3 vN; varying vec3 vW; uniform float uTime;
      void main() { float face = pow(abs(dot(normalize(vN.xz), normalize(cameraPosition.xz - vW.xz))), 2.0);
        float a = (0.42 + 0.1 * sin(uTime * 1.6 + vY * 9.0)) * face * (1.0 - smoothstep(0.55, 1.0, vY)) * smoothstep(0.0, 0.03, vY);
        gl_FragColor = vec4(vec3(1.0, 0.86, 0.55) * a, a); }`,
  }));
  beam.position.copy(B); beam.frustumCulled = false; beam.renderOrder = 5; scene.add(beam);

  // ---------- the ship, over the landing she leaves, her bow to the landing she is bound for ----------
  const bolts = makeBolts(scene), smoke = makeSmoke(scene);
  const raiders = makeRaiders(scene, art, bolts, () => ({ ...skies, pace: skies.pace * hurry }));
  const ship = buildShip(R, 'full', art);
  const at = { pos: new THREE.Vector3(A.x, D.startHeight, A.z), heading: Math.atan2(B.x - A.x, B.z - A.z) };
  ship.root.rotation.set(0, at.heading, 0); ship.root.position.copy(at.pos);
  const player = makeFlyer(ship, STATS[R.id], at, { speed: hurry });
  player.sail = D.sailAtStart; player.speed = player.H.vmax * hurry * 0.6;
  const zones = hitZones(ship);
  player.aimY = zones.aim.y;
  const gunnery = makeGunnery(ship, {});
  scene.add(ship.root);
  { const r = R.length * 0.85; Object.assign(moon.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: r * 8 }); moon.shadow.camera.updateProjectionMatrix(); }

  // ---------- the camera: behind the ship, swung round it by the mouse or a drag (Skies' own) ----------
  const cam = { yaw: 0, pitch: 0.2, dist: R.length * 1.35 + 16, zoom: 1, look: new THREE.Vector3(), shake: 0 };
  const aimPoint = new THREE.Vector3();
  let locked = null, reach = true;
  function placeCamera(dt, inp) {
    const sens = inp.locked ? 0.0026 : touch ? 0.0042 : 0.005;
    cam.yaw -= inp.look.x * sens;
    cam.pitch = clamp(cam.pitch + inp.look.y * sens, -0.35, 1.25);
    cam.zoom = clamp(cam.zoom * Math.pow(1.12, inp.zoom), 0.55, 2.6);
    // left alone for a while (and not mouse-locked), the camera eases back behind the ship
    const idle = performance.now() / 1000 - inp.lastLook;
    if (!inp.locked && idle > 3.5 && !inp.fire) {
      const k = 1 - Math.exp(-dt * 1.2);
      cam.yaw = Math.atan2(Math.sin(cam.yaw), Math.cos(cam.yaw)) * (1 - k); cam.pitch += (0.2 - cam.pitch) * k;
    }
    const a = player.heading + cam.yaw;
    cam.look.set(Math.sin(a) * Math.cos(cam.pitch), -Math.sin(cam.pitch), Math.cos(a) * Math.cos(cam.pitch));
    const target = player.pos.clone().add(new THREE.Vector3(0, R.length * 0.42 + 2, 0));
    camera.position.copy(target).addScaledVector(cam.look, -cam.dist * cam.zoom);
    camera.lookAt(target);
    if (cam.shake > 0) { cam.shake = Math.max(0, cam.shake - dt); const s = cam.shake * 0.012; camera.rotation.x += (Math.random() - 0.5) * s; camera.rotation.y += (Math.random() - 0.5) * s; }
    // the guns lock on to the raider nearest the crosshair, and lead it
    locked = null;
    let bestA = Infinity;
    for (const r of raiders.list) {
      if (r.f.down) continue;
      const v = r.f.pos.clone().sub(camera.position), along = v.dot(cam.look);
      if (along <= 0) continue;
      const ang = v.angleTo(cam.look), tol = Math.max(0.05, Math.atan((r.R.length * 0.8) / along));
      if (ang < tol && ang < bestA) { bestA = ang; locked = r; }
    }
    aimPoint.copy(target).addScaledVector(cam.look, 800);
  }
  function aimFor(battery) {
    reach = true;
    if (!locked) return;
    player.ship.root.updateMatrixWorld(true);
    const m = gunnery.muzzle(battery);
    if (!m) { reach = false; return; }
    aimPoint.copy(intercept(m.p, player.velocity, locked.f.aimAt(), locked.f.velocity, m.K.speed));
    reach = gunnery.reaches(battery, aimPoint);
  }

  // ---------- shots landing (Skies' own) ----------
  const BURST = { hull: [0xffa040, 22, 1], sails: [0xf5e6c8, 14, 0.7], crystals: [0xffe08a, 34, 1.4] };
  const F = { state: 'fly', t: 0, raised: false, cleared: false, downed: 0, hits: 0, taken: 0, timer: 0, safe: false, result: null };
  let hurt = 0;
  function hitTest(b, a, c) {
    if (b.owner === 'player') {
      const h = raiders.hitBy(a, c);
      if (!h) return false;
      h.r.f.hit(h.h.part, b.damage); F.hits++;
      bolts.burst(h.h.at, ...BURST[h.h.part]);
      return true;
    }
    if (player.down || F.state !== 'fly') return false;
    const h = firstHit(zones, player.ship.body, a, c);
    if (!h) return false;
    if (!F.safe) player.hit(h.part, b.damage);
    F.taken++;
    bolts.burst(h.at, ...BURST[h.part]);
    hurt = Math.min(1, hurt + 0.45); cam.shake = 0.3;
    return true;
  }

  // ---------- the flight: the raiders come once, she arrives or she is lost ----------
  const flash = (el) => { el.classList.remove('on', 'stay'); void el.offsetWidth; el.classList.add('on'); };
  function banner(pair, stay = false) {
    $('banner-title').textContent = say(pair[0], names); $('banner-line').textContent = say(pair[1], names);
    flash($('banner')); if (stay) { $('banner').classList.remove('on'); $('banner').classList.add('stay'); }
  }
  function toast(text) { const t = $('toast'); t.textContent = text; flash(t); }
  const alive = () => raiders.list.filter((r) => !r.f.down);
  function clearSky() {
    if (!F.raised || F.cleared) return;
    F.cleared = true; document.body.classList.remove('fight');
    post('clear', { downed: F.downed });
  }
  function journey(dt, gone) {
    F.t += dt;
    for (const r of gone) {
      F.downed++;
      bolts.burst(r.f.pos, 0xff8a3a, 60, 2.2); bolts.burst(r.f.pos.clone().add({ x: 0, y: 3, z: 0 }), 0xffe08a, 30, 1.6);
      toast(Wd.raiderDown);
    }
    if (F.state === 'lost') { if ((F.timer -= dt) <= 0) finish({ arrived: false, why: 'lost' }); return; }
    if (F.state === 'arriving') { if ((F.timer -= dt) <= 0) finish({ arrived: true }); return; }
    if (F.state !== 'fly') return;
    if (player.down) {
      F.state = 'lost'; F.timer = D.lostSeconds; document.body.classList.add('over'); banner(Wd.lost, true);
      return;
    }
    const left = toGo(player.pos);
    // raiders left far behind give up the chase
    for (const r of alive()) if (r.f.pos.distanceTo(player.pos) > 2600 && toGo(r.f.pos) > left) r.gone = true;
    if (!F.raised && left <= total * (1 - D.raidersAt)) {
      F.raised = true; document.body.classList.add('fight');
      raiders.spawnWave({ ids: [...plan.ships], captain: -1 }, player);
      banner(Wd.raiders);
      post('raiders', { ships: [...plan.ships] });
    } else if (F.raised && !F.cleared && !alive().length) {
      clearSky(); banner(Wd.clear);
    }
    if (!alive().length) player.repair(dt * 0.12); // with the sky clear the crew patch her up (Skies' own rate)
    if (left <= D.arriveWithin) {
      // any raiders still about turn away from the landing's light
      raiders.setAI(false); clearSky();
      F.state = 'arriving'; F.timer = D.arriveSeconds; document.body.classList.add('over'); banner(Wd.arrive, true);
    }
  }
  let ended = false, raf = 0;
  function finish(result) {
    if (ended) return;
    ended = true; F.state = 'over';
    F.result = { ...result, seconds: Math.round(F.t), downed: F.downed, hits: F.hits, hull: +player.frac('hull').toFixed(2) };
    document.body.classList.add('leaving');
    if (document.pointerLockElement) document.exitPointerLock();
    setTimeout(() => { dispose(); post('end', F.result); }, test ? 0 : 950);
  }
  function dispose() {
    cancelAnimationFrame(raf); raf = -1;
    try { pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss(); } catch { /* already gone */ }
  }

  // ---------- pausing ----------
  let paused = false;
  function pause(on, card = true) {
    if (ended || F.state === 'lost' || F.state === 'arriving') return;
    paused = !!on; input.active = !paused;
    if (paused && document.pointerLockElement) document.exitPointerLock();
    $('paused').hidden = !(paused && card);
  }
  $('btn-pause').addEventListener('click', () => pause(true));
  $('btn-resume').addEventListener('click', () => pause(false));
  $('btn-back').addEventListener('click', () => { $('paused').hidden = true; finish({ arrived: false, why: 'turned-back' }); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && !paused) pause(true); });

  // ---------- the keys' list, and the corner map ----------
  const toggleHelp = () => { const h = $('help'); h.hidden = !h.hidden; $('btn-help').hidden = !h.hidden; };
  $('btn-help').addEventListener('click', toggleHelp);
  const mini = $('minimap'), mctx = mini.getContext('2d'), mimg = new Image(); mimg.src = minimapUrl;
  mini.addEventListener('click', () => { mini.classList.toggle('big'); requestAnimationFrame(sizeMini); });
  function sizeMini() { const r = mini.getBoundingClientRect(); mini.width = Math.round(r.width * devicePixelRatio); mini.height = Math.round(r.height * devicePixelRatio); hudTimer = 0; }

  const input = makeInput(canvas, document.body);
  setTimeout(() => $('hint').classList.add('gone'), 9000);
  function resize() {
    const w = innerWidth, h = innerHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = w < h ? 68 : 55; camera.updateProjectionMatrix();
    camera.userData.pixelScale = renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    ship.glow.material.uniforms.uScale.value = camera.userData.pixelScale;
    sizeMini();
  }
  addEventListener('resize', resize);

  // ---------- the tags: one over each raider (Skies' own), and one over the landing ----------
  const proj = new THREE.Vector3();
  const wayTag = document.createElement('div'); wayTag.className = 'tag way';
  { const ar = document.createElement('span'), b = document.createElement('b'), d = document.createElement('span'); ar.className = 'arrow'; ar.textContent = '▲'; b.textContent = names.to; b.className = 'n'; d.className = 'd'; wayTag.append(ar, b, d); $('tags').append(wayTag); }
  const dist = (m) => (m >= 1000 ? say(Wd.km, { n: (m / 1000).toFixed(1) }) : say(Wd.m, { n: Math.round(m / 10) * 10 }));
  function pin(el, p, lift, placed, below = false) {
    const W2 = innerWidth / 2, H2 = innerHeight / 2;
    proj.copy(p); proj.y += lift; proj.project(camera);
    // in pixels from the middle of the screen; off screen (or behind), pinned to the edge in its direction
    const behind = proj.z > 1;
    let x = proj.x * W2 * (behind ? -1 : 1), y = -proj.y * H2 * (behind ? -1 : 1);
    const ax = W2 - 56, ay = H2 - 50, k = Math.max(Math.abs(x) / ax, Math.abs(y) / ay);
    const edge = behind || k > 1;
    if (edge) { x /= Math.max(k, 1e-6); y /= Math.max(k, 1e-6); }
    el.classList.toggle('edge', edge);
    placed.push({ el, x: W2 + x, y: H2 + y + (edge && y > 0 ? 40 : 0), below: below && !edge });
    if (edge) el.firstChild.style.transform = `rotate(${Math.atan2(x, -y)}rad)`;
  }
  function tags() {
    const placed = [];
    for (const r of raiders.list) {
      let el = r.tag;
      if (!el) {
        el = r.tag = document.createElement('div'); el.className = 'tag';
        const ar = document.createElement('span'), b = document.createElement('b'), d = document.createElement('span');
        ar.className = 'arrow'; ar.textContent = '▲'; b.textContent = say(Wd.raiderTag, { cls: Wd.ships[r.id]?.cls ?? r.id }); d.className = 'd'; el.append(ar, b, d);
        for (const k of PARTS) { const m = document.createElement('span'); m.className = `meter ${k}`; m.append(document.createElement('i')); el.append(m); }
        $('tags').append(el);
      }
      if (r.f.down) { el.remove(); continue; }
      pin(el, r.f.pos, r.R.length * 0.45 + 3, placed);
      el.classList.toggle('locked', r === locked);
      el.children[2].textContent = dist(r.f.pos.distanceTo(player.pos));
      PARTS.forEach((k, i) => { el.children[3 + i].firstChild.style.width = `${r.f.frac(k) * 100}%`; });
    }
    // the landing's tag rides at the ship's own height over the landing, so it shows the way and not the ground; it hangs
    // under that spot (the raiders' tags sit over their ships), which keeps it clear of the words above the skyline
    pin(wayTag, proj.set(B.x, player.pos.y, B.z).clone(), 0, placed, true);
    wayTag.children[2].textContent = dist(toGo(player.pos));
    // tags that would land on top of each other are stacked instead
    placed.sort((a, b) => a.y - b.y);
    placed.forEach((a, i) => {
      for (let j = 0; j < i; j++) { const b = placed[j]; if (Math.abs(a.x - b.x) < 84 && a.y - b.y < 40) a.y = b.y + 40; }
      a.el.style.transform = `translate(${a.x}px, ${a.y}px) translate(-50%, ${a.below ? '10px' : '-100%'})`;
    });
    for (const el of [...$('tags').children]) if (el !== wayTag && !raiders.list.some((r) => r.tag === el)) el.remove();
  }

  // ---------- the read-outs (Skies' own, with the shards, the waves and the wind taken out) ----------
  let hudTimer = 0, fpsN = 0, fpsT = performance.now();
  function hud(dt, battery) {
    hudTimer -= dt;
    hurt = Math.max(0, hurt - dt * 1.2);
    $('hurt').style.opacity = String(Math.max(hurt, player.down ? 0.6 : 0));
    const n = gunnery.count(battery), rl = gunnery.ready[battery], full = gunnery.reload(battery);
    $('battery-name').textContent = n ? Wd.batteries[battery] : Wd.noGuns;
    $('battery-count').textContent = !n ? '–' : locked && !reach ? Wd.outOfReach : say(Wd.guns[n > 1 ? 1 : 0], { n });
    $('reload-bar').style.width = `${n ? (1 - rl / full) * 100 : 0}%`;
    $('aim').className = locked ? (reach ? 'locked' : 'locked far') : '';
    tags();
    if (hudTimer > 0) return;
    hudTimer = 0.1;
    $('readout').textContent = say(Wd.speed, { kmh: Math.round(player.speed * 3.6), m: Math.round(player.pos.y).toLocaleString('en') });
    for (const k of PARTS) { $(`h-${k}`).style.width = `${player.frac(k) * 100}%`; $(`row-${k}`).classList.toggle('low', player.frac(k) < 0.3); }
    const deg = compassDeg(player.heading);
    $('heading').textContent = `${Wd.compass[Math.round(deg / 45) % 8]} ${Math.round(deg)}°`;
    const sg = player.surge;
    $('h-surge').style.width = `${(sg.on > 0 ? sg.on / 3 : sg.charge) * 100}%`;
    $('row-surge').classList.toggle('ready', sg.charge >= 1);
    $('btn-surge').disabled = sg.charge < 1;
    const w = $('warn');
    if (player.down || F.state !== 'fly') w.hidden = true;
    else if (player.frac('crystals') < 0.5) { w.hidden = false; w.textContent = Wd.warnCrystals; }
    else if (player.pos.y > THINNING - 350) { w.hidden = false; w.textContent = Wd.warnHigh; }
    else if (Math.abs(player.pos.x) > MAP.w / 2 + 1500 || Math.abs(player.pos.z) > MAP.h / 2 + 1500) { w.hidden = false; w.textContent = Wd.warnSea; }
    else w.hidden = true;
    // the corner map: the way as a dotted line, the landing as a gold diamond, the ship as a gold arrow, raiders as red dots
    if (mimg.complete && mimg.naturalWidth && mini.width) {
      const W2 = mini.width, H2 = mini.height, mx = (v) => (v / MAP.w + 0.5) * W2, my = (v) => (v / MAP.h + 0.5) * H2, s = Math.max(5, W2 / 40);
      mctx.drawImage(mimg, 0, 0, W2, H2);
      mctx.strokeStyle = '#ffe6a8'; mctx.lineWidth = Math.max(1.5, s / 4); mctx.setLineDash([s * 0.7, s * 0.7]);
      mctx.beginPath(); mctx.moveTo(mx(A.x), my(A.z)); mctx.lineTo(mx(B.x), my(B.z)); mctx.stroke(); mctx.setLineDash([]);
      mctx.fillStyle = '#ffe6a8'; mctx.strokeStyle = '#1c1638'; mctx.lineWidth = Math.max(1, s / 5);
      mctx.save(); mctx.translate(mx(B.x), my(B.z)); mctx.rotate(Math.PI / 4); mctx.fillRect(-s * 0.55, -s * 0.55, s * 1.1, s * 1.1); mctx.strokeRect(-s * 0.55, -s * 0.55, s * 1.1, s * 1.1); mctx.restore();
      mctx.fillStyle = '#ff4636';
      for (const q of raiders.list) if (!q.f.down) { mctx.beginPath(); mctx.arc(mx(q.f.pos.x), my(q.f.pos.z), s * 0.45, 0, Math.PI * 2); mctx.fill(); mctx.stroke(); }
      mctx.save(); mctx.translate(mx(player.pos.x), my(player.pos.z)); mctx.rotate(-player.heading + Math.PI);
      mctx.fillStyle = '#ffffff'; mctx.lineWidth = Math.max(1.5, s / 4);
      mctx.beginPath(); mctx.moveTo(0, -s * 1.3); mctx.lineTo(s * 0.8, s); mctx.lineTo(0, s * 0.45); mctx.lineTo(-s * 0.8, s); mctx.closePath(); mctx.fill(); mctx.stroke();
      mctx.restore();
    }
  }

  // ---------- one step of the flight: controls, flying, the raiders, the camera, the guns, the shots, the read-outs ----------
  let last = performance.now(), time = 0, held = null;
  const bring = { turn: 0, climb: 0, sailTo: 0.35 }; // the crew bringing her in, once she has arrived
  function tick(dt) {
    time += dt;
    const inp = held ?? input.read();
    const fly = F.state === 'fly';
    for (const k of inp.pressed) {
      if (k === 'c') { cam.yaw = 0; cam.pitch = 0.2; }
      else if (k === 'm') { mini.classList.toggle('big'); sizeMini(); }
      else if (k === 'h') toggleHelp();
      else if (k === 'p') pause(true);
      else if (k === 'r' && fly) player.startSurge();
    }
    if (F.state === 'arriving') { bring.climb = player.pos.y > 520 ? -0.5 : 0; player.update(dt, bring); }
    else player.update(dt, inp);
    player.ship.root.updateMatrixWorld(true);
    const gone = raiders.update(dt, player, camera);
    placeCamera(dt, inp);
    const battery = batteryFor(cam.yaw);
    aimFor(battery);
    gunnery.update(dt);
    if (inp.fire && fly && !player.down) gunnery.fire(battery, aimPoint, bolts, 'player', player.velocity);
    bolts.update(dt, hitTest, camera);
    smokeFrom(player, smoke, bolts.spark, dt);
    for (const r of raiders.list) smokeFrom(r.f, smoke, bolts.spark, dt);
    smoke.update(dt, camera);
    journey(dt, gone);
    // a Surge widens the view a little
    const fov = (innerWidth < innerHeight ? 68 : 55) + (player.surge.on > 0 ? 7 : 0);
    if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * (1 - Math.exp(-dt * 5)); camera.updateProjectionMatrix(); }
    world.time.value = time;
    world.puffs.follow(player.pos);
    moon.target.position.copy(player.pos); moon.position.copy(player.pos).addScaledVector(SUN, 400);
    art.M.canvas.userData.time.value = time;
    art.M.gem.emissiveIntensity = 0.55 + Math.sin(time * 2.4) * 0.09;
    hud(dt, battery);
  }
  let frames = 0, holdLoop = !!(test && o.hold);
  function frame(now) {
    if (raf < 0) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!holdLoop) {
      if (!paused && !ended) tick(dt);
      renderer.render(scene, camera); frames++;
      if (++fpsN && now - fpsT >= 500) { $('fps').textContent = String(Math.round(fpsN * 1000 / (now - fpsT))); fpsN = 0; fpsT = now; }
    }
    raf = requestAnimationFrame(frame);
  }

  // ---------- ready ----------
  raiders.warm(plan.ships);
  resize();
  tick(0);
  renderer.render(scene, camera);
  document.body.classList.add('ready');
  banner(Wd.setOut);
  raf = requestAnimationFrame(frame);
  window.focus();

  // ---------- the handle the checks use (tools/flight-test.py, tools/flight-look.py), and that flight.js stops it by ----------
  const state = () => ({
    state: F.state, t: +F.t.toFixed(2), total: Math.round(total), toGo: Math.round(toGo(player.pos)), raised: F.raised, cleared: F.cleared,
    raiders: alive().length, classes: raiders.list.map((r) => r.id), downed: F.downed, hits: F.hits, taken: F.taken, paused, ended, frames,
    hull: +player.frac('hull').toFixed(3), sails: +player.frac('sails').toFixed(3), crystals: +player.frac('crystals').toFixed(3),
    speed: +player.speed.toFixed(1), height: Math.round(player.pos.y), hurry: +hurry.toFixed(2), skies: plan.skies, ship: R.id, touch,
    heading: +player.heading.toFixed(3), bolts: bolts.bolts.length, stick: !$('stick').hidden, sail: +player.sail.toFixed(2),
    result: F.result, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
  });
  // the nearest raider, as a simulated captain sees it: point the bow guns at it and fire (after Skies' tools/sim-fight.mjs)
  function captain() {
    const live = alive(); if (!live.length || player.down) return null;
    live.sort((a, b) => a.f.pos.distanceTo(player.pos) - b.f.pos.distanceTo(player.pos));
    const r = live[0], T = player.pos.clone(); T.y += R.length * 0.42 + 2;
    const look = r.f.pos.clone().sub(T).normalize();
    cam.pitch = Math.max(-0.35, -Math.asin(look.y)); cam.yaw = wrap(Math.atan2(look.x, look.z) - player.heading);
    const d = r.f.pos.distanceTo(player.pos), want = R.ports && d < 700 ? cam.yaw - Math.sign(cam.yaw || 1) * Math.PI / 2 : cam.yaw;
    return { fire: true, turn: clamp(-want * 2, -1, 1), climb: clamp((r.f.pos.y - player.pos.y) / 40, -1, 1) };
  }
  const T = {
    state,
    // run the flight's clock without drawing. controls: { turn, climb, fire, ... }; auto: steer for the landing;
    // fight: a simulated captain turns on the nearest raider and fires, and steers for the landing when the sky is clear
    step({ seconds = 1, controls = {}, auto = false, fight = false, until = null } = {}) {
      for (let t = 0; t < seconds && !ended; t += 1 / 60) {
        let c = { ...controls };
        if (auto || fight) { const err = wrap(Math.atan2(B.x - player.pos.x, B.z - player.pos.z) - player.heading); c = { turn: clamp(-err * 2.2, -1, 1), climb: 0, ...controls, ...((fight && captain()) || {}) }; }
        held = { turn: 0, climb: 0, sail: 0, fire: false, look: { x: 0, y: 0 }, zoom: 0, pressed: new Set(c.press ?? []), lastLook: fight ? performance.now() / 1000 : -1e9, locked: false, ...c };
        tick(1 / 60);
        if (until && F[until]) break;
      }
      held = null;
      return state();
    },
    draw() { renderer.render(scene, camera); frames++; return state(); },
    // put her this far along the way (0 at the start, 1 over the landing), at her starting height
    warp({ frac = 0.5, side = 0 } = {}) { player.pos.set(A.x + (B.x - A.x) * frac + side, D.startHeight, A.z + (B.z - A.z) * frac); return state(); },
    cam({ yaw = 0, pitch = 0.2, zoom = 1 } = {}) { cam.yaw = yaw; cam.pitch = pitch; cam.zoom = zoom; held = { turn: 0, climb: 0, sail: 0, fire: false, look: { x: 0, y: 0 }, zoom: 0, pressed: new Set(), lastLook: performance.now() / 1000, locked: false }; tick(0); held = null; return state(); },
    sink() { player.hit('hull', 1e9); return state(); },
    safe({ on = true } = {}) { F.safe = on; return state(); },
    downRaiders() { for (const r of alive()) r.f.hit('hull', 1e9); return state(); },
    // put the raiders where a picture can see them: ahead of her and a little to each side
    showRaiders({ ahead = 150, apart = 60 } = {}) {
      alive().forEach((r, i, all) => { const f = player.forward(), s = (i - (all.length - 1) / 2) * apart; r.f.pos.set(player.pos.x + f.x * ahead + f.z * s, player.pos.y + 10 + i * 6, player.pos.z + f.z * ahead - f.x * s); r.f.heading = player.heading + 1.9; r.ship.root.position.copy(r.f.pos); r.ship.root.rotation.y = r.f.heading; });
      return state();
    },
    hold({ on = true } = {}) { holdLoop = on; last = performance.now(); return state(); },
    pause({ on = true } = {}) { pause(on); return state(); },
    // the size on the screen of everything that can be pressed
    buttons() {
      return [...document.querySelectorAll('button, #minimap')].map((b) => { const r = b.getBoundingClientRect(), cs = getComputedStyle(b); return { id: b.id, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top), shown: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' }; }).filter((b) => b.shown);
    },
    // what lies over the middle of the screen (nothing but the picture should)
    middle() { const out = []; for (const [fx, fy] of [[0.5, 0.5], [0.42, 0.5], [0.58, 0.5], [0.5, 0.42], [0.5, 0.58]]) { const e = document.elementFromPoint(innerWidth * fx, innerHeight * fy); out.push(e ? e.id || e.tagName : null); } return out; },
    words() { return document.body.innerText; },
  };
  api = { pause, finish, dispose, T, input };
  post('ready', { state: state() });
}

// ---------- talking to the page that holds the frame ----------
addEventListener('message', (e) => {
  const m = e.data;
  if (!m || m.coven !== 'flight' || e.source !== host) return;
  if (m.type === 'start' && !api) {
    begin(m.opts).catch((err) => {
      console.error(err);
      const el = $('error'); el.hidden = false; el.textContent = say(m.opts?.data?.words?.noStart ?? '{why}', { why: err.message });
      post('error', { message: String(err.message || err) });
    });
  } else if (!api) return;
  else if (m.type === 'pause') api.pause(m.on, m.card !== false);
  else if (m.type === 'stop') { api.finish({ arrived: false, why: m.why || 'stopped' }); }
  else if (m.type === 'key') {
    // a key pressed while the page round the frame had the keyboard: handed on, so it still steers
    window.dispatchEvent(new KeyboardEvent(m.down ? 'keydown' : 'keyup', { key: m.key, code: m.code, shiftKey: m.shift }));
  } else if (m.type === 'test') {
    let value;
    try { value = api.T[m.cmd](m.args || {}); } catch (err) { value = { error: String(err.message || err) }; }
    post('test-reply', { id: m.id, value });
  }
});
post('loaded');
