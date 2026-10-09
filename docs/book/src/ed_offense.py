"""Chapter 12 and 13: what the offense is worth, and why Marcus chose as he did.

C2  why he overruled the ranking
C4  Engine Zero in numbers
C5  why 40/40/20 and not the default split

The chart's figures come from BLS OEWS May 2025 (Columbus medians), the Atlanta
Fed's Wage Growth Tracker release file, and 26 U.S.C. §127. They are read in
sources/ with the dates. Two sentences from an earlier pass are repaired here
as well: a D2 edit left a duplicate line and a stranded clause.
"""
import json
import os

from build import once

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..', '..', '..')

INK, INK2, HAIR, FOREST = '#2E2910', '#46412A', '#D5DFD6', '#1C4C2A'
# the same lightness ladder the Model four chart uses
C_SMALL, C_MID, C_BIG, C_FLAT = '#F5AE4B', '#953B17', '#003916', '#539C65'

HOURS = 1976
GROSS = 42003


def wages():
    p = os.path.join(ROOT, 'sources', 'bls-oews-columbus-may2025.json')
    rows = {r['soc']: r for r in json.load(open(p, encoding='utf-8'))['rows']}
    return rows['53-1047']['a_median'], rows['53-7062']['a_median']


def switchers():
    p = os.path.join(ROOT, 'sources', 'atlanta-fed-switchers.json')
    return json.load(open(p, encoding='utf-8'))


SUP, MOVER = wages()
WGT = switchers()
SWITCH_GAP = (WGT['latest']['switcher'] - WGT['latest']['stayer']) / 100


MOVES = [
    ('Claim a differential the schedule already pays', 1.25 * HOURS,
     '$1.25 an hour, the book&rsquo;s example', C_SMALL),
    ('Take the certification your employer buys', 5250,
     'the annual exclusion, 26 U.S.C. §127', C_MID),
    ('Change employers', GROSS * SWITCH_GAP,
     f"{WGT['latest']['switcher']}% against {WGT['latest']['stayer']}%, first year", C_FLAT),
    ('Move up one band inside the building', SUP - MOVER,
     'Columbus medians, supervisor against mover', C_BIG),
]


