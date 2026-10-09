"""Revision edits, Chapter 19 to the back cover.

Persona figures come from model/financial-model.json (run model/financial-model.cjs
to regenerate it). The Chapter 21 milestone years are not typed here: they are
computed by model/freedom-milestones.py from that same file, so the table can
never drift from the model. Run it to see them:

    python3 model/freedom-milestones.py

Conventions it uses, which Appendix H states for the reader: year-end
contributions, 5% a year after inflation for the portfolio, 0% after inflation
for the two cash milestones, and a target of 25 times a year of living costs.
The crossover is where the portfolio's own growth first passes 20 times the
annual contribution, which at 5% is year 15 whatever the contribution is.

After errata A1 and A2 (the marginal-rate tax fix), Marcus clears his last
debt in month 35 and settles near $617 a month of gap, 19.7% of take-home.
"""
import importlib.util
import json
import os

from build import once
from ed import apply_list

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = json.load(open(os.path.join(HERE, 'model', 'financial-model.json'), encoding='utf-8'))


def _milestones():
    """model/freedom-milestones.py, loaded by path because of the hyphen."""
    path = os.path.join(HERE, 'model', 'freedom-milestones.py')
    spec = importlib.util.spec_from_file_location('freedom_milestones', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return {who: mod.milestones(who, MODEL) for who in ('Marcus', 'Maya')}


MILE = _milestones()


def usd(v):
    v = round(v)
    return ('&#8722;' if v < 0 else '') + '${:,}'.format(abs(v))


def month_table(name, months, hard, cards_label):
    rows = {r['month']: r for r in MODEL[name]['rows']}
    head = ('<thead><tr><th>Month</th><th class="num">Net in</th><th class="num">Living</th>'
            '<th class="num">Gap</th><th class="num">Buffer</th><th class="num">True-exp</th>'
            f'<th class="num">{cards_label}</th><th class="num">All debt</th></tr></thead>')
    body = ''
    for m in months:
        r = rows[m]
        label = f'{m} · hard month' if m == hard else str(m)
        cells = [r['income'], r['living'], r['gap'], r['buffer'], r['fund'], r['cards'], r['debt']]
        body += f'<tr><td>{label}</td>' + ''.join(f'<td class="num">{usd(c)}</td>' for c in cells) + '</tr>'
    return f'<table>{head}<tbody>{body}</tbody></table>'


def replace_table_after(html, heading, new_table):
    i = html.index(f'<h2>{heading}</h2>')
    a = html.index('<table>', i)
    b = html.index('</table>', a) + len('</table>')
    return html[:a] + new_table + html[b:]


EDITS = [
    # ---------------------------------------------------------------- chapter 19
    ('rep', 'Take your gap and divide it by your take-home pay.',
     'Take your gap and divide it by your take-home pay. That percentage is your <em>gap rate</em>, and it '
     'is the ceiling on your savings rate: the share you actually invest can match it, never beat it. '
     'Marcus ends month 24 at 9.6%. Maya, earning more than twice as much, ends at 9.3%.'),
    ('rep', 'Here is the part almost every book',
     'Here is the part almost every book about financial independence gets wrong. It presents one enormous '
     'number, years away, and calls that freedom. For a reader who was $103 short every month two years ago, '
     '$849,000 is not motivating. It is absurd.'),
    ('rep', 'Marcus’s figures, from the month-24 model',
     'Marcus&rsquo;s figures, from the month-24 model in <a href="#appD">Appendix D</a>: living costs of '
     '$2,829 a month, or about $33,950 a year. That is a cautious base, because it still carries his car '
     'payment and the last of his card minimums.'),
    ('rep', 'Free from fear is six months',
     '<strong>Free from fear</strong> is six months of costs in the bank. This is where the 3 a.m. '
     'arithmetic stops. Marcus needs about $17,000.'),
    ('rep', 'Free to walk is a full year',
     '<strong>Free to walk</strong> is a full year of costs saved. At this rung you can leave a job that is '
     'hurting you without a plan, which quietly changes how you are treated at the one you have. About '
     '$34,000 for Marcus, and the most underrated number in personal finance.'),
    ('rep', 'Half free is a portfolio',
     '<strong>Half free</strong> is a portfolio big enough to cover half your costs, around $424,000 in his '
     'case. Part-time work, or lower-paid work you actually like, becomes arithmetic rather than fantasy.'),
    ('rep', 'Free is the whole thing',
     '<strong>Free</strong> is the whole thing: about $849,000, at which point the paycheck is optional.'),
    ('rep', 'Gap shows both figures on the Overview screen',
     'In Gap, open <em>Insights</em> and, under <em>Your records</em>, choose <em>Financial independence '
     'estimate</em>. Give it your yearly spending, what you have invested and what you can invest each '
     'month. It returns the target and the years, and the same answer at 0, 2, 4 and 6% returns, so you '
     'can see how much the date leans on the market.'),

    # ---------------------------------------------------------------- chapter 20
    ('rep', 'Estimated payments.',
     '<strong>Estimated payments.</strong> If you expect to owe $1,000 or more beyond your withholding, the '
     'IRS wants it quarterly, due 15 April, 15 June and 15 September of 2026 and 15 January of 2027. You are '
     'safe from penalties if you pay 100% of last year&rsquo;s total tax (110% if last year&rsquo;s adjusted '
     'gross income was over $150,000), or 90% of this year&rsquo;s. There is an easier route for an employee '
     'with a side income: hand your employer a new W-4 and have more withheld from your paycheck. Same money, '
     'no quarterly calendar.'),

    # ---------------------------------------------------------------- chapter 21
    ('rep', 'Marcus’s month-24 gap of $608',
     'Any steady yearly amount, invested at 5% a year after inflation. The lines meet in year 15 whatever '
     'the amount. Worked in <a href="#appH">Appendix H</a>.'),
    ('rep', 'For Marcus, on the gap he has right now',
     'For Marcus, on the gap he has at month 24 and without ever increasing it, that happens in year 15. It '
     'would happen in year 15 for Maya too, and for you: at 5% the date depends on time, not on the size of '
     'the deposit. A bigger deposit buys a bigger pot by then, not an earlier day. From that year on, his '
     'portfolio contributes more to his freedom than he does, and it never asks him for a Saturday.'),
    ('rep', 'The defense is the one from Chapter Seven',
     'The defense is the one from Chapter Seven, unchanged: when income rises, first cover the tax and any '
     'real new need, then send at least half of what is left to the gap before anything else learns it '
     'exists. That single habit is what separates a rising savings rate from a rising standard of living, '
     'and the chart in Chapter 19 is entirely a chart of that habit.'),
    ('rep', 'Look at the last row and then look',
     'Look at the last row and then look at their salaries. Maya earns more than twice what Marcus earns and '
     'reaches freedom in the same year, because her costs are about twice his too. That is the whole book '
     'in one line, and it is the same line as Chapter One: the trap does not care what you earn.'),
    ('rep', 'Neither of those calendars is fixed.',
     'Neither of those calendars is fixed, and Marcus&rsquo;s is already moving. His month-24 costs still '
     'carry a car loan and the last of a card. Run the same model on and his last debt goes in month 35; the '
     'minimums leave his living costs, his gap settles near $617 a month, about 20% of take-home, and year 53 '
     'becomes about year 37 without him earning a dollar more. Every point he adds after that pulls it in '
     'again, and the compass in Chapter 11 is how he adds them. The number is not a prophecy. It is a '
     'speedometer.'),
    ('rep', 'Remember Maya, the nurse whose raises',
     'Remember Maya, the nurse whose raises kept vanishing. Remember Marcus, the warehouse worker who ended '
     'every month $103 short. Neither won a lottery or found a secret hustle. Each of them, at their own '
     'income, made their money visible, held their spending still while their income rose, and fed the '
     'difference into a gap that finally grew.'),

    # ---------------------------------------------------------------- appendix A
    ('rep', 'Open the app, add it to your home screen',
     'Install Gap and Streak from app.befreeacademy.site, and answer Gap&rsquo;s setup questions.'),
    ('rep', 'Enter your last 60 days, then list',
     'Enter or import your last 60 days, then list every non-monthly charge over $100 from the past 12 months.'),
    ('rep', 'Read your gap on Overview',
     'Read your gap on <em>Insights</em> and say the number out loud once.'),
    ('rep', 'Set one automatic transfer for the day after payday',
     'Set one automatic transfer for the day after payday, however small, as long as the bills before the '
     'next payday are covered.'),
    ('rep', 'Raise your retirement contribution to the full',
     'Raise your retirement contribution to the full employer match line, if your month can carry it and you '
     'have checked the vesting.'),
    ('rep', 'Point your gap at a Buffer goal',
     'Point your gap at a Buffer goal in <em>Money, Goals</em>, and give every dollar of it a job.'),
    ('rep', 'Finish Rung 1 of the buffer',
     'Finish Rung 1 of the buffer, and start a sinking fund for your true expenses at your 12-month total '
     'divided by twelve.'),
    ('rep', 'Enter every debt: name, total',
     'Enter every debt in <em>Money, Debts</em>: name, balance today, APR, minimum payment.'),
    ('rep', 'Set your split, net of costs',
     'Set the two marks on the split once, net of costs and tax reserve, and route your next income through it.'),
    ('rep', 'Open Streak, add one money habit',
     'Open Streak, add one money habit, and move your leftover &ldquo;later&rdquo; items onto its '
     '<em>Money to-dos</em>.'),
    ('rep', 'Route every new dollar through the split',
     'Route every new dollar through the split, and check that the gap rate moved.'),
    ('rep', 'Send at least half of every raise',
     'After tax and real needs, send at least half of every raise to the gap before your lifestyle meets it.'),

    # ---------------------------------------------------------------- appendix B
    ('rep', 'Your baseline week is your documented essentials',
     'Your baseline week is your <em>documented essentials</em> (rent, utilities, food, transport to work, '
     'insurance and minimum debt payments) for a month, times 12, divided by 52. In Gap, open '
     '<em>Settings, Pay schedule</em> and tick <em>My paycheck amount changes</em>; you can also give it the '
     'lowest paycheck you would plan around. From then on every forecast uses your lowest recent paycheck '
     'rather than the average, and an <em>Income that varies</em> panel appears on <em>Insights</em> with '
     'your baseline week.'),
    ('rep', 'Devin’s documented essentials come to',
     'Devin&rsquo;s documented essentials come to $2,150 a month. Times 12 and divided by 52, his weekly '
     'baseline is $496.'),
    ('rep', 'Some Mondays he clears $900',
     'Some Mondays he clears $900 in fares and tips. Some Mondays he clears $340. His weekly baseline is $496 '
     'either way. That is the whole point.'),
    ('rep', 'Once baseline savings holds one full month',
     'Once baseline savings holds one full month of baseline weeks (a month is four weekly transfers and a few '
     'days, so five is a safe round number, and it is also Rung 2 of the buffer ladder), you start sweeping. '
     'At the end of each month, whatever sits above that cushion moves, by hand, into your long-term '
     'high-yield savings account. That is your real gap. Some months nothing sweeps, and that is fine: the '
     'baseline account is doing its job by protecting the baseline week.'),
    ('rep', 'In Gap, tick My paycheck amount changes',
     'In Gap, open <em>Settings, Pay schedule</em> and tick <em>My paycheck amount changes</em>, then work out '
     'your baseline week from your own documented essentials. Everything else here waits on that number.'),

    # ---------------------------------------------------------------- appendix D
    ('rep', 'Both tables below are abridged',
     'Both tables below are abridged to the months that change something. The full twenty-four-month run, '
     'every entry of every month with the interest on every debt, is a runnable script that accompanies this '
     'book, so any row can be recomputed rather than trusted.'),
    ('rep', 'Month 1: overdraft coverage off',
     'Month 1: overdraft coverage off, gym and one subscription canceled, delivery apps deleted, two consoles '
     'sold, and two due dates moved: $180 a month out of his costs, which is what ends the shortfall. Month 6: '
     'the warehouse PDF starts paying $200 a month, less 10% costs and a 25% tax reserve settled each quarter. '
     'Month 7: a lead differential adds about $155 a month to his pay, and the $500 starter cushion is full. '
     'From then on a fifth of what is free goes to the car fund and the rest to the highest rate first. Month '
     '14: hospital financial assistance clears the $1,180 medical collection. Month 16: an alternator and two '
     'tires, $780, absorbed by the car fund and the buffer, with nothing on a card. Month 23: Card A is gone, '
     'having cost $1,620 in interest; Card B follows in month 26 and the car in month 35. At month 24 he still '
     'owes $668 on the cards and $6,554 in all, and he has no three-month emergency fund. The book says so '
     'rather than rounding the story up. Throughout, a fifth of each month&rsquo;s free money goes to a '
     'guilt-free share, counted in his living costs; without it the model is a fantasy.'),
    ('rep', 'Month 1: dining down $220',
     'Month 1: dining down $220, subscriptions down $80, shopping down $180. Month 3: she raises her 401(k) '
     'from 3% to 5% to capture the full match. Take-home falls $117 and she gains roughly $1,900 a year in '
     'employer money, which is why her pay line drops. Month 4: the $1,000 starter cushion is full. Month 6: '
     '$600 a month of side income starts, less costs and a 25% reserve. Month 9: a $1,450 emergency, absorbed '
     'by the car fund and the cushion, and the same month the card is paid off, after $337 of interest. Month '
     '12: the lease ends and she moves one step down, $255 a month cheaper. Her other debts sit below 12%, so '
     'they get their minimums and every spare dollar builds savings: $10,182 by month 24. Throughout, a fifth '
     'of each month&rsquo;s free money goes to a guilt-free share; without it the model is a fantasy.'),

    # ---------------------------------------------------------------- appendix E
    ('rep', 'Income minus living costs, where living costs',
     'Income minus living costs, where living costs are fixed bills plus variable spending <em>including</em> '
     'minimum debt payments, and <em>excluding</em> transfers and extra debt payments. Gap shows it on '
     '<em>Insights</em>, by month, in dollars or as a share of income. Widening it is the entire goal of this '
     'book.', 'dd'),
    ('rep', 'Gap minus Assigned.',
     'Gap minus Assigned. Aim for zero by choice, not by accident: an unassigned gap is money waiting to be '
     'spent by a tired person.', 'dd'),
    ('rep', 'Savings Contribution', 'Transfer', 'dt'),
    ('rep', 'What you move out of the gap into savings.',
     'Money moved between your own accounts: to savings, a goal, a sinking fund, the tax reserve, or a card '
     'payment. It is not spending and it does not belong in your living costs. In Gap it is its own kind of '
     'entry.', 'dd'),
    ('rep', 'Gap\'s tool for a known cost',
     'Gap&rsquo;s tool, in <em>Money, Goals</em>, for a known cost that does not arrive monthly: premiums, '
     'registration, tires, deductibles, December. Funded a little every payday, one twelfth a month for a '
     'yearly bill, they stop behaving like emergencies.', 'dd'),
    ('rep', 'For variable-income earners: documented',
     'For variable-income earners: a month of documented essentials, times 12, divided by 52. The amount moved '
     'into checking each week to smooth uneven income into a stable spending base.', 'dd'),
    ('rep', 'The portion of a 401(k)',
     'The portion of a 401(k) or 403(b) contribution your employer adds to yours. Free compensation once it '
     'vests, which you forfeit by not contributing enough to capture it.', 'dd'),
    ('rep', 'Your gap divided by your take-home pay.',
     'The share of take-home pay you actually save or invest. Your gap divided by take-home, the gap rate, is '
     'its ceiling. The one number that decides how many years you stay on the treadmill, and the only axis on '
     'the chart in Chapter 19.', 'dd'),
    ('rep', 'The year your investments earn more',
     'The year your investments earn more than you contribute. At 5% after inflation and a steady '
     'contribution, it comes in about year 15, whatever the amount. Named by Vicki Robin and Joe Dominguez in '
     '<em>Your Money or Your Life</em>, 1992.', 'dd'),

    # ---------------------------------------------------------------- appendix F
    ('rep', 'Before any other tool, BeFree Gap',
     'Before any other tool, BeFree Gap is the one this book runs on. It opens in any browser at '
     'app.befreeacademy.site, there is no account to create, and your numbers never leave your device. Learn '
     'its four places before adding anything else: <em>Today</em> for what is safe to spend and the next best '
     'step, <em>Plan</em> for the paychecks ahead and the bills each must cover, <em>Money</em> for every '
     'entry with your goals, sinking funds and debts, and <em>Insights</em> for your gap and where it goes. '
     'Then install Streak from the same page and pick one habit. One.'),
    ('rep', 'Your credit, free and without score damage.',
     '<strong>Your credit, free and without score damage.</strong> AnnualCreditReport.com for the actual '
     'reports from all three bureaus; it gives reports, not scores. Many card and bank apps show a score at no '
     'cost. Freeze your file at Equifax, Experian and TransUnion; it is free and it is the single best '
     'anti-fraud move available.'),

    # ---------------------------------------------------------------- appendix H
    ('rep', 'Marcus invests his month-24 gap',
     'Take any steady yearly amount, call it <em>C</em>, invested at 5% after inflation. The portfolio earns '
     'more than you add once 5% of the balance passes <em>C</em>, which means a balance of 20 times <em>C</em>. '
     'Adding <em>C</em> a year from zero reaches that in year 15, whatever <em>C</em> is, because the only '
     'question is when 1.05 raised to the years passes 2. Marcus&rsquo;s month-24 gap is about $3,835 a year, '
     'so he waits for $76,700; at $6,000 a year the balance is $120,000, and the year is the same.'),
    ('rep', 'The same arithmetic is two steps',
     'The same arithmetic is two steps for any reader. Divide what you invest in a year by 0.05 to get the '
     'balance you are waiting for; at 5% it arrives in about fifteen years, at 4% in about eighteen and at 6% '
     'in about twelve. The crossover is a date set by the return, not a fixed share of the road: at a low '
     'savings rate it comes long before freedom, and at a very high one, after it.'),

    # ---------------------------------------------------------------- about, back matter
    ('rep', 'The book you’re holding and the app beside it',
     'The book you&rsquo;re holding and the two apps beside it are that system, written down. BeFree Academy '
     'exists to hand it to everyone else still doing midnight math: warehouse workers and hospital '
     'administrators, gig drivers and second-shift parents. People earning real money and still wondering '
     'where all of it goes.'),
    ('rep', 'BeFree Gap, the app that runs this whole system',
     'BeFree Gap and BeFree Streak, the two apps that run this system, work in any browser on any phone or '
     'computer, with no app store and no account. Install both at app.befreeacademy.site.'),
    ('rep', 'If this book helped, the kindest thing',
     'If this book helped, the kindest thing you can do is use it. Open Gap tonight and log one thing.'),
]

OLD_CH21_TABLE = (
    '<tr><td>Savings rate at month 24</td><td>19.6%</td><td>12.8%</td></tr>'
    '<tr><td>Free from fear · six months</td><td>year 2</td><td>year 5</td></tr>'
    '<tr><td>Free to walk · one year of costs</td><td>year 4</td><td>year 9</td></tr>'
    '<tr><td>The crossover</td><td>year 14</td><td>year 18</td></tr>'
    '<tr><td>Free · 25 times spending</td><td>year 37</td><td>year 46</td></tr>')
M_, Y_ = MILE['Marcus'], MILE['Maya']
NEW_CH21_TABLE = ''.join(
    f'<tr><td>{a}</td><td class="num">{b}</td><td class="num">{c}</td></tr>' for a, b, c in (
        ('Gap rate at month 24', f"{M_['rate']:.1f}%", f"{Y_['rate']:.1f}%"),
        ('Free from fear · six months', f"year {M_['fear']}", f"year {Y_['fear']}"),
        ('Free to walk · one year of costs', f"year {M_['walk']}", f"year {Y_['walk']}"),
        ('The crossover', f"year {M_['crossover']}", f"year {Y_['crossover']}"),
        ('Free · 25 times spending', f"year {M_['free']}", f"year {Y_['free']}")))


def apply(html):
    html = apply_list(html, EDITS)
    html = once(html, 'the second-shift warehouse worker who ends every month $60 short of rent.',
                'the second-shift warehouse worker who ends every month $100 short.', 'ch12 audience example')
    html = once(html, OLD_CH21_TABLE, NEW_CH21_TABLE, 'ch21 table')
    html = once(html, '<th></th><th>Marcus</th><th>Maya</th>',
                '<th></th><th class="num">Marcus</th><th class="num">Maya</th>', 'ch21 table head')
    html = once(html, '<tr><td>Card</td><td>$2,400</td><td>24.9%</td><td>$60</td></tr>',
                '<tr><td>Card</td><td>$2,400</td><td>24.9%</td><td>$70</td></tr>', 'Maya card minimum')
    html = replace_table_after(html, 'Marcus, month by month',
                               month_table('Marcus', (0, 6, 12, 16, 24), 16, 'Cards'))
    html = replace_table_after(html, 'Maya, month by month',
                               month_table('Maya', (0, 6, 9, 12, 24), 9, 'Card'))
    return html
