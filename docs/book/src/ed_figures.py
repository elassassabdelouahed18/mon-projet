"""Revision figures.

Two jobs. First, every figure that carries a persona number is brought into line
with model/financial-model.json. Second, a few new figures say in one picture
what the text takes a page to say. Colours come from the data palette in
sys2.css (validated for colour-blind separation on this paper); the gold is low
contrast, so nothing is ever identified by gold alone.
"""
import json
import os
import re

from build import once
from ed import after

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = json.load(open(os.path.join(HERE, 'model', 'financial-model.json'), encoding='utf-8'))

FOREST, GILT, INK, INK2 = '#1C4C2A', '#B7770A', '#2E2910', '#46412A'
PANEL, HAIR, PAPER = '#E6F1E8', '#D5DFD6', '#F9FDF9'
D_IN, D_FIX, D_VAR, D_INV = '#36894F', '#E3A72A', '#C4462E', '#3A84C4'
CHAMP, SAGE, CREAM = '#F3C57F', '#87A98D', '#FBF6EE'

STYLE = ('<defs><style>'
         '.hl{font-family:Poppins;font-weight:600;font-size:7.4px;letter-spacing:1px;fill:%s}'
         '.hn{font-family:"IBM Plex Mono";font-weight:500;font-size:8.6px;fill:%s}'
         '.hnb{font-family:"IBM Plex Mono";font-weight:600;font-size:10px;fill:%s}'
         '.hs{font-family:Lora;font-size:8.2px;fill:%s}'
         '.ht{font-family:Lora;font-style:italic;font-size:7.8px;fill:%s}'
         '.hax{font-family:"IBM Plex Mono";font-size:6.8px;fill:%s}'
         '</style></defs>') % (FOREST, INK, INK, INK, INK2, INK2)


def svg(w, h, label, body):
    return (f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg" '
            f'role="img" aria-label="{label}">{STYLE}{body}</svg>')


def t(x, y, s, cls='hs', anchor=None, extra=''):
    a = f' text-anchor="{anchor}"' if anchor else ''
    return f'<text x="{x:.1f}" y="{y:.1f}" class="{cls}"{a}{extra}>{s}</text>'


def usd(v):
    v = round(v)
    return ('&#8722;' if v < 0 else '') + '${:,}'.format(abs(v))


def in_figure(html, caption, pairs, label):
    """Replace text inside the one figure whose caption is `caption`."""
    m = [f for f in re.finditer(r'<figure[^>]*>.*?</figure>', html, re.S)
         if f'<figcaption>{caption}</figcaption>' in f.group(0)]
    if len(m) != 1:
        raise SystemExit(f'[{label}] {len(m)} figures captioned {caption!r}')
    f = m[0].group(0)
    for old, new in pairs:
        if old.startswith('re:'):
            f, n = re.subn(old[3:], new, f, count=1)
        else:
            n = f.count(old)
            f = f.replace(old, new, 1)
        if n < 1:
            raise SystemExit(f'[{label}] not found: {old[:80]!r}')
    return html[:m[0].start()] + f + html[m[0].end():]


# --------------------------------------------------------------------------
# part openers: where this part sits on the road
PARTS = [('I', 'See the trap', '1–4'), ('II', 'Defense', '5–9'), ('III', 'Offense', '10–13'),
         ('IV', 'Break free', '14–18'), ('V', 'Wide gap', '19–21')]


