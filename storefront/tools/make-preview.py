"""Render a section to a static page, so it can be photographed exactly as the
schema defaults will ship it.  Run from storefront/:

    python3 tools/make-preview.py page 0        # empty cart
    python3 tools/make-preview.py page-cart 2    # two items in the cart
"""
import json, re, sys, os
SRC='sections/befree-header.liquid'
src=open(SRC,encoding='utf-8').read()
css=src.split('{% stylesheet %}')[1].split('{% endstylesheet %}')[0]
js =src.split('{% javascript %}')[1].split('{% endjavascript %}')[0]
sch=json.loads(src.split('{% schema %}')[1].split('{% endschema %}')[0])
d={x['id']:x.get('default') for x in sch['settings'] if 'id' in x}
tok=open('snippets/befree-tokens.liquid',encoding='utf-8').read()
tok=tok.split('{%- endcomment -%}')[1].strip()

CART=int(sys.argv[2]) if len(sys.argv)>2 else 0
nav=''.join(
  f'<a class="bf-header__nav-link" href="#{b["settings"]["anchor"]}">{b["settings"]["label"]}</a>'
  for b in sch['presets'][0]['blocks'])
cta=(f'<a class="bf-header__cta" href="#bundle"><span>{d["cta_label"]}</span>'
     '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" '
     'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>')
style=(f'--bfh-bg:{d["background"]};--bfh-ink:{d["text_color"]};--bfh-green:{d["button_color"]};'
       f'--bfh-button-ink:{d["button_text"]};--bfh-gold:{d["accent"]};--bfh-logo:{d["logo_width"]}px;'
       f'--bfh-mobile-logo:{d["mobile_logo_width"]}px;--bfh-height:{d["height"]}px;'
       f'--bfh-width:{d["content_width"]}px;')
header=f'''<befree-header class="bf-header" data-sticky="{str(d["sticky"]).lower()}" data-motion="{str(d["motion"]).lower()}" data-delay="{d["delay"]}" style="{style}">
 <div class="bf-header__inner">
  <details class="bf-header__mobile" data-header-reveal>
   <summary class="bf-header__toggle" aria-label="{d["menu_label"]}"><svg class="bf-header__menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 8h18M3 16h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><svg class="bf-header__close-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></summary>
   <div class="bf-header__panel"><p class="bf-header__panel-label">{d["menu_heading"]}</p><nav aria-label="{d["menu_label"]}">{nav}</nav>{cta}</div>
  </details>
  <a class="bf-header__brand" href="#" data-header-reveal><img src="../assets/befree-header-logo.webp" width="480" height="141" loading="eager" fetchpriority="high" decoding="async" alt="BeFree"></a>
  <nav class="bf-header__desktop" aria-label="{d["menu_label"]}" data-header-reveal>{nav}</nav>
  <div class="bf-header__actions" data-header-reveal>{cta}<a class="bf-header__cart" href="#cart" aria-label="{d["cart_label"]}"{"" if CART else " hidden"}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7.5h14l1 14H4l1-14ZM8.5 8V6a3.5 3.5 0 0 1 7 0v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="bf-header__count" aria-live="polite">{CART}</span></a></div>
 </div>
</befree-header>'''

body=sys.argv[1] if len(sys.argv)>1 else 'page'
filler='''<main class="bf-stage">
 <section id="system"><p class="eyebrow">THE SYSTEM</p><h1>A little room to breathe.</h1>
 <p class="sub">Placeholder canvas. The hero, the offer and the proof are the next components.<br>Scroll to watch the header compact.</p></section>
 <section id="how-it-works"><h2>How It Works</h2><p>Preview destination.</p></section>
 <section id="faq"><h2>FAQs</h2><p>Preview destination.</p></section>
 <section id="bundle"><h2>The bundle</h2><p>Preview destination.</p></section></main>'''
page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>BeFree header</title>
{tok}
<style>{css}
body{{margin:0;background:var(--bf-cream);color:var(--bf-green-800);font-family:var(--bf-sans)}}
.bf-stage section{{max-width:620px;margin:auto;padding:76px 22px;border-bottom:1px solid #223d2812}}
.bf-stage .eyebrow{{font-size:10px;letter-spacing:.2em;color:var(--bf-gold-ink);margin:0 0 14px}}
.bf-stage h1{{font-family:var(--bf-display);font-weight:500;font-size:34px;line-height:1.18;margin:0 0 16px;letter-spacing:-.01em}}
.bf-stage h2{{font-family:var(--bf-display);font-weight:500;font-size:25px;margin:0 0 10px}}
.bf-stage p.sub{{margin:0;font-size:14px;line-height:1.85;color:#4a6151}}
.bf-stage p{{font-size:14px;line-height:1.8;color:#4a6151;margin:0}}
</style></head><body class="bf-header-section-host">
<div class="bf-header-section">{header}</div>
{filler}
<script>{js}</script></body></html>'''
os.makedirs('preview',exist_ok=True)
open(f'preview/{body}.html','w',encoding='utf-8').write(page)
print('wrote preview/%s.html  (cart=%d, delay=%s)'%(body,CART,d['delay']))
