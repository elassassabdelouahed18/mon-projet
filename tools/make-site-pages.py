#!/usr/bin/env python3
"""D6 and D7 - the two pages the book points at, built from the book itself.

A printed link rots. Each course box and the sources appendix now carry one
short URL that the book never has to change: befreeacademy.site/engines and
befreeacademy.site/sources. These pages are generated from book.html, so they
cannot drift from what the book says, and they are written to site-pages/ for
you to publish. **Nothing here is deployed.**

    python3 tools/make-site-pages.py
"""
import html as H
import io, os, re, datetime

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BOOK = os.path.join(ROOT, 'docs', 'book', 'src', 'book.html')
OUT = os.path.join(ROOT, 'site-pages')
TODAY = datetime.date.today().strftime('%d %B %Y')

CSS = """:root{--paper:#F9FDF9;--ink:#2E2910;--ink2:#46412A;--forest:#1C4C2A;--gold:#603900;
  --hair:#D5DFD6;--panel:#E6F1E8}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.6 Lora,Georgia,serif;-webkit-text-size-adjust:100%}
main{max-width:46rem;margin:0 auto;padding:2.5rem 1rem 5rem}
h1{font-family:Fraunces,Georgia,serif;font-weight:900;font-size:2rem;line-height:1.1;
  color:var(--forest);margin:0 0 .5rem}
.eb{font-family:Poppins,system-ui,sans-serif;font-weight:600;font-size:.74rem;letter-spacing:.16em;
  text-transform:uppercase;color:var(--gold);margin:0 0 .4rem}
p{margin:0 0 1rem}
.lede{font-style:italic;color:var(--ink2);border-left:3px solid #B7770A;padding-left:.9rem;
  margin:0 0 1.6rem}
table{width:100%;border-collapse:collapse;margin:1.2rem 0;font-size:.94rem}
th{font-family:Poppins,system-ui,sans-serif;font-weight:600;font-size:.72rem;letter-spacing:.1em;
  text-transform:uppercase;color:var(--forest);text-align:left;padding:0 .6rem .4rem 0;
  border-bottom:2px solid #B7770A}
td{padding:.55rem .6rem .55rem 0;border-bottom:1px solid var(--hair);vertical-align:top}
a{color:var(--gold)}
.course{background:var(--panel);padding:1.1rem 1.2rem;margin:0 0 1rem;border-top:2px solid #B7770A}
.course h2{font-family:Fraunces,Georgia,serif;font-size:1.15rem;color:var(--forest);margin:0 0 .3rem}
.course .meta{font-size:.88rem;color:var(--ink2);margin:.4rem 0 0}
.foot{font-size:.86rem;color:var(--ink2);border-top:1px solid var(--hair);margin-top:2.5rem;
  padding-top:1rem}
@media(prefers-color-scheme:dark){:root{--paper:#0A2913;--ink:#EAF2EA;--ink2:#BFD3C3;
  --forest:#9ED6AC;--gold:#EDBF6B;--hair:#24452C;--panel:#133F20}}
"""


def page(title, lede, body):
    return (f'<!doctype html>\n<html lang="en-US"><head><meta charset="utf-8">'
            f'<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{title} · BeFree Academy</title>'
            f'<meta name="description" content="{lede}">'
            f'<style>{CSS}</style></head><body><main>'
            f'<p class="eb">BeFree Academy</p><h1>{title}</h1>'
            f'<p class="lede">{lede}</p>{body}'
            f'<p class="foot">Last reviewed {TODAY}. This page is generated from the book itself, '
            f'so it says what the book says.</p>'
            f'</main></body></html>\n')


def plain(s):
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', '', s))).strip()


def courses(html):
    out = []
    for m in re.finditer(r'<div class="box learn"><p class="lab">Start here</p>(.*?)</div>', html, re.S):
        b = m.group(1)
        title = re.search(r'<strong>(.*?)</strong>(.*?)</p>', b, re.S)
        url = re.search(r'<a href="(https://[^"]+)"', b)
        src = re.search(r'<p class="src">(.*?)</p>', b, re.S)
        if not (title and url):
            continue
        out.append({'title': plain(title.group(1)),
                    'by': plain(title.group(2)).lstrip('· ').strip(),
                    'url': url.group(1),
                    'note': plain(src.group(1)) if src else ''})
    return out


def appendix_g(html):
    i = html.index('id="appG"')
    j = html.index('id="s-appH"', i)
    rows = []
    for tr in re.findall(r'<tr>(.*?)</tr>', html[i:j], re.S):
        tds = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, re.S)
        if len(tds) == 3 and 'Fact' not in plain(tds[0]):
            rows.append([plain(t) for t in tds])
    return rows


def qr(url, name):
    import segno
    segno.make(url, error='m').save(os.path.join(OUT, 'qr', name + '.svg'),
                                    kind='svg', scale=1, border=0, dark='#092B14', xmldecl=False)


def main():
    os.makedirs(os.path.join(OUT, 'qr'), exist_ok=True)
    html = io.open(BOOK, encoding='utf-8').read()

    cs = courses(html)
    body = ''.join(
        f'<section class="course"><h2>{H.escape(c["title"])}</h2>'
        f'<p class="eb" style="margin:0">{H.escape(c["by"])}</p>'
        f'<p style="margin:.5rem 0 0"><a href="{c["url"]}">{c["url"]}</a></p>'
        f'<p class="meta">{H.escape(c["note"])}</p></section>' for c in cs)
    io.open(os.path.join(OUT, 'engines.html'), 'w', encoding='utf-8').write(
        page('The five engines, and where to start',
             'One free course per engine, named in Part Three of The Anti-Paycheck Trap. '
             'Checked quarterly. When a course is taken down or goes stale, it is replaced here '
             'and the book still points at the right thing.', body))

    rows = appendix_g(html)
    trs = ''.join(f'<tr><td>{H.escape(a)}</td><td>{H.escape(b)}</td><td>{H.escape(c)}</td></tr>'
                  for a, b, c in rows)
    io.open(os.path.join(OUT, 'sources.html'), 'w', encoding='utf-8').write(
        page('Every number in the book, and where it came from',
             'Appendix G of The Anti-Paycheck Trap, with a line for every external figure the book '
             'prints. If a figure is not on this page, it is not in the book.',
             f'<table><thead><tr><th>Fact</th><th>Value</th><th>Source</th></tr></thead>'
             f'<tbody>{trs}</tbody></table>'))

    qr('https://befreeacademy.site/engines', 'engines')
    qr('https://befreeacademy.site/sources', 'sources')
    print(f'site-pages: engines.html ({len(cs)} courses), sources.html ({len(rows)} rows), 2 QR codes')


if __name__ == '__main__':
    main()
