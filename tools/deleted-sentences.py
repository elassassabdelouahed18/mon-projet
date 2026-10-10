#!/usr/bin/env python3
"""K11 - every paragraph this revision took a sentence out of.

A copyeditor needs to know where a deletion could have left a broken
transition. This compares the visible text of each product against the copy it
started from and prints, paragraph by paragraph, the sentences that are gone.

    python3 tools/deleted-sentences.py > COPYEDIT.md

The book starts from original.html, which the build never edits. The guide and
the install sheet start from the commit this revision began at, named below.
"""
import html as _html
import io, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BASE_COMMIT = os.environ.get('BASE_COMMIT', '')


def visible(doc):
    doc = re.sub(r'<(script|style)\b.*?</\1>', ' ', doc, flags=re.S)
    doc = re.sub(r'<svg\b.*?</svg>', ' ', doc, flags=re.S)
    doc = re.sub(r'<(p|li|td|th|h1|h2|h3|div|figcaption|dt|dd)\b[^>]*>', '\n<P>', doc)
    doc = re.sub(r'<[^>]+>', ' ', doc)
    doc = _html.unescape(doc)
    out = []
    for block in doc.split('\n'):
        block = re.sub(r'\s+', ' ', block.replace('<P>', '')).strip()
        if len(block) > 25:
            out.append(block)
    return out


def sentences(block):
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z$“"(])', block)
    return [p.strip() for p in parts if len(p.strip()) > 12]


def norm(s):
    return re.sub(r'[^a-z0-9 ]', '', s.lower()).strip()


# G8 moved the word "Illustrative" out of twelve source lines and into a tag
# in the chart's corner. That is a mechanical change, not a cut a copyeditor
# has to read, so it is not listed.
MOVED = {'illustrative', 'illustrative proportions', 'illustrative ranking',
         'all figures illustrative from one reconciled model'}


def compare(name, before, after):
    now = {norm(s) for b in visible(after) for s in sentences(b)}
    rows = []
    for block in visible(before):
        ss = sentences(block)
        gone = [s for s in ss if norm(s) not in now
                and norm(s) not in MOVED and len(s) > 20]
        if gone and len(gone) < len(ss):          # the paragraph survived, a sentence did not
            kept = [s for s in ss if norm(s) in now]
            rows.append((kept, gone))
    print(f'\n## {name}\n')
    if not rows:
        print('No paragraph lost a sentence while keeping the rest.\n')
        return 0
    for kept, gone in rows:
        print('> ' + ' '.join(kept)[:400])
        for g in gone:
            print(f'\n  **cut:** {g}')
        print()
    return len(rows)


def git_show(path):
    if not BASE_COMMIT:
        return None
    try:
        return subprocess.run(['git', '-C', ROOT, 'show', f'{BASE_COMMIT}:{path}'],
                              capture_output=True, text=True, check=True).stdout
    except Exception:
        return None


def main():
    print('# Where a sentence was taken out\n')
    print('Each entry is the paragraph as it reads now, followed by the sentence or '
          'sentences this revision removed from it. A paragraph that was deleted whole, '
          'or added whole, is not listed: nothing can be left dangling in it.\n')
    total = 0
    book_before = io.open(os.path.join(ROOT, 'docs/book/src/original.html'), encoding='utf-8').read()
    book_after = io.open(os.path.join(ROOT, 'docs/book/src/book.html'), encoding='utf-8').read()
    total += compare('The Anti-Paycheck Trap', book_before, book_after)
    for label, path in [('Start Here: The BeFree System', 'docs/start-here/book.html'),
                        ('Install Gap and Streak', 'docs/install-guide/guide.html')]:
        before = git_show(path)
        after = io.open(os.path.join(ROOT, path), encoding='utf-8').read()
        if before is None:
            print(f'\n## {label}\n\nBASE_COMMIT is not set, so there is nothing to compare against.\n')
            continue
        total += compare(label, before, after)
    print(f'\n---\n\n**{total} paragraphs** lost a sentence and kept the rest.\n')


if __name__ == '__main__':
    main()
