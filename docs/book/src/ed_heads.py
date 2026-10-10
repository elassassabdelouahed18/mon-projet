"""G11 - the running head reads the chapter title, and the title breaks where
the author broke it.

Every chapter title in the source is set across two lines with a <br>, and
WeasyPrint's string-set content(text) concatenates the two halves with nothing
between them, so the head printed THE TRAP ISN'TYOUR SALARY. A single space
before each break fixes the text content. A space at the end of a line is
hung, not set, so nothing moves on the page; the rendered titles were compared
pixel for pixel before and after.
"""
import re, sys

H1 = re.compile(r'(<h1\b[^>]*>)(.*?)(</h1>)', re.S)
BR = re.compile(r'(?<![ \n])<br\s*/?>')


def apply(html):
    n = [0]

    def one(m):
        inner, k = BR.subn(' <br>', m.group(2))
        n[0] += k
        return m.group(1) + inner + m.group(3)

    out = H1.sub(one, html)
    if n[0] < 20:
        sys.exit(f'[running heads] expected a break in at least 20 titles, found {n[0]}')
    print('running heads:', n[0], 'titles joined with a space')
    return out
