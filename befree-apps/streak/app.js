
const DB=(()=>{let m={};try{localStorage.setItem('__t','1');localStorage.removeItem('__t');
 const API={mem:false,
  g:k=>{try{return API.mem?m[k]??null:JSON.parse(localStorage.getItem(k))}catch(e){return null}},
  s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}
   catch(e){m[k]=v; if(!API.mem){API.mem=true; try{window.onStorageLost&&window.onStorageLost()}catch(_){}}}},
  d:k=>{try{localStorage.removeItem(k)}catch(e){delete m[k]}},
  raw:k=>{try{return localStorage.getItem(k)}catch(e){return null}},
  put:(k,s)=>{try{localStorage.setItem(k,s);return true}catch(e){return false}}};
 return API}
 catch(e){return{g:k=>m[k]??null,s:(k,v)=>{m[k]=v},d:k=>{delete m[k]},raw:()=>null,put:()=>false,mem:true}}})();
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const uid=()=>Math.random().toString(36).slice(2,10);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=()=>iso(new Date());
const D=s=>new Date(s+'T00:00:00');
const addD=(s,n)=>{const d=D(s);d.setDate(d.getDate()+n);return iso(d)};
const diffD=(a,b)=>Math.round((D(b)-D(a))/864e5);
const fmtD=(s,o)=>D(s).toLocaleDateString('en-US',o||{weekday:'short',month:'short',day:'numeric'});
const dayCount=(y,m)=>new Date(y,m+1,0).getDate();
const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DNL=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const plural=(n,w,ws)=>`${n} ${n===1?w:(ws||w+'s')}`;
const money=n=>{const a=Math.round(Math.abs(n));return (n<0&&a?'−':'')+'$'+a.toLocaleString('en-US')};

/* The demo page runs under its own storage names, so opening it can never
   touch a real record on the same site. */
const NS=window.__BEFREE_NS__==='demo'?'befree.demo.':'befree.';
const KEY=NS+'streak.v2',KEY1=NS+'streak.v1';
const LIVE=NS==='befree.';

/* ── the financial habit library ─────────────────────
   Every habit names the action, when it happens, and the smallest version
   that still counts on a hard day. Saving habits follow paydays and ask Gap
   whether the pay cycle has room; nothing here makes daily saving or daily
   "no spend" the standard. */
const LIB=[
 {tpl:'log-daily',grp:'Spending',name:"Log today's spending",action:"Add today's purchases in Gap, or mark a no-spend day",when:'Evening, after dinner',small:'Log just the biggest purchase',rule:{t:'week',days:[1,1,1,1,1,1,1]},link:'log',why:'The one everything else rests on.'},
 {tpl:'review-daily',grp:'Spending',name:'Quick money check',action:"Open Gap, look at today's total and what's available until payday",when:'Before bed',small:'Glance at one number: available until payday',rule:{t:'week',days:[0,1,1,1,1,1,0]},link:'review',why:'Two minutes that stop surprises.'},
 {tpl:'balance-check',grp:'Spending',name:'Update your balance',action:'Check your bank balance and update it in Gap',when:'Monday and Thursday mornings',small:'Just look at the balance',rule:{t:'week',days:[0,1,0,0,1,0,0]},link:'balance',why:'Keeps the until-payday number honest.'},
 {tpl:'grocery-plan',grp:'Spending',name:"Plan the week's groceries",action:"Make a list from what's already at home",when:'Before the weekly shop',small:'Check the fridge before you leave',rule:{t:'week',days:[0,0,0,0,0,0,1]},link:null,why:'Groceries are the biggest flexible cost for most households.'},
 {tpl:'bills-weekly',grp:'Bills',name:'Check bills due this week',action:'Look at Coming up in Gap and confirm anything already paid',when:'Monday morning',small:'Look at the next bill only',rule:{t:'week',days:[0,1,0,0,0,0,0]},link:'review',why:'No bill arrives as a surprise.'},
 {tpl:'bill-before',grp:'Bills',name:'Pay a bill before it\'s due',action:'Pay it, or check that autopay has the money, then confirm it in Gap',when:'Two days before the due date',small:'Check the amount and the date',rule:{t:'before',days:2},link:'bills',why:'Late fees are the most avoidable cost there is.'},
 {tpl:'subs-review',grp:'Bills',name:'Review subscriptions',action:"Check each subscription and cancel one you don't use",when:'Mid-month',small:'Check just one subscription',rule:{t:'month',day:15},link:null,why:'Small charges add up quietly.'},
 {tpl:'payday-plan',grp:'Paydays',name:'Payday plan',action:'When pay arrives, confirm it in Gap and decide where it goes',when:'On payday',small:'Confirm the paycheck; plan the rest tomorrow',rule:{t:'payday',off:0},link:'log',why:'Every dollar gets a job before it drifts.'},
 {tpl:'payday-save',grp:'Saving',name:'Move money to savings on payday',action:'Move a set amount to savings or your buffer, only if this pay cycle has room',when:'The day after payday',small:'Move $5, or skip this cycle if it\'s tight',rule:{t:'payday',off:1},link:'save',afford:true,why:'Saving follows your paycheck, not the calendar.'},
 {tpl:'fund-topup',grp:'Saving',name:'Top up a sinking fund',action:"Move this paycheck's set-aside into the fund",when:'The day after payday',small:'Move part of it',rule:{t:'payday',off:1},link:'save',afford:true,why:"So the next big bill is already covered."},
 {tpl:'weekly-review',grp:'Reviews',name:'Weekly money review',action:"Ten minutes: last week's spending, what's coming, one adjustment",when:'Sunday evening',small:"Look at last week's total only",rule:{t:'week',days:[1,0,0,0,0,0,0]},link:'review',why:'Where small course corrections happen.'},
 {tpl:'monthly-review',grp:'Reviews',name:'Close the month',action:"Look at last month's surplus in Gap and pick one thing to change",when:'First day of the month',small:"Read the month-close note",rule:{t:'month',day:1},link:'review',why:'A monthly look keeps goals realistic.'}];
const tplOf=id=>LIB.find(x=>x.tpl===id)||null;

/* six identity colors, drawn from the same ramp Gap uses */
const HC=['var(--k1)','var(--k2)','var(--k3)','var(--k4)','var(--k5)','var(--pos)'];
const hcol=h=>HC[(h.color??0)%HC.length];

/* ── state + migration ─────────────────────────────── */
function blank(){return{v:2,habits:[],ticks:{},reviews:{},nospend:{},pay:null,prefs:{revDay:0,reminder:false},pauseAll:null,inboxDone:[],migr:[],tasks:[],remindShown:''}}
function migrate(d){
 const log=[];const t=today();
 const S0=Object.assign(blank(),d);
 ['habits'].forEach(k=>{if(!Array.isArray(S0[k]))S0[k]=[]});
 ['ticks','reviews','nospend'].forEach(k=>{if(!S0[k]||typeof S0[k]!=='object'||Array.isArray(S0[k]))S0[k]={}});
 if(!Array.isArray(S0.inboxDone))S0.inboxDone=[];if(!Array.isArray(S0.migr))S0.migr=[];
 /* money to-dos arrived after v2; a record without them simply has none */
 if(!Array.isArray(S0.tasks))S0.tasks=[];
 S0.tasks=S0.tasks.filter(x=>x&&x.id&&typeof x.title==='string'&&x.title.trim()).map(x=>Object.assign({note:'',due:null,dueWhy:'',worth:null,src:'own',key:null,created:t,done:null},x));
 S0.prefs=Object.assign({revDay:0,reminder:false},S0.prefs);
 const first={};
 for(const k in S0.ticks){const i=k.indexOf('|'),hid=k.slice(0,i),ds=k.slice(i+1);
  if(!first[hid]||ds<first[hid])first[hid]=ds;
  const v=S0.ticks[k];
  if(v===1||v===true||v==='1')S0.ticks[k]='d';
  else if(!['d','s','g','x','-'].includes(v))delete S0.ticks[k]}
 let conv=0;
 S0.habits=S0.habits.filter(h=>h&&h.id).map((h,i)=>{const n=Object.assign({},h);
  if(n.color===undefined)n.color=i%HC.length;
  if(!n.created)n.created=first[n.id]&&first[n.id]<t?first[n.id]:t;
  if(!Array.isArray(n.sched)||!n.sched.length){
   const days=Array.isArray(n.days)&&n.days.length===7?n.days.map(x=>x?1:0):[1,1,1,1,1,1,1];
   n.sched=[{from:n.created,rule:{t:'week',days}}];delete n.days;conv++}
  if(n.linked===true&&!n.link){n.link='log';delete n.linked}
  if(!n.tpl&&/logged my spending|log.*spending/i.test(n.name||'')){n.tpl='log-daily';n.link=n.link||'log'}
  if(!Array.isArray(n.pauses))n.pauses=[];
  if(!Array.isArray(n.dates))n.dates=[];
  ['action','when','small'].forEach(k=>{if(typeof n[k]!=='string')n[k]=''});
  if(n.tpl&&!n.small){const L=tplOf(n.tpl);if(L){n.action=n.action||L.action;n.when=n.when||L.when;n.small=L.small}}
  return n});
/* Streak runs on its own. Older builds took paydays and bill dates from
   Gap through shared browser storage; what this record relied on is
   copied once from Gap's last summary, so payday and bill habits keep
   their dates. Bill habits become a monthly due day. */
 let g=null;if(LIVE){try{g=JSON.parse(localStorage.getItem('befree.bridge.gap.v2')||'null')}catch(e){}if(!g||g.v!==2)g=null}
 if(!S0.standaloneV1){S0.standaloneV1=true;
  if(!S0.pay&&g&&g.pay&&(g.pay.anchor||g.pay.day)){S0.pay={freq:g.pay.freq,anchor:g.pay.anchor||null,day:+g.pay.day||15,day2:+g.pay.day2||31,wk:g.pay.wk||'same'};log.push('Streak now runs on its own. Your paydays were copied from Gap; check them in Settings → Paydays')}}
 let billsMoved=0;
 S0.habits.forEach(h=>h.sched.forEach(s=>{const r=s.rule;if(!r||r.t!=='before'||!r.rid)return;
  const b=g&&(g.bills||[]).find(x=>x.rid===r.rid),nx=b&&((b.next||[]).find(x=>x>=t)||(b.next||[])[0]);
  if(!r.day)r.day=nx?+nx.slice(8,10):1;delete r.rid;billsMoved++}));
 if(billsMoved)log.push('Bill habits now use a due day of the month set in Streak; check any bill that is not monthly');
 if((d.v||1)<2){
  if(conv)log.push('Each habit now keeps its schedule history, so changing a schedule later never rewrites past weeks');
  log.push('Streaks now count each habit only from the day it was created');
  S0.v=2}
 if(log.length)S0.migr.push({at:t,notes:log});
 return S0}
function loadS(){
 const v2=DB.g(KEY);if(v2&&Array.isArray(v2.habits))return migrate(v2);
 const v1=DB.g(KEY1);
 if(v1&&Array.isArray(v1.habits)){const raw=DB.raw(KEY1);if(raw&&!DB.raw(KEY1+'.pre-v2'))DB.put(KEY1+'.pre-v2',raw);return migrate(v1)}
 if(window.__BEFREE_DEMO__)return migrate(window.__BEFREE_DEMO__);
 return blank()}
let S=loadS();
(async()=>{try{if(navigator.storage&&navigator.storage.persist){const a=await navigator.storage.persisted();if(!a)await navigator.storage.persist()}}catch(e){}})();
const save=()=>{DB.s(KEY,S)};
const V={off:0,view:'month',wk:null};

/* ── schedules ─────────────────────────────────────── */
function adjWk(ds,wk){if(!wk||wk==='same')return ds;const w=D(ds).getDay();
 if(w===6)return addD(ds,wk==='before'?-1:2);if(w===0)return addD(ds,wk==='before'?-2:1);return ds}
function payOcc(p,from,to){const out=[];if(!p)return out;
 if(p.freq==='weekly'||p.freq==='biweekly'){const st=p.freq==='weekly'?7:14;if(!p.anchor)return out;
  let d=addD(p.anchor,Math.ceil(diffD(p.anchor,from)/st)*st);while(d<=to){out.push(d);d=addD(d,st)}return out}
 const days=p.freq==='semimonthly'?[+p.day||15,+p.day2||31]:[+p.day||1];
 const i0=(+from.slice(0,4))*12+(+from.slice(5,7)-1)-1,i1=(+to.slice(0,4))*12+(+to.slice(5,7)-1)+1;
 for(let i=i0;i<=i1;i++){const y=Math.floor(i/12),m=i%12;
  days.forEach(dd=>{const s=adjWk(iso(new Date(y,m,Math.min(dd,dayCount(y,m)))),p.wk);if(s>=from&&s<=to)out.push(s)})}
 return [...new Set(out)].sort()}
