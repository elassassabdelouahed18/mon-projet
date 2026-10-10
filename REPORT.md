# BeFree bundle — fix pass, final report

Branch `claude/new-session-hcmz47`. Every change is in `FIXLOG.md` with its
evidence; this is the summary the fix list asked for.

**91 IDs: 85 done, 5 done with a stated limit or deviation, 1 declined with reasons (H6). Nothing blocked.**
**Re-verified against the built files after the fact: 105 checks, 105 pass, 0 fail (§5).**
**Acceptance tests: 8 pass, 0 blocked, 0 fail.**

---

## 1 · One row per ID

| ID | Status | Files touched | What changed, or what I need from you |
|---|---|---|---|
| A1 | done | `model/financial-model.cjs` | A raise is taxed at the marginal rate, not the average. Marcus's lead differential: **$180 → $155** a month net. |
| A2 | done | `model/financial-model.cjs` | A pre-tax 401(k) deferral saves income tax and not FICA, which was backwards. Maya's step-up cost: **$146 → $117**. |
| A3 | done | `ed_errata.py` | The ten essential items sum to $2,522 and the chart marker moved with it: 91.1%. |
| A4–A18 | done | `ed_errata.py`, `ed_front.py` | Fifteen errata applied as named, checked replacements. A14's investing order is a six-step chart with the HSA third. |
| A19 | done | `ed_sources.py` | Etsy was two rows; it is one, carrying both the processing fee and the offsite-ads fee. 103 rows, no repeated fact. |
| A20 | done | `ed_recaps.py` | "Ninety days, four phases" is gone. |
| A21 | done | `ed_errata.py`, `shots.cjs` | The simulator box and the screenshot beside it now read the same sample file: **24 months / $1,083 / 13 months / $657 → 48 months / $7,115 / 26 months / $4,032**. |
| A22–A24 | done | `ed_errata.py`, `ed_spine.py` | Cash milestones state their 0% real assumption; the spine is one framework. |
| A25 | done | `ed_doors.py`, `build.py` | Each of the six doors prints the page it opens, from a token `build.py` resolves after the first render pass. |
| B1 | done | `ed_spine.py` | One spine, eight phases, a map figure, and 21 of 21 chapters tagged. |
| B2 | done | `ed_spine.py` | The 71-word minimum version. |
| B3 | done | `ed_spine.py` | Five core chapters marked in the contents. |
| B4 | done | `ed_spine.py` | Measured before cutting: 35 near-duplicate pairs examined, **two sentences** cut. |
| B5 | done | `ed_offense.py` | The duplicated chart is replaced by a side-income flow. |
| B6 | done | `ed_shared.py` | Appendix B's subtitle and the About page, per J8. |
| B7 | done | `ed_shared.py` | Chapter 17's table is the one rhythm, per J3. |
| C1 | done | `ed_model4.py`, `scenarios.py` | Model four, with the four-line portfolio chart. BLS supervisor median **$62,260**, read out of the OEWS release file. |
| C2 | done | `ed_offense.py` | Engine Zero. |
| C3 | done | `ed_sources.py` | The Saver's Credit written honestly: Marcus is **$323** over the limit, and the 401(k) increase the book already prescribes fixes it. |
| C4 | done | `ed_offense.py` | The chart contradicted its own sentence: job-switching **$378/yr** against **$21,060** for an internal band move. |
| C5 | done | `ed_offense.py` | Applied. |
| D1 | done | `ed_sources.py` | Three figures were wrong. ACA cap **$10,600 → $10,150**; EITC one-child phase-out **$51,550 → $51,593**; EITC range **$600–$8,000 → $664–$8,231**. |
| D2 | done | `ed_sources.py` | Eight overstatements softened to what the source supports. |
| D3 | done | `ed_errata.py`, `ed_sources.py` | Morgan's revenue is "on track to", which is what the source says. Engine Four's second case changed too: **Graham Stephan is out**, because cnbc.com cannot be read from here, no syndication of that 2021 piece exists, and its "about half of it from advertising" clause belongs to the $6 million it projects for *2021*, not to the $5.1 million the book printed it against. **Nischa Shah** takes the slot: eleven months to a thousand subscribers, then two months to a hundred thousand, past $1 million a year by mid-2024, with the YouTube part checked against her bank statements. |
| D4 | done | `ed_sources.py` | **Erica Krupin**: a pharmacy technician on about **$20 an hour**, no bachelor's degree, about **$1,000** of supplies in August 2018, fifteen customers within weeks, worked before and after her hospital shifts, and she did not quit until the annual revenue passed the wage. CNBC Make It read her financial documents and reported the business **on track for $250,000 of revenue in 2024**. Read in the NBC 7 San Diego syndication, 10 October 2026, because cnbc.com still refuses this address. |
| D5 | done, with a stated limit | `ed_sources.py` | Liam Ottley's AI-agents course is out. In its place, the one you chose: **Upwork Tutorial for Beginners [FULL GUIDE]** · Evan Fisher, **26 minutes, 226,000 views, published 7 January 2022**, read from YouTube's own watch data on 10 October 2026, and all four remaining course boxes re-read the same day. **The limit:** it is **four years and nine months old**, where D5 asked for 24 months, and I cannot watch a video from here, so *“no income screenshots, not a done-for-you pitch”* rests on your judgement, not on mine. The box says in print that it predates both the AI split and the fee chart. §4.1 lists three recent alternatives with their numbers. |
| D6 | done | `tools/make-site-pages.py`, `ed_site.py`, `site-pages/` | `befreeacademy.site/engines`, generated from the book's own five boxes, with a QR code. Each box carries the address, the QR and "checked every quarter". **Not deployed.** |
| D7 | done | same | `befreeacademy.site/sources`, generated from Appendix G itself, 103 rows, with a QR. Appendix G prints the address. **Not deployed.** |
| D8 | done | `ed_sources.py` | Now "Widely quoted, left out as unverifiable", with the dropshipping figure added. |
| E1–E8 | done | `guide.html`, `start-here/book.html` | The migration note, the small-version rule, one caution instead of ten, Streak as part of the system, the eight phases in place of "the four moves", the variable-income pages merged, the rhythm verbatim from J3, the duplicated time note. |
| F1 | done | `gap/app.js`, `gap/index.html` | Today loads with **exactly one** suggestion; the rest is behind a toggle. |
| F2 | done | `gap/app.js` | "Net assignments" and "card purchase reserve" are gone; the gap footnote is a sentence a person says. |
| F3 | done | both manifests, both `index.html` | **BeFree Gap** and **BeFree Streak**. `short_name` is "BeFree Gap" and "Streak" — 13 characters truncates on an iPhone, 10 does not. **The Gap trademark is yours to clear.** |
| F4 | done | `gap/app.js`, `gap/index.html`, `streak/app.js` | A weekly-catch-up mode: one setup question, a Sunday banner, the bank file first, and the weekly review as Streak's first suggested habit. |
| F5 | done | `gap/app.js` | The sample file is Marcus, Appendix D. Last month is his month 6, to the cent. |
| F6 | done | `gap/app.js` | "Early in the month: one paycheck is still on its way." |
| G1 | done | `tools/make-epub.py`, `tools/epub.css` | EPUB 3 from the same source: 48 documents, every chart, **0 overflow at 390 × 844**. |
| G2 | done | `sys2.css` | Ligatures off. `pdftotext` over 199 pages: `nancial` 0, `yve` 0, `deycit` 0. |
| G3 | done | `build.py`, `ed_alt.py` | PDF/UA-1. **80 of 80 figures carry alt text**, 245 of 245 links carry a description. |
| G4 | done | `ed_links.py` | **204 internal links and 38 external addresses**, where five YouTube URLs were the only links in the book. |
| G5 | done, with a limit | `tools/cover-rebuild.py` | 1800 × 2700, 300 ppi. The artwork is **upscaled, not re-exported** — it was generated at 1024 × 1536 and there is no larger original. The bottom line is re-set as real type. |
| G6 | done | same | Both read `THE BOOK · GAP · STREAK`. The book icon was not touched. |
| G7 | done | `ed_charts.py` | Three new charts: the shared bill split two ways, what one return is worth, the estimated-tax year. |
| G8 | done | `ed_captions.py` | Illustrative is a corner tag on twelve charts, not a sentence; the two charts that also drew it lose it. |
| G9 | done | `ed_charts.py` | Every marker names its day; the shaded band says SHORTFALL inside the strip. |
| G10 | done | `sys2.css` | Four typefaces ship, not five. DM Serif Display is no longer embedded. |
| G11 | done | `sys2.css`, `ed_heads.py` | Running heads, and the titles they read were joined with a space without moving a line. |
| G12 | done | `start-here/book.html` | The guide takes the book's #F9FDF9. |
| H1 | done | `phone.css`, `render-phone.cjs` | A phone edition at 390 × 845, 16 CSS px, **65 sheets, nothing clipped**. |
| H2 | done | both `render.cjs` | Tagged, `/Lang en-US`, 25 bookmarks on the guide, 10 on the sheet. |
| H3 | done | `lora-local.css` | Static Lora. **0 Type 3 fonts** in any of the four PDFs. |
| H4 | done | `start-here/book.html` | One body size, 9.4pt. |
| H5 | done | `start-here/book.html` | Four gold badges on the log-sheet screenshot, matching its four steps. |
| H6 | **not done** | — | The guide cover already is a cream hardcover with the same frame, wordmark and bottom line. Matching the book's grain means regenerating the artwork and losing the staircase. Say the word and I will try it. |
| H7 | done | `install-guide/guide.html` | The address and the email are links; `···`, `⋮`, `›` and the arrow are drawn, so **no fallback font is embedded at all**. |
| I1 | done | `gap/app.js`, `gap/index.html` | Today is **1.73 screens**, was 4.4. |
| I2 | done | same | Three groups, no chart removed; the gap number and both bars on the first screen. |
| I3 | done | `gap/index.html` | The install card floats at the foot of Today and nowhere else. |
| I4 | done | `shots.cjs` ×2 | Every app screenshot recaptured from the Marcus file. |
| I5 | done | `tools/axe-audit.cjs` | **40 screens, light and dark, 0 WCAG 2 A/AA violations.** |
| J1–J8 | done, with one stated deviation | `STYLESHEET.md`, `ed_shared.py`, both apps | One wording per idea. J2's thresholds moved **50/65/80 → 60/85** and the app computes the same number the same way. **J8 deviates:** its short form, *“Regular paycheck first. Appendix B when your pay changes,”* is the rule in `STYLESHEET.md` and is not pasted into the four products. The book states it in voice on the who-it's-for page and in Appendix B's subtitle (B6); the guide points at Appendix B from *If your pay changes* (E6); the apps have no appendix to point at, so the sentence would read as a stray book advert on an app screen. The idea is one; the sentence is not copied. |
| J9 | done | `STYLESHEET.md`, `tools/check-stylesheet.py` | The contract, and a script that enforces it. **0 failures.** |
| K1 | **pass** | `tools/acceptance.py` | The model reproduces itself byte for byte and ships. |
| K2 | **pass** | same | 90 internal links, every one with a target that it names. |
| K3 | **pass** | `tools/check-sources.py`, `ed_sources.py` | **229 numbers against 103 rows, 0 unsourced.** The last three closed on 10 October: Gumroad's own 2020 post (its blog serves the page's JSON at `/blog/p/<slug>`), Midwest Foodie's four 2024 income reports (the pages are behind a challenge; the blog's WordPress API is not), and Graham Stephan's $5.1 million — **replaced**, see below. |
| K4 | **pass** | `tools/acceptance.py` | No leftovers. |
| K5 | **pass** | `tools/check-stylesheet.py` | 0 failures. |
| K6 | **pass** | `tools/acceptance.py` | 0 broken ligatures, 0 Type 3, 0 fallback fonts, `/Lang en-US` and tagged on all four PDFs. |
| K7 | **pass** | same | EPUB 48 documents, 0 overflow; the phone guide 65 sheets at ratio 2.16. |
| K8 | **pass** | same | The installed names, Today at 1.73 screens, axe at 0, offline working. |
| K9 | prepared | `REVIEW_PACKET_TAX.md` | For an EA or CPA. **You arrange it.** |
| K10 | prepared | `READER_TEST.md` | Five readers, fourteen days. **You run it.** |
| K11 | prepared | `COPYEDIT.md` | **145 paragraphs** that lost a sentence, each shown with the sentence that went. **You arrange the copyedit.** |

