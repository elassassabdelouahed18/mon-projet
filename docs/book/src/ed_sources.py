"""Section D: corrections found by reading the primary sources, and the rows
that let a reader check them.

Every figure touched here was read from the source itself in October 2026, not
from an article about it, and the page as read is kept in sources/ at the
repository root with the URL it came from, the URL finally served, the HTTP
status and the date.

Three figures turned out to be wrong, and all three were the kind a reader
could act on.
"""
from build import once
from ed import apply_list

READ = '9 October 2026'

# Rows appended to Appendix G. (fact, value, source)
ROWS = [
    ('Saver&rsquo;s Match phase-out, by filing status, from tax year 2027',
     'single or married filing separately: full to $20,500, partial to $35,499, none at $35,500. '
     'Head of household: $30,750 / $53,249 / $53,250. Married filing jointly: $41,000 / $70,999 / $71,000',
     'IRS, <em>Saver&rsquo;s Match</em>. Verified 10 October 2026'),
    ('Months the Wage Growth Tracker put job switchers above job stayers',
     '325 of 356 months, January 1997 to September 2026',
     'Federal Reserve Bank of Atlanta, Wage Growth Tracker, <em>wage-growth-data.xlsx</em>, '
     'Job Switcher sheet. Counted from the file, 10 October 2026'),
    # Chapter 20's fund costs, read out of the funds' own SEC filings rather
    # than a brokerage page, because the brokerage pages are built by script and
    # a summary prospectus is the primary document.
    ('Fidelity Freedom Index 2060, Investor Class (FDKLX), annual cost',
     '0.12%, and no purchase minimum',
     'Summary prospectus, 30 May 2026 (SEC 497K, 0000880195-26-000445)'),
    ('Schwab Target 2060 Index Fund (SWYNX), annual cost',
     '0.08%, and no minimum initial investment',
     'Summary prospectus, 28 July 2025 (SEC 497K, 0001104659-25-070907)'),
    ('Fidelity ZERO Total Market Index (FZROX), annual cost',
     '0.00%',
     'Summary prospectus, 29 December 2025 (SEC 497K, 0000819118-25-000478)'),
    ('Vanguard Total Stock Market Index, Admiral (VTSAX), annual cost',
     '0.04%',
     'Summary prospectus, 28 April 2026 (SEC 497K, 0000036405-26-000214)'),
    ('2026 ACA out-of-pocket maximum, self-only',
     '$10,150 ($20,300 other than self-only)',
     'CMS, <em>2026 Payment Notice parameters guidance</em>, 8 October 2024'),
    ('2026 HDHP out-of-pocket maximum, self-only',
     '$8,500 ($17,000 family)',
     'IRS Rev. Proc. 2025-19, §2.01(2)'),
    ('2026 EITC, completed phase-out, single filer, no children',
     '$19,540',
     'IRS Rev. Proc. 2025-32, §3.06'),
    ('Same, one qualifying child',
     '$51,593',
     'IRS Rev. Proc. 2025-32, §3.06'),
    ('2026 EITC, maximum credit',
     '$664 with no children, $8,231 with three or more',
     'IRS Rev. Proc. 2025-32, §3.06'),
    ('2026 EITC investment-income limit',
     '$12,200',
     'IRS Rev. Proc. 2025-32, §3.06(2)'),
    ('Saver&rsquo;s Match, from tax year 2027',
     '50% of contributions, at most $1,000 a person; full match to MAGI $20,500 '
     'single, none at $35,500; replaces the Saver&rsquo;s Credit for plan and IRA '
     'contributions',
     'IRS, <em>Saver&rsquo;s Match</em>'),
    ('2026 Saver&rsquo;s Credit income limit',
     '$40,250 single, $60,375 head of household, $80,500 joint',
     'IRS, 2026 cost-of-living adjustments'),
    ('Derrick Morgan Jr., trademark filings on Fiverr',
     '$180 in month one, about $10,000 in month four; business on track for nearly '
     '$500,000 in 2025, paying him over $350,000',
     'CNBC Make It, Megan Sauer; documents not stated'),
    ('Emily Odio-Sutton, print-on-demand Etsy shop',
     'at least $236,000 in 2024 to 30 September, best month $54,900, about a third '
     'profit by her own estimate; about 10 hours a week',
     'CNBC Make It, Megan Sauer, 30 September 2024, from documents it reviewed'),
    ('Kelly Rocklein, user-generated content',
     'more than $142,000 of side-hustle revenue by 2022, on about 15 hours a week '
     'beside a six-figure marketing job',
     'CNBC Make It, Megan Sauer, 30 June 2025, from documents it reviewed'),
    ('Jenny Woo, Mind Brain Emotion card games on Amazon',
     '$1.71 million on Amazon in 2023, started with about $1,000 in 2018',
     'CNBC Make It, Megan Sauer, 21 March 2024, from documents it reviewed'),
    ('Medical debt owed in the United States',
     'at least $220 billion; 14 million adults owe over $1,000',
     'KFF, <em>The Burden of Medical Debt in the United States</em>'),
    ('First-line supervisor of transportation and material moving workers, '
     'Columbus OH, median',
     '$29.93 an hour, $62,260 a year',
     'BLS OEWS, May 2025, SOC 53-1047'),
    ('Laborers and freight, stock and material movers, Columbus OH, median',
     '$19.81 an hour, $41,200 a year',
     'BLS OEWS, May 2025, SOC 53-7062'),
    ('All occupations, Columbus OH, median',
     '$24.69 an hour, $51,340 a year',
     'BLS OEWS, May 2025'),
]


