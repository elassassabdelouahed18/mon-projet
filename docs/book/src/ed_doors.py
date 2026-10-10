"""A25 - the six doors say which page.

The chart listed "Ch 6" and "Ch 14" and the box underneath said "turn to that
page now", which is a page the reader did not have. Each door now carries the
page its chapter actually starts on. The number is a {{p:ch06}} token, which
build.py resolves after the first render pass against where the target landed,
so it cannot drift when the book repaginates.
"""
import sys

# the label in the chart, and the chapter whose page it should name
DOORS = [
    ('When the Math Doesn’t Close, then Ch 12', 'ch12'),
    ('Ch 3, then Ch 7', 'ch07'),
    ('Ch 6, the Paycheck Calendar', 'ch06'),
    ('Ch 14', 'ch14'),
    ('Ch 8', 'ch08'),
    ('Ch 7, then Ch 5', 'ch05'),
]

BOX = ('<p>Pick one letter. Turn to that page now, do its one action, and then come back to the '
       'Introduction and read straight through.</p>')
BOX_NEW = ('<p>Pick one letter, turn to the page beside it, do its one action, and then come back '
           'to the Introduction and read straight through.</p>')


def apply(html):
    n = 0
    for label, target in DOORS:
        old = f'>{label}</text>'
        if html.count(old) != 1:
            sys.exit(f'[doors] expected one {label!r} in the chart, found {html.count(old)}')
        html = html.replace(old, f'>{label} &middot; p{{{{p:{target}}}}}</text>')
        n += 1
    if html.count(BOX) != 1:
        sys.exit('[doors] the "Do this now" box under the chart has changed')
    html = html.replace(BOX, BOX_NEW)
    print('doors:', n, 'now name the page they open')
    return html
