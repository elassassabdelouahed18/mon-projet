// Real Gap screens for the book's "In the app" panels that the Start Here
// booklet does not already have. Serve befree-apps/ at BASE first, e.g.
//   (cd befree-apps && python3 -m http.server 8124) & node docs/book/src/shots.cjs
const {chromium}=require(process.env.PW||'playwright');const B=process.env.BASE||'http://localhost:8124/';
const out=n=>__dirname+'/shots/'+n+'.png';
(async()=>{const b=await chromium.launch(process.env.CHROME?{executablePath:process.env.CHROME}:{});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,colorScheme:'light',serviceWorkers:'block',isMobile:true,hasTouch:true});
const p=await ctx.newPage();await p.clock.setFixedTime(new Date('2026-09-24T10:30:00'));const errs=[];p.on('pageerror',e=>errs.push(e.message));
const kill=()=>p.evaluate(()=>{if(!document.getElementById('shotcss')){const st=document.createElement('style');st.id='shotcss';st.textContent='#fab,.fab,#nav{visibility:hidden!important}';document.head.appendChild(st)}document.querySelectorAll('.instcard').forEach(e=>e.remove());document.querySelectorAll('#toast,.snack').forEach(e=>e.classList.remove('on'))});
await p.goto(B+'gap/');await p.waitForTimeout(700);await p.click('#suDemo');await p.waitForTimeout(3300);
await p.evaluate(()=>{S.cyc.ess=150;S.cyc.confirmed=today();S.cyc.cardReserve=0;for(let o=1;o<=3;o++)S.reviewed[mKey(o)]=Date.now();S.tx.forEach(x=>{delete x.needsReview});save();render()});
await p.evaluate(()=>go('overview'));await p.waitForTimeout(600);await kill();
const top=async(sel,h,name)=>{const l=p.locator(sel).first();await l.scrollIntoViewIfNeeded();await p.waitForTimeout(400);
 const bb=await l.evaluate((e,h)=>{const r=e.getBoundingClientRect();return {x:r.left,y:r.top+scrollY,width:r.width,height:Math.min(r.height,h)}},h);
 await p.screenshot({path:out(name),clip:bb,fullPage:true});};
await top('#catsCard',560,'gap-where-it-goes');
await p.evaluate(()=>go('debts'));await p.waitForTimeout(500);await kill();
await p.evaluate(()=>{const r=document.getElementById('extra');r.value=100;r.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(500);
await p.evaluate(()=>document.getElementById('extra').closest('.card').id='simShot');await top('#simShot',318,'gap-payoff');
if(errs.length)console.log('page errors:',errs);await b.close();})();
