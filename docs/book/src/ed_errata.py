"""Errata from the external review (section A of the fix list).

These are corrections of fact, of arithmetic, or of a cross-reference, kept in
one module so the list can be read against the review. Edits that belong to a
region another module rewrites live in that module instead; this one runs after
them, on text they have already produced.

A1 and A2 are the arithmetic errata and live in model/financial-model.cjs; what
remains of them here is the Appendix D note that lets a reader check the rule.
"""
import re

from build import once
from ed import apply_list

# ---------------------------------------------------------------- A1 / A2
# Appendix D shows month-0 take-home, which the errata do not change. What it
# did not show was how a *change* in income is taxed, which is where both
# errors were. This note states the rule and gives both worked figures.
TAX_NOTE = (
    '<div class="box care"><p class="lab">How a change in pay is taxed here</p>'
    '<p>Both tables above are month 0. Every later change in income is taxed at the '
    '<em>marginal</em> rate, which is the rate on the next dollar, not the average rate the '
    'tables show. Two changes in these twenty-four months depend on it.</p>'
    '<p>Marcus&rsquo;s lead differential is ordinary wages: $1.25 an hour on a 1,976-hour '
    'schedule is $2,470 a year, or $205.83 a month gross. Federal 12%, FICA 7.65%, Ohio 2.75% '
    'and Columbus 2.5% take 24.9% of it, so about <strong>$155</strong> reaches his account.</p>'
    '<p>Maya&rsquo;s 401(k) increase runs the other way, and not symmetrically. Two more points '
    'of $95,000 is $1,900 a year, or $158.33 a month, deferred. A traditional 401(k) lowers '
    'federal and state taxable income but <em>not</em> FICA, which is levied on gross wages. '
    'Federal 22% and North Carolina 3.99% come back, so her take-home falls by about '
    '<strong>$117</strong>, not by the full $158.</p></div>')

# ---------------------------------------------------------------- A14
# The investing-order chart skipped the HSA, which the text and the chapter
# summary both place third. Regenerated with six steps, same geometry: a 30px
# row every 33px, dark for the steps that are guaranteed or tax-advantaged,
# amber for the two that are neither.
ORDER = [
    ('CAPTURE THE FULL EMPLOYER MATCH', 'not optional: it is free compensation', True),
    ('KILL DEBT ABOVE ROUGHLY 7%', 'a guaranteed return no investment beats', True),
    ('FUND THE HSA', 'if you are on a high-deductible plan', True),
    ('FUND A ROTH IRA', '$7,500 for 2026, tax-free coming out', True),
    ('RAISE THE WORKPLACE PLAN PAST THE MATCH', 'toward about 15% of gross', False),
    ('THEN A TAXABLE BROKERAGE', 'once the tax-advantaged space is used', False),
]
ALT = ('Six priorities in order: capture the full employer match, kill debt above roughly seven '
       'percent, fund the HSA if you are on a high-deductible plan, fund a Roth IRA, raise the '
       'workplace plan past the match toward fifteen percent of gross, then a taxable brokerage '
       'account.')