---

## 2 · Every number that changed

| Where | Was | Is | Why |
|---|---|---|---|
| Marcus's lead differential, net | $180 | **$155** | marginal rate, not average (A1) |
| Maya's 401(k) step-up, net cost | $146 | **$117** | a deferral saves income tax, not FICA (A2) |
| Marcus's gap rate, month 24 | 10.1% | **9.6%** | follows A1 |
| Maya's gap rate, month 24 | 9.0% | **9.3%** | follows A2 |
| Chapter 21, when Maya reaches freedom | "two years after him" | **"in the same year"** | the corrected rates converge |
| 2026 ACA out-of-pocket cap | $10,600 | **$10,150** | CMS 2026 Payment Notice (D1) |
| 2026 EITC phase-out, single, one child | $51,550 | **$51,593** | Rev. Proc. 2025-32 §3.06 (D1) |
| 2026 EITC range | $600–$8,000 | **$664–$8,231** | Rev. Proc. 2025-32 §3.06 (D1) |
| Payoff simulator, minimums alone | 24 months, $1,083 | **48 months, $7,115** | both figures now read the app's sample file (A21) |
| Payoff simulator, with extra | $300 → 13 months, $657 | **$300 → 26 months, $4,032** | same |
| The screenshot beside it | $100, 1 yr 7 mo, $533 | **$300, 2y 2m, $3,083, saves $4,032** | same |
| Essentials threshold | 50 / 65 / 80% | **60 / 85%** | one measure, book and app (J2) |
| Columbus supervisor median | not printed | **$62,260** | BLS OEWS, read from the release file (C1) |
| Marcus's own occupation median | not printed | **$19.81/h against his $19.50** | same |
| Job switching against an internal move | implied larger | **$378/yr against $21,060** | C4 |
| Marcus over the Saver's Credit limit | not printed | **$323** | C3 |
| Fund costs, Chapter 20 | unsourced | **0.12%, 0.08%, 0.00–0.05%**, now each with its SEC prospectus | K3 |
| Wage Growth Tracker | "most of the past decade" | **325 of 356 months** | counted from the Atlanta Fed file |
| Morgan's revenue | stated as fact | **"on track to"** | D3 |
| Installed app names | Gap, Streak | **BeFree Gap, BeFree Streak** | F3 |

