const {chromium}=require(process.env.PW||'playwright');const B=process.env.BASE||'http://localhost:8124/';const out=n=>__dirname+'/fig/'+n+'.png';
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,colorScheme:'light',serviceWorkers:'block',isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'});
const p=await ctx.newPage();await p.clock.setFixedTime(new Date('2026-09-24T10:30:00'));const errs=[];p.on('pageerror',e=>errs.push(e.message));
const el=async(sel,name,pad=0)=>{const l=p.locator(sel).first();await l.scrollIntoViewIfNeeded();await p.waitForTimeout(250);await l.screenshot({path:out(name)});};
const kill=()=>p.evaluate(()=>{if(!document.getElementById('shotcss')){const st=document.createElement('style');st.id='shotcss';st.textContent='#fab,.fab{visibility:hidden!important}body.noNav #nav,body.noNav .stabs{visibility:hidden!important}';document.head.appendChild(st)}document.body.classList.add('noNav');document.querySelectorAll('.instcard').forEach(e=>e.remove());document.querySelectorAll('#toast,.snack').forEach(e=>e.classList.remove('on'))});
await p.goto(B+'gap/');await p.waitForTimeout(700);await p.click('#suDemo');await p.waitForTimeout(3300);
await p.evaluate(()=>{S.cyc.ess=150;S.cyc.confirmed=today();S.cyc.cardReserve=0;for(let o=1;o<=3;o++)S.reviewed[mKey(o)]=Date.now();S.tx.forEach(x=>{delete x.needsReview});save();render()});await kill();
// Today
await p.evaluate(()=>go('guide'));await p.waitForTimeout(400);await kill();
await el('#homeHero','gap-today-hero');
await el('#actCard','gap-next-step');await el('#upCard','gap-coming-up');
/* I1 put the money check behind Show more on Today */
await p.evaluate(()=>{const t=document.getElementById('todayTog');if(t&&document.getElementById('moreToday').hidden)t.click()});await p.waitForTimeout(350);await kill();
await el('#checkCard','gap-money-check');
await p.evaluate(()=>{scrollTo(0,0);document.body.classList.remove('noNav')});await el('#nav','gap-nav');await kill();
// Insights
await p.evaluate(()=>go('overview'));await p.waitForTimeout(500);await kill();
await el('#posCard','gap-where-you-stand');
const tb=await p.evaluate(()=>{const a=document.getElementById('t1').getBoundingClientRect(),c=document.getElementById('t3').getBoundingClientRect();return {x:a.left-4,y:a.top+scrollY-4,width:c.right-a.left+8,height:Math.max(a.height,c.height)+8}});
await p.screenshot({path:out('gap-tiles'),clip:tb,fullPage:true});
await el('#paceCard','gap-pace');{const l=p.locator('#cycCard');await l.scrollIntoViewIfNeeded();await p.waitForTimeout(250);const bb=await p.evaluate(()=>{const r=document.getElementById('cycCard').getBoundingClientRect();return {x:r.left,y:r.top+scrollY,width:r.width,height:Math.min(r.height,392)}});await p.screenshot({path:out('gap-available'),clip:bb,fullPage:true});}
/* I2 moved the months behind the Trends group */
await p.evaluate(()=>{const b=document.querySelector('#ovSeg [data-g=trends]');if(b)b.click()});await p.waitForTimeout(500);await kill();
await el('#trendCard','gap-trend');
await p.evaluate(()=>{const b=document.querySelector('#ovSeg [data-g=month]');if(b)b.click()});await p.waitForTimeout(400);
// Money
await p.evaluate(()=>go('ledger'));await p.waitForTimeout(400);await kill();
/* the sample file carries eight repeats, so the card is taller than the half
   page it sits in; the shot keeps the head and the first rows */
const rep=p.locator('section.card, .card').filter({hasText:'Paychecks and bills that repeat'}).last();
await rep.scrollIntoViewIfNeeded();await p.waitForTimeout(250);
{const bb=await rep.evaluate(e=>{const r=e.getBoundingClientRect();
  return {x:r.left,y:r.top+scrollY,width:r.width,height:Math.min(r.height,Math.round(r.width*2.05))}});
 await p.screenshot({path:out('gap-repeats'),clip:bb,fullPage:true});}
await p.evaluate(()=>go('goals'));await p.waitForTimeout(400);await kill();
const fund=p.locator('.card').filter({hasText:'Sinking funds'}).last();await fund.scrollIntoViewIfNeeded();await fund.screenshot({path:out('gap-funds')});
await p.evaluate(()=>go('debts'));await p.waitForTimeout(400);await kill();
await el('#creditCard','gap-credit');
// Plan
await p.evaluate(()=>go('plan'));await p.waitForTimeout(500);await kill();
await el('#plPay','gap-plan-pay');await el('#plCal','gap-plan-cal');await el('#plTax','gap-plan-tax');
// Quick log sheet
await p.evaluate(()=>{go('guide');scrollTo(0,0)});await p.waitForTimeout(300);await p.click('#logBtn');await p.waitForTimeout(500);
for(const k of ['1','2','.','5','0']){await p.click(`#pad [data-k="${k}"]`).catch(()=>{});}
await p.waitForTimeout(200);await el('#shTx','gap-log-sheet');await p.keyboard.press('Escape');await p.waitForTimeout(300);
// Split sheet
await p.evaluate(()=>openRoute(520));await p.waitForTimeout(600);await el('#shRoute','gap-split');await p.keyboard.press('Escape');
// Streak
await p.goto(B+'streak/');await p.waitForTimeout(900);await kill();
await p.locator('button',{hasText:'Start this one'}).first().click();await p.waitForTimeout(300);await p.click('#hSave');await p.waitForTimeout(300);
await p.evaluate(()=>{const t=today();S.habits.forEach(h=>{h.created=addD(t,-100);for(let i=1;i<95;i++){if(i%9)S.ticks[h.id+'|'+addD(t,-i)]=(i%6?'d':'s')}});save();render()});await p.waitForTimeout(3200);await kill();
await el('#main > .card.hero','streak-today');
await el('#todoCard','streak-todos');
await p.evaluate(()=>document.querySelector('.stabs [data-tab=chal]').click());await p.waitForTimeout(400);await kill();await el('#chalCard','streak-challenges');
await p.evaluate(()=>document.querySelector('.stabs [data-tab=prog]').click());await p.waitForTimeout(400);await kill();
const bars=p.locator('section.card').filter({has:p.locator('#bars')});await bars.scrollIntoViewIfNeeded();await bars.screenshot({path:out('streak-12weeks')});
await p.evaluate(()=>document.querySelector('.stabs [data-tab=today]').click());await p.waitForTimeout(300);
await p.locator('#todoCard button',{hasText:'Add'}).first().click();await p.waitForTimeout(500);
await p.fill('#tName','Cancel the unused streaming plan').catch(()=>{});await p.fill('#tWorth','192').catch(()=>{});await p.click('#tWhen [data-w=date]').catch(()=>{});await p.waitForTimeout(300);
await el('#shTask','streak-todo-sheet');
console.log('errors',errs);await b.close()})();
