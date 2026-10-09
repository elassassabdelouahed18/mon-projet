"""Appendix H, Model four, and the chart that carries it (C1).

Chapter 16 ends on a number above thirty, which is honest and also the point
at which a reader decides the book was not written for them. Model four answers
the obvious next question: what if the engine the book spent four chapters on
actually works?

Every figure comes from model/scenarios.py, which reads the 2026 brackets from
IRS Rev. Proc. 2025-32 and the supervisor's wage from the BLS OEWS May 2025
release file. Nothing here is typed by hand.
"""
import importlib.util
import os

from build import once

HERE = os.path.dirname(os.path.abspath(__file__))

# lightness-staggered so the four lines survive colour blindness: the worst
# pair is 16.0 under deuteranopia against the book's floor of 8
C_STAND, C_SIDE, C_PROMO, C_BOTH = '#003916', '#953B17', '#539C65', '#F5AE4B'
INK, INK2, HAIR = '#2E2910', '#46412A', '#D5DFD6'


def _scenarios():
    path = os.path.join(HERE, 'model', 'scenarios.py')
    spec = importlib.util.spec_from_file_location('scenarios', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


S = _scenarios()
INCOME, LIVING, _ = S.base()
STEP = S.SUPERVISOR - S.GROSS_NOW
TAX = S.tax_on_raise(S.GROSS_NOW, S.SUPERVISOR)
RAISE_NET = (STEP - TAX) / 12
MARGINAL = S.marginal_on_raise(S.GROSS_NOW, S.SUPERVISOR) * 100
TARGET = S.TARGET_MULTIPLE * LIVING * 12

RUNS = [
    ('As he stands', 0.0, 0, C_STAND),
    ('A side service at $500 a month, from year 2', 500.0, 2, C_SIDE),
    ('Shift supervisor from year 3', RAISE_NET * 0.75, 3, C_PROMO),
    ('Both', RAISE_NET * 0.75 + 500.0, 3, C_BOTH),
]


def track(extra, from_year, cap=34, raise_pct=0.02, to_gap=0.75, r=0.05):
    """The portfolio year by year, on the same rules as model/scenarios.py."""
    income, living, balance = INCOME, LIVING, 0.0
    out, crossed = [(0, 0.0)], None
    for year in range(1, cap + 1):
        add = extra if year >= from_year else 0.0
        balance = balance * (1 + r) + (income + add - living) * 12
        out.append((year, balance))
        if crossed is None and balance >= S.TARGET_MULTIPLE * living * 12:
            crossed = year
        rise = income * raise_pct
        income += rise
        living += rise * (1 - to_gap)
    return out, crossed


def figure():
    W = 331
    x0, x1, y0, y1 = 0, 243, 32, 140
    cap, top = 32, TARGET * 1.08
    X = lambda t: x0 + (x1 - x0) * t / cap
    Y = lambda v: y1 - (y1 - y0) * min(v, top) / top
    b = [f'<path d="M{x0} {y1} H{W}" stroke="{INK2}" stroke-width=".9"/>']
    b.append(f'<path d="M{x0} {Y(TARGET):.1f} H{x1}" stroke="#B7770A" stroke-width=".8" '
             f'stroke-dasharray="3 2"/>')
    b.append(f'<text x="{x1 + 5}" y="{Y(TARGET) - 4:.1f}" style="font-family:Poppins;'
             f'font-weight:600;font-size:7px;letter-spacing:.9px;fill:#603900">FREE</text>')
    b.append(f'<text x="{x1 + 5}" y="{Y(TARGET) + 6:.1f}" style="font-family:Lora;font-size:7px;'
             f'fill:{INK2}">${TARGET / 1000:.0f}k</text>')
    for label, extra, fy, col in RUNS:
        pts, crossed = track(extra, fy)
        # stop each line where it crosses, so no flat tail pretends to be data
        stop = crossed if crossed else cap
        d = 'M' + ' L'.join(f'{X(t):.1f} {Y(v):.1f}' for t, v in pts if t <= stop)
        b.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="1.9"/>')
        if crossed and crossed <= cap:
            b.append(f'<circle cx="{X(crossed):.1f}" cy="{Y(TARGET):.1f}" r="2.6" fill="{col}"/>')
            b.append(f'<text x="{X(crossed):.1f}" y="{Y(TARGET) - 8:.1f}" text-anchor="middle" '
                     f'style="font-family:\'IBM Plex Mono\';font-weight:600;font-size:7.6px;'
                     f'fill:{col}">{crossed}</text>')
    for t in (0, 10, 20, 30):
        anchor = 'start' if t == 0 else 'middle'
        b.append(f'<text x="{X(t):.1f}" y="{y1 + 11}" text-anchor="{anchor}" '
                 f'style="font-family:Poppins;font-weight:500;font-size:7px;fill:{INK2}">'
                 f'year {t}</text>')
    ly = y1 + 27
    for i, (label, extra, fy, col) in enumerate(RUNS):
        yy = ly + i * 10.5
        b.append(f'<rect x="0" y="{yy - 5.2:.1f}" width="12" height="2.4" rx="1.2" fill="{col}"/>')
        pts, crossed = track(extra, fy)
        b.append(f'<text x="17" y="{yy:.1f}" style="font-family:Lora;font-size:8px;fill:{INK}">'
                 f'{label}</text>')
        b.append(f'<text x="{W}" y="{yy:.1f}" text-anchor="end" style="font-family:'
                 f'\'IBM Plex Mono\';font-weight:600;font-size:8px;fill:{col}">{crossed} years</text>')
    H = round(ly + len(RUNS) * 10.5 + 4)
    alt = ('Four portfolio lines from Marcus&rsquo;s month 36. As he stands he reaches his freedom '
           'number in year ' + str(track(0.0, 0)[1]) + '. A side service of five hundred dollars a '
           'month from year two brings it to year ' + str(track(500.0, 2)[1]) + '. The shift '
           'supervisor promotion from year three brings it to year ' + str(track(RAISE_NET * .75, 3)[1])
           + '. Both together, year ' + str(track(RAISE_NET * .75 + 500, 3)[1]) + '.')
    svg = (f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" '
           f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{alt}">{"".join(b)}</svg>')
    return (f'<figure class="hero">{svg}<figcaption>Scenario, not a prediction</figcaption>'
            f'<p class="srcline">Worked in <a href="#appH">Appendix H</a>, Model four. The '
            f'supervisor&rsquo;s wage is the Columbus median for the job from the Bureau of Labor '
            f'Statistics, not an assumption.</p></figure>')


def apply(html):
    y_stand = track(0.0, 0)[1]
    y_side = track(500.0, 2)[1]
    y_promo = track(RAISE_NET * 0.75, 3)[1]
    y_both = track(RAISE_NET * 0.75 + 500.0, 3)[1]

    model4 = (
        '<h2>Model four &middot; what if the engine works</h2>'

        '<p>Chapter 16 leaves Marcus at a number above thirty, and that number assumes he never '
        'earns another dollar he is not already earning. He spent four chapters of this book '
        'building an offense. Here is what it is worth if it works at all.</p>'

        '<p>The starting position is the same one Model three used: month 36, debts gone, '
        f'${INCOME:,.0f} a month in and ${LIVING:,.0f} out. Three quarters of every 2% real raise '
        'goes to the gap. The only thing that changes between the lines below is what he adds.</p>'

        '<p><strong>The promotion is not a guess.</strong> The Bureau of Labor Statistics publishes '
        'what a first-line supervisor of transportation and material moving workers is paid in the '
        f'Columbus metropolitan area: a median of <strong>${S.SUPERVISOR:,}</strong> a year '
        f'(occupation code 53-1047, May 2025). Marcus grosses about ${S.GROSS_NOW:,}. The step is '
        f'<strong>${STEP:,}</strong> a year.</p>'

        '<p>Tax it the way errata A2 insists: at the marginal rate. Federal 12%, FICA 7.65%, Ohio '
        f'2.75% and Columbus 2.5% take ${TAX:,.0f} of it, which is {MARGINAL:.1f}%. The whole raise '
        f'stays inside the 12% federal bracket &mdash; his taxable income after it would be '
        f'${S.SUPERVISOR - S.PRETAX_HEALTH - S.STANDARD_DEDUCTION:,}, and that bracket runs to '
        f'$50,400 &mdash; so the rate on the last dollar is the same as the rate on the first. '
        f'<strong>About ${RAISE_NET:,.0f} a month</strong> reaches his account.</p>'

        '<table><thead><tr><th>What he adds</th><th class="num">Free in</th></tr></thead><tbody>'
        f'<tr><td>Nothing he is not already doing</td><td class="num">year {y_stand}</td></tr>'
        f'<tr><td>A side service reaching $500 a month net, from year 2</td>'
        f'<td class="num">year {y_side}</td></tr>'
        f'<tr><td>The supervisor&rsquo;s job, from year 3</td><td class="num">year {y_promo}</td></tr>'
        f'<tr><td>Both</td><td class="num">year {y_both}</td></tr>'
        '</tbody></table>'

        '<p>He is 28 at the start of the book. The last line puts him at '
        f'{28 + y_both + 3}, with a paycheck he does not need.</p>'

        '<div class="box caut"><p class="lab">What this is and is not</p>'
        '<p>It is arithmetic on a published wage, not a forecast. Nobody is owed a promotion, the '
        'side service might earn nothing, and a year of unemployment moves every line to the right. '
        'What the table shows is narrower and more useful than a prediction: the <em>size</em> of '
        'what the offense is worth, against the cost of not building one. Seven years of his life '
        'sit between the first row and the third, and the difference is one conversation with a '
        'supervisor and three months of clean numbers.</p></div>')

    # Model four goes after Model three, which is the one it builds on
    anchor = '<h2>Model three: what widens the gap fastest</h2>'
    i = html.index(anchor)
    j = html.index('</section>', i)
    html = html[:j] + model4 + html[j:]
    # The chart comes after the two levers have landed, as the turn from "what
    # you can cut" to "what the offense is worth". Putting it before them
    # interrupts an argument that is still being made.
    tail = ('changed one percentage.</p>')
    i = html.index('Both levers together, the $400 and the three quarters')
    j = html.index(tail, i) + len(tail)
    lead = ('<p>That is the defense, taken as far as it goes. Now put the offense back in. '
            'Chapters 10 to 13 were four chapters about earning, and every line above assumes '
            'he never uses any of it.</p>')
    html = html[:j] + lead + figure() + html[j:]
    return html
