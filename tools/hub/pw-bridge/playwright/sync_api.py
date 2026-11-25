# A stand-in for Python's playwright.sync_api, for machines that have only a Node Playwright: it forwards every call
# to bridge.mjs, one folder up. Only what the repo's checks use. tools/hub/README.md says how.
import base64, json, os, subprocess, sys

PROPS = {'frames', 'main_frame', 'url', 'keyboard', 'mouse', 'touchscreen', 'chromium', 'firefox', 'webkit',
         'context', 'suggested_filename', 'viewport_size', 'pages', 'contexts', 'name', 'parent_frame', 'child_frames'}


class Error(Exception):
    pass


class TimeoutError(Error):
    pass


class _Conn:
    def __init__(self):
        here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.p = subprocess.Popen(['node', os.path.join(here, 'bridge.mjs')], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                  text=True, bufsize=1, encoding='utf-8')
        self.n = 0; self.handlers = {}

    def send(self, m):
        self.n += 1; m['id'] = self.n
        self.p.stdin.write(json.dumps(m, default=_enc) + '\n'); self.p.stdin.flush()
        while True:
            line = self.p.stdout.readline()
            if not line:
                raise Error('the bridge stopped')
            r = json.loads(line)
            if 'event' in r:
                self._event(r); continue
            if r.get('id') != self.n:
                continue
            if 'error' in r:
                raise (TimeoutError if r.get('timeout') else Error)(r['error'])
            return self.wrap(r.get('result'))

    def _event(self, r):
        d = r['data']
        if r['event'] == 'pageerror':
            v = Error(d.get('message')); v.message = d.get('message'); v.stack = d.get('stack')
        elif isinstance(d, dict) and '__ref' not in d:
            v = type('Ev', (), {})(); v.__dict__.update(d)
        else:
            v = self.wrap(d)
        for fn in self.handlers.get((r['target'], r['event']), []):
            fn(v)

    def wrap(self, v):
        if isinstance(v, dict) and '__ref' in v:
            return _Obj(self, v['__ref'], v['kind'])
        if isinstance(v, list):
            return [self.wrap(x) for x in v]
        return v


def _enc(o):
    if isinstance(o, _Obj):
        return {'__ref': o._id}
    if isinstance(o, (bytes, bytearray)):
        return base64.b64encode(o).decode()
    raise TypeError(repr(o))


class _Wait:
    def __init__(self, obj, what, kw):
        self.obj, self.what, self.kw = obj, what, kw

    def __enter__(self):
        self.wid = self.obj._c.send({'op': 'call', 'target': self.obj._id, 'name': '__start_wait', 'args': [self.what], 'kwargs': self.kw})
        return self

    def __exit__(self, *a):
        if a[0] is None:
            self.value = self.obj._c.send({'op': 'call', 'target': self.obj._id, 'name': '__end_wait', 'args': [self.wid]})
        return False


class _Obj:
    def __init__(self, c, i, kind):
        self._c, self._id, self._kind = c, i, kind

    def __eq__(self, o):
        return isinstance(o, _Obj) and o._id == self._id

    def __hash__(self):
        return self._id

    def __bool__(self):
        return True

    def on(self, ev, fn):
        self._c.handlers.setdefault((self._id, ev), []).append(fn)
        self._c.send({'op': 'call', 'target': self._id, 'name': 'on', 'args': [ev]})

    def expect_download(self, **kw):
        return _Wait(self, 'download', kw)

    def expect_navigation(self, **kw):
        return _Wait(self, 'navigation', kw)

    def __getattr__(self, name):
        if name.startswith('__'):
            raise AttributeError(name)
        if name in PROPS:
            return self._c.send({'op': 'get', 'target': self._id, 'name': name})
        def call(*args, **kw):
            r = self._c.send({'op': 'call', 'target': self._id, 'name': name, 'args': list(args), 'kwargs': kw})
            # wait_for_function gives a handle in real Playwright: callers read it with .json_value()
            return _Handle(r) if name == 'wait_for_function' else r
        return call


class _Handle:
    def __init__(self, v):
        self.v = v

    def json_value(self):
        return self.v

    def __bool__(self):
        return True


class _PW:
    def __enter__(self):
        self.c = _Conn(); self.root = _Obj(self.c, 0, 'Playwright')
        return self.root

    def __exit__(self, *a):
        try:
            self.c.p.stdin.write(json.dumps({'op': 'exit', 'id': 0}) + '\n'); self.c.p.stdin.flush(); self.c.p.wait(10)
        except Exception:
            self.c.p.kill()
        return False

    def start(self):
        return self.__enter__()

    def stop(self):
        self.__exit__(None, None, None)


def sync_playwright():
    return _PW()
