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

