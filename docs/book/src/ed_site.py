"""D7 - one short address for the sources, so a dead link is not a dead end.

D6 put befreeacademy.site/engines and its QR under each of the five course
boxes as well. The author has since asked for the boxes to end on the course
itself, so that line is gone from them and the sources appendix keeps its own:
befreeacademy.site/sources. Those two pages are generated from
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
        sys.exit(f'[site] expected 5 course boxes, found {len(boxes)}')   # still checked
    # The course boxes carried befreeacademy.site/engines and its QR under every
    # course. They do not any more: the author wants the box to end on the
    # course. The page is still generated into site-pages/ and Appendix G still
    # prints its own address below.

    # Appendix G's own line, under its opening paragraph
    i = html.index('id="appG"')
    j = html.index('</p>', html.index('<p', i)) + 4
    html = (html[:j] + '<p class="short">' + svg('sources') +
            '<span>Every row on this page, with its link, is also at '
            '<b>befreeacademy.site/sources</b>.</span></p>' + html[j:])
    print('site: Appendix G carries the short address and its QR; the course boxes do not')
    return html
