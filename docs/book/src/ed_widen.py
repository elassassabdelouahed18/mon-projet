"""Revision: the widening stage, the book's third act.

The book takes a reader out of the trap, holds them steady, then widens the gap
until the paycheck is optional. The first two stages were well built; this
module strengthens the third.

Arithmetic, all from model/widening-levers.py, which runs Marcus on from month
34 of the persona model, when his last debt is gone: $3,149 in, $2,511.80 of
living costs, a gap of $637.20, or 20.2% of take-home. Contributions at year
end, 5% a year after inflation, target 25 times a year of spending:

    as he stands .............................. 37 years
    $200 a month off housing or transport ..... 31
    $400 a month off ......................... 26
    2% real raises, half to the gap ........... 36
    2% real raises, three quarters to the gap . 30
    $400 off and three quarters of raises ..... 24

The two findings that change what the book says:
  - Half of a raise barely moves the date, because the half you spend raises
    the target too. Three quarters is the number that accelerates.
  - One permanent housing or transport decision outruns every subscription in
    the book, because cutting moves the number twice (Chapter 19).
"""
from build import once
from ed import apply_list

FOREST, INK, INK2, HAIR, PANEL = '#1C4C2A', '#2E2910', '#46412A', '#D5DFD6', '#E6F1E8'
D_IN, D_FIX, D_VAR = '#36894F', '#E3A72A', '#C4462E'


def levers_figure():
    """Years to freedom under each lever, as a bar per scenario."""
    W, x0, x1, top, bh, gap = 331, 0, 331, 26, 15, 9
    rows = [('As he stands today', '20.2%', 37, D_VAR),
            ('Three quarters of every raise', '—', 30, D_FIX),
            ('$400 a month off housing or transport', '32.9%', 26, D_IN),
            ('Both together', '—', 24, D_IN)]
    longest = max(r[2] for r in rows)
    b = [f'<text x="0" y="10" style="font-family:Poppins;font-weight:600;font-size:7.4px;'
         f'letter-spacing:1px;fill:{FOREST}">YEARS TO A PORTFOLIO THAT REPLACES THE PAYCHECK</text>']
    for i, (label, rate, yrs, col) in enumerate(rows):
        y = top + i * (bh + gap)
        w = (x1 - 78) * yrs / longest
        b.append(f'<rect x="0" y="{y}" width="{w:.1f}" height="{bh}" rx="2" fill="{col}"/>')
        b.append(f'<text x="{w + 6:.1f}" y="{y + bh - 4}" style="font-family:\'IBM Plex Mono\';'
                 f'font-weight:600;font-size:9px;fill:{INK}">{yrs} years</text>')
        b.append(f'<text x="0" y="{y - 3}" style="font-family:Lora;font-size:8.2px;fill:{INK}">{label}</text>')
    y = top + len(rows) * (bh + gap) + 4
    b.append(f'<path d="M0 {y} H{W}" stroke="{HAIR}" stroke-width="1"/>')
    for k, line in enumerate(
            ['Marcus from month 34, when his last debt is gone: $3,149 in, $2,512 of living costs.',
             'Raises are 2% a year above inflation. Investments earn 5% a year after inflation.',
             'Cutting works twice: it widens the gap and lowers the target it is aiming at.']):
        b.append(f'<text x="0" y="{y + 14 + k * 11}" style="font-family:Lora;font-style:italic;'
                 f'font-size:7.8px;fill:{INK2}">{line}</text>')
    svg = (f'<svg width="{W}" height="{y + 52}" viewBox="0 0 {W} {y + 52}" '
           f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four bars. As he stands today, 37 '
           f'years. Sending three quarters of every raise to the gap, 30 years. Taking 400 dollars a month '
           f'off housing or transport, 26 years. Both together, 24 years.">{"".join(b)}</svg>')
    return (f'<figure class="hero">{svg}<figcaption>Two decisions, thirteen years</figcaption>'
            '<p class="srcline">Worked in <a href="#appH">Appendix H</a>, from the model in '
            '<a href="#appD">Appendix D</a>. Illustrative, and the shape holds at any income.</p></figure>')


