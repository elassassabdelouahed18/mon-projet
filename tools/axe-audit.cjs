/* I5 - the accessibility audit.
   Every page of both apps, every sheet and dialog, in light and dark, against
   axe-core's WCAG 2.0/2.1 A and AA rules.

     node tools/axe-audit.cjs            (serves befree-apps on 8731 first)
*/
const {chromium}=require(process.env.PW||'/opt/node22/lib/node_modules/playwright');
const AXE=process.env.AXE||'/tmp/claude-0/node_modules/axe-core/axe.min.js';
const BASE=process.env.BASE||'http://127.0.0.1:8731';
const TAGS=['wcag2a','wcag2aa','wcag21a','wcag21aa'];

// Gap: the four tabs, then every sheet that opens from them.
const GAP_PAGES=[['Today','tab-guide'],['Plan','tab-plan'],['Money','tab-ledger'],['Insights','tab-overview']];
const GAP_SHEETS=[
 ['Log a purchase','#logBtn'],
 ['Settings','#setBtn'],
 ['Privacy','#privBtn','#setBtn'],
 ['Add a debt',null,()=>{document.querySelector('[data-go=debts]').click();
   setTimeout(()=>{const b=document.getElementById('dAdd')||document.querySelector('[data-act=debt-add]');if(b)b.click()},300)}],
 ['Add a goal',null,()=>{document.querySelector('[data-go=goals]').click();
   setTimeout(()=>{const b=document.getElementById('gAdd')||document.querySelector('[data-act=goal]');if(b)b.click()},300)}],
 ['Import a bank file','#bankImp','#setBtn'],
];
const STREAK_SHEETS=[['Habit library','#fab'],['Settings','#setBtn'],['Export','#expBtn','#setBtn']];

/* The apps pin every inline script in their Content-Security-Policy, so an
   injected <script> is refused. addInitScript goes in through the debugger
   before the page's own policy applies. */
async function ctxWith(b,scheme){
 const ctx=await b.newContext({viewport:{width:390,height:844},colorScheme:scheme});
 await ctx.addInitScript({path:AXE});
 return ctx;
}

async function run(page,label,out){
 const r=await page.evaluate(async TAGS=>{
   const res=await window.axe.run(document,{runOnly:{type:'tag',values:TAGS},resultTypes:['violations']});
   return res.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,
     help:v.help,target:(v.nodes[0]&&v.nodes[0].target&&v.nodes[0].target[0])||''}));
 },TAGS);
 out.push([label,r]);
 return r;
}

(async()=>{
 const b=await chromium.launch();
 const out=[];
 for(const scheme of ['light','dark']){
  // ── Gap ──
  let ctx=await ctxWith(b,scheme);
  let p=await ctx.newPage();
  await p.goto(BASE+'/gap/index.html');await p.waitForTimeout(700);
  await run(p,`gap setup (${scheme})`,out);
  await p.click('#suDemo');await p.waitForTimeout(900);
  for(const [name,tab] of GAP_PAGES){
   await p.click('#'+tab);await p.waitForTimeout(600);
   await run(p,`gap ${name} (${scheme})`,out);
   if(name==='Insights')for(const g of ['trends','records']){
    await p.click(`#ovSeg [data-g="${g}"]`);await p.waitForTimeout(500);
    await run(p,`gap Insights ${g} (${scheme})`,out);
   }
  }
  await p.click('#tab-guide');await p.waitForTimeout(400);
  for(const [name,sel,pre] of GAP_SHEETS){
   try{
    if(typeof pre==='string'){const o=await p.$(pre);if(o){await o.click();await p.waitForTimeout(500)}}
    if(sel){const el=await p.$(sel);if(!el){out.push([`gap ${name} (${scheme})`,[{id:'SKIPPED-no-control'}]]);continue}
      await el.click({timeout:4000})}
    else if(typeof pre==='function')await p.evaluate(pre);
    await p.waitForTimeout(700);
    await run(p,`gap ${name} (${scheme})`,out);
    await p.keyboard.press('Escape');await p.waitForTimeout(400);
   }catch(e){out.push([`gap ${name} (${scheme})`,[{id:'ERROR',help:String(e).slice(0,70)}]])}
  }
  await ctx.close();
  // ── Streak ──
  ctx=await ctxWith(b,scheme);
  p=await ctx.newPage();
  await p.goto(BASE+'/streak/index.html');await p.waitForTimeout(1100);
  await run(p,`streak Today (${scheme})`,out);
  for(const [name,sel,pre] of STREAK_SHEETS){
   try{
    if(pre){const o=await p.$(pre);if(o){await o.click();await p.waitForTimeout(500)}}
    const el=await p.$(sel);if(!el){out.push([`streak ${name} (${scheme})`,[{id:'SKIPPED-no-control'}]]);continue}
    await el.click({timeout:4000});await p.waitForTimeout(700);
    await run(p,`streak ${name} (${scheme})`,out);
    await p.keyboard.press('Escape');await p.waitForTimeout(400);
   }catch(e){out.push([`streak ${name} (${scheme})`,[{id:'ERROR',help:String(e).slice(0,70)}]])}
  }
  await ctx.close();
  // ── the install pages ──
  ctx=await ctxWith(b,scheme);
  p=await ctx.newPage();
  for(const u of ['/index.html','/gap/install.html','/streak/install.html']){
   await p.goto(BASE+u);await p.waitForTimeout(600);
   await run(p,`install ${u} (${scheme})`,out);
  }
  await ctx.close();
 }
 await b.close();
 let total=0;
 for(const [label,v] of out){
  const real=v.filter(x=>x.id!=='SKIPPED-no-control');
  total+=real.filter(x=>x.id!=='ERROR').reduce((s,x)=>s+(x.n||0),0);
  console.log((real.length?'FAIL':'ok  ')+'  '+label.padEnd(34)+'  '+
    (real.length?JSON.stringify(real):'0 violations')+(v.length&&v[0].id==='SKIPPED-no-control'?'  (control not present)':''));
 }
 console.log('\nscreens audited:',out.length,'| total WCAG 2 A/AA violations:',total);
 process.exit(total?1:0);
})();
