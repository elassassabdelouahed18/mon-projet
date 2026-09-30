/* ══════════ Streak additions ══════════
   Seasonal challenges on the US calendar, a share card with no money
   figures, and encrypted backups. Runs after app.js and uses its state and
   helpers; encryption lives in plus-core.js (BeFreePlus). */
(function(){
const P=BeFreePlus;
/* opened from its own icon: let the install page show it as installed */
try{if(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)localStorage.setItem('befree.installed.streak','1')}catch(e){}
/* challenge records come back from backups too: keep only well-formed ones */
const chal=()=>{if(!S.chal||typeof S.chal!=='object'||Array.isArray(S.chal))S.chal={};
 for(const k of Object.keys(S.chal)){const e=S.chal[k];if(!e||typeof e.from!=='string'||typeof e.to!=='string'||!Array.isArray(e.habits)||!Array.isArray(e.tasks))delete S.chal[k]}
 return S.chal};

const css=document.createElement('style');
css.textContent=`
.chl{display:flex;flex-direction:column;gap:10px}
.chi{border:1px solid var(--hair2);border-radius:var(--rs);padding:12px 14px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:center}
.chi.now{border-color:var(--acc)}.chi .t{font-weight:600;color:var(--tx)}.chi .w{grid-column:1/-1;color:var(--tx3);font-size:13.5px;line-height:1.5}
.chi .btn2{white-space:nowrap}.chbar{grid-column:1/-1;height:7px;border-radius:99px;background:var(--inset);overflow:hidden;border:1px solid var(--hair2)}.chbar i{display:block;height:100%;background:var(--k1)}
.chlater{font-size:13.5px;color:var(--tx3);line-height:1.6;margin-top:10px}
dialog.pxd{border:1px solid var(--hair);border-radius:22px;background:var(--sheet);color:var(--tx);padding:22px 20px;width:min(440px,calc(100vw - 32px))}
dialog.pxd::backdrop{background:rgba(3,12,8,.62);backdrop-filter:blur(4px)}
dialog.pxd h2{font-size:17px;margin:0 0 6px;text-align:center}dialog.pxd p{font-size:14px;color:var(--tx2);line-height:1.55;margin:0 0 12px;text-align:center}
dialog.pxd .err{color:var(--neg);font-size:13.5px;min-height:1.4em;text-align:center;margin:0 0 8px}
dialog.pxd .save{width:100%}dialog.pxd .ghost{width:100%;margin-top:8px}
dialog.pxd img{display:block;width:100%;border-radius:14px;margin:0 0 14px}`;
document.head.appendChild(css);

/* ── seasons: dates follow the US calendar each year ── */
const thanksgiving=y=>{const d=new Date(y,10,1);return iso(new Date(y,10,1+((4-d.getDay()+7)%7)+21))};
const CH=[
 {id:'reset',name:'30-day money reset',any:true,days:30,why:'Log spending every day and review once a week, for 30 days. A clean start any time of year.',
  habits:['log-daily','weekly-review'],todos:[]},
 {id:'newyear',name:'New Year money reset',span:y=>[`${y}-01-01`,`${y}-01-31`],why:'January is when the holiday bills arrive. A weekly review and one subscription check set the tone for the year.',
  habits:['weekly-review','subs-review'],todos:[{title:'Add up what the holidays cost, including card balances',note:'A number to plan next year around.'}]},
 {id:'tax',name:'Tax season',span:y=>[`${y}-02-01`,`${y}-04-15`],why:'Gather your W-2s and 1099s, file by the deadline, and decide where a refund goes before it arrives.',
  habits:[{name:'One tax step',action:'Find one form, answer one question, or file',when:'Saturday morning',small:'Put one tax document in the folder',rule:{t:'week',days:[0,0,0,0,0,0,1]}}],
  todos:[{title:'Decide where your tax refund goes before it arrives',note:'Buffer, a debt, or a sinking fund. Money with a job is harder to lose.'},{title:'Check whether you qualify for free filing (IRS Free File or VITA)',note:'Search irs.gov for Free File and VITA.'}]},
 {id:'school',name:'Back-to-school budget',span:y=>[`${y}-07-15`,`${y}-09-05`],why:'Supplies, clothes and fees land at once. A list and a weekly check keep it inside a number you pick.',
  habits:[{name:'Check school spending against the list',action:'Compare what you bought with the list and the budget',when:'Sunday evening',small:'Look at the total so far',rule:{t:'week',days:[1,0,0,0,0,0,0]}}],
  todos:[{title:'Write the school list with a dollar cap before shopping',note:'Check what you already have at home first.'},{title:'Check your state\'s sales tax holiday dates',note:'Many states drop sales tax on school supplies for a weekend in July or August.'}]},
 {id:'nospend',name:'No-Spend November',span:y=>[`${y}-11-01`,`${y}-11-30`],why:'Three no-spend days a week, essentials excepted. A slip is logged, not a failure.',
  habits:[{name:'No-spend day',action:'Buy nothing beyond essentials; log it if you slip',when:'All day',small:'Skip one impulse buy',rule:{t:'week',days:[0,1,0,1,0,1,0]}}],todos:[]},
 {id:'holiday',name:'Holiday spending plan',span:y=>[addD(thanksgiving(y),1),`${y}-12-31`],why:'From Black Friday to New Year\'s, a gift list with a cap and a weekly check keep January\'s card bill small.',
  habits:[{name:'Check holiday spending against the plan',action:'Add up gifts, travel and food so far and compare with your cap',when:'Sunday evening',small:'Look at the running total',rule:{t:'week',days:[1,0,0,0,0,0,0]}}],
  todos:[{title:'Write a gift list with a dollar cap per person',note:'Decide the total first, then split it.'}]}];
function spanOf(c,t){if(c.any)return null;const y=+t.slice(0,4);
 for(const yy of [y-1,y,y+1]){const [a,b]=c.span(yy);if(b>=t)return{from:a,to:b,key:c.id+'-'+yy}}return null}
function joined(c,t){const e=Object.entries(chal()).filter(([k])=>k.split('-')[0]===c.id).map(([k,v])=>Object.assign({key:k},v)).sort((a,b)=>b.from.localeCompare(a.from))[0];
 return e&&addD(e.to,14)>=t?e:null}
function progress(e){const hs=S.habits.filter(h=>e.habits.includes(h.id));const r=rate(hs,e.from,e.to<today()?e.to:today());return{hs,r}}
function join(c){const t=today(),sp=c.any?{from:t,to:addD(t,c.days-1),key:'reset-'+t}:spanOf(c,t);if(!sp)return;
 const e={from:sp.from<t?t:sp.from,to:sp.to,habits:[],tasks:[],name:c.name};
 c.habits.forEach(h=>{const x=typeof h==='string'?habitFromTpl(h):Object.assign({link:null,tpl:null,ref:null},JSON.parse(JSON.stringify(h)));if(!x)return;
  const used=S.habits.map(y=>y.color),free=HC.findIndex((_,i)=>!used.includes(i));
  const pauses=[{from:addD(e.to,1),to:null}];if(e.from>t)pauses.unshift({from:t,to:addD(e.from,-1)});
  const n=Object.assign({id:uid(),created:t,sched:[{from:t,rule:x.rule}],pauses,dates:[],color:free<0?S.habits.length%HC.length:free,chal:sp.key},
   {name:x.name,action:x.action||'',when:x.when||'',small:x.small||'',link:x.link||null,tpl:x.tpl||null,ref:x.ref||null});
  S.habits.push(n);e.habits.push(n.id)});
 c.todos.forEach(d=>{const x={id:uid(),title:d.title,note:d.note||'',due:e.to,dueWhy:'end of '+c.name,worth:null,src:'own',key:null,created:t,done:null};S.tasks.push(x);e.tasks.push(x.id)});
 chal()[sp.key]=e;refreshDates();save();render();
 toast(e.from>t?`Joined. It starts ${fmtD(e.from)}; until then nothing counts.`:`Joined. ${plural(e.habits.length,'habit')} added until ${fmtD(e.to)}.`)}
window.drawChal=function(){
 const box=$('#chalCard');if(!box||!LIVE){if(box)box.style.display='none';return}
 const t=today(),rows=[],later=[];
 CH.forEach(c=>{const e=joined(c,t);
  if(e){const {hs,r}=progress(e),over=e.to<t,pct=r.t?Math.round(r.r*100):0;
   rows.push({o:0,h:`<div class="chi now"><span class="t">${esc(e.name||c.name)}</span>${over?`<button class="btn2" data-share="${esc(e.key)}">Share</button>`:`<span class="pill ok">${e.from>t?'Starts '+fmtD(e.from):'Until '+fmtD(e.to)}</span>`}
    <div class="chbar" role="img" aria-label="${r.d} of ${r.t} done"><i style="width:${pct}%"></i></div>
    <span class="w">${over?`Finished ${fmtD(e.to)}: ${r.d} of ${r.t} scheduled days done.`:`${r.d} of ${r.t} scheduled so far · ${plural(hs.length,'habit')}.`} Challenge habits pause on their own when it ends.</span></div>`});return}
  const sp=c.any?{from:t}:spanOf(c,t);if(!sp)return;const soon=c.any||sp.from<=addD(t,21);
  if(soon)rows.push({o:c.any?2:1,h:`<div class="chi"><span class="t">${c.name}</span><button class="btn2" data-join="${c.id}">Join</button>
   <span class="w">${c.any?'':sp.from<=t?`On now, until ${fmtD(sp.to)}. `:`${fmtD(sp.from)} to ${fmtD(sp.to)}. `}${c.why}</span></div>`});
  else later.push(`${c.name} (${fmtD(sp.from)})`)});
 rows.sort((a,b)=>a.o-b.o);box.style.display='';
 box.innerHTML=`<div class="ch"><h2 class="eb" id="chalT">Challenges</h2></div><div class="chl">${rows.map(r=>r.h).join('')}</div>
  ${later.length?`<p class="chlater">Later: ${later.join(' · ')}.</p>`:''}`;
 $$('#chalCard [data-join]').forEach(b=>b.onclick=()=>join(CH.find(c=>c.id===b.dataset.join)));
 $$('#chalCard [data-share]').forEach(b=>b.onclick=()=>{const e=chal()[b.dataset.share];const {r}=progress(e);shareCard({big:String(r.d),line:`days of money habits in ${e.name}`,sub:'Finished with BeFree Streak'})});
 const sh=$('#shareTop');if(sh)sh.style.display=streak()>=7?'':'none'};

/* ── share card: a picture with no money figures in it ── */
async function drawShare(o){
 const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
 try{await Promise.all(['900 150px Fraunces','600 44px Poppins','500 34px Poppins'].map(f=>document.fonts.load(f)))}catch(e){}
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#07533C');g.addColorStop(1,'#021A13');x.fillStyle=g;x.fillRect(0,0,W,H);
 await new Promise(r=>{const im=new Image();im.onload=()=>{x.drawImage(im,90,90,150,150);r()};im.onerror=r;im.src=iconURL(300)});
 x.fillStyle='#E8D1BA';x.font='600 40px Poppins, sans-serif';x.fillText('BeFree Streak',270,180);
 x.fillStyle='#EDA335';x.font='900 300px Fraunces, Georgia, serif';x.fillText(o.big,90,640);
 x.fillStyle='#F6EEE2';x.font='600 60px Poppins, sans-serif';wrap(x,o.line,90,740,W-180,74);
 x.fillStyle='#A6D8BE';x.font='500 40px Poppins, sans-serif';wrap(x,o.sub,90,1010,W-180,54);
 x.fillStyle='rgba(232,209,186,.75)';x.font='500 34px Poppins, sans-serif';x.fillText('No bank login. No account. '+location.host,90,H-100);
 return new Promise(r=>c.toBlob(r,'image/png'))}
function wrap(x,s,px,py,w,lh){let line='',y=py;String(s).split(' ').forEach(word=>{const t=line?line+' '+word:word;if(x.measureText(t).width>w&&line){x.fillText(line,px,y);line=word;y+=lh}else line=t});if(line)x.fillText(line,px,y)}
async function shareCard(o){
 const blob=await drawShare(o);if(!blob){toast('This browser cannot make the picture');return}
 const file=new File([blob],'my-streak.png',{type:'image/png'}),url=URL.createObjectURL(blob);
 const d=document.createElement('dialog');d.className='pxd';d.setAttribute('aria-label','Share your progress');
 d.innerHTML=`<h2>Share your progress</h2><p>The picture shows days, never money. Nothing is posted unless you choose where.</p><img alt="${esc(o.big+' '+o.line)}" src="${url}">
  ${navigator.canShare&&navigator.canShare({files:[file]})?'<button type="button" class="save" id="shGo">Share…</button>':''}<button type="button" class="${navigator.canShare&&navigator.canShare({files:[file]})?'ghost':'save'}" id="shDl">Save the picture</button><button type="button" class="ghost" id="shNo">Close</button>`;
 document.body.appendChild(d);const end=()=>{try{d.close()}catch(e){}d.remove();setTimeout(()=>URL.revokeObjectURL(url),4000)};
 d.addEventListener('cancel',e=>{e.preventDefault();end()});d.querySelector('#shNo').onclick=end;
 d.querySelector('#shDl').onclick=()=>{const a=document.createElement('a');a.href=url;a.download='my-streak.png';document.body.appendChild(a);a.click();a.remove()};
 const go=d.querySelector('#shGo');if(go)go.onclick=async()=>{try{await navigator.share({files:[file],text:`${o.big} ${o.line}.`})}catch(e){}};
 d.showModal()}
function shareNow(){const n=streak(),b=bestStreak();
 if(!S.habits.length){toast('Add a habit first');return}
 if(!b){toast('Tick a habit first. The picture shows your run of days.');return}
 shareCard(n>=1?{big:String(n),line:n===1?'day in a row of money habits':'days in a row of money habits',sub:b>n?`Best run so far: ${b} days`:'Small steps, done on purpose'}
  :{big:String(b),line:'days: my best run of money habits so far',sub:'Starting the next one today'})}
const top=document.querySelector('.htop');
if(top){const b=document.createElement('button');b.type='button';b.className='lnk';b.id='shareTop';b.textContent='Share';b.style.display='none';b.onclick=shareNow;top.appendChild(b)}
$('#shareOpen').onclick=()=>{closeAll();shareNow()};

/* ── encrypted backups ── */
function passDialog({title,body,confirm,ok,run}){return new Promise(res=>{
 const d=document.createElement('dialog');d.className='pxd';d.setAttribute('aria-labelledby','pxdT');
 d.innerHTML=`<h2 id="pxdT">${esc(title)}</h2><p>${esc(body)}</p>
  <div class="fld"><label for="pxP1">Passphrase</label><input id="pxP1" type="password" autocomplete="${confirm?'new-password':'current-password'}"></div>
  ${confirm?'<div class="fld"><label for="pxP2">Type it again</label><input id="pxP2" type="password" autocomplete="new-password"></div>':''}
  <div class="err" id="pxErr" role="alert"></div><button type="button" class="save" id="pxOk">${esc(ok)}</button><button type="button" class="ghost" id="pxNo">Cancel</button>`;
 document.body.appendChild(d);let done=false;
 const end=v=>{if(done)return;done=true;try{d.close()}catch(e){}d.remove();res(v)};
 const err=m=>{d.querySelector('#pxErr').textContent=m};
 d.addEventListener('cancel',e=>{e.preventDefault();end(null)});d.querySelector('#pxNo').onclick=()=>end(null);
 const go=async()=>{const a=d.querySelector('#pxP1').value,b=confirm?d.querySelector('#pxP2').value:a;
  if(a.length<8){err('Use at least 8 characters.');return}if(a!==b){err('The two entries do not match.');return}
  const btn=d.querySelector('#pxOk'),was=btn.textContent;btn.disabled=true;btn.textContent='Working…';
  try{end(await run(a))}catch(e){err(e.message||'Something went wrong.');btn.disabled=false;btn.textContent=was}};
 d.querySelector('#pxOk').onclick=go;d.querySelectorAll('input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go()}}));
 d.showModal();setTimeout(()=>d.querySelector('#pxP1').focus(),30)})}
$('#expLock').onclick=async()=>{
 const ok=await passDialog({title:'Encrypted backup',body:'Choose a passphrase. You will need it to restore this file, and nobody can recover it for you.',confirm:true,ok:'Save encrypted backup',
  run:async pass=>{const txt=await P.encryptBackup(JSON.stringify(Object.assign({app:'befree-streak',exported:new Date().toISOString()},S),null,1),pass,'streak');
   const u=URL.createObjectURL(new Blob([txt],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=`befree-streak-${today()}-encrypted.json`;
   document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);S.lastExport=today();save();return true}});
 if(ok){closeAll();toast('Encrypted backup saved. Keep the passphrase somewhere safe.')}};
window.plusUnlock=o=>passDialog({title:'Open encrypted backup',body:o.created?`Saved ${new Date(o.created).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}. Enter its passphrase.`:'Enter its passphrase.',ok:'Open',run:pass=>P.decryptBackup(o,pass)});

/* ── three tabs: Today, Challenges, Progress ── */
const TABS=[['today','Today','<rect x="4" y="4" width="16" height="16" rx="4"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>'],
 ['chal','Challenges','<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>'],['prog','Progress','<path d="M5 19v-7M10 19V6M15 19v-8M20 19V9"/>']];
const main=$('#main'),place=(el,t)=>{if(el)el.dataset.t=t};
place(document.querySelector('#main > .card.hero'),'today');['#todoCard','#revCard'].forEach(s=>place($(s),'today'));
place($('#chalCard'),'chal');place($('#tiles'),'prog');place(document.querySelector('#main > .bento'),'prog');
$$('#main > section').forEach(s=>{if(!s.dataset.t)place(s,'prog')});
const tabs=document.createElement('nav');tabs.className='stabs';tabs.setAttribute('aria-label','Streak sections');
tabs.innerHTML=TABS.map(([k,l,d])=>`<button type="button" data-tab="${k}" aria-pressed="${k==='today'}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg><span>${l}</span></button>`).join('');
main.parentNode.insertBefore(tabs,main);
function setTab(t,keep){document.body.dataset.stab=t;$$('.stabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===t)));
 if(!keep)scrollTo({top:0});render()}
tabs.onclick=e=>{const b=e.target.closest('button');if(b)setTab(b.dataset.tab)};
document.body.dataset.stab='today';
const tcss=document.createElement('style');tcss.textContent=`
body[data-stab=today] #main>[data-t]:not([data-t=today]),body[data-stab=chal] #main>[data-t]:not([data-t=chal]),body[data-stab=prog] #main>[data-t]:not([data-t=prog]){display:none!important}
.stabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:3px;padding:3px;border:1px solid var(--hair);border-radius:99px;margin:0 0 14px;background:var(--card)}
.stabs button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:var(--tap);border-radius:99px;font-size:14px;font-weight:500;color:var(--tx2)}
.stabs button[aria-pressed=true]{background:var(--btn);color:var(--btnT);font-weight:600}
@media(max-width:640px){.stabs{position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:50;margin:0;border-radius:20px;padding:4px;
  background:var(--sheet);backdrop-filter:blur(18px);box-shadow:var(--sh)}
 .stabs button{flex-direction:column;gap:2px;font-size:12px;border-radius:16px;min-height:52px}
 .stabs button[aria-pressed=true]{background:var(--inset);color:var(--acc-text)}
 .fab{bottom:calc(84px + env(safe-area-inset-bottom))}
 .wrap{padding-bottom:calc(96px + env(safe-area-inset-bottom))}}
[data-theme=light] #main>.card.hero{background:#F4E3BC;border-color:#E8D29E}
.instcard.float{position:static;box-shadow:none;animation:none;margin:14px 0;width:auto}
@media(max-width:640px){.toast{bottom:calc(96px + env(safe-area-inset-bottom))!important;border-radius:14px}}
@media(min-width:641px){.toast{bottom:28px!important}}
body.locked .toast{opacity:0!important}`;
document.head.appendChild(tcss);
/* an install card that arrives after load goes below the content, so nothing jumps or gets covered */
new MutationObserver(()=>{const c=document.querySelector('body > .instcard');if(c){c.classList.remove('float');main.insertAdjacentElement('afterend',c)}}).observe(document.body,{childList:true});

drawChal();
})();
