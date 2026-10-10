"""G9 and G7 - the calendar's labels, and three charts the text was carrying
on its own.

G9 names every marker on the month strip with its day and puts the shortfall
zone's name inside the chart, beside the band it describes, so a reader does
not have to find a heading below the picture to learn what the shaded days
mean. The paydays fall on the 3rd, the 17th and the 31st, which is what the
strip already drew: every two weeks.
"""
import sys

CAL = [
 # marker labels carry their day
 ('<text x="0.0" y="23" class="lg" text-anchor="start">RENT DUE</text>',
  '<text x="0.0" y="23" class="lg" text-anchor="start">RENT &middot; 1ST</text>'),
 ('<text x="309.6" y="23" class="lg" text-anchor="end">CARD DUE</text>',
  '<text x="309.6" y="23" class="lg" text-anchor="end">CARD &middot; 29TH</text>'),
 ('<text x="5.3" y="86" class="l" text-anchor="start">PAYDAY</text>',
  '<text x="5.3" y="86" class="l" text-anchor="start">PAYDAY &middot; 3RD</text>'),
 ('<text x="176.2" y="86" class="l" text-anchor="middle">PAYDAY</text>',
  '<text x="176.2" y="86" class="l" text-anchor="middle">PAYDAY &middot; 17TH</text>'),
 ('<text x="325.7" y="86" class="l" text-anchor="end">PAYDAY</text>',
  '<text x="325.7" y="86" class="l" text-anchor="end">PAYDAY &middot; 31ST</text>'),
 # the shaded band says what it is, inside the chart, in the empty lower half
 # of the cells where nothing else is drawn
 ('<rect x="0" y="34" width="30.6" height="30" rx="1.6" fill="none" stroke="#A34E00" stroke-width="1.1"/>',
  '<rect x="0" y="34" width="30.6" height="30" rx="1.6" fill="none" stroke="#A34E00" stroke-width="1.1"/>'
  '<path d="M30.6 55 H34.2" stroke="#A34E00" stroke-width=".8"/>'
  '<text x="35.6" y="58" class="lr" style="font-size:6.6px;letter-spacing:.9px;fill:#6B3300">SHORTFALL</text>'),
]




# ── G7 ────────────────────────────────────────────────────────────────────
# Three paragraphs were carrying a chart's worth of comparison in prose. Each
# figure draws only what its paragraph already says, and each source line
# names where the numbers come from.