def part_map(k):
    xs = [30, 90, 150, 210, 270]
    b = [f'<path d="M30 24 H270" stroke="{SAGE}" stroke-width="1" opacity=".7"/>']
    if k > 0:
        b.append(f'<path d="M30 24 H{xs[k]}" stroke="{CHAMP}" stroke-width="1.6"/>')
    # the gate between Part Four and Part Five
    b.append(f'<path d="M240 18 V30" stroke="{CHAMP}" stroke-width="1.2"/>')
    b.append(f'<text x="240" y="44" text-anchor="middle" style="font-family:Lora;font-style:italic;'
             f'font-size:6.6px;fill:{SAGE}">gate</text>')
    for i, (num, name, ch) in enumerate(PARTS):
        x = xs[i]
        if i < k:
            b.append(f'<circle cx="{x}" cy="24" r="4.5" fill="{SAGE}"/>')
        elif i == k:
            b.append(f'<circle cx="{x}" cy="24" r="9" fill="none" stroke="{CHAMP}" stroke-width=".8" opacity=".6"/>'
                     f'<circle cx="{x}" cy="24" r="5.5" fill="{CHAMP}"/>')
        else:
            b.append(f'<circle cx="{x}" cy="24" r="4.5" fill="#123B1F" stroke="{SAGE}" stroke-width="1"/>')
        col = CHAMP if i == k else SAGE
        b.append(f'<text x="{x}" y="9" text-anchor="middle" style="font-family:Poppins;font-weight:600;'
                 f'font-size:6.6px;letter-spacing:1px;fill:{col}">{num}</text>')
        b.append(f'<text x="{x}" y="44" text-anchor="middle" style="font-family:Poppins;font-weight:{600 if i == k else 500};'
                 f'font-size:7.2px;fill:{CREAM if i == k else SAGE}">{name}</text>')
        b.append(f'<text x="{x}" y="55" text-anchor="middle" style="font-family:\'IBM Plex Mono\';'
                 f'font-size:6.4px;fill:{SAGE}">ch. {ch}</text>')
    label = f'The road through the book, five parts, with Part {PARTS[k][0]} marked as where you are.'
    return (f'<div class="pmap"><svg width="300" height="60" viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg" '
            f'role="img" aria-label="{label}">{"".join(b)}</svg></div>')


# --------------------------------------------------------------------------
# chapter 3: where the essentials line sits
def essentials_gauge():
    W, x0, x1 = 331, 0, 331
    X = lambda p: x0 + (x1 - x0) * p / 100
    b = []
    zones = [(0, 60, D_IN, 'CUT AND EARN', 'both work'),
             (60, 85, D_FIX, 'EARN FIRST', 'cutting returns less'),
             (85, 100, D_VAR, 'EARN, OR MOVE A BIG COST', 'trimming is theater')]
    for a, z, col, lab, sub in zones:
        b.append(f'<rect x="{X(a) + (1 if a else 0):.1f}" y="40" width="{X(z) - X(a) - (1 if a else 0) - (1 if z < 100 else 0):.1f}" '
                 f'height="12" rx="2" fill="{col}"/>')
    for p in (0, 60, 85, 100):
        b.append(t(X(p), 64, f'{p}%', 'hax', 'start' if p == 0 else 'end' if p == 100 else 'middle'))
    for x, col, lab, subs in ((0, D_IN, 'UNDER 60%', ['cutting and earning', 'both work']),
                              (115, D_FIX, '60 TO 85%', ['earning returns more', 'than cutting']),
                              (230, D_VAR, 'OVER 85%', ['trimming is theater:', 'earn, or move a big cost'])):
        b.append(f'<rect x="{x}" y="73" width="7" height="7" rx="1" fill="{col}"/>')
        b.append(t(x + 11, 79.5, lab, 'hl'))
        for k, sub in enumerate(subs):
            b.append(t(x + 11, 91 + 10 * k, sub, 'ht'))
    # personas, month 0 essentials over take-home (Appendix D)
    for name, p, y in (('Maya', 70.7, 30), ('Marcus', 94.7, 30)):
        x = X(p)
        b.append(f'<path d="M{x:.1f} {y + 3} V54" stroke="{INK}" stroke-width="1"/>'
                 f'<circle cx="{x:.1f}" cy="{y}" r="3" fill="{INK}"/>')
        b.append(t(x - 6, y + 3, f'{name} · {p:.0f}%', 'hn', 'end'))
    b.append(t(0, 12, 'ESSENTIALS AS A SHARE OF WHAT CAME IN', 'hl'))
    b.append(f'<path d="M0 112 H{W}" stroke="{HAIR}" stroke-width="1"/>')
    b.append(t(0, 126, 'Essentials: housing, utilities, food at home, transport to work, insurance, medicine', 'ht'))
    b.append(t(0, 137, 'and minimum payments, over one month of take-home pay.', 'ht'))
    s = svg(W, 142, 'A horizontal scale of essentials as a share of income. Below 60 percent, cutting and earning both '
            'work. From 60 to 85 percent, earning returns more. Above 85 percent, trimming is mostly theater. Maya sits at '
            'about 71 percent and Marcus at about 95 percent at month zero.', ''.join(b))
    return (f'<figure class="hero">{s}<figcaption>Which side of the line you are on decides your next month</figcaption>'
            '<p class="srcline">Month 0 costs from <a href="#appD">Appendix D</a>: Marcus $2,622 of essentials on '
            '$2,769, Maya $3,992 on $5,647. Phone and internet counted as utilities.</p></figure>')


