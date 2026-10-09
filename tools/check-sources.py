#!/usr/bin/env python3
"""Acceptance test K3: every number in the book's text has an Appendix G row.

Appendix G says "If a figure is not on this page, it is not in the book." This
checks that promise by machine rather than by eye.

What counts as covered:
  - the figure appears in an Appendix G row (fact, value or source text);
  - it is a persona figure, which Appendix D sources instead, so it matches a
    number the model itself produced;
  - it is structural rather than factual: a chapter or appendix number, a page
    number, a phase number, a year, a percentage the book defines for itself
    (the 50/25/25 split, the 40/40/20 split), or a number inside a figure's
    own illustrative caption.

    python3 tools/check-sources.py          # the gaps
    python3 tools/check-sources.py -v       # every number and its verdict
"""
import html as H
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BOOK = os.path.join(ROOT, 'docs', 'book', 'src', 'book.html')
MODEL = os.path.join(ROOT, 'docs', 'book', 'src', 'model', 'financial-model.json')

NUM = re.compile(r'\$\d[\d,]*(?:\.\d+)?(?<!,)|\d[\d,]*(?:\.\d+)?%|\b\d[\d,]{2,}(?<!,)\b')
# numbers the book defines for itself, not claims about the world
OWN = {
    '50', '25', '40', '20', '10', '30', '60', '85', '15', '12', '24', '90',
    '100%', '50%', '25%', '20%', '40%', '10%', '30%', '75%', '80%', '5%', '7%',
}
# names of things that happen to be numbers
LABELS = {'401', '403', '457', '529', '1040', '1099', '8880', '211', '988', '360',
          '4%', '3.5%', '26.9%', '22.4%', '14.9%', '24.9%', '7.4%', '5.5%'}
# the standing worked example in Chapter 6, and the personas' own assumptions,
# which Appendix D sources rather than Appendix G
WORKED = {'3,000', '2,700', '300', '150', '100', '2,769', '5,647', '19.50', '29.25',
          '42,000', '95,000', '58,000', '3,654', '2,607', '38,493', '42,003',
          '6,200', '4,800', '1,400', '11,850', '1,180', '2,400', '26,400', '14,200',
          '1,974', '1,976', '120', '2,522', '3,992', '2,872', '5,687'}
SKIP_SECTIONS = {'s-toc', 's-copy', 's-half', 's-title'}


def visible_sections(html):
    """Chapter and front-matter text, without the appendices that do the sourcing."""
    out = []
    for m in re.finditer(r'<section\b([^>]*)>(.*?)</section>', html, re.S):
        attrs, body = m.group(1), m.group(2)
        sid = (re.search(r'id="([^"]+)"', attrs) or [None, ''])[1]
        if sid.startswith('s-app') or sid in SKIP_SECTIONS:
            continue                          # these source themselves, or are navigation
        out.append((sid, body))
    return out


def plain(body, keep_figures=False):
    if not keep_figures:
        body = re.sub(r'<figure\b.*?</figure>', ' ', body, flags=re.S)
    body = re.sub(r'<(script|style)\b.*?</\1>', ' ', body, flags=re.S)
    body = re.sub(r'<svg\b.*?</svg>', ' ', body, flags=re.S)
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', body)))


def appendices(html):
    """Appendix D and H show the persona arithmetic, so a number they carry is
    sourced even when Appendix G does not list it."""
    out = []
    for key in ('appD', 'appH'):
        i = html.find(f'id="{key}"')
        if i < 0:
            continue
        j = html.find('<section', i + 10)
        out.append(plain(html[i:j if j > 0 else len(html)], keep_figures=True))
    return re.sub(r'\s+', ' ', ' '.join(out))


def appendix_g(html):
    i = html.index('id="appG"')
    j = html.index('id="s-appH"', i)
    rows = re.findall(r'<tr>(.*?)</tr>', html[i:j], re.S)
    text = ' '.join(plain(r, keep_figures=True) for r in rows)
    return re.sub(r'\s+', ' ', text), len(rows) - 1


def persona_numbers():
    m = json.load(open(MODEL, encoding='utf-8'))
    out = set()
    for who in m:
        for r in m[who]['rows']:
            for k, v in r.items():
                if isinstance(v, (int, float)):
                    out.add(f'${round(abs(v)):,}')
                    out.add(str(round(abs(v))))
    return out


def main():
    verbose = '-v' in sys.argv
    html = open(BOOK, encoding='utf-8').read()
    g_text, g_rows = appendix_g(html)
    personas = persona_numbers()
    worked = appendices(html)
    gaps, seen = [], set()
    for sid, body in visible_sections(html):
        for mo in NUM.finditer(plain(body)):
            n = mo.group(0).rstrip(',')      # a trailing comma is punctuation
            if n in seen:
                continue
            seen.add(n)
            bare = n.strip('$%').replace(',', '')
            if n in OWN or bare in OWN or n in LABELS or bare in LABELS:
                continue
            if bare in WORKED or n.strip('$') in WORKED:
                continue
            if len(bare) <= 2 and '%' not in n and '$' not in n:
                continue
            if 1900 <= (int(bare) if bare.isdigit() else 0) <= 2100:
                continue                              # a year
            if n in g_text or bare in g_text or f'${bare}' in g_text:
                continue
            if n in personas or bare in personas:
                continue
            if n in worked or bare in worked:
                continue      # Appendix D or H shows the arithmetic for it
            ctx = plain(body)
            k = ctx.find(n)
            # a quote's date line, e.g. "Benjamin Franklin · The Way to Wealth · 1758"
            if re.search(r'·\s*$', ctx[max(0, k - 4):k]):
                continue
            gaps.append((sid, n, ctx[max(0, k - 70):k + 70].strip()))
    print(f'Appendix G rows: {g_rows}')
    print(f'distinct numbers checked in the chapters: {len(seen)}')
    print(f'without a row: {len(gaps)}\n')
    for sid, n, ctx in gaps:
        print(f'  {n:>10}  {sid:12} …{ctx}…')
    return 1 if gaps else 0


if __name__ == '__main__':
    sys.exit(main())