# ------------------------------------------------------------------ C3
# The credit that fits this audience best, written with the thresholds that
# decide who actually gets it. The Saver's Match is a real $1,000, and most
# readers of this book will not qualify for it; saying so is the point.
SAVER = (
    '<h2>3 &middot; The retirement credit almost nobody claims</h2>'

    '<p>There is a credit for the act of saving itself, and it is aimed squarely at people on '
    'this book&rsquo;s income. Put money into a 401(k), a 403(b) or an IRA, and the Saver&rsquo;s '
    'Credit gives you back 50%, 20% or 10% of up to $2,000 of it, depending on your adjusted '
    'gross income. For 2026 it runs out entirely at $40,250 for a single filer, $60,375 for a '
    'head of household and $80,500 for a couple filing jointly.</p>'

    '<p>Read that limit against your own number before you decide it is not for you. Marcus '
    'grosses about $42,000, and after the health premium that comes out of his pay before tax '
    'his adjusted gross income is roughly $40,573. He is <em>$323</em> over the line. One '
    'increase to his 401(k) &mdash; the move Chapter 9 already told him to make for the match '
    '&mdash; lowers his adjusted gross income below it and makes him eligible for a credit he '
    'is currently missing by the width of a rounding error.</p>'

    '<div class="box caut"><p class="lab">And what changes in 2027</p>'
    '<p>From tax year 2027 the Saver&rsquo;s Credit is replaced, for money put into a plan or an '
    'IRA, by the <strong>Saver&rsquo;s Match</strong>. Instead of reducing your tax bill, the '
    'federal government deposits 50% of what you contributed straight into your retirement '
    'account, up to $1,000 a person a year. You claim it on your 2027 return, filed in 2028.</p>'
    '<p>Now the part the headlines leave out. The Match phases out far lower than the credit it '
    'replaces: for a single filer the full 50% runs only to a modified adjusted gross income of '
    '$20,500, tapers to $35,499, and stops. Heads of household stop at $53,250, couples filing '
    'jointly at $71,000. And modified adjusted gross income <em>adds your pre-tax retirement '
    'contributions back in</em>, so you cannot contribute your way under the line.</p>'
    '<p>Which means Marcus, on $42,000, will not get it, and neither will Maya. If you earn less '
    'than they do, it is the single best return available to you anywhere in this book: a '
    'guaranteed 50% on money that stays yours. If you earn more, it is not for you, and no '
    'amount of wanting it changes the table.</p></div>'

    '<p>Either way, check the figure for the year you are filing. Both the credit and the match '
    'are adjusted for inflation, and both are claimed on Form 8880.</p>')


