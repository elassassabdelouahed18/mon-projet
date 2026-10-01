#!/usr/bin/env python3
"""Build the revised third edition of The Anti-Paycheck Trap.

original.html is the third-edition source as supplied, untouched. Every change
in this revision is a named, checked step below, applied in order to a copy:
book.html. Each replacement must match exactly once, so a change that no
longer fits the source fails loudly instead of silently doing nothing.

    python3 build.py            # book.html + The-Anti-Paycheck-Trap.pdf
"""
import os, re, sys, importlib

HERE = os.path.dirname(os.path.abspath(__file__))


def once(html, old, new, label):
    n = html.count(old)
    if n != 1:
        sys.exit(f'[{label}] expected 1 match, found {n}: {old[:90]!r}')
    return html.replace(old, new)


def jpeg(src, out, quality):
    """The cover ships as a JPEG: the PNG was most of the file's weight."""
    a, b = os.path.join(HERE, src), os.path.join(HERE, out)
    if not os.path.exists(b) or os.path.getmtime(b) < os.path.getmtime(a):
        from PIL import Image
        Image.open(a).convert('RGB').save(b, 'JPEG', quality=quality, optimize=True)


def main():
    jpeg('cover3e.png', 'cover3e.jpg', 90)
    html = open(os.path.join(HERE, 'original.html'), encoding='utf-8').read()
    html = once(html, '<link rel="stylesheet" href="sys.css">',
                '<link rel="stylesheet" href="sys.css"><link rel="stylesheet" href="sys2.css">', 'stylesheet')
    sys.path.insert(0, HERE)
    for mod in ('ed_front', 'ed_mid', 'ed_end', 'ed_figures', 'ed_recaps', 'ed_widen', 'ed_tables'):
        if os.path.exists(os.path.join(HERE, mod + '.py')):
            html = importlib.import_module(mod).apply(html)
    open(os.path.join(HERE, 'book.html'), 'w', encoding='utf-8').write(html)
    if '--html' in sys.argv:
        return
    import weasyprint
    path = os.path.join(HERE, 'book.html')
    doc = weasyprint.HTML(path, base_url=HERE).render()
    # The contents page numbers in the source were typed by hand. Read where
    # each target actually landed and render again with the real numbers.
    landed = {}
    for i, page in enumerate(doc.pages, 1):
        for anchor in page.anchors:
            landed.setdefault(anchor, i)
    toc = re.compile(r'(<a href="#([\w-]+)">(?:(?!</a>).)*?<span class="n">)(\d+)(</span></a>)', re.S)
    fixed = toc.sub(lambda m: m.group(1) + str(landed.get(m.group(2), m.group(3))) + m.group(4), html)
    missing = [m.group(2) for m in toc.finditer(html) if m.group(2) not in landed]
    if missing:
        sys.exit(f'[contents] no target for {missing}')
    if fixed != html:
        open(path, 'w', encoding='utf-8').write(fixed)
        doc = weasyprint.HTML(path, base_url=HERE).render()
    print('pages', len(doc.pages), '· contents entries', len(toc.findall(html)))
    doc.write_pdf(os.path.join(HERE, 'The-Anti-Paycheck-Trap.pdf'))


if __name__ == '__main__':
    main()
