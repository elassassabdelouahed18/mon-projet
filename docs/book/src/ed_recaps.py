"""Revision reading aids.

The chapter in 30 seconds: three lines set just before each chapter's "Do this
now", so a reader who skims, or comes back a month later, has the chapter in
the time it takes to read them.

In the app: a real screen from Gap or Streak beside the step that uses it. The
screens are the ones the Start Here booklet was shot from (docs/start-here/fig)
plus three taken for this book by shots.cjs, scaled down here for print.
"""
import os
import re

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BOOKLET = os.path.join(HERE, '..', '..', 'start-here', 'fig')

RECAPS = {
    'ch01': ['Most people stuck paycheck to paycheck are not short of income. They are short of a gap: '
             'the space between what comes in and what goes out.',
             'A raise without a gap is absorbed. Income rises, spending follows, and the month still ends at zero.',
             'Shame makes you look away, and you cannot fix what you will not look at. Set it down first.'],
    'ch02': ['Willpower fails on exactly the days you need it, so a plan that runs on it fails too.',
             'A system moves the decision to one calm moment in advance and makes the outcome automatic.',
             'Don&rsquo;t try to be more disciplined. Build something that needs less discipline.'],
    'ch03': ['Three numbers run your money: what comes in, what goes out, and the gap between them.',
             'Leaks come in five families. They are the money you can move fastest, not the biggest numbers on the page.',
             'Past about 60% of income on essentials, earning beats cutting. Past 85%, trimming is mostly theater.'],
    'ch04': ['An early belief drives a feeling, the feeling a habit, and the habit a result that seems to prove the belief.',
             'Where money lands in a household, two of these stories are running at once. Name both.',
             'You break the loop by catching it in the act and choosing the new belief on purpose.'],
    'ch05': ['Spend what is left after saving, never save what is left after spending.',
             'Savings live in a separate high-yield account at another bank. A little friction is the whole trick.',
             'The transfer leaves the day after payday, sized so the bills before the next payday stay covered.'],
    'ch06': ['Every entry is income, a fixed bill or variable spending. A transfer only moves your own money, and '
             'a refund is not income.',
             'The gap is what the month kept, not your checking balance. Read it on Insights.',
             'A month can be enough and a week still short. Put paydays and due dates on one line, and move one date.'],
    'ch07': ['Fix the two or three biggest leaks with friction, and leave the rest alone.',
             'An hour negotiating phone, internet and insurance is the best-paid hour in personal finance.',
             'When income rises, cover the tax and any real new need, then send at least half of the rest to the gap.'],
    'ch08': ['A starter buffer comes before the debt attack, because without it the next surprise goes back on a card.',
             'Build it in rungs. Your days of cover are your savings divided by what a day of essentials costs.',
             'Most emergencies are known bills that do not come monthly. Fund them a little every payday.'],
    'ch09': ['Your benefits portal hides real pay. Capture the full match if your month can carry it, and read the vesting.',
             'Check the EITC and the Child Tax Credit, and file free through VITA or IRS Free File.',
             'The Saver&rsquo;s Credit pays you for saving, up to $40,250 of income. Its 2027 replacement, '
             'the Saver&rsquo;s Match, stops at $35,500.',
             'The overtime deduction covers only the premium half of overtime pay, within income limits.'],
    'ch10': ['One paycheck is a single point of failure. Stack several small streams instead of swinging for one.',
             'The typical side hustle pays about $200 a month. The $885 average is pulled up by a few.',
             'The long tail is real too, which is why a stack is worth building patiently.'],
    'ch11': ['Engines are ranked by what they pay against what they cost a reader who already has a job.',
             'Pick the one that fits your skills, hours and money, and give it 90 days before you judge it.',
             'Set the test budget first: the hours you can give on a bad week, and money you could lose without pain.'],
    'ch12': ['Engine Zero comes first: differentials, certifications and postings at the job you already have.',
             'Services run with AI pay soonest for the least capital. Blogs and niche sites pay last.',
             'Never fund advertising with a credit card, and never let AI fake your face, your voice or your take.'],
    'ch13': ['Route the net, never the gross: take out costs and the tax reserve before anything is split.',
             'Decide the split before the money lands. A sensible default is half to the gap, a quarter to debt, '
             'a quarter to you.',
             'New income widens the gap instead of raising the spending. Your savings rate can match your gap rate, '
             'never beat it.'],
    'ch14': ['Sort before you attack, highest danger per dollar first. Medical debt is negotiable: never move it to a card.',
             'Pay every minimum, then send the whole surplus at one target. Highest rate first saves most; smallest '
             'first keeps you going.',
             'Check that your minimum is a minimum. At $120 a month, a $4,800 card at 26.9% takes 103 months.'],
    'ch15': ['Compare health plans on the out-of-pocket maximum, not the premium.',
             'If someone depends on your income, term life insurance is arithmetic, not a sales pitch.',
             'Freeze your credit at all three bureaus. It is free and it is the best anti-theft move there is.'],
    'ch16': ['With debt falling, grow the starter cushion into three to six months of essentials.',
             'Then put money to work, so it grows on its own over years.',
             'A hard month is a dip, not a collapse: both files end month 24 with a positive gap.'],
    'ch17': ['A slip is data, not a verdict. Aim for a fast comeback, not a perfect streak.',
             'When you stop, restart with the four steps in order, and nothing else.',
             'Fifteen minutes a month, thirty a quarter: the reset is what keeps the machine running.'],
    'ch18': ['Four phases, each opened by a condition, not a date: Stabilize, Map, Protect, Build.',
             'Score the five numbers today, and again in ninety days.',
             'It starts tomorrow with one logged expense.'],
    'ch19': ['Your salary sets your comfort. Your savings rate sets your calendar, and your gap rate is its ceiling.',
             'Twenty-five times a year of spending is the round target; 28 to 30 times if you stop early.',
             'Freedom arrives in rungs: out of the trap, free from fear, free to walk, half free, free.'],
    'ch20': ['Fill accounts in order: the match, debt above about 7%, the HSA, a Roth IRA, then the rest.',
             'Buy the whole market at the lowest cost, in one target-date fund or three funds, and stop.',
             'Crashes are normal. Automate the contribution and be an absent investor.'],
    'ch21': ['The crossover is the year your portfolio earns more than you add: year 15 at 5%, whatever the amount.',
             'Send at least half of every raise to the gap. That one habit is the whole freedom chart.',
             'The calendar is a speedometer. Marcus&rsquo;s year 52 becomes about year 37 once his debts end.'],
}

