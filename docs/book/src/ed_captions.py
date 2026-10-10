"""G8 - one Illustrative tag per chart, in the corner, and no sentence that
says it twice.

Twelve charts carried the word inside their source line, in six different
grammatical shapes, and two of them also had it drawn into the artwork. The
word is a status, not prose: it becomes a fixed tag in the figure's top right
corner, and each source line keeps only what it says beyond the status.
"""
import re, sys

# Each figure that carried the word, and what its source line says once the
# status has moved to the tag. Nothing is reworded beyond the status itself.
LINES = [
 ('Illustrative. Both lines climb together, so the space between them never grows.',
  'Both lines climb together, so the space between them never grows.'),
 ('Illustrative. Every figure in these two files comes from one model, and the model is shown in full in Appendix D.',
  'Every figure in these two files comes from one model, and the model is shown in full in Appendix D.'),
 ('Illustrative proportions, typical of a U.S. renter household. Your own shares come off Insights in Gap, not off this drawing.',
  'Proportions typical of a U.S. renter household. Your own shares come off Insights in Gap, not off this drawing.'),
 ('Illustrative, built from the model in Appendix D. Marcus: $42,003 gross, $33,231 net.',
  'Built from the model in Appendix D. Marcus: $42,003 gross, $33,231 net.'),
 ('Illustrative. Appendix C carries a blank version you can fill in by hand.',
  'Appendix C carries a blank version you can fill in by hand.'),
 ('Illustrative ranking, in the shape the Where it goes screen produces from your own entries.',
  'In the shape the Where it goes screen produces from your own entries.'),
 ('Illustrative. Yours comes off your own twelve-month scan, not off this drawing.',
  'Yours comes off your own twelve-month scan, not off this drawing.'),
 ('Illustrative. 2026 employee deferral limit:',
  '2026 employee deferral limit:'),
 ('Illustrative. Your own reserve percentage depends on your bracket,',
  'Your own reserve percentage depends on your bracket,'),
 ('Illustrative. Federal out-of-pocket maximums are set annually;',
  'Federal out-of-pocket maximums are set annually;'),
 ('<a href="#appD">Appendix D</a>. Illustrative, and the shape holds at any income.',
  '<a href="#appD">Appendix D</a>. The shape holds at any income.'),
 ('Illustrative, from the model in Appendix D, rounded to whole dollars.',
  'From the model in Appendix D, rounded to whole dollars.'),
]

# drawn into two charts, and said again in the source line underneath
DRAWN = '<text x="0" y="116" class="t">All figures ILLUSTRATIVE, from one reconciled model.</text>'
DRAWN2 = '<text x="0" y="132" class="t">All figures ILLUSTRATIVE, from one reconciled model.</text>'

TAG = '<span class="ilx">Illustrative</span>'
FIG = re.compile(r'(<figure\b[^>]*>)(.*?)(</figure>)', re.S)


def apply(html):
    for old, new in LINES:
        n = html.count(old)
        if n != 1:
            sys.exit(f'[captions] expected 1 match, found {n}: {old[:70]!r}')
        html = html.replace(old, new)
    for drawn in (DRAWN, DRAWN2):
        if html.count(drawn) != 1:
            sys.exit(f'[captions] drawn note not found once: {drawn[:60]!r}')
        html = html.replace(drawn, '')
    # the tag goes on every figure that carried the word, and only those
    tagged = [0]
    news = [new for _, new in LINES]

    def pick(m):
        body = m.group(2)
        src = re.search(r'<p class="srcline">(.*?)</p>', body, re.S)
        if not src or 'ilx' in body:
            return m.group(0)
        if not any(n in src.group(1) for n in news):
            return m.group(0)
        tagged[0] += 1
        return m.group(1) + TAG + body + m.group(3)

    html = FIG.sub(pick, html)
    if tagged[0] != len(LINES):
        sys.exit(f'[captions] tagged {tagged[0]} figures, expected {len(LINES)}')
    print('captions:', tagged[0], 'figures carry the Illustrative tag')
    return html
