#!/usr/bin/env python3
"""Move every green in the package onto the book cover's leather hue.

The cover is the face of the brand, so it sets the green. Its leather reads
#01401A (the median of 81% of the cover's pixels), which is hue 150.4 in OKLCH.
Each green in the package keeps the lightness its role needs and moves to that
hue, so nothing changes contrast: the mapping in tools/brand-green.json records
the contrast before and after for every one.

    python3 tools/apply-brand-green.py          # rewrite the sources
    python3 tools/apply-brand-green.py --check  # report, change nothing

docs/book/src/original.html is never touched: the book remaps its own figures
at build time (see docs/book/src/build.py).

Line endings are preserved, and the apps pin their inline scripts in a
Content-Security-Policy by hash, so run tools/sync-bundles.py afterwards or
the browser will refuse to run them.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# every file that carries a brand green, except the book's untouched source
TARGETS = [
    'befree-apps/gap/index.html', 'befree-apps/gap/app.js', 'befree-apps/gap/extras.js',
    'befree-apps/gap/manifest.webmanifest', 'befree-apps/gap/icons/favicon.svg',
    'befree-apps/gap/install.html',
    'befree-apps/streak/index.html', 'befree-apps/streak/app.js', 'befree-apps/streak/extras.js',
    'befree-apps/streak/manifest.webmanifest', 'befree-apps/streak/icons/favicon.svg',
    'befree-apps/streak/install.html',
    'befree-apps/index.html', 'befree-apps/install.css', 'befree-apps/logo.svg',
    'befree-apps/extra-paychecks.html',
    'tools/build-install-pages.py',
    'docs/install-guide/guide.html', 'docs/install-guide/logo.svg', 'docs/install-guide/qr.svg',
    'docs/start-here/book.html',
    'docs/book/src/sys2.css', 'docs/book/src/ed_figures.py', 'docs/book/src/ed_widen.py',
]


def mapping():
    d = json.load(open(os.path.join(HERE, 'brand-green.json'), encoding='utf-8'))
    return {k.upper(): v['new'] for k, v in d['map'].items()}, d['anchor']


def recolour(text, m):
    """Replace whole hex colours only, in either case, leaving #RRGGBBAA alone."""
    pat = re.compile(r'#([0-9A-Fa-f]{6})(?![0-9A-Fa-f])')
    hits = {}

    def one(mo):
        k = '#' + mo.group(1).upper()
        if k in m:
            hits[k] = hits.get(k, 0) + 1
            return m[k]
        return mo.group(0)
    return pat.sub(one, text), hits


def main():
    check = '--check' in sys.argv
    m, anchor = mapping()
    print(f'anchor {anchor} (the cover leather), {len(m)} greens mapped\n')
    total = 0
    for rel in TARGETS:
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            print(f'  MISSING  {rel}')
            continue
        with open(p, encoding='utf-8', newline='') as fh:   # keep CRLF where it is
            src = fh.read()
        out, hits = recolour(src, m)
        n = sum(hits.values())
        total += n
        if n:
            print(f'  {n:4}  {rel}')
            if not check:
                with open(p, 'w', encoding='utf-8', newline='') as fh:
                    fh.write(out)
    print(f'\n{total} colour values {"would change" if check else "changed"}')


if __name__ == '__main__':
    main()