/* paydays: the schedule set here */
function paySource(){return S.pay?'own':null}
function paydayList(from,to){return S.pay?payOcc(S.pay,from,to):[]}
function billDue(rule,from,to){
 if(rule.day)return payOcc({freq:'monthly',day:rule.day,wk:'same'},from,to);
 return []}
const ruleAt=(h,ds)=>{let r=h.sched[0];for(const s of h.sched){if(s.from<=ds)r=s;else break}return r.rule};
const curRule=h=>h.sched[h.sched.length-1].rule;
/* payday and bill-based dates are recorded as they become known, so the
   past never changes if Gap is disconnected or its schedule moves later */
function refreshDates(){let ch=false;const t=today();
 S.habits.forEach(h=>{const last=h.sched[h.sched.length-1],r=last.rule;
  if(r.t!=='payday'&&r.t!=='before')return;
  const from=[addD(t,-45),h.created,last.from].sort().pop(),to=addD(t,120);
  let l=[];
  if(r.t==='payday')l=paydayList(addD(from,-(+r.off||0)),addD(to,-(+r.off||0))).map(d=>addD(d,+r.off||0));
  else l=billDue(r,addD(from,+r.days||0),addD(to,+r.days||0)).map(d=>addD(d,-(+r.days||0)));
  const set=new Set(h.dates);
  /* future dates may still move; only the past is frozen */
  h.dates=h.dates.filter(d=>d<t||l.includes(d));
  l.filter(d=>d>=from).forEach(d=>{if(!set.has(d))ch=true;if(!h.dates.includes(d))h.dates.push(d)});
  h.dates.sort()});
 return ch}
function dueRule(h,ds){const r=ruleAt(h,ds);
 if(r.t==='week')return r.days[D(ds).getDay()]===1;
 if(r.t==='every'){const a=r.anchor||h.created,n=+r.n||14;return ((diffD(a,ds)%n)+n)%n===0}
 if(r.t==='month'){const d=D(ds),dd=+r.day||1,last=dayCount(d.getFullYear(),d.getMonth());return d.getDate()===Math.min(dd,last)}
 if(r.t==='payday'||r.t==='before')return h.dates.includes(ds);
 return false}
const inRange=(p,ds)=>p&&p.from<=ds&&(!p.to||ds<=p.to);
const isPaused=(h,ds)=>h.pauses.some(p=>inRange(p,ds))||inRange(S.pauseAll,ds);
const tk=(h,ds)=>S.ticks[h.id+'|'+ds];
const isDoneV=v=>v==='d'||v==='s'||v==='g';

/* ── one definition of status, used by every number on the page ──
   before: the habit didn't exist yet · off: not scheduled that day ·
   paused / excused: not counted · done / small: counted as done ·
   missed: counted as not done · open: today, not done yet (not counted
   until it is done) · future. */
function status(h,ds,t){t=t||today();
 if(ds<h.created)return 'before';
 if(isPaused(h,ds))return 'paused';
 if(!dueRule(h,ds))return 'off';
 const v=tk(h,ds);
 if(v==='x')return 'excused';
 if(isDoneV(v))return v==='s'?'small':'done';
 if(ds>t)return 'future';
 if(ds===t)return 'open';
 return 'missed'}
const COUNTED=new Set(['done','small','missed']),DONE=new Set(['done','small']);
function rate(hs,from,to){const t=today();let d=0,n=0;if(to>t)to=t;
 for(let ds=from;ds<=to;ds=addD(ds,1))hs.forEach(h=>{const s=status(h,ds,t);if(COUNTED.has(s)){n++;if(DONE.has(s))d++}});
 return{d,t:n,r:n?d/n:null}}
function dayState(ds,t){t=t||today();let due=0,done=0,open=0;
 S.habits.forEach(h=>{const s=status(h,ds,t);if(s==='open')open++;if(COUNTED.has(s)||s==='open'){due++;if(DONE.has(s))done++}});
 return due?{due,done,open,full:done===due}:null}
function streak(){const t=today();let n=0;
 for(let i=0;i<900;i++){const ds=addD(t,-i),s=dayState(ds,t);
  if(!s)continue;if(s.full){n++;continue}if(i===0)continue;break}
 return n}
function bestStreak(){const t=today();if(!S.habits.length)return 0;
 let start=S.habits.map(h=>h.created).sort()[0];if(diffD(start,t)>1500)start=addD(t,-1500);
 let run=0,best=0;
 for(let ds=start;ds<=t;ds=addD(ds,1)){const s=dayState(ds,t);if(!s)continue;
  if(s.full){run++;best=Math.max(best,run)}else if(ds!==t)run=0}
 return best}
function habitStreak(h){const t=today();let n=0;
 for(let i=0;i<900;i++){const ds=addD(t,-i),s=status(h,ds,t);
  if(s==='before')break;if(DONE.has(s)){n++;continue}if(s==='missed')break}
 return n}
function nextDue(h){const t=today();for(let i=0;i<120;i++){const ds=addD(t,i);const s=status(h,ds,t);if(s==='open'||s==='future'||(DONE.has(s)&&i>0))return ds}return null}

/* ── evidence: only things the person did ── */
function evidence(h,ds){return BeFreeFinance.evidence(h,{},!!S.nospend[ds])}
function autoTick(){let ch=false;
 if(!S.evidenceV5){S.legacyAutoTicks={};Object.keys(S.ticks).forEach(k=>{if(S.ticks[k]==='g')S.legacyAutoTicks[k]='g';});S.habits.forEach(h=>{if(h.tpl==='balance-check')h.link='balance';});S.evidenceV5=true;ch=true;}
 if(!S.historyRepairV1){Object.entries(S.legacyAutoTicks||{}).forEach(([k,v])=>{if(S.ticks[k]==='s'&&v==='g')S.ticks[k]='g';});S.historyRepairV1=true;ch=true;}
const t=today();
 S.habits.forEach(h=>{if(!h.link)return;
  for(let i=0;i<30;i++){const ds=addD(t,-i);if(ds<h.created)break;
   if(tk(h,ds)!==undefined)continue;const s=status(h,ds,t);
   if((s==='open'||s==='missed')&&evidence(h,ds)){S.ticks[h.id+'|'+ds]='g';ch=true}}});
 return ch}

function habitFromTpl(id,ref){const L=tplOf(id);if(!L)return null;const name=L.name;
 const rule=JSON.parse(JSON.stringify(L.rule));if(ref&&ref.rid&&rule.t==='before')rule.rid=ref.rid;
 return{name,action:L.action,when:L.when,small:L.small,rule,link:L.link,tpl:id,ref:ref||null}}

/* ── weekly review keys ───────────────────────────── */
function weekKey(ds){const d=D(ds||today()),back=(d.getDay()-(+S.prefs.revDay||0)+7)%7;return addD(ds||today(),-back)}

/* ── money to-dos ──────────────────────────────────────
   One-time money jobs: done once, then gone. They live beside the habits
   but never touch a tick, a rate or a streak. A due date tied to payday or
   a bill is worked out once, when the to-do is saved, so it never moves
   under the person afterwards. */
const TODO_LIB=[
 {title:'Cancel a subscription you no longer use',note:'Check your card statement for the last charge first.'},
 {title:'Call a card company and ask for a lower rate',note:'Ask plainly; mention how long you have been a customer.'},
 {title:'Set up autopay for the minimum on each card',note:'The minimum only, so a missed date never becomes a late fee.'},
 {title:'Check your credit reports for mistakes',note:'Free from each bureau at AnnualCreditReport.com.'},
 {title:'Compare car or renters insurance quotes',note:'Same coverage, three quotes.'},
 {title:'Dispute a charge that looks wrong',note:'Card issuers set a time limit, so sooner is better.'}];
function nextPayday(){const t=today();return paydayList(t,addD(t,62)).find(d=>d>=t)||null}
function resolveDue(w){const t=today();
 if(!w||w.t==='none')return{due:null,why:''};
 if(w.t==='date')return{due:w.date||null,why:''};
 if(w.t==='payday'){const p=nextPayday();return p?{due:p<=t?t:addD(p,-1),why:'before payday'}:{due:null,why:''}}
 return{due:null,why:''}}
function taskState(x,t){t=t||today();if(x.done)return 'done';if(!x.due)return 'none';
 if(x.due<t)return 'late';if(x.due===t)return 'today';return diffD(t,x.due)<=7?'soon':'later'}
function openTasks(){const o={late:0,today:1,soon:2,later:3,none:4};
 return S.tasks.filter(x=>!x.done).sort((a,b)=>{const sa=taskState(a),sb=taskState(b);
  return o[sa]-o[sb]||(a.due||'').localeCompare(b.due||'')||(a.created||'').localeCompare(b.created||'')})}
function todoSummary(){const y=today().slice(0,4),d=S.tasks.filter(x=>x.done&&x.done.slice(0,4)===y);
 return{open:S.tasks.filter(x=>!x.done).length,late:S.tasks.filter(x=>taskState(x)==='late').length,
  doneYear:d.length,worthYear:Math.round(d.reduce((a,x)=>a+(+x.worth||0),0))}}

/* ── today ─────────────────────────────────────────── */
const TICK_SVG='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E2910" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>';
function affordLine(h){
 const L=tplOf(h.tpl);if(!(h.link==='save'||(L&&L.afford)))return '';
 return `<div class="ev">Only move money you won't need before payday. If this pay cycle is tight, the small version or "Not this time" is the right call; it won't count against you.</div>`}
function habitRow(h,ds){
 const s=status(h,ds),on=DONE.has(s),c=hcol(h),v=tk(h,ds),ev=evidence(h,ds);
 const r30=rate([h],addD(ds,-29),ds),st=habitStreak(h);
 const rule=curRule(h);
 return `<div class="hrow ${on?'on':''}" style="--hc:${c}">
  <button class="tick ${s==='small'?'half':''}" data-tick="${h.id}" aria-pressed="${on}" aria-label="${esc(h.name)}: ${on?'done, tap to undo':'mark done'}"
   ${on&&s!=='small'?`style="background:${c};border-color:${c}"`:on?`style="border-color:${c}"`:''}>${TICK_SVG}</button>
  <div style="min-width:0">
   <h3 class="hn">${esc(h.name)}${s==='small'?'<span class="pill">Small version</span>':''}${v==='g'?'<span class="pill ok">Automatic</span>':''}${s==='excused'?'<span class="pill">Not needed today</span>':''}</h3>
   ${h.action||h.when?`<p class="ha">${h.action?esc(h.action):''}${h.action&&h.when?' · ':''}${h.when?`<b>${esc(h.when)}</b>`:''}</p>`:''}
   ${h.small&&!on?`<p class="hsm"><b>Hard day?</b> ${esc(h.small)}. That counts.</p>`:''}
   ${ev?`<div class="ev ok">${v==='g'?'Counted because':'Your record shows'} ${ev.txt} today.</div>`:''}
   ${!on&&s!=='excused'?affordLine(h):''}
   <p class="hm mono">${st?plural(st,'time')+' in a row · ':''}${r30.t?`${r30.d} of ${r30.t} scheduled done in 30 days`:'Just started'}${rule.t==='payday'?' · payday habit':''}</p>
   <div class="hbtns">
    ${!on&&s!=='excused'&&h.small?`<button data-small="${h.id}">I did the small version</button>`:''}
    ${s==='excused'?`<button class="q" data-unskip="${h.id}">Undo "not this time"</button>`:''}
    <details class="hmore"><summary aria-label="More options for ${esc(h.name)}">More options</summary><div class="hmenu">
     ${!on&&s!=='excused'?`<button class="q" data-skip="${h.id}">Not this time</button>`:''}
     ${(h.link==='log'||h.link==='review')&&!on&&!S.nospend[ds]?`<button class="q" data-nospend="1">I reviewed today, no spending</button>`:''}
     <button class="q" data-edit="${h.id}">Edit habit</button>
    </div></details>
   </div>
  </div></div>`}
