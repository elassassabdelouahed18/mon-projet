# Tax review packet — *The Anti-Paycheck Trap*, revised third edition

For an Enrolled Agent or a CPA. Prepared 10 October 2026, against the 197-page
PDF in `docs/book/The-Anti-Paycheck-Trap.pdf`. Page numbers are that file's.

---

## What I am asking you to do

Read the tax material and tell me where it is **wrong, out of date, or likely
to be misread by a reader who is not a tax professional**. The book is written
for a US household earning between about $30,000 and $100,000, and it says of
itself that it is not a tax advisor. It still prints rates, limits, deadlines
and worked arithmetic, and those have to be right.

Three questions, in order of what matters:

1. **Is any statement wrong as law or as arithmetic?**
2. **Is any statement correct but stated in a way that will be misapplied?**
   The book's readers will act on it without checking.
3. **Is any figure stale for the 2026 tax year, or about to be?**

## What I am not asking

Do not rewrite the voice, shorten anything, or comment on the design. If a
passage is right, say nothing about it.

## Why an outside reader

Two errors in the first edition of this revision came from applying the wrong
rate to a change in income:

- **A1.** A shift differential was taxed at an average rate, not a marginal
  one, so the take-home gain was overstated.
- **A2.** FICA was applied to a traditional 401(k) deferral and income tax was
  not, which is backwards: a pre-tax deferral lowers federal and state taxable
  income and does not lower FICA.

Both passed a careful self-review and both were wrong. That is the reason for
this packet.

---

## What to read, and in what order

| | Pages | What is in it |
|---|---|---|
| **1** | **172–175** | **Appendix D, the model.** Read this first. Every persona figure in the book comes out of it, including the two marginal-rate tables. |
| **2** | **71–79** | **Chapter 9, "Your Paycheck Is Worth More Than It Says."** The benefits portal, the EITC, the Saver's Credit and the 2027 Saver's Match, the Child Tax Credit, the overtime deduction. |
| **3** | **147–152** | **Chapter 20, "The Investing System."** The account order, the 2026 contribution limits, the HSA, Roth versus traditional, self-employment tax, estimated payments and the safe harbour. |
| **4** | **166–169** | **Appendix B, variable pay.** Tax reserves on income with nothing withheld. |
| **5** | **182–188** | **Appendix G, the sources page.** Ninety-eight rows. Every external figure should be on it with a primary source. |
| **6** | **189–195** | **Appendix H**, for the two models the book builds itself. |

## The model's tax assumptions, which are mine and not a tax engine

`docs/book/src/model/financial-model.cjs` applies these marginal rates to any
**change** in income. They are the personas' rates, not a calculation:

| | Federal | FICA | State | Local | Total |
|---|---|---|---|---|---|
| **Marcus** · Columbus, Ohio · gross about $42,000 | 12% | 7.65% | 2.75% | 2.5% | **24.9%** |
| **Maya** · Charlotte, North Carolina · gross $95,000 | 22% | 7.65% | 3.99% | — | **33.64%** |

Two rules the model follows, which A1 and A2 exist to enforce:

- **Wages** — a raise, a differential, overtime — take all four taxes.
- **A pre-tax 401(k) deferral** lowers federal and state taxable income and
  **not** FICA, which is levied on gross wages.

Please check both the rates and the rule, and tell me where a reader in a
different state would be misled by seeing one household's numbers.

---

## Every tax statement in the book, by page

The list below is generated from the finished PDF, so it is complete rather
than curated. Where the book cites a source, Appendix G carries the row.

### Chapter 9 — pages 71 to 79

- p71 — the employer match is compensation declined if not captured.
- p73 — FSA and HSA money is bought at a discount equal to your tax rate; on a
  high-deductible plan the HSA money is yours for good.