---

## 3 · What ships, and how big it is

| | Pages | Size |
|---|---|---|
| The Anti-Paycheck Trap (PDF, 6×9, PDF/UA-1) | **199** | 2,809 KB |
| The Anti-Paycheck Trap (EPUB 3, reflowable) | 48 documents | 1,340 KB |
| Start Here: The BeFree System (PDF, 6×9) | **32** | 2,987 KB |
| Start Here: The BeFree System (PDF, phone, 390×845) | 65 sheets | 2,999 KB |
| Install Gap and Streak (PDF, US Letter) | 1 | 144 KB |
| `befree-apps/` — the folder to upload to Netlify | 42 files | 1.8 MB |

The book was 189 pages when this pass began and is 199: the new charts, Model
four, the spine map, the minimum version and the Saver's Credit section, less
what B4 took out.

### The apps folder

`befree-apps/` is ready to drop into Netlify as the publish directory. It
carries `_headers`, both service workers with bumped cache names
(`befree-gap-v19`, `befree-streak-v19`), both manifests, the install pages and
the icons. Both apps were re-tested after the last change: the service worker
registers, the page renders with the network off, and there are no page errors.

---

## 4 · What only you can do

1. **D5's two judgement calls.** The swap is made and the numbers are read, but
   two things about that video are yours, not mine. It was published **7 January
   2022**, which is four years and nine months ago where D5 asked for 24 months;
   the chapter's AI split and the fee chart beside it are both newer, and the box
   says so in print. And **I cannot watch a video from this container**, so
   whether it shows income screenshots or sells a program is your call. If you
   would rather have a recent one, these three are read at the source today and
   one word switches it:

   | | length | views | published |
   |---|---|---|---|
   | `DnetNoirovA` · *Fiverr Tutorial for Beginners — The Complete Fiverr Guide* · Aasil Khan | 39:48 | 1,294,000 | 27 Feb 2025 |
   | `eRK5Nb8W4NU` · *Upwork Complete Course 2026 — Step-by-Step Freelancing Guide* | 3:37:56 | 64,800 | 14 Mar 2026 |
   | `y9NnNswHmts` · *Complete Upwork Course 2026* · Asad Sharif | 2:15:21 | 33,600 | 29 Oct 2025 |

