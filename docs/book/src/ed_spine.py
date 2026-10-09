"""Section B: one spine, so a reader always knows which phase they are in.

The book carried seven numbered frameworks. Appendix A's eight phases are the
only one with a gate condition on each step, so everything else is subordinated
to it: a map page near the front, a phase tag on every DO THIS NOW box, tags
under the Chapter 16 staircase, and the five freedoms tied to phases 7 and 8.

The chapter-to-phase mapping below was checked against Appendix A's own
checklists, not assumed. Phase 5's actions (give the engine 90 days, raise the
price on evidence, route every new dollar) sit inside Chapters 12 and 13, which
is why those two carry two tags.
"""
import re

from build import once

FOREST, GOLD, GOLD_INK = '#1C4C2A', '#EDA335', '#B7770A'
INK, INK2, HAIR, PANEL = '#2E2910', '#46412A', '#D5DFD6', '#E6F1E8'

PHASES = [
    (1, 'Stabilize', 'one full pay period with no overdraft and no late fee', 'Front · 1–4 · 6'),
    (2, 'Map', 'the gap positive for a full month, one transfer cleared', '5 · 7 · 9'),
    (3, 'Protect', 'Rung 1 funded, nothing on a card for 30 days', '8 · 14 · 15'),
    (4, 'Build', 'it runs without you thinking about it', '10–13 · 17'),
    (5, 'Scale', 'one engine has paid in three separate months', '12 · 13'),
    (6, 'Invest', 'one automatic investment cleared, the fund chosen', '20'),
    (7, 'Walk', 'savings cover one full year of your costs', '16 · 19'),
    (8, 'Cross', 'the portfolio earns more than you put in', '21'),
]

# which phase each chapter's DO THIS NOW box belongs to
TAGS = {
    'ch01': '1 · Stabilize', 'ch02': '1 · Stabilize', 'ch03': '1 · Stabilize',
    'ch04': '1 · Stabilize', 'ch06': '1 · Stabilize',
    'ch05': '2 · Map', 'ch07': '2 · Map', 'ch09': '2 · Map',
    'ch08': '3 · Protect', 'ch14': '3 · Protect', 'ch15': '3 · Protect',
    'ch10': '4 · Build', 'ch11': '4 · Build', 'ch17': '4 · Build',
    'ch12': '4 · Build, into 5 · Scale', 'ch13': '4 · Build, into 5 · Scale',
    'ch20': '6 · Invest',
    'ch16': '7 · Walk', 'ch19': '7 · Walk',
    'ch21': '8 · Cross',
    'ch18': 'Phases 1 to 4',
}

# the chapters that run the system, marked Core in the contents and on the doors
CORE = {'ch03', 'ch05', 'ch06', 'ch08', 'ch14'}


