THE ANTI-PAYCHECK TRAP · revised third edition

  The-Anti-Paycheck-Trap.pdf   the finished book, 185 pages

HOW IT IS BUILT
  src/original.html   the third-edition source as supplied, never edited
  src/sys.css         its stylesheet, never edited
  src/sys2.css        this revision's layer: full-width figures, IBM Plex Mono
                      for amounts, a colour-blind-checked data palette, recap
                      cards, "In the app" panels
  src/ed_*.py         every text and figure change, as named steps that each
                      must match exactly once (a stale edit stops the build)
  src/model/          the Marcus and Maya model behind every persona figure
                      (node financial-model.cjs; MONTHS=48 runs it on)
  src/shots.cjs       the three Gap screens taken for this book; the rest come
                      from ../start-here/fig

  pip install weasyprint==70 pillow
  python3 src/build.py           # book.html + PDF, contents numbered from the layout
  cp src/The-Anti-Paycheck-Trap.pdf .