function drawToday(){
 const t=today();
 $('#todayLbl').textContent=D(t).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
 const due=S.habits.filter(h=>['open','done','small','excused'].includes(status(h,t)));
 const n=due.filter(h=>DONE.has(status(h,t))).length,cnt=due.filter(h=>status(h,t)!=='excused').length;
 const adj=(S.reviews[weekKey(addD(t,-7))]||{}).adjust,adjNow=(S.reviews[weekKey(t)]||{}).adjust;
 const tip=adjNow||adj?`<br><span style="font-size:14px">This week's adjustment: <b>${esc(adjNow||adj)}</b></span>`:'';
 $('#doneCap').innerHTML=(!S.habits.length?'No habits yet. Pick one below to start.'
   :!cnt?(due.length?'Nothing else needed today.':'Nothing scheduled today. Rest days are part of the plan.')
   :n===cnt?'<b>All done for today.</b> That\'s a full day.'
   :n===0?`<b>${plural(cnt,'habit')}</b> for today.${cnt>1?' Start with the one that takes the least effort.':''}`
   :`<b>${cnt-n} left</b> for today. The small version counts.`)+tip;
 let h='';
 if(!S.habits.length)h=`<div class="inb">${['log-daily','bills-weekly','weekly-review'].map(id=>{const L=tplOf(id);
  return `<div class="inbi"><div><div class="t">${esc(L.name)}</div><div class="s">${esc(L.why)} ${esc(L.when)}.</div></div><div class="b"><button class="btn" data-start="${id}">Start this one</button></div></div>`}).join('')}
  <button class="ghost" data-lib="1">See all money habits</button></div>`;
 else h=due.map(x=>habitRow(x,t)).join('');
 $('#today').innerHTML=h;
 const rest=S.habits.filter(x=>!due.includes(x));
 $('#later').innerHTML=rest.length?`<details class="later"><summary>Not due today (${rest.length})</summary>${rest.map(x=>{
  const s=status(x,t),nd=nextDue(x),r=curRule(x);
  const why=s==='paused'?'paused':s==='before'?'starts later':(r.t==='payday'||r.t==='before')&&!nd?(r.t==='payday'?'needs your paydays':'needs the bill\'s due date'):nd?'next '+fmtD(nd):'—';
  return `<div class="lrow"><button data-edit="${x.id}"><span class="hdot" style="background:${hcol(x)}"></span>${esc(x.name)}</button><span>${why}</span></div>`}).join('')}</details>`:'';
 bindToday();
 const st=streak();
 $('.ringwrap').style.display=S.habits.length?'':'none';$('#flame').style.display=S.habits.length?'':'none';
 $('#strk').textContent=st;$('#strkw').textContent=st===1?'day in a row':'days in a row';
 $('#flame').setAttribute('aria-label',`${plural(st,'day')} in a row with everything scheduled done`);
}
function bindToday(){
 $$('[data-tick]').forEach(b=>b.onclick=()=>toggleToday(b.dataset.tick,b));
 $$('[data-small]').forEach(b=>b.onclick=()=>{setTick(b.dataset.small,today(),'s');toast('Small version counted. That\'s the habit working.')});
 $$('[data-skip]').forEach(b=>b.onclick=()=>{setTick(b.dataset.skip,today(),'x');toast('Marked "not this time". It won\'t count against you.')});
 $$('[data-unskip]').forEach(b=>b.onclick=()=>setTick(b.dataset.unskip,today(),null));
 $$('[data-nospend]').forEach(b=>b.onclick=()=>{S.nospend[today()]=1;autoTick();save();render();toast('Recorded: reviewed, no spending today')});
 $$('[data-edit]').forEach(b=>b.onclick=()=>openHabit(S.habits.find(h=>h.id===b.dataset.edit)));
 $$('[data-start]').forEach(b=>b.onclick=()=>{const x=habitFromTpl(b.dataset.start);openHabit(null,x)});
 $$('[data-lib]').forEach(b=>b.onclick=openLib);
}
function setTick(hid,ds,v){const k=hid+'|'+ds;
 if(v===null){const h=S.habits.find(x=>x.id===hid);delete S.ticks[k];if(h&&evidence(h,ds))S.ticks[k]='-'}
 else S.ticks[k]=v;save();render()}
function toggleToday(hid,btn){
 const t=today(),h=S.habits.find(x=>x.id===hid);if(!h)return;
 const before=dayState(t),v=tk(h,t);
 if(isDoneV(v))setTick(hid,t,null);else setTick(hid,t,'d');
 if(!reduced()){const n=$(`[data-tick="${hid}"]`);if(n)n.classList.add('pop')}
 const after=dayState(t);
 if(after&&after.full&&!(before&&before.full))toast(`Everything for today is done. ${plural(streak(),'day')} in a row.`);
 const n=$(`[data-tick="${hid}"]`);if(n)n.focus({preventScroll:true});
}


/* ── money to-dos ──────────────────────────────────── */
const CHK_SVG='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>';
function dueText(x,t){const s=taskState(x,t),w=x.dueWhy?` · ${esc(x.dueWhy)}`:'';
 if(s==='done')return `Done ${fmtD(x.done,{month:'short',day:'numeric'})}`;
 if(s==='late')return `<b class="late">Was due ${fmtD(x.due,{weekday:'short',month:'short',day:'numeric'})}</b>${w}`;
 if(s==='today')return `<b>Due today</b>${w}`;
 if(s==='none')return 'No date';
 return `Due ${fmtD(x.due,{weekday:'short',month:'short',day:'numeric'})}${w}`}
function todoRow(x){const t=today(),s=taskState(x,t),on=s==='done';
 return `<div class="trow ${on?'on':''} ${s==='late'?'late':''}">
  <button class="tchk" data-tdone="${x.id}" aria-pressed="${on}" aria-label="${esc(x.title)}: ${on?'done, tap to undo':'mark done'}">${CHK_SVG}</button>
  <div style="min-width:0"><button class="tt" data-tedit="${x.id}">${esc(x.title)}</button>
   <p class="tm">${dueText(x,t)}${x.worth?` · <span class="tw">estimated potential value of ${money(x.worth)} a year</span>`:''}${x.src==='gap'?' · <span class="pill ok">From Gap</span>':''}</p>
   ${x.note&&!on?`<p class="tn">${esc(x.note)}</p>`:''}</div></div>`}
function drawTodos(){
 const t=today(),open=openTasks(),sm=todoSummary();
 const recent=S.tasks.filter(x=>x.done&&x.done>=addD(t,-6)).sort((a,b)=>b.done.localeCompare(a.done));
 const shown=V.allTodos?open:open.filter(x=>['late','today','soon'].includes(taskState(x,t))).concat(open.filter(x=>taskState(x,t)==='none')).slice(0,5);
 const hidden=open.length-shown.length;
 $('#todoTag').textContent=open.length?`${open.length} open${sm.late?` · ${sm.late} overdue`:''}`:'';
 let h='';
 if(sm.doneYear)h+=`<p class="tsum">Done this year: <b>${plural(sm.doneYear,'to-do')}</b>${sm.worthYear?`, estimated potential value of <b class="mono">${money(sm.worthYear)}</b> a year`:''}.</p>`;
 if(!S.tasks.length)h+=`<p class="tsum">One-time money jobs: done once, then gone. They never affect your habit streak.</p>
  <div class="tpicks">${TODO_LIB.slice(0,3).map((x,i)=>`<button class="chipb" data-tpick="${i}">${esc(x.title)}</button>`).join('')}</div>`;
 else if(!open.length)h+=`<p class="tsum">Nothing open. Add the next one when it comes up.</p>`;
 h+=shown.map(todoRow).join('');
 if(hidden>0||V.allTodos)h+=`<button class="lnk tmore" id="tAll">${V.allTodos?'Show fewer':`Show all ${open.length} (${hidden} due later)`}</button>`;
 if(recent.length)h+=`<details class="later tdone"><summary>Done this week (${recent.length})</summary>${recent.map(todoRow).join('')}</details>`;
 $('#todos').innerHTML=h;
 $$('#todos [data-tdone]').forEach(b=>b.onclick=()=>toggleTask(b.dataset.tdone));
 $$('#todos [data-tedit]').forEach(b=>b.onclick=()=>openTask(S.tasks.find(x=>x.id===b.dataset.tedit)));
 $$('#todos [data-tpick]').forEach(b=>b.onclick=()=>openTask(null,TODO_LIB[+b.dataset.tpick]));
 const ta=$('#tAll');if(ta)ta.onclick=()=>{V.allTodos=!V.allTodos;drawTodos()};
}
function toggleTask(id){const x=S.tasks.find(y=>y.id===id);if(!x)return;
 const was=!!x.done;x.done=was?null:today();save();drawTodos();
 const n=$(`#todos [data-tdone="${id}"]`);if(n)n.focus({preventScroll:true});
 if(!was)toast(x.worth?`Done. Potential value recorded: ${money(x.worth)} a year. Verify actual savings in Gap.`:'Done. One less thing to carry.')}

/* ── weekly review ─────────────────────────────────── */
function drawReview(){
 const t=today(),k=weekKey(t),r=S.reviews[k],prevK=weekKey(addD(t,-7)),pr=S.reviews[prevK];
 const isDay=D(t).getDay()===(+S.prefs.revDay||0);
 const wk=rate(S.habits,addD(t,-6),t);
 $('#revTag').textContent=`${DNL[+S.prefs.revDay||0]}s`;
 const fact=wk.t?`Last 7 days: <b>${wk.d} of ${wk.t}</b> scheduled done.`:'';
 $('#rev').innerHTML=r?`<div class="prev"><p><b>Worked:</b> ${esc(r.worked||'—')}</p><p><b>Got in the way:</b> ${esc(r.blocked||'—')}</p><p><b>Adjustment:</b> ${esc(r.adjust||'—')}</p></div>
  <button class="btn2" id="revEdit" style="margin-top:10px">Edit this week's review</button>`
  :`<p class="prev">${isDay?'It\'s review day.':'Anytime this week works.'} What worked, what got in the way, and one adjustment. ${fact}</p>
   ${pr&&pr.adjust?`<p class="prev" style="margin-top:6px">Last week you planned: <b>${esc(pr.adjust)}</b></p>`:''}
   <button class="${isDay?'btn':'btn2'}" id="revEdit" style="margin-top:12px">Do this week's review</button>`;
 $('#revEdit').onclick=openReview;
}
function openReview(){const k=weekKey(),r=S.reviews[k]||{};
 $('#rWorked').value=r.worked||'';$('#rBlocked').value=r.blocked||'';$('#rAdjust').value=r.adjust||'';
 const wk=rate(S.habits,addD(today(),-6),today());
 $('#revSub').textContent=`Week of ${fmtD(k,{month:'short',day:'numeric'})}. ${wk.t?wk.d+' of '+wk.t+' scheduled done in the last 7 days. ':''}Setbacks are information, not failure.`;
 show('#shRev')}
$('#rSave').onclick=()=>{const k=weekKey();
 S.reviews[k]={worked:$('#rWorked').value.trim(),blocked:$('#rBlocked').value.trim(),adjust:$('#rAdjust').value.trim(),at:Date.now()};
 save();closeAll();render();toast('Review saved. See you next week.')};

