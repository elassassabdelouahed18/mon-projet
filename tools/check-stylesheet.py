#!/usr/bin/env python3
"""Check the book, the guide, the install sheet and both apps against STYLESHEET.md.

Acceptance test K5: the shared rules J1-J8 appear verbatim where they belong and
the wordings they replaced appear nowhere. Run it before every release:

    python3 tools/check-stylesheet.py

Exit status is 1 if any rule fails, so it can gate a build.
"""
import html as H
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PRODUCTS = {
    'book':    'docs/book/src/book.html',
    'guide':   'docs/start-here/book.html',
    'install': 'docs/install-guide/guide.html',
    'gap':     'befree-apps/gap/index.html',
    'streak':  'befree-apps/streak/index.html',
}


def visible(path):
    """What a reader sees: entities decoded, tags and scripts stripped."""
    s = open(os.path.join(ROOT, path), encoding='utf-8', errors='replace').read()
    s = re.sub(r'<(script|style)\b.*?</\1>', ' ', s, flags=re.S)
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', s)))


def source(path):
    """Everything, including the script bundles, for strings the app builds."""
    s = open(os.path.join(ROOT, path), encoding='utf-8', errors='replace').read()
    return re.sub(r'\s+', ' ', H.unescape(s))


# (rule, where, needle, how many times it must appear)
#   count None means "at least once"
REQUIRED = [
    ('J1', 'book',   "The small version keeps your run. It does not complete the day’s record.", 2),
    ('J1', 'guide',  "The small version keeps your run. It does not complete the day’s record.", 1),
    ('J1', 'streak', "The small version keeps your run. It does not complete the day's record.", 1),
    ('J2', 'book',   "Essentials as a share of take-home", None),
    ('J2', 'guide',  "Past 60%, earning beats cutting. Past 85%, move a big cost or raise income.", 1),
    ('J2', 'gap',    "Past 60%, earning beats cutting.", None),
    ('J2', 'gap',    "Past 85%, move a big cost or raise income.", None),
    ('J3', 'guide',  "ten-minute Sunday review", None),
    ('J3', 'guide',  "First of the month · 15 min", 1),
    ('J3', 'streak', "Weekly money review", None),
    ('J7', 'guide',  "Streak keeps the logging alive.", 1),
    ('J7', 'book',   "Streak keeps the logging alive", None),
    ('J8', 'book',   "For everyone whose paycheck changes from one pay period to the next", 1),
]

# (rule, where, needle) — must appear nowhere
FORBIDDEN = [
    ('J1', 'guide',  'mark a day complete only after checking'),
    ('J2', 'book',   'Fixed costs as a share of take-home'),
    ('J2', 'guide',  'An essential-cost share is context'),
    ('J3', 'guide',  'First of the month · 5 min'),
    ('J4', 'book',   'reviewed a full month'),
    ('J4', 'book',   'months you have reviewed'),
    ('J4', 'guide',  'reviewed months'),
    ('J4', 'guide',  'unreviewed'),
    ('J4', 'gap',    'reviewed months'),
    ('J7', 'guide',  'It is optional; a habit tick'),
    ('J7', 'guide',  'Streak supports the habits if you find it useful'),
    ('J7', 'guide',  'One optional habit has a relevant, honest tick'),
    ('J8', 'book',   'paid by the hour, the shift, the tip, or the gig'),
    ('J8', 'book',   'gig drivers and second-shift parents'),
    ('A9', 'book',   'Second Edition'),
    ('A9', 'book',   'one-window'),
]

SPELLING = re.compile(r'\bBe[fF]ree\b')


def main():
    text = {k: visible(v) for k, v in PRODUCTS.items()}
    full = {k: source(v) for k, v in PRODUCTS.items()}
    fails = []
    for rule, where, needle, want in REQUIRED:
        got = text[where].count(needle) or full[where].count(needle)
        ok = got >= 1 if want is None else got == want
        print(f"{'ok  ' if ok else 'FAIL'} {rule} {where:7} present {got}"
              f"{'' if want is None else f' (want {want})'}  {needle[:56]!r}")
        if not ok:
            fails.append((rule, where, needle))
    for rule, where, needle in FORBIDDEN:
        got = full[where].count(needle)
        print(f"{'ok  ' if not got else 'FAIL'} {rule} {where:7} absent  {got}  {needle[:56]!r}")
        if got:
            fails.append((rule, where, needle))
    # J6: the brand is BeFree, one word, capital B and capital F
    for k, s in full.items():
        bad = {m.group(0) for m in SPELLING.finditer(s)} - {'BeFree'}
        print(f"{'ok  ' if not bad else 'FAIL'} J6 {k:7} spelling {sorted(bad) or 'BeFree only'}")
        if bad:
            fails.append(('J6', k, str(sorted(bad))))
    print(f'\n{len(fails)} failures')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
