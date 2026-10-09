# BeFree style sheet

One wording per idea, used verbatim in the book, the guide, the install sheet
and both apps. When a sentence here appears in a product it appears exactly as
written. All three products are checked against this file before every release:

    python3 tools/check-stylesheet.py

Rule IDs are the review's (J1–J8). Add a rule here before you add a sentence to
a product, never after.

## J1 · The small version

> The small version keeps your run. It does not complete the day's record.

Both sentences, always together. The first is the promise Streak makes; the
second is the limit, and dropping it is how a habit tick starts being read as a
financial record. Streak may precede it with "Doing the small version still
counts. That's the point of it."

Never: "mark a day complete only after checking all of its purchases" — that
turns a habit into an audit and it is not what the tick means.

## J2 · Essentials as a share of take-home

> Essentials as a share of take-home. Past 60%, earning beats cutting.
> Past 85%, move a big cost or raise income.

Essentials are the categories tagged essential plus every debt minimum. They
are **not** the same as fixed costs: a gym membership is fixed and optional,
rent is fixed and not. The app computes the same number the same way
(`loadNote` in `gap/app.js`), so a reader who checks the book against their
own screen sees one figure and one verdict.

Thresholds: 60 and 85. Not 50/65/80, which was the old fixed-cost measure.

Worked, from Appendix D: Marcus's month 0 is $2,522 of essentials on $2,769
of take-home, 91%, "move a big cost or raise income". Maya's is $3,992 on
$5,647, 71%, "earning beats cutting".

## J3 · The rhythm

Chapter 17's table is the source. Every other place copies it verbatim.

| beat | time | what you do |
|---|---|---|
| Daily | seconds | log variable spends as they happen |
| The ten-minute Sunday review | 10 min | read safe-to-spend until next payday |
| Monthly | 15 min | read the gap against last month |
| Quarterly | 30 min | renegotiate one bill, sweep subscriptions |
| Annual | 60 min | review the year, set one goal |

The weekly beat is named "the ten-minute Sunday review" everywhere, including
Streak's habit, whose title is "Weekly money review" and whose time is 10
minutes. The monthly beat is 15 minutes everywhere — never 5.

## J4 · Closed and reviewed

**Closed** applies to a month. **Reviewed** applies to a day.

> a closed month · the months you have closed · once a closed month shows its pace

Never "a reviewed month", "complete months you have reviewed", "reviewed
months". A day is reviewed; a month is closed.

## J5 · The process framework

The eight phases of Appendix A, and nothing else. Every DO THIS NOW box carries
its phase tag. No product introduces a second framework of its own — not "the
four moves", not "ninety days, four phases".

| phase | name | clears when |
|---|---|---|
| 1 | Stabilize | one full pay period passes with no overdraft and no late fee |
| 2 | Map | the gap is positive for a full month and one savings transfer has cleared |
| 3 | Protect | Buffer Rung 1 is funded and nothing has gone on a card for 30 days |
| 4 | Build | it runs without you thinking about it |
| 5 | Scale | one engine has produced income in three separate months |
| 6 | Invest | one automatic investment has cleared and the fund is chosen |
| 7 | Walk | savings cover one full year of your costs |
| 8 | Cross | the portfolio earns more in a year than you put into it |

## J6 · Product names

> The Book · BeFree Gap · BeFree Streak

In running text: "BeFree Gap" and "BeFree Streak" on first use in a section,
"Gap" and "Streak" after. Installed names and `<title>` carry the full name.
On a cover: **THE BOOK · GAP · STREAK**.

The brand is **BeFree**, one word, capital B and capital F, never "Befree",
"BeFree Academy's Gap" or "the BeFree app".

## J7 · What Streak is for

> Streak keeps the logging alive.

Streak is part of the system, not a bonus. Never "optional", never "if you find
it useful", never "the financial system can also work with Gap and a calendar".
A habit tick still does not certify complete financial records — that limit is
J1's second sentence and it is stated as a fact, not as a hedge.

## J8 · Audience

> Regular paycheck first. Appendix B when your pay changes.

Appendix B's subtitle: "For everyone whose paycheck changes from one pay period
to the next." Marcus is hourly and he is the core reader, so the main text is
not written for salaried people with a variable-pay appendix bolted on.

Never "gig drivers" as the shorthand for the audience; "hourly workers".

## Glossary · the approved terms

Every term shown in any product is one of these, or is explained in one line
where it appears. Appendix E is the long form.

| term | means |
|---|---|
| gap | received income − living costs − required debt payments |
| gap rate | the gap divided by take-home pay |
| essentials | categories tagged essential, plus every debt minimum |
| safe to spend | what is left until the next payday, after what is already committed |
| buffer | the emergency cushion, in rungs |
| true-expense fund | money set aside monthly for a cost that does not arrive monthly |
| sinking fund | the same thing, where the app says it |
| tax reserve | money held back from side income against a tax bill |
| assigned | money that already has a job: savings, a fund, a reserve, extra debt |
| unassigned | the part of the gap that has no job yet |
| closed month | a month whose records you have finished and checked |
| reviewed day | a day whose spending you have finished and checked |

Never shown without explanation: "net assignments", "card purchase reserve",
"unassigned gap" as a bare phrase in a sentence a first-time reader meets.

## The shared numbers

| number | where it binds |
|---|---|
| 60% and 85% | the essentials-share thresholds (J2) |
| 10 minutes | the Sunday review (J3) |
| 15 minutes | the monthly reset (J3) |
| 30 / 60 minutes | quarterly and annual (J3) |
| about 7% | the rate above which debt beats investing, once the buffer is full |
| 25 times | annual spending, the freedom target |
| 5% | the real return the book models for a portfolio |
| 0% | the real return the book models for cash milestones |
| 25 to 30% | the tax reserve on side income |
