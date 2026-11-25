// A bridge for the hub: lets the repo's Python checks drive a Node Playwright where Python's Playwright package is
// not installed. One JSON message per line on stdin; answers and events on stdout. tools/hub/README.md says how.
import { createRequire } from 'node:module';
import readline from 'node:readline';
const require = createRequire(process.env.COVEN_NODE_TOOLS || '/opt/node-tools/package.json');   // where a Node Playwright is installed
const pw = require('playwright');

const objs = new Map(), ids = new WeakMap(); let next = 1;
function ref(o) {
  if (o && typeof o === 'object') {
    const k = o.constructor && o.constructor.name;
    if (Array.isArray(o)) return o.map(ref);
    if (k && k !== 'Object' && !(o instanceof Error) && !Buffer.isBuffer(o)) {
      let id = ids.get(o); if (!id) { id = next++; ids.set(o, id); objs.set(id, o); }
      return { __ref: id, kind: k };
    }
    if (Array.isArray(o)) return o.map(ref);
  }
  return o;
}
const out = (m) => process.stdout.write(JSON.stringify(m) + '\n');
const RENAME = { query_selector: '$', query_selector_all: '$$', wait_for_url: 'waitForURL' };
const camel = (s) => RENAME[s] || s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const opts = (kw) => { const o = {}; for (const k in kw || {}) o[camel(k)] = kw[k]; return o; };
const unref = (v) => (v && typeof v === 'object' && v.__ref ? objs.get(v.__ref) : Array.isArray(v) ? v.map(unref) : v);
// Python's evaluate sends the text and lets the page decide: a function is called with the arg, anything else is
// an expression whose value is returned
const norm = (s) => { s = s.trim(); return /^(async)?\s*function(\s|\()/.test(s) ? '(' + s + ')' : s; };
const EVAL = ([src, arg]) => { let r = (0, eval)(src); if (typeof r === 'function') r = r(arg); return r; };
const waits = new Map();

async function handle(m) {
  const t = m.target === 0 ? pw : objs.get(m.target), args = (m.args || []).map(unref), kw = m.kwargs || {};
  if (!t) throw new Error('no such object ' + m.target);
  const name = m.name;
  if (m.op === 'get') { let v = t[camel(name)]; if (typeof v === 'function') v = await v.call(t); return ref(v); }
  switch (name) {
    case 'evaluate': return ref(await t.evaluate(EVAL, [norm(args[0]), args.length > 1 ? args[1] : kw.arg]));
    case 'wait_for_function': {
      const o = {}; if (kw.timeout != null) o.timeout = kw.timeout; if (kw.polling != null) o.polling = kw.polling;
      const h = await t.waitForFunction(EVAL, [norm(args[0]), args.length > 1 ? args[1] : kw.arg], o);
      try { return await h.jsonValue(); } catch (e) { return true; }
    }
    case 'on': {
      const ev = args[0];
      t.on(ev, (x) => {
        let data = null;
        if (ev === 'console') data = { type: x.type(), text: x.text() };
        else if (ev === 'pageerror') data = { message: x.message, stack: x.stack };
        else if (ev === 'request' || ev === 'requestfailed' || ev === 'response') data = { url: x.url() };
        else data = ref(x);
        out({ event: ev, target: m.target, data });
      });
      return null;
    }
    case 'add_init_script': return await t.addInitScript(args[0] != null ? args[0] : kw.path ? { path: kw.path } : kw.script);
    case 'set_input_files': {
      let files = args.length > 1 ? args[1] : kw.files;
      if (Array.isArray(files)) files = files.map((f) => (typeof f === 'object' && f.buffer != null ? { ...f, buffer: Buffer.from(f.buffer, 'base64') } : f));
      return await t.setInputFiles(args[0], files);
    }
    case '__start_wait': { const id = next++; const p = name; const what = args[0];
      const pr = what === 'download' ? t.waitForEvent('download', opts(kw)) : t.waitForNavigation(opts(kw));
      pr.catch(() => {}); waits.set(id, pr); return id; }
    case '__end_wait': { const pr = waits.get(args[0]); waits.delete(args[0]); return ref(await pr); }
  }
  const fn = t[camel(name)];
  if (typeof fn !== 'function') throw new Error('no method ' + name + ' on ' + (t.constructor && t.constructor.name));
  const a = args.slice(); if (Object.keys(kw).length) a.push(opts(kw));
  return ref(await fn.apply(t, a));
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
const queue = []; let busy = false;
async function pump() {
  if (busy) return; busy = true;
  while (queue.length) {
    const m = queue.shift();
    if (m.op === 'exit') { process.exit(0); }
    try { out({ id: m.id, result: await handle(m) }); }
    catch (e) { out({ id: m.id, error: String(e && e.message || e), timeout: !!(e && e.name === 'TimeoutError') }); }
  }
  busy = false;
}
rl.on('line', (l) => { if (!l.trim()) return; queue.push(JSON.parse(l)); pump(); });
rl.on('close', () => process.exit(0));
