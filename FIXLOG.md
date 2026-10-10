# FIXLOG — fix pass to 9.5

Working log for the review fix list. One entry per ID, appended as the work
lands. Baseline measurements were taken before any edit, on the build at
commit `d1d3bde`.

## 1. Pipeline map

### Book — *The Anti-Paycheck Trap*, 6×9, 189 pp, WeasyPrint 70

    docs/book/src/original.html     third-edition source as supplied — NEVER edited
    docs/book/src/sys.css           its stylesheet — NEVER edited
    docs/book/src/sys2.css          this revision's CSS layer
    docs/book/src/ed_*.py           every text/figure change, as named steps
    docs/book/src/ed.py             block finder: locates a <p>/<li>/<h2>… by the
                                    start of its visible text; 0 or 2 matches stops
                                    the build
    docs/book/src/build.py          once() — same rule for raw-string edits
    docs/book/src/model/            financial-model.cjs → financial-model.json
                                    widening-levers.py (Chapter 16 arithmetic)
    docs/book/src/shots.cjs         three Gap screens; the rest come from
                                    ../start-here/fig
    tools/brand-green.json          the green remap applied to the source figures

    build:  python3 docs/book/src/build.py        # book.html + PDF
            cp docs/book/src/The-Anti-Paycheck-Trap.pdf docs/book/

Module order in `build.py` is load-bearing: `ed_front, ed_mid, ed_end,
ed_figures, ed_recaps, ed_widen, ed_tables`. `ed_widen` edits recap list items,
so it must stay after `ed_recaps`. The contents page numbers are resolved in a
second render pass from `page.anchors`, so they can never be typed by hand.