/* ── stats: all from rate(), dayState() and status() ── */
function drawStats(){
 const t=today(),r30=rate(S.habits,addD(t,-29),t),m0=t.slice(0,8)+'01',rm=rate(S.habits,m0,t);
 $('#tiles').innerHTML=[
  ['Current streak',plural(streak(),'day'),'every scheduled habit done','var(--acc)'],
  ['Best streak',plural(bestStreak(),'day'),'your longest run so far','var(--k4)'],
  ['Last 30 days',r30.t?`${r30.d} of ${r30.t}`:'—',r30.t?`${Math.round(r30.r*100)}% of scheduled habits done`:'nothing scheduled yet','var(--k2)'],
  ['This month',rm.t?`${rm.d} of ${rm.t}`:'—',rm.t?`${Math.round(rm.r*100)}% so far; today counts once done`:'nothing scheduled yet','var(--k3)']
 ].map(([l,v,s,c])=>`<div class="tile"><div class="rail" style="background:${c}"></div><div class="eb">${l}</div>
   <div class="v mono">${v}</div><div class="s">${s}</div></div>`).join('');
 const w=[];
 for(let k=11;k>=0;k--){const end=addD(t,-k*7),r=rate(S.habits,addD(end,-6),end);
  w.push({r:r.r,d:r.d,t:r.t,l:D(end).toLocaleDateString('en-US',{month:'numeric',day:'numeric'})})}
 const live=w.filter(x=>x.r!==null),avg=live.length?live.reduce((a,b)=>a+b.r,0)/live.length:null;
 $('#wAvg').textContent=avg===null?'—':Math.round(avg*100)+'% average';
 $('#bars').innerHTML=w.map(x=>x.r===null?`<div class="none" role="img" aria-label="Nothing scheduled" style="height:2px" title="Nothing scheduled"></div>`
  :`<div role="img" style="height:0" data-h="${Math.max(3,x.r*100)}" title="${x.d} of ${x.t} done, week ending ${x.l}" aria-label="${x.d} of ${x.t} done, week ending ${x.l}"></div>`).join('');
 $('#blab').innerHTML=w.map((x,i)=>`<span>${i%3===2?x.l:''}</span>`).join('');
 requestAnimationFrame(()=>$$('#bars div[data-h]').forEach(b=>b.style.height=b.dataset.h+'%'));
}
function drawRank(){
 const el=$('#rank');const t=today();
 if(!S.habits.length){el.innerHTML='<div class="empty">Add a habit to see this.</div>';return}
 const rows=S.habits.map(h=>({h,...rate([h],addD(t,-29),t),st:habitStreak(h)})).sort((a,b)=>(b.r??-1)-(a.r??-1));
 const C=2*Math.PI*24;
 const TIP={done:'Done',small:'Small version',missed:'Not done',open:'Still open today',off:'Not due',before:'Before this habit',paused:'Paused',excused:'Excused',future:''};
 el.innerHTML=rows.map(x=>{const c=hcol(x.h),p=x.r||0;
  const strip=[];for(let i=29;i>=0;i--){const ds=addD(t,-i),s=status(x.h,ds,t);strip.push(`<i class="sd ${s}" style="--c:${c}" title="${fmtD(ds)}: ${TIP[s]||s}"></i>`)}
  return `<div class="rk2">
   <svg class="rring" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="24" fill="none" stroke="var(--hair)" stroke-width="6"/>
    <circle class="rarc" cx="30" cy="30" r="24" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" transform="rotate(-90 30 30)"
     stroke-dasharray="0 ${C.toFixed(1)}" data-d="${(C*p).toFixed(1)} ${C.toFixed(1)}"/>
    <text x="30" y="34.5" text-anchor="middle" font-size="13" font-weight="600" fill="var(--tx)" font-family="'IBM Plex Mono',monospace">${x.t?Math.round(p*100):'—'}</text></svg>
   <div class="rkb"><div class="rkn">${esc(x.h.name)}</div>
    <div class="rks mono">${x.t?`${x.d} of ${x.t} scheduled done`:'not scheduled yet'}${x.st?` · ${x.st} in a row`:''}${isPaused(x.h,t)?' · paused':''}</div>
    <div class="strip" role="img" aria-label="Last 30 days for ${esc(x.h.name)}: ${x.d} of ${x.t} scheduled days done">${strip.join('')}</div></div>
  </div>`}).join('')+`<div class="skey"><span><i class="sd done" style="--c:var(--acc)"></i>Done</span><span><i class="sd small" style="--c:var(--acc)"></i>Small version</span><span><i class="sd missed"></i>Not done</span><span><i class="sd off"></i>Not due</span></div>`;
 requestAnimationFrame(()=>$$('#rank .rarc').forEach(a=>a.setAttribute('stroke-dasharray',a.dataset.d)));
}
function drawWeekday(){
 const el=$('#dow'),t=today(),out=DN.map(()=>({d:0,t:0}));
 for(let i=0;i<84;i++){const ds=addD(t,-i),w=D(ds).getDay();
  S.habits.forEach(h=>{const s=status(h,ds,t);if(COUNTED.has(s)){out[w].t++;if(DONE.has(s))out[w].d++}})}
 const w=out.map(x=>({...x,r:x.t?x.d/x.t:null})),live=w.filter(x=>x.r!==null);
 if(!live.length){el.innerHTML='';$('#dowTag').textContent='';$('#dowNote').textContent='This fills in after a few weeks of history.';el.style.display='none';return}
 el.style.display='';
 const worst=live.reduce((a,b)=>b.r<a.r?b:a),rest=live.filter(x=>x!==worst);
 const enough=live.length>=3&&live.reduce((a,b)=>a+b.t,0)>=10;
 /* name a day only when it is clearly below the others, not by a point or two */
 const stands=enough&&rest.length&&rest.reduce((a,b)=>a+b.r,0)/rest.length-worst.r>=.08,wi=stands?w.indexOf(worst):-1;
 $('#dowTag').textContent=!enough?'Early history':stands?`${DN[wi]} tends to be harder`:'No day stands out';
 $('#dowNote').textContent=`Share of scheduled habits done on each day, last 12 weeks. ${!enough?'More history is needed before interpreting a weekday pattern.':stands?'If '+DNL[wi]+'s are busy, a smaller version or a different time may fit better.':'Every day of the week goes about the same, which is what you want.'}`;
 const L=6,R=334,T=14,B=78,step=(R-L)/7;let o='';
 w.forEach((x,i)=>{const bw=step*.6,bx=L+step*i+(step-bw)/2,h=x.r===null?0:(B-T)*x.r;
  o+=`<rect x="${bx.toFixed(1)}" y="${B-2}" width="${bw.toFixed(1)}" height="2" fill="var(--hair2)"/>`;
  if(h>0)o+=`<rect x="${bx.toFixed(1)}" y="${(B-h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2.5" fill="var(--acc)" opacity="${i===wi?1:.5}"/>`;
  o+=`<text x="${(bx+bw/2).toFixed(1)}" y="${B+15}" text-anchor="middle" font-size="12" fill="${i===wi?'var(--acc-text)':'var(--tx2)'}" font-family="Poppins">${DN[i]}</text>`;
  if(x.r!==null)o+=`<text x="${(bx+bw/2).toFixed(1)}" y="${(B-h-5).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--tx2)" font-family="'IBM Plex Mono',monospace">${Math.round(x.r*100)}</text>`});
 el.innerHTML=o;fitType(el)}
function drawRing(){
 const el=$('#ring'),t=today();
 const due=S.habits.filter(h=>['open','done','small'].includes(status(h,t)));
 const n=due.filter(h=>DONE.has(status(h,t))).length,p=due.length?n/due.length:0;
 const R=34,C=2*Math.PI*R;
 let o=`<circle cx="42" cy="42" r="${R}" fill="none" stroke="var(--hair)" stroke-width="7"/>`;
 if(due.length){let a=0;
  due.forEach(h=>{const seg=C/due.length,gap=due.length>1?2.5:0;
   if(DONE.has(status(h,t)))o+=`<circle cx="42" cy="42" r="${R}" fill="none" stroke="${hcol(h)}" stroke-width="7" stroke-linecap="round" transform="rotate(-90 42 42)"
     stroke-dasharray="${Math.max(seg-gap,.5).toFixed(2)} ${(C-seg+gap).toFixed(2)}" stroke-dashoffset="${(-a).toFixed(2)}"/>`;a+=seg})}
 el.innerHTML=o;
 $('#ringN').textContent=due.length?`${n}/${due.length}`:'—';
 $('#ringN').style.color=p>=1?'var(--acc2)':'var(--tx)';
 $('#ringN').setAttribute('aria-label',due.length?`${n} of ${due.length} done today`:'nothing due today')}
const DISPLAY_AT=16;
function fitType(el){if(!el)return;const vb=el.viewBox&&el.viewBox.baseVal&&el.viewBox.baseVal.width;if(!vb)return;
 const px=el.getBoundingClientRect().width;if(!px)return;const k=px/vb;if(!(k>0)||Math.abs(k-1)<0.02)return;
 el.querySelectorAll('text').forEach(t=>{const fs=parseFloat(t.getAttribute('data-fs')||t.getAttribute('font-size'));if(!(fs>0)||fs>=DISPLAY_AT)return;
  t.setAttribute('data-fs',fs);t.setAttribute('font-size',(fs/k).toFixed(2))})}

