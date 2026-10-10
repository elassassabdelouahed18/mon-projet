"""D6 and D7 - one short address per box, so a dead link is not a dead end.

Every course box names a YouTube video. Videos are taken down, renamed and
re-uploaded, and a printed book cannot follow them. Each box now also carries
befreeacademy.site/engines and its QR code; the sources appendix carries
befreeacademy.site/sources the same way. Those two pages are generated from
this book by tools/make-site-pages.py and live in site-pages/, ready to
publish. Nothing is deployed from here.
"""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
QR = os.path.join(HERE, '..', '..', '..', 'site-pages', 'qr')


def svg(name):
    s = io.open(os.path.join(QR, name + '.svg'), encoding='utf-8').read().strip()
    s = s.replace('width="100%" height="100%"', 'width="30" height="30"')
    return s.replace('<svg ', '<svg class="qr" aria-hidden="true" ')


def apply(html):
    boxes = re.findall(r'<div class="box learn"><p class="lab">Start here</p>.*?</div>', html, re.S)
    if len(boxes) != 5:
        sys.exit(f'[site] expected 5 course boxes, found {len(boxes)}')
    q = svg('engines')
    for b in boxes:
        tail = ('<p class="short">' + q + '<span>If this course has moved, the current one is at '
                '<b>befreeacademy.site/engines</b>, checked every quarter.</span></p></div>')
        html = html.replace(b, b[:-6] + tail, 1)

    # Appendix G's own line, under its opening paragraph
    i = html.index('id="appG"')
    j = html.index('</p>', html.index('<p', i)) + 4
    html = (html[:j] + '<p class="short">' + svg('sources') +
            '<span>Every row on this page, with its link, is also at '
            '<b>befreeacademy.site/sources</b>.</span></p>' + html[j:])
    print('site: 5 course boxes and Appendix G carry a short address and its QR')
    return html