# --------------------------------------------------------------------- chapter 16
WIDEN = (
    '<h2>Then widen it on purpose</h2>'

    '<p>Here is where most people stop, and it is the most expensive stop in personal finance. They get '
    'stable, feel the relief, and let the gap sit at whatever width it happened to reach. A gap that stops '
    'widening is a gap that slowly closes, because life gets more expensive on its own.</p>'

    '<p>So look at what the width is actually worth. Run Marcus on past the model in Appendix D. In month 34 '
    'his last debt goes, the minimums leave his costs, and his gap settles near $637 a month, about 20% of '
    'take-home. Left exactly there, with no raise and no further change, the arithmetic in Chapter 19 gives '
    'him his freedom number in about 37 years. He is 28. That is a working life.</p>'

    '<p>Two decisions cut it almost in half, and neither of them is a side hustle.</p>'

    + levers_figure() +

    '<h2>The two levers that are actually large</h2>'

    '<p><strong>The first is a big fixed cost, moved once.</strong> Chapter 7 plugged the leaks and then '
    'pointed at housing and transport, the two lines where most American households are quietly '
    'overcommitted. This is the chapter where you act on that. A roommate, a smaller place at the next '
    'lease, one car instead of two, a paid-off used car instead of a payment: $400 a month off those lines '
    'takes Marcus from 37 years to 26.</p>'

    '<p>No subscription sweep comes close, and the reason is the one Chapter 19 gives. Cutting a permanent '
    'cost moves the number twice: it widens the gap and it lowers the target, because a smaller life needs a '
    'smaller pot. Earning more moves it once. That is why the dull, unglamorous lease decision outruns every '
    'clever thing in this book.</p>'

    '<p>These moves are avoided because they are big, not because they are hard. They happen on a date, '
    'usually a lease ending or a car dying, and the work is deciding before the date arrives rather than '
    'after. Put the date in Gap now, as a scheduled entry, with the number you intend to land on.</p>'

    '<p><strong>The second is the share of every raise.</strong> Chapter 7 told you to send at least half of '
    'any raise to the gap before your lifestyle learns it exists. That rule is what keeps the gap alive '
    'while you are still getting out, and it is a floor, not a target.</p>'

    '<p>Watch what the floor actually buys. On 2% raises above inflation, sending half to the gap moves '
    'Marcus from 37 years to 36. One year. The half you spend raises the target by almost as much as the '
    'half you save lowers it, so the two nearly cancel. Send three quarters instead and the same raises give '
    'him 30 years. The jump from half to three quarters is worth six years; the jump from nothing to half is '
    'worth one.</p>'

    '<div class="box forest"><p class="lab">Principle</p><p class="big">Half of a raise protects the '
    'gap.<br>Three quarters widens it.</p></div>'

    '<p>So the rule changes with the stage you are in, and this is the chapter where it changes. While the '
    'debt is alive and the fund is thin, half is right, because the other half is buying you a margin you do '
    'not have yet. Once the high-rate debt is gone and three to six months are in the bank, half is leaving '
    'years on the table. Move to three quarters and keep the last quarter, honestly and without guilt, for '
    'the life you are living while you build this.</p>'

    '<p>Both levers together, the $400 and the three quarters, take Marcus from 37 years to 24. He has not '
    'started a business, moved city, or earned a dollar he was not already able to earn. He made one housing '
    'decision and changed one percentage.</p>'
)

RECAP16 = ['With debt falling, grow the starter cushion into three to six months of essentials.',
           'Then widen the gap on purpose. One big fixed cost moved once beats every small cut, '
           'because it lowers the target as well as raising the gap.',
           'Once you are stable, raise the share of every raise from half to three quarters. On '
           'Marcus&rsquo;s file that is worth six years.']

DO16 = ('<p>Name the date your next big fixed cost can change: a lease ending, a car you could replace with '
        'a cheaper one, an insurance renewal. Put it in Gap as a scheduled entry with the number you intend '
        'to land on.</p>'
        '<p class="lab">Later, if you have time</p><ol>'
        '<li>Mark where you stand on the staircase today: surviving, stabilizing, building, or approaching '
        'free. Then name the single next rung.</li>'
        '<li>If your high-rate debt is gone and your fund covers three months, write the new raise share '
        'where you will see it: three quarters to the gap, one quarter to your life.</li></ol>')


