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

