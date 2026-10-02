// The four phone states side by side, for review.  Run from storefront/:
//   (python3 -m http.server 8131 &)
//   PW=$(npm root -g)/playwright node tools/contact-sheet.cjs
const path=require('path'),fs=require('fs');
const {chromium}=require(process.env.PW||'playwright');
const B=(process.env.BASE||'http://localhost:8131/')+'preview/';
const OUT=path.join(__dirname,'..','shots');
const W=390,H=470,PAD=26,GAP=20,BG={r:237,g:233,b:222};
const PANES=[
 {k:'a',url:'page.html'},                                                     // first paint
 {k:'b',url:'page.html',act:async p=>p.evaluate(()=>scrollTo(0,500))},        // compact
 {k:'c',url:'page-cart.html'},                                                // cart filled
 {k:'d',url:'page.html',act:async p=>p.click('.bf-header__toggle')},          // menu open
];
(async()=>{
 const browser=await chromium.launch();
 const shots=[];
 for(const pane of PANES){
  const ctx=await browser.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const p=await ctx.newPage();
  await p.goto(B+pane.url,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(800);
  if(pane.act){await pane.act(p);await p.waitForTimeout(600);}
  shots.push(await p.screenshot());
  await ctx.close();
 }
 await browser.close();
 // stitch them with a sharp-free canvas: write the panes, let the shim join them
 const page=await (await chromium.launch()).newPage();
 const b64=shots.map(s=>'data:image/png;base64,'+s.toString('base64'));
 const sw=PAD*2+PANES.length*W+GAP*(PANES.length-1), sh=PAD*2+H;
 await page.setViewportSize({width:sw,height:sh});
 await page.setContent(`<style>html,body{margin:0;background:rgb(${BG.r},${BG.g},${BG.b})}
  .s{display:flex;gap:${GAP}px;padding:${PAD}px}
  img{width:${W}px;height:${H}px;display:block;outline:1px solid #cdc6b6}</style>
  <div class="s">${b64.map(d=>`<img src="${d}">`).join('')}</div>`,{waitUntil:'load'});
 await page.screenshot({path:path.join(OUT,'mobile-sheet.png')});
 await page.context().browser().close();
 console.log('shots/mobile-sheet.png  '+sw+'x'+sh+' css px at dsf 2');
})();
