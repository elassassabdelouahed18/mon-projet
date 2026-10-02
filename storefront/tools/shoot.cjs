// Run from storefront/:  (python3 -m http.server 8131 &)
//   PW=$(npm root -g)/playwright node tools/shoot.cjs
const path=require('path');const {chromium}=require(process.env.PW||'playwright');
const OUT=path.join(__dirname,'..','shots');
require('fs').mkdirSync(OUT,{recursive:true});
const B=(process.env.BASE||'http://localhost:8131/')+'preview/';
(async()=>{
 const browser=await chromium.launch();
 const errs=[];
 const shot=async(name,{w,h=844,url='page.html',act,full=false,clip})=>{
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(name+': '+e.message));
  await p.goto(B+url,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(900);
  if(act) await act(p);
  await p.waitForTimeout(500);
  await p.screenshot({path:path.join(OUT,name+'.png'),fullPage:full,clip});
  // report the bar's real geometry and whether the CTA is on screen
  const m=await p.evaluate(()=>{const i=document.querySelector('.bf-header__inner');
   const c=document.querySelector('.bf-header__actions>.bf-header__cta');
   const l=document.querySelector('.bf-header__brand img');
   const k=document.querySelector('.bf-header__cart');
   const r=e=>e?e.getBoundingClientRect():null;
   return {bar:Math.round(r(i).height), cta:c&&getComputedStyle(c).display!=='none'?Math.round(r(c).width):0,
           ctaText:c?c.innerText.trim():'', logo:Math.round(r(l).width), cart:k&&!k.hidden?Math.round(r(k).width):0,
           overflow:document.documentElement.scrollWidth>innerWidth};});
  console.log(`${name.padEnd(22)} w=${String(w).padEnd(4)} bar=${m.bar}px logo=${m.logo}px cta=${m.cta}px cart=${m.cart}px overflow=${m.overflow}`);
  await ctx.close();
 };
 await shot('m-390',{w:390,clip:{x:0,y:0,width:390,height:300}});
 await shot('m-360',{w:360,clip:{x:0,y:0,width:360,height:300}});
 await shot('m-320',{w:320,clip:{x:0,y:0,width:320,height:300}});
 await shot('m-390-cart',{w:390,url:'page-cart.html',clip:{x:0,y:0,width:390,height:160}});
 await shot('m-320-cart',{w:320,url:'page-cart.html',clip:{x:0,y:0,width:320,height:160}});
 await shot('m-390-menu',{w:390,act:async p=>{await p.click('.bf-header__toggle');await p.waitForTimeout(500);}});
 await shot('m-390-scrolled',{w:390,act:async p=>{await p.evaluate(()=>scrollTo(0,420));await p.waitForTimeout(500);},clip:{x:0,y:0,width:390,height:300}});
 await shot('d-1280',{w:1280,h:720,clip:{x:0,y:0,width:1280,height:180}});
 if(errs.length)console.log('PAGE ERRORS',errs); else console.log('no page errors');
 await browser.close();
})();
