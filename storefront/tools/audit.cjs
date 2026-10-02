// Run from storefront/:  (python3 -m http.server 8131 &)
//   PW=$(npm root -g)/playwright node tools/audit.cjs
const {chromium}=require(process.env.PW||'playwright');const B=(process.env.BASE||'http://localhost:8131/')+'preview/';
const lin=c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4};
const lum=([r,g,b])=>.2126*lin(r)+.7152*lin(g)+.0722*lin(b);
const cr=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)};
const rgb=s=>s.match(/\d+/g).slice(0,3).map(Number);
(async()=>{
 const browser=await chromium.launch();
 for(const w of [390,1280]){
  const ctx=await browser.newContext({viewport:{width:w,height:844},deviceScaleFactor:1,isMobile:w<1000});
  const p=await ctx.newPage();await p.goto(B+'page-cart.html',{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(700);
  const r=await p.evaluate(()=>{
   const out=[];const bg=getComputedStyle(document.querySelector('.bf-header')).backgroundColor;
   const add=(label,sel,over)=>{const e=document.querySelector(sel);if(!e)return;
     const s=getComputedStyle(e);const b=e.getBoundingClientRect();
     out.push({label,color:s.color,bg:over||getComputedStyle(e.closest('[style],.bf-header')).backgroundColor,
       size:parseFloat(s.fontSize),weight:s.fontWeight,w:Math.round(b.width),h:Math.round(b.height),
       font:s.fontFamily.split(',')[0].replace(/"/g,'')});};
   add('nav link (desktop)','.bf-header__desktop .bf-header__nav-link',bg);
   add('CTA label','.bf-header__actions .bf-header__cta',getComputedStyle(document.querySelector('.bf-header__actions .bf-header__cta')).backgroundColor);
   add('cart count','.bf-header__count',getComputedStyle(document.querySelector('.bf-header__count')).backgroundColor);
   add('menu toggle','.bf-header__toggle',bg);
   add('cart link','.bf-header__cart',bg);
   add('brand','.bf-header__brand',bg);
   return {out,bg};});
  console.log(`\n--- ${w}px ---  header background ${r.bg}`);
  for(const x of r.out){
   const ratio=cr(rgb(x.color),rgb(x.bg));
   const large=x.size>=24||(x.size>=18.66&&+x.weight>=700);
   const need=large?3:4.5;
   const tap=(x.w>=44&&x.h>=44)||(x.w>=40&&x.h>=40);
   console.log(`  ${x.label.padEnd(20)} ${x.font.padEnd(8)} ${String(x.size).padStart(5)}px/${x.weight}  ${ratio.toFixed(2)}:1 ${ratio>=need?'PASS':'FAIL'}  box ${x.w}x${x.h} ${tap?'':'(small target)'}`);
  }
  await ctx.close();
 }
 await browser.close();
})();