### Guide — *Start Here: The BeFree System*, 6×9, 32 pp, Chrome/Skia

    docs/start-here/book.html       source
    docs/start-here/lora-local.css  fonts (currently the variable Lora → Type 3)
    docs/start-here/fig/*.png       21 app screens
    docs/start-here/shots.cjs       recaptures them from the live apps
    docs/start-here/render.cjs      writes the PDF, reports overflowing pages
    docs/start-here/finish.py       sets title/author/subject/keywords

    build:  serve befree-apps at :8124
            PW=$(npm root -g)/playwright node docs/start-here/shots.cjs
            PW=$(npm root -g)/playwright node docs/start-here/render.cjs
            python3 docs/start-here/finish.py

### Install sheet — *Install Gap and Streak*, US Letter, 1 p, Chrome/Skia

    docs/install-guide/guide.html   source
    docs/install-guide/render.cjs   writes the PDF
    docs/install-guide/qr.svg       → https://app.befreeacademy.site

### Apps — BeFree Gap, BeFree Streak

    befree-apps/gap/{index.html,app.js,extras.js,sw.js,manifest.webmanifest}
    befree-apps/streak/{…}
    befree-apps/finance-core.js     shared money maths (the model imports it)
    befree-apps/plus-core.js
    befree-apps/{index.html,install.css,install.js}  the install hub
    tools/sync-bundles.py           recomputes the CSP sha256 pins
    tools/build-install-pages.py    regenerates the per-app install pages
    tools/make-install-shots.cjs    re-shoots the two install screens
    verification/test-*.cjs         four suites

Each app pins its inline scripts by sha256 in a `Content-Security-Policy` meta
tag. **Any edit to inline script or style content invalidates those hashes and
the browser blocks the app.** `tools/sync-bundles.py` must run after every such
edit, and the cache name in `gap/sw.js`, `streak/sw.js` and `sw.js` must be
bumped, then offline re-tested.

## 2. Baseline, measured before any edit

| | book | guide | install sheet |
|---|---|---|---|
| pages | 189 | 32 | 1 |
| `/Lang` | en-US | **none** | **none** |
| bookmarks | 76 | **0** | 0 |
| tagged (`/MarkInfo`) | **no** | **no** | **no** |
| external links | 5 | **0** | **0** |
| internal links | 123 | 19 | 0 |
| Type 3 fonts | none | **Lora ×6** | **DejaVuSans** |
| fallback fonts | none | none | **LiberationSans, DejaVuSans** |

`pdftotext` on the book: `nancial` ×16, `speci c` ×8, `nd` ×10 — the ligature
damage in G2. On the guide: `Inst all`, `T he bo o k`, `G ap` — the Type 3
damage in H3.

Tooling present: WeasyPrint 70, Pillow, Node 22, Playwright/Chromium,
pypdf 6.19, PyMuPDF 1.28, pikepdf 10.16, poppler-utils (installed for this
pass). No `ebook-convert`; the EPUB in G1 is built directly.

## 3. Work log

### Section A — errata (first pass)

**A1, A2 — the arithmetic.** `model/financial-model.cjs` now carries an explicit
marginal-rate layer instead of two typed constants:

```
TAX = { Marcus: {federal .12, fica .0765, state .0275, local .025},   # Columbus, Ohio
        Maya:   {federal .22, fica .0765, state .0399, local 0} }     # North Carolina
netWages()      wages: everything applies
netOfDeferral() a traditional 401(k): income tax is saved, FICA is not
```

Those rates are Appendix D's own, from the take-home tables it already prints
(FICA 7.65%, Ohio 2.75%, Columbus municipal 2.5%, North Carolina 3.99% flat),
so the model and the appendix now agree by construction.

* Marcus: $1.25 × 1,976 h = $2,470/yr = $205.83/mo gross; 24.9% marginal →
  **$154.58**, printed $155 (was $180).
* Maya: 2% of $95,000 = $1,900/yr = $158.33/mo deferred; 22% + 3.99% comes
  back, FICA does not → take-home falls **$117.18**, printed $117 (was $146).
  *Accept: the month-0 vs month-3 net difference in Appendix D is $117.18.* ✓

A new CAREFUL HERE box in Appendix D states the rule and both workings, so a
reader can check it rather than trust it.

The Chapter 21 milestone table is no longer typed. `model/freedom-milestones.py`
computes it from `financial-model.json`; replayed against the *old* model it
reproduces exactly what the previous edition printed (Marcus 10.1% / fear 5 /
walk 9 / crossover 15 / free 52; Maya 9.0% / 6 / 11 / 15 / 54), which is the
check that the formula is the book's own. `ed_figures.py` likewise now reads
the model for the month-24 figure and the five-freedoms figure instead of
carrying typed numbers.

**One consequence worth naming.** The correction moves Marcus and Maya's gap
rates to 9.6% and 9.3% — close enough that every milestone row is now identical.
The Chapter 21 paragraph said Maya "reaches freedom two years after him"; it now
says "in the same year", which is a sharper version of the chapter's own point.

**A3.** The ten essential items in Appendix D sum to 2,522 (1,095 + 14 + 128 +
60 + 55 + 362 + 158 + 135 + 360 + 155), and 2,522 + the four non-essentials
(42 + 175 + 95 + 38 = 350) = 2,872, the printed month-0 total. 2,522/2,769 =
91.1%, so the chart marker and its alt text moved with the figure. ✓

**A14.** The investing-order chart is regenerated with six steps, the HSA third,
matching the text and the chapter summary. Same geometry, same palette.

**A4 A5 A6 A7 A9 A11 A12 A13 A15 A16 A17 A18 A20 A22 A23 — applied.**
New module `ed_errata.py`, run after `ed_widen` and before `ed_tables`.
A7 went into `ed_front.py` and A20 into `ed_recaps.py`, which own those blocks.

Checks on the built book: `Second Edition` 0 · `X1` 0 · `Figure 1.` 0 ·
`one-window` 0 (K4 passes for the book). DO THIS NOW boxes: 25 across the file,
and **exactly one in each of the 21 chapters** — the other four are in the front
matter and Appendix B (A8 accept ✓).

Pages: 189 → 188.

### BLOCKED — no outbound network for primary sources

`WebFetch` cannot resolve any external host from this container (irs.gov,
ncdor.gov, bls.gov, wikipedia.org all return `getaddrinfo ENOTFOUND`; `curl`
gets `CONNECT tunnel failed, response 403` from the proxy). `WebSearch` works,
but it returns search-result summaries, not the primary page, and ground rule 8
requires the primary source with its URL and the date it was read.

Blocked until the environment's network policy allows those hosts:
**C1** (BLS OEWS wage), **C3** (IRS Saver's Match), **C4** (BLS + Atlanta Fed),
**D1** (about 20 source rows), **D2** (8 softenings that need a citation),
**D4** (a documented hourly-worker case), **D5** (a replacement course),
**A19** (re-verifying the duplicated Appendix G dates).

### Section J — the shared rules

`STYLESHEET.md` at the repository root is now the contract: one wording per
idea, the glossary, and the shared numbers. `tools/check-stylesheet.py` checks
the book, the guide, the install sheet and both apps against it and exits 1 on
any failure, which is acceptance test K5. It currently reports **0 failures**.

**J1.** The two sentences always travel together: *"The small version keeps your
run. It does not complete the day's record."* Twice in the book (Chapter 6's
Streak paragraph and the Chapter 17 box), once in the guide, once in Streak
under *Smallest version for a hard day*, where it follows the existing "Doing
the small version still counts. That's the point of it."

**J2.** `loadNote()` in `gap/app.js` measured `T.f / T.i` — all fixed costs over
income — with thresholds 50/65/80. Fixed is not the same as essential: a gym
membership is fixed and optional, rent is fixed and not. It now sums the
categories tagged essential plus every debt minimum, over income, at 60/85,
with the book's verdicts. Checked against Appendix D: Marcus's month 0 is
$2,522 on $2,769 = **91%**, "move a big cost or raise income" — the same figure
and the same verdict the book's Chapter 3 gauge prints (J2 accept ✓). The
Chapter 18 scorecard row is renamed, and the guide's hedge is replaced by the
unified sentence.

**J3.** Chapter 17's table is the source. The weekly row is now SUNDAY, the alt
text says "the ten-minute Sunday review", and the guide's *First of the month ·
5 min* is **15 min**. Streak's habit keeps the short title "Weekly money
review" with its Sunday evening schedule and its ten minutes.

> One judgement call, flag it if you disagree: the review says Streak's habit
> "uses the same name and time". I read that as one rhythm, not one string —
> the beat is called *the ten-minute Sunday review* in prose, and the habit
> keeps a short title in a list of habits. Both are Sunday, both are ten
> minutes. Renaming the habit to the full phrase would make the habit list
> read badly.

**J4.** *Closed* is for months, *reviewed* is for days: 3 changes in the book,
6 in the guide, 2 in Gap.

**J6.** Checked by script: every product spells it **BeFree**, with no variants.

**J7.** Streak is part of the system. Gone: "It is optional; a habit tick…",
"Streak supports the habits if you find it useful; the financial system can also
work with Gap and a calendar", "One optional habit has a relevant, honest tick".
In their place: *"Streak keeps the logging alive."*

**J8.** Appendix B's subtitle is now "For everyone whose paycheck changes from
one pay period to the next", and the About page says "hourly workers" where it
said "gig drivers".

**Apps rebuilt properly:** `tools/sync-bundles.py` re-pinned the CSP hashes,
`gap/sw.js` and `streak/sw.js` went to v17, all four suites pass (20 + 11 + 17 +
14 = 62 tests), and both apps were loaded in Chromium to confirm the scripts
actually run: `scripts-ran=true, pageerrors=0, csp-blocks=0` for each.

### C1 / C4 — the BLS wage, read from the primary file

BLS serves a 403 to a browser user-agent and asks instead for one carrying a
contact address. `tools/fetch-source.py` now sends that, and the official
release file downloaded straight away:

    https://www.bls.gov/oes/special-requests/oesm25ma.zip
    member oesm25ma/MSA_M2025_dl.xlsx, OEWS May 2025, read 2026-10-09
    saved as sources/bls-oews-columbus-may2025.json

Columbus, OH metropolitan area, median annual wage:

| SOC | occupation | employment | hourly median | annual median |
|---|---|---|---|---|
| 53-1047 | First-Line Supervisors of Transportation and Material Moving Workers | 5,570 | $29.93 | $62,260 |
| 53-7062 | Laborers and Freight, Stock, and Material Movers, Hand | 25,800 | $19.81 | $41,200 |
| 53-7065 | Stockers and Order Fillers | 30,130 | $18.77 | $39,040 |
| 00-0000 | All occupations | 1,105,580 | $24.69 | $51,340 |

Two things fall out of this, and both are better than what the review assumed.

**Marcus is exactly at his occupation's local median.** $19.50 an hour against
a Columbus median of $19.81 for 53-7062. He is not underpaid and he is not
unlucky. That is the chapter's whole point made with a public number: the trap
is not his salary.

**The promotion is the largest number in his file.** $29.93 − $19.50 = $10.43
an hour, $20,610 a year gross on 1,976 hours, **about $15,478 net, $1,290 a
month** at his 24.9% marginal rate. His current gap is $299 a month. One
promotion is four times his entire gap, and it is the thing Engine Zero exists
to chase.

> I am going to write scenario 2 on the **median**, not the mean ($65,420).
> The mean is pulled up by trucking and rail supervisors inside the same SOC;
> the median is the honest figure for a warehouse shift lead, and the book's
> rule is to take the conservative end of a range.

### G5 / G6 / H6 — the covers

Both covers were generated by an image model, which tops out at 1024×1536, so
there is no higher-resolution original to re-export and regenerating would
produce a different picture. What the review asked for literally is not
available. What is available is better than an upscale alone.

`tools/cover-rebuild.py` does two things:

1. **Upscales the artwork** to 1800×2700 (Lanczos, then a light unsharp mask).
   This is interpolation, not a re-export, and it is stated as such. Synthetic
   leather grain survives it; letterforms would not, which is why of step 2.
2. **Throws the bottom line away and sets it again as real type** at the new
   resolution, in Poppins SemiBold through Chromium, so that line is genuinely
   300 ppi rather than enlarged pixels.

Clearing the old line: the leather behind it measures RGB 0.8/57.8/22.5 with a
standard deviation of about 2, so the band is rebuilt by cross-fading mirrored
strips of clean leather from immediately above and below it. No seam, and the
grain never repeats visibly.

Matching the ink: the book's foil averages RGB 207/177/118 over its glyphs, and
the rebuilt line averages 207/177/118 after the gradient was tuned to it. Cap
height 24 px in the source → 43 px at 1800 wide, against 42 expected. The old
line sat 8 px left of the page centre; the new one sits 4 px off, so it is if
anything better centred.

**G5 ✓** Both PDFs now carry an 1800×2700 cover: 300 ppi on a 6×9 page, read
back out of the finished files to confirm it.
**G6 ✓** Both read `THE BOOK · GAP · STREAK`.
**The book icon was not touched** (ground rule 4).

File sizes went the right way: the book 2.27 → 2.43 MB, and the guide **5.14 →
3.20 MB**, because its cover was embedded as a PNG and is now a JPEG.

**H6 — not done, and I would argue against it.** The guide cover already is a
cream hardcover with the same gold frame, the same wordmark and now the same
bottom line, so it already reads as the companion volume. Matching the book's
pebble grain exactly would mean regenerating the artwork, which would change
the design and lose the staircase illustration that carries the guide's whole
idea. Say the word and I will try it, but I think the pair is right as it is.

### Section D — three wrong figures, found by reading the sources

`tools/fetch-source.py` reads a page and keeps it in `sources/` with the URL
requested, the URL finally served, the HTTP status, which user-agent the site
accepted and the date. `tools/check-sources.py` is acceptance test K3: it pulls
every number out of the chapters and asks whether Appendix G, Appendix D or
Appendix H carries it.

That pass found three errors, and all three are the kind a reader could act on.

| | printed | correct | source |
|---|---|---|---|
| 2026 ACA out-of-pocket cap, self-only | $10,600 | **$10,150** | CMS, 2026 Payment Notice parameters |
| 2026 EITC phase-out, one child | $51,550 | **$51,593** | IRS Rev. Proc. 2025-32 §3.06 |
| 2026 EITC maximum credit | $600 to $8,000 | **$664 to $8,231** | IRS Rev. Proc. 2025-32 §3.06 |

Twelve rows were added to Appendix G (76 → 88), including the Columbus wages,
the KFF medical-debt figures, both HDHP caps and the full Saver's Match table.

**D2.** "Medical costs are the single largest cause of financial catastrophe"
became "one of the largest", with KFF's $220 billion and 14 million adults
attached. "Billions of dollars in benefits go unclaimed" now names the EITC's
own published reach. "Most readers of this book are underpaid by their own
employer's published rules" — a claim about this book's readers that nothing
can support — became "Many workers have never asked about the differentials
their employer already publishes." "Almost all hospital bills are negotiable"
→ "Many". "Most will change it on the first call" → "Many". The 20-to-60% range
traces to no publisher and is gone. The job-switching claim now carries the
Atlanta Fed's Wage Growth Tracker.

One softening I made larger than asked: SSA blocks this container, so rather
than cite what I could not read, "far more likely to lose income to a
disability than to die" became "more likely to lose income to a long illness
or injury than to die during their working years" — true without a ranking.

### C3 — the Saver's Credit, and the honest version of the Saver's Match

New section 3 in Chapter 9, and a line in the Chapter 20 order.

The review's brief was right about the mechanism and wrong about who gets it.
From the IRS's own page: from tax year 2027 the Saver's Match deposits 50% of
what you contribute into your retirement account, up to $1,000 a person. But
for a single filer the full match runs only to a modified adjusted gross income
of **$20,500**, tapers to $35,499 and stops — and MAGI **adds pre-tax
retirement contributions back in**, so you cannot contribute your way under the
line.

**Neither Marcus nor Maya qualifies.** Writing "the government will add up to
$1,000" to a $42,000 warehouse worker would have been exactly the kind of
financial promise this book exists to refuse, so the section says who it is for
and who it is not.

What it found instead is better for him. The 2026 Saver's Credit runs out at
$40,250 for a single filer. Marcus's adjusted gross income is about $40,573 —
**$323 over**. The 401(k) increase Chapter 9 already tells him to make lowers
his AGI under the line and earns him a credit he is currently missing by the
width of a rounding error.

Pages 188 → 190. Style-sheet check still 0 failures.

**Still open in D1:** the Chapter 12 case studies (Morgan, Odio-Sutton, Woo,
Steph Smith, Rocklein, Graham Stephan, the Gumroad 2020 count) and the
Chapter 20 fund fees (0.12%, 0.08%, 0.00–0.05%).

### D1 / D3 — the ceiling examples

The book names nine real people with real numbers in Chapter 12, and Appendix G
carried a row for **none of them**, while promising "if a figure is not on this
page, it is not in the book." That was the largest honesty gap in the file.

Four are now read at the primary source and rowed. Appendix G: 88 → 92.

| | what the source says | read |
|---|---|---|
| Derrick Morgan Jr. | $180 month one, ~$10,000 month four; **"on track to bring in nearly $500,000 this year"** | CNBC Make It, Megan Sauer |
| Emily Odio-Sutton | at least $236,000 in 2024 to 30 Sept, best month $54,900, "about a third … she estimates" | CNBC Make It, 30 Sep 2024, from documents it reviewed |
| Kelly Rocklein | more than $142,000 by 2022, ~15 h/week beside a six-figure marketing job | CNBC Make It, 30 Jun 2025, from documents it reviewed |
| Jenny Woo | $1.71 million on Amazon in 2023, started with ~$1,000 in 2018 | CNBC Make It, 21 Mar 2024, from documents it reviewed |

**One real correction.** The book said Morgan's business "now turns over roughly
$500,000 a year". CNBC says it "is **on track to** bring in nearly $500,000 this
year" — a projection, printed as money already earned. Fixed, and D3's missing
credential ("a licensed trademark attorney") went in with it.

Eryn Andrews's line now attributes the claim to her ("said her voice-over income
passed her NASA salary") rather than asserting it.

**BLOCKED — cnbc.com refuses this container (403 to every user-agent).** The NBC
local syndications of the same CNBC copy are readable, which is how the four
above were verified, but no syndication exists for these five:

| figure | where it would be checked |
|---|---|
| Eryn Andrews, $200 start, NASA salary passed summer 2025 | cnbc.com/2026/08/06/how-nasa-engineer-built-lucrative-voiceover-acting-side-hustle.html |
| Steph Smith, one ebook, more than $130,000 in about eight months | her own public sales page |
| Easlo, around $50,000 a month by 2023 from Notion templates | his own public statements |
| Graham Stephan, $5.1 million in 2020, about half advertising | his own public statements |
| Midwest Foodie, over $500,000 gross in 2024, one quarter at $206,000 on 3.28 m pageviews | the blog's own income report |
| Gumroad, 45,917 creators earning in 2020 | Gumroad's own post (the $70 median row exists; the creator count does not) |

**What I need from you:** open the five links in your browser as you did with
BLS and paste the relevant lines, or tell me to drop the figures. I will not
write an Appendix G row for a number I have not read.

The four self-reported ones (Smith, Easlo, Stephan, Midwest Foodie) deserve a
label either way: unlike the four above, no outlet reviewed their documents.
When they are verified I will mark them as self-reported in the text, which is
what separates them from the CNBC four.

### Chapter 20 fund fees — rewritten rather than sourced

Fidelity's and Schwab's fund pages build themselves in JavaScript, and Chromium
cannot reach the session proxy (`chrome-error://chromewebdata`), so 0.12% and
0.08% could not be read. D1 allows removing a figure instead, and here that is
the better book anyway: a 2026 expense ratio printed as fact is a number a 2028
reader would trust wrongly. Not yet rewritten — flagged for the next pass.

The fee *example* beside it is the book's own arithmetic and is exactly right:
$100,000 at 4% for 20 years, with the fee taken off the balance each year,
ends at $208,413 against $179,213 — the book prints $208,000, $179,000 and a
$29,000 difference.

### C1 — Model four, and the chart that carries it

`model/scenarios.py` computes it. Nothing in the section is typed by hand: the
2026 brackets and standard deduction come from IRS Rev. Proc. 2025-32 §3.01
Table 3 and §3.14, the supervisor's wage from the BLS OEWS May 2025 release
file, and the starting position from the persona model.

**The promotion, taxed properly.** Columbus median for SOC 53-1047 is $62,260;
Marcus grosses $42,003; the step is $20,257 a year. Federal 12%, FICA 7.65%,
Ohio 2.75% and Columbus 2.5% take $5,044 of it, which is **24.9%** — and here is
the detail that makes it checkable: after the raise his taxable income would be
$44,730, and the 12% bracket runs to $50,400, so the *whole* raise stays in one
bracket. The marginal rate on his last dollar is the rate errata A2 used on his
first. **About $1,268 a month** reaches his account.

| what he adds | free in |
|---|---|
| nothing he is not already doing | year 30 |
| a side service at $500 a month net, from year 2 | year 25 |
| the supervisor's job, from year 3 | year 23 |
| both | **year 20** |

*Accept: the reader sees a plausible 15–25-year path, not only a number above
30.* ✓ He is 28 when the book opens; the last row puts him at 51.

**The chart.** Four portfolio lines, each stopping where it crosses, with the
year marked on the line and repeated in the legend, captioned *Scenario, not a
prediction*. It sits after the two levers have landed, not before — putting it
earlier interrupted an argument still being made.

The four line colours are **staggered by lightness, not hue**, which is the
lesson from the earlier palette work: the book's red and mid-green collapse to
5.5 ΔE under deuteranopia, below the floor of 8. Restaggered at L 30/47/63/80 on
the brand's own hues, the worst pair is **16.0** under deuteranopia and 23.3 in
normal vision, against floors of 8 and 15.

Pages 190 → 192.

### C2, C4, C5 — the offense chapters

**C4.** A Chapter 12 chart of what each Engine Zero move adds in a year, built
from three sources rather than estimates: BLS OEWS May 2025 Columbus medians,
the Atlanta Fed's Wage Growth Tracker release file, and 26 U.S.C. §127.

| move | a year | from |
|---|---|---|
| Change employers | **$378** | switchers 4.4% against stayers 3.5%, applied to his $42,003 |
| Claim a differential | $2,470 | $1.25 an hour on 1,976 hours |
| Take the certification | $5,250 | the tuition-assistance exclusion |
| Move up one band inside the building | **$21,060** | supervisor $62,260 against material mover $41,200 |

The chart turned out sharper than the brief expected. The book's own best
source **contradicts** the sentence it was supporting: changing employers is
worth about $378 in the first year to this reader, and moving up one band
inside the same building is worth **fifty-six times that**. Which is the
chapter's argument — Engine Zero first — now carried by a public number instead
of an assertion. The caption is explicit that the last bar is a step and the
first is a rate.

I pulled the Atlanta Fed figures from their release file
(`sources/atlanta-fed-switchers.json`): job switchers have been above job
stayers in **325 of the 356 months** measured since 1997, which is the honest
form of the claim, and it now replaces the vaguer "for most of the past decade".

**C2.** Two sentences in Chapter 12 on why Marcus overruled the ranking, run
through the book's own four questions: a second shift leaves him no hours inside
a client's working day, and a product sells while he is on the floor. Plus where
his buyers came from (the warehouse forums he already read — audience before
product) and that his $200 is above the median, not below it.

**C5.** Half a sentence in Chapter 13: he runs nearer 40/40/20 than the 50/25/25
default because Card A charges 26.9%, which is a guaranteed 26.9% return.

**Two bugs of my own, repaired.** The D2 edit in the previous commit left "The
ceiling. Modest and certain." printed twice, and left "not staying" stranded
behind an inserted clause. Both fixed at the source of the edit rather than
patched downstream.

Pages 192 → 193.

### B1, B3, A24 — one spine

**B1.** `ed_spine.py` subordinates the book's seven frameworks to Appendix A's
eight phases, which are the only one with a gate condition on every step.

A new page sits straight after *How to Use This Book*, before the ten
questions, so the reader meets the road before being asked where they stand on
it. It carries the eight phases on a line, the five parts above them, and
underneath a list of what clears each phase and which chapters belong to it.
*Accept: a reader can answer "which phase am I in?" from one page.* ✓

The chapter-to-phase mapping was checked against Appendix A's own checklists
rather than taken on trust, and one gap turned up: **Phase 5 (Scale) had no
chapter in the review's table**, though its three actions — give the engine 90
days, raise the price on evidence, route every new dollar — are Chapter 12 and
13 material. Those two chapters now carry two tags, "4 · Build, into 5 · Scale".

Every DO THIS NOW box in all 21 chapters now carries its phase in the header:
**21 of 21**. The front-matter and Appendix B boxes carry none, which is right —
they belong to no chapter.

> A bug worth recording. My first tagging pass searched forward from each
> chapter's id for the next action box, so a chapter without one stole the next
> chapter's tag and every tag after it shifted. It reported 22 tags for 21
> chapters. It now walks the boxes in document order and asks which section
> each one sits in.

**B3.** The five chapters that run the system (3, 5, 6, 8, 14) carry a gold dot
in the contents, with a key above the list: *"The five chapters that run the
system. If you read nothing else, read these."* A dot with no key is decoration.

> A second bug: the dot was first inserted before `</a>`, which broke the
> contents regex in `build.py` — it matches `…<span class="n">N</span></a>` —
> and silently dropped five page numbers (34 entries to 29). The dot now goes
> before the page number instead. The entry count is how it was caught.

**A24.** The contents were missing *How to Use This Book* and *Find Your Own
Starting Line*, both of which the book sends readers to by name. Added, with
the new phase page between them.

> A measurement note for the acceptance tests: the book's labels carry
> `letter-spacing:.15em`, so `pdftotext` and PyMuPDF extract "DO THIS NOW" as
> "D O  T H I S  N O W". A search for the plain string returns zero and looks
> like a missing feature. Every text check in this pass strips whitespace first.

Pages 194 → 195.

### B2, B5 — the minimum, and a chart that stops repeating itself

**B2.** A `box forest` in Chapter 6, between "Let the fixed side enter itself"
and "Read the gap on Insights", which is after two of the three things it names
have been shown:

> One automatic transfer the day after payday. Every fixed bill entered once,
> as a repeat, so it enters itself from then on. One bank-file import a week
> and ten minutes on a Sunday to read it.
>
> That is the whole system. The seven-day audit in Chapter 3 is a measurement
> you take once, not a habit you keep. Log daily if it helps you; the gap does
> not depend on it.

71 words against the 80-word limit.

*Accept: nothing in book, guide or app says the system fails without daily
logging.* ✓ — checked by script across all three before writing the box: no
sentence pairs "daily", "every day" or "each day" with must, requires, fails,
only works, have to or breaks.

**B5.** Chapters 10 and 13 drew the same chart: the $885 mean against the $200
median. Chapter 13's copy is replaced by what that chapter is actually about —
where a side-income dollar goes before any of it is his:

```
$200 gross  −$20 costs  −$45 tax reserve  =  $135
                                   $54 card · $54 buffer and funds · $27 him
```

All five figures come from the model's own month-6 rule (10% costs, a 25%
reserve settled quarterly), so the chart cannot drift from Appendix D. Checked
after the build: the $885 figure now appears only in Chapter 10, where it
belongs, and in its Appendix G row.

**Chart count is unchanged**, which ground rule 3 requires: one chart replaced
by one chart, and the two added for C1 and C4 take the total up, never down.

### B4 — tighten without weakening

B4 is the only item in the list that deletes, so I measured before cutting
rather than after. The result is that the book is already tight: **two
sentences** came out of 195 pages, and the review's three named candidates did
not survive measurement.

**Deleted (both pure restatements of an app panel on the same page):**

| chapter | sentence |
|---|---|
| 3 | "The app hands you the ranking." |
| 6 | "Gap's *Plan* tab keeps this picture for you: each paycheck beside the bills due before the next one, and every due date and payday on one calendar." |

Each is immediately followed by the *In the app* panel that says the same thing
with its path and its reason attached.

**Kept, with the measurement that justified it:**

*Chapter 18's Phase 1–4 paragraphs.* The brief said they "repeat Appendix A word
for word". They do not. Measured as the share of their five-word runs that
appear verbatim in Appendix A: **0%, 24%, 14% and 6%**. They are compressions,
not repeats — and B4's own never-cut list covers "the instruction that tells the
reader what to tap to do it", which is exactly what they are. Chapter 18 is the
chapter whose job is to be the one-page plan; sending the reader 140 pages back
to Appendix A for the actions would gut it.

*The Chapter 6, 13 and 17 app boxes.* A script compared every sentence within
2,600 characters of each of the eight *In the app* panels against the panel's
own text. At a 45% shared-content-word threshold it found five candidates, and
on reading them four are instructions ("tap Log a purchase", "add a sinking
fund"), the routing formula, or a voice beat ("your leak honor roll"). Only one
was a bare feature announcement, and that is the Chapter 6 cut above.

*Chapter 3's "Where each leak hides on your screen".* The heading and its panel
stay; one sentence inside it was the cut above.

**The general test, which the brief did not ask for.** Rather than trust the
named candidates, I scanned the whole rendered book for near-duplicate sentences
within a page or its facing page: 35 pairs at 70% shared content words. Reading
them, **every one is prose against its own chart's labels, or prose against its
own recap card**. Both are deliberate structures — the chart condenses the
prose, the card recaps the chapter — and B4 forbids cutting charts. There is no
prose-against-prose duplication in this book worth deleting.

**Page count: 195**, reported for information only, as the brief asks. It went
up during this pass, not down: C1 added Model four and its chart, C3 added the
Saver's Credit section, C4 and B5 added charts, and B1 added the phase map.


### Section E — the guide and the install sheet

The guide is `docs/start-here/book.html`, 32 pages, rendered by Chromium.
`render.cjs` reports `over` as **free space left on the page** (`limit - maxB`);
a negative number means the page overflows. Baseline before these edits:
no page overflowed, tightest page was 8 with 20px to spare.

| ID | what changed | where |
|---|---|---|
| E1 | the migration note ("Coming from the older one-window version…", 323 chars) is gone | install sheet |
| E2 | step 05 now reads "Choose one useful habit."; the audit instruction is gone from both places | guide p.5, p.22 |
| E3 | one caution added to ONE RESPONSIBILITY on p.3, eight deleted across pp.3–25 | guide |
| E4 | "It is optional;" gone from the p.3 table; p.6 reads "One habit, honestly ticked" | guide |
| E5 | "The four moves" replaced by the eight phases of Appendix A, each with its gate | guide p.4 |
| E6 | the two variable-income pages merged into one half-page under REFERENCE, "If your pay changes", carrying the 1040-ES and mileage rows; the FOR TIPS, GIGS AND SHIFTS label removed; contents updated | guide pp.20–21 |
| E7 | the weekly beat is named "the ten-minute Sunday review" in the cost table too; the quarterly (30 min) and annual (60 min) beats, missing from the guide, added verbatim from J3 | guide p.5, p.30 |
| E8 | "Daily logging, monthly reconciliation and occasional corrections take additional time." deleted | guide p.26 |

**One regression, mine, and how it was closed.** The eight-phase table is taller
than the four-move table it replaced: page 4 went from fitting to 170px of
overflow. Two edits closed it, both deletions, no paraphrase:

1. the table states each gate once instead of twice (name · gate, one row);
2. the lede's third sentence, "A negative result is information, not a personal
   failing", was cut — the headline above it already says *not a character
   flaw*, and the box at the foot of the same page says *Nothing has gone
   wrong*. Three statements of one idea on one page; B4 allows the cut.

Page 4 now has **1px** of free space. That is a fit, and the renderer is
deterministic, but it leaves no room: any later edit to page 4 must be a
deletion, or the page needs a second column of the table moved off it.

After E: no page overflows, 32 pages, 3,197 KB, `check-stylesheet.py` 0 failures.

### Section F — the two apps

| ID | what changed | evidence |
|---|---|---|
| F1 | Today loads with exactly one suggestion. "After that, in order" is a collapsed card with a `Show 6` toggle, and the `6 more →` link on the first card expands it and scrolls to it. The card hides itself when there is no second suggestion. | Chromium, sample file: `#moves .move` = 1, `#moves2Wrap.hidden` = true, toggle reads "Show 6" |
| F2 | The gap footnote in Insights now reads, in plain words, "The month left $170. You gave $170 of it a job, so $0 still has none." and, when the month ran short, "You gave $120 a job, but the month only left −$17. The extra $137 came from earlier savings or a card." "Net assignments" is gone from the app. "Card purchase reserve" is now "Card purchases not yet paid" in all three places, and the two explanation sheets say "the cash set aside for card purchases you have not paid yet". The donut legend reads "Unassigned · no job yet", so the glossary term carries its definition where it appears. | the sentence above was read off the running app |
| F3 | `name` is "BeFree Gap" and "BeFree Streak"; `<title>` matches. `short_name` is **"BeFree Gap"** (10 characters, inside the ~12 an iPhone home screen shows) and **"Streak"**. "BeFree Streak" is 13 and would truncate, and Gap is the name that needs the brand in front of it, so the brand stays where it fits and is dropped where the product name is already unique. | `await page.title()` = BeFree Gap / BeFree Streak |
| F4 | One new setup question on the last screen: "Log as you go, or catch up once a week from your bank file?" The weekly answer stores `S.weekly`, which (a) raises a Sunday banner, "The ten-minute Sunday review · Catch up from your bank file, then read what is safe to spend until payday", whose button opens the bank-file importer, (b) makes the Money tab's control read "Import a bank file first", and (c) prints, under the question, "In Streak, start with Weekly money review" — the instruction instead of a data bridge. A Settings row turns it on and off later. In Streak, "Weekly money review" is now the first of the three suggested starting habits. | the banner was raised under a faked clock set to Sunday 11 Oct 2026; the settings row and the stored flag were read back |
| F5 | The sample file is Marcus, from Appendix D. See below. | the app's own screens, compared with the model |
| F6 | Under the gap number, when the month is young and a paycheck is still scheduled: "Early in the month: one paycheck is still on its way." | read off the running app on 10 October |

**F5 · the sample file, and what had to be decided.**
The tour used to run on an invented person with $1,712 of biweekly pay. It now
runs on Marcus. The month on screen is his **month 7**, in progress, where the
$154.58 lead differential starts; **last month is his month 6**, closed, where
the side income begins and the first quarterly estimate is paid. Read off the
running app, against `docs/book/src/model/financial-model.cjs`:

| what the app shows for last month | Appendix D, month 6 |
|---|---|
| $2,969 received | $2,969 |
| $1,912 fixed + $887 variable = $2,799 | $2,799.40 |
| surplus $170, all of it moved to savings, $0 unassigned | gap $169.60, assigned $169.60 |
| Buffer Rung 1 at $478 of $500 | buffer $477.60 |
| Card A $4,721 · Card B $1,344 · Auto $10,520 · Medical $1,180 | $4,721.31 · $1,344.25 · $10,520.14 · $1,180 |

Three decisions the model does not make for me, each recorded because a reader
comparing the book with the app will meet them:

1. **Pay frequency.** Appendix D models a month at a time and the book never
   states Marcus's pay frequency. Paid every two weeks, ten calendar months
   would show $2,556 and two would show $3,834, and no month would equal the
   printed row. He is therefore paid **on the 1st and the 15th**, which puts
   the whole $2,769 in every calendar month and makes the app's month-to-date
   figure the book's figure.
2. **Where the bills sit.** Appendix D gives one living-cost total, not due
   dates. With every bill in the first twelve days, Gap's own Plan tab showed
   the 1st-of-month paycheck $250 short every month — true of the shape, but it
   reads as a broken app. The bills are split across the two pay cycles, each
   just after a deposit, which is the advice the book itself gives; both cycles
   now clear ($292 and $765 left).
3. **The checking balance.** Appendix D models flows, not a bank balance, so
   there is no figure to copy. $810 is the sample, and it is the only number in
   the sample file that is not Appendix D's.

The category split is derived, not invented: essentials come to **$2,005** a
month (rent 950, utilities 165, phone 55, insurance 120, internet 60,
groceries 420, gas 155, health 80) and the optional categories to **$185.40**,
which together are Appendix D's $2,175 of living costs plus its $15.40 of
optional spending. Month 6 adds $27 of optional spending, $200 of side income,
$20 of materials and the $45 estimate, which is the printed row exactly.

**F3 · the trademark, which is not mine to decide.** "Gap" alone overlaps a
major apparel trademark. Get legal clearance before scaling the brand, and do
not treat the `short_name` choice above as that clearance.

Both apps were re-tested after `tools/sync-bundles.py`: service worker active,
offline reload renders, no page errors, `check-stylesheet.py` 0 failures.

### Section G — the book's design

| ID | what changed | evidence |
|---|---|---|
| G1 | **The phone edition.** `tools/make-epub.py` builds an EPUB 3 from the same `book.html` the PDF is rendered from, so the two can never drift: 48 reflowable documents, 43 navigation entries, every chart as live SVG, every box, every cross-reference, 1,396 KB. `tools/epub.css` restates the print design in relative units — nothing in points, nothing at a fixed width. | rendered every one of the 48 documents in Chromium at 390 × 844: **0 pages overflow**, body type 16px, charts 359px wide, no page errors |
| G2 | **The text layer.** `font-variant-ligatures:no-common-ligatures` on everything. | `pdftotext` over all 196 pages: `nancial` 0, `speci c` 0, `deycit` 0, `yve` 0, `rst` 0, and `financial` 20, `specific` 11, `deficit` 6, `five` 43, `first` 154. No U+FFFD or U+FFFE |
| G3 | **Tagged.** Rendered as `pdf/ua-1`, sRGB. Each chart's `aria-label` is copied into an SVG `<title>`, which is where WeasyPrint reads a figure's alternate text (`ed_alt.py`); the eight decorative marks are named too. | `/MarkInfo /Marked true`, `/StructTreeRoot`, `/Lang en-US`, `/ViewerPreferences /DisplayDocTitle true`, XMP `pdfuaid:part 1`, **80 of 80 Figure elements carry /Alt**, 245 of 245 link annotations carry /Contents, 0 Type 3 fonts, 10 embedded CID fonts, 191 bookmarks |
| G4 | **Everything clickable** (`ed_links.py`). 63 cross-references and 32 external addresses, up from five YouTube URLs. | the finished PDF carries **204 internal link annotations, every one with a destination**, and 36 external. A scan of the body text for anything of the shape `name.tld` outside an anchor returns **nothing** |
| G7 | **Three new charts**, in the existing style (`ed_charts.py`). Chapter 4: every $100 of a shared bill, split fifty-fifty and in proportion, with what each costs its payer as a share of their own month. Chapter 9: what one return can be worth, four benefits drawn to scale. Chapter 20: the estimated-tax year laid flat, with the four due dates and the safe harbour. | pages 41, 77 and 153 of the built PDF, each read back and looked at |
| G8 | **Illustrative is a tag, not a sentence.** One small chip in each chart's top right corner, on the twelve charts that carried the word; each source line keeps only what it says beyond the status; the two charts that also had the sentence drawn into the artwork lose it (`ed_captions.py`). | a contact sheet of all twelve tag positions was inspected: none covers chart content |
| G9 | **The calendar names its days.** RENT · 1ST, CARD · 29TH, PAYDAY · 3RD / 17TH / 31ST, and the shaded band carries the word SHORTFALL inside the strip, on a leader from the band. | page 56 |
| G10 | **Four typefaces, not five.** The Roman part numerals move from DM Serif Display to Fraunces. | `pdffonts` lists Fraunces, Lora, Poppins and IBM Plex Mono only — DM Serif Display is no longer embedded |
| G11 | **Running heads.** The chapter title in small Poppins, gold label ink, centred above every body page, `first-except` so it never appears on the page where the title is already set large. | pages 27, 29, 31, 120 read `THE TRAP ISN'T YOUR SALARY`, `WHY BUDGETS (AND WILLPOWER) ALWAYS FAIL`, `PROTECT THE MACHINE` |
| G12 | **Paper tone.** The guide moves from #FAFAF6 to the book's **#F9FDF9**. The install sheet keeps #FAF6EF, matching its web page, as asked. | `--bg` in `docs/start-here/book.html` |

**A bug the running heads uncovered, and how it was closed without moving a
line.** `string-set: head content(text)` concatenates the two halves of a
title that is split with `<br>`, so the first head printed
`THE TRAP ISN'TYOUR SALARY`. `ed_heads.py` puts one space before each break in
all 23 titles. A space at the end of a line is hung rather than set, so
nothing on the page moves: pages 25 and 27 were rendered before and after and
are **pixel for pixel identical below the top margin**.

**The palette, checked and kept.** The two new category colours are the book's
own deep green `#1C4C2A` and clay `#A34E00`. Run through the data-visualisation
validator against this paper: **CVD separation ΔE 9.0** (floor 8) and
**normal-vision ΔE 22.1** (floor 15) both pass, and so does contrast. It
reports the green as too dark and too low in chroma for its screen-dashboard
band — that is the book's brand ink, ground rule 5 says the palette stays, and
both segments are directly labelled, so nothing here depends on colour alone.

**What I could not run here.** PAC and the Acrobat accessibility check are
Windows tools and veraPDF needs a JVM this container does not have, so G3 is
verified structurally, rule by rule, rather than by a conformance report. The
list above is what a validator checks; run one before release.

**One thing for you.** `befreeacademy.site` answers 200 but redirects to
`/password` — the storefront is still password-protected. Every link in the
book to it will land a reader on that page until you lift it.

**External addresses, checked on 10 October 2026.** 200: app.befreeacademy.site,
befreeacademy.site, nfcc.org, irs.gov, irs.gov/vita, irs.gov/freefile,
napfa.org, healthcare.gov, fdic.gov, banks.data.fdic.gov/bankfind-suite,
usa.gov/benefit-finder, annualcreditreport.com, investor.gov. 403 to this
datacentre address, live for a reader: bogleheads.org. Not reachable through
this proxy at all: benefitfinder.gov — the book's own Appendix G cites it, and
the link points at the USA.gov benefit finder, which the review names and which
answers 200.

After G: 196 pages, 2,920 KB, EPUB 1,396 KB, `check-stylesheet.py` 0 failures.

### Section H — the guide and the install sheet, design

| ID | what changed | evidence |
|---|---|---|
| H1 | **The phone format.** `docs/start-here/phone.css` and `render-phone.cjs` lay the same `book.html` on a 390 × 845 page (9:19.5) with the body at **16 CSS px**, every screenshot running the full column, and the two- and three-column grids stacked. The 6 × 9 pages become auto-height blocks that break to the next sheet rather than clip, so nothing is lost: **65 phone sheets for the 32 printed pages**. The 6 × 9 edition is untouched — the phone stylesheet is injected at render time. | measured in Chromium: body 16px, **0 pages clipped**, **no element wider than the column**, 0 broken images |
| H2 | **Bookmarks, language, links.** Both documents now render with Chrome's `tagged` and `outline` options. | guide: `/Lang en-US`, `/MarkInfo /Marked true`, `/StructTreeRoot`, **25 bookmarks**, 19 contents links. Install sheet: `/Lang en-US`, tagged, 10 bookmarks |
| H3 | **No Type 3 fonts.** The guide's Lora was the variable font, which Chrome rasterises into Type 3 when it writes a PDF; it now uses the same static faces the book embeds (`lora-local.css`). The install sheet's Type 3 DejaVu went with H7's icons. | `pdffonts`: guide **15 CID, 0 Type 3**; install sheet **7 CID, 0 Type 3, no fallback faces at all**. `pdftotext` yields "Install Gap" |
| H4 | **One body size.** Running text, boxes, steps, definition tables, data tables and bullets were 8.6 / 8.9 / 9.0 / 9.2 / 9.4pt; they are all **9.4pt** now. Table padding came down from 6px to 5px to pay for it. | the guide's remaining other sizes are labels, step numbers and the back cover, not body |
| H5 | **The screenshot carries the step numbers.** The log-sheet figure has four gold badges, 01–04, over the amount, the category row, Add expense and More options, matching the four steps beside it, and the image gained real alt text. | page 12 of the guide, read back and looked at |
| H6 | **Not done, and I still argue against it.** The guide cover is already a cream hardcover with the same gold frame, wordmark and bottom line. Matching the book's pebble grain means regenerating the artwork, which loses the staircase that carries the guide's whole idea. | unchanged |
| H7 | **The install sheet's technical faults.** The address and the support email are links (`https://` and `mailto:`). The three browser glyphs — `···`, `⋮` and `›` — and the Gap → Streak arrow are drawn as inline SVG, so no fallback font is embedded at all. `/Lang` is en-US. | 3 link annotations where there were 0; the font list is Fraunces, Poppins and IBM Plex Mono and nothing else |

**Three pages I had to pay for, and what I spent.** Setting the body to one
size pushed two pages over. Table padding (6px → 5px) closed page 4. Page 9
needed 7px more, and the sentence that went was "Protect assigned money before
choosing what remains available to spend", in a box whose first sentence
already says those transfers assign the gap. One more cut, on page 8: "A
browser tab can show a separate, empty record", where the paragraph above it
already says another browser or profile keeps its own separate storage. Both
are B4 cuts, both whole sentences, nothing reworded.

**What is left in the guide's text layer, measured.** Of 1,194 distinct words
of four letters or more, **16 come out split** — BEFREEACADEMY, SITE and the
rest in letter-spaced Poppins labels and step headings. That is Chrome's PDF
writer spacing small display type, not the Type 3 fault, and it survives
`font-kerning:none`. WeasyPrint brings it to 1 word, but it renders the
guide's drop cap on top of its own paragraph, so the guide stays on Chrome and
this is recorded rather than hidden.