# --------------------------------------------------------------------------
# chapter 6: the gap, enlarged, and every dollar of it given a job
def gap_zoom():
    W = 331
    inc, living, parts = 3000, 2700, [('SAVINGS', 150, D_IN), ('EXTRA TO DEBT', 100, D_INV), ('CAR FUND', 50, D_FIX)]
    gx = W * living / inc
    b = [t(0, 11, 'ONE MONTH · $3,000 IN', 'hl'),
         f'<rect x="0" y="18" width="{gx - 1:.1f}" height="26" rx="2" fill="{D_VAR}"/>',
         f'<rect x="{gx + 1:.1f}" y="18" width="{W - gx - 1:.1f}" height="26" rx="2" fill="{D_IN}"/>',
         t(10, 34.5, 'LIVING COSTS', 'hl', extra=f' style="fill:{CREAM}"'),
         t(gx - 10, 34.5, '$2,700', 'hn', 'end', f' style="fill:{CREAM}"'),
         t(W, 11, 'THE GAP · <tspan class="hn">$300</tspan>', 'hl', 'end'),
         f'<path d="M{gx + 1:.1f} 44 L0 70 H{W} L{W} 44 Z" fill="{PANEL}"/>']
    x = 0
    gap = inc - living
    for i, (lab, v, col) in enumerate(parts):
        w = W * v / gap
        b.append(f'<rect x="{x + (1 if i else 0):.1f}" y="70" width="{w - (1 if i else 0) - (1 if i < 2 else 0):.1f}" '
                 f'height="30" rx="2" fill="{col}"/>')
        cx = x + w / 2
        b.append(t(cx, 116, lab, 'hl', 'middle'))
        b.append(t(cx, 128, f'${v}', 'hn', 'middle'))
        x += w
    b.append(t(W / 2, 64, 'THE SAME $300, ENLARGED', 'hax', 'middle', f' style="fill:{FOREST}"'))
    b += [f'<rect x="0" y="140" width="{W}" height="22" rx="3" fill="{PAPER}" stroke="{HAIR}" stroke-width=".8"/>',
          t(10, 154.5, 'UNASSIGNED  <tspan class="hn">$0</tspan>', 'hl'),
          t(W - 10, 154.5, 'every dollar has a job', 'ht', 'end'),
          f'<path d="M0 174 H{W}" stroke="{HAIR}" stroke-width="1"/>',
          t(0, 188, 'Living costs = fixed bills + variable spending, including minimum debt payments.', 'hs'),
          t(0, 200, 'They exclude transfers and extra debt payments.', 'hs'),
          t(0, 216, 'A gap of $300 with $300 unassigned is not a gap. It is money waiting to be spent.', 'ht')]
    return svg(W, 222, 'A bar of 3,000 dollars of income, 2,700 of it living costs and 300 of it the gap. The 300 is '
               'enlarged below and split into 150 to savings, 100 extra to debt and 50 to a car fund, leaving 0 '
               'unassigned.', ''.join(b))


# --------------------------------------------------------------------------
# chapter 14: what the minimum costs
def card_path(B, apr, P):
    r, path, interest = apr / 1200, [B], 0.0
    while B > 0.005:
        i = round(B * r, 2)
        interest += i
        B = round(B + i - min(P, B + i), 2)
        path.append(B)
    return path, round(interest)