EDITS = [
    # ------------------------------------------------- chapter 7: the rule becomes a floor
    ('rep', 'The fix is simple. Whenever income increases',
     'The fix is simple. Whenever income increases, whether that&rsquo;s a raise, a bonus, a tax refund, or '
     'a new income stream from Part Three, first cover the tax on it and anything the household genuinely '
     'lacks. Then route at least half of what is left to your gap&rsquo;s jobs, savings and extra debt, '
     'before your lifestyle notices it existed. Half is the floor while you are still getting out, and '
     'Chapter 16 raises it once you are stable, because half of a raise protects a gap and three quarters '
     'widens it.'),
    ('rep', 'When income rises, cover the tax and any real new need',
     'When income rises, cover the tax and any real new need, then send at least half of the rest to the '
     'gap. Half is the floor, not the target.'),

    # ------------------------------------------------- chapter 12: Engine Zero, with the evidence
    ('rep', 'What it is. Before you sell anything to anyone',
     'What it is. Before you sell anything to anyone, look at the income you already have. Most readers of '
     'this book are underpaid by their own employer&rsquo;s published rules, and have never asked. '
     'Differentials, certifications, internal postings, the hand above the one you were hired into. In the '
     'model behind this book it is the largest single move either reader makes: the lead differential adds '
     'about $180 a month to Marcus&rsquo;s pay, matching every cut he made in month 1 and beating his side '
     'income, which nets about $135 a month after costs and the tax reserve. It costs him no weekends.'),

    # ------------------------------------------------- chapter 21 and the appendices follow the same rule
    ('rep', 'The defense is the one from Chapter Seven, unchanged',
     'The defense is the one from Chapter Seven, raised by Chapter 16: when income rises, first cover the '
     'tax and any real new need, then send three quarters of what is left to the gap before anything else '
     'learns it exists. Half merely holds the gap where it is; three quarters is what moves the date. That '
     'single habit is what separates a rising savings rate from a rising standard of living, and the chart '
     'in Chapter 19 is entirely a chart of that habit.'),
    ('rep', 'Send at least half of every raise to the gap. That one habit',
     'Once you are stable, send three quarters of every raise to the gap. On Marcus&rsquo;s file, half is '
     'worth one year and three quarters is worth six.'),
    ('rep', 'After tax and real needs, send at least half of every raise to the gap',
     'After tax and real needs, send three quarters of every raise to the gap before your lifestyle meets it.'),
    ('rep', 'Raise the savings rate by one percentage point and read the new year figure.',
     'Name the date your next big fixed cost can change, and the number you intend to land on.'),

    # ------------------------------------------------- appendix E: the stage-aware rule, defined once
    ('rep', 'The quiet rise in spending that follows a rise in income',
     'The quiet rise in spending that follows a rise in income, keeping the gap as thin as ever. The defense '
     'is to route a fixed share of every raise to the gap first: at least half while you are getting out, '
     'three quarters once you are stable. The reason earning more, alone, rarely sets anyone free.', 'dd'),
]


