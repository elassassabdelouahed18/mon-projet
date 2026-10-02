/* ══════════ Gap additions ══════════
   The Plan page (paychecks ahead, extra paychecks, bill calendar, estimated
   taxes, employer match, mileage), bank file import, credit card use and
   encrypted backups. Runs after app.js and uses its state and helpers.
   Pure calculations live in plus-core.js (BeFreePlus). */
(function(){
const P=BeFreePlus;
/* opened from its own icon: let the install page show it as installed */
try{if(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)localStorage.setItem('befree.installed.gap','1')}catch(e){}
const plus=()=>{if(!S.plus||typeof S.plus!=='object')S.plus={};return S.plus};
const miles=()=>{if(!Array.isArray(S.miles))S.miles=[];S.miles=S.miles.filter(m=>m&&typeof m.date==='string'&&m.date.length===10);return S.miles};
const mon=(m,o)=>new Date(+m.slice(0,4),+m.slice(5,7)-1,1).toLocaleDateString('en-US',o||{month:'long',year:'numeric'});

const css=document.createElement('style');
css.textContent=`
.pxl{display:flex;flex-direction:column}
.pxr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 12px;padding:10px 0;border-bottom:1px solid var(--hair2);font-size:14px}
.pxr:last-child{border-bottom:0}.pxr .k{font-weight:600;color:var(--tx)}.pxr .s{grid-column:1/-1;color:var(--tx3);font-size:13px;line-height:1.5}
.pxr .v{text-align:right;font-family:'IBM Plex Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums}
.pxcal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin:6px 0 10px}
.pxcal .h{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);text-align:center;padding:2px 0}
.pxcal button{min-height:52px;border:1px solid var(--hair2);border-radius:10px;padding:5px 4px;text-align:left;display:flex;flex-direction:column;gap:3px;color:var(--tx2);font-size:12px;background:transparent}
.pxcal button[aria-pressed=true]{border-color:var(--acc);background:var(--inset)}
.pxcal button.today .n{color:var(--acc-text);font-weight:700}
.pxcal .n{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:12px}
.pxcal .dots{display:flex;gap:3px;flex-wrap:wrap}.pxcal .dots i{width:7px;height:7px;border-radius:50%;background:var(--warn)}.pxcal .dots i.in{background:var(--acc2)}.pxcal .dots i.tax{background:var(--neg)}
.pxcal .blank{border:0}
.pxleg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--tx3);margin-bottom:8px}.pxleg i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:var(--warn)}.pxleg i.in{background:var(--acc2)}.pxleg i.tax{background:var(--neg)}
.pxrow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}
.pxbar{height:8px;border-radius:99px;background:var(--inset);border:1px solid var(--hair2);overflow:hidden;margin:6px 0 2px}.pxbar i{display:block;height:100%;background:var(--acc2)}.pxbar i.high{background:var(--neg)}.pxbar i.moderate{background:var(--warn)}
.pxform{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.pxform .fld{margin:0}.pxform .wide{grid-column:1/-1}
@media(min-width:760px){.pxform.four{grid-template-columns:repeat(4,minmax(0,1fr))}}
.pxbank{max-height:46dvh;overflow:auto;border:1px solid var(--hair2);border-radius:var(--rs);margin:10px 0}
.pxbank label{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:4px 10px;align-items:center;padding:10px 12px;border-bottom:1px solid var(--hair2);font-size:13.5px}
.pxbank label:last-child{border-bottom:0}.pxbank input[type=checkbox]{width:20px;height:20px;accent-color:var(--acc)}
.pxbank .d{color:var(--tx3);font-size:12.5px}.pxbank .a{font-family:'IBM Plex Mono',ui-monospace,monospace;text-align:right}.pxbank .a.in{color:var(--acc2)}
.pxbank select{grid-column:2/-1;border:1px solid var(--hair3);border-radius:8px;padding:6px 8px;background:var(--card);color:var(--tx);font-size:13px;min-height:36px}
.pxbank .why{grid-column:2/-1;color:var(--warn);font-size:12.5px}
dialog.pxd{border:1px solid var(--hair);border-radius:var(--rx);background:var(--sheet);color:var(--tx);padding:22px 20px;width:min(440px,calc(100vw - 32px));box-shadow:var(--sh)}
dialog.pxd::backdrop{background:rgba(3,12,8,.62);backdrop-filter:blur(4px)}
dialog.pxd h2{font-size:17px;margin:0 0 6px;text-align:center}dialog.pxd p{font-size:14px;color:var(--tx2);line-height:1.55;margin:0 0 12px;text-align:center}
dialog.pxd .err{color:var(--neg);font-size:13.5px;min-height:1.4em;text-align:center;margin:0 0 8px}
dialog.pxd .save{width:100%}dialog.pxd .ghost{width:100%;margin-top:8px}
/* Today */
.homehero{background:var(--hero-bg)!important;color:#F6EEE2;border:0!important;padding:22px 22px 20px!important}
.homehero .hh-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.homehero .hh-eb{margin:0;color:#A6D8BE}
.hh-badge{font-size:12px;font-weight:500;padding:3px 10px;border-radius:99px;border:1px solid rgba(232,209,186,.35);color:#E8D1BA}
.hh-num{font-size:clamp(52px,17vw,76px);line-height:1.02;letter-spacing:-.025em;margin:6px 0 2px;font-variant-numeric:tabular-nums;color:#F6EEE2}
.hh-num.neg{color:#F9B06A}
.hh-lead{font-size:30px;line-height:1.15;margin:8px 0 4px;color:#F6EEE2}
.hh-sub{margin:0;font-size:15px;color:#D6E6DA}.hh-sub b{color:#F6EEE2;font-weight:600}
.hh-bar{height:8px;border-radius:99px;background:rgba(232,209,186,.18);margin:14px 0 8px;overflow:hidden}.hh-bar i{display:block;height:100%;border-radius:99px;background:#E7A33A}
.hh-row{display:flex;justify-content:space-between;gap:10px;font-size:13.5px;color:#D6E6DA;flex-wrap:wrap}.hh-row b{color:#F6EEE2}
.hh-fix,.hh-cta{margin-top:16px;width:100%;min-height:48px;border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;font-size:14px;text-align:left}
.hh-fix{background:rgba(232,209,186,.1);border:1px dashed rgba(232,209,186,.4);color:#F6EEE2}.hh-fix b{font-weight:600}.hh-n{color:#F2B85E;font-weight:600;white-space:nowrap}
.hh-cta{justify-content:center;background:#E7A33A;color:#2E2910;font-weight:600;font-size:16px;border:0}
.homelog{display:block;grid-column:1/-1}
.mi2>.btn2{flex:none;white-space:nowrap;overflow-wrap:normal}
#revisionFIDialog{margin:auto;border:1px solid var(--hair3);box-shadow:0 30px 60px -24px rgba(0,0,0,.55);max-height:86vh;overflow:auto;overscroll-behavior:contain}
#revisionFIDialog::backdrop{background:rgba(4,18,12,.55)}
#revisionFIDialog h2{font-size:21px;line-height:1.2;margin:0 0 8px}
#revisionFIDialog p{font-size:14.5px;color:var(--tx2)}
.logbtn{width:100%;min-height:58px;border-radius:18px;background:var(--btn);color:var(--btnT);font-size:17px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:var(--lift)}
body[data-page=guide] .fab{display:none!important}
/* segmented control for sub-pages */
.subnav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:4px;border-radius:14px;background:var(--inset);border:1px solid var(--hair2);margin:0 0 14px}
.subnav button{min-height:40px;border-radius:10px;font-size:14px;font-weight:500;color:var(--tx2)}
.subnav button[aria-pressed=true]{background:var(--card);color:var(--tx);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.12)}
/* quick log */
#shTx.quick #seg,#shTx.quick #stSeg,#shTx.quick #refWrap,#shTx.quick #linkWrap,#shTx.quick .two,#shTx.quick #revisionTx,#shTx.quick #txDel{display:none!important}
#shTx:not(.quick) .qmore{display:none}
#shTx.quick .amt .v{font-size:52px}
#shTx.quick #cpick{max-height:none}#shTx.quick #cpick .qhide{display:none}#shTx.quick #cpick .addc{display:none}
#cpick .qall{padding:8px 13px;border-radius:99px;border:1px dashed var(--hair3);color:var(--tx2);font-size:13.5px}
#shTx:not(.quick) #cpick .qall{display:none}
.qmore{width:100%;margin-top:8px}
@media(max-height:720px){#shTx.quick .amt{padding:0 0 4px}#shTx.quick .amt .v{font-size:40px}#shTx.quick .pad{gap:6px}#shTx.quick .pad button{min-height:46px;padding:10px 0}#shTx.quick #cpick{margin-bottom:8px}#shTx.quick .stitle{margin-bottom:2px}}
/* undo bar: above the tab bar and the add button */
.snack{position:fixed;left:12px;right:12px;bottom:calc(154px + env(safe-area-inset-bottom));z-index:92;max-width:460px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;
 padding:8px 8px 8px 16px;border-radius:16px;background:#13251C;color:#F6EEE2;font-size:14px;box-shadow:0 14px 30px -14px rgba(0,0,0,.5);opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .25s,transform .25s}
.snack.on{opacity:1;transform:none;pointer-events:auto}
.snack button{min-height:44px;padding:0 16px;border-radius:12px;background:#2C4A3C;color:#F2B85E;font-weight:600}
@media(min-width:641px){.snack{bottom:28px}}
.toast{bottom:calc(96px + env(safe-area-inset-bottom))!important;border-radius:14px}
body.locked .toast{opacity:0!important}
@media(min-width:641px){.toast{bottom:28px!important}}
.instcard.float{position:static;box-shadow:none;animation:none;margin:0 0 14px;width:auto}
:root{--hero-bg:#113C1E}html[data-theme=dark]{--hero-bg:#0A4A36}
@media(prefers-reduced-motion:reduce){.snack{transition:none}}`;
document.head.appendChild(css);

/* ── passphrase dialog: top layer, so it also works over the first-run screen ── */
function passDialog({title,body,confirm,ok,run}){return new Promise(res=>{
 const d=document.createElement('dialog');d.className='pxd';d.setAttribute('aria-labelledby','pxdT');
 d.innerHTML=`<h2 id="pxdT">${esc(title)}</h2><p>${esc(body)}</p>
  <div class="fld"><label for="pxP1">Passphrase</label><input id="pxP1" type="password" autocomplete="${confirm?'new-password':'current-password'}" minlength="8"></div>
  ${confirm?'<div class="fld"><label for="pxP2">Type it again</label><input id="pxP2" type="password" autocomplete="new-password"></div>':''}
  <div class="err" id="pxErr" role="alert"></div><button type="button" class="save" id="pxOk">${esc(ok)}</button><button type="button" class="ghost" id="pxNo">Cancel</button>`;
 document.body.appendChild(d);let done=false;
 const end=v=>{if(done)return;done=true;try{d.close()}catch(e){}d.remove();res(v)};
 const err=m=>{d.querySelector('#pxErr').textContent=m};
 d.addEventListener('cancel',e=>{e.preventDefault();end(null)});
 d.querySelector('#pxNo').onclick=()=>end(null);
 const go=async()=>{const a=d.querySelector('#pxP1').value,b=confirm?d.querySelector('#pxP2').value:a;
  if(a.length<8){err('Use at least 8 characters.');return}
  if(a!==b){err('The two entries do not match.');return}
  const btn=d.querySelector('#pxOk');btn.disabled=true;const was=btn.textContent;btn.textContent='Working…';
  try{end(await run(a))}
  catch(e){err(e.message||'Something went wrong.');btn.disabled=false;btn.textContent=was}};
 d.querySelector('#pxOk').onclick=go;
 d.querySelectorAll('input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go()}}));
 d.showModal();setTimeout(()=>d.querySelector('#pxP1').focus(),30)})}
const askPass=(o,run)=>passDialog(Object.assign({run},o));

function backupText(){return JSON.stringify(Object.assign({app:'befree-gap',exported:new Date().toISOString()},S),null,1)}
async function exportLocked(){
 const ok=await askPass({title:'Encrypted backup',body:'Choose a passphrase. You will need it to restore this file, and nobody can recover it for you.',confirm:true,ok:'Save encrypted backup'},
  async pass=>{const txt=await P.encryptBackup(backupText(),pass,'gap');S.lastExport=today();DB.s(KEY,S);
   dl(`befree-gap-${today()}-encrypted.json`,txt,'application/json');return true});
 if(ok){closeAll();toast('Encrypted backup saved. Keep the passphrase somewhere safe.')}}
/* called by the restore handler in app.js for an encrypted file */
window.plusUnlock=o=>askPass({title:'Open encrypted backup',body:o.created?`Saved ${new Date(o.created).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}. Enter its passphrase.`:'Enter its passphrase.',ok:'Open'},pass=>P.decryptBackup(o,pass));

/* ══════════ Plan page ══════════ */
function paycheckCard(){
 const box=$('#plPay'),p=primary(),t=today();
 if(!p){box.innerHTML=`<div class="ch"><h2 class="eb">Paychecks ahead</h2></div>${empty('money','No pay schedule yet','Add your paycheck to see which bills each one has to cover.')}<div class="pxrow"><button class="btn2" id="plPaySet">Set my pay schedule</button></div>`;
  $('#plPaySet').onclick=()=>openPay();return}
 const est=recEst(p),start=lastPay(p,t)||t,list=paydays(p,start,addD(t,130)).slice(0,5);
 const rows=list.map((d,i)=>{const to=list[i+1]?addD(list[i+1],-1):addD(d,p.freq==='weekly'?6:13);
  const bills=planned(d<t?t:d,to).filter(x=>x.flow<0),out=sum(bills,x=>x.amt),left=est.amt-out;
  const names=bills.slice(0,3).map(x=>esc(x.name)).join(', ')+(bills.length>3?` +${bills.length-3}`:'');
  return `<div class="pxr"><span class="k">${d<=t&&d===start?'This paycheck':fmtD(d,{weekday:'short',month:'short',day:'numeric'})}</span>
   <span class="v ${left<0?'neg':''}">${money(left)} left</span>
   <span class="s">${money(est.amt)}${est.est?' (planning amount)':''} in · ${bills.length?`${money(out)} scheduled out: ${names}`:'nothing scheduled before the next one'}</span></div>`}).join('');
 box.innerHTML=`<div class="ch"><h2 class="eb">Paychecks ahead</h2><div class="eb mono">${FREQ_L[p.freq]}</div></div><div class="pxl">${rows}</div>
  <p class="foot">Each paycheck covers the scheduled bills due before the next one. ${est.est?`Pay that changes uses ${esc(est.basis)}.`:''} Spending you haven't planned still needs room.</p>`}

function extraCard(){
 const box=$('#plExtra'),p=primary();
 const head=`<div class="ch"><h2 class="eb">Extra paychecks</h2></div>`;
 if(!p){box.innerHTML=head+`<p class="foot">Once your pay schedule is set, this shows the months with an extra paycheck.</p>`;return}
 if(p.freq!=='weekly'&&p.freq!=='biweekly'){box.innerHTML=head+`<p class="foot">You're paid ${FREQ_L[p.freq]}, so every month has the same number of paychecks. Paid every two weeks, two months a year bring a third one.</p>`;return}
 const t=today(),from=t.slice(0,8)+'01',ms=P.extraPayMonths(paydays(p,from,addD(from,395)),p.freq).filter(m=>m.month<=addD(from,364).slice(0,7));
 const amt=recEst(p).amt;
 box.innerHTML=head+(ms.length?`<div class="pxl">${ms.map(m=>`<div class="pxr"><span class="k">${mon(m.month)}</span><span class="v">+${money(amt*m.extra.length)}</span>
  <span class="s">${m.dates.length} paydays; the extra one lands ${m.extra.map(d=>fmtD(d,{weekday:'short',month:'short',day:'numeric'})).join(' and ')}</span></div>`).join('')}</div>
  <p class="foot">Most budgets are built on ${p.freq==='weekly'?'four':'two'} paychecks a month, so an extra one is free to plan. Decide now where it goes: your buffer, a debt, or a sinking fund.</p>`
  :`<p class="foot">No extra paychecks in the next 12 months.</p>`)}

/* ── bill calendar ── */
function monthItems(from,to){const out=[];
 S.rec.filter(r=>r.on!==false).forEach(r=>occ(r,from,to,{all:true}).forEach(d=>{if(r.start&&d<r.start)return;
  out.push({date:d,name:r.note||r.cat,amt:+r.amt||0,kind:r.kind==='income'?'in':'out',paid:matched(r,d),uid:r.id+'-'+d})}));
 S.tx.filter(t=>t.status==='planned'&&t.date>=from&&t.date<=to).forEach(t=>out.push({date:t.date,name:t.note||t.cat,amt:+t.amt||0,kind:t.type==='income'?'in':'out',uid:t.id}));
 if(S.tax.on){[+from.slice(0,4)-1,+from.slice(0,4)].forEach(y=>P.quarterlyDue(y).forEach(q=>{if(q.due>=from&&q.due<=to)out.push({date:q.due,name:`Estimated tax, Q${q.q} ${y}`,amt:null,kind:'tax',uid:`tax-${y}-${q.q}`})}))}
 return out.sort((a,b)=>a.date.localeCompare(b.date)||(a.kind==='in'?-1:1))}
let calOff=0,calSel=null;
function calCard(){
 const box=$('#plCal'),n=new Date();const m0=new Date(n.getFullYear(),n.getMonth()+calOff,1);
 const from=iso(m0),to=iso(new Date(m0.getFullYear(),m0.getMonth()+1,0)),t=today();
 const items=monthItems(from,to),by={};items.forEach(x=>(by[x.date]=by[x.date]||[]).push(x));
 if(!calSel||calSel<from||calSel>to)calSel=t>=from&&t<=to?t:from;
 let cells=DN_S.map(d=>`<div class="h" aria-hidden="true">${d}</div>`).join('')+'<div class="blank"></div>'.repeat(m0.getDay());
 for(let d=from;d<=to;d=addD(d,1)){const l=by[d]||[];
  cells+=`<button type="button" data-d="${d}" aria-pressed="${d===calSel}" class="${d===t?'today':''}" aria-label="${fmtD(d,{weekday:'long',month:'long',day:'numeric'})}: ${l.length?esc(l.map(x=>x.name).join(', ')):'nothing scheduled'}">
   <span class="n">${+d.slice(8)}</span><span class="dots">${l.slice(0,4).map(x=>`<i class="${x.kind}"></i>`).join('')}</span></button>`}
 const sel=by[calSel]||[],outM=sum(items.filter(x=>x.kind==='out'),x=>x.amt),inM=sum(items.filter(x=>x.kind==='in'),x=>x.amt);
 box.innerHTML=`<div class="ch"><h2 class="eb">Bill calendar</h2>
   <div class="pnav" style="margin:0"><button id="calPrev" aria-label="Previous month">‹</button><div class="plbl mono">${mon(from,{month:'short',year:'numeric'})}</div><button id="calNext" aria-label="Next month">›</button></div></div>
  <div class="pxleg"><span><i></i>Bill or transfer</span><span><i class="in"></i>Payday</span>${S.tax.on?'<span><i class="tax"></i>Estimated tax due</span>':''}</div>
  <div class="pxcal">${cells}</div>
  <div class="pxl" aria-live="polite"><div class="pxr"><span class="k">${fmtD(calSel,{weekday:'long',month:'long',day:'numeric'})}</span><span class="v"></span>
   <span class="s">${sel.length?sel.map(x=>`${esc(x.name)}${x.amt!=null?` · ${money(x.amt)}`:''}${x.paid?' · done':''}`).join('<br>'):'Nothing scheduled.'}</span></div></div>
  <p class="foot">This month: ${money(inM)} scheduled in, ${money(outM)} scheduled out.</p>
  <div class="pxrow"><label class="chk" style="padding:0"><input type="checkbox" id="icsAmt" ${plus().icsAmt?'checked':''}><span>Include amounts</span></label>
   <button class="btn2" id="icsGo">Add the next 12 months to my calendar</button></div>
  <p class="foot">Downloads a calendar file (.ics) that Apple Calendar, Google Calendar and Outlook can import, with a reminder the day before each bill. Calendars sync to their own cloud, so amounts are left out unless you include them.</p>`;
 $('#calPrev').onclick=()=>{calOff--;calCard()};$('#calNext').onclick=()=>{calOff++;calCard()};
 $$('#plCal .pxcal button').forEach(b=>b.onclick=()=>{calSel=b.dataset.d;calCard();const f=$(`#plCal [data-d="${calSel}"]`);f&&f.focus()});
 $('#icsAmt').onchange=e=>{plus().icsAmt=e.target.checked;save()};
 $('#icsGo').onclick=exportICS}
const DN_S=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function exportICS(){const t=today(),inc=!!plus().icsAmt;
 const ev=monthItems(t,addD(t,365)).filter(x=>!x.paid).map(x=>({uid:x.uid+'@befree-gap',date:x.date,
  title:x.kind==='in'?`Payday: ${x.name}${inc&&x.amt?` (${money(x.amt)})`:''}`:x.kind==='tax'?x.name:`Due: ${x.name}${inc&&x.amt?` (${money(x.amt)})`:''}`,
  desc:x.kind==='tax'?'Federal estimated tax payment (Form 1040-ES). Confirm the date and your state\'s schedule at irs.gov.':'From BeFree Gap.',alarm:x.kind==='in'?0:1}));
 if(!ev.length){toast('Nothing scheduled in the next 12 months yet');return}
 dl(`befree-gap-bills-${t}.ics`,P.buildICS(ev,{name:'BeFree Gap bills'}),'text/calendar');toast(`${plural(ev.length,'date')} saved to a calendar file`)}

/* ── estimated taxes (1040-ES) ── */
function taxCard(){
 const box=$('#plTax'),t=today(),y=+t.slice(0,4);
 const head=`<div class="ch"><h2 class="eb">Estimated taxes</h2><div class="eb mono">1040-ES</div></div>`;
 if(!S.tax.on){box.innerHTML=head+`<p class="foot" style="margin-top:0">Freelance, gig or other 1099 income has no tax withheld, and the IRS expects payments four times a year. Turn on the tax reserve to see each deadline and what to set aside.</p>
  <div class="pxrow"><button class="btn2" id="taxOn">Turn on the tax reserve</button></div>`;
  $('#taxOn').onclick=()=>{S.tax.on=true;save();render();toast('Tax reserve is on. Check the rate and income types in Settings.')};return}
 const qs=P.quarterlyDue(y-1).filter(q=>q.q===4&&q.due>=addD(t,-20)).map(q=>Object.assign({y:y-1},q)).concat(P.quarterlyDue(y).map(q=>Object.assign({y},q)));
 const next=qs.find(q=>q.due>=t);
 box.innerHTML=head+`<div class="pxl">${qs.map(q=>{const e=taxEst(S.tx.filter(x=>x.date>=q.from&&x.date<=q.to));
  const st=q.due<t?'past':q===next?'next':'';
  return `<div class="pxr"><span class="k">${st==='next'?'<span class="pill warn">Next</span> ':''}Q${q.q} ${q.y}: due ${fmtD(q.due,{month:'short',day:'numeric',year:+q.due.slice(0,4)!==y?'numeric':undefined})}</span>
   <span class="v">${money(e.need)}</span><span class="s">Income ${fmtD(q.from)} to ${fmtD(q.to)}${st==='past'?' · date has passed':''}${q.to>t&&q.from<=t?' · so far':''}</span></div>`}).join('')}</div>
  <p class="foot">Amounts use your reserve rate of ${+S.tax.rate||0}% on income with no withholding, so they are estimates, not a tax bill. A due date on a weekend or DC holiday moves to the next business day. States have their own schedules. Confirm at irs.gov/payments.</p>`}

/* ── employer 401(k) match ── */
const MATCH=[['100-3-50-2','100% of first 3%, 50% of next 2%',[{rate:100,upTo:3},{rate:50,upTo:2}]],['50-6','50% of the first 6%',[{rate:50,upTo:6}]],
 ['100-4','100% of the first 4%',[{rate:100,upTo:4}]],['100-6','100% of the first 6%',[{rate:100,upTo:6}]],['custom','Something else',null]];
function matchCard(){
 const box=$('#plMatch'),k=plus().k401||{},p=primary();
 const guess=p?Math.round(recEst(p).amt*(PER_MONTH[p.freq]||1)*12):'';
 const f=MATCH.find(x=>x[0]===k.formula)||MATCH[0],tiers=f[2]||[{rate:+k.r1||0,upTo:+k.u1||0},{rate:+k.r2||0,upTo:+k.u2||0}];
 const salary=+k.salary||0,res=P.match401k({salary,pct:+k.pct||0,tiers});
 const per=p?res.missing/((PER_MONTH[p.freq]||1)*12):null;
 box.innerHTML=`<div class="ch"><h2 class="eb">Employer 401(k) match</h2></div>
  <div class="pxform">
   <div class="fld"><label for="kSal">Pay per year, before tax</label><input id="kSal" type="number" inputmode="decimal" min="0" value="${+k.salary||''}" placeholder="${guess?guess:'52000'}"></div>
   <div class="fld"><label for="kPct">You put in, %</label><input id="kPct" type="number" inputmode="decimal" min="0" max="100" step="0.5" value="${k.pct==null||k.pct===''?'':+k.pct||0}" placeholder="0"></div>
   <div class="fld wide"><label for="kF">Your employer matches</label><select id="kF">${MATCH.map(x=>optVal(x[0],x[1],x===f)).join('')}</select></div>
   ${f[0]==='custom'?`<div class="fld"><label for="kR1">Match %</label><input id="kR1" type="number" min="0" value="${+k.r1||''}" placeholder="100"></div><div class="fld"><label for="kU1">Of the first %</label><input id="kU1" type="number" min="0" value="${+k.u1||''}" placeholder="4"></div>
    <div class="fld"><label for="kR2">Then match %</label><input id="kR2" type="number" min="0" value="${+k.r2||''}" placeholder="0"></div><div class="fld"><label for="kU2">Of the next %</label><input id="kU2" type="number" min="0" value="${+k.u2||''}" placeholder="0"></div>`:''}
  </div>
  <div class="status ${salary&&res.missing<1?'on':''}" style="margin-top:12px"><span class="dotc"></span><div>${!salary?'Enter your yearly pay to see what the match is worth.'
   :res.max<1?'Enter the match your employer offers.'
   :res.missing<1?`<b>You get the full match:</b> about ${money(res.employer)} a year from your employer.`
   :`Your employer adds about <b>${money(res.employer)}</b> a year. The most they offer is ${money(res.max)}, so about <b>${money(res.missing)}</b> a year${per?` (${money(per)} a paycheck)`:''} is left on the table. Putting in ${res.needPct}% gets all of it.`}</div></div>
  <p class="foot">Before-tax contributions lower take-home pay by less than the amount put in. Check your plan's vesting schedule and contribution limits with HR or your plan documents.</p>`;
 const upd=()=>{const o=plus().k401=plus().k401||{};o.salary=+$('#kSal').value||0;o.pct=$('#kPct').value===''?null:Math.max(0,Math.min(100,+$('#kPct').value||0));o.formula=$('#kF').value;
  ['r1','u1','r2','u2'].forEach(x=>{const e=$('#k'+x.toUpperCase());if(e)o[x]=+e.value||0});save();matchCard()};
 ['#kSal','#kPct','#kR1','#kU1','#kR2','#kU2'].forEach(s=>{const e=$(s);if(e)e.onchange=upd});$('#kF').onchange=upd}

/* ── mileage log ── */
function milesCard(){
 const box=$('#plMiles'),y=today().slice(0,4),L=miles().slice().sort((a,b)=>b.date.localeCompare(a.date));
 const ytd=sum(L.filter(m=>m.date.startsWith(y)),m=>+m.miles||0),rate=+plus().mileRate||0;
 box.innerHTML=`<div class="ch"><h2 class="eb">Mileage log</h2><div class="eb mono">${y}: ${ytd.toLocaleString('en-US',{maximumFractionDigits:1})} mi</div></div>
  <p class="foot" style="margin-top:0">For gig driving, deliveries or other work trips. The IRS asks for the date, miles, destination and business purpose of each trip, written down at the time.</p>
  <div class="pxform four" style="margin-top:10px">
   <div class="fld"><label for="mDate">Date</label><input id="mDate" type="date" value="${today()}"></div>
   <div class="fld"><label for="mMi">Miles</label><input id="mMi" type="number" inputmode="decimal" min="0" step="0.1" placeholder="12.4"></div>
   <div class="fld"><label for="mTo">Destination</label><input id="mTo" autocomplete="off" placeholder="Client office"></div>
   <div class="fld"><label for="mWhy">Business purpose</label><input id="mWhy" autocomplete="off" placeholder="Deliveries"></div>
  </div>
  <div class="pxrow"><button class="btn2" id="mAdd">Add trip</button>${L.length?'<button class="btn2" id="mCsv">Download the log (CSV)</button>':''}</div>
  ${L.length?`<div class="pxl" style="margin-top:8px">${L.slice(0,8).map(m=>`<div class="pxr"><span class="k">${fmtD(m.date,{month:'short',day:'numeric',year:'numeric'})} · ${esc(m.place||'Trip')}</span>
   <span class="v">${(+m.miles).toLocaleString('en-US',{maximumFractionDigits:1})} mi <button class="tlink" data-mdel="${esc(m.id)}" aria-label="Delete this trip">Delete</button></span><span class="s">${esc(m.purpose||'')}</span></div>`).join('')}</div>
   ${L.length>8?`<p class="foot">${L.length-8} older trips are in the CSV.</p>`:''}`:''}
  <div class="pxform" style="margin-top:12px"><div class="fld"><label for="mRate">Rate per mile</label><input id="mRate" type="number" inputmode="decimal" min="0" step="0.005" value="${rate||''}" placeholder="0.70"></div>
   <div class="fld"><span class="lab">Deduction estimate, ${y}</span><div class="mono" style="font-size:20px;padding-top:6px">${rate?money2(ytd*rate):'—'}</div></div></div>
  <p class="foot">Use the IRS standard mileage rate for the tax year; it changes, so check irs.gov. Standard mileage and actual car expenses are two different methods, and a tax professional can say which fits.</p>`;
 $('#mAdd').onclick=()=>{const mi=+$('#mMi').value,d=$('#mDate').value;
  if(!d){toast('Pick the date of the trip');return}if(!(mi>0)){toast('Enter the miles driven');$('#mMi').focus();return}
  miles().push({id:uid(),date:d,miles:r2(mi),place:$('#mTo').value.trim().slice(0,60),purpose:$('#mWhy').value.trim().slice(0,80)});save();milesCard();toast('Trip added');$('#mMi').focus()};
 $('#mRate').onchange=e=>{plus().mileRate=Math.max(0,+e.target.value||0);save();milesCard()};
 $$('#plMiles [data-mdel]').forEach(b=>b.onclick=async()=>{if(!await ask('Delete this trip?','It is removed from the log.','Delete',true))return;S.miles=miles().filter(m=>m.id!==b.dataset.mdel);save();milesCard()});
 const c=$('#mCsv');if(c)c.onclick=()=>{const q=s=>{let v=String(s==null?'':s);if(/^[=+\-@\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
  const rows=[['Date','Miles','Destination','Business purpose'].join(',')].concat(L.slice().reverse().map(m=>[q(m.date),(+m.miles).toFixed(1),q(m.place),q(m.purpose)].join(',')));
  dl(`befree-mileage-${today()}.csv`,'﻿'+rows.join('\r\n'),'text/csv;charset=utf-8');toast('Mileage log saved')}}

window.drawPlan=function(){paycheckCard();extraCard();calCard();taxCard();matchCard();milesCard()};

/* ══════════ credit card use ══════════ */
window.drawCreditUse=function(){
 const box=$('#creditCard');if(!box)return;const cards=S.debts.filter(d=>d.kind==='card');
 if(!cards.length){box.style.display='none';return}box.style.display='';
 const lim=cards.filter(d=>+d.limit>0),bal=sum(lim,d=>debtBal(d)),L=sum(lim,d=>+d.limit),u=P.utilization(bal,L);
 box.innerHTML=`<div class="ch"><h2 class="eb">Credit card use</h2>${u?`<div class="eb mono">${Math.round(u.pct)}% overall</div>`:''}</div>
  ${lim.length?lim.map(d=>{const x=P.utilization(debtBal(d),d.limit);return `<div class="pxr" style="display:block"><div style="display:flex;justify-content:space-between;gap:10px"><span class="k">${esc(d.name)}</span><span class="mono">${money(debtBal(d))} of ${money(+d.limit)}</span></div>
   <div class="pxbar" role="img" aria-label="${Math.round(x.pct)}% of the limit used"><i class="${x.band}" style="width:${Math.min(x.pct,100)}%"></i></div>
   <div class="s" style="color:var(--tx3);font-size:13px">${Math.round(x.pct)}% used${+d.close?` · pay before the ${ord(d.close)} to lower the balance on the statement`:''}</div></div>`}).join('')
   :'<p class="foot" style="margin-top:0">Add each card\'s credit limit (tap the card above) to see how much of your available credit you\'re using.</p>'}
  <p class="foot">Credit scores usually look at the balance on each statement compared with the limit. Keeping it under 30%, and lower if you can, generally helps. This is general information, not a score prediction.</p>`};

/* ══════════ bank file import ══════════ */
const sh=document.createElement('div');sh.className='sheet';sh.id='shBank';sh.setAttribute('role','dialog');sh.setAttribute('aria-modal','true');sh.setAttribute('aria-labelledby','bkT');
sh.innerHTML=`<div class="handle"></div><div class="stitle" id="bkT">Import a bank file</div>
 <div class="ssub">Download transactions from your bank's website as CSV, QFX or OFX. The file is read on this device; nothing is uploaded.</div>
 <div class="seg" id="bkAcct" role="group" aria-label="Account"><button data-a="checking" aria-pressed="true">Checking or savings</button><button data-a="card" aria-pressed="false">Credit card</button></div>
 <div class="fld" id="bkCardW" style="display:none"><label for="bkCard">Which card</label><select id="bkCard"></select></div>
 <input type="file" id="bkFile" accept=".csv,.ofx,.qfx,.qbo,.txt,text/csv" hidden>
 <button class="btn2" id="bkPick" style="width:100%">Choose the file</button>
 <div id="bkOut"></div>
 <button class="save" id="bkGo" style="display:none">Add entries</button>`;
document.body.appendChild(sh);sheets.push('#shBank');sh.setAttribute('aria-hidden','true');
let BK={acct:'checking',rows:[],name:''};
function catOptions(sel){return ['income','fixed','variable','transfer'].map(t=>`<optgroup label="${{income:'Income',fixed:'Fixed spending',variable:'Variable spending',transfer:'Transfer'}[t]}">${allCats(t).map(c=>optVal(t+'|'+c,c,sel===t+'|'+c)).join('')}</optgroup>`).join('')}
function openBank(){BK={acct:BK.acct,rows:[],name:''};$('#bkOut').innerHTML='';$('#bkGo').style.display='none';syncBank();show('#shBank')}
function syncBank(){segSet('#bkAcct','a',BK.acct);const cards=S.debts.filter(d=>d.kind==='card');
 $('#bkCardW').style.display=BK.acct==='card'&&cards.length?'flex':'none';
 $('#bkCard').innerHTML=optVal('','Not linked to a card')+cards.map(d=>optVal(d.id,d.name)).join('')}
$('#bkAcct').onclick=e=>{const b=e.target.closest('button');if(!b)return;BK.acct=b.dataset.a;syncBank();if(BK.text)readBank()};
$('#bkPick').onclick=()=>$('#bkFile').click();
$('#bkFile').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>1e7){e.target.value='';toast('That file is too large for a bank export. Download a shorter date range.');return}const r=new FileReader();r.onload=()=>{BK.text=String(r.result);BK.name=f.name;readBank()};r.readAsText(f);e.target.value=''};
function readBank(){
 const res=P.readBankFile(BK.text,BK.name);
 if(res.error||!res.rows.length){$('#bkOut').innerHTML=`<div class="status" style="margin-top:12px"><span class="dotc"></span><div>${esc(res.error||'No transactions found in this file.')} Try the CSV download from your bank's activity page.</div></div>`;$('#bkGo').style.display='none';return}
 BK.rows=res.rows.map((r,i)=>{const g=P.guess(r.desc,r.amt,BK.acct);let type=g.type,cat=g.cat;
  if(!allCats(type).includes(cat))cat=type==='transfer'?'Between accounts':'Other';
  if(!allCats(type).includes(cat))cat=allCats(type)[0];
  const dup=P.isDuplicate(r,S.tx),why=dup?'Looks like an entry already in Gap.':g.skip||'';
  return{i,date:r.date,amt:r.amt,desc:r.desc||'(no description)',ref:r.ref||'',sel:type+'|'+cat,refund:!!g.refund,dir:g.dir||(r.amt>0?'in':'out'),review:!!g.review,on:!why,why}});
 BK.rows.sort((a,b)=>b.date.localeCompare(a.date));
 const bal=S.bal&&S.bal.asOf;
 $('#bkOut').innerHTML=`<p class="foot" style="margin-top:12px"><b>${plural(BK.rows.length,'transaction')}</b> found${res.skipped?`, ${res.skipped} lines skipped`:''}. Categories are a best guess; change any before adding.${bal?` Entries dated on or before ${fmtD(bal)} are treated as already in your checking balance.`:''}</p>
  <div class="pxbank">${BK.rows.map(r=>`<label><input type="checkbox" data-bi="${r.i}" ${r.on?'checked':''} aria-label="Include ${esc(r.desc)}">
   <span><span style="display:block;overflow-wrap:anywhere">${esc(r.desc)}</span><span class="d">${fmtD(r.date,{month:'short',day:'numeric',year:'numeric'})}</span></span>
   <span class="a ${r.amt>0?'in':''}">${r.amt>0?'+':'−'}${money2(Math.abs(r.amt)).replace('−','')}</span>
   <select data-bs="${r.i}" aria-label="Category for ${esc(r.desc)}">${catOptions(r.sel)}</select>${r.why?`<span class="why">${esc(r.why)}</span>`:''}</label>`).join('')}</div>`;
 $$('#bkOut [data-bi]').forEach(c=>c.onchange=()=>{BK.rows.find(r=>r.i===+c.dataset.bi).on=c.checked;countBank()});
 $$('#bkOut [data-bs]').forEach(s=>s.onchange=()=>{BK.rows.find(r=>r.i===+s.dataset.bs).sel=s.value});
 countBank()}
function countBank(){const n=BK.rows.filter(r=>r.on).length;$('#bkGo').style.display=n?'block':'none';$('#bkGo').textContent=`Add ${plural(n,'entry','entries')}`}
$('#bkGo').onclick=()=>{
 const card=BK.acct==='card'?$('#bkCard').value:'',bal=S.bal,now=Date.now();let n=0;
 BK.rows.filter(r=>r.on).forEach(r=>{const [type,cat]=r.sel.split('|');
  const t={id:uid(),ts:bal&&r.date<=bal.asOf?Math.max(0,(bal.ts||0)-1):now,src:'import',status:'done',date:r.date,amt:r2(Math.abs(r.amt)),type,cat,note:r.desc.slice(0,60)};
  if(r.ref)t.ext=r.ref;
  if(type==='transfer'){t.dir=r.amt>0?'in':'out';if(cat==='Card payment'||r.review)t.needsReview=true}
  if((type==='fixed'||type==='variable')&&r.amt>0)t.refund=true;
  if(BK.acct==='card'&&(type==='fixed'||type==='variable')){t.payFrom='card';if(card)t.card=card}
  S.tx.push(t);n++});
 save();closeAll();render();toast(`${plural(n,'entry','entries')} added from ${BK.name||'the file'}`)};
$('#bankImp').onclick=openBank;$('#bankImpL').onclick=openBank;
$('#expLock').onclick=exportLocked;

/* ══════════ Today ══════════
   One number first: what is safe to spend until payday. When some inputs are
   missing the number is still shown, marked as an estimate, with the next
   input that would make it exact. Without a pay schedule or a balance there
   is no honest number, so the card asks for that instead. */
const FIX={pay:['Add your pay schedule',()=>openPay()],bal:['Update your checking balance',()=>openCyc()],review:["Confirm today's bills and pending charges",()=>openCyc()],
 ess:['Add what everyday essentials cost you',()=>openCyc()],buf:['Choose a small safety buffer',()=>openCyc()],card:['Enter purchases still owed on your card',()=>openCyc()]};
function homeState(){
 const t=today();
 if(!primary())return{block:'pay'};
 if(!S.bal||typeof S.bal.amt!=='number')return{block:'bal'};
 const C=cycle();if(!C.need.length)return{C,est:false,missing:[]};
 if(C.need.includes('pay'))return{block:'pay'};
 const keep={cyc:S.cyc,bal:S.bal};
 try{S.cyc=Object.assign({},S.cyc,{confirmed:t});
  if(S.cyc.buf==null||S.cyc.buf==='')S.cyc.buf=0;if(S.cyc.cardReserve==null)S.cyc.cardReserve=0;
  if(!essDaily())S.cyc.ess=0;S.bal=Object.assign({},S.bal,{asOf:t});
  const E=cycle();return E.need.length?{block:'pay'}:{C:E,est:true,missing:C.need}}
 finally{S.cyc=keep.cyc;S.bal=keep.bal}}
window.drawHome=function(){
 const box=$('#homeHero');if(!box)return;const h=homeState(),t=today();
 if(h.block){const pay=h.block==='pay';
  box.innerHTML=`<div class="hh-top"><h2 class="eb hh-eb">Safe to spend</h2></div>
   <div class="hh-lead fr">${pay?'Find your number':'One step to your number'}</div>
   <p class="hh-sub">${pay?'Add your paycheck and when it arrives. Gap then shows what is safe to spend until the next one.':'Add what is in checking today. Gap takes out the bills due before payday and shows what is left to spend.'}</p>
   <button type="button" class="hh-cta" id="hhGo">${pay?'Add my pay schedule':'Add my checking balance'}</button>`;
  $('#hhGo').onclick=pay?()=>openPay():()=>openCyc();return}
 const C=h.C,last=lastPay(C.pay,t)||addD(C.next,-14),len=Math.max(diffD(last,C.next),1),pct=Math.min(100,Math.max(4,diffD(last,t)/len*100));
 const neg=C.avail<0,miss=(h.missing||[]).filter(k=>FIX[k]);
 box.innerHTML=`<div class="hh-top"><h2 class="eb hh-eb">Safe to spend</h2><span class="hh-badge">${h.est?'Estimate':'Up to date'}</span></div>
  <div class="hh-num fr${neg?' neg':''}" aria-live="polite">${money(C.avail)}</div>
  <p class="hh-sub">${neg?'short before payday on ':'until payday, '}<b>${fmtD(C.next,{weekday:'short',month:'short',day:'numeric'})}</b></p>
  <div class="hh-bar" role="img" aria-label="${Math.round(pct)}% of this pay cycle has passed"><i style="width:${pct.toFixed(1)}%"></i></div>
  <div class="hh-row"><span>${neg?'Look at what is due below':`About <b>${money(Math.max(C.perDay,0))}</b> a day`}</span><span><b>${plural(C.days,'day')}</b> to payday</span></div>
  ${miss.length?`<button type="button" class="hh-fix" id="hhFix"><span>Make it exact: <b>${FIX[miss[0]][0].toLowerCase()}</b></span><span class="hh-n">${miss.length===1?'1 step':miss.length+' steps'}</span></button>`:''}`;
 const f=$('#hhFix');if(f)f.onclick=FIX[miss[0]][1]};

/* ── quick log: amount, one of your usual categories, save ── */
const txSheet=$('#shTx');
const more=document.createElement('button');more.type='button';more.className='ghost qmore';more.textContent='More options: type, date, note';
$('#txSave').insertAdjacentElement('afterend',more);
more.onclick=()=>{txSheet.classList.remove('quick');A.allCats=true;syncTx()};
function usual(type){const n={},since=addD(today(),-120);S.tx.forEach(x=>{if(x.type===type&&x.date>=since&&isDone(x))n[x.cat]=(n[x.cat]||0)+1});return n}
const _sync=syncTx;
syncTx=function(){_sync();
 if(!txSheet.classList.contains('quick')||A.allCats)return;
 const n=usual(A.type),bs=$$('#cpick button[data-c]').sort((a,b)=>(n[b.dataset.c]||0)-(n[a.dataset.c]||0));
 const box=$('#cpick');bs.forEach((b,i)=>{b.classList.toggle('qhide',i>=6&&b.dataset.c!==A.cat);box.insertBefore(b,box.lastElementChild)});
 if(bs.length>6&&!$('#cpick .qall')){const a=document.createElement('button');a.type='button';a.className='qall';a.textContent='All categories';a.onclick=()=>{A.allCats=true;syncTx()};box.insertBefore(a,box.lastElementChild)}};
const _open=openTx;
openTx=function(t,o){txSheet.classList.remove('quick');return _open(t,o)};
window.openQuick=function(){_open(null);A.allCats=false;
 const n=usual('variable'),top=Object.keys(n).sort((a,b)=>n[b]-n[a])[0];if(top&&allCats('variable').includes(top))A.cat=top;
 txSheet.classList.add('quick');syncTx();$('#txTitle').textContent='Log a purchase'};

/* ── undo instead of "are you sure" ── */
const snack=document.createElement('div');snack.className='snack';snack.setAttribute('role','status');document.body.appendChild(snack);
let snT;
function showSnack(msg,label,fn){snack.innerHTML=`<span>${esc(msg)}</span>${label?`<button type="button">${esc(label)}</button>`:''}`;
 const b=snack.querySelector('button');if(b)b.onclick=()=>{fn();snack.classList.remove('on')};
 $('#toast').classList.remove('on');snack.classList.add('on');clearTimeout(snT);snT=setTimeout(()=>snack.classList.remove('on'),6000)}
const _save=$('#txSave').onclick;
$('#txSave').onclick=function(e){const before=new Set(S.tx.map(x=>x.id)),edit=A.edit;_save.call(this,e);
 if(edit)return;const added=S.tx.filter(x=>!before.has(x.id));if(added.length!==1||document.querySelector('.sheet.on'))return;
 const x=added[0];showSnack(`Saved ${money2(x.amt)} · ${x.cat}`,'Undo',()=>{S.tx=S.tx.filter(y=>y.id!==x.id);save();render();toast('Removed')})};

/* ── Money: Ledger, Goals and Debts under one tab ── */
const SUB=[['ledger','Ledger'],['goals','Goals'],['debts','Debts']];
SUB.forEach(([p])=>{const pg=$('#p-'+p);if(!pg)return;const nav=document.createElement('div');nav.className='subnav';nav.setAttribute('role','group');nav.setAttribute('aria-label','Money');
 nav.innerHTML=SUB.map(([k,l])=>`<button type="button" ${k===p?`id="sub-${k}" aria-pressed="true"`:'aria-pressed="false"'} data-go="${k}">${l}</button>`).join('');
 pg.insertBefore(nav,pg.firstChild);nav.onclick=e=>{const b=e.target.closest('button');if(b&&b.dataset.go!==V.page)go(b.dataset.go,true)}});

/* ── floating things never cover the page ── */
/* the install card, when it arrives after the page has loaded, goes below the content, so nothing on screen jumps */
new MutationObserver(()=>{const c=document.querySelector('body > .instcard');if(c){c.classList.remove('float');const m=$('#main');if(m)m.insertAdjacentElement('afterend',c)}}).observe(document.body,{childList:true});
$('#logBtn').onclick=()=>openQuick();
document.body.dataset.page=V.page;

/* the Plan page may already be open when this file loads */
render();
})();
