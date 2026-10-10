"""G3 - every chart says, in one sentence, what it shows.

The charts already carried an aria-label. WeasyPrint reads a figure's
alternate text from an SVG <title> element, not from aria-label, so each
label is copied into a <title> as the SVG's first child. That is also what a
browser and a screen reader want from inline SVG, so the HTML gets better at
the same time.

The eight small decorative marks have no label; they are given a short one so
the tagged file has no figure without alternate text.
"""
import html as _html
import re, sys

SVG = re.compile(r'<svg\b([^>]*)>')
MARK = 'The BeFree mark'


def apply(doc):
    n, m = [0], [0]

    def one(mo):
        attrs = mo.group(1)
        if '<title>' in doc[mo.end():mo.end() + 40]:
            return mo.group(0)
        lab = re.search(r'aria-label="([^"]*)"', attrs)
        if lab:
            n[0] += 1
            text = lab.group(1)
        elif 'aria-hidden' in attrs:
            m[0] += 1
            text = MARK
        else:
            return mo.group(0)
        return mo.group(0) + '<title>' + text + '</title>'

    out = SVG.sub(one, doc)
    if n[0] < 60:
        sys.exit(f'[alt] only {n[0]} charts carry a title')
    print(f'alt text: {n[0]} charts titled, {m[0]} decorative marks named')
    return out