# (heading the panel goes before, image, source dir, crop fraction, label, text, where)
CALLOUTS = [
    ('Where each leak hides on your screen', 'after-first-p', 'gap-where-it-goes.png', 'shots', 1.0,
     'Where it goes',
     'Every category ranked biggest first, with its share of what you spent and a tag for essential or '
     'optional. Fixed and variable sit apart, and transfers are counted separately, because moving money '
     'isn&rsquo;t spending it.',
     'Gap &rsaquo; Insights &rsaquo; Where it goes'),
    ('2 · Let the fixed side enter itself', 'before', 'gap-log-sheet.png', 'booklet', 1.0,
     'Log a purchase',
     'Type the amount, tap the category, then <em>Add expense</em>. The categories you use most come first; '
     '<em>More options</em> holds the type, the date and a note.',
     'Gap &rsaquo; Today &rsaquo; Log a purchase'),
    ('5 · Point the gap at something real', 'before', 'gap-plan-cal.png', 'booklet', 0.70,
     'Bill calendar',
     'Paydays and bills on one month, so the shortfall zone shows before you are standing in it. It can also '
     'add the next twelve months to the calendar on your phone, with a reminder the day before each bill.',
     'Gap &rsaquo; Plan &rsaquo; Bill calendar'),
    ('Set a starting target, whichever reader you are', 'before', 'gap-next-step.png', 'booklet', 1.0,
     'Your next best step',
     'One suggestion at a time, written from your own entries and ranked by urgency, what it is worth in a '
     'year, and effort. Here it has found a store card whose payment does not cover its interest.',
     'Gap &rsaquo; Today'),
    ('Let the system do it', 'before', 'gap-funds.png', 'booklet', 1.0,
     'Sinking funds',
     'One fund for each known cost that does not come monthly. Each shows what it needs per paycheck to be '
     'ready on time, and <em>Pay from it</em> when the bill lands.',
     'Gap &rsaquo; Money &rsaquo; Goals &rsaquo; Sinking funds'),
    ('The number this is all moving', 'before', 'gap-split.png', 'booklet', 1.0,
     'The split',
     'Confirm income and Gap offers the split: what is available once the bills before the next payday are '
     'protected, and two marks to drag between a goal or fund, extra on a debt, and an unassigned choice. '
     'It remembers your split for next time.',
     'Gap &rsaquo; offered after you confirm income'),
    ('When the debt is bigger than the plan', 'before', 'gap-payoff.png', 'shots', 1.0,
     'Payoff simulator',
     'Choose <em>Highest rate first</em> or <em>Smallest first</em>, then drag the slider. On this sample '
     'file an extra $100 a month makes it debt free in a year and seven months and saves $533 of interest.',
     'Gap &rsaquo; Money &rsaquo; Debts'),
    ('The monthly reset', 'before', 'streak-today.png', 'booklet', 1.0,
     'Streak',
     'Each habit carries a smaller version for a hard day, and doing it counts. Streak keeps its own record: '
     'it does not read Gap, so you tick your habits yourself.',
     'Streak &rsaquo; Today'),
]