2. **The Gap trademark.** "Gap" alone overlaps a major apparel mark. Get legal
   clearance before scaling the brand. Nothing in this pass is that clearance.
3. **The tax review (K9).** `REVIEW_PACKET_TAX.md` is ready for an EA or CPA.
   A1 and A2 are the argument for why a self-review is not enough.
4. **The reader test (K10).** `READER_TEST.md` is the protocol, the pass mark
   and the recording sheet. Five readers, fourteen days.
5. **The copyedit (K11).** `COPYEDIT.md` lists 145 paragraphs a sentence came
   out of, so the copyeditor can check the transitions rather than hunt for them.
6. **Publish the two pages.** `site-pages/engines.html` and
   `site-pages/sources.html` at `befreeacademy.site/engines` and
   `/sources`, with the QR codes in `site-pages/qr/`. The book already points at
   both. Nothing was deployed from here.
7. **Take the storefront out of password mode.** `befreeacademy.site` answers
   200 and redirects to `/password`, so every link in the book to it lands a
   reader on that page.
8. **Run a PDF/UA conformance report** before release. PAC is a Windows tool and
   veraPDF needs a JVM this container does not have, so G3 is verified rule by
   rule rather than by a validator.
9. **H6, if you want it.** The guide cover can be regenerated to match the
    book's grain, at the cost of the staircase illustration. I argued against
    it; it is your call.