def investing_order(defs):
    W, H, PITCH = 331, 30, 33
    b = []
    for i, (label, sub, dark) in enumerate(ORDER):
        y = i * PITCH
        bg, ink = ('#1C4C2A', '#FBF6EE') if dark else ('#EDA335', '#1C1808')
        b.append(f'<rect x="0" y="{y}" width="{W}" height="{H}" rx="3" fill="{bg}"/>'
                 f'<circle cx="18" cy="{y + 15}" r="9" fill="#F9FDF9"/>'
                 f'<text x="18" y="{y + 18.5}" style="font-family:Fraunces;font-weight:900;'
                 f'font-size:9.5px;fill:#1C4C2A" text-anchor="middle">{i + 1}</text>'
                 f'<text x="35" y="{y + 13}" class="l" style="fill:{ink}">{label}</text>'
                 f'<text x="35" y="{y + 25}" class="s" style="fill:{ink}">{sub}</text>')
    foot = len(ORDER) * PITCH + 13
    b.append(f'<text x="0" y="{foot}" class="t">The order most fee-only fiduciaries would '
             f'recognize. Work down it, not across it.</text>')
    h = foot + 9
    return (f'<svg width="{W}" height="{h}" viewBox="0 0 {W} {h}" '
            f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{ALT}">{defs}{"".join(b)}</svg>')


EDITS = [
    # ---------------------------------------------------------------- A1
    ('rep', 'Maya contributes 3%. Her employer matches up to 5%.',
     'Maya contributes 3%. Her employer matches up to 5%. Raising her contribution two points '
     'costs her about $117 a month in take-home and hands her roughly $1,900 a year in employer '
     'money she was previously refusing. It is the highest-return move in her entire file.'),

    # ---------------------------------------------------------------- A6
    # The old heading asserted ego depletion; the paragraph under it argues the
    # opposite, that the cost is the decision, not a drained battery.
    ('rep', 'Willpower is a battery, not a generator',
     'Decisions are expensive. Defaults are free.', 'h2'),

    # ---------------------------------------------------------------- A9
    ('rep', 'That distinction is not pedantry, and it is the one place the Second Edition',
     'That distinction is not pedantry. If savings is counted inside your living costs, your gap '
     'reads smaller than it is by exactly the amount you saved, and the central number in this '
     'book becomes a number that punishes you for saving.'),
    ('rep', 'Month 0 living costs, on the X1 definition',
     'Month 0 living costs, on the book&rsquo;s definition', 'h2'),
    ('drop', 'The four-bar income chart from the Second Edition'),

    # ---------------------------------------------------------------- A11
    # Chapter 12 does print the $70 Gumroad median, sourced to Gumroad, so this
    # entry contradicted the page it was defending.
    ('drop', 'The Gumroad median-earnings and zero-sales percentages.'),

    # ---------------------------------------------------------------- A12
    ('rep', 'The same survey that produces a $200 median also contains people earning many times it.',
     'The same survey that produces a $200 median also contains people earning many times it. In '
     'the next chapters you will meet some of them, by name, with the source that checked their '
     'numbers. A trademark attorney who sold a single filing service on Fiverr. A NASA engineer '
     'who sold a spreadsheet. An agency owner who wrote one newsletter. None of them is typical.'),

    # ---------------------------------------------------------------- A16
    # The section never explains the tips deduction, so the heading promised
    # something the page does not deliver.
    ('rep', '4 · The overtime and tips deductions, read carefully',
     '4 &middot; The overtime deduction, read carefully', 'h2'),

    # ---------------------------------------------------------------- A17
    # Appendix C holds three worksheets: the deficit check, the paycheck
    # calendar and the true-expense list. The scorecard lives in Chapter 18.
    ('rep', 'Four pages to write on.',
     'Three worksheets to write on. Every one of them is fillable in most PDF readers, and '
     'printable if you would rather use a pen.'),

    # ---------------------------------------------------------------- A18
    ('rep', 'A money book that will not show its sources is asking for trust it has not earned.',
     'A money book that will not show its sources is asking for trust it has not earned. Every '
     'figure below was read from its primary source, not from an article about it, between 22 and '
     '26 September 2026. Two are flagged because the 2026 version had not been published when '
     'this edition went to press, and both are load-bearing.'),

    # ---------------------------------------------------------------- D3
    # "started where you are" promised the reader these people began in their
    # position; the sentence now says only what is true of all of them.
    ('rep', 'None of them is typical, and this book will never pretend otherwise.',
     'None of them is typical, and this book will never pretend otherwise. But every one of them '
     'started employed, tired, with a few hours a week and almost no money to risk. The distance '
     'between the median and them is not luck alone. It is which field they were standing in when '
     'they started, and how long they stayed in it.'),
    # ---------------------------------------------------------------- A13
    # Chapter 12 is six engines; only Engine Zero raises the paycheck you have.
    ('rep', 'Cutting small purchases cannot close a structural deficit.',
     'Cutting small purchases cannot close a structural deficit. The arithmetic does not allow it. '
     'What can move is housing, transport, or the paycheck itself: a roommate, a move, a cheaper '
     'car, a shift differential, a certification your employer already pays for. Engine Zero, at '
     'the start of Chapter 12, is about raising the paycheck you already have, and for you it is '
     'the most important part of the book.'),

    # ---------------------------------------------------------------- A15
    # Question 1 minus question 2 minus question 3 has to be the gap, and the
    # book's gap is take-home minus living costs minus debt minimums.
    ('rep', '2 · What do you pay every month no matter what?',
     '2 &middot; What does a normal month cost you, apart from debt payments?'),

    # ---------------------------------------------------------------- A23
    # Appendix D leaves Maya's 7.4% auto loan at its minimum while the fund
    # fills, which is the book's own sequence; the rule needed its condition.
    ('rep', 'Then debt above roughly 7%.',
     'Then debt above roughly 7%, once the emergency fund is full: until it is, a surprise sends '
     'the balance straight back onto a card. Paying off a 24.9% card is a guaranteed, tax-free '
     '24.9% return. No investment on earth offers that with certainty.'),

    # ---------------------------------------------------------------- A22
    # The two cash rungs assume savings earn nothing after inflation, which is
    # why they look slow. Say so where the ladder is drawn.
    ('rep', 'Free from fear is six months of costs in the bank.',
     'Free from fear is six months of costs in the bank. This is where the 3 a.m. arithmetic '
     'stops. Marcus needs about $17,000. The two cash rungs below assume savings earn nothing '
     'after inflation, which is close to true for a checking account and roughly true for a '
     'high-yield account in a normal year.'),
]


def apply(html):
    html = apply_list(html, EDITS)

    # ------------------------------------------------------------ A8
    # Chapter 12 carried two DO THIS NOW boxes. Every other chapter has one.
    # The engine-picking box goes; the Engine Zero box, which is the chapter's
    # actual instruction, stays.
    i = html.index('Pick one engine and write it down')
    a = html.rindex('<div class="box act">', 0, i)
    b = html.index('</div>', html.index('</ol>', i)) + len('</div>')
    html = html[:a] + html[b:]
    if 'Pick one engine and write it down' in html:
        raise SystemExit('[A8] the Chapter 12 box did not come out cleanly')

    # ------------------------------------------------------------ A1/A2
    # the note goes at the end of Appendix D's take-home section, after Maya's
    # table and before the month-by-month run
    html = once(html, '<h2>Month 0 living costs, on the book&rsquo;s definition</h2>',
                TAX_NOTE + '<h2>Month 0 living costs, on the book&rsquo;s definition</h2>',
                'A1/A2 marginal-rate note')

    # ------------------------------------------------------------ A14
    i = html.index('Where each new dollar goes, in order')
    a = html.rindex('<svg', 0, i)
    b = html.index('</svg>', a) + len('</svg>')
    old = html[a:b]
    defs = old[old.index('<defs>'):old.index('</defs>') + len('</defs>')]
    html = html[:a] + investing_order(defs) + html[b:]

    # ------------------------------------------------------------ A9
    # The CAREFUL HERE box in Appendix D arguing with the Second Edition. The
    # correction it describes is already baked into the model's own numbers,
    # so the box only tells a new reader about a book they never read.
    i = html.index('The Second Edition of this book described')
    a = html.rindex('<div class="box', 0, i)
    b = html.index('</div>', i) + len('</div>')
    html = html[:a] + html[b:]
    if 'Second Edition' in html:
        raise SystemExit('[A9] "Second Edition" still in the book')

    # ------------------------------------------------------------ A4, A5
    # door d sends the reader to the chapter on killing debt in the right
    # order, which is Chapter 14, not 17
    # A5 first: it removes one of the two "Ch 17" strings, so A4's lookup is
    # then unambiguous.
    html = once(html, 'read Ch 17 before you pay', 'read the next section first', 'A5 medical debt row')
    html = once(html, 'Ch 17', 'Ch 14', 'A4 door d')
    return html
