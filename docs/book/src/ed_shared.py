"""The shared rules (section J): one wording per idea across all four products.

STYLESHEET.md at the repository root is the contract. Every sentence replaced
here appears there verbatim, and tools/check-stylesheet.py checks the book, the
guide and both apps against it before a release.
"""
from build import once
from ed import apply_list

# J1 — both sentences, always together
J1 = ('The small version keeps your run. It does not complete the day&rsquo;s record.')

EDITS = [
    # ---------------------------------------------------------------- J1
    ('rep', 'Streak is the keeping-at-it.',
     'Streak is the keeping-at-it. It holds the handful of small money habits that make the system '
     'survive a bad month, and the one-off jobs you mean to get to. Each habit carries a smaller '
     'version for a hard day. ' + J1 + ' Streak does not read Gap: you tick your habits yourself, '
     'and a day you mark as no-spend ticks the logging habit for you.'),
    ('rep', 'Put the date in your calendar before you finish this chapter',
     'Put the date in your calendar before you finish this chapter, or let Streak hold it. That is '
     'what the second app is for: a short list of money habits, each with a smaller version for a '
     'hard day. ' + J1 + ' Streak keeps the logging alive, which is the part of this system that '
     'dies first when a month gets loud.'),

    # ---------------------------------------------------------------- J2
    ('rep', 'Fixed costs as a share of take-home',
     'Essentials as a share of take-home', 'td'),

    # ---------------------------------------------------------------- J8
    # Appendix B is for anyone whose pay moves, which is a wider and plainer
    # description than a list of four job shapes.
    ('rep', 'For everyone paid by the hour, the shift, the tip, or the gig.',
     'For everyone whose paycheck changes from one pay period to the next. The system still works. '
     'It needs one modification.'),
    ('rep', 'The book you’re holding and the two apps beside it are that system',
     'The book you&rsquo;re holding and the two apps beside it are that system, written down. '
     'BeFree Academy exists to hand it to everyone else still doing midnight math: warehouse '
     'workers and hospital administrators, hourly workers and second-shift parents. People earning '
     'real money and still wondering where all of it goes.'),
]


def apply(html):
    html = apply_list(html, EDITS)

    # ------------------------------------------------------------ J3
    # Chapter 17's table is the source of the rhythm, so the weekly beat
    # carries the name every other product uses for it.
    html = once(html, '<text x="12" y="44" class="l">WEEKLY</text>',
                '<text x="12" y="44" class="l">SUNDAY</text>', 'J3 weekly beat')
    html = once(html, 'weekly ten minutes, monthly fifteen',
                'the ten-minute Sunday review, monthly fifteen', 'J3 alt text')
    return html
