# BeFree storefront — components

Shopify sections for the landing page, built and reviewed one at a time. This
is a component folder, not yet a theme: it cannot be uploaded with *Upload
theme*. The sections move into the theme at assembly.

## The one rule

`snippets/befree-tokens.liquid` is the only place a brand colour or typeface is
written down. Every section starts with `{% render 'befree-tokens' %}` and
reads `var(--bf-*)`. Nothing eyedrops a colour from a screenshot again.

The greens sit on hue 150.4 in OKLCH — the book cover's leather, measured over
81% of its pixels — which is where the book, both apps and the PDFs already
are. The golds sit on hue 72.2, the dot in the logo.

| token | value | contrast on `--bf-cream` | use |
|---|---|---|---|
| `--bf-cream` | `#F8F6EF` | — | page and header background |
| `--bf-cream-hi` | `#FFFDF5` | — | text on deep green (11.18:1) |
| `--bf-ring` | `#E8D1BA` | — | the ring in the logo |
| `--bf-green-900` | `#1F4127` | 10.53:1 | buttons, plates |
| `--bf-green-800` | `#223D28` | 11.00:1 | body ink |
| `--bf-green-700` | `#1C4C2A` | 9.18:1 | the book's `--forest` exactly |
| `--bf-green-500` | `#447E52` | 4.46:1 | the book's `--c2` exactly |
| `--bf-gold` | `#EDA335` | 1.96:1 | **decorative only** — rules, dots, never text |
| `--bf-gold-ink` | `#BE7C00` | 3.20:1 | state marks; also 3.29:1 on `--bf-green-900` |

## Sections

### `sections/befree-header.liquid` — reviewed, fixed

Sticky header: logo, three in-page anchors, one call to action, and a cart that
only appears once something is in it.

What changed from the standalone draft:

- **The wordmark.** The draft bundled a raster of the logo from before the
  green was unified: `#087F5B`, hue 164.7, **20.6 ΔE** from the rest of the
  package — a different colour, not a different shade. Worse, the button, the
  ink and the gold had all been tuned to match it, so the whole section was 20°
  off-brand. `tools/recolour-wordmark.py` rotated every pixel onto hue 150.4 in
  OKLab, keeping its lightness and chroma so the antialiasing survived. The
  file also dropped from 900px/27KB to 480px/16KB — 480 covers the 154px
  desktop logo at device pixel ratio 3.
- **Colours onto the tokens.** `#0C4234` → `#1F4127` and `#183E32` → `#223D28`,
  lightness held so contrast is unchanged: 11.18:1 on the button, 10.95 → 11.00
  for the ink.
- **The entrance delay, 3650ms → 0.** With `fill: backwards` the header was
  *empty* — no logo, no button — for 3.65 seconds. Measured on the built page:
  at the old default the logo was at 0% opacity through 2000ms and still only
  26% at 3800ms; at zero it is 84% by 300ms. The announcement bar it was
  waiting for is shelved, and on traffic that arrives free the first seconds
  decide the bounce. The setting stays, for if a bar is ever placed above.
- **A call to action on phones.** The draft hid it below 1000px, so the sticky
  bar cost 72px of every screen and carried a logo, a hamburger and a cart —
  nothing that sells. Buying meant open menu → read → tap. The bar now holds
  the button at every width, 44px tall, and the grid middle column is
  `minmax(0, 1fr)` so the wordmark shrinks instead of overflowing. Verified
  from 320 to 1920px: no horizontal overflow in any state.
- **The cart is hidden until it has something in it.** On a one-bundle page an
  empty cart icon is an exit that teaches nothing, and on phones it was taking
  the slot the button needed. It appears on add, from `cart.item_count` at
  render and from the `cart:updated` event after.
- **The current-page marker passes.** It was a 1px `#C39946` underline at
  2.44:1 — the only indicator of state, so it is information and owes 3:1. Now
  2px of `--bf-gold-ink` plus a weight change. The hover underline stays
  decorative gold. Both gold rules were re-weighted (22% → 14%, 55% → 38%,
  panel 100% → 45%) because the brand gold is far more saturated than the one
  the draft used.
- **Brand type.** The section hard-coded `system-ui`; it now inherits
  `--bf-sans`, so the nav and the button are Poppins like everything below them.
- **`scroll-padding-top`.** The anchors landed under the sticky bar.

Kept from the draft, which was well built: the `<details>` menu that works with
JavaScript off, Escape returning focus to the toggle, the `forced-colors`
block, `prefers-reduced-motion`, and `disconnectedCallback` removing every
listener.

### `sections/befree-announcement.liquid` — shelved, not deleted

Not in the header group. Every message tried was either empty ("a better
financial future"), contradicted the book (Chapter 2 is *Why Budgets Always
Fail*), or priced the apps at zero. It costs 62px, 7.4% of an 844px viewport,
and withheld its line for 3.65 seconds. It comes back when there is a guarantee
to put in it — that is the one message that belongs above the hero — and it
needs the token pass first; its colours are still the draft's.

## Reproducing

    (python3 -m http.server 8131 &)                        # from storefront/
    python3 tools/make-preview.py page 0                   # empty cart
    python3 tools/make-preview.py page-cart 2              # two items
    PW=$(npm root -g)/playwright node tools/shoot.cjs      # shots/ + geometry
    PW=$(npm root -g)/playwright node tools/audit.cjs      # contrast, type, targets

`make-preview.py` renders the Liquid to static HTML using the schema defaults,
so the previews cannot drift from what the section will ship.

Measured at 390px: bar 72px, 64px once scrolled; wordmark 124px; button 131×44;
contrast 11.00:1 on the links and 11.18:1 on the button; no page errors.

## Still open

Price, guarantee, and whether any real proof exists. The button says "Get the
System", which only reads correctly once the page has been read; it should
carry the price instead, once there is one.