def minimum_trap():
    W, H0, H1, x0, x1 = 331, 22, 112, 30, 331
    slow, slow_i = card_path(4800, 26.9, 120)
    fast, fast_i = card_path(4800, 26.9, 220)
    N = 108
    X = lambda m: x0 + (x1 - x0) * m / N
    Y = lambda v: H1 - (H1 - H0) * v / 5000
    b = []
    for v in (0, 2500, 5000):
        b.append(f'<path d="M{x0} {Y(v):.1f} H{x1}" stroke="{HAIR}" stroke-width=".6"/>')
        b.append(t(x0 - 4, Y(v) + 2.4, f'${v:,}' if v else '$0', 'hax', 'end'))
    for yr in range(0, 9):
        b.append(t(X(yr * 12), H1 + 10, f'{yr} years' if yr == 8 else str(yr), 'hax', 'start' if yr == 0 else 'middle'))
    for path, col in ((slow, D_VAR), (fast, D_IN)):
        d = ' '.join(f'{"M" if i == 0 else "L"}{X(i):.1f} {Y(v):.1f}' for i, v in enumerate(path))
        b.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="2" stroke-linejoin="round"/>')
    b.append(f'<circle cx="{X(len(fast) - 1):.1f}" cy="{Y(0):.1f}" r="3.2" fill="{D_IN}" stroke="#fff" stroke-width="1.2"/>')
    b.append(f'<circle cx="{X(len(slow) - 1):.1f}" cy="{Y(0):.1f}" r="3.2" fill="{D_VAR}" stroke="#fff" stroke-width="1.2"/>')
    b.append(t(X(len(fast) + 2), Y(1300), '$220 a month', 'hnb'))
    b.append(t(X(len(fast) + 2), Y(1300) + 11, f'{len(fast) - 1} months · {usd(fast_i)} interest', 'hn'))
    b.append(t(x1, Y(4750), '$120 a month', 'hnb', 'end'))
    b.append(t(x1, Y(4750) + 11, f'{len(slow) - 1} months · {usd(slow_i)} interest', 'hn', 'end'))
    b.append(t(0, 10, 'MARCUS’S CARD A · $4,800 AT 26.9%', 'hl'))
    b.append(t(0, H1 + 28, 'The extra $100 a month saves about ' + usd(slow_i - fast_i) + ' and six years. At the minimum, the', 'ht'))
    b.append(t(0, H1 + 39, 'interest alone comes to more than the card ever lent him.', 'ht'))
    s = svg(W, H1 + 44, f'Balance of a 4,800 dollar card at 26.9 percent. Paying 120 dollars a month takes {len(slow) - 1} '
            f'months and costs {slow_i} dollars in interest. Paying 220 takes {len(fast) - 1} months and costs {fast_i}.',
            ''.join(b))
    return (f'<figure class="hero">{s}<figcaption>The minimum is a price, paid in years</figcaption>'
            '<p class="srcline">Fixed payments, interest charged monthly, no new purchases. A real minimum usually '
            'falls as the balance falls, which makes the slow line slower still.</p></figure>')


# --------------------------------------------------------------------------
# chapter 16: twenty-four months, one bar a month
def trajectories():
    W, x0, x1 = 331, 34, 300
    step = (x1 - x0) / 25
    bw = step - 2.2
    panels = [('Marcus', 22, {1: ('$180 of cuts', 'up'), 6: ('side income, then a raise', 'up'),
                              16: ('$780 repair', 'down')}),
              ('Maya', 128, {1: ('$480 of cuts', 'up'), 6: ('side income', 'up'),
                             9: ('$1,450 emergency', 'down'), 12: ('cheaper lease', 'up')})]
    S = 1.6  # px per percentage point, shared by both panels
    b = []
    for name, top, notes in panels:
        rows = MODEL[name]['rows']
        base = top + 34
        b.append(t(0, top - 6, name.upper(), 'hl'))
        for p in (20, 0, -20):
            y = base - p * S
            b.append(f'<path d="M{x0} {y:.1f} H{x1}" stroke="{HAIR if p else INK2}" stroke-width="{.6 if p else .8}"/>')
            b.append(t(x0 - 4, y + 2.4, f'{p:+d}%' if p else '0', 'hax', 'end'))
        for r in rows:
            rate = 100 * r['gap'] / r['income']
            h = abs(rate) * S
            x = x0 + r['month'] * step + 1.1
            y = base - h if rate >= 0 else base
            b.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{max(h, .8):.1f}" rx="1" '
                     f'fill="{D_IN if rate >= 0 else D_VAR}"/>')
            if r['month'] in notes:
                lab, way = notes[r['month']]
                cx = x + bw / 2
                if way == 'up':
                    b.append(t(x, top - 6, lab, 'ht', 'start'))
                else:
                    b.append(t(cx, base + 20 * S + 9, lab, 'ht', 'middle'))
        last = rows[-1]
        pct = round(100 * last['gap'] / last['income'] + 1e-9, 1)
        b.append(t(W, base - pct * S + 3, f'{pct:.1f}%', 'hnb', 'end'))
    for m in (0, 6, 12, 18, 24):
        b.append(t(x0 + m * step + step / 2, 222, f'month {m}' if m == 0 else str(m), 'hax', 'middle'))
    b.append(t(0, 238, 'The gap as a share of take-home, every month. The shallow dips every third month', 'ht'))
    b.append(t(0, 249, 'are the quarterly tax on side income, paid from the reserve.', 'ht'))
    s = svg(W, 254, 'Two bar charts, one bar per month from month 0 to month 24, of the gap as a share of take-home pay. '
            'Marcus starts at minus 3.7 percent and ends at 10.1 percent, with one negative month for a 780 dollar repair. '
            'Maya starts at minus 0.7 percent and ends at 9.0 percent, with one deep negative month for a 1,450 dollar emergency.',
            ''.join(b))
    return (f'<figure class="hero">{s}<figcaption>Twenty-four months, one bar each: a hard month is a dip, not a '
            'collapse</figcaption><p class="srcline">From the model in <a href="#appD">Appendix D</a>. Both panels '
            'share one scale.</p></figure>')