def print_image(name, src, crop):
    """A 520-pixel-wide JPEG of a screen: about 320 dpi at the panel's 118pt."""
    out = os.path.join(HERE, 'shots', os.path.splitext(name)[0] + '.jpg')
    path = os.path.join(HERE, 'shots', name) if src == 'shots' else os.path.join(BOOKLET, name)
    if os.path.exists(path) and (not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(path)):
        im = Image.open(path).convert('RGB')
        if crop < 1:
            im = im.crop((0, 0, im.width, int(im.height * crop)))
        im = im.resize((520, round(im.height * 520 / im.width)), Image.LANCZOS)
        im.save(out, 'JPEG', quality=86, optimize=True, progressive=False)
    if not os.path.exists(out):
        raise SystemExit(f'[in the app] missing screen {name}; run shots.cjs')
    return 'shots/' + os.path.basename(out)


def panel(img, label, text, where):
    return (f'<div class="inapp"><img src="{img}" alt="{label} in the app"/><div>'
            f'<p class="lab">In the app &middot; {label}</p><p>{text}</p><p class="where">{where}</p></div></div>')


def recap(items):
    lis = ''.join(f'<li>{s}</li>' for s in items)
    return f'<div class="recap"><p class="lab">The chapter in 30 seconds</p><ol>{lis}</ol></div>'


ACT = '<div class="box act"><p class="lab">Do this now</p>'


def apply(html):
    for heading, how, name, src, crop, label, text, where in CALLOUTS:
        tag = f'<h2>{heading}</h2>'
        if html.count(tag) != 1:
            raise SystemExit(f'[in the app] heading {heading!r} found {html.count(tag)} times')
        p = panel(print_image(name, src, crop), label, text, where)
        i = html.index(tag)
        if how == 'before':
            html = html[:i] + p + html[i:]
        else:
            j = html.index('</p>', i + len(tag)) + 4
            html = html[:j] + p + html[j:]

    starts = [(m.group(1), m.start()) for m in re.finditer(r'<h1 id="(ch\d\d)"', html)]
    end = html.index('<h1 id="appA"') if '<h1 id="appA"' in html else html.index('Appendix A</p>')
    for k in reversed(range(len(starts))):
        cid, a = starts[k]
        b = starts[k + 1][1] if k + 1 < len(starts) else end
        # before the chapter's closing action, or the first of a closing run of them
        last_h2 = html.rfind('<h2', a, b)
        i = html.find(ACT, max(a, last_h2), b)
        if i < 0:
            raise SystemExit(f'[recap] no "Do this now" in {cid}')
        html = html[:i] + recap(RECAPS[cid]) + html[i:]
    if len(starts) != len(RECAPS):
        raise SystemExit(f'[recap] {len(starts)} chapters, {len(RECAPS)} recaps')
    return html
