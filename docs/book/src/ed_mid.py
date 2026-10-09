"""Revision text: Chapters 12 to 18 and Appendix C.

Chapters 10, 11 and 12 keep their surveyed figures and documented cases;
they were checked and dated in September 2026 and the repair pass had
replaced them with unsourced 'illustrations' built from the same numbers.
"""

DEBT_TABLE_OLD = (
    '<table><thead><tr><th>Maya&rsquo;s $2,400 card at 24.9%</th><th>Card dies</th><th>Interest paid</th></tr>'
    '</thead><tbody><tr><td>Buffer and true-expense funds first, as this book sequences it</td><td>month 20</td>'
    '<td>about $780</td></tr><tr><td>Every spare dollar at the card first, buffer afterwards</td><td>month 11</td>'
    '<td>about $180</td></tr></tbody></table>')
# from the Appendix D model, run both ways (verification/alt-order.cjs)
DEBT_TABLE_NEW = (
    '<table><thead><tr><th>Maya&rsquo;s $2,400 card at 24.9%</th><th class="num">Card paid off</th>'
    '<th class="num">Card interest</th><th class="num">Back on the card if the $1,450 lands in month 3</th></tr></thead><tbody>'
    '<tr><td>Starter cushion first, as this book sequences it</td><td class="num">month 9</td><td class="num">$345</td><td class="num">$511</td></tr>'
    '<tr><td>Every spare dollar at the card first</td><td class="num">month 8</td><td class="num">$229</td><td class="num">$1,262</td></tr>'
    '</tbody></table>')