/* ── month grid + 13 weeks ─────────────────────────── */
const mk=off=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-off);return d};
function drawGrid(){
 const wrap=$('#gwrap');
 $$('#gviews button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===V.view));
 $('#mNav').style.display=V.view==='month'?'':'none';
 if(!S.habits.length){wrap.innerHTML='<div class="empty">Your history appears here once you add a habit.</div>';return}
 if(V.view==='month')drawMonth(wrap);else drawSpan(wrap)}
function weekWindows(Y,M){const days=dayCount(Y,M),out=[];for(let a=1;a<=days;a+=7)out.push([a,Math.min(a+6,days)]);return out}
const S_LABEL={done:'done',small:'small version done',missed:'not done',open:'not done yet',excused:'not needed',paused:'paused',off:'not scheduled',before:'before this habit started',future:'not yet'};
function drawMonth(wrap){
 const m=mk(V.off),Y=m.getFullYear(),M=m.getMonth(),tISO=today();
 const wins=weekWindows(Y,M);
 if(V.wk==null||V.wk>=wins.length){const td=new Date();
  const cur=(Y===td.getFullYear()&&M===td.getMonth())?wins.findIndex(([a,b])=>td.getDate()>=a&&td.getDate()<=b):0;V.wk=cur<0?0:cur}
 const [d0,d1]=wins[V.wk],span=d1-d0+1;
 $('#mLbl').textContent=m.toLocaleString('en-US',{month:'short',year:'numeric'}).toUpperCase();
 $('#nextM').disabled=V.off===0;
 const cells=[];for(let d=d0;d<=d1;d++){const dt=new Date(Y,M,d);cells.push({d,ds:iso(dt),dow:dt.getDay()})}
 const head=`<div class="wrow whead" aria-hidden="true"><span class="wlab"></span>
   ${cells.map(c=>`<span class="wd${c.ds===tISO?' now':''}"><b>${DN[c.dow].slice(0,2)}</b><i>${c.d}</i></span>`).join('')}
   ${Array.from({length:7-span},()=>'<span class="wd"></span>').join('')}</div>`;
 const rows=S.habits.map(h=>{const c=hcol(h);let out='';
  for(const cc of cells){const s=status(h,cc.ds,tISO),lab=`${h.name}, ${D(cc.ds).toLocaleDateString('en-US',{month:'long',day:'numeric'})}: ${S_LABEL[s]}`;
   if(s==='off'||s==='before'){out+=`<span class="wc off" role="img" aria-label="${esc(lab)}"></span>`;continue}
   if(s==='paused'){out+=`<span class="wc pz" role="img" aria-label="${esc(lab)}"></span>`;continue}
   const fut=s==='future';
   out+=`<button class="wc${DONE.has(s)?' on':''}${s==='small'?' half':''}${cc.ds===tISO?' today':''}${fut?' fut':''}${s==='excused'?' pz':''}" style="--hc:${c};${s==='done'?`background:${c};border-color:${c}`:s==='small'?`border-color:${c}`:''}"
     ${fut?'disabled':''} data-c="${h.id}|${cc.ds}" aria-pressed="${DONE.has(s)}" aria-label="${esc(lab)}">${s==='excused'?'–':''}</button>`}
  out+=Array.from({length:7-span},()=>'<span class="wc ghost"></span>').join('');
  const r=curRule(h);
  const nd=Array.isArray(r.days)?r.days.reduce((a,b)=>a+b,0):0;const per=r.t==='week'?(nd===7?'every day':plural(nd,'day')+' a week'):r.t==='every'?'every 2 weeks':r.t==='payday'?'payday':r.t==='month'?'monthly':'before a bill';
  return `<div class="wrow"><button class="wlab" data-edit="${h.id}" aria-label="Edit ${esc(h.name)}">
    <span class="hdot" style="background:${c}"></span><span class="wn">${esc(h.name)}</span><span class="wx">${per}</span></button>${out}</div>`}).join('');
 wrap.innerHTML=`<div class="wkbar">
   <button id="wkPrev" class="wknav" aria-label="Earlier week">&#8249;</button>
   <span class="wkr mono">${new Date(Y,M,d0).toLocaleDateString('en-US',{month:'short',day:'numeric'})} &ndash; ${new Date(Y,M,d1).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
   <button id="wkNext" class="wknav" aria-label="Later week">&#8250;</button></div>
  <div class="wtab">${head}${rows}</div>
  <p class="whint">Tap a box to mark it done, tap again for the small version, again to clear. Tap a habit's name to edit it.</p>`;
 $('#wkPrev').disabled=V.wk===0;$('#wkNext').disabled=V.wk===wins.length-1;
 $('#wkPrev').onclick=()=>{if(V.wk>0){V.wk--;drawGrid();$('#wkPrev').focus()}};
 $('#wkNext').onclick=()=>{if(V.wk<wins.length-1){V.wk++;drawGrid();$('#wkNext').focus()}};
 $$('#gwrap [data-edit]').forEach(b=>b.onclick=()=>openHabit(S.habits.find(h=>h.id===b.dataset.edit)));
 $$('#gwrap [data-c]').forEach(b=>b.onclick=()=>{const [hid,ds]=b.dataset.c.split('|'),h=S.habits.find(x=>x.id===hid),v=tk(h,ds),s=status(h,ds);
  if(s==='excused')setTick(hid,ds,null);else if(v==='s')setTick(hid,ds,null);else if(isDoneV(v))setTick(hid,ds,h.small?'s':null);else setTick(hid,ds,'d');
  const n=$(`#gwrap [data-c="${hid}|${ds}"]`);if(n)n.focus({preventScroll:true})})}
function drawSpan(wrap){
 const t=today(),end=addD(t,6-D(t).getDay());
 wrap.innerHTML=`<div class="mult">`+S.habits.map(h=>{const c=hcol(h);let cells='';
  for(let col=12;col>=0;col--)for(let row=0;row<7;row++){
   const ds=addD(end,-(col*7+(6-row))),s=status(h,ds,t);
   const cls=s==='off'||s==='before'||s==='future'?'off':s==='paused'||s==='excused'?'pz':s==='missed'?'miss':'';
   cells+=`<span class="sq ${cls} ${ds===t?'now':''}" title="${esc(h.name)} · ${fmtD(ds,{month:'short',day:'numeric'})}: ${S_LABEL[s]}"
    style="grid-column:${13-col};grid-row:${row+1}${s==='done'?`;background:${c};border-color:${c}`:s==='small'?`;background:linear-gradient(135deg,${c} 0 50%,transparent 50%);border-color:${c}`:''}"></span>`}
  const r=rate([h],addD(t,-90),t);
  return `<div><div class="mh"><span class="hdot" style="background:${c}"></span><span class="mn">${esc(h.name)}</span>
   <span class="mr mono">${r.t?`${r.d}/${r.t}`:'—'}</span></div><div class="sq13" role="img" aria-label="${esc(h.name)}: ${r.d} of ${r.t} scheduled done in 13 weeks">${cells}</div></div>`}).join('')+`</div>
  <p class="whint">Thirteen weeks at a glance: done of scheduled. To change a day, use the Month view.</p>`}

function drawGap(){}

function render(){revisionRecovery();if(typeof drawChal==='function')drawChal();drawToday();drawTodos();drawReview();drawStats();drawGrid();drawRank();drawWeekday();drawRing();drawGap()}
$('#prevM').onclick=()=>{V.off++;V.wk=null;drawGrid()};
$('#nextM').onclick=()=>{if(V.off>0){V.off--;V.wk=null;drawGrid()}};
$$('#gviews button').forEach(b=>b.onclick=()=>{V.view=b.dataset.v;drawGrid()});
let _rz;addEventListener('resize',()=>{clearTimeout(_rz);_rz=setTimeout(drawWeekday,160)},{passive:true});

/* ── sheets: same behavior as Gap ──────────────────── */
const SHEETS=['#shLib','#shHabit','#shTask','#shRev','#shPay','#shAsk','#shSet','#shPriv','#shLockPin'];
let lastFocus=null,curSheet=null;
const FOCUSABLE='button:not([disabled]),[href],input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea,[tabindex]:not([tabindex="-1"])';
function closeAll(noFocus){SHEETS.forEach(s=>{const e=$(s);e.classList.remove('on');e.setAttribute('aria-hidden','true')});$('#scrim').classList.remove('on');
 document.body.classList.remove('locked');curSheet=null;
 if(!noFocus&&lastFocus&&lastFocus.focus&&document.contains(lastFocus)){try{lastFocus.focus({preventScroll:true})}catch(e){}}
 if(!noFocus)lastFocus=null}
function show(sel,keepOrigin){const origin=keepOrigin?lastFocus:document.activeElement;closeAll(true);lastFocus=origin;
 const el=$(sel);el.classList.add('on');el.removeAttribute('aria-hidden');$('#scrim').classList.add('on');document.body.classList.add('locked');
 el.scrollTop=0;curSheet=el;
 if(!el.querySelector('.shx')){const x=document.createElement('button');x.type='button';x.className='shx';x.setAttribute('aria-label','Close');
  x.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  x.onclick=()=>closeAll();el.insertBefore(x,el.firstChild)}
 setTimeout(()=>{const f=el.querySelector('input:not([type=hidden]):not([type=checkbox]),textarea,select')||el.querySelector(FOCUSABLE);f&&f.focus({preventScroll:true})},60)}
SHEETS.forEach(s=>$(s).setAttribute('aria-hidden','true'));
$('#scrim').onclick=()=>closeAll();
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&curSheet){e.preventDefault();if(curSheet.id==='shAsk')$('#askNo').click();else closeAll();return}
 if(e.key==='Tab'&&curSheet){const f=[...curSheet.querySelectorAll(FOCUSABLE)].filter(x=>x.offsetParent!==null);if(!f.length)return;
  const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
let tT;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('on'),2800)};
function ask(title,body,ok,danger){return new Promise(res=>{
 $('#askTitle').textContent=title;$('#askBody').textContent=body;$('#askOk').textContent=ok||'Continue';
 $('#askOk').style.background=danger?'var(--neg)':'';$('#askOk').style.color=danger?'var(--bg)':'';
 const back=lastFocus;show('#shAsk');
 $('#askOk').onclick=()=>{closeAll(true);lastFocus=back;res(true)};
 $('#askNo').onclick=()=>{closeAll();res(false)}})}
const segSet=(sel,attr,val)=>$$(sel+' button').forEach(b=>b.setAttribute('aria-pressed',b.dataset[attr]===val));

/* ── library ───────────────────────────────────────── */
function openLib(){
 const groups=[...new Set(LIB.map(x=>x.grp))];
 $('#lib').innerHTML=groups.map(g=>`<h3>${g}</h3>`+LIB.filter(x=>x.grp===g).map(x=>{const on=S.habits.some(h=>h.tpl===x.tpl&&!h.ref);
  return `<button class="libi" data-tpl="${x.tpl}"><b>${esc(x.name)}</b><span>${esc(x.action)}. ${esc(x.when)}.</span><span>Smallest version: ${esc(x.small)}</span>${x.afford?'<em>Follows your payday and only when the cycle has room</em>':''}${on?'<em>Already on your list</em>':''}</button>`}).join('')).join('');
 $$('#lib [data-tpl]').forEach(b=>b.onclick=()=>openHabit(null,habitFromTpl(b.dataset.tpl)));
 show('#shLib')}
$('#libTodo').onclick=()=>openTask(null);
$('#libCustom').onclick=()=>openHabit(null,{name:'',action:'',when:'',small:'',rule:{t:'week',days:[1,1,1,1,1,1,1]},link:null});
$('#fab').onclick=openLib;

/* ── habit editor ──────────────────────────────────── */
let H={};
function openHabit(h,preset){
 const used=S.habits.map(x=>x.color),free=HC.findIndex((_,i)=>!used.includes(i));
 if(h)H={...h,rule:JSON.parse(JSON.stringify(curRule(h))),edit:true};
 else H=Object.assign({name:'',action:'',when:'',small:'',rule:{t:'week',days:[1,1,1,1,1,1,1]},link:null,color:free<0?S.habits.length%HC.length:free,edit:false},preset||{});
 $('#hTitle').textContent=H.edit?'Edit habit':'Add a habit';
 $('#hDel').style.display=H.edit?'block':'none';$('#hPause').style.display=H.edit?'block':'none';
 if(H.edit){const p=isPaused(H,today())&&H.pauses.some(x=>inRange(x,today()));$('#hPause').textContent=p?'Resume this habit':'Pause this habit'}
 $('#hName').value=H.name;$('#hAction').value=H.action||'';$('#hWhen').value=H.when||'';$('#hSmall').value=H.small||'';
 $('#hLink').value=H.link||'';
 syncSch();syncColor();show('#shHabit');
 if(!H.edit&&!H.name)setTimeout(()=>$('#hName').focus(),260)}
function syncSch(){
 const r=H.rule;segSet('#hSch','t',r.t);
 let o='';
 if(r.t==='week'){r.days=r.days||[1,1,1,1,1,1,1];
  o=`<div class="fld"><span class="lab">Which days</span><div class="days" role="group" aria-label="Days of the week">${DN.map((d,i)=>`<button type="button" data-d="${i}" aria-pressed="${r.days[i]===1}" aria-label="${DNL[i]}">${d.slice(0,2)}</button>`).join('')}</div></div>`}
 else if(r.t==='every'){o=`<div class="fld"><label for="hAnchor">Starting on</label><input id="hAnchor" type="date" value="${r.anchor||today()}"><span class="hint">Then every 14 days from that date.</span></div>`}
 else if(r.t==='payday'){const src=paySource();
  o=`<div class="fld"><label for="hOff">When</label><select id="hOff">${[[0,'On payday'],[1,'The day after payday'],[2,'Two days after payday']].map(([v,l])=>`<option value="${v}" ${+r.off===v?'selected':''}>${l}</option>`).join('')}</select>
   <span class="hint">${src?'Paydays come from the schedule set in Settings.':'No paydays yet. Set them here or in Settings → Paydays.'}</span></div>
   ${src?'':'<button type="button" class="btn2" id="hPaySet" style="margin-bottom:12px">Set my paydays</button>'}`}
 else if(r.t==='month'){o=`<div class="fld"><label for="hDay">Day of the month</label><input id="hDay" type="number" inputmode="numeric" min="1" max="31" value="${r.day||1}"><span class="hint">31 means the last day of the month.</span></div>`}
 else if(r.t==='before'){
  o=`<div class="two"><div class="fld"><label for="hDue">Due day of the month</label><input id="hDue" type="number" inputmode="numeric" min="1" max="31" value="${r.day||''}" placeholder="1"></div>
   <div class="fld"><label for="hDays">Days before</label><select id="hDays">${[1,2,3,5,7].map(n=>`<option value="${n}" ${(+r.days||2)===n?'selected':''}>${n}</option>`).join('')}</select></div></div>`}
 $('#hSchOpts').innerHTML=o;
 $$('#hSchOpts .days button').forEach(b=>b.onclick=()=>{const i=+b.dataset.d;r.days[i]=r.days[i]?0:1;if(!r.days.some(x=>x))r.days[i]=1;syncSch()});
 const ps=$('#hPaySet');if(ps)ps.onclick=()=>{readHabitForm();openPay(true)};
 const daily=r.t==='week'&&r.days.every(x=>x),saveish=$('#hLink').value==='save';
 $('#hSchNote').textContent=H.edit?'Schedule changes apply from today. Past weeks keep the schedule they had.':
  daily&&saveish?'Daily saving isn\'t necessary. Saving on payday, when the cycle has room, works for most people.':'';
}
function readHabitForm(){H.name=$('#hName').value;H.action=$('#hAction').value;H.when=$('#hWhen').value;H.small=$('#hSmall').value;H.link=$('#hLink').value||null;
 const r=H.rule;
 if(r.t==='every'){r.anchor=($('#hAnchor')||{}).value||today();r.n=14}
 if(r.t==='payday')r.off=+(($('#hOff')||{}).value||0);
 if(r.t==='month')r.day=Math.max(1,Math.min(31,+(($('#hDay')||{}).value)||1));
 if(r.t==='before'){r.days=+(($('#hDays')||{}).value||2);delete r.rid;r.day=Math.max(1,Math.min(31,+(($('#hDue')||{}).value)||1))}}
$('#hSch').onclick=e=>{const b=e.target.closest('button');if(!b)return;readHabitForm();const t=b.dataset.t;
 H.rule=t==='week'?{t,days:[1,1,1,1,1,1,1]}:t==='every'?{t,n:14,anchor:today()}:t==='payday'?{t,off:1}:t==='month'?{t,day:1}:{t,days:2};syncSch()};
$('#hLink').onchange=()=>syncSch();
function syncColor(){
 $('#hColor').innerHTML=HC.map((c,i)=>`<button type="button" data-k="${i}" aria-pressed="${H.color===i}" aria-label="Color ${i+1}" style="background:${c}"></button>`).join('');
 $$('#hColor button').forEach(b=>b.onclick=()=>{H.color=+b.dataset.k;syncColor()})}