- p73 — the EITC is refundable: you receive it even if you owe no federal tax.
- p73 — 2026 EITC maximums: $664 no children, $4,427 one, $7,316 two, $8,231
  three or more. **(Rev. Proc. 2025-32 §3.06)**
- p73 — 2026 health FSA limit $3,400; educational assistance exclusion $5,250.
  **(Rev. Proc. 2025-32; 26 U.S.C. §127)**
- p74 — VITA offers free in-person preparation for qualifying households.
- p74 — the IRS holds EITC refunds until at least mid-February.
- p74 — the Saver's Credit returns 50%, 20% or 10% of up to $2,000.
- p74 — Marcus grosses about $42,000; after the pre-tax health premium his AGI
  is roughly **$40,573**, which is **$323** above the limit. *This one is the
  book's own arithmetic and the place I would most like a second pair of eyes.*
- p75 — from tax year 2027 the Saver's Credit is replaced, for plan and IRA
  contributions, by the **Saver's Match**: 50% of contributions deposited into
  the account, at most $1,000 a person a year.
- p75 — the Match phase-out, single: full to $20,500, partial to $35,499, none
  at $35,500. Head of household $30,750 / $53,249 / $53,250. Joint $41,000 /
  $70,999 / $71,000. **(IRS, Saver's Match, verified 10 October 2026)**
- p75 — modified AGI adds pre-tax retirement contributions back in, so you
  cannot contribute your way under the line.
- p75 — both are claimed on Form 8880.
- p75 — the Child Tax Credit: both child and claimant need Social Security
  numbers.
- p76 — the overtime deduction applies only to the **premium portion** of
  overtime pay, and is a deduction, not a credit.
- p76 — Marcus: 120 overtime hours at $29.25, a $3,510 check, a **$1,170**
  premium half, about **$140** saved at his 12% federal bracket.
- p77 — the FSA line in the new chart: $2,000 of medical spending saves
  **$498 to $673**, at Marcus's 24.9% and Maya's 33.64%.

### Chapter 20 — pages 147 to 152

- p148 — paying off a 24.9% card is a guaranteed, tax-free 24.9% return.
- p148 — the HSA is the only account untaxed going in, growing, and coming out
  for medical costs.
- p148 — 2026: HSA $4,400 self-only, $8,750 family, on a plan with a deductible
  of at least $1,700 or $3,400; 401(k) deferral $24,500; IRA and Roth $7,500.
  **(IRS Notice 2025-67 and Rev. Proc. 2025-19)**
- p149 — Roth versus traditional on the rate-today-against-rate-later rule.
- p152 — net side earnings past $400 a year owe **15.3% on 92.35%** of them.
- p152 — estimated payments are due if you expect to owe $1,000 or more beyond
  withholding; **15 April, 15 June, 15 September 2026 and 15 January 2027**.
- p152 — the safe harbour: 100% of last year's tax, 110% above $150,000 AGI,
  or 90% of this year's. **(Form 1040-ES)**
- p152 — an employee with side income can file a new W-4 instead.
- p153 — Solo 401(k): an employer contribution of roughly 20% of net earnings
  on top of the deferral, within a 2026 overall limit of **$72,000**.
- p153 — the $24,500 deferral limit is **yours, not each plan's**.

### Appendix B — pages 166 to 169

- the 25 to 30% tax reserve on net side income, taken before the split.
- the quarterly due dates again, with the weekend and holiday rule.

### Appendix D — pages 172 to 175

- the two marginal-rate tables above, and Marcus's $42,003 gross to $33,231 net.

---

## What I would like back

A list, in any form, of:

1. the page, 2. what it says, 3. what is wrong or risky, 4. what it should say.

Please also tell me whether the **marginal-rate rule** as stated is sound for a
book that cannot know the reader's state, and whether the **$40,573 / $323**
arithmetic on page 74 holds.

**Your name will not appear anywhere without your written permission**, and I
will not describe the book as reviewed by a professional unless you say I may.

Questions: support@befreeacademy.site
