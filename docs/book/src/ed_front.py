"""Revision text: front matter to Chapter 9.

Principles, applied in every edit below:
  - The revised model (verification/financial-model.json) is the only source
    for Marcus and Maya. No other persona number survives.
  - Gap and Streak are described as they are now: two separate apps; Gap has
    Today, Plan, Money (ledger, goals, debts) and Insights; Streak does not
    read Gap.
  - Corrections the repair pass made for real reasons are kept, in the
    book's own voice and once, not as a hedge after every paragraph.
"""

EDITS = [
    # ---------------------------------------------------------------- how to use
    ('rep', '2 · Open the app before you read on', '2 · Install the apps before you read on', 'h3'),
    ('rep', 'This book has two companions',
     'This book has two companions: <strong>BeFree Gap</strong> and <strong>BeFree Streak</strong>, '
     'two separate apps that run in any browser on any phone or computer. Open app.befreeacademy.site '
     'and install both from that one page; each gets its own icon. There is no account to make, no '
     'password, and nothing to install from a store. Your numbers never leave your device.'),
    ('rep', 'The book is the why and the how.',
     'The book is the why and the how. <strong>Gap</strong> is the doing. It has four places, and you '
     'will meet each one as you read. <em>Today</em> shows what is safe to spend until payday, the bills '
     'coming up, and the single next thing worth doing, ranked by what is urgent, what it is worth over a '
     'year, and how hard it is. <em>Plan</em> lays out the paychecks ahead and the bills each one has to '
     'cover. <em>Money</em> holds every entry, your goals and your debts. <em>Insights</em> shows your gap '
     'and where the money goes.'),
    ('rep', 'Streak is the keeping-at-it.',
     'Streak is the keeping-at-it. It holds the handful of small money habits that make the system '
     'survive a bad month, and the one-off jobs you mean to get to. Each habit carries a smaller version '
     'for a hard day, and doing the small version counts. Streak does not read Gap: you tick your habits '
     'yourself, and a day you mark as no-spend ticks the logging habit for you.'),
    ('rep', 'One gate matters.',
     'One gate matters. Parts One to Four get you out of the trap, and Part Five takes you from there '
     'toward not needing the paycheck at all. Read Part Five whenever you like, but don&rsquo;t act on it '
     'until your gap has been positive for a full month and your starter buffer is funded. Buying index '
     'funds while the rent is short is a way of avoiding the rent.'),

    # ---------------------------------------------------------------- introduction
    ('rep', 'On paper, Marcus should be able to make it work.',
     'On paper, Marcus should be able to make it work. In practice his month runs $103 ahead of what '
     'lands, and the rent falls due two days before the paycheck that is meant to cover it.'),

    # ---------------------------------------------------------------- chapter 3
    ('rep', 'Illustrative proportions, typical of a U.S. renter household.',
     'Illustrative proportions, typical of a U.S. renter household. Your own shares come off Insights '
     'in Gap, not off this drawing.'),
    ('rep', 'When you first opened BeFree Gap it asked two questions:',
     'When you first opened BeFree Gap it asked two questions: what comes in, and what goes out no matter '
     'what. Those fixed bills are already saved as repeats, and each one waits under <em>Coming up</em> on '
     'its due date for you to confirm. You will never type rent again.'),
    ('rep', 'What’s left is the variable side',
     'What&rsquo;s left is the variable side, and that is where the leaks live. From today, log each one '
     'as it happens. Tap <em>Log a purchase</em>, type the amount, pick a category, done. Three taps, '
     'about eight seconds, standing in the checkout line.'),
    ('rep', 'If you want the full picture faster',
     'If you want the full picture faster, download your last sixty days from your bank as a CSV or '
     'OFX file and use <em>Import a bank file</em> in Money. Gap suggests a category for each line and '
     'skips anything you have already logged; you confirm before it is saved. Sixty, not thirty, because '
     'two pay cycles is the shortest window in which a pattern shows up at all.'),
    ('rep', 'Either way, open Overview when you',
     'Either way, open Insights when you&rsquo;re done. The app has already done the calculating.'),
    ('rep', 'The app doesn’t bury that third number in a table.',
     'The app doesn&rsquo;t bury that third number in a table. It draws it. Two bars sit at the top of '
     'Insights, money in above and money out below, and the space left over is your gap, marked out like a '
     'dimension on an engineering drawing.'),
    ('rep', 'One detail worth knowing, because you’ll use it constantly.',
     'One detail worth knowing, because you&rsquo;ll use it constantly. The gap always answers for the '
     'period you picked, so it tells you how one month went. Your running total, everything you have kept '
     'since you started, lives in Money, under <em>Goals</em>, in the chart called <em>Saved over time</em>.'),
    ('rep', 'Two different questions, two different numbers.',
     'Two different questions, two different numbers. <em>How did this month go?</em> is Insights. '
     '<em>How far have I come?</em> is Goals.'),
    ('rep', 'Now scroll to Where it goes',
     'Now scroll to <em>Where it goes</em>, and the five families snap into view. It is your leak honor '
     'roll, every category ranked biggest first with its share of your outflow beside it. The app hands '
     'you the ranking. Tap any line and it carries you to the ledger, filtered to that category, so you '
     'can see exactly which purchases built the number.'),
    ('rep', 'Subscription creep shows up in the same list',
     'Subscription creep shows up in the same list, sitting among your repeats. Fee and interest drag '
     'appears wherever you logged an overdraft, a late fee, or a card charge, and Money, Debts shows the '
     'balances generating them.'),
    ('rep', 'Read your gap on the Overview screen. Say the number out loud once.',
     'Read your gap on Insights. Say the number out loud once.', 'li'),

    # ---------------------------------------------------------------- chapter 5
    ('rep', 'One: pay yourself first.',
     'One: pay yourself first. The day income lands, an automatic transfer moves your savings into a '
     'separate account you don&rsquo;t spend from. Even a small amount, as long as the bills due before '
     'the next payday are still covered. The habit matters more than the size at first.'),
    ('rep', 'Three: let the rest be spendable.',
     'Three: let the rest be spendable. Whatever remains after those two moves, and after the groceries '
     'and gas the month needs, is yours to spend, guilt-free. You don&rsquo;t track every coffee or score '
     'yourself at the register. The system already protected the important money before you ever saw it.'),
    ('rep', 'That’s it. Twenty-five dollars.',
     'That&rsquo;s it. Twenty-five dollars. He tells no one. At the end of the '
     'first month, $62 has landed in the Ally account and stayed there: the two transfers, plus the few '
     'dollars the month left over. It&rsquo;s the first time in his adult life that he has ended a month '
     'with more money than he started it.'),
    ('rep', 'She opens an American Express Personal Savings account',
     'She opens an American Express Personal Savings account and sets an automatic transfer of $150 the '
     'day after each payday: about 6% of what actually arrives, which is what her trimmed month can carry '
     'today, not 10% of what the offer letter said. She will raise it as the leaks close.'),
    ('rep', 'Open the app and look at how it classifies money.',
     'Open Gap and log a transfer to savings. It is not filed with rent. It is a transfer to a goal, '
     'because it is not a cost of living: it is your gap being put to work.'),

    # ---------------------------------------------------------------- chapter 6
    ('rep', '1 · Three categories, and only three', '1 · Three kinds of entry, and one that moves money', 'h2'),
    ('rep', 'Every dollar that moves in your life becomes one of three things.',
     'Every dollar that moves through your life is one of three things, plus a fourth that only moves '
     'money around. That simplicity is the point.'),
    ('rep', 'Money in is income:',
     '<strong>Money in</strong> is income: paycheck, tips, freelance, side income. A refund is not income. '
     'It is money back on something you bought, so it lowers spending in that category.'),
    ('rep', 'Fixed stays roughly the same',
     '<strong>Fixed</strong> recurs and you have committed to it: rent, insurance, phone, subscriptions, '
     'debt minimums. Recurring, not constant: an electric bill that changes every month is still Fixed.'),
    ('rep', 'Your Savings Contribution is none of these.',
     '<strong>Transfers</strong> move money between your own places: savings, a goal, a sinking fund, a '
     'tax reserve, an extra debt payment. They are not spending; they are the gap being assigned. Log your '
     'savings as Fixed and you will be subtracting your own savings from your own gap every month. One more '
     'rule, and it saves a great deal of confusion: a card purchase is spending once, the day you buy. '
     'Paying the card later is a transfer, not a second purchase.'),
    ('rep', 'When you tap the plus button',
     'When you tap <em>Log a purchase</em> on Today, or the round + button anywhere, type the amount and '
     'pick a category; <em>More options</em> sets the type, the date and the payment source. If a category '
     'you need isn&rsquo;t there, tap + New and make it. Union dues, tips out, laundromat, storage unit: '
     'your life, your labels.'),
    ('rep', 'This is the move that makes the system survive contact with a hard week.',
     'This is the move that makes the system survive contact with a hard week. Every fixed cost becomes a '
     'repeat: an amount and a day of the month. When it falls due it waits under <em>Coming up</em> on '
     'Today, and you tap <em>Paid</em> once it has actually gone out, or <em>Skip</em> if it didn&rsquo;t. A '
     'scheduled bill is not a paid bill until you say so. You typed rent for the last time when you set it '
     'up. From here your main job is the variable side, and that is the side you can actually influence.'),
    ('rep', '3 · Read the Overview screen', '3 · Read the gap on Insights', 'h2'),
    ('rep', 'Two bars, and the measured space between them.',
     'Two bars, and the measured space between them. That space is your gap. It is not your checking '
     'balance; it is what the month kept, and it is the only number that decides your life.'),
    ('rep', 'Marcus is the case in point.',
     'Marcus is the case in point. His month runs $103 short, and that part needs the cuts in Chapter 7. '
     'But he also has rent due on the 1st and a paycheck that lands on the 3rd, with a card payment and a '
     'utility bill in the same seven days. That stretch is what he has been covering with overdraft fees '
     'for two years, and it is a separate problem with a separate fix. So lay one month out flat: every '
     'payday, every due date, in order.'),
    ('rep', 'Marcus makes two phone calls,',
     'Marcus makes two phone calls and moves one autopay, and the overdraft fees stop. The $103 still has '
     'to be closed, and Chapter 7 closes it, but he no longer pays a fee for the timing on top. Gap&rsquo;s '
     '<em>Plan</em> tab keeps this picture for you: each paycheck beside the bills due before the next one, '
     'and every due date and payday on one calendar.'),
    ('rep', 'Saving for nothing in particular rarely sticks.',
     'Saving for nothing in particular rarely sticks. Open Money, then Goals, and give your gap a '
     'destination: a buffer, a debt payoff, a moving deposit, a trip.'),
    ('rep', 'Each goal shows a progress ring',
     'Each goal shows a progress ring and something better than a ring: a date, worked out from what you '
     'have actually moved into that goal in the months you have closed. Not a guess and not a promise: '
     'your own arithmetic, done for you. If debt is part of your picture, Money, Debts is waiting; '
     'we&rsquo;ll use it properly in Part Four.'),
    ('rep', 'The last screen is the one most people never expect',
     'The screen most people never expect from a money tool is Today. Under <em>Safe to spend</em> and '
     '<em>Coming up</em>, <em>Your next best step</em> reads your own entries and writes one suggestion at a '
     'time: which debt is quietly costing you most, whether a minimum payment is failing to cover its own '
     'interest, how many days of essentials your buffer now covers, how much of your gap would finish a '
     'goal and when. It ranks them by what is urgent first, then by what each is worth over a year, then '
     'by how easy it is, and every item ends with a button that takes you to the screen where you act on '
     'it. A summary looks backward. This looks forward, and that is the difference between a mirror and a '
     'plan.'),
    ('rep', 'Start by saving 1% of your take-home income.',
     'Start by saving 1% of your take-home income. That&rsquo;s $4 out of $400. Feel silly about it if '
     'you want to. If even that would leave a bill unpaid this month, start at zero and close one leak '
     'first.'),
    ('rep', 'Right now the point is the muscle, not the amount.',
     'Right now the point is the muscle, not the amount. Once you have proven, on your own screen, that '
     'you can end a month with more money than you started, you double the number the following month, '
     'as long as the month can carry it.'),
    ('rep', 'Open the app and check that every fixed bill you pay is saved as a repeat',
     'Open Money and check that every fixed bill you pay is under <em>Paychecks and bills that repeat</em>, '
     'with the right day of the month.', 'li'),
    ('rep', 'Read your gap on the Overview screen, assign every dollar of it',
     'Read your gap on Insights, assign every dollar of it, and create one goal to point it at.', 'li'),

    # ---------------------------------------------------------------- chapter 7
    ('rep', 'Your app already ranked them for you.',
     'Your app already ranked them for you. Open <em>Where it goes</em> on Insights. It lists your '
     'spending biggest first. The top two or three lines are where your real money is going.'),
    ('rep', 'Then attack subscription creep directly.',
     'Then attack subscription creep directly. Open <em>Paychecks and bills that repeat</em> in Money, '
     'where every fixed charge you set up is listed in one place. Cancel what you forgot you had. Switch '
     'off what you rarely use.'),
    ('rep', 'The fix is simple. Whenever income increases',
     'The fix is simple. Whenever income increases, whether that&rsquo;s a raise, a bonus, a tax refund, '
     'or a new income stream from Part Three, first cover the tax on it and anything the household '
     'genuinely lacks. Then route at least half of what is left to your gap&rsquo;s jobs, savings and '
     'extra debt, before your lifestyle ever notices it existed.'),
    ('rep', 'Open Bills that repeat and cancel or pause at least one.',
     'Open <em>Paychecks and bills that repeat</em> and cancel or switch off at least one.', 'li'),

    # ---------------------------------------------------------------- chapter 8
    ('rep', 'The sequence is not free,',
     'The sequence is not free, and you should see the bill before you agree to it. While a 25% card sits '
     'unpaid, every dollar parked in a buffer costs you that card&rsquo;s interest. In Maya&rsquo;s file the '
     'starter cushion delays the card&rsquo;s last payment by one month and costs her about $115 in extra '
     'interest. That is the price of the insurance. Chapter 14 shows both paths side by side, so you choose '
     'with your eyes open.'),
    ('rep', 'There is a better way to read the number than in dollars.',
     'There is a better way to read the number than in dollars. Divide what you have saved by what one day '
     'of essentials costs, and you get days of cover: how long the household keeps running if income stops '
     'tomorrow. Gap shows the buffer this way on purpose. Nine hundred dollars is an abstraction. Eleven '
     'days is a fact you can feel, and it is the number that moves when you close a leak.'),
    ('rep', 'Gap has a tool built for exactly this.',
     'Gap has a tool built for exactly this. In Money, under Goals, add a <em>sinking fund</em> for each '
     'one: what it is, what it costs, when it next lands, and how often it repeats. Gap divides it across '
     'your paydays and holds that share back before the money ever shows as available, so the bill is '
     'already covered when it arrives. It is the least exciting instruction in this book and it is the '
     'one that most often decides whether the card balance ever reaches zero.'),
    ('rep', 'Open Goals and create one called Buffer.',
     'Open Money, then Goals, and create one called Buffer. Set your Rung 1 target, a number that feels '
     'ambitious but reachable in a few months; $500 to $1,500 is typical, and smaller is fine. Let your '
     'automatic transfer feed it every payday. Once you have recorded transfers and closed a full month, '
     'Gap puts a date on the goal from its own pace. That date moves earlier every time a closed leak '
     'actually reaches the goal, which is the most motivating number in the whole system.'),
    ('rep', 'Marcus sets his Rung 1 target at $500.',
     'Marcus sets his Rung 1 target at $500. At $25 a paycheck that would take about ten months, which is '
     'too slow for him. So he trims instead of waiting: the gym membership he hadn&rsquo;t used since '
     'March, a streaming plan, the delivery apps. Together they take $180 a month off his costs.'),
    ('rep', 'His first month’s contribution ends up being $259.',
     'That turns a month that ran $103 short into one that leaves about $62, and every dollar of it goes '
     'to the buffer. When his side income starts in month six, the last stretch goes fast: the $500 is '
     'there in month seven.'),
    ('rep', 'Eleven months later a car repair lands:',
     'Nine months later a car repair lands: an alternator and two tires, $780. The car fund and the buffer '
     'cover it between them. Nothing goes on a card, and the payoff never restarts. That month, not the '
     'month he hit $500, is the one where the system proves itself.'),
    ('rep', 'In Goals, create one named Buffer',
     'In Money, Goals, create one named Buffer and set a starter target you can realistically reach in a '
     'few months. The date appears once a closed month shows its pace.'),

    # ---------------------------------------------------------------- chapter 9
    ('rep', 'The only guaranteed 100% return in personal finance',
     'The closest thing to a 100% return in personal finance', 'figcaption'),
    ('rep', 'If cash is very tight, contribute at minimum enough',
     'Once necessities and minimum payments are covered, contribute at least enough to capture the full '
     'match. Above the match is a judgment call; below it, you are leaving pay on the table. Read the '
     'vesting schedule too: match you walk away from before it vests was never yours. The same applies to '
     '403(b) plans and the federal Thrift Savings Plan.'),
    ('rep', 'Log into your benefits portal today',
     'Log into your benefits portal today and, if your month can carry it, raise your retirement '
     'contribution to at least the full match line. Nothing else in this book comes as close to paying '
     '100% on the day you do it.'),
]


def apply(html):
    from ed import apply_list
    return apply_list(html, EDITS)
