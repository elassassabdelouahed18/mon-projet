"""G4 - a book you can click.

Before this, five YouTube URLs were the only links in 196 pages: every
"Chapter 7", every "Appendix D" and every organisation the book sends you to
was dead text. This walks the body text, skipping anything already inside a
link, inside an SVG, inside a style block or inside the contents, and turns
each cross-reference into an internal link and each named service into an
external one.

Every external address below was requested through this machine on
10 October 2026 and the result is recorded in FIXLOG.md. Two hosts answer a
datacentre address with 403 rather than content; they are live, and the link
is correct for a reader's own browser.
"""
import re, sys

WORD = {'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5, 'Six': 6, 'Seven': 7,
        'Eight': 8, 'Nine': 9, 'Ten': 10, 'Eleven': 11, 'Twelve': 12, 'Thirteen': 13,
        'Fourteen': 14, 'Fifteen': 15, 'Sixteen': 16, 'Seventeen': 17, 'Eighteen': 18,
        'Nineteen': 19, 'Twenty': 20}

EXT = [
 ('app.befreeacademy.site', 'https://app.befreeacademy.site'),
 ('support@befreeacademy.site', 'mailto:support@befreeacademy.site'),
 ('AnnualCreditReport.com', 'https://www.annualcreditreport.com'),
 ('annualcreditreport.com', 'https://www.annualcreditreport.com'),
 ('irs.gov/freefile', 'https://www.irs.gov/freefile'),
 ('irs.gov/vita', 'https://www.irs.gov/vita'),
 ('irs.gov', 'https://www.irs.gov'),
 ('bogleheads.org', 'https://www.bogleheads.org'),
 ('FDIC.gov', 'https://www.fdic.gov'),
 ('NAPFA.org', 'https://www.napfa.org'),
 ('healthcare.gov', 'https://www.healthcare.gov'),
 ('investor.gov', 'https://www.investor.gov'),
 ('napfa.org', 'https://www.napfa.org'),
 ('nfcc.org', 'https://www.nfcc.org'),
 ('BenefitFinder.gov', 'https://www.usa.gov/benefit-finder'),
 ('USA.gov benefit finder', 'https://www.usa.gov/benefit-finder'),
 ('FDIC BankFind', 'https://banks.data.fdic.gov/bankfind-suite/bankfind'),
 ('befreeacademy.site/engines', 'https://befreeacademy.site/engines'),
 ('befreeacademy.site/sources', 'https://befreeacademy.site/sources'),
 ('befreeacademy.site', 'https://befreeacademy.site'),
 ('BankFind', 'https://banks.data.fdic.gov/bankfind-suite/bankfind'),
]

XREF = re.compile(
 r'(?<![\w>])(Chapter\s+(?:' + '|'.join(WORD) + r'|\d{1,2})|Ch\s*\d{1,2}|Appendix\s+[A-H])(?![\w])')

SKIP_OPEN = re.compile(r'<(a|svg|style|script)\b', re.I)
TAG = re.compile(r'<[^>]+>')


def _targets(m):
    s = m.group(1)
    if s.startswith('Appendix'):
        return '#app' + s[-1]
    n = s.split()[-1] if ' ' in s else s[2:]
    n = WORD.get(n, None) if not n.strip().isdigit() else int(n)
    if n is None or not 1 <= n <= 21:
        return None
    return f'#ch{n:02d}'


def apply(html):
    # the contents already links every line; leave that section alone
    toc_a = html.find('<nav class="toc"')
    if toc_a < 0:
        toc_a = html.find('class="toc"')
    toc_b = html.find('</nav>', toc_a) if toc_a >= 0 else -1
    out, i, depth_skip, n_x, n_e = [], 0, None, 0, 0
    for m in TAG.finditer(html):
        text = html[i:m.start()]
        i = m.end()
        tag = m.group(0)
        inside_toc = 0 <= toc_a <= m.start() <= toc_b
        if depth_skip is None and text and not inside_toc:
            def one(mm):
                nonlocal n_x
                t = _targets(mm)
                if not t:
                    return mm.group(0)
                n_x += 1
                return f'<a href="{t}">{mm.group(1)}</a>'
            new = XREF.sub(one, text)
            for needle, url in EXT:
                if needle in new:
                    attr = '' if url.startswith('mailto:') else ' rel="noopener"'
                    new, k = re.subn(r'(?<![\w/@.:>-])' + re.escape(needle) + r'(?![\w@/-])(?!\.\w)',
                                     f'<a href="{url}"{attr}>{needle}</a>', new)
                    n_e += k
            out.append(new)
        else:
            out.append(text)
        out.append(tag)
        low = tag.lower()
        if depth_skip is None and SKIP_OPEN.match(low) and not low.endswith('/>'):
            depth_skip = re.match(r'<(\w+)', low).group(1)
        elif depth_skip and low.startswith('</' + depth_skip):
            depth_skip = None
    out.append(html[i:])
    html = ''.join(out)
    if n_x < 60 or n_e < 12:
        sys.exit(f'[links] only {n_x} cross-references and {n_e} external links')
    print(f'links: {n_x} cross-references, {n_e} external addresses')
    return html