JOINT = '<svg width="331" height="140" viewBox="0 0 331 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Every $100 of a shared bill, split two ways. Fifty-fifty takes 1.4% of the $42,000 earner&#39;s month and 0.6% of the $95,000 earner&#39;s. Split in proportion to income, $31 and $69, it takes 0.9% of each of their months."><defs><style>\n.l{font-family:Poppins;font-weight:600;font-size:7.8px;letter-spacing:1.1px;fill:#1C4C2A}\n.lg{font-family:Poppins;font-weight:600;font-size:7.2px;letter-spacing:1px;fill:#603900}\n.lw{font-family:Poppins;font-weight:600;font-size:7.4px;letter-spacing:.6px;fill:#FBF6EE}\n.ax{font-family:Poppins;font-weight:500;font-size:7.4px;fill:#46412A}\n.s{font-family:Lora;font-size:8.2px;fill:#2E2910}\n.s2{font-family:Lora;font-size:7.8px;fill:#46412A}\n.n{font-family:"IBM Plex Mono";font-weight:600;font-size:8.6px;fill:#2E2910}\n.nw{font-family:"IBM Plex Mono";font-weight:600;font-size:8.6px;fill:#FBF6EE}\n</style></defs><text x="0" y="10" class="l">SPLITTING A SHARED BILL</text><text x="0" y="26" class="ax">FIFTY-FIFTY</text><rect x="0" y="31" width="164.5" height="19" rx="2.4" fill="#A34E00"/><rect x="166.5" y="31" width="164.5" height="19" rx="2.4" fill="#1C4C2A"/><text x="82.2" y="44" text-anchor="middle" class="nw">$50</text><text x="248.8" y="44" text-anchor="middle" class="nw">$50</text><text x="0" y="62" class="s2">1.4% of the $42,000 earner’s month</text><text x="331" y="62" text-anchor="end" class="s2">0.6% of the $95,000 earner’s month</text><text x="0" y="84" class="ax">IN PROPORTION TO INCOME</text><rect x="0" y="89" width="100.5" height="19" rx="2.4" fill="#A34E00"/><rect x="102.5" y="89" width="228.5" height="19" rx="2.4" fill="#1C4C2A"/><text x="50.2" y="102" text-anchor="middle" class="nw">$31</text><text x="216.7" y="102" text-anchor="middle" class="nw">$69</text><text x="165.5" y="120" text-anchor="middle" class="s2">0.9% of each of their months</text><text x="0" y="136" class="s">A fifty-fifty split costs the lower earner 2.3 times as much of their month.</text></svg>'
BENEFITS = '<svg width="331" height="146" viewBox="0 0 331 146" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four benefits on one tax return, drawn to scale against $8,231. The earned income credit runs from $664 to $8,231 by number of children, employer tuition assistance is $5,250, a 3% match on $50,000 is $1,500, and an FSA on $2,000 of medical spending saves $498 to $673."><defs><style>\n.l{font-family:Poppins;font-weight:600;font-size:7.8px;letter-spacing:1.1px;fill:#1C4C2A}\n.lg{font-family:Poppins;font-weight:600;font-size:7.2px;letter-spacing:1px;fill:#603900}\n.lw{font-family:Poppins;font-weight:600;font-size:7.4px;letter-spacing:.6px;fill:#FBF6EE}\n.ax{font-family:Poppins;font-weight:500;font-size:7.4px;fill:#46412A}\n.s{font-family:Lora;font-size:8.2px;fill:#2E2910}\n.s2{font-family:Lora;font-size:7.8px;fill:#46412A}\n.n{font-family:"IBM Plex Mono";font-weight:600;font-size:8.6px;fill:#2E2910}\n.nw{font-family:"IBM Plex Mono";font-weight:600;font-size:8.6px;fill:#FBF6EE}\n</style></defs><text x="0" y="10" class="l">WHAT ONE RETURN CAN BE WORTH</text><text x="0" y="28" class="ax">EITC YOU DID NOT CLAIM, BY NUMBER OF CHILDREN</text><rect x="0" y="32" width="331.0" height="12" rx="2" fill="#1C4C2A" opacity=".20"/><path d="M331.0 30 V46" stroke="#1C4C2A" stroke-width="1.2"/><rect x="0" y="32" width="26.7" height="12" rx="2" fill="#1C4C2A"/><text x="325.0" y="41.5" text-anchor="end" class="n">$664 to $8,231</text><text x="0" y="56" class="ax">TUITION YOUR EMPLOYER CAN PAY, TAX FREE</text><rect x="0" y="60" width="211.1" height="12" rx="2" fill="#1C4C2A"/><text x="205.1" y="69.5" text-anchor="end" class="nw">$5,250</text><text x="0" y="84" class="ax">A 3% MATCH ON $50,000, IF YOUR MONTH CAN CARRY IT</text><rect x="0" y="88" width="60.3" height="12" rx="2" fill="#1C4C2A"/><text x="66.3" y="97.5" class="n">$1,500</text><text x="0" y="112" class="ax">AN FSA ON $2,000 OF MEDICAL SPENDING</text><rect x="0" y="116" width="27.1" height="12" rx="2" fill="#1C4C2A" opacity=".20"/><path d="M27.1 114 V130" stroke="#1C4C2A" stroke-width="1.2"/><rect x="0" y="116" width="20.0" height="12" rx="2" fill="#1C4C2A"/><text x="33.1" y="125.5" class="n">$498 to $673</text><text x="0" y="142" class="s2">Solid is a fixed amount. The lighter band is a range, from its low end to its high.</text></svg>'
TAXDATES = '<svg width="331" height="130" viewBox="0 0 331 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A thirteen-month strip with the four estimated-tax due dates: 15 April for January to March, 15 June for April and May, 15 September for June to August, and 15 January 2027 for September to December. The periods are three, two, three and four months long."><defs><style>\n.l{font-family:Poppins;font-weight:600;font-size:7.8px;letter-spacing:1.1px;fill:#1C4C2A}\n.lg{font-family:Poppins;font-weight:600;font-size:7.2px;letter-spacing:1px;fill:#603900}\n.lw{font-family:Poppins;font-weight:600;font-size:7.4px;letter-spacing:.6px;fill:#FBF6EE}\n.ax{font-family:Poppins;font-weight:500;font-size:7.4px;fill:#46412A}\n.s{font-family:Lora;font-size:8.2px;fill:#2E2910}\n.s2{font-family:Lora;font-size:7.8px;fill:#46412A}\n.n{font-family:"IBM Plex Mono";font-weight:600;font-size:8.6px;fill:#2E2910}\n.nw{font-family:"IBM Plex Mono";font-weight:600;font-size:8.6px;fill:#FBF6EE}\n</style></defs><text x="0" y="10" class="l">FOUR DUE DATES, AND THEY ARE NOT QUARTERS</text><path d="M0 58 H331" stroke="#D5DFD6" stroke-width="1.4"/><rect x="0.0" y="52" width="73.4" height="12" rx="2" fill="#1C4C2A" opacity="0.10"/><text x="36.7" y="76" text-anchor="middle" class="s2">JAN–MAR</text><rect x="75.4" y="52" width="49.1" height="12" rx="2" fill="#1C4C2A" opacity="0.16"/><text x="100.0" y="76" text-anchor="middle" class="s2">APR–MAY</text><rect x="126.5" y="52" width="75.1" height="12" rx="2" fill="#1C4C2A" opacity="0.22"/><text x="164.1" y="76" text-anchor="middle" class="s2">JUN–AUG</text><rect x="203.6" y="52" width="100.2" height="12" rx="2" fill="#1C4C2A" opacity="0.28"/><text x="253.7" y="76" text-anchor="middle" class="s2">SEP–DEC</text><path d="M87.1 52 V34" stroke="#B7770A" stroke-width="1.2"/><circle cx="87.1" cy="31" r="2.6" fill="#B7770A"/><text x="83.1" y="24" text-anchor="start" class="lg">15 APR</text><path d="M138.3 52 V34" stroke="#B7770A" stroke-width="1.2"/><circle cx="138.3" cy="31" r="2.6" fill="#B7770A"/><text x="138.3" y="24" text-anchor="middle" class="lg">15 JUN</text><path d="M215.4 52 V34" stroke="#B7770A" stroke-width="1.2"/><circle cx="215.4" cy="31" r="2.6" fill="#B7770A"/><text x="215.4" y="24" text-anchor="middle" class="lg">15 SEP</text><path d="M317.6 52 V34" stroke="#B7770A" stroke-width="1.2"/><circle cx="317.6" cy="31" r="2.6" fill="#B7770A"/><text x="314.6" y="24" text-anchor="end" class="lg">15 JAN 2027</text><rect x="0" y="86" width="331" height="40" rx="2.4" fill="#E6F1E8"/><text x="9" y="100" class="lg">THE SAFE HARBOUR</text><text x="9" y="112" class="s">Pay 100% of last year’s tax, or 90% of this year’s.</text><text x="9" y="123" class="s">110% if last year’s AGI was over $150,000.</text></svg>'

