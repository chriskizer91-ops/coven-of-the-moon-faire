// flight-build.mjs: packs the flight between zones into one piece of text, game/flight/flight-frame.js.
//
//   cd game/flight && npm install        (once: esbuild, and three.js 0.186.1, the version Skies of Aethermoor is written for)
//   node tools/flight-build.mjs
//
// The flight is Chris's airship game, Skies of Aethermoor, which is written as modules for a newer three.js than the
// rest of this game draws with (r128, game/lib/). So it runs in a frame of its own: this tool joins the flight's code
// (game/flight/src/), its own three.js, the ships' painted pieces and the night map (game/flight/assets/) and its page
// (game/flight/frame.html) into one page of text, and writes that text into flight-frame.js as
//     window.COVEN_FLIGHT_FRAME = "...the whole page...";
// game/flight/flight.js puts that text in a frame when a flight starts.
//
// The built file is kept in the repo, so the game's own builder (python3 tools/build.py) needs no Node: run this tool
// only when something under game/flight/src/, game/flight/assets/ or game/flight/frame.html changes.
// tools/build.py stops if a page names any web address, so the ones in three.js's own messages are taken out here.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname, dir = root + 'game/flight/';
const require = createRequire(dir + 'package.json');
const { build } = require('esbuild');

const out = await build({
  entryPoints: [dir + 'src/coven-flight.js'], bundle: true, format: 'iife', minify: true, target: 'es2020', write: false,
  loader: { '.webp': 'dataurl', '.avif': 'dataurl', '.json': 'json' }, legalComments: 'none', absWorkingDir: dir,
});
let js = out.outputFiles[0].text;
// no web addresses: three.js names a few in its warnings (none is ever fetched). The w3.org ones are names, not addresses.
let cut = 0;
js = js.replace(/https?:\/\/(?!www\.w3\.org)[^\s"'`<>)\\]+/g, () => { cut++; return '(a web address, taken out)'; });
js = js.replace(/<\/script/gi, '<\\/script');
const html = readFileSync(dir + 'frame.html', 'utf8').replace('<!--SCRIPT-->', () => `<script>${js}</script>`);
const left = (html.replace(/data:[^"')\s]+/g, '').match(/https?:\/\/[^\s"'<>)]+/g) ?? []).filter((u) => !u.includes('www.w3.org'));
if (left.length) { console.error('STOP: the page still names a web address: ' + left.slice(0, 5).join(', ')); process.exit(1); }
// as a JavaScript string, safe inside a <script> block (tools/build.py puts this file inside the page)
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const text = JSON.stringify(html).replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--').split(LS).join('\\u2028').split(PS).join('\\u2029');
const file = `// flight-frame.js: BUILT by tools/flight-build.mjs. Do not edit by hand: change game/flight/src/, game/flight/assets/ or
// game/flight/frame.html and run the tool again. It is the whole page of the flight between zones, as one piece of
// text: the flight's code (from Chris's Skies of Aethermoor), its own three.js 0.186.1, the ships' painted pieces and
// the night map. game/flight/flight.js puts it in a frame when a flight starts. Load it before flight.js.
window.COVEN_FLIGHT_FRAME = ${text};
`;
writeFileSync(dir + 'flight-frame.js', file);
console.log(`game/flight/flight-frame.js: ${(file.length / 1048576).toFixed(2)} MB (code ${(js.length / 1048576).toFixed(2)} MB with the pictures inside; ${cut} web addresses taken out)`);