def map_figure():
    """The whole road on one page: parts above, phases on the line, gates below."""
    W = 331
    x0, x1, line_y = 31, 300, 58
    n = len(PHASES)
    step = (x1 - x0) / (n - 1)
    X = lambda i: x0 + step * i
    b = [f'<path d="M{x0} {line_y} H{x1}" stroke="{FOREST}" stroke-width="1.4"/>']

    # the five parts, above, each spanning the phases its chapters live in
    parts = [('I · See the trap', 0, 0), ('II · Defense', 1, 2), ('III · Offense', 3, 4),
             ('IV · Break free', 2, 5), ('V · Wide gap', 6, 7)]
    for k, (label, a, c) in enumerate(parts):
        y = 16 + (k % 2) * 13
        xa, xc = X(a) - 7, X(c) + 7
        b.append(f'<path d="M{xa:.1f} {y + 3} H{xc:.1f}" stroke="{GOLD}" stroke-width="2.4" '
                 f'opacity=".55" stroke-linecap="round"/>')
        mid = min(max((xa + xc) / 2, 34), W - 34)
        b.append(f'<text x="{mid:.1f}" y="{y}" text-anchor="middle" '
                 f'style="font-family:Poppins;font-weight:600;font-size:6.6px;letter-spacing:.7px;'
                 f'fill:{GOLD_INK}">{label.upper()}</text>')

    for i, (num, name, gate, chapters) in enumerate(PHASES):
        x = X(i)
        b.append(f'<circle cx="{x:.1f}" cy="{line_y}" r="7.4" fill="{FOREST}"/>')
        b.append(f'<text x="{x:.1f}" y="{line_y + 3:.1f}" text-anchor="middle" '
                 f'style="font-family:Fraunces;font-weight:900;font-size:8.4px;fill:#F9FDF9">'
                 f'{num}</text>')
        b.append(f'<text x="{x:.1f}" y="{line_y + 19:.1f}" text-anchor="middle" '
                 f'style="font-family:Poppins;font-weight:600;font-size:7px;letter-spacing:.5px;'
                 f'fill:{FOREST}">{name.upper()}</text>')

    # the gates, as a list under the road, because they do not fit on it
    top = line_y + 30
    b.append(f'<path d="M0 {top - 8} H{W}" stroke="{HAIR}" stroke-width="1"/>')
    b.append(f'<text x="0" y="{top + 2}" style="font-family:Poppins;font-weight:600;font-size:6.8px;'
             f'letter-spacing:1.1px;fill:{GOLD_INK}">A PHASE CLEARS WHEN</text>')
    b.append(f'<text x="{W}" y="{top + 2}" text-anchor="end" style="font-family:Poppins;'
             f'font-weight:600;font-size:6.8px;letter-spacing:1.1px;fill:{GOLD_INK}">CHAPTERS</text>')
    for i, (num, name, gate, chapters) in enumerate(PHASES):
        y = top + 16 + i * 11.4
        b.append(f'<text x="0" y="{y:.1f}" style="font-family:\'IBM Plex Mono\';font-weight:600;'
                 f'font-size:7.4px;fill:{FOREST}">{num}</text>')
        b.append(f'<text x="11" y="{y:.1f}" style="font-family:Poppins;font-weight:600;'
                 f'font-size:7.2px;fill:{FOREST}">{name}</text>')
        b.append(f'<text x="58" y="{y:.1f}" style="font-family:Lora;font-size:8px;fill:{INK}">'
                 f'{gate}</text>')
        b.append(f'<text x="{W}" y="{y:.1f}" text-anchor="end" style="font-family:'
                 f'\'IBM Plex Mono\';font-size:7px;fill:{INK2}">{chapters}</text>')
    h = top + 16 + len(PHASES) * 11.4 + 4
    alt = ('The whole plan on one line: eight phases, Stabilize, Map, Protect, Build, Scale, '
           'Invest, Walk and Cross, with the chapters that belong to each and the condition '
           'that clears it.')
    svg = (f'<svg width="{W}" height="{h:.0f}" viewBox="0 0 {W} {h:.0f}" '
           f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{alt}">{"".join(b)}</svg>')
    return (f'<figure class="hero">{svg}<figcaption>Eight phases. One of them is yours right '
            f'now.</figcaption><p class="srcline">The full checklist for every phase is '
            f'<a href="#appA">Appendix A</a>. Nothing in this book asks you to do the work of a '
            f'phase you have not reached.</p></figure>')


PAGE = (
    '<h2 id="phases">Which phase are you in?</h2>'

    '<p>This book has one spine, and it is the eight phases below. Every chapter belongs to one '
    'of them, every action at the end of a chapter is tagged with the one it serves, and each '
    'phase has a condition that tells you when it is finished. Not a date. A condition.</p>'

    + '<<<MAP>>>' +

    '<p>You do not start at phase one because the book starts there. You start at the first phase '
    'whose condition you cannot yet tick. Most readers who arrive with an overdraft start at one; '
    'a reader with a steady gap and no buffer starts at three. Read the list, find the lowest one '
    'that is not true of you yet, and begin at its chapters.</p>'

    '<div class="box forest"><p class="lab">Principle</p>'
    '<p class="big">A phase ends when a condition is met,<br>not when a week is over.</p></div>')


def apply(html):
    # ------------------------------------------------------------ B1 map page
    # straight after How to Use This Book, before the ten questions, so the
    # reader meets the road before being asked where they are on it
    page = PAGE.replace('<<<MAP>>>', map_figure())
    i = html.rindex('<section', 0, html.index('<h1 id="starthere"'))
    html = html[:i] + f'<section id="s-phases" class="dense">{page}</section>' + html[i:]

    # ------------------------------------------------------------ B1 phase tags
    # Walk the action boxes in document order and ask which chapter section
    # each one sits in, rather than searching forward from a chapter id: a
    # chapter without a box would otherwise steal the next chapter's.
    starts = [(m.start(), m.group(1)) for m in re.finditer(r'id="(ch\d\d)"', html)]
    # the appendices have action boxes of their own and belong to no chapter
    end_of_chapters = html.index('id="appA"') if 'id="appA"' in html else len(html)
    LAB = '<p class="lab">Do this now</p>'
    out, cursor, tagged = [], 0, 0
    for m in re.finditer(re.escape(LAB), html):
        owner = None if m.start() > end_of_chapters else ''
        if owner == '':
            for pos, sid in starts:
                if pos < m.start():
                    owner = sid
                else:
                    break
        tag = TAGS.get(owner)
        out.append(html[cursor:m.start()])
        if tag:
            out.append(f'<p class="lab">Do this now <span class="phase">Phase {tag}</span></p>')
            tagged += 1
        else:
            out.append(LAB)
        cursor = m.end()
    out.append(html[cursor:])
    html = ''.join(out)
    print(f'phase tags: {tagged} of the 21 chapters')

    # ------------------------------------------------------------ B3 core mark
    # The five chapters that run the system, marked where a reader chooses:
    # the contents, and the six doors.
    for sid in sorted(CORE):
        pat = f'<a href="#{sid}">'
        i = html.find(pat)
        if i < 0:
            continue
        j = html.find('<span class="n">', i)
        k = html.index('</a>', i)
        if j < 0 or j > k:
            j = k
        if 'core-dot' not in html[i:k]:
            html = html[:j] + '<span class="core-dot" aria-label="Core chapter"></span>' + html[j:]

    # the dot needs a key, or it is decoration
    html = once(html, '<a href="#h48">Read This First',
                '<p class="corekey"><span class="core-dot"></span> The five chapters that run the '
                'system. If you read nothing else, read these.</p><a href="#h48">Read This First',
                'B3 core key')

    # ------------------------------------------------------------ A24
    # the two front-matter pages a reader is sent to, and the phase map, were
    # missing from the contents
    html = once(html, '<a href="#h48">Read This First',
                '<a href="#howto">How to Use This Book<span class="n">6</span></a>'
                '<a href="#phases">Which Phase Are You In?<span class="n">9</span></a>'
                '<a href="#starthere">Find Your Own Starting Line<span class="n">10</span></a>'
                '<a href="#h48">Read This First', 'A24 contents entries')
    return html