NEW = [
 ('most common structural mistake in household finance.</p>',
  '<figure>' + JOINT +
  '<figcaption>Who really pays what, on every $100 of a shared bill</figcaption>'
  '<p class="srcline">The two incomes in this chapter, $42,000 and $95,000. Each share is read against '
  'that person&rsquo;s own gross month, $3,500 and $7,917.</p></figure>'),
 ('That is the trade.</p>',
  '<figure>' + BENEFITS +
  '<figcaption>Four forms, and what each one is worth in a year</figcaption>'
  '<p class="srcline">EITC range and the employer educational assistance limit from '
  '<a href="#appG">Appendix G</a>. The match is this chapter&rsquo;s 3% on $50,000. The FSA line is $2,000 '
  'at the marginal rates <a href="#appD">Appendix D</a> uses for Marcus, 24.9%, and Maya, 33.6%.</p></figure>'),
 ('Same money, no quarterly calendar.</p>',
  '<figure>' + TAXDATES +
  '<figcaption>The estimated-tax year, laid flat</figcaption>'
  '<p class="srcline">Due dates and the safe harbour: IRS Form 1040-ES, listed in '
  '<a href="#appG">Appendix G</a>. A date that falls on a weekend or a federal holiday moves to the next '
  'business day, which is the rule BeFree Gap applies when it shows you the next one.</p></figure>'),
]


def add_charts(html):
    for anchor, fig in NEW:
        if html.count(anchor) != 1:
            sys.exit(f'[charts] anchor not found once: {anchor[:60]!r}')
        html = html.replace(anchor, anchor + fig)
    print('charts: 3 new figures placed')
    return html


def apply(html):
    for old, new in CAL:
        if html.count(old) != 1:
            sys.exit(f'[calendar] expected 1 match: {old[:70]!r}')
        html = html.replace(old, new)
    print('calendar: 5 markers named, the shortfall band labelled in place')
    return add_charts(html)