APPH = (
    '<h2>Model three: what widens the gap fastest</h2>'

    '<p>Chapter 16 claims that two decisions take Marcus from 37 years to 24. Here is the arithmetic, so you '
    'can check it rather than trust it.</p>'

    '<p>The starting position is not his month 24, but the same model run on to month 34, when his last debt '
    'is paid and the minimums leave his living costs: $3,149 a month in, $2,511.80 out, a gap of $637.20, or '
    '20.2% of take-home. From there each year adds the gap to the portfolio, the portfolio earns 5% after '
    'inflation, and the target is 25 times a year of living costs. Raises, where they appear, are 2% a year '
    'above inflation, and the share not sent to the gap is absorbed by living costs, which raises the target '
    'as well.</p>'

    '<table><thead><tr><th>What changes</th><th class="num">Gap rate</th><th class="num">Years</th></tr>'
    '</thead><tbody>'
    '<tr><td>Nothing: the gap he has, held steady</td><td class="num">20.2%</td><td class="num">37</td></tr>'
    '<tr><td>2% raises, half of each to the gap</td><td class="num">rising</td><td class="num">36</td></tr>'
    '<tr><td>2% raises, three quarters of each to the gap</td><td class="num">rising</td><td class="num">30</td></tr>'
    '<tr><td>$200 a month off a fixed cost, no raises</td><td class="num">26.6%</td><td class="num">31</td></tr>'
    '<tr><td>$400 a month off a fixed cost, no raises</td><td class="num">32.9%</td><td class="num">26</td></tr>'
    '<tr><td>$400 off, and three quarters of 2% raises</td><td class="num">rising</td><td class="num">24</td></tr>'
    '</tbody></table>'

    '<p>Two things are worth reading off that table. The first is why half of a raise is nearly worthless as '
    'an accelerator: it buys one year, because the half you spend lifts the target by about as much as the '
    'half you save lowers the distance to it. The second is why a permanent cut beats everything: $400 a '
    'month is $4,800 a year into the portfolio and $120,000 off the target at the same time.</p>'

    '<div class="box caut"><p class="lab">Careful here</p><p>These are illustrative, like every figure in '
    'this book. They assume the cut is permanent, the raises are real after inflation, and the money is '
    'actually invested rather than left in checking. Change any of those and the years change with them. '
    'What does not change is the ranking: a big fixed cost first, then the share of every raise.</p></div>'
)


def apply(html):
    html = apply_list(html, EDITS)

    # chapter 16 becomes the widening chapter
    html = once(html, '<h2>Where they are now</h2>', WIDEN + '<h2>Where they are now</h2>', 'ch16 widen')
    html = once(html, '<li>Then put money to work, so it grows on its own over years.</li>'
                '<li>A hard month is a dip, not a collapse: both files end month 24 with a positive gap.</li>',
                ''.join(f'<li>{s}</li>' for s in RECAP16[1:]), 'ch16 recap')
    html = once(html, '<p>Mark where you stand on the staircase today: surviving, stabilizing, beginning to '
                'build, or approaching free.</p><p>Then name the single next rung, and the one action that '
                'moves you toward it. You&rsquo;re further up than you think.</p>', DO16, 'ch16 do this now')
    html = once(html, "bookmark-label:'Sixteen · From Surviving to Building'\">From Surviving<br>to Building",
                "bookmark-label:'Sixteen · Widen the Gap on Purpose'\">Widen the Gap<br>on Purpose",
                'ch16 title')
    html = once(html, '<a href="#ch16"><span class="cn">16</span>From Surviving to Building',
                '<a href="#ch16"><span class="cn">16</span>Widen the Gap on Purpose', 'ch16 contents')
    html = once(html, 'There&rsquo;s a moment when money stops being something you chase and starts being '
                'something that works for you.',
                'The debt is going and the fund is filling. Now comes the part almost nobody does on '
                'purpose: making the gap as wide as your life allows.', 'ch16 deck')

    # The cover artwork now reads "The 5-Part System"; the title page, the
    # metadata and the cover's alt text follow it word for word.
    html = once(html, 'The 4-Part System to Break the Paycheck-to-Paycheck Cycle. BeFree Academy.',
                'The 5-Part System to Break the Paycheck-to-Paycheck Cycle. BeFree Academy.',
                'meta description')
    html = once(html, 'The 4-Part System to Break the<br>Paycheck-to-Paycheck Cycle',
                'The 5-Part System to Break the<br>Paycheck-to-Paycheck Cycle', 'title page subtitle')
    html = once(html, 'The Anti-Paycheck Trap. The System to Break the Paycheck-to-Paycheck Cycle. BeFree. '
                'A deep green cover with the title in cream foil and the BeFree broken-ring mark in gold and '
                'malachite, three points escaping upward.',
                'The Anti-Paycheck Trap. The 5-Part System to Break the Paycheck-to-Paycheck Cycle. BeFree '
                'System: ebook plus toolkits. A deep green leather cover with the title in cream and gold '
                'foil and the BeFree broken-ring mark below it, three points escaping upward.', 'cover alt')

    # appendix H carries the arithmetic behind chapter 16
    i = html.index('<p class="lab">Careful here</p><p>Every figure in both models is in today')
    j = html.index('</div>', i) + len('</div>')
    html = html[:j] + APPH + html[j:]
    return html