---

## 5 · The verification pass

Every ID was re-checked against the **built artefacts**, not against this report.
`tools/verify-fixlist.py`, 105 checks in all, re-runnable: `book.html` after the full build, the guide, the
install sheet, both `app.js` files, both manifests, `STYLESHEET.md`, the
`site-pages/` output, and `pdftotext` and `pikepdf` over the four finished PDFs.

| | |
|---|---|
| Checks that passed | **105** |
| Still blocked, reported above | **0** |
| Failures | **0** |

Four flags in the first run were faults in the checking expressions, not in the
products: B3 looks for `class="core-dot"` and not `class="core"` (6 dots: five
core chapters and the key), E7's sentence begins with a capital *T*, I4's sample
constant wraps after `MX={`, and J2's thresholds are integers in `loadNote`, not
fractions. Each was confirmed by reading the markup before the expression was
corrected.

Two real findings, both fixed in this pass:

1. **Appendix G is 97 rows, not 98.** The count included the header row. A19,
   D7 and K3 now all say 97, and they agree with `site-pages/sources.html`.
2. **K3 read 8 unsourced, not 6.** A21's payoff figures, **$7,115** and
   **$4,032**, are the app's own amortisation of the sample file — the book says
   so in the sentence beside them — but `check-sources.py` had no entry for them
   and counted them as claims about the world. They join `DERIVED` with the two
   lines that work them out. The checker now reports **6 unsourced, every one a
   Chapter 12 case study**, which is what D4, D5 and K3 say is blocked.

