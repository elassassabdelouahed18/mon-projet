"""Block-level edits on the book HTML.

A block is a <p>, <li>, <h2>, <h3>, <figcaption>, <td> or <th>. It is found by
the start of its visible text (entities decoded, tags stripped, spaces
collapsed), so an edit reads like the sentence it changes. Every lookup must
match exactly one block, or the build stops and says which one.
"""
import html as H
import re
import sys

BLOCK = re.compile(r'<(p|li|h2|h3|figcaption|td|th|dt|dd)\b([^>]*)>(.*?)</\1>', re.S)
LEAD = re.compile(r'^\s*(?:<input[^>]*>\s*)+')


def plain(inner):
    t = re.sub(r'<svg.*?</svg>', '', inner, flags=re.S)
    t = H.unescape(re.sub(r'<[^>]+>', ' ', t))
    return re.sub(r'\s+', ' ', t).strip()


def _find(html, prefix, tag=None):
    hits = [m for m in BLOCK.finditer(html)
            if (tag is None or m.group(1) == tag) and plain(m.group(3)).startswith(prefix)]
    if len(hits) != 1:
        sys.exit(f'[ed] {len(hits)} blocks start with {prefix!r}' + (f' <{tag}>' if tag else ''))
    return hits[0]


def rep(html, prefix, new_inner, tag=None):
    """Replace the inner HTML of the one block that starts with prefix."""
    m = _find(html, prefix, tag)
    lead = LEAD.match(m.group(3))
    if lead and '<input' not in new_inner:
        new_inner = lead.group(0) + new_inner   # keep a leading checkbox or field
    return html[:m.start(3)] + new_inner + html[m.end(3):]


def drop(html, prefix, tag=None):
    m = _find(html, prefix, tag)
    return html[:m.start()] + html[m.end():]


def after(html, prefix, new_html, tag=None):
    m = _find(html, prefix, tag)
    return html[:m.end()] + new_html + html[m.end():]


def before(html, prefix, new_html, tag=None):
    m = _find(html, prefix, tag)
    return html[:m.start()] + new_html + html[m.start():]


def apply_list(html, edits):
    """edits: tuples ('rep'|'drop'|'after'|'before', prefix, [html], [tag])."""
    ops = {'rep': rep, 'drop': drop, 'after': after, 'before': before}
    for e in edits:
        op, args = e[0], list(e[1:])
        tag = None
        if op == 'drop':
            if len(args) == 2:
                tag = args.pop()
            html = drop(html, args[0], tag)
        else:
            if len(args) == 3:
                tag = args.pop()
            html = ops[op](html, args[0], args[1], tag)
    return html