$('#hName').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#hSave').click()}});
$('#hSave').onclick=()=>{
 readHabitForm();const n=H.name.trim().slice(0,40);
 if(!n){toast('Give it a name');$('#hName').focus();return}
 if(!H.small.trim()){toast('Add a smallest version for hard days');$('#hSmall').focus();return}
 const t=today(),base={name:n,action:H.action.trim(),when:H.when.trim(),small:H.small.trim(),color:H.color,link:H.link||null};
 if(H.edit){const x=S.habits.find(y=>y.id===H.id);Object.assign(x,base);
  if(JSON.stringify(curRule(x))!==JSON.stringify(H.rule)){
   const last=x.sched[x.sched.length-1];
   if(last.from===t||x.created===t)last.rule=H.rule;else x.sched.push({from:t,rule:H.rule});
   x.dates=x.dates.filter(d=>d<t)}}
 else{S.habits.push(Object.assign({id:uid(),created:t,sched:[{from:t,rule:H.rule}],pauses:[],dates:[],tpl:H.tpl||null,ref:H.ref||null},base));
}
 refreshDates();autoTick();save();closeAll();render();toast(H.edit?'Saved':'Habit added. It counts from today.')};
$('#hPause').onclick=()=>{const x=S.habits.find(y=>y.id===H.id),t=today();
 const p=x.pauses.find(p=>inRange(p,t));
 if(p){p.to=addD(t,-1);if(p.to<p.from)x.pauses=x.pauses.filter(q=>q!==p);toast('Resumed')}
 else{x.pauses.push({from:t,to:null});toast('Paused. Paused days don\'t count, so your record is safe.')}
 save();closeAll();render()};
$('#hDel').onclick=async()=>{const id=H.id;
 if(!await ask('Delete this habit?','Its history is removed too. If you only need a break, pausing keeps everything.','Delete',true))return;
 S.habits=S.habits.filter(x=>x.id!==id);Object.keys(S.ticks).forEach(k=>{if(k.startsWith(id+'|'))delete S.ticks[k]});
 save();closeAll();render();toast('Habit removed')};

/* ── to-do editor ──────────────────────────────────── */
let T={};
function openTask(x,preset){
 if(x)T={...x,when:{t:x.due?'date':'none',date:x.due||''},edit:true};
 else T=Object.assign({title:'',note:'',worth:null,when:{t:'none'},edit:false},preset?{title:preset.title,note:preset.note||''}:{});
 $('#tTitle').textContent=T.edit?'Edit to-do':'Add a money to-do';
 $('#tName').value=T.title;$('#tNote').value=T.note||'';$('#tWorth').value=T.worth||'';
 $('#tDel').style.display=T.edit?'block':'none';
 $('#tPicks').style.display=T.edit||T.title?'none':'';
 $('#tPicks').innerHTML=TODO_LIB.map((p,i)=>`<button type="button" class="chipb" data-tp="${i}">${esc(p.title)}</button>`).join('');
 $$('#tPicks [data-tp]').forEach(b=>b.onclick=()=>{const p=TODO_LIB[+b.dataset.tp];$('#tName').value=p.title;$('#tNote').value=p.note||'';$('#tName').focus()});
 syncWhen();show('#shTask',!!$('#shLib').classList.contains('on'))}
function syncWhen(){const w=T.when;segSet('#tWhen','w',w.t);let o='';
 if(w.t==='date')o=`<div class="fld"><label for="tDate">Due date</label><input id="tDate" type="date" value="${w.date||today()}"></div>`;
 else if(w.t==='payday'){const p=nextPayday();
  o=`<p class="foot" style="margin:-4px 0 12px">${p?`Due <b>${fmtD(p<=today()?today():addD(p,-1))}</b>, the day before your next payday (${fmtD(p)}). The date is fixed once saved.`:'No paydays yet. Set them in Settings → Paydays.'}</p>`}
 $('#tWhenOpts').innerHTML=o}
$('#tWhen').onclick=e=>{const b=e.target.closest('button');if(!b)return;readTaskForm();T.when={t:b.dataset.w,date:T.when.date||''};syncWhen()};
function readTaskForm(){T.title=$('#tName').value;T.note=$('#tNote').value;const w=T.when;
 if(w.t==='date')w.date=($('#tDate')||{}).value||''}
$('#tName').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#tSave').click()}});
$('#tSave').onclick=()=>{readTaskForm();const n=T.title.trim().slice(0,80);
 if(!n){toast('Give it a name');$('#tName').focus();return}
 const w=T.when;if(w.t==='date'&&!w.date){toast('Pick a date, or choose No date');return}
 const r=resolveDue(w);if(w.t==='payday'&&!r.due){toast('That date is not known yet. Use a date instead.');return}
 const wv=Math.round(+String($('#tWorth').value).replace(/[^0-9.]/g,''))||null;
 const base={title:n,note:T.note.trim().slice(0,160),due:r.due,dueWhy:r.why,worth:wv};
 if(T.edit){const x=S.tasks.find(y=>y.id===T.id);
  /* an unchanged date keeps its reason ("before payday") */
  if(x.due===base.due&&w.t==='date')base.dueWhy=x.dueWhy;Object.assign(x,base)}
 else S.tasks.push(Object.assign({id:uid(),src:'own',key:null,created:today(),done:null},base));
 save();closeAll();render();toast(T.edit?'Saved':'To-do added')};
$('#tDel').onclick=async()=>{const id=T.id;
 if(!await ask('Delete this to-do?','It is removed from your list and from the count of done to-dos.','Delete',true))return;
 S.tasks=S.tasks.filter(x=>x.id!==id);save();closeAll();render();toast('To-do removed')};
$('#todoAdd').onclick=()=>openTask(null);

/* ── own paydays ───────────────────────────────────── */
let PY={},payBack=false;
function openPay(back){payBack=!!back;PY=Object.assign({freq:'biweekly',anchor:'',day:15,day2:31,wk:'before'},S.pay||{});
 $('#payAnchor').value=PY.anchor||'';$('#payD1').value=PY.day||15;$('#payD2').value=PY.day2||31;$('#payWk').value=PY.wk||'before';
 syncPay();show('#shPay',true)}
function syncPay(){segSet('#payFreq','f',PY.freq);const anc=PY.freq==='weekly'||PY.freq==='biweekly';
 $('#payAnchorW').style.display=anc?'flex':'none';$('#payDaysW').style.display=anc?'none':'grid';$('#payD2W').style.display=PY.freq==='semimonthly'?'flex':'none';
 $('#payWkW').style.display=anc?'none':'flex';
 const p=payForm(),l=p?payOcc(p,today(),addD(today(),100)).slice(0,4):[];
 $('#payPreview').innerHTML=l.length?`Next paydays: <b>${l.map(d=>fmtD(d)).join(', ')}</b>`:''}
function payForm(){const anc=PY.freq==='weekly'||PY.freq==='biweekly';
 const p={freq:PY.freq,anchor:anc?$('#payAnchor').value:null,day:+$('#payD1').value||15,day2:+$('#payD2').value||31,wk:anc?'same':$('#payWk').value};
 return anc&&!p.anchor?null:p}
$('#payFreq').onclick=e=>{const b=e.target.closest('button');if(!b)return;PY.freq=b.dataset.f;syncPay()};
['#payAnchor','#payD1','#payD2','#payWk'].forEach(s=>$(s).addEventListener('input',syncPay));
$('#paySave').onclick=()=>{const p=payForm();if(!p){toast('Pick one real payday');$('#payAnchor').focus();return}
 S.pay=p;refreshDates();save();toast('Paydays saved');
 if(payBack){show('#shHabit',true);syncSch()}else{closeAll();render()}};

/* ── settings ──────────────────────────────────────── */
function syncSet(){
 segSet('#thSeg','th',themePref());
 $('#revDay').innerHTML=DNL.map((d,i)=>`<option value="${i}" ${(+S.prefs.revDay||0)===i?'selected':''}>${d}</option>`).join('');
 const src=paySource();
 $('#setPay').textContent=src==='own'?`Set here: ${({weekly:'every week',biweekly:'every 2 weeks',semimonthly:'twice a month',monthly:'once a month'})[S.pay.freq]}`:'Not set';
 const br=inRange(S.pauseAll,today());
 $('#breakBtn').textContent=br?'Resume':'Pause all';
 $('#setBreak').textContent=br?`On a break since ${fmtD(S.pauseAll.from)}. Paused days don't count.`:'Pause every habit. Paused days aren\'t counted, so nothing is lost.';
 }
$('#setBtn').onclick=()=>{syncSet();show('#shSet')};
$('#setClose').onclick=()=>closeAll();
$('#revDay').onchange=e=>{S.prefs.revDay=+e.target.value;save();render()};
$('#setPayBtn').onclick=()=>openPay(false);
$('#breakBtn').onclick=()=>{const t=today();
 if(inRange(S.pauseAll,t)){S.pauseAll.to=addD(t,-1);if(S.pauseAll.to<S.pauseAll.from)S.pauseAll=null;
  /* keep past breaks on each habit so history stays the same */
  if(S.pauseAll){S.habits.forEach(h=>h.pauses.push({from:S.pauseAll.from,to:S.pauseAll.to}));S.pauseAll=null}toast('Welcome back')}
 else{S.pauseAll={from:t,to:null};toast('On a break. Nothing counts against you while paused.')}
 save();syncSet();render()};
$('#privBtn').onclick=()=>show('#shPriv',true);
$('#privClose').onclick=()=>{syncSet();show('#shSet',true)};
$('#thSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;setThemePref(b.dataset.th);syncSet()};

/* ── backup ────────────────────────────────────────── */
function doExport(){const b=new Blob([JSON.stringify(Object.assign({app:'befree-streak',exported:new Date().toISOString()},S),null,1)],{type:'application/json'});
 const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`befree-streak-${today()}.json`;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(u),4000);S.lastExport=today();save();closeAll();toast('Backup saved. Keep it somewhere you trust.')}
window.doExport=doExport;
$('#expBtn').onclick=doExport;
$('#impBtn').onclick=()=>$('#impFile').click();
$('#impFile').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>2e7){e.target.value='';toast('That file is too large to be a backup.');return}const r=new FileReader();
 r.onload=async()=>{let d,txt=r.result;
  try{const o=JSON.parse(txt);if(BeFreePlus.isEncrypted(o)){txt=typeof plusUnlock==='function'?await plusUnlock(o):null;if(txt==null)return}}catch(x){}
  try{d=JSON.parse(txt,(k,v)=>k==='__proto__'||k==='constructor'||k==='prototype'?undefined:v);if(!d||!Array.isArray(d.habits))throw 0;if(d.v&&d.v>2)throw 1}
  catch(x){toast(x===1?'That backup is from a newer version of Streak':'That file is not a BeFree Streak backup');return}
  if(S.habits.length&&!await ask('Restore this backup?',`It replaces the ${plural(S.habits.length,'habit')} on this device with the ${plural(d.habits.length,'habit')} in the file. A copy of the current record is kept on this device.`,'Restore'))return;
  const raw=DB.raw(KEY);if(raw)DB.put(KEY+'.before-restore',raw);
  delete d.app;delete d.exported;S=migrate(d);refreshDates();save();closeAll();render();toast('Backup restored')};
 r.readAsText(f);e.target.value=''};
async function doWipeEverything(){
 if(!await ask('Clear everything?','This erases every habit, tick, review and to-do on this device, including older saved copies. Save a backup first if you might want it. There is no undo.','Erase everything',true))return false;
 [KEY,KEY1,KEY1+'.pre-v2',KEY+'.before-restore','befree.bridge.streak.v1','befree.bridge.streak.v2'].forEach(k=>DB.d(k));alSet(null);
 S=blank();save();closeAll();render();toast('Cleared');
 return true}
$('#wipeBtn').onclick=doWipeEverything;
window.bfWipeEverything=doWipeEverything;

/* ── notices ───────────────────────────────────────── */
function banner(o){const el=document.createElement('div');el.className='banner';el.setAttribute('role','status');
 el.innerHTML=`<div class="bt"><div class="b1">${o.b1}</div>${o.b2?`<div class="b2">${o.b2}</div>`:''}</div><div class="ba">${o.action?`<button type="button" class="lnk">${o.action}</button>`:''}
  <button type="button" class="xb" aria-label="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`;
 $('#notices').appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));
 const kill=()=>{el.classList.remove('on');setTimeout(()=>el.remove(),300)};el.querySelector('.xb').onclick=kill;
 const a=el.querySelector('.lnk');if(a)a.onclick=()=>{o.fn&&o.fn();kill()}}
function migrNotice(){const m=S.migr[S.migr.length-1];if(!m||m.shown)return false;m.shown=true;save();
 banner({b1:'BeFree Streak was updated, and your habits and ticks were kept',b2:m.notes.map(esc).join('. ')+'. Each habit can now have a smallest version for hard days.',
  action:'Add details',fn:()=>{const h=S.habits[0];if(h)openHabit(h)}});return true}