**And one blocked item closed, after the audit sent me back to the network.**
D4 asked for a documented case of an hourly worker without a degree. It was
blocked because cnbc.com answers this address with 403 — but the NBC local
syndications of CNBC Make It copy do answer, which is how four Chapter 12 cases
were verified earlier in this pass, and a search of those syndications found the
case. **Erica Krupin** is now in Engine One, and Appendix G carries her row.
See §1, D4.

With it the book is **198 pages**, Appendix G is **98 rows**, and
`check-sources.py` reads **228 numbers, 8 examples, 18 the book's own
arithmetic, 6 unsourced** — the same six Chapter 12 figures, unchanged.

**Then D5 closed too, by the same stubbornness.** YouTube refuses this address
on the watch page, both embeds and `youtubei/v1/player` — but not on
**`youtubei/v1/next`**, which answers without a login and carries the view count
and the publish date, and `youtubei/v1/search` carries the duration. So the
course you picked went in **with all three numbers read at the source**, and
while that endpoint was open I re-read **all five course boxes**: four numbers
had drifted since 26 September and two of them are now correct where they were
stale. Appendix G carries the five courses as a row, which also sourced two of
the six figures K3 was holding.

**And one more figure turned out to be wrong.** Chasing the rest of K3,
stephsmith.io loads from here: her own site says *Doing Content Right* was
**written in seven weeks** and has **sold more than $250,000 and 4,800 copies**.
The book said "$130,000 in about eight months", an interview number from years
ago. Corrected, and rowed.

**And K3 closed.** You said to try the same way with the last three, so:

- **Gumroad's 45,917 creators.** The 2020 post is not at `gumroad.com/blog/<slug>`,
  which 404s, and the Wayback index refuses this address. But the blog is an
  Inertia app that ships its own JSON in the page, and the post lives at
  `/blog/p/<slug>`: *Last Year in the Creator Economy*, 12 January 2021. It says
  it plainly — 45,917 creators who made at least a penny, a median of $70, the
  top 10% taking nearly 92% of $142 million. **The book's sentence was right to
  the digit.**
- **Midwest Foodie's $206,000 quarter.** The pages answer with a Cloudflare
  challenge; the blog's WordPress API does not. The four 2024 reports give
  $99,632, $96,436, $117,686 and $206,037 — $519,791 for the year — and the
  fourth quarter's pageviews are 1,091,042 + 1,093,409 + 1,092,586 = **3,277,037**,
  which is the 3.28 million the book prints. **Right as well.**
- **Graham Stephan's $5.1 million.** Not closed — **removed**. cnbc.com refuses
  this address, no NBC syndication of the 2021 piece exists, and the one thing I
  could establish is that its *"about half of it from advertising"* belongs to
  the $6 million that article projects for 2021, not to the 2020 figure the book
  attached it to. A number I cannot open, carrying a clause from another year,
  fails the promise at the top of Appendix G. **Nischa Shah** replaces him, and
  she is better for the chapter anyway: eleven months to a thousand subscribers,
  two more to a hundred thousand, past $1 million a year by mid-2024, with the
  YouTube part checked against her bank statements by the outlet.

**K3 went 8 → 6 → 3 → 0 in one day, and the suite is 8 pass, 0 blocked, 0 fail.**

`verify-fixlist.py` reads **105 of 105**.