def figure():
    """One row per move: a label, a bar with its value, then the note under it.

    The note sits on its own line at the left margin rather than after the bar,
    because the longest bar reaches the plot edge and left nothing for it.
    """
    W = 331
    x1, top = 196, 20
    label_h, bh, note_h, gap = 11, 15, 10, 13
    row_h = label_h + bh + note_h + gap
    biggest = max(v for _, v, _, _ in MOVES)
    b = []
    for i, (label, value, note, col) in enumerate(sorted(MOVES, key=lambda m: m[1])):
        y = top + i * row_h
        w = max(2.5, x1 * value / biggest)
        b.append(f'<text x="0" y="{y}" style="font-family:Lora;font-size:8.4px;fill:{INK}">'
                 f'{label}</text>')
        b.append(f'<rect x="0" y="{y + 4}" width="{w:.1f}" height="{bh}" rx="2" fill="{col}"/>')
        b.append(f'<text x="{w + 6:.1f}" y="{y + 15:.1f}" style="font-family:\'IBM Plex Mono\';'
                 f'font-weight:600;font-size:9px;fill:{INK}">${value:,.0f}</text>')
        b.append(f'<text x="0" y="{y + bh + 14:.1f}" style="font-family:Lora;font-style:italic;'
                 f'font-size:7.2px;fill:{INK2}">{note}</text>')
    foot = top + len(MOVES) * row_h - gap + 8
    b.append(f'<path d="M0 {foot} H{W}" stroke="{HAIR}" stroke-width="1"/>')
    lines = [
        'A year of extra gross pay, on a 1,976-hour schedule. The last bar is one step, not a',
        'rate: changing employers pays a little more every year, while moving up one band pays',
        'the difference for every year that follows it.',
    ]
    for k, line in enumerate(lines):
        b.append(f'<text x="0" y="{foot + 14 + k * 10.5:.1f}" style="font-family:Lora;'
                 f'font-style:italic;font-size:7.6px;fill:{INK2}">{line}</text>')
    h = foot + 14 + len(lines) * 10.5
    alt = ('Four bars of what each Engine Zero move adds in a year: changing employers about '
           f'${GROSS * SWITCH_GAP:,.0f}, a shift differential ${1.25 * HOURS:,.0f}, the '
           f'certification your employer pays for ${5250:,}, and moving up one band inside the '
           f'building ${SUP - MOVER:,.0f}.')
    svg = (f'<svg width="{W}" height="{h:.0f}" viewBox="0 0 {W} {h:.0f}" '
           f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{alt}">{"".join(b)}</svg>')
    return (f'<figure class="hero">{svg}<figcaption>The cheapest raise is the one you already '
            f'qualify for</figcaption><p class="srcline">Wages: BLS Occupational Employment and '
            f'Wage Statistics, May 2025, Columbus metropolitan area. Wage growth: Federal Reserve '
            f'Bank of Atlanta, Wage Growth Tracker. Tuition assistance: 26 U.S.C. §127.</p></figure>')



# ------------------------------------------------------------------ B5
# Chapters 10 and 13 drew the same $885 mean against the $200 median. The one
# in Chapter 13 is replaced by what that chapter is actually about: where a
# side-income dollar goes before any of it is yours.
SIDE = 200.0
COST_RATE, TAX_RATE = 0.10, 0.25


def side_flow():
    """Marcus's $200: costs, the tax reserve, then the split."""
    cost = SIDE * COST_RATE
    tax = round((SIDE - cost) * TAX_RATE)
    net = SIDE - cost - tax
    shares = [('To the card', 0.40, C_BIG), ('To the buffer and funds', 0.40, C_FLAT),
              ('To you, guilt-free', 0.20, C_SMALL)]
    W = 331
    x0, x1 = 0, 268
    b = []
    # the gross bar, with the two deductions cut out of it
    y = 26
    b.append(f'<text x="0" y="{y - 8}" style="font-family:Poppins;font-weight:600;font-size:7px;'
             f'letter-spacing:1.1px;fill:{INK2}">WHAT THE PDF EARNS</text>')
    b.append(f'<rect x="0" y="{y}" width="{x1}" height="19" rx="2" fill="{C_MID}" opacity=".28"/>')
    seg = [('costs', cost, C_MID), ('tax reserve', tax, '#B7770A')]
    cur = 0.0
    for label, amount, col in seg:
        w = x1 * amount / SIDE
        b.append(f'<rect x="{x1 - (cur + w) * 1:.1f}" y="{y}" width="{w:.1f}" height="19" '
                 f'fill="{col}" opacity=".85"/>')
        cur += w / (x1 / SIDE)
    b.append(f'<text x="6" y="{y + 13:.1f}" style="font-family:\'IBM Plex Mono\';font-weight:600;'
             f'font-size:9px;fill:{INK}">${SIDE:,.0f}</text>')
    b.append(f'<text x="{x1 + 6}" y="{y + 13:.1f}" style="font-family:Lora;font-style:italic;'
             f'font-size:7.4px;fill:{INK2}">gross</text>')
    b.append(f'<text x="0" y="{y + 32:.1f}" style="font-family:Lora;font-size:7.6px;fill:{INK2}">'
             f'less ${cost:,.0f} of costs and ${tax:,.0f} held back for tax, which was never '
             f'his to spend</text>')

    # the net bar
    y2 = y + 60
    netw = x1 * net / SIDE
    b.append(f'<text x="0" y="{y2 - 8}" style="font-family:Poppins;font-weight:600;font-size:7px;'
             f'letter-spacing:1.1px;fill:{INK2}">WHAT IS ACTUALLY HIS</text>')
    b.append(f'<rect x="0" y="{y2}" width="{netw:.1f}" height="19" rx="2" fill="{FOREST}"/>')
    b.append(f'<text x="6" y="{y2 + 13:.1f}" style="font-family:\'IBM Plex Mono\';font-weight:600;'
             f'font-size:9px;fill:#F9FDF9">${net:,.0f}</text>')

    # the split
    y3 = y2 + 44
    b.append(f'<text x="0" y="{y3 - 8}" style="font-family:Poppins;font-weight:600;font-size:7px;'
             f'letter-spacing:1.1px;fill:{INK2}">WHERE IT GOES, DECIDED BEFORE IT ARRIVES</text>')
    cur = 0.0
    for label, share, col in shares:
        w = netw * share
        b.append(f'<rect x="{cur:.1f}" y="{y3}" width="{max(w - 2, 2):.1f}" height="19" rx="2" '
                 f'fill="{col}"/>')
        cur += w
    for i, (label, share, col) in enumerate(shares):
        yy = y3 + 34 + i * 11.6
        b.append(f'<rect x="0" y="{yy - 5.4:.1f}" width="11" height="2.4" rx="1.2" fill="{col}"/>')
        b.append(f'<text x="16" y="{yy:.1f}" style="font-family:Lora;font-size:8.2px;fill:{INK}">'
                 f'{label}</text>')
        b.append(f'<text x="{x1}" y="{yy:.1f}" text-anchor="end" style="font-family:'
                 f'\'IBM Plex Mono\';font-weight:600;font-size:8px;fill:{INK}">'
                 f'${net * share:,.0f}</text>')
        b.append(f'<text x="{x1 + 8}" y="{yy:.1f}" style="font-family:\'IBM Plex Mono\';'
                 f'font-size:7.4px;fill:{INK2}">{share:.0%}</text>')
    h = y3 + 34 + len(shares) * 11.6 + 6
    alt = (f'Marcus\u2019s ${SIDE:,.0f} of side income: ${cost:,.0f} of costs and ${tax:,.0f} '
           f'held for tax come out first, leaving ${net:,.0f}. That is split ${net * .4:,.0f} to '
           f'the card, ${net * .4:,.0f} to the buffer and funds, and ${net * .2:,.0f} to him.')
    svg = (f'<svg width="{W}" height="{h:.0f}" viewBox="0 0 {W} {h:.0f}" '
           f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{alt}">{"".join(b)}</svg>')
    return (f'<figure class="hero">{svg}<figcaption>A side-income dollar has three owners before '
            f'it has one</figcaption><p class="srcline">Marcus\u2019s month 6 onward, from the '
            f'model in <a href="#appD">Appendix D</a>: 10% of costs and a 25% reserve settled '
            f'quarterly. Your own reserve depends on your bracket and your state.</p></figure>')


EDITS = []


def apply(html):
    # ------------------------------------------------------------ repair
    # a D2 edit in the previous pass left "not staying" stranded behind an
    # inserted clause
    html = once(html,
                'come from leaving, which the Atlanta Fed&rsquo;s Wage Growth Tracker has shown '
                'for job switchers against stayers for most of the past decade, not staying.',
                'come from leaving rather than staying. The Atlanta Fed&rsquo;s Wage Growth '
                'Tracker has put job switchers above job stayers in '
                f"{WGT['months_switcher_above_stayer']} of the {WGT['months_total']} months it has "
                'measured since 1997.', 'repair: stranded clause')

    # ------------------------------------------------------------ C2
    html = once(html, 'He routes all of it into the gap, because his lifestyle never learned the '
                      'money existed.',
                'He routes all of it into the gap, because his lifestyle never learned the money '
                'existed. Run the four questions on him and the ranking in this chapter loses: a '
                'second shift leaves him no hours inside a client&rsquo;s working day, which is '
                'what a service engine needs, and a product sells while he is on the floor. His '
                'buyers come from the warehouse forums he was already reading, which is the '
                'audience-before-product rule working in the only order it ever works in. And his '
                '$200 a month is above the median he was warned about, not below it.',
                'C2 why he overruled the ranking')

    # ------------------------------------------------------------ C4
    html = once(html, 'Five moves, cheapest first.', figure() + '<p>Five moves, cheapest first.</p>',
                'C4 engine zero chart')

    # ------------------------------------------------------------ B5
    i = html.index('Offense feeds defense, and the gap compounds')
    a = html.rindex('<figure', 0, i)
    b = html.index('</figure>', i) + len('</figure>')
    html = html[:a] + side_flow() + html[b:]

    # ------------------------------------------------------------ C5
    # Appendix D does not run Marcus on the 50/25/25 default, and the reason is
    # a number the reader can check in his own debt table.
    html = once(html, 'Already have a healthy buffer and no bad debt? 40/0/60 as you cross into '
                      'wealth-building.',
                'Already have a healthy buffer and no bad debt? 40/0/60 as you cross into '
                'wealth-building. Marcus runs nearer 40/40/20 for his first two years for one '
                'reason: Card A charges 26.9%, and paying it down is a guaranteed 26.9% return '
                'that nothing he could do with the money beats until the balance is gone.',
                'C5 why 40/40/20')
    return html
