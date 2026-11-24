// maps-make-sky.mjs: packs the star map into one piece of text the game's page can show in a frame (the maps job).
//
//   node tools/maps-make-sky.mjs --esbuild <a folder that has node_modules/esbuild>
//
// Reads   game/maps/sky/thareia-system-star-map.html   the star map's page (the old Envoi's, with the changes marked "Coven")
//         game/maps/sky/lib/three-0.160.0/             three.js 0.160.0 and the six add-ons the map uses (MIT licence)
// Writes  game/maps/sky/star-map-frame.js              window.COVEN_SKY_FRAME = "<the whole page, three.js inside>"
//
// Why: the star map is written for three.js 0.160 as modules loaded from the web; the game runs three.js r128 as one
// plain script. So the map gets a frame of its own, and this tool joins the page and its three.js into one page that
// fetches nothing. tools/build.py then needs no Node: it only puts star-map-frame.js inside the game's page like any
// other script. Run this again only when the star map's page or its three.js changes.
// It needs esbuild (a bundler), which is not kept in the repo: `npm install esbuild` in a scratch folder, and name it.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; import { createRequire } from 'module';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'), SKY = path.join(ROOT, 'game/maps/sky'), LIB = path.join(SKY, 'lib/three-0.160.0');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
let esbuild = null;
for (const from of [arg('--esbuild'), process.env.COVEN_ESBUILD, process.cwd(), ROOT].filter(Boolean)) { try { esbuild = createRequire(path.join(path.resolve(from), 'x.js'))('esbuild'); break; } catch (e) { /* not there */ } }
if (!esbuild) { console.error('esbuild was not found. In a scratch folder: npm install esbuild   then: node tools/maps-make-sky.mjs --esbuild <that folder>'); process.exit(1); }

const page = fs.readFileSync(path.join(SKY, 'thareia-system-star-map.html'), 'utf8');
const m = page.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!m) throw new Error('the star map page has no module script');
const built = await esbuild.build({
  stdin: { contents: m[1], resolveDir: SKY, sourcefile: 'thareia-system-star-map.html', loader: 'js' },
  bundle: true, format: 'iife', minify: true, legalComments: 'none', write: false, target: ['es2019'], charset: 'utf8', metafile: true,
  alias: { 'three/addons': path.join(LIB, 'examples/jsm'), three: path.join(LIB, 'build/three.module.js') },
});
let code = built.outputFiles[0].text;
// a web address inside three.js's own warnings would stop tools/build.py (it lets no address through, read or not)
const WEB = /https?:\/\/(?!www\.w3\.org)[^\s"'`<>)\\]+/g;
const cut = code.match(WEB) || [];
code = code.replace(WEB, '(a web address was here)');
// the page's own notes for people are left out of the frame (they stay in the source page); the script is put in after
const bare = (t) => t.replace(/<!--[\s\S]*?-->\n?/g, '');
const html = bare(page.slice(0, m.index)) + '<script>\n' + code.replace(/<\/script/gi, '<\\/script') + '\n</script>' + bare(page.slice(m.index + m[0].length));
if (!html.includes('/*COVEN_SKY*/null')) throw new Error('the page has lost the place where the game writes its names (/*COVEN_SKY*/null)');
const left = html.replace(/data:[^"')\s]+/g, '').match(WEB);
if (left) throw new Error('the frame still names a web address: ' + left[0]);
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);   // two line marks a script may not hold inside a string
const text = JSON.stringify(html).replace(/<\//g, '<\\/').split(LS).join('\\u2028').split(PS).join('\\u2029');
if (/"((?:art\/|\.\/)[^"\n]+\.(webp|png|jpe?g|avif|webm|m4a|mp3))"/.test(text)) throw new Error('the frame holds something tools/build.py would take for a picture path');
const out = '// star-map-frame.js: the star map of the Thareia system as one page of text, with three.js 0.160.0 inside it, for the\n'
  + '// frame the game shows it in (game/maps/maps.js). MADE by tools/maps-make-sky.mjs from thareia-system-star-map.html and\n'
  + '// lib/three-0.160.0/: not written by hand. Change the page, then run the tool again.\n'
  + 'window.COVEN_SKY_FRAME = ' + text + ';\n';
fs.writeFileSync(path.join(SKY, 'star-map-frame.js'), out);
const files = Object.keys(built.metafile.inputs).filter((f) => f.includes('three-0.160.0'));
console.log('game/maps/sky/star-map-frame.js  ' + (out.length / 1048576).toFixed(2) + ' MB  (' + files.length + ' files of three.js 0.160.0 inside; ' + cut.length + ' web address' + (cut.length === 1 ? '' : 'es') + ' cut out of its warnings)');
