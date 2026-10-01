"""Numeric table columns: right-aligned, set in IBM Plex Mono.

A column is numeric when every non-empty body cell in it is an amount, a rate,
a count or a short "year 5" / "month 9" style value. Its header is tagged too,
so heading and figures line up on the right.
"""
import re

from ed import plain

NUM = re.compile(r'^(?:[−\-+]?\$?[\d][\d,]*(?:\.\d+)?%?(?:\s*(?:/|·|to|–)\s*[−\-+]?\$?[\d][\d,]*(?:\.\d+)?%?)*(?:/mo)?'
                 r'|(?:year|month)\s\d+(?:\s·\s[a-z ]+)?|\d+(?:\.\d+)?\s?(?:months?|years?|yrs?))$')
BLANK = {'none', 'unpaid', '—', '-', 'n/a'}
CELL = re.compile(r'<(td|th)((?:\s[^>]*)?)>(.*?)</\1>', re.S)


def tag(cell_open_attrs):
    if 'class="' in cell_open_attrs:
        return cell_open_attrs.replace('class="', 'class="num ', 1)
    return cell_open_attrs + ' class="num"'


def fix_table(t):
    rows = re.findall(r'<tr>.*?</tr>', t, re.S)
    body = [r for r in rows if '<td' in r]
    if not body:
        return t
    grid = [[(m.group(1), plain(m.group(3))) for m in CELL.finditer(r)] for r in body]
    ncol = max(len(r) for r in grid)
    numeric = []
    for c in range(ncol):
        vals = [r[c][1] for r in grid if c < len(r) and r[c][1] and r[c][1] not in BLANK]
        numeric.append(bool(vals) and all(NUM.match(v) for v in vals))
    if not any(numeric):
        return t

    def fix_row(r):
        k = [-1]

        def one(m):
            k[0] += 1
            if k[0] < ncol and numeric[k[0]] and 'class="num' not in m.group(2):
                return f'<{m.group(1)}{tag(m.group(2))}>{m.group(3)}</{m.group(1)}>'
            return m.group(0)
        return CELL.sub(one, r)
    return re.sub(r'<tr>.*?</tr>', lambda m: fix_row(m.group(0)), t, flags=re.S)


def apply(html):
    return re.sub(r'<table\b.*?</table>', lambda m: fix_table(m.group(0)), html, flags=re.S)
