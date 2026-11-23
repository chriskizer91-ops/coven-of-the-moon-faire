#!/usr/bin/env python3
"""talk-outline.py: makes the zones 2 to 4 outline into one HTML page for Chris (Coven of the Moon Faire, November 19, 2026).

    python3 tools/talk-outline.py      # docs/lore/story-zones-2-4.md -> docs/lore/story-zones-2-4.html
"""
import importlib.util, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('talkpage', ROOT / 'tools/talk-page.py')
tp = importlib.util.module_from_spec(spec); spec.loader.exec_module(tp)

MORE = """
h2{margin-top:40px}
h3{color:#fff4dc;font-size:18px;margin:22px 0 6px}
p strong:first-child{color:var(--lamp)}
"""


def main():
    text = (ROOT / 'docs/lore/story-zones-2-4.md').read_text()
    status = re.search(r'\*\*Status:.*?(?=\n\n)', text, re.S).group(0)
    body = text[text.index('## What the three zones are for'):]
    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Zones 2 to 4, the outline: Coven of the Moon Faire</title>
<style>{tp.CSS}{MORE}</style></head>
<body><main>
<p class="kicker">Coven of the Moon Faire · the story job · step 3</p>
<h1>Zones 2 to 4: who speaks, and what for</h1>
<p class="status">{tp.inline(status.strip('*').replace('**', ''))}</p>
<div class="ask"><h2>What I need from you</h2><ol>
<li><strong>The shape of each zone</strong>: its stages, its people, and how many lines each. Yes, or mark it up.</li>
<li><strong>Seven new calls</strong>, at the bottom, each with my pick. The biggest are where the game ends (call 12)
and Kore’s bargain (call 13).</li>
</ol><p class="small" style="margin:8px 0 0">No line is written yet. Each zone’s lines are written when the hub
asks for them.</p></div>
{tp.md(body)}
<footer><p>Made by <code>tools/talk-outline.py</code> from <code>docs/lore/story-zones-2-4.md</code>, on the branch
<code>job/story</code>.</p></footer>
</main></body></html>
"""
    (ROOT / 'docs/lore/story-zones-2-4.html').write_text(page)
    print(f'wrote docs/lore/story-zones-2-4.html ({len(page) // 1024} KB)')


if __name__ == '__main__':
    main()