EDITS = [
    # ---------------------------------------------------------------- chapter 12
    ('rep', 'It shows up in month 7 as about $163 a month net.',
     'It shows up in month 7 as about $155 a month net. He routes all of it into the gap, because his '
     'lifestyle never learned the money existed. It is the single largest income change in his entire '
     'twenty-four months, and it did not cost him one evening.'),

    # ---------------------------------------------------------------- chapter 13
    ('rep', 'One: log it.',
     'One: log it. Tap +, open <em>More options</em>, choose Income and pick the source. Now it&rsquo;s '
     'real, and it&rsquo;s visible on Insights.'),
    ('rep', 'Two: route it.',
     'Two: route it. When you confirm a paycheck or log income, and you have a goal or a debt set up, Gap '
     'stops and asks the only question that matters: where is this going? A split sheet opens, one bar '
     'with two marks you drag and three rows beneath it, and nothing is moved until you decide. If today&rsquo;s '
     'balance or this cycle&rsquo;s bills haven&rsquo;t been checked, it asks for those first, because only '
     'the money left after them is yours to split. That interruption is the feature. Money that reaches '
     'your checking account undecided is money your lifestyle has already claimed.'),
    ('rep', 'One step comes before the split',
     'One step comes before the split, and skipping it is how a side-earner ends up with an April tax bill '
     'they have already spent. Side income arrives without withholding, so subtract before you split: the '
     'platform&rsquo;s cut and your costs first, then a tax reserve. A common rule of thumb is 25 to 30% of '
     'the remainder, adjusted once you see a real return. What is left is what the split applies to. In '
     'Gap the reserve is a transfer to a tax reserve, not an expense; the tax itself is recorded once, the '
     'day you pay it, so it is never counted twice.'),
    ('rep', 'Decide the split before the money comes,',
     'Decide the split before the money comes, while it&rsquo;s still easy to be generous with your future '
     'self. For money left once the bills before the next payday are covered, a sensible default is 50% to '
     'the gap, 25% to debt, 25% to you.'),
    ('rep', 'Drag the sliders once and the app remembers,',
     'Set the two marks once and the app remembers, with each share attached to a named destination: this '
     'much to the Buffer goal, this much to the store card. There is no perfect formula. There is only '
     'deciding one in advance, so the tired evening version of you never has to.'),
    ('rep', 'There is one more way to read that gap,',
     'There is one more way to read that gap, and it is the bridge to the last part of this book. Divide '
     'your gap by your take-home pay. That percentage is your gap rate. Marcus ends month 24 at 9.6%. '
     'Maya, on more than twice his income, ends at 9.3%, which should tell you everything about why this '
     'book was never about salary. Part of any gap pays down debt and fills reserves, so the share you '
     'actually invest, your savings rate, is the gap rate or less. It is the number Part Five runs on.'),
    ('rep', 'Gap shows you that percentage on the Overview screen',
     'Gap shows the gap rate on Insights: switch <em>Surplus by month</em> to <em>% of income</em>. Chapter '
     '19 turns a savings rate into a number of years, and the <em>Financial independence estimate</em> at '
     'the foot of Insights lets you test your own assumptions.'),
    ('rep', 'Marcus’s warehouse PDF starts producing',
     'Marcus&rsquo;s warehouse PDF starts producing about $200 a month by month six. He decides his split in '
     'advance: after costs and a 25% tax reserve, 40% to the gap, 40% to attacking the higher-interest card, '
     '20% to a small guilt-free reward.'),
    ('rep', 'On a $200 month that is $150 after reserve,',
     'On a $200 month that is $20 of costs and a $45 reserve, leaving $135: $54 to the gap, $54 to the card, '
     '$27 to him. None of it touches his lifestyle, because his lifestyle was set before the money existed.'),
    ('rep', 'Open the app and log your next piece of income,',
     'Open Gap and log your next piece of income, however small, recording costs and your tax reserve '
     'first. When the split sheet opens, drag the two marks and pick the goal and the debt each share feeds. '
     'You are setting the rule once: every deposit after this one arrives already knowing where it goes.'),
    ('rep', 'Then read your savings rate off the Overview screen and write it here:',
     'Then read your gap rate on Insights and write it here: <input type="text" name="sr_now" '
     'class="fld" style="width:22%" />. We come back to it in Part Five.'),

    # ---------------------------------------------------------------- chapter 14
    ('rep', 'If you carry medical debt, read this before you do anything with it.',
     'If you carry medical debt, read this before you do anything with it. Almost all hospital bills are '
     'negotiable. Call billing, ask for the self-pay discount, and ask for an itemized bill, because errors '
     'are common. Reductions of 20 to 60% for uninsured or underinsured patients are common when asked for '
     'by phone, though never guaranteed, so keep notes of every call.'),
    ('rep', 'Chapter 8 told you to build a starter buffer before attacking debt,',
     'Chapter 8 told you to build a starter buffer before attacking debt, and promised you the bill. Here '
     'it is, on one file, run both ways through the same model.'),
    ('rep', 'So the sequence in this book costs her roughly $600.',
     'Measured in interest alone, paying the card first wins, and it wins in every version of her file we '
     'ran. The cushion costs her about $115 and one month. What it buys is not cheaper interest. It is not '
     'needing the card on the day the shock lands: in her real file the repair comes in month 9, after her '
     'side income has started, and either order covers it in cash. Move the same $1,450 to month 3 and the '
     'card-first path puts $1,262 back on the card, against $511 for the cushion path. If your card might '
     'be cut or maxed when you need it, that difference is the whole point. If your income is steady and '
     'your emergencies are rare, the faster path is better. Pick with the numbers in front of you rather '
     'than with a rule you were handed.'),
    ('rep', 'You can’t attack what you can’t see.',
     'You can&rsquo;t attack what you can&rsquo;t see. Open Money, then Debts, and enter every non-medical '
     'debt you carry: name, original amount, balance today, interest rate, minimum payment. The last three '
     'sit on the statement your lender already sends you, so this is copying, not research. Ten minutes at '
     'the kitchen table, once.'),
    ('rep', 'The Debt Avalanche.',
     '<strong>The Debt Avalanche.</strong> Attack the highest interest rate first. Pay minimums on '
     'everything else. When it dies, roll its payment onto the next-highest rate. Tap <em>Highest rate '
     'first</em> and the app reorders your list by rate and marks the target.'),
    ('rep', 'The Debt Snowball. Attack the smallest balance first',
     '<strong>The Debt Snowball.</strong> Attack the smallest balance first, regardless of rate. Same rule '
     'on the rest. When it dies, roll its payment onto the next-smallest. Tap <em>Smallest first</em> for '
     'the same list, reordered by balance.'),
    ('rep', 'Choose Avalanche or Snowball,',
     'Choose <em>Highest rate first</em> or <em>Smallest first</em>, then drag the simulator slider to see '
     'what an extra $25, $50 or $100 a month would actually buy you.', 'li'),
    ('rep', 'On the Debts screen, enter every non-medical debt:',
     'In Money, Debts, enter every non-medical debt: name, balance today, APR, minimum. Copy the last three off '
     'your statements. Getting them all in one place is the work; the order follows from it.'),

    # ---------------------------------------------------------------- chapter 15
    ('rep', 'Your credit score sets the interest rate',
     'Your credit score sets the interest rate you pay on essentially every loan for the rest of your life, '
     'and over a lifetime the difference between a poor score and a strong one runs to tens of thousands of '
     'dollars in avoided interest. Check your reports free, without harming your score, at '
     'AnnualCreditReport.com; that site gives you the reports, not the score itself. Many card and bank apps '
     'now show a score at no charge; note which scoring model it uses.'),
    ('rep', 'Paying on time is the largest factor,',
     'Paying on time is the largest factor, and one 30-day late payment drops a score sharply. Utilization '
     'moves fastest: keeping reported balances under about 30% of your limits is a common rule of thumb, '
     'lower is better, and a limit increase lowers the ratio once the issuer reports it. If your score is '
     'low today, become an authorized user on a trusted family member&rsquo;s older, on-time card, open a '
     'secured card if you cannot qualify otherwise, and pay every bill early for six months.'),

    # ---------------------------------------------------------------- chapter 16
    ('rep', 'Illustrative, from the model in Appendix D.',
     'Illustrative, from the model in Appendix D, rounded to whole dollars. The model stops at month 24 and '
     'promises no date beyond it.'),
    ('rep', 'Maya is capturing every dollar of her employer match',
     'Maya is capturing every dollar of her employer match, on the same $95,000 that used to disappear '
     'without a trace. She has no card balance, $10,182 in her buffer and $2,295 in her true-expense funds. '
     'Her remaining debt is a car loan and a student loan, both cheap, both on schedule.'),
    ('rep', 'Marcus, whose relationship with money began',
     'Marcus, whose relationship with money began with a $25 automatic transfer he felt embarrassed about, '
     'is down to his last $320 of card debt, has a buffer that has already absorbed one $780 repair without '
     'a card, and a small digital product that pays him while he sleeps. He is not rich. He is not one bad '
     'Tuesday from disaster either, and two years ago he was.'),

    # ---------------------------------------------------------------- chapter 17
    ('rep', 'Notice what is missing from that list: catching up.',
     'Notice what is missing from that list: catching up on everything. You do not back-fill weeks of habit '
     'ticks, and you do not audit every lost day before you restart. Both are how a one-week lapse becomes a '
     'permanent one. Update today&rsquo;s balances and the bills still due, leave the missed weeks marked as '
     'not reviewed, and let the record start again today.'),
    ('rep', 'You open the app. You check that the month’s spending is logged.',
     'You open Gap. You check that the month&rsquo;s spending is logged. You read your one number, the gap, '
     'and the line under it that tells you how it moved against last month. You ask two questions: did it '
     'grow, and if not, which leak came back? Then you open Today, do the one thing in <em>Your next best '
     'step</em>, and put the phone down. Once a month has ended and every entry is in, close it from '
     '<em>Your records</em> at the foot of Insights; a closed month is what Gap&rsquo;s forecasts learn from.'),
    ('rep', 'Put the date in your calendar before you finish this chapter,',
     'Put the date in your calendar before you finish this chapter, or let Streak hold it. That is what the '
     'second app is for: a short list of money habits, each with a smaller version that still counts on a '
     'hard day, and a weekly review that asks three questions. Every &ldquo;later, if you have time&rdquo; '
     'item in this book belongs on its <em>Money to-dos</em> list, where you can put a yearly value beside '
     'it and watch what the small calls were actually worth.'),

    # ---------------------------------------------------------------- chapter 18
    ('rep', 'Install the app, log every variable spend,',
     'Install both apps, log every variable spend, import or enter your last sixty days, read your gap out '
     'loud once, opt out of overdraft coverage, and lay out your Paycheck Calendar. If you are in acute '
     'crisis, Phase 1 is the 48-hour chapter instead.'),
    ('rep', 'Open a high-yield savings account elsewhere,',
     'Open a high-yield savings account elsewhere, set one automatic transfer for the day after payday, '
     'apply friction to your top three leaks, make the three calls, raise your retirement contribution to '
     'the full match line if your month can carry it, and point your gap at a Buffer goal.'),

    # ---------------------------------------------------------------- appendix C
    ('rep', 'The five-metric scorecard lives in',
     'The five-metric scorecard lives in <a href="#ch18">Chapter 18</a>, with a column for today and one for '
     '90 days. Come back to it every quarter.'),
]


def apply(html):
    from ed import apply_list
    from build import once
    html = once(html, DEBT_TABLE_OLD, DEBT_TABLE_NEW, 'ch14 order table')
    return apply_list(html, EDITS)