function backupNudge(){if(!LIVE)return false;const n=Object.keys(S.ticks).length;if(n<30)return false;
 if(!S.lastExport||diffD(S.lastExport,today())>=30){banner({b1:S.lastExport?`No backup in ${diffD(S.lastExport,today())} days`:'Your record lives on this device only',
  b2:'A backup file takes a couple of seconds and keeps every tick safe.',action:'Save a backup',fn:doExport});return true}return false}
/* daily reminder (opt in, Settings): has today got a tick yet? With no
   habits set up there is nothing to tick, so there is nothing to remind */
window.__bfReminderCheck=function(){
 if(!S.habits.length)return true;
 const t=today();return S.habits.some(h=>!!S.ticks[h.id+'|'+t])};
function remindBanner(){
 if(!remindCheck())return false;
 banner({b1:'Nothing ticked yet today',b2:'A quick check-in keeps the streak honest.',
  action:'Open a habit',fn:()=>{const h=S.habits[0];if(h)openHabit(h)}}); return true}

/* ── theme ─────────────────────────────────────────── */
const SUN='M12 3v2M12 19v2M5 12H3M21 12h-2M6 6 4.6 4.6M19.4 19.4 18 18M6 18l-1.4 1.4M19.4 4.6 18 6M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z';
const MOON='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';
const mqDark=matchMedia('(prefers-color-scheme: dark)');
function themePref(){let p=DB.g('befree.streak.theme.v2');if(p==null)p=DB.g('befree.theme');if(p==null)p=DB.g('befree.streak.theme');return p==='light'||p==='dark'||p==='system'?p:'system'}
function applyTheme(){const p=themePref(),n=p==='system'?(mqDark.matches?'dark':'light'):p;
 document.documentElement.dataset.theme=n;$('#thI').setAttribute('d',n==='dark'?MOON:SUN);
 $('#thBtn').setAttribute('aria-label',n==='dark'?'Switch to light theme':'Switch to dark theme');
 const tc=document.querySelector('meta[name=theme-color]');if(tc)tc.setAttribute('content',n==='dark'?'#011B08':'#E6F1E8')}
function setThemePref(p){DB.s('befree.streak.theme.v2',p);applyTheme();setTimeout(render,60)}
mqDark.addEventListener&&mqDark.addEventListener('change',()=>{if(themePref()==='system'){applyTheme();render()}});
$('#thBtn').onclick=()=>setThemePref(document.documentElement.dataset.theme==='dark'?'light':'dark');
window.onStorageLost=()=>{try{toast('This browser stopped saving. Back up now.')}catch(e){}};
addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){if(refreshDates()|autoTick())save();render()}});

/* ── PWA ───────────────────────────────────────────── */
function iconURL(size,mask){
 const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
 /* Streak's identity: Gap's ring on cream, with a check inside */
 const BG='#F2DDB0',CR='#113C1E',GD='#C9790C';
 x.fillStyle=BG;x.fillRect(0,0,size,size);
 {const s=size/64*(mask?0.322/0.42:1);x.save();x.translate(size/2,size/2);x.strokeStyle=CR;x.lineWidth=4.4*s;x.lineCap='round';x.lineJoin='round';
  x.beginPath();x.moveTo(-7.5*s,1.5*s);x.lineTo(-2*s,7*s);x.lineTo(8*s,-4*s);x.stroke();x.restore()}
 const k=(mask?0.322:0.42)*size/142.03, cx=size/2-5.74*k, cy=size/2+8.68*k;
 x.save();x.translate(cx,cy);x.scale(k,k);
 x.strokeStyle=CR;x.lineWidth=38.49;x.lineCap='butt';
 x.beginPath();x.arc(0,0,80.755,-0.241725,4.428644,false);x.stroke();
 x.fillStyle=GD;x.beginPath();x.arc(88.29,-94.18,23.19,0,7);x.fill();
 x.restore();
 return c.toDataURL('image/png')}
if(LIVE)(async()=>{ try{
 if(!location.protocol.startsWith('http'))throw 0;
 const r=await fetch('manifest.webmanifest',{cache:'no-store'});
 if(r.ok){await r.json();return}
 throw 0;
}catch(e){ try{
 const mf={name:'Streak',short_name:'Streak',start_url:'.',scope:'.',display:'standalone',
  orientation:'portrait',background_color:'#011B08',theme_color:'#011B08',
  description:'Small, repeatable money habits. Records are stored in this browser.',
  icons:[{src:iconURL(192),sizes:'192x192',type:'image/png',purpose:'any'},
         {src:iconURL(512),sizes:'512x512',type:'image/png',purpose:'any'},
         {src:iconURL(512,true),sizes:'512x512',type:'image/png',purpose:'maskable'}]};
 document.querySelectorAll('link[rel=manifest]').forEach(l=>l.remove());
 const l=document.createElement('link');l.rel='manifest';
 l.href=URL.createObjectURL(new Blob([JSON.stringify(mf)],{type:'application/manifest+json'}));
 document.head.appendChild(l);
 const ap=document.querySelector('link[rel=apple-touch-icon]')||document.createElement('link');
 ap.rel='apple-touch-icon';ap.href=mf.icons[0].src;document.head.appendChild(ap);
}catch(x){} }})();
let deferred=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('#installBtn').style.display='grid';$('#installBtn').classList.add('hot')});
$('#installBtn').onclick=async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;$('#installBtn').style.display='none'};
addEventListener('appinstalled',()=>{$('#installBtn').style.display='none';toast('Added to your home screen. It works with no signal.')});
if(window.top===window.self&&LIVE&&'serviceWorker' in navigator&&location.protocol.startsWith('http')){
 const had=!!navigator.serviceWorker.controller;
 navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(r=>{
  r.addEventListener('updatefound',()=>{const w=r.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='activated'&&had)
   banner({b1:'A new version of Streak is ready',b2:'Reload to use it. Your habits are not affected.',action:'Reload',fn:()=>location.reload()})})})}).catch(()=>{})}

/* ══════════ last resort ══════════ */
addEventListener('error',ev=>{ if(window.__bfDown)return; window.__bfDown=true;
 try{console.error(ev.error||ev.message)}catch(e){}
 try{const d=document.createElement('div');d.setAttribute('role','alert');
  d.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;padding:13px 15px;border-radius:12px;background:var(--card2,#fff);border:1px solid var(--neg,#9E472B);color:var(--tx,#10231B);font:14px/1.5 Poppins,system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.18)';
  d.innerHTML='<b>Something went wrong on screen.</b><br>Your saved record is untouched. Close this tab and open the app again. If it keeps happening, save a backup first.';
  document.body.appendChild(d)}catch(e){}});

/* ── boot ──────────────────────────────────────────── */
applyTheme();
refreshDates();autoTick();save();render();
if(!migrNotice()&&!backupNudge())remindBanner();

/* ══════════ one install card, both platforms ══════════
   The shortest path to a permanent record differs by phone, so the card asks
   for the same thing in the same place and only the middle changes: Android
   gets the browser's own one-tap install, iPhone gets the two taps Safari
   requires because Apple exposes no install API. Once the app is running from
   the Home Screen the card never appears again, and on iPhone that is also
   what stops Safari deleting the record after seven days. */
(function(){
 if(window.top!==window.self)return;
 var ua = navigator.userAgent || '';
 var iOS = /iP(hone|ad|od)/.test(ua) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
 var installed = window.navigator.standalone === true ||
                 (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
 if (installed) return;

 /* Not every browser can do this, and the ones that can do not all call it the
    same thing. Firefox on a desktop cannot install a web app at all, so it is
    told nothing rather than pointed at a menu item that does not exist. */
 var android   = /Android/.test(ua);
 var handheld  = iOS || android;
 var firefox   = /Firefox\//.test(ua);
 var macSafari = /Macintosh/.test(ua) && /Version\/\d/.test(ua) &&
                 !/Chrom|Edg|OPR/.test(ua);
 var DEV  = handheld ? 'phone' : 'computer';
 var HOME = handheld ? 'Home Screen' : 'desktop';

 var SNOOZE = 'befree.install.snooze';
 var snoozed = false;
 try { snoozed = +(localStorage.getItem(SNOOZE) || 0) > Date.now(); } catch(e) {}

 var prompted = null;          // the Android install event, once it arrives
 var el = null, obs = null;

 var SHARE = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" '
   + 'style="vertical-align:-3px"><path d="M12 3v12M12 3 8.5 6.5M12 3l3.5 3.5" fill="none" '
   + 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
   + '<path d="M6 12H4.8v7.2A1.8 1.8 0 0 0 6.6 21h10.8a1.8 1.8 0 0 0 1.8-1.8V12H18" '
   + 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

 /* The browser's own menu buttons, drawn rather than typed: the font the app
    carries is a Latin subset, so a real \u22ee or \u2022\u2022\u2022 would fall back to whatever
    the system has, at a different size and weight. */
 var KEBAB = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" '
   + 'style="vertical-align:-3px" fill="currentColor"><circle cx="12" cy="5" r="2.1"/>'
   + '<circle cx="12" cy="12" r="2.1"/><circle cx="12" cy="19" r="2.1"/></svg>';
 var MEAT = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" '
   + 'style="vertical-align:-3px" fill="currentColor"><circle cx="5" cy="12" r="2.1"/>'
   + '<circle cx="12" cy="12" r="2.1"/><circle cx="19" cy="12" r="2.1"/></svg>';

 var LEAD = '<p>A few taps and Streak sits on your ' + DEV + ' like any other app \u2014 no '
   + 'app store, no account. It opens in its own window, works with the internet off, '
   + 'and your figures stay for good.</p>';

 function body(){
   if (prompted) {
     return LEAD + '<div class="ic-row"><button type="button" class="ic-go" id="icGo">'
       + 'Add to my ' + DEV + '</button></div>';
   }
   /* Safari moved Share behind the page menu in iOS 26, and it sits at the top
      on an iPad, so the button is named rather than placed. */
   if (iOS) {
     return LEAD
       + '<ol class="ic-s"><li>Tap ' + SHARE + ' in Safari. Don\u2019t see it? Tap '
       + MEAT + ' beside the address bar first</li>'
       + '<li>Tap <b>Add to Home Screen</b>, then <b>Add</b>. Leave <b>Open as Web App</b> on if you see it</li></ol>'
       + '<p class="ic-n">In Safari, what this page saves can be cleared after seven days without a visit. '
       + 'On your Home Screen it stays \u2014 so set up there, not here.</p>';
   }
   if (macSafari) {
     return LEAD + '<ol class="ic-s"><li>Open the <b>File</b> menu</li>'
       + '<li>Choose <b>Add to Dock</b>, then <b>Add</b></li></ol>'
       + '<p class="ic-n">No <b>Add to Dock</b>? It needs macOS Sonoma or later \u2014 '
       + 'on an older Mac, open this page in Chrome instead.</p>';
   }
   /* Chrome's own wording, so the choice on screen is the one named here:
      a shortcut only bookmarks the page, an install keeps it offline. */
   if (android) {
     return LEAD + '<ol class="ic-s"><li>Tap ' + KEBAB + ' at the top right</li>'
       + '<li>Choose <b>Add to Home screen</b>, then <b>Install</b> \u2014 not <b>Create shortcut</b></li></ol>';
   }
   return LEAD
     + '<ol class="ic-s"><li>In Chrome, open ' + KEBAB + ', then <b>Cast, save, and share</b>, '
     + 'then <b>Install page as app</b></li>'
     + '<li>In Edge, open ' + MEAT + ', then <b>Apps</b>, then <b>Install this site as an app</b></li></ol>';
 }

 function host(){
   var su = document.querySelector('#setup.on');
   if (su) return su.querySelector('.sin') || su;
   return document.querySelector('.wrap') || document.body;
 }

 function paint(){
   if (!el) return;
   el.querySelector('.ic-b').innerHTML = body();
   var go = el.querySelector('#icGo');
   if (go) go.onclick = async function(){
     if (!prompted) return;
     var p = prompted; prompted = null;
     try { p.prompt(); var r = await p.userChoice;
       if (r && r.outcome === 'accepted') { close(true); return; }
     } catch(e) {}
     prompted = p; paint();
   };
   var save = el.querySelector('#icSave');
   if (save) save.onclick = function(){
     try { if (window.doExport) window.doExport(); } catch(e) {}
   };
 }

 function close(forGood){
   if (!forGood) { try { localStorage.setItem(SNOOZE, Date.now() + 864e5); } catch(e) {} }
   if (obs) obs.disconnect();
   if (el) el.remove();
   el = null;
 }

 /* shown after the page is on screen, it floats instead of pushing the
    page down while someone is reading it — except over the first-run
    questions, which cover the whole screen, so a floating card would sit
    behind them unseen. There it joins the questions and moves out with them. */
 function show(late){
   if (el || snoozed) return;
   if (document.querySelector('#setup.on')) late = false;
   el = document.createElement('section');
   el.className = 'instcard' + (late ? ' float' : '');
   el.setAttribute('role', 'region');
   el.setAttribute('aria-label', 'Add Streak to your ' + DEV);
   el.innerHTML =
     '<div class="ic-h"><b>Keep Streak on your ' + DEV + '</b>'
   + '<button type="button" class="ic-x">Later</button></div>'
   + '<div class="ic-b"></div>'
   + '<button type="button" class="ic-save" id="icSave">Or save a backup file first</button>';
   var h = host();
   var hd = h.querySelector(':scope > header');
   if (late) document.body.appendChild(el); else h.insertBefore(el, hd ? hd.nextSibling : h.firstChild);
   el.querySelector('.ic-x').onclick = function(){ close(false); };
   paint();
   var su = document.querySelector('#setup');
   if (su && !late && window.MutationObserver) {
     obs = new MutationObserver(function(){
       if (!el) return;
       var h2 = host(), hd2 = h2.querySelector(':scope > header');
       if (el.parentElement !== h2) h2.insertBefore(el, hd2 ? hd2.nextSibling : h2.firstChild);
     });
     obs.observe(su, {attributes: true, attributeFilter: ['class']});
   }
 }

 /* Android fires this a moment after load; iPhone never does. */
 window.addEventListener('beforeinstallprompt', function(e){
   e.preventDefault(); prompted = e;
   if (el) paint(); else show(true);
 });
 window.addEventListener('appinstalled', function(){ close(true); });

 function start(){
   if (iOS || macSafari || android) { show(); return; }
   /* A computer can install from the browser's own menu even when the browser
      never offers to do it for you — Chrome rations that offer per site, so the
      second app someone adds often gets nothing. The wait gives the one-tap
      button its chance first, and Firefox, which cannot install at all, is
      never asked. */
   var chromium = /Chrom|Edg|OPR/.test(ua) && !firefox;
   setTimeout(function(){ if (prompted || chromium) show(true); }, 2500);
 }
 /* this script runs at the end of the page, so the card goes in before the
    first paint rather than pushing the page down a moment later */
 if (document.querySelector('.wrap')) start();
 else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
 else start();
})();


/* ══════════ optional PIN lock, shared by both apps ══════════
   Each app has its own PIN: the config lives in
   its own localStorage key (not inside either app's own record, so it
   never gets caught up in an export, a restore, or a version migration),
   and it is checked before either app ever paints on screen — the
   data-applock attribute is set pre-paint by the inline head script, so
   there is nothing to flash while this file loads. The PIN itself is
   never stored: only a salted hash. */
/* each app keeps its own PIN. Older builds shared befree.applock.v1 with
   Gap; that value is copied once, and turning the PIN off here stores
   {on:false} so the shared copy can't switch it back on. */
const AL_KEY='befree.streak.applock.v2',AL_OLD='befree.applock.v1';
const AL_SUPPORTED=!!(window.crypto&&crypto.subtle&&crypto.subtle.digest&&crypto.getRandomValues);

function alGet(){try{let v=JSON.parse(localStorage.getItem(AL_KEY));
  if(v==null){v=JSON.parse(localStorage.getItem(AL_OLD));if(v&&v.on&&v.hash&&v.salt)localStorage.setItem(AL_KEY,JSON.stringify(v))}
  return v&&v.on&&v.hash&&v.salt?v:null}catch(e){return null}}
function alSet(v){try{localStorage.setItem(AL_KEY,JSON.stringify(v||{on:false}))}catch(e){}}
function alRandSalt(){const a=new Uint8Array(16);crypto.getRandomValues(a);return[...a].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function alHash(pin,salt){
 const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('befree.pin:'+salt+':'+pin));
 return[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}

/* ── the lock screen itself ── */
function alShow(){
 document.documentElement.setAttribute('data-applock','1');
 const scr=$('#alScr');if(scr)scr.removeAttribute('aria-hidden');
 const inp=$('#alPin');if(inp)inp.value='';
 const err=$('#alErr');if(err)err.textContent='';
 setTimeout(()=>{try{inp&&inp.focus()}catch(e){}},50);
}
function alHide(){
 document.documentElement.removeAttribute('data-applock');
 const scr=$('#alScr');if(scr)scr.setAttribute('aria-hidden','true');
 const inp=$('#alPin');if(inp)inp.value='';
}
async function alCheck(){
 const cfg=alGet(),inp=$('#alPin');if(!cfg||!inp)return;
 const v=inp.value.trim();if(!v)return;
 const h=await alHash(v,cfg.salt);
 if(h===cfg.hash){alHide();try{closeAll(true)}catch(e){}}
 else{$('#alErr').textContent='That PIN is not right. Try again.';inp.value='';inp.focus();
  try{navigator.vibrate&&navigator.vibrate(70)}catch(e){}}
}
if($('#alGo'))$('#alGo').onclick=alCheck;
if($('#alPin'))$('#alPin').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();alCheck()}});
if($('#alForgot'))$('#alForgot').onclick=async()=>{
 if(typeof window.bfWipeEverything!=='function')return;
 const ok=await window.bfWipeEverything();
 if(ok){alSet(null);alHide()}
};