EDITS = [
    # ------------------------------------------------------------ D3
    # CNBC says the business "is on track to bring in nearly $500,000 this year".
    # That is a projection, and the book was printing it as money already earned.
    ('rep', 'The ceiling, documented. Derrick Morgan Jr.',
     'The ceiling, documented. Derrick Morgan Jr., a licensed trademark attorney, began selling '
     'one narrow service, '
     'trademark filings, on Fiverr in 2020 while working at a law firm. He made $180 in his '
     'first month and about $10,000 in his fourth. CNBC reported the business on track for '
     'nearly $500,000 a year, paying him more than $350,000. Eryn Andrews spent $200 on a '
     'microphone and a class in 2022 while employed at NASA, started selling voice-over work, '
     'and said her voice-over income passed her NASA salary in the summer of 2025.'),

    # ------------------------------------------------------------ D2
    # KFF puts medical debt at $220 billion and 14 million adults, which is
    # large but not a ranking, and no source ranks it first.
    ('rep', 'Medical costs are the single largest cause of financial catastrophe',
     'Medical costs are one of the largest causes of financial catastrophe in the United '
     'States &mdash; KFF counts at least $220 billion of medical debt, with 14 million adults '
     'owing more than $1,000 &mdash; and the mistake most people make is buying a plan on the '
     'premium alone. The number that matters is the out-of-pocket maximum: the most you can be '
     'made to pay in a year for in-network care. Add twelve premiums to it and you have the true '
     'worst case. Compare plans on that, and the cheap plan often stops looking cheap.'),

    ('rep', 'Billions of dollars in benefits go unclaimed every year',
     'Benefits go unclaimed every year in the United States on a scale most people would not '
     'believe, most of it by people who assume they would not qualify or who started an '
     'application once and gave up. The EITC alone reached about 23 million workers and $64 '
     'billion in the most recent year the IRS has published, and the IRS runs an awareness day '
     'every January precisely because so many who qualify never file for it.'),

    # "Most readers of this book are underpaid by their own employer's published
    # rules" is a claim about this book's readers that nothing can support.
    ('rep', 'What it is. Before you sell anything to anyone, look at the income you already have.',
     'What it is. Before you sell anything to anyone, look at the income you already have. Many '
     'workers have never asked about the differentials their employer already publishes. '
     'Differentials, certifications, internal postings, the band above the one you were hired '
     'into.'),

    # the 20-to-60% range traces to no publisher
    ('rep', 'If you carry medical debt, read this before you do anything with it.',
     'If you carry medical debt, read this before you do anything with it. Many hospital bills '
     'are negotiable. Call billing, ask for the self-pay discount, and ask for an itemized bill; '
     'reductions are common and they are rarely offered to people who do not ask.'),
]


def apply(html):
    html = apply_list(html, EDITS)

    # -------------------------------------------------- the three wrong figures
    # 2026 ACA cost-sharing cap is $10,150 self-only, not $10,600
    html = once(html, 'A PPO may reach $10,600.', 'A PPO may reach $10,150.', 'D1 ACA cap')
    # 2026 EITC completed phase-out with one child is $51,593
    html = once(html, 'the same filer phases out at $51,550',
                'the same filer phases out at $51,593', 'D1 EITC phase-out')
    # the 2026 credit runs $664 to $8,231
    html = once(html, 'An EITC you missed is $600 to $8,000.',
                'An EITC you missed is $664 to $8,231.', 'D1 EITC range')

    # -------------------------------------------------- "most" and "almost all"
    html = once(html, 'Most will change it on the first call', 'Many will change it on the first call',
                'D2 due-date calls')
    html = once(html, 'the largest pay increases most workers ever receive come from leaving',
                'the largest pay increases most workers ever receive come from leaving, which the '
                'Atlanta Fed&rsquo;s Wage Growth Tracker has shown for job switchers against stayers '
                'for most of the past decade', 'D2 job switchers')
    html = once(html, 'A working-age adult is far more likely to lose income to a disability than to die',
                'A working-age adult is more likely to lose income to a long illness or injury than '
                'to die during their working years', 'D2 disability')

    # -------------------------------------------------- C3
    html = once(html, '<h2>3 · If you have children</h2>',
                SAVER + '<h2>4 · If you have children</h2>', 'C3 saver credit')
    html = once(html, '<h2>4 &middot; The overtime deduction, read carefully</h2>',
                '<h2>5 &middot; The overtime deduction, read carefully</h2>', 'C3 renumber')
    # the chapter's own summary counts the sections
    html = html.replace('four places to look', 'five places to look')

    # the investing order names it too, where a reader is deciding where a
    # dollar goes
    html = once(html, 'Then the HSA, if you are on a high-deductible plan.',
                'If your income is low enough for the Saver&rsquo;s Credit, or from 2027 the '
                'Saver&rsquo;s Match, the match line is worth even more than it looks: see '
                'Chapter 9. Then the HSA, if you are on a high-deductible plan.',
                'C3 investing order')

    # -------------------------------------------------- the new Appendix G rows
    rows = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for a, b, c in ROWS)
    i = html.index('id="appG"')
    end = html.index('</tbody></table>', i)
    return html[:end] + rows + html[end:]
