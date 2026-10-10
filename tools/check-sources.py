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

# Amounts used as examples rather than as claims about the world. Each one is
# listed with the sentence it stands in, so the exemption can be audited.
ILLUSTRATIVE = {
    '200,000': 'people pulling in $100,000, $200,000, even more',
    '80,000': 'easier to break the cycle at $80,000 than at $30,000',
    '30,000': 'easier to break the cycle at $80,000 than at $30,000',
    '9.99': 'the $9.99s and $14.99s that felt trivial signing up',
    '14.99': 'the $9.99s and $14.99s that felt trivial signing up',
    '4,000': "Maya's first raise, three years ago, was small, just $4,000 a year",
    '1,500': '$500 to $1,500 is typical for a starter buffer',
    '50,000': 'capturing a 3% match on $50,000 is $1,500',
}
# Figures the book works out in front of the reader, from numbers that are
# themselves sourced. The page that shows the arithmetic is named.
DERIVED = {
    '40,573': "Chapter 9: $42,003 gross less Marcus's health premium",
    '323': 'Chapter 9: how far his AGI sits above the Saver&rsquo;s Credit limit',
    '1,170': 'Chapter 9: half of the $3,510 overtime check',
    '115': "Chapter 8: one month's interest on the card the cushion delays",
    '9.6%': 'Chapter 13: month 24 gap divided by month 24 income, Appendix D',
    '9.3%': 'Chapter 13: the same, for Maya',
    '345': "Chapter 14's own payoff table, from the simulator in Gap",
    '511': "Chapter 14's own payoff table",
    '229': "Chapter 14's own payoff table",
    '1,262': "Chapter 14's own payoff table",
    '7,115': "Chapter 14: Gap's payoff simulator on the sample file, minimums alone",
    '4,032': 'Chapter 14: the same simulator, with $300 a month added',
    '1,083': "Chapter 14's worked simulator run",
    '657': "Chapter 14's worked simulator run",
    '533': "Chapter 14's worked simulator run",
    '617': 'Chapter 16: month 24 of Appendix D',
    '320': 'Chapter 16: the card balance at month 24 of Appendix D',
    '849,000': 'Appendix H: 25 times annual spending',
    '34,000': 'Appendix H: one year of costs',
    '424,000': 'Appendix H: half the freedom number',
    '29,000': "Chapter 20: the difference between the two fee lines on the same chart",
}


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
    kinds = {'illustrative': 0, 'derived': 0}
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
            if bare in ILLUSTRATIVE or n.strip('$') in ILLUSTRATIVE:
                kinds['illustrative'] += 1
                continue
            if bare in DERIVED or n in DERIVED or n.strip('$') in DERIVED:
                kinds['derived'] += 1
                continue
            ctx = plain(body)
            k = ctx.find(n)
            # a quote's date line, e.g. "Benjamin Franklin · The Way to Wealth · 1758"
            if re.search(r'·\s*$', ctx[max(0, k - 4):k]):
                continue
            gaps.append((sid, n, ctx[max(0, k - 70):k + 70].strip()))
    print(f'Appendix G rows: {g_rows}')
    print(f'distinct numbers checked in the chapters: {len(seen)}')
    print(f'examples rather than claims: {kinds["illustrative"]} (listed in ILLUSTRATIVE)')
    print(f"the book's own arithmetic: {kinds['derived']} (listed in DERIVED)")
    print(f'without a row: {len(gaps)}\n')
    for sid, n, ctx in gaps:
        print(f'  {n:>10}  {sid:12} …{ctx}…')
    return 1 if gaps else 0


if __name__ == '__main__':
    sys.exit(main())