/* re-lock the instant the tab is put away, so nothing is ever left open
   behind it — by the time anyone looks again, the screen is already up */
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='hidden'&&alGet())alShow();
});

/* ── settings: turn on, turn off, change ── */
function alRefreshRow(){
 const on=!!alGet(),sw=$('#swLock'),d=$('#lockDesc'),row=$('#lockChangeRow');
 if(sw){sw.setAttribute('aria-checked',String(on));
  if(!AL_SUPPORTED){sw.disabled=true;sw.setAttribute('aria-disabled','true')}}
 if(d)d.textContent=AL_SUPPORTED?(on?'On':'Off'):'Not available in this browser';
 if(row)row.style.display=on?'flex':'none';
}
let alStep1=null;
function alResetSheet(){
 alStep1=null;
 $('#lockPinTitle').textContent='Set a PIN';
 $('#lockPinSub').textContent='Choose 4 to 6 digits. You’ll need it to open Streak on this device.';
 $('#lockPinLbl').textContent='PIN';
 $('#lockPinA').value='';$('#lockPinErr').textContent='';$('#lockPinGo').textContent='Continue';
}
function alOpenSet(){if(!AL_SUPPORTED)return;alResetSheet();show('#shLockPin')}
if($('#swLock'))$('#swLock').onclick=async()=>{
 if(!AL_SUPPORTED)return;
 if(alGet()){
  if(!await ask('Turn off the PIN?','Anyone who opens Streak on this device will see your data.','Turn off',true))return;
  alSet(null);alRefreshRow();toast('PIN turned off');return;
 }
 alOpenSet();
};
if($('#lockChangeBtn'))$('#lockChangeBtn').onclick=alOpenSet;
if($('#lockPinGo'))$('#lockPinGo').onclick=async()=>{
 const v=$('#lockPinA').value.trim();
 if(!/^\d{4,6}$/.test(v)){$('#lockPinErr').textContent='Use 4 to 6 digits.';return}
 if(alStep1===null){
  alStep1=v;$('#lockPinA').value='';$('#lockPinErr').textContent='';
  $('#lockPinSub').textContent='Enter it once more to confirm.';$('#lockPinLbl').textContent='Confirm PIN';
  $('#lockPinA').focus();return;
 }
 if(v!==alStep1){alStep1=null;$('#lockPinA').value='';
  $('#lockPinSub').textContent='Choose 4 to 6 digits. You’ll need it to open Streak on this device.';
  $('#lockPinLbl').textContent='PIN';$('#lockPinErr').textContent='Those don’t match. Try again.';
  $('#lockPinA').focus();return}
 const salt=alRandSalt(),hash=await alHash(v,salt);
 alSet({on:true,hash,salt});
 closeAll();alRefreshRow();toast('PIN set. It protects Streak on this device.');
};
alRefreshRow();


/* ══════════ optional daily reminder ══════════
   Two layers, and only one of them is actually reliable:
   1. An in-app nudge, shown at most once a day, the moment the app is
      opened and today has nothing logged yet. Needs no permission and
      works on every device — this is what the feature can promise.
   2. A background notification through Periodic Background Sync, where a
      Chromium browser grants it to an installed app. It is genuinely
      best-effort: the browser decides if and when it fires, and Safari on
      iPhone and iPad does not implement it at all, so there the in-app
      nudge is the only version anyone will see. Each app defines its own
      window.__bfReminderCheck() (has today already got an entry?) — this
      file only handles the permission, the switch and the registration. */
const RM_SUPPORTED = 'Notification' in window && 'serviceWorker' in navigator;
const RM_SYNC_SUPPORTED = RM_SUPPORTED && 'periodicSync' in (window.ServiceWorkerRegistration ? ServiceWorkerRegistration.prototype : {});

async function rmTrySync(on){
 if(!RM_SYNC_SUPPORTED)return;
 try{
  const reg=await navigator.serviceWorker.ready;
  if(on){
   const status=await navigator.permissions.query({name:'periodic-background-sync'}).catch(()=>null);
   if(!status||status.state==='granted')
    await reg.periodicSync.register('befree-daily-reminder',{minInterval:20*60*60*1000}).catch(()=>{});
  } else {
   await reg.periodicSync.unregister('befree-daily-reminder').catch(()=>{});
  }
 }catch(e){}
}

function rmRefreshRow(){
 const on=!!(S.prefs&&S.prefs.reminder),sw=$('#swRemind'),d=$('#remindDesc');
 if(!sw||!d)return;
 if(!RM_SUPPORTED){sw.disabled=true;sw.setAttribute('aria-disabled','true');d.textContent='Not available in this browser';return}
 sw.setAttribute('aria-checked',String(on));
 if(!on){d.textContent='Off';return}
 if(Notification.permission==='denied'){d.textContent='Blocked — allow notifications for this site to turn it back on';return}
 d.textContent='On — plus a note here on days you haven’t logged anything yet';
}

if($('#swRemind'))$('#swRemind').onclick=async()=>{
 if(!RM_SUPPORTED)return;
 const on=!!(S.prefs&&S.prefs.reminder);
 if(on){
  S.prefs.reminder=false;save();rmRefreshRow();rmTrySync(false);toast('Daily reminder off');return;
 }
 if(Notification.permission==='denied'){
  toast('Notifications are blocked for this site. Allow them in your browser’s site settings, then try again.');
  return;
 }
 let perm=Notification.permission;
 if(perm==='default')perm=await Notification.requestPermission().catch(()=>'denied');
 S.prefs.reminder=true;save();rmRefreshRow();
 if(perm==='granted'){rmTrySync(true);toast('Daily reminder on')}
 else toast('Reminder on. Without notification permission you’ll still see it here when you open the app.');
};
rmRefreshRow();

/* the reliable half: once a day, once per app open, only if there is
   really nothing logged yet today */
function remindCheck(){
 if(!S.prefs||!S.prefs.reminder)return false;
 if(S.remindShown===today())return false;
 if(typeof window.__bfReminderCheck!=='function'||window.__bfReminderCheck())return false;
 S.remindShown=today();save();
 return true;
}


function revisionRecovery(){
 let box=document.getElementById('revisionRecovery');if(!box){box=document.createElement('section');box.id='revisionRecovery';box.className='card';const host=document.querySelector('main')||document.querySelector('.wrap')||document.body;host.appendChild(box);}
 const t=today(),r7=rate(S.habits,addD(t,-6),t),r30=rate(S.habits,addD(t,-29),t);
 let lastMiss=null,lastReturn=null;for(let i=29;i>=0;i--){const d=addD(t,-i);if(S.habits.some(h=>status(h,d,t)==='missed')){lastMiss=d;lastReturn=null}else if(lastMiss&&!lastReturn&&S.habits.some(h=>DONE.has(status(h,d,t))))lastReturn=d;}
 box.setAttribute('aria-labelledby','rcT');
 box.innerHTML=`<div class="ch"><h2 class="eb" id="rcT">Coming back</h2><div class="eb mono">last 30 days</div></div><p>${lastReturn?`You came back on <b>${fmtD(lastReturn)}</b> after a missed day. Coming back is the habit that matters most.`:'Missed a day? Do the small version next time. There is nothing to catch up on.'}</p><p class="foot">Last 7 days: ${r7.d} of ${r7.t} done. Last 30 days: ${r30.d} of ${r30.t}. Today counts once it is done.${Object.keys(S.legacyAutoTicks||{}).length?' Ticks the older version made for you are kept as they were.':''}</p>`;
}