# --------------------------------------------------------------------------
def apply(html):
    # ---- persona numbers in the existing figures
    html = in_figure(html, 'Two files, one shape: the gap is negative in both',
                     [('>$18,050<', '>$19,230<')], 'fig month 0')
    html = in_figure(html, 'The automatic architecture: savings goes first, not last',
                     [('your Savings Contribution, taken out of the gap', 'your savings transfer, taken out of the gap')],
                     'fig architecture')
    html = in_figure(html, 'One month, laid flat: paydays against due dates', [
        ('re:year, that two-day gap is the whole of Marcus.s \\$60 problem\\.',
         'year, that two-day gap turns his $103 shortfall into an overdraft as well.'),
        ('Nothing was cut. The shortfall is gone.', 'Nothing was cut. The timing problem is gone.')], 'fig calendar')
    html = in_figure(html, 'Month 24, with the honest numbers', [
        ('>$3,097<', '>$3,149<'), ('>$608<', '>$320<'), ('>$1,108<', '>$500<'), ('>$552<', '>$509<'),
        ('re:(x="139" y="94"[^>]*>)\\$0<', '\\1$320<'), ('>$5,596<', '>$6,206<'),
        ('>$5,501<', '>$6,101<'), ('>$704<', '>$549<'), ('>$4,253<', '>$9,769<'), ('>$2,090<', '>$2,192<'),
        ('>$27,135<', '>$27,711<')], 'fig month 24')
    html = in_figure(html, 'Five freedoms, each with its own number', [
        ('$14,900', '$17,000'), ('$29,900', '$34,000'), ('$373,000', '$424,000'), ('$747,000', '$849,000'),
        ('14,900 dollars saved, free to walk at 29,900, half free at 373,000, and free at 747,000',
         '17,000 dollars saved, free to walk at 34,000, half free at 424,000, and free at 849,000')], 'fig freedoms')
    html = in_figure(html, 'Where what it earns passes what you add', [
        ('WHAT YOU ADD · $7,296 A YEAR', 'WHAT YOU ADD · THE SAME EACH YEAR'),
        ('THE CROSSOVER · YEAR 14', 'THE CROSSOVER · YEAR 15'),
        ('Year 14 for Marcus, at his month-24 gap and 5% a year after inflation. After that line',
         'Year 15 for any steady amount, at 5% a year after inflation. After that line'),
        ('the portfolio puts in more than he does, and it never asks him for a Saturday.',
         'the portfolio puts in more than you do, and it never asks you for a Saturday.'),
        ('A flat gold line for the 7,296 dollars a year Marcus adds, and a rising green curve for what his portfolio '
         'earns. The curve crosses the line at about year 14, marked the crossover.',
         'A flat gold line for a steady yearly contribution, and a rising green curve for what the portfolio earns. '
         'The curve crosses the line during year 15, marked the crossover.')], 'fig crossover')

    # ---- chapter 6: the gap, enlarged
    cap = '<figcaption>The gap, assigned and unassigned</figcaption>'
    once(html, cap, cap, 'gap zoom')
    i = html.index(cap)
    a = html.rindex('<svg', 0, i)
    html = html[:a] + gap_zoom() + html[i:]

    # ---- new figures, each after the paragraph it condenses
    html = after(html, 'There is a line where that stops being a caution', essentials_gauge())
    html = after(html, 'On a high rate, a minimum payment can be smaller', minimum_trap())
    i = html.index('<figcaption>Month 24, with the honest numbers</figcaption>')
    j = html.rindex('<figure>', 0, i)
    html = html[:j] + trajectories() + html[j:]

    # ---- part openers
    for k in range(5):
        a = html.index(f'<h1 id="part{k + 1}"')
        e = html.index('<p class="epic">', a)
        e = html.index('</p>', e) + 4
        html = html[:e] + part_map(k) + html[e:]
    return html
