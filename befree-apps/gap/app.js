
/* ══════════ storage ══════════ */
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
const money=n=>{const a=Math.round(Math.abs(n));return (n<0&&a?'−':'')+'$'+a.toLocaleString('en-US')};
const money2=n=>(n<0?'−':'')+'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const uid=()=>Math.random().toString(36).slice(2,10);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const ym=d=>iso(d).slice(0,7);
const today=()=>iso(new Date());
const dayCount=(y,m)=>new Date(y,m+1,0).getDate();
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const D=s=>new Date(s+'T00:00:00');
const addD=(s,n)=>{const d=D(s);d.setDate(d.getDate()+n);return iso(d)};
const diffD=(a,b)=>Math.round((D(b)-D(a))/864e5);
const fmtD=(s,o)=>D(s).toLocaleDateString('en-US',o||{month:'short',day:'numeric'});
const wdD=s=>D(s).toLocaleDateString('en-US',{weekday:'short'});
const r2=n=>Math.round(n*100)/100;
const sum=(l,f)=>l.reduce((a,x)=>a+(f?f(x):x),0);
const plural=(n,w,ws)=>`${n} ${n===1?w:(ws||w+'s')}`;

const CATS={income:['Paycheck','Tips','Freelance','Side income','Benefits','Other'],
 fixed:['Rent','Utilities','Phone','Internet','Insurance','Car payment','Loan payment','Child care','Subscriptions','Debt minimum','Taxes','Estimated income tax'],
 variable:['Groceries','Dining out','Gas','Shopping','Entertainment','Health','Kids','Car maintenance','Gifts','Business expense','Interest and fees','Other'],
 transfer:['Savings','Goal','Sinking fund','Tax reserve','Card payment','Debt payment','Investing','Between accounts']};
/* Essential versus discretionary is its own axis, independent of fixed and
   variable. These are defaults; every one can be changed in Settings. */
const ESS0={Rent:1,Utilities:1,Phone:1,Internet:1,Insurance:1,'Car payment':1,'Loan payment':1,'Child care':1,
 'Debt minimum':1,Taxes:1,Groceries:1,Gas:1,Health:1,Kids:1,'Car maintenance':1,'Business expense':1,
 Subscriptions:0,'Dining out':0,Shopping:0,Entertainment:0,Gifts:0,Other:0};
const SAVE_CATS=['Savings','Goal','Sinking fund','Tax reserve','Investing'];
/* ══════════ icons ══════════ */
const IP={
 money:'<rect x="2.4" y="6" width="19.2" height="12" rx="2.4"/><circle cx="12" cy="12" r="2.7"/>',
 coin:'<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6v8.8M14.4 9.6c-.6-.6-1.5-.9-2.4-.9-1.3 0-2.4.6-2.4 1.7s1.1 1.4 2.4 1.7 2.4.6 2.4 1.7-1.1 1.7-2.4 1.7c-.9 0-1.8-.3-2.4-.9"/>',
 laptop:'<rect x="3.2" y="5" width="17.6" height="11.5" rx="2"/><path d="M2 20h20"/>',
 case:'<rect x="2.5" y="7.2" width="19" height="12.6" rx="2.2"/><path d="M8.4 7.2V5.4a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2v1.8"/><path d="M2.5 12.4h19"/>',
 back:'<path d="M3.2 12a8.8 8.8 0 1 0 2.9-6.6"/><path d="M3.2 4.2v5.2h5.2"/>',
 dot:'<circle cx="12" cy="12" r="3.4"/>',
 home:'<path d="M3.2 10.6 12 3.4l8.8 7.2"/><path d="M5.6 9.6V20h12.8V9.6"/>',
 zap:'<path d="M13.2 2.6 5 13.4h5.6L10 21.4 19 10.6h-5.6z"/>',
 phone:'<rect x="6.2" y="2.4" width="11.6" height="19.2" rx="2.6"/><path d="M10.4 18.4h3.2"/>',
 wifi:'<path d="M2.6 9.2a14.6 14.6 0 0 1 18.8 0"/><path d="M6.2 12.8a9.4 9.4 0 0 1 11.6 0"/><path d="M9.6 16.2a4.6 4.6 0 0 1 4.8 0"/><circle cx="12" cy="19.4" r=".9"/>',
 shield:'<path d="M12 3.2 4.6 6.2v5.6c0 4.4 3.1 7.8 7.4 8.9 4.3-1.1 7.4-4.5 7.4-8.9V6.2z"/>',
 car:'<path d="M5 11.2 6.7 6.9a2 2 0 0 1 1.9-1.3h6.8a2 2 0 0 1 1.9 1.3L19 11.2"/><rect x="3" y="11.2" width="18" height="5.8" rx="2"/><circle cx="7.4" cy="17" r="1.5"/><circle cx="16.6" cy="17" r="1.5"/>',
 heart:'<path d="M12 20.2s-7.2-4.4-7.2-9.2A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.2 2.7c0 4.8-7.2 9.2-7.2 9.2z"/>',
 loop:'<path d="M16.8 2.6 20.8 6l-4 3.4"/><path d="M3.2 12.4V9.6a3 3 0 0 1 3-3h14.6"/><path d="M7.2 21.4 3.2 18l4-3.4"/><path d="M20.8 11.6v2.8a3 3 0 0 1-3 3H3.2"/>',
 card:'<rect x="2.4" y="5.2" width="19.2" height="13.6" rx="2.4"/><path d="M2.4 10h19.2"/>',
 file:'<path d="M13.8 3.2H7.2a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2V8.4z"/><path d="M13.8 3.2v5.2h5"/>',
 up:'<path d="M12 20.2V4.6"/><path d="M6 10.6 12 4.6l6 6"/>',
 down:'<path d="M12 3.8v15.6"/><path d="M18 13.4 12 19.4l-6-6"/>',
 basket:'<path d="M3.2 9.2h17.6l-1.6 10a2 2 0 0 1-2 1.7H6.8a2 2 0 0 1-2-1.7z"/><path d="M8.6 9.2 12 3.2l3.4 6"/>',
 fork:'<path d="M6.4 3v7.6a2.4 2.4 0 0 0 4.8 0V3"/><path d="M8.8 10.6V21"/><path d="M17.4 3c-1.4 1-2 3-2 5.4 0 1.6.7 2.5 2 2.8V21"/>',
 fuel:'<path d="M4.4 21V5.2a2 2 0 0 1 2-2h4.8a2 2 0 0 1 2 2V21"/><path d="M3 21h11.6"/><path d="M13.2 9.4h2.6a2 2 0 0 1 2 2v5.8a1.8 1.8 0 0 0 3 1.3"/>',
 bag:'<path d="M5.2 7.2h13.6l1 13.6H4.2z"/><path d="M9 10.2V6.4a3 3 0 0 1 6 0v3.8"/>',
 play:'<circle cx="12" cy="12" r="8.4"/><path d="M10.4 9.1 15 12l-4.6 2.9z"/>',
 cross:'<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><path d="M12 8.2v7.6M8.2 12h7.6"/>',
 alert:'<path d="M12 3.6 21.6 20.4H2.4z"/><path d="M12 10v4.2M12 17.4v.1"/>',
 target:'<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.9"/>',
 drop:'<path d="M12 3.4c3.2 3.7 5.5 6.4 5.5 9.1a5.5 5.5 0 0 1-11 0c0-2.7 2.3-5.4 5.5-9.1z"/>',
 cal:'<rect x="3.2" y="4.6" width="17.6" height="16" rx="2.4"/><path d="M3.2 9.4h17.6M8 2.8v3.6M16 2.8v3.6"/>',
 swap:'<path d="M4 8h14l-3.6-3.6M20 16H6l3.6 3.6"/>',
 check:'<path d="m5 13 4 4L19 7"/>',
 gift:'<rect x="3.4" y="8.4" width="17.2" height="12" rx="1.6"/><path d="M12 8.4v12M3.4 12.4h17.2M12 8.4c-1.6-3.6-5.6-4-5.6-1.6 0 1.6 2.8 1.6 5.6 1.6zm0 0c1.6-3.6 5.6-4 5.6-1.6 0 1.6-2.8 1.6-5.6 1.6z"/>',
 wrench:'<path d="M14.6 6.2a4.4 4.4 0 0 0-5.8 5.4L3.6 16.8a1.9 1.9 0 0 0 2.7 2.7l5.2-5.2a4.4 4.4 0 0 0 5.4-5.8l-2.6 2.6-2.3-.4-.4-2.3z"/>',
 bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.2 1.4 1.2 2.2h4.8c0-.8.4-1.6 1.2-2.2A6 6 0 0 0 12 3z"/>'
};
const ico=(n,sz)=>{const p=IP[n]||IP.dot;
 return `<svg viewBox="0 0 24 24" width="${sz||16}" height="${sz||16}" fill="none" stroke="currentColor"
  stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`};
const INFO_I='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.1"/></svg>';
const ICON={Paycheck:'money',Tips:'coin',Freelance:'laptop','Side income':'case',Benefits:'shield',Refund:'back',Other:'dot',
 Rent:'home',Utilities:'zap',Phone:'phone',Internet:'wifi',Insurance:'shield','Car payment':'car','Loan payment':'card',
 'Child care':'heart',Subscriptions:'loop','Debt minimum':'card',Taxes:'file',Savings:'up',
 Groceries:'basket','Dining out':'fork',Gas:'fuel',Shopping:'bag',Entertainment:'play',Health:'cross',Kids:'heart',
 'Car maintenance':'wrench',Gifts:'gift','Business expense':'case',
 Goal:'target','Sinking fund':'cal','Tax reserve':'file','Card payment':'card','Between accounts':'swap'};
const FALLBACK=['dot','case','loop','target','drop','play','bag','file','coin','zap'];
const userCats=t=>(S.cats&&S.cats[t])||[];
const allCats=t=>CATS[t].concat(userCats(t));
function addCat(t,name){
 name=name.trim().replace(/\s+/g,' ').slice(0,22);
 if(!name)return null;
 const hit=allCats(t).find(c=>c.toLowerCase()===name.toLowerCase());
 if(hit)return hit;
 S.cats=S.cats||{income:[],fixed:[],variable:[],transfer:[]};
 (S.cats[t]=S.cats[t]||[]).push(name);
 ICON[name]=FALLBACK[(name.length*7+name.charCodeAt(0))%FALLBACK.length];
 save();return name}
function seedGlyphs(){
 ['income','fixed','variable','transfer'].forEach(t=>userCats(t).forEach(n=>{
  if(!ICON[n])ICON[n]=FALLBACK[(n.length*7+n.charCodeAt(0))%FALLBACK.length]}))}
function dropCat(t,name){
 if(!S.cats||!S.cats[t])return;
 S.cats[t]=S.cats[t].filter(c=>c!==name);save()}
function isEss(cat,type){
 if(S.ess&&cat in S.ess)return !!S.ess[cat];
 if(cat in ESS0)return !!ESS0[cat];
 return type==='fixed'}
/* monthly caps shown against variable categories — guideposts, not verdicts */
const LIMITS={Groceries:420,'Dining out':180,Gas:130,Shopping:120,Entertainment:70};

/* ══════════ money semantics ══════════
   Four kinds of entry, and only completed ones move a number:
   income, fixed and variable spending (a refund is negative spending),
   and transfers, which move money between your own places and are never
   spending. Planned entries wait until you confirm them. */
const isDone=t=>(t.status||'done')==='done';
const isPlan=t=>t.status==='planned';
const isSpend=t=>t.type==='fixed'||t.type==='variable';
const spendAmt=t=>isSpend(t)?(t.refund?-t.amt:t.amt):0;
function saveSign(t){
 if(t.type==='transfer'){
  if(t.goal||t.fund||SAVE_CATS.includes(t.cat))return t.dir==='in'?-1:1;
  return 0}
 if(isSpend(t)&&t.fund&&!t.refund)return -1; /* paid out of a sinking fund = taken back out */
 return 0}
/* what an entry does to the checking balance */
function cashEff(t){return BeFreeFinance.cash(t)}
function tot(l){return BeFreeFinance.totals(l)}

/* ══════════ demo data ══════════ */
/* ══════════ sample data: Marcus, from Appendix D ══════════
   F5. The tour runs on the book's Marcus, not an invented stranger. The month
   on screen is his month 7, in progress, where the $154.58 lead differential
   starts. Last month is his month 6, closed: the month the side income begins
   and the first quarterly estimate is paid.
     month 6 · $2,969 in · $2,799.40 out · gap $169.60 · buffer $477.60
     debts  · Card A $4,721.31 · Card B $1,344.25 · Auto $10,520.14 · Medical $1,180
   Appendix D models one month at a time, so his $2,769 of take-home is paid on
   the 1st and the 15th and every calendar month carries all of it. His bills
   are split across the two pay cycles, each one landing just after a deposit,
   which is the book's own advice; the sample is a person who has taken it.
   Essentials come to $2,005 a month and the optional categories to $185.40,
   which is Appendix D's $2,175 of living costs plus its $15.40 of optional
   spending. The one figure Appendix D does not model is a checking balance,
   because it models flows; $810 is the sample. */
const MX={
 pay:1384.50,up:1461.79,
 bills:[['Rent',950,3],['Utilities',165,4],['Phone',55,6],['Insurance',120,18],['Internet',60,20]],
 ess:[['Groceries',105,5],['Groceries',105,12],['Groceries',105,19],['Groceries',105,26],
      ['Gas',78,7],['Gas',77,21],['Health',80,16]],
 opt:[['Dining out',27,3],['Dining out',28,11],['Dining out',27,18],['Dining out',28.4,24],
      ['Subscriptions',32,14],['Entertainment',25,16],['Shopping',18,22]]};
function demoState(){
 const st=blankState();st.setup={done:true,demo:true};
 const t=today(),now=new Date(),Y=now.getFullYear(),M=now.getMonth();
 const mFirst=b=>iso(new Date(Y,M-b,1)),mLast=b=>iso(new Date(Y,M-b+1,0)),start=mFirst(6);
 st.debts=[['Card A','card',4800,4721.31,26.9,120],['Card B','card',1400,1344.25,22.4,35],
  ['Auto','loan',11850,10520.14,14.9,362],['Medical','loan',1180,1180,0,0]]
  .map(([name,kind,total,bal0,apr,min])=>({id:'d'+name.replace(/\W/g,''),kind,name,total,bal0,
   ts:new Date(Y,M,0).getTime()+86399e3,apr,min}));
 const dOf=n=>st.debts.find(x=>x.name===n).id;
 st.goals=[{id:'gE',name:'Buffer Rung 1',target:500,start:0,due:'',emerg:true,made:start}];
 const pay={id:'rPay',kind:'income',cat:'Paycheck',note:'Paycheck',amt:MX.up,freq:'semimonthly',
  day:1,day2:15,wk:'same',on:true,prim:true,start};
 st.rec=[pay];
 MX.bills.forEach(([c,a,d])=>st.rec.push({id:'r'+c.replace(/\W/g,''),kind:'fixed',cat:c,note:c,amt:a,
  freq:'monthly',day:d,wk:'same',on:true,start}));
 st.rec.push({id:'rAuto',kind:'fixed',cat:'Loan payment',note:'Auto loan',amt:362,freq:'monthly',day:17,
  wk:'same',on:true,start,debt:dOf('Auto')});
 st.rec.push({id:'rCardA',kind:'fixed',cat:'Debt minimum',note:'Card A minimum',amt:120,freq:'monthly',day:22,
  wk:'same',on:true,start,debt:dOf('Card A')});
 st.rec.push({id:'rCardB',kind:'fixed',cat:'Debt minimum',note:'Card B minimum',amt:35,freq:'monthly',day:25,
  wk:'same',on:true,start,debt:dOf('Card B')});
 /* Sample data must never run past today. */
 const tx=[],put=(ds,o)=>{if(ds<=t)tx.push(Object.assign({id:uid(),date:ds,status:'done',src:'demo',
  ts:D(ds).getTime()+36e6},o))};
 for(let b=6;b>=0;b--){
  const m=7-b,d0=new Date(Y,M-b,1),Yb=d0.getFullYear(),Mb=d0.getMonth();
  const dt=d=>iso(new Date(Yb,Mb,Math.min(d,dayCount(Yb,Mb))));
  occ(pay,mFirst(b),mLast(b)).forEach(ds=>put(ds,{type:'income',cat:'Paycheck',amt:m>=7?MX.up:MX.pay,
   note:'Paycheck',rid:pay.id,occ:ds}));
  st.rec.filter(r=>r.kind!=='income').forEach(r=>occ(r,mFirst(b),mLast(b)).forEach(ds=>{
   const o={type:r.kind,cat:r.cat,amt:r.amt,note:r.note,rid:r.id,occ:ds};
   if(r.debt){o.debt=r.debt;o.debtRole='minimum';if(r.cat==='Loan payment')o.principal=231.38}
   put(ds,o)}));
  MX.ess.concat(MX.opt).forEach(([c,a,d])=>put(dt(d),{type:'variable',cat:c,amt:a,note:c}));
  if(m>=6){
   put(dt(22),{type:'income',cat:'Side income',amt:200,note:'Weekend install job'});
   put(dt(22),{type:'variable',cat:'Business expense',amt:20,note:'Materials'});
   put(dt(23),{type:'transfer',cat:'Tax reserve',amt:45,dir:'out'})}
  if(m===6){
   put(dt(28),{type:'variable',cat:'Dining out',amt:27,note:'Dining out'});
   put(dt(28),{type:'transfer',cat:'Tax reserve',amt:45,dir:'in'});
   put(dt(28),{type:'fixed',cat:'Taxes',amt:45,note:'Quarterly estimate, Form 1040-ES'})}
  /* month 7 is still open, so nothing is assigned out of it yet */
  if(m<7)put(dt(28),{type:'transfer',cat:'Savings',amt:m===6?169.6:61.6,dir:'out',goal:'gE'});
  if(m<7)st.reviewed[iso(d0).slice(0,7)]=true;
 }
 st.tx=tx;
 for(let i=1;i<=60;i++){const d=addD(t,-i);if(d>=start)st.checks[d]={t:'complete',ts:D(d).getTime()+54e6,src:'gap'}}
 st.tax={on:true,rate:25,cats:['Side income'],biz:true};
 st.bal={amt:810,asOf:t,ts:Date.now()};
 st.cyc={buf:100,ess:null,funds:true,cardReserve:0};
 st.lastRun=ym(new Date());st.seenMonth=ym(new Date());
 return st}
function blankState(){return{v:5,reviewed:{},setup:{done:false,demo:false},tx:[],goals:[],debts:[],rec:[],funds:[],
 route:{gap:50,debt:25,you:25},vari:{on:false,tax:25},tax:{on:false,rate:25,cats:['Freelance','Side income'],biz:true},
 prefs:{askRoute:true,monthNudge:true,reminder:false},streak:{n:0,best:0,last:'',days:[]},
 bal:null,cyc:{buf:null,ess:null,funds:true},ess:{},checks:{},inbox:[],
 won:[],lastRun:'',seenMonth:ym(new Date()),remindShown:'',weekly:false,weeklyShown:'',theme:null,migr:[]}}

/* ══════════ load + migrate ══════════
   The v3 record is never overwritten: v4 is written under its own key, so the
   older copy stays on the device as a fallback until the person clears it. */
const KEY='befree.v5';
function migrate(d,from){
 const log=[];const t=today();const now=Date.now();
 let st=Object.assign(blankState(),d);
 st.route=Object.assign({gap:50,debt:25,you:25},st.route);
 st.prefs=Object.assign({askRoute:true,monthNudge:true,reminder:false},st.prefs);
 st.streak=Object.assign({n:0,best:0,last:'',days:[]},st.streak);
 st.cyc=Object.assign({buf:null,ess:null,funds:true},st.cyc);
 st.tax=Object.assign({on:false,rate:25,cats:['Freelance','Side income'],biz:true},st.tax);
 ['tx','goals','debts','rec','funds','won','inbox','migr'].forEach(k=>{if(!Array.isArray(st[k]))st[k]=[]});
 if(!st.checks||typeof st.checks!=='object')st.checks={};
 if(!st.ess||typeof st.ess!=='object')st.ess={};
 if((d.v||0)<4){
  /* uneven-paycheck mode becomes two honest settings: income varies, and a tax reserve estimate */
  if(d.vari&&d.vari.on){st.tax.on=true;st.tax.rate=+d.vari.tax||25;st.tax.cats=['Tips','Freelance','Side income'];log.push('Tax reserve kept on at '+st.tax.rate+'% (now labeled an estimate)')}
  const mStart=t.slice(0,8)+'01';
  st.tx=st.tx.filter(x=>x&&typeof x==='object').map(x=>{
   const n=Object.assign({},x);n.amt=Math.abs(+n.amt||0);
   n.ts=n.ts||D(n.date||t).getTime()+43200000;
   if(!n.status){
    if(n.rid&&n.date>t){n.status='planned';n.occ=n.date}   /* auto-entered ahead of time: that was a plan, not a payment */
    else n.status='done'}
   if(!n.src)n.src=n.rid?'repeat':'manual';
   if(n.rid&&!n.occ)n.occ=n.date;
   if(n.type==='income'&&n.cat==='Refund'){n.type='variable';n.cat='Other';n.refund=true;n.was='income:Refund'}
   if(n.type==='fixed'&&n.cat==='Savings'){n.type='transfer';n.dir='out';n.was='fixed:Savings'}
   return n});
  const moved=st.tx.filter(x=>x.was).length, planned=st.tx.filter(x=>x.status==='planned').length;
  if(planned)log.push(planned+' auto-entered future bills or paychecks are now planned, not done');
  if(moved)log.push(moved+' refunds and savings entries reclassified so they no longer count as income or spending');
  st.rec=st.rec.map(r=>{const n=Object.assign({},r);
   if(n.kind==='fixed'&&n.cat==='Savings')n.kind='transfer';
   n.freq=n.freq||'monthly';n.day=n.day||1;n.wk=n.wk||'same';
   n.start=n.start||mStart;return n});
  st.goals=st.goals.map(g=>{const n=Object.assign({},g);if(n.start==null)n.start=+n.saved||0;delete n.saved;
   if(/buffer|emergency|rainy/i.test(n.name||''))n.emerg=true;return n});
  st.debts=st.debts.map(x=>{const n=Object.assign({},x);
   if(n.kind==='debt')n.kind=(n.apr>=12?'card':'loan');
   if(n.bal0==null)n.bal0=Math.max((+n.total||0)-(+n.paid||0),0);
   n.ts=n.ts||now;return n});
  if(st.goals.length||st.debts.length)log.push('Goals and debts now track money through the ledger; their current balances were kept as starting points');
  if(st.rec.some(r=>r.kind==='income'))log.push('Check your pay schedule: older versions could not tell every two weeks from twice a month');
  st.v=4}
 if((d.v||0)<5){
  st.debts.forEach(x=>{x.bal0=Math.max(0,(+x.bal0||0)-st.tx.filter(t=>t.debt===x.id&&isDone(t)&&(t.ts||0)>=(x.ts||0)).reduce((a,t)=>a+(+t.amt||0),0));x.ts=now;x.ledgerBaseline=Object.fromEntries(st.tx.map(t=>[t.id,BeFreeFinance.debtEffect(x,t)]));});
  st.tx.forEach(x=>{if(x.src==='route'&&x.debt){x.type='transfer';x.cat='Debt payment';x.debtRole='extra';x.dir='out';}if(x.debt||x.cat==='Card payment')x.needsReview=true;});
  st.bal=null;st.reviewed={};log.push('Revision 5: review card purchases, payment purposes and loan principal; reconcile balances. Older data stays under its original storage key.');
 }
 st.v=5;st.reviewed=st.reviewed||{};
 st.migr=(st.migr||[]).concat(log.length?[{at:t,from:from||d.v||'?',notes:log}]:[]);
 return st}
function loadState(){
 const v4=DB.g(KEY);
 if(v4&&v4.tx)return migrate(v4,4);
 const old4=DB.g('befree.v4');
 if(old4&&old4.tx)return migrate(old4,4);
 const v3=DB.g('befree.v3');
 if(v3&&v3.tx){
  /* keep a byte-for-byte copy of what was there before the upgrade */
  const raw=DB.raw('befree.v3');if(raw&&!DB.raw('befree.v3.pre-v4'))DB.put('befree.v3.pre-v4',raw);
  const st=migrate(v3,3);st.setup.done=true;return st}
 const v2=DB.g('befree.v2');
 if(v2&&v2.tx){const st=migrate({v:2,tx:v2.tx,goals:v2.goals||[],debts:v2.debts||[]},2);st.setup.done=true;return st}
 return blankState()}
let S=loadState();

(async()=>{try{
  if(navigator.storage&&navigator.storage.persist){
    const already=await navigator.storage.persisted();
    if(!already)await navigator.storage.persist();
  }
}catch(e){}})();
const save=()=>{mcReset();DB.s(KEY,S)};

/* ══════════ view state ══════════ */
const V={page:'guide',range:'month',off:0,q:'',type:'all',size:'all',sort:'date',cat:null,
         method:'avalanche',extra:0};
const mk=o=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-o);return d};
const sameMonth=(t,m)=>{const d=D(t.date);
  return d.getFullYear()===m.getFullYear()&&d.getMonth()===m.getMonth()};
function inRange(t){if(V.range==='month')return sameMonth(t,mk(V.off));
 if(V.range==='all')return true;
 const n={30:30,90:90,365:365}[V.range]||30,f=new Date();f.setDate(f.getDate()-n);
 return D(t.date)>=f&&t.date<=today()}
const pTx=()=>S.tx.filter(inRange);
/* entries grouped by month once per render, so charts that look at six or
   twelve months don't rescan years of history for every bar */
let MC=null;
const mcReset=()=>{MC=null};
function mcBuild(){MC={tx:{},tot:{},ref:S.tx,n:S.tx.length};S.tx.forEach(t=>{const k=t.date.slice(0,7);(MC.tx[k]=MC.tx[k]||[]).push(t)})}
const mKey=o=>{const d=mk(o);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const mcOk=()=>MC&&MC.ref===S.tx&&MC.n===S.tx.length;
const monthTx=o=>{if(!mcOk())mcBuild();return MC.tx[mKey(o)]||[]};
const monthTot=o=>{if(!mcOk())mcBuild();const k=mKey(o);return MC.tot[k]||(MC.tot[k]=tot(monthTx(o)))};
/* a month counts as data only if something was actually recorded in it */
const monthHas=o=>monthTx(o).some(isDone); // Recorded history remains visible, including legacy data.
const monthReviewed=o=>monthHas(o)&&!!(S.reviewed&&S.reviewed[mKey(o)]); // Forecast confidence is independent of chart visibility.
let PRINTING=false;
const anim=(fn,ms)=>{if(reduced()||PRINTING){fn(1);return}
 const t0=performance.now();(function s(t){const p=Math.max(0,Math.min(1,(t-t0)/ms));
 fn(1-Math.pow(1-p,3));p<1&&requestAnimationFrame(s)})(t0)};

/* ══════════ schedules ══════════
   Every schedule generates dated occurrences from real anchors:
   weekly and every-two-weeks count forward from an actual payday, twice a
   month and monthly use days of the month, with an optional weekend rule. */
const PER_MONTH={weekly:52/12,biweekly:26/12,semimonthly:2,monthly:1,yearly:1/12};
const PER_YEAR={weekly:52,biweekly:26,semimonthly:24,monthly:12,yearly:1};
const FREQ_L={weekly:'every week',biweekly:'every 2 weeks',semimonthly:'twice a month',monthly:'every month',yearly:'every year'};
function adjWk(ds,wk){
 if(!wk||wk==='same')return ds;
 const w=D(ds).getDay();
 if(w===6)return addD(ds,wk==='before'?-1:2);
 if(w===0)return addD(ds,wk==='before'?-2:1);
 return ds}
function occ(r,from,to,o){
 const out=[];if(!r||r.on===false)return out;
 if(!(o&&o.all)&&r.start&&r.start>from)from=r.start;
 if(r.end&&r.end<to)to=r.end;
 if(from>to)return out;
 if(r.freq==='weekly'||r.freq==='biweekly'){
  const step=r.freq==='weekly'?7:14,a=r.anchor;if(!a)return out;
  let d=addD(a,Math.ceil(diffD(a,from)/step)*step);
  while(d<=to){out.push(d);d=addD(d,step)}
  return out}
 if(r.freq==='yearly'){
  const a=r.anchor;if(!a)return out;
  const m=+a.slice(5,7)-1,dd=+a.slice(8,10);
  for(let y=+from.slice(0,4)-1;y<=+to.slice(0,4)+1;y++){
   const s=adjWk(iso(new Date(y,m,Math.min(dd,dayCount(y,m)))),r.wk);
   if(s>=from&&s<=to)out.push(s)}
  return out.sort()}
 const days=r.freq==='semimonthly'?[+r.day||15,+r.day2||31]:[+r.day||1];
 const i0=(+from.slice(0,4))*12+(+from.slice(5,7)-1)-1,i1=(+to.slice(0,4))*12+(+to.slice(5,7)-1)+1;
 for(let i=i0;i<=i1;i++){const y=Math.floor(i/12),m=i%12;
  days.forEach(dd=>{const s=adjWk(iso(new Date(y,m,Math.min(dd,dayCount(y,m)))),r.wk);
   if(s>=from&&s<=to)out.push(s)})}
 return [...new Set(out)].sort()}
const primary=()=>S.rec.find(r=>r.prim&&r.kind==='income'&&r.on!==false)||null;
function nextPay(r,after){const a=after||today();const l=occ(r,addD(a,1),addD(a,70),{all:true});return l[0]||null}
function lastPay(r,upto){const u=upto||today();const l=occ(r,addD(u,-70),u,{all:true});return l[l.length-1]||null}
function paydays(r,from,to){return r?occ(r,from,to,{all:true}):[]}
const matched=(r,d)=>S.tx.some(t=>t.rid===r.id&&(t.occ||t.date)===d);
/* what a schedule is expected to bring in or cost. For income that changes,
   the forecast is the lowest amount actually received recently, never the average. */
function recEst(r){
 if(r.kind!=='income'||!r.vary)return{amt:+r.amt||0,est:false};
 const got=S.tx.filter(t=>t.rid===r.id&&isDone(t)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6).map(t=>t.amt);
 const cands=[...got];if(r.low>0)cands.push(+r.low);
 if(!cands.length)return{amt:+r.amt||0,est:true,basis:'your typical amount'};
 return{amt:Math.min(...cands),est:true,basis:got.length?`lowest of your last ${got.length}`:'the lowest you said to plan around'}}
function flowOf(type,dir){return type==='income'?1:type==='transfer'?(dir==='in'?1:-1):-1}
/* planned = scheduled occurrences nobody has confirmed + planned entries */
function planned(from,to){
 const out=[];
 S.rec.forEach(r=>occ(r,from,to).forEach(d=>{if(matched(r,d))return;
  const e=recEst(r);
  out.push({key:'r:'+r.id+':'+d,date:d,type:r.kind,cat:r.cat,amt:e.amt,est:e.est,basis:e.basis,name:r.note||r.cat,
   rid:r.id,occ:d,goal:r.goal,fund:r.fund,debt:r.debt,dir:r.kind==='transfer'?'out':undefined,
   flow:flowOf(r.kind,'out'),prim:!!r.prim})}));
 S.tx.forEach(t=>{if(isPlan(t)&&t.date>=from&&t.date<=to)out.push({key:'t:'+t.id,date:t.date,type:t.type,cat:t.cat,amt:t.amt,
   name:t.note||t.cat,tx:t.id,goal:t.goal,fund:t.fund,debt:t.debt,dir:t.dir,refund:t.refund,debtRole:t.debtRole,flow:t.refund?1:flowOf(t.type,t.dir)})});
 return out.sort((a,b)=>a.date.localeCompare(b.date)||a.flow-b.flow)}

/* ══════════ balances of goals, funds and debts ══════════ */
function goalBal(g){let s=+g.start||0,p=0;
 S.tx.forEach(t=>{if(t.goal!==g.id||t.type!=='transfer')return;const sg=t.dir==='in'?-1:1;
  if(isDone(t))s+=sg*t.amt;else if(isPlan(t))p+=sg*t.amt});
 return{saved:s,plan:p}}
function fundBal(f){let s=+f.start||0,p=0;
 S.tx.forEach(t=>{if(t.fund!==f.id)return;
  if(t.type==='transfer'){const sg=t.dir==='in'?-1:1;if(isDone(t))s+=sg*t.amt;else if(isPlan(t))p+=sg*t.amt}
  else if(isSpend(t)&&isDone(t))s-=spendAmt(t)});
 return{saved:s,plan:p}}
function debtBal(d){return BeFreeFinance.debtBalance(d,S.tx)}
const liveDebts=()=>S.debts.filter(d=>d.kind!=='due'&&debtBal(d)>0.005);

/* ══════════ estimates the cycle needs ══════════ */
function firstDone(){let f=null;S.tx.forEach(t=>{if(isDone(t)&&t.src!=='demo-x'&&(!f||t.date<f))f=t.date});return f}
function essDaily(){
 let hist=null;const t=today(),f=firstDone();
 if(f){const win=Math.min(60,diffD(f,t));
  if(win>=21&&Object.keys(S.checks||{}).filter(d=>d>=addD(t,-win)&&d<=t&&['complete','nospend'].includes(S.checks[d].t)).length>=win){const from=addD(t,-win);
   const s=sum(S.tx.filter(x=>isDone(x)&&x.type==='variable'&&isEss(x.cat,'variable')&&!x.fund&&x.date>from&&x.date<=t),spendAmt);
   if(s>0)hist={v:s/win,src:'history',win}}}
 const man=(S.cyc.ess!=null&&S.cyc.ess!=='')?{v:(+S.cyc.ess)/7,src:'manual'}:null;
 if(hist&&man)return man.v>=hist.v?Object.assign(man,{also:hist}):Object.assign(hist,{also:man});
 return hist||man}
function essMonthly(){
 const sched=sum(S.rec.filter(r=>r.on!==false&&r.kind==='fixed'&&isEss(r.cat,'fixed')),r=>(+r.amt||0)*(PER_MONTH[r.freq]||1));
 let lastFixed=0;for(let o=1;o<=3;o++){if(monthHas(o)){lastFixed=sum(monthTx(o).filter(t=>isDone(t)&&t.type==='fixed'&&isEss(t.cat,'fixed')),spendAmt);break}}
 const fixed=Math.max(sched,lastFixed),ed=essDaily();
 if(!fixed&&!ed)return null;
 return{fixed,vari:ed?ed.v*30.44:0,total:fixed+(ed?ed.v*30.44:0),partial:!ed||!fixed}}
/* per-paycheck set-aside for each sinking fund, less what already went in this cycle */
function fundPlan(f,pay){
 const b=fundBal(f).saved,left=Math.max((+f.target||0)-b,0),t=today();
 if(!left)return{left:0,per:0,perMonth:0,n:0,due:f.due,ready:true};
 const due=f.due||addD(t,365);
 const months=Math.max(diffD(t,due)/30.44,0);
 let n=pay?paydays(pay,addD(t,1),due).length:0;
 const late=due<t;
 const per=late?left:(n?left/n:(months>=1?left/months:left));
 const perMonth=late?left:(months>=1?left/months:left);
 const since=pay?lastPay(pay,t):null;
 const doneThis=since?sum(S.tx.filter(x=>x.fund===f.id&&x.type==='transfer'&&isDone(x)&&x.date>=since&&x.dir!=='in'),x=>x.amt):0;
 return{left,per,perMonth,n,due,late,thisCycle:Math.max(per-doneThis,0),ready:false}}

/* ══════════ available until next payday ══════════
   balance now − unpaid obligations before payday − essential spending until
   payday − protective buffer. Income that has not arrived is never counted.
   If a required input is missing, the card asks for it instead of guessing. */
function cycle(){
 const need=[],pay=primary(),t=today();
 if(!pay)need.push('pay');
 if(!S.bal||typeof S.bal.amt!=='number')need.push('bal');
 const ed=essDaily();if(!ed)need.push('ess');
 if(S.cyc.buf==null||S.cyc.buf==='')need.push('buf');
 if(!S.cyc.confirmed||S.cyc.confirmed!==t)need.push('review');
 if(S.cyc.cardReserve==null)need.push('card');
 if(S.bal&&diffD(S.bal.asOf,t)>1&&!need.includes('bal'))need.push('bal');
 if(need.length)return{need,pay,ed};
 const next=nextPay(pay,t);if(!next)return{need:['pay'],pay,ed};
 const days=Math.max(diffD(t,next),1);
 const since=addD(S.bal.asOf,-60);
 const loggedL=S.tx.filter(x=>isDone(x)&&(x.ts||0)>(S.bal.ts||0));
 const logged=sum(loggedL,cashEff);
 const balNow=S.bal.amt+logged;
 const win=planned(since,addD(next,-1));
 const items=win.filter(p=>p.flow<0);
 const obl=sum(items,p=>p.amt);
 const fl=S.cyc.funds?S.funds.map(f=>{const p=fundPlan(f,pay);p.thisCycle=Math.max(0,p.thisCycle-sum(items.filter(x=>x.fund===f.id),x=>x.amt));return{f,p}}).filter(x=>x.p.thisCycle>0.5):[];
 const funds=sum(fl,x=>x.p.thisCycle);
 const ess=ed.v*days;
 const buf=+S.cyc.buf||0;
 const card=Math.max(0,(+S.cyc.cardReserve||0)+sum(loggedL,t=>t.payFrom==='card'?spendAmt(t):t.debtRole==='settlement'?-t.amt:0));
 const tax=S.tax.on&&taxEst(S.tx.filter(x=>x.date.slice(0,7)===today().slice(0,7))),taxHold=tax?Math.max(0,tax.need-tax.held):0;
 const cardHold=Math.max(0,card-sum(items.filter(x=>x.debtRole==='settlement'),x=>x.amt));
 const avail=balNow-obl-funds-ess-buf-cardHold-taxHold;
 const incoming=planned(t,addD(next,-1)).filter(p=>p.flow>0);
 const payToday=occ(pay,t,t,{all:true}).length&&!matched(pay,t);
 return{need:[],pay,next,days,balNow,logged,loggedN:loggedL.length,obl,items,fl,funds,ess,ed,buf,avail,perDay:avail/days,
  incoming,card:cardHold,taxHold,stale:diffD(S.bal.asOf,t),since:S.bal.asOf,payToday}}

/* ══════════ nav ══════════ */
/* four tabs; Money and Insights hold sub-pages chosen with a segmented control */
const PAGES=[['guide','Today','M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2'],['plan','Plan','M4 6h16v14H4zM4 10h16M8 3v4M16 3v4'],
 ['ledger','Money','M3 6.5h18v11.5H3zM12 14.8a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z'],['overview','Insights','M5 19v-7M10 19V6M15 19v-8M20 19V9']];
const TAB_OF={guide:'guide',plan:'plan',ledger:'ledger',goals:'ledger',debts:'ledger',overview:'overview'};
$('#nav').innerHTML=PAGES.map(([k,l,d])=>`<button type="button" id="tab-${k}" data-p="${k}" role="tab" aria-controls="p-${k}" aria-selected="${k==='guide'}" tabindex="${k==='guide'?0:-1}"><svg class="nvi" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg><span>${l}</span></button>`).join('');
function go(p,keep){V.page=p;if(TAB_OF[p]==='ledger')V.money=p;document.body.dataset.page=p;
 $$('#nav button').forEach(x=>{const on=x.dataset.p===TAB_OF[p];x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;if(on)x.setAttribute('aria-controls','p-'+p)});
 $$('.page').forEach(x=>x.classList.toggle('on',x.id==='p-'+p));
 if(!keep)window.scrollTo({top:0,behavior:reduced()?'auto':'smooth'});render()}
$('#nav').onclick=e=>{const b=e.target.closest('button');if(b)go(b.dataset.p==='ledger'?(V.money||'ledger'):b.dataset.p)};
$('#nav').addEventListener('keydown',e=>{
 const k=e.key,i=PAGES.findIndex(p=>p[0]===TAB_OF[V.page]);let n=null;
 if(k==='ArrowRight')n=(i+1)%PAGES.length;else if(k==='ArrowLeft')n=(i-1+PAGES.length)%PAGES.length;
 else if(k==='Home')n=0;else if(k==='End')n=PAGES.length-1;
 if(n===null)return;e.preventDefault();go(PAGES[n][0],true);$('#tab-'+PAGES[n][0]).focus()});

/* ══════════ chart type ══════════
   Charts are drawn in a fixed viewBox and stretched to their card, so small
   labels are pinned back to real pixels. Display numbers keep scaling. */
const DISPLAY_AT=16;
function fitType(el){
 if(!el)return;
 const vb=el.viewBox&&el.viewBox.baseVal&&el.viewBox.baseVal.width;if(!vb)return;
 const px=el.getBoundingClientRect().width;if(!px)return;
 const k=px/vb;if(!(k>0)||Math.abs(k-1)<0.02)return;
 el.querySelectorAll('text').forEach(t=>{
  const fs=parseFloat(t.getAttribute('data-fs')||t.getAttribute('font-size'));
  if(!(fs>0)||fs>=DISPLAY_AT)return;
  t.setAttribute('data-fs',fs);
  t.setAttribute('font-size',(fs/k).toFixed(2));
  const ls=parseFloat(t.getAttribute('letter-spacing'));
  if(ls>0)t.setAttribute('letter-spacing',(ls/k).toFixed(2));
 });
 const damp=Math.sqrt(k);
 el.querySelectorAll('[stroke-width]').forEach(n=>{
  const w=parseFloat(n.getAttribute('data-sw')||n.getAttribute('stroke-width'));
  if(w>0&&w<8){n.setAttribute('data-sw',w);n.setAttribute('stroke-width',(w/damp).toFixed(2))}
 });
}
const CHARTS=['#gapSvg','#runSvg','#paceSvg','#trend','#essSvg','#split','#incSvg','#dowSvg','#payoff','#orderSvg','#gHist'];
const fitAllType=()=>CHARTS.forEach(sel=>fitType($(sel)));
/* one delegated readout for every chart: mouse, pen, touch and keyboard */
(function(){
 const el=document.createElement('div');el.className='tip';el.setAttribute('role','status');
 document.body.appendChild(el);let t;
 const hide=()=>{el.classList.remove('on');clearTimeout(t)};
 const show=(n)=>{
  const v=n.getAttribute('data-tip');if(!v)return;
  const r=n.getBoundingClientRect();
  const [a,...rest]=v.split('|');
  el.innerHTML=`<b>${esc(a)}</b>${rest.length?`<span>${rest.map(esc).join(' · ')}</span>`:''}`;
  el.style.left=Math.round(r.left+r.width/2)+'px';el.style.top=Math.round(r.top)+'px';
  el.classList.add('on');clearTimeout(t);t=setTimeout(hide,2600);
 };
 addEventListener('pointerover',e=>{const n=e.target.closest&&e.target.closest('[data-tip]');if(n)show(n)},{passive:true});
 addEventListener('pointerdown',e=>{const n=e.target.closest&&e.target.closest('[data-tip]');if(!n){hide();return}show(n)},{passive:true});
 addEventListener('pointerout',e=>{if(e.target.closest&&e.target.closest('[data-tip]'))hide()},{passive:true});
 addEventListener('focusin',e=>{const n=e.target.closest&&e.target.closest('[data-tip]');if(n)show(n);else hide()});
 addEventListener('scroll',hide,{passive:true});
 /* keyboard: a chart takes focus once, then arrow keys step through its values */
 addEventListener('keydown',e=>{const c=e.target.closest&&e.target.closest('[data-kbd]');if(!c||e.target!==c)return;
  if(e.key==='Escape'){hide();return}
  const pts=[...c.querySelectorAll('[data-tip]')].filter(n=>n.getBoundingClientRect().width>0);if(!pts.length)return;
  let i=+(c.dataset.ti||-1);
  if(e.key==='ArrowRight'||e.key==='ArrowDown')i=Math.min(pts.length-1,i+1);
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp')i=Math.max(0,i-1);
  else if(e.key==='Home')i=0;else if(e.key==='End')i=pts.length-1;else return;
  e.preventDefault();c.dataset.ti=i;pts.forEach(n=>n.classList.toggle('kf',n===pts[i]));show(pts[i])});
 addEventListener('focusout',e=>{const c=e.target.closest&&e.target.closest('[data-kbd]');if(c){c.dataset.ti=-1;c.querySelectorAll('.kf').forEach(n=>n.classList.remove('kf'))}});
})();
/* every chart with values becomes one tab stop that can be read with the arrow keys */
function kbdCharts(root){(root||document).querySelectorAll('svg[role=img],#hm').forEach(c=>{
 const has=!!c.querySelector('[data-tip]');
 if(has){c.setAttribute('tabindex','0');c.setAttribute('data-kbd','');
  if(c.id==='hm'){c.setAttribute('role','img');c.setAttribute('aria-label','Spending by day this month')}
  const l=c.getAttribute('aria-label')||'';if(l&&!/arrow keys/.test(l))c.setAttribute('aria-label',l+'. Use the arrow keys to read each value.')}
 else{c.removeAttribute('tabindex');c.removeAttribute('data-kbd')}})}
const PAT=`<defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
 <rect width="5" height="5" fill="none"/><line x1="0" y1="0" x2="0" y2="5" stroke="var(--c-plan)" stroke-width="2.2"/></pattern>
 <pattern id="hatchO" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
 <rect width="5" height="5" fill="none"/><line x1="0" y1="0" x2="0" y2="5" stroke="var(--c-over)" stroke-width="2.4"/></pattern></defs>`;
/* short numbers for chart labels: 1.2k, 940 */
const kfmt=v=>{const a=Math.abs(v),s=v<0?'−':'';return s+(a>=1000?(a/1000).toFixed(a>=10000?0:1)+'k':Math.round(a))};
const lgd=(c,l,cls)=>`<span><i${cls?` class="${cls}"`:''} style="background:${c}"></i>${l}</span>`;
const monthEnd=()=>{const n=new Date();return iso(new Date(n.getFullYear(),n.getMonth()+1,0))};
const monthStart=()=>today().slice(0,8)+'01';
const rangeLabel=()=>V.range==='month'?(V.off===0?'this month':mk(V.off).toLocaleString('en-US',{month:'long'})):
 ({30:'last 30 days',90:'last 90 days',365:'last 12 months',all:'all time'}[V.range]);

/* ══════════ 1 · where you stand ══════════ */
function drawPos(){
 const T=tot(pTx());
 const gs=S.goals.map(g=>goalBal(g).saved),fs=S.funds.map(f=>fundBal(f).saved);
 const saved=sum(gs)+sum(fs),owed=sum(liveDebts(),debtBal);
 let bal;
 if(S.bal&&typeof S.bal.amt==='number'){
  const since=S.tx.filter(x=>isDone(x)&&(x.ts||0)>(S.bal.ts||0));
  const now=S.bal.amt+sum(since,cashEff),age=diffD(S.bal.asOf,today());
  bal=`<div class="v mono${now<0?' neg':''}">${money(now)}</div><div class="s">${age<=0?'entered today':`entered ${fmtD(S.bal.asOf)}`}${since.length?`, ${plural(since.length,'entry','entries')} since`:''}</div>
   <button class="tlink" data-open="cyc">Update</button>`}
 else bal=`<div class="v mono" style="color:var(--tx3)">—</div><div class="s">Not entered yet</div><button class="tlink" data-open="cyc">Add your balance</button>`;
 $('#pos').innerHTML=`
  <div class="pst"><div class="k">Checking, est.<button class="info" data-info="balance" aria-label="How the balance estimate works">${INFO_I}</button></div>${bal}</div>
  <div class="pst"><div class="k">Moved to savings<button class="info" data-info="savings" aria-label="What counts as savings">${INFO_I}</button></div>
   <div class="v mono${T.sav<0?' neg':''}">${money(T.sav)}</div><div class="s">${rangeLabel()}, net of withdrawals</div></div>
  <div class="pst"><div class="k">Saved in goals and funds</div>
   <div class="v mono">${money(saved)}</div><div class="s">${S.goals.length+S.funds.length?plural(S.goals.length+S.funds.length,'goal or fund','goals and funds'):'none set up yet'}</div></div>
  <div class="pst"><div class="k">Debt owed</div>
   <div class="v mono">${money(owed)}</div><div class="s">${liveDebts().length?`across ${plural(liveDebts().length,'debt')}`:'no debts listed'}</div></div>`;
}
let LAST_GAP=null;
function drawGap(){
 /* Two bars on one scale, and nothing drawn that isn't money. When more came in
    than went out, the out bar carries the difference as "Surplus"; when more
    went out, the in bar carries it as "Short". Scheduled amounts are ghosts. */
 const T=tot(pTx()),svg=$('#gapSvg'),px=svg.getBoundingClientRect().width||340;
 const VBW=px>520?Math.round(Math.max(340,px*128/190)):340;svg.setAttribute('viewBox',`0 0 ${VBW} 128`);
 const L=8,R=VBW-8,MW=R-L;
 let pi=0,po=0,pin=0;
 if(V.range==='month'&&V.off===0){
  const pl=planned(monthStart(),monthEnd());
  pin=pl.filter(p=>p.type==='income').length;pi=sum(pl.filter(p=>p.type==='income'),p=>p.amt);
  po=Math.max(sum(pl.filter(p=>p.type==='fixed'||p.type==='variable'),p=>p.refund?-p.amt:p.amt),0)}
 const I=Math.max(T.i,0),F=Math.max(T.f,0),Vv=Math.max(T.v,0),O=F+Vv;
 const peak=Math.max(I+pi,O+po,I,O,1),w=v=>MW*(Math.max(v,0)/peak);
 const yI=24,yO=82,h=24,sur=I-O;
 const segs=[];const seg=(id,x,wd,y,fill,tip,extra)=>{if(wd<=0.2)return '';segs.push({id,x,w:wd});
  return `<rect id="${id}" x="${L}" y="${y}" width="0" height="${h}" rx="4" fill="${fill}" ${extra||''} data-tip="${tip}"/>`};
 let o=PAT;
 const head=(y,l,v,c)=>`<text x="${L}" y="${y}" font-size="11.5" font-weight="600" letter-spacing="1.4" fill="var(--tx2)" font-family="Poppins">${l}</text>
  <text x="${R}" y="${y}" text-anchor="end" font-size="13" font-weight="600" fill="${c}" font-family="'IBM Plex Mono',monospace">${money(v)}</text>`;
 o+=head(yI-8,'MONEY IN',I,'var(--tx)');
 o+=seg('gI',L,w(I),yI,'var(--c-in)',`${money(I)} received|Money in`);
 if(pi>0)o+=seg('gIp',L+w(I),w(pi),yI,'url(#hatch)',`${money(pi)} still scheduled|Money in`,'stroke="var(--c-plan)" stroke-width="1" stroke-dasharray="3 2"');
 if(sur<0)o+=seg('gSh',L+w(I),w(-sur),yI,'url(#hatchO)',`${money(-sur)} more out than in|Short`,'stroke="var(--c-over)" stroke-width="1.2"');
 o+=head(yO-8,'MONEY OUT',O,'var(--tx)');
 o+=seg('gF',L,w(F),yO,'var(--c-fix)',`${money(F)} fixed|Money out`);
 o+=seg('gV',L+w(F),w(Vv),yO,'var(--c-var)',`${money(Vv)} variable|Money out`);
 if(sur>0)o+=seg('gK',L+w(O),w(sur),yO,'var(--c-keep)',`${money(sur)} kept|Surplus`);
 if(po>0)o+=seg('gOp',L+w(O),w(po),yO+h/2-4,'url(#hatch)',`${money(po)} still scheduled|Bills and planned spending`,'stroke="var(--c-plan)" stroke-width="1" stroke-dasharray="3 2" style="height:8px"');
 /* the line where income ends, carried down to the out bar */
 if(I>0)o+=`<path id="gEdge" d="M${(L+w(I)).toFixed(1)} ${yI+h+2}V${yO-2}" stroke="var(--tx3)" stroke-width="1" stroke-dasharray="2 3" opacity="0"/>`;
 const inLbl=(x,wd,y,t,c)=>wd>64?`<text class="glbl" x="${(x+wd/2).toFixed(1)}" y="${y+h/2+4.5}" text-anchor="middle" font-size="12" font-weight="600" fill="${c}" font-family="Poppins" opacity="0">${t}</text>`:'';
 if(sur>0)o+=inLbl(L+w(O),w(sur),yO,'Surplus','var(--btnT)');
 if(sur<0)o+=inLbl(L+w(I),w(-sur),yI,'Short','var(--tx)');
 if(!I&&!O)o+=`<text x="${L}" y="${yI+h/2+4}" font-size="12.5" fill="var(--tx3)" font-family="Poppins">Nothing completed in this period yet</text>`;
 svg.innerHTML=o;
 /* the planned out ghost is thinner, so fix its height (rect ignores CSS height in some engines) */
 const gop=$('#gOp');if(gop)gop.setAttribute('height',8);
 anim(v=>{segs.forEach(sg=>{const e=document.getElementById(sg.id);if(!e)return;
   e.setAttribute('x',(L+(sg.x-L)*v).toFixed(1));e.setAttribute('width',Math.max(0,sg.w*v).toFixed(1))});
  const op=Math.max(0,(v-.6)/.4);const ge=$('#gEdge');if(ge)ge.setAttribute('opacity',(op*.8).toFixed(2));
  $$('#gapSvg .glbl').forEach(t=>t.setAttribute('opacity',op))},780);
 $('#gapLeg').innerHTML=lgd('var(--c-in)','Money in')+lgd('var(--c-fix)','Fixed')+lgd('var(--c-var)','Variable')
  +(sur>0?lgd('var(--c-keep)','Surplus'):'')+(sur<0?lgd('var(--c-over)','Short','over'):'')+(pi||po?lgd('var(--c-plan)','Scheduled','plan'):'');
 const prev=(typeof LAST_GAP==='number')?LAST_GAP:0;
 anim(v=>$('#gAmt').textContent=money(prev+(T.gap-prev)*v),650);
 if(prev!==T.gap&&prev!==0){const g=$('#gAmt');g.classList.remove('bump');void g.offsetWidth;g.classList.add('bump')}
 LAST_GAP=T.gap;
 $('#gLive').textContent=T.i||T.out?`Surplus ${money(T.gap)}`:'';
 $('#gAmt').classList.toggle('neg',T.gap<0);
 const has=T.i||T.out;
 let cap=has?(T.gap>=0?`kept from ${money(T.i)} received, ${rangeLabel()}`:`more went out than came in, ${rangeLabel()}`)
  :`nothing completed ${rangeLabel()} yet`;
 if(pin&&new Date().getDate()<=10)cap+=`<br>Early in the month: ${pin>1?pin+' paychecks are':'one paycheck is'} still on its way.`;
 if(pi||po)cap+=`<br>Still scheduled: <b class="mono">+${money(pi)}</b> in, <b class="mono">${money(-po)}</b> out. This schedule is not a complete month-end forecast; unrecorded variable costs and other obligations may remain.`;
 $('#gCap').innerHTML=cap;
 const el=$('#dl');
 if(V.range!=='month'||!monthHas(V.off+1)||!has){el.textContent=V.range==='month'&&!monthHas(V.off+1)?'no data last month':'';el.className='dl';el.style.display=el.textContent?'':'none'}
 else{const pr=monthTot(V.off+1),d=T.gap-pr.gap,u=d>=0;el.style.display='';
  el.textContent=`${u?'▲':'▼'} ${money(Math.abs(d))} vs ${mk(V.off+1).toLocaleString('en-US',{month:'short'})}${V.off===0?' (month so far)':''}`;el.className='dl '+(u?'up':'dn')}
}

/* ══════════ 2 · available until payday ══════════ */
function drawCycle(){
 const C=cycle(),box=$('#cyc');
 if(C.need.length){
  const L={review:['Review this pay cycle','Confirm bills, pending charges and card reserves today','cyc'],card:['Card purchases not yet paid','Cash needed to settle purchases already recorded, excluding old debt minimums','cyc'],pay:['Your pay schedule','One real payday and how often you\'re paid','pay'],
   bal:['Today\'s checking balance','What your account shows right now','cyc'],
   ess:['Essential spending per week','Groceries, gas, medicine. Or log about three weeks of spending and Gap works it out','cyc'],
   buf:['A protective buffer','Money you keep untouched so a surprise doesn\'t overdraw you','cyc']};
  $('#cycTag').textContent='needs '+C.need.length+' more';
  box.innerHTML=`<p class="ccap" style="margin:0 0 12px">Gap won't show an amount until it has these, because a guess here could lead to overspending.</p>
   <div class="miss">${C.need.map(k=>`<div class="mi2"><div><b style="font-weight:600">${L[k][0]}</b><br><span style="font-size:13.5px">${L[k][1]}</span></div>
    <button class="btn2" data-open="${L[k][2]}">Add</button></div>`).join('')}</div>`;
  bindOpen(box);return}
 const neg=C.avail<0;
 $('#cycTag').textContent=`payday ${fmtD(C.next,{weekday:'short',month:'short',day:'numeric'})}`;
 const ln=(l,v,s,cls)=>`<div class="br ${cls||''}"><span>${l}${s?`<small>${s}</small>`:''}</span><span class="mono">${v}</span></div>`;
 const edTxt=C.ed.src==='history'?`${money2(C.ed.v)} a day, your average over ${C.ed.win} days`:`${money2(C.ed.v)} a day, from your weekly estimate`;
 box.innerHTML=`<div class="cyc"><div>
   <div class="cbig fr mono${neg?' neg':''}">${money(C.avail)}</div>
   <p class="ccap">${neg?`Short by <b class="mono">${money(-C.avail)}</b> before payday on <b>${fmtD(C.next,{weekday:'long',month:'short',day:'numeric'})}</b>. The next best step below shows how to handle it.`
    :`estimated room over the next <b>${plural(C.days,'day')}</b>, until payday on <b>${fmtD(C.next,{weekday:'long',month:'short',day:'numeric'})}</b>. That's about <b class="mono">${money(C.perDay)}</b> a day beyond your essentials.`}</p>
   ${C.stale>=3?`<p class="ccap" style="color:var(--warn)">Your balance was entered ${plural(C.stale,'day')} ago. Updating it makes this more accurate.</p>`:''}
   ${C.payToday?`<p class="ccap">Today is payday. Once it arrives, mark it received and update your balance.</p>`:''}
   <div class="runw"><div class="rwh"><span class="eb">Balance, day by day</span><span class="eb mono" id="runTag"></span></div>
    <svg id="runSvg" viewBox="0 0 340 132" role="img" aria-label="Projected checking balance each day until payday"></svg>
    <div class="herolg" id="runLeg"></div></div>
   <div class="chk-row" style="margin-top:12px"><button class="btn2" data-open="cyc">Update balance</button><button class="btn2" data-info="available">How this works</button></div>
  </div>
  <div class="brk">
   ${ln('Checking balance, est.',money(C.balNow),C.loggedN?`${money(S.bal.amt)} entered ${fmtD(S.bal.asOf)}, ${C.logged>=0?'+':'−'}${money(Math.abs(C.logged)).replace('−','')} logged since`:`entered ${fmtD(S.bal.asOf)}`)}
   ${ln('Bills and planned transfers',money(-C.obl),C.items.length?`${plural(C.items.length,'item')} due before payday, not yet confirmed`:'nothing scheduled before payday')}
   ${C.fl.length?ln('Sinking-fund set-asides',money(-C.funds),C.fl.map(x=>esc(x.f.name)).join(', ')):''}
   ${ln('Essential spending',money(-C.ess),`${plural(C.days,'day')} × ${edTxt}`)}
   ${ln('Protective buffer',money(-C.buf),'kept untouched')}${ln('Card purchases not yet paid',money(-C.card),'already recorded, still waiting to be settled')}${ln('Tax reserve shortfall',money(-C.taxHold),'estimated, not a tax bill')}
   ${ln('Available until payday',money(C.avail),'',neg?'tot over':'tot')}
   ${C.incoming.length?`<p class="foot" style="margin-top:8px">Not counted: ${money(sum(C.incoming,p=>p.amt))} of other income expected before payday. It counts once it arrives.</p>`:''}
  </div></div>`;
 drawRunway(C);
 bindOpen(box);
}
/* the runway: today's balance, less essentials each day and each bill on its
   date, ending at the buffer plus what is available */
function drawRunway(C){
 const svg=$('#runSvg');if(!svg)return;
 const t=today(),N=C.days,pts=[],bills={};
 C.items.forEach(p=>{const d=p.date<t?t:p.date;(bills[d]=bills[d]||[]).push(p)});
 let b=C.balNow-C.funds;
 for(let i=0;i<=N;i++){const d=addD(t,i);
  const bl=bills[d]||[];
  if(i>0)b-=C.ed.v;
  b-=sum(bl,p=>p.amt);
  pts.push({d,b,bl})}
 const vals=pts.map(p=>p.b).concat([C.buf,C.balNow,0]);
 const hi=Math.max(...vals),lo=Math.min(...vals);
 const L=8,R=332,T0=14,B=104;
 const x=i=>L+(R-L)*(i/Math.max(N,1)),y=v=>B-(B-T0)*((v-lo)/((hi-lo)||1));
 const line=pts.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(1)} ${y(p.b).toFixed(1)}`).join('');
 const low=pts.reduce((m,p)=>p.b<m.b?p:m,pts[0]),under=low.b<C.buf;
 let o=`<defs><linearGradient id="rwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--c-in)" stop-opacity=".34"/><stop offset="1" stop-color="var(--c-in)" stop-opacity="0"/></linearGradient></defs>`;
 if(lo<0)o+=`<path d="M${L} ${y(0).toFixed(1)}H${R}" stroke="var(--tx3)" stroke-width="1"/><text x="${R}" y="${(y(0)-4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--tx3)" font-family="Poppins">$0</text>`;
 o+=`<path d="${line}L${x(N).toFixed(1)} ${B}L${L} ${B}Z" fill="url(#rwg)"/>`;
 o+=`<path d="M${L} ${y(C.buf).toFixed(1)}H${R}" stroke="var(--c-fix)" stroke-width="1.3" stroke-dasharray="4 4"/>
  <text x="${L+2}" y="${(y(C.buf)-5).toFixed(1)}" font-size="11" font-weight="600" fill="var(--acc-text)" font-family="Poppins">buffer ${money(C.buf)}</text>`;
 o+=`<path id="rwl" d="${line}" fill="none" stroke="${under?'var(--c-over)':'var(--c-in)'}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="1200" stroke-dashoffset="1200"/>`;
 pts.forEach((p,i)=>{if(p.bl.length)o+=`<circle cx="${x(i).toFixed(1)}" cy="${y(p.b).toFixed(1)}" r="4.2" fill="var(--c-fix)" stroke="var(--card)" stroke-width="1.5" data-tip="−${money(sum(p.bl,q=>q.amt)).replace('−','')} · ${esc(p.bl.map(q=>q.name).join(', '))}|${fmtD(p.d,{weekday:'short',month:'short',day:'numeric'})}"/>`});
 /* one invisible column per day, so every day can be read */
 const cw=(R-L)/Math.max(N,1);
 pts.forEach((p,i)=>o+=`<rect x="${(x(i)-cw/2).toFixed(1)}" y="${T0}" width="${cw.toFixed(1)}" height="${B-T0}" fill="transparent" data-tip="${money(p.b)} projected|${fmtD(p.d,{weekday:'short',month:'short',day:'numeric'})}"/>`);
 o+=`<circle cx="${x(N).toFixed(1)}" cy="${y(pts[N].b).toFixed(1)}" r="4.6" fill="var(--acc)"/>`;
 o+=`<text x="${L}" y="${B+17}" font-size="11.5" fill="var(--tx2)" font-family="Poppins">Today</text>
  <text x="${R}" y="${B+17}" text-anchor="end" font-size="11.5" fill="var(--tx2)" font-family="Poppins">Payday ${fmtD(C.next,{month:'short',day:'numeric'})}</text>`;
 svg.innerHTML=o;
 anim(v=>{const e=$('#rwl');e&&e.setAttribute('stroke-dashoffset',1200*(1-v))},900);
 $('#runTag').textContent=`lowest ${money(low.b)}`;
 $('#runLeg').innerHTML=lgd(under?'var(--c-over)':'var(--c-in)','Projected balance')+lgd('var(--c-fix)','Bill due')
  +`<span><i style="background:none;border-top:2px dashed var(--c-fix);height:0;border-radius:0"></i>Buffer</span>`;
}
function bindOpen(root){
 (root||document).querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{
  const k=b.dataset.open;
  if(k==='pay')openPay();else if(k==='cyc')openCyc();else if(k==='cats')openCats()});
 (root||document).querySelectorAll('[data-info]').forEach(b=>b.onclick=()=>openInfo(b.dataset.info));
}

/* ══════════ 3 · recommendations, from real numbers only ══════════
   Each has urgency (3 = act before payday), impact ($ a year) and
   feasibility (3 = easy). Sorted by urgency, then impact × feasibility. */
function surplusAvg(){const has=[1,2,3].filter(monthReviewed),v=has.map(o=>monthTot(o).gap);
 return{avg:v.length?sum(v)/v.length:null,n:v.length,miss:3-v.length,vals:v}}
function discWeekly(){const f=firstDone();if(!f)return 0;const win=Math.min(56,Math.max(diffD(f,today()),1));
 return sum(S.tx.filter(x=>isDone(x)&&isSpend(x)&&x.type==='variable'&&!isEss(x.cat,'variable')&&x.date>addD(today(),-win)),spendAmt)/win*7}
function taxEst(list){
 const inc=sum(list.filter(t=>isDone(t)&&t.type==='income'&&S.tax.cats.includes(t.cat)),t=>t.amt);
 const biz=S.tax.biz?sum(list.filter(t=>isDone(t)&&isSpend(t)&&t.cat==='Business expense'),spendAmt):0;
 const base=Math.max(inc-biz,0),need=base*(+S.tax.rate||0)/100;
 const held=sum(list.filter(t=>isDone(t)&&t.type==='transfer'&&t.cat==='Tax reserve'),t=>t.dir==='in'?-t.amt:t.amt)+sum(list.filter(t=>isDone(t)&&isSpend(t)&&t.cat==='Estimated income tax'),spendAmt);
 return{inc,biz,base,need,held}}
function unconfirmed(){return planned(addD(today(),-45),addD(today(),-1))}
function moves(){
 const out=[],add=o=>out.push(o),t=today();
 const cur=monthTx(0),T=tot(cur),hasData=S.tx.some(isDone);
 if(!hasData&&!S.rec.length)return out;
 const C=cycle();
 const cs=(o,c)=>sum(monthTx(o).filter(x=>isDone(x)&&isSpend(x)&&x.cat===c),spendAmt);
 const full=[1,2,3].filter(monthReviewed);
 const avgC=c=>full.length?sum(full.map(o=>cs(o,c)))/full.length:0;
 const now=new Date(),dLeft=dayCount(now.getFullYear(),now.getMonth())-now.getDate();
 const dw=discWeekly();
 /* shortfall before payday */
 if(!C.need.length&&C.avail<0){
  const gap=-C.avail;
  add({u:3,imp:gap*12,feas:2,tag:'Before payday',icon:'alert',head:`This pay cycle is ${money(gap)} short`,
   math:`<ol>
    <li>Cover essentials and minimum payments first: <b>${money(C.obl)}</b> is due before ${fmtD(C.next)}.</li>
    ${dw>5?`<li>Pause optional spending until payday. It has averaged <b>${money(dw)}</b> a week lately.</li>`:''}
    ${C.funds>0?`<li>Hold this cycle's sinking-fund set-asides (<b>${money(C.funds)}</b>). They can resume next paycheck.</li>`:''}
    <li>If a bill still won't fit, call the company before its due date and ask for a later date or a hardship plan.</li></ol>`,
   ctas:[{l:'See what\'s due',a:'up'},{l:'Income options',a:'income'}],habit:{tpl:'bills-weekly'},
   todo:{key:'short-call',title:'Call about a bill that won\'t fit before payday',note:'Ask for a later due date or a hardship plan.',due:'payday'}})}
 /* the month is running behind */
 if(T.gap<0&&T.i>0){
  const vc={};cur.filter(x=>isDone(x)&&x.type==='variable'&&!isEss(x.cat,'variable')).forEach(x=>vc[x.cat]=(vc[x.cat]||0)+spendAmt(x));
  const top=Object.entries(vc).sort((a,b)=>b[1]-a[1])[0];
  const low=top?Math.min(...full.map(o=>cs(o,top[0])).concat([top[1]])):0;
  add({u:C.avail<0?2:3,imp:Math.abs(T.gap)*4,feas:2,tag:'This month',icon:'alert',head:`This month is ${money(Math.abs(T.gap))} behind so far`,
   math:`<b>${money(T.out)}</b> has gone out against <b>${money(T.i)}</b> received.    ${top?` Your largest optional category is <b>${esc(top[0])}</b> at <b>${money(top[1])}</b>${low<top[1]?`; your lightest recent month for it was <b>${money(low)}</b>`:''}.`:''}`,
   ctas:top?[{l:`See ${top[0].toLowerCase()}`,a:'cat:'+top[0]},{l:'Income options',a:'income'}]:[{l:'Income options',a:'income'}]})}
 /* scheduled items nobody has confirmed */
 const un=unconfirmed();
 if(un.length)add({u:3,imp:sum(un,p=>p.amt)/10,feas:3,tag:'Needs confirming',icon:'check',
  head:`${plural(un.length,'scheduled item')} ${un.length===1?'is':'are'} waiting for you to confirm`,
  math:`Until you mark them done, Gap treats ${un.length===1?'it':'them'} as still owed.`,
  ctas:[{l:'Review them',a:'sched'}],habit:{tpl:'bills-weekly'},todo:{key:'confirm-'+t.slice(0,7),title:'Confirm the scheduled items waiting in Gap'}});
 /* a debt whose payment does not cover its interest */
 liveDebts().forEach(d=>{const b=debtBal(d),mi=b*(+d.apr||0)/1200;
  if(mi>0.5&&(+d.min||0)<=mi)add({u:3,imp:mi*12,yr:1,feas:2,tag:'Debt',icon:'card',
   head:`${esc(d.name)}: the payment doesn't cover its interest`,
   math:`At <b>${(+d.apr).toFixed(1)}%</b> on <b>${money(b)}</b>, interest is about <b>${money2(mi)}</b> a month and the payment is <b>${money2(+d.min||0)}</b>. The balance grows unless at least <b>${money(mi-(+d.min||0)+1)}</b> more goes to it each month.`,
   ctas:[{l:'Open the simulator',a:'sim'}],todo:{key:'rate-'+d.id,title:`Call ${d.name} about the rate or a hardship plan`,note:`Payment ${money2(+d.min||0)}, interest about ${money2(mi)} a month.`}})});
 /* setup that the numbers depend on */
 if(C.need.length&&(hasData||S.rec.length)){
  const w={pay:'your pay schedule',bal:'today\'s balance',ess:'an estimate of everyday essentials',buf:'a protective buffer',
   review:'a quick check that today\'s numbers are current',card:'the cash you keep for card purchases'};
  const miss=C.need.map(k=>w[k]).filter(Boolean),list=miss.length>1?miss.slice(0,-1).join(', ')+' and '+miss[miss.length-1]:miss[0];
  add({u:2,imp:0,feas:3,tag:'Setup',icon:'cal',head:'See what\'s available until payday',
   math:`Gap still needs ${list}.`,
   ctas:[{l:'Add '+(C.need[0]==='pay'?'pay schedule':'the missing numbers'),a:C.need[0]==='pay'?'open:pay':'open:cyc'}]})}
 if(!S.rec.length&&hasData)add({u:2,imp:40,feas:3,tag:'Setup',icon:'loop',head:'Schedule your paycheck and regular bills',
  math:'Scheduled, they show up as coming, and you confirm each one when it happens.',
  ctas:[{l:'Add a schedule',a:'reps'}]});
 /* card payments counted as spending */
 if(S.debts.some(d=>d.kind==='card')&&cur.some(x=>isDone(x)&&x.type==='fixed'&&x.cat==='Debt minimum'))
  add({u:2,imp:0,feas:3,tag:'Accuracy',icon:'card',head:'Card payments may be counted twice',
   math:'Logging the card payment as a bill counts the same money again. Log card payments as a <b>Transfer → Card payment</b> instead; loan payments stay as bills.',
   ctas:[{l:'See fixed entries',a:'type:fixed'}]});
 /* tax reserve, as an estimate */
 if(S.tax.on){const x=taxEst(cur);
  if(x.base>0&&x.need-x.held>5)add({u:2,imp:(x.need-x.held)*2,feas:2,tag:'Tax reserve',icon:'file',
   head:`Consider setting aside about ${money(x.need-x.held)} for taxes`,
   math:`<b>${money(x.inc)}</b> came in this month without withholding${x.biz?`, less <b>${money(x.biz)}</b> in business expenses`:''}. At your <b>${+S.tax.rate}%</b> reserve rate that's <b>${money(x.need)}</b>, and <b>${money(x.held)}</b> is set aside. An estimate, not a tax bill.`,
   ctas:[{l:'Set it aside',a:'tax:'+Math.round(x.need-x.held)}],todo:{key:'tax-'+t.slice(0,7),title:`Set aside about ${money(x.need-x.held)} for taxes`,due:'payday'}})}
 /* emergency buffer */
 const em=S.goals.find(g=>g.emerg),EM=essMonthly(),sa=surplusAvg();
 if(!em&&hasData)add({u:sa.avg>0?2:1,imp:500,feas:2,tag:'Buffer',icon:'shield',head:'Start an emergency buffer',
  math:`Start where it's realistic: <b>$500</b>, then a month of essentials${EM?` (about <b>${money(EM.total)}</b> for you)`:''}.`,
  ctas:[{l:'Set one up',a:'goal:new-emerg'}],habit:{tpl:'payday-save'}});
 else if(em&&EM&&EM.total>0){const b=goalBal(em).saved,days=b/(EM.total/30.44);
  if(days<30)add({u:1,imp:300,feas:2,tag:'Buffer',icon:'shield',head:`Your buffer covers about ${Math.floor(days)} days of essentials`,
   math:`<b>${money(b)}</b> set aside against roughly <b>${money(EM.total)}</b> of essential costs a month.`,
   ctas:[{l:'Add to it',a:'top:'+em.id}],habit:{tpl:'payday-save',ref:{goal:em.id}}})}
 /* sinking funds that need money this paycheck */
 const pay=primary();
 S.funds.forEach(f=>{const p=fundPlan(f,pay);if(p.ready||!p.thisCycle)return;const soon=diffD(t,p.due)<=75;
  if(soon||p.late)add({u:p.late?3:2,imp:p.left,feas:2,tag:'Sinking fund',icon:'cal',
   head:p.late?`${esc(f.name)} was due ${fmtD(p.due)} and is ${money(p.left)} short`:`Set aside ${money(p.thisCycle)} for ${esc(f.name)} this paycheck`,
   math:p.late?`Then set the next due date so it builds again.`
    :`<b>${money(p.left)}</b> still needed by <b>${fmtD(p.due)}</b>${p.n?`, ${plural(p.n,'paycheck')} away`:''}.`,
   ctas:[{l:p.late?'Open funds':'Set it aside',a:p.late?'goals':'fund:'+f.id}],habit:{tpl:'fund-topup',ref:{fund:f.id}}})});
 /* a category already past its usual month */
 let ov=null;
 [...new Set(cur.filter(x=>isDone(x)&&x.type==='variable').map(x=>x.cat))].forEach(c=>{
  const n=cs(0,c),a=avgC(c),min=isEss(c,'variable')?40:12;if(a>0&&n>a&&n-a>=min&&(!ov||n-a>ov.d))ov={c,n,a,d:n-a}});
 if(ov){const opt=!isEss(ov.c,'variable');
  add({u:opt?2:1,imp:ov.d*12,yr:opt,feas:opt?2:1,tag:opt?'Optional spending':'Essential spending',icon:'alert',head:`${esc(ov.c)} is past a usual month`,
  math:`You're at <b>${money(ov.n)}</b> on ${esc(ov.c.toLowerCase())}; your usual full month is <b>${money(ov.a)}</b>, with ${plural(dLeft,'day')} to go.`,
  ctas:[{l:`See ${ov.c.toLowerCase()}`,a:'cat:'+ov.c}],habit:{tpl:'review-daily'}})}
 /* subscriptions */
 const subNow=cs(0,'Subscriptions'),sub=subNow||avgC('Subscriptions');
 if(sub>=8&&!isEss('Subscriptions','fixed')){
  const rs=S.rec.filter(r=>r.cat==='Subscriptions'&&r.on!==false&&r.amt>0).sort((a,b)=>a.amt-b.amt);
  const one=rs.length>=2?Math.round(rs[0].amt):Math.round(sub/2);
  add({u:1,imp:one*12,yr:1,feas:3,tag:'Fixed, optional',icon:'loop',head:rs.length>=2?'Cancel one subscription and keep the difference every month':`Subscriptions cost ${money(sub*12)} a year`,
   math:rs.length>=2?`Subscriptions run <b>${money(sub)}</b> a month across ${rs.length} lines. The smallest is <b>${esc(rs[0].note)}</b> at <b>${money(one)}</b>: <b>${money(one*12)}</b> a year.`
    :`That's <b>${money(sub)}</b> a month. Halving it keeps <b>${money(one)}</b> a month, <b>${money(one*12)}</b> over a year.`,
   ctas:[{l:'See the schedules',a:'reps'}],habit:{tpl:'subs-review'},
   todo:{key:'subs-'+(rs.length>=2?rs[0].id:'one'),title:rs.length>=2?`Cancel ${rs[0].note} if you don't use it`:'Cancel one subscription you don\'t use',worth:one*12}})}
 /* the costliest debt, only when a payoff actually happens */
 const lds=liveDebts().filter(d=>d.apr>0);
 if(lds.length){const d=[...lds].sort((a,b)=>debtBal(b)*b.apr-debtBal(a)*a.apr)[0];
  const mi=debtBal(d)*(d.apr/1200);const b0=simulate(0),b1=simulate(50);
  if(mi>=2&&b0.ok&&b1.ok)add({u:1,yr:1,imp:Math.max(b0.int-b1.int,0)/Math.max(b0.m/12,1),feas:2,tag:'Debt',icon:'card',head:`${esc(d.name)} costs about ${money(mi)} a month in interest`,
   math:`At <b>${(+d.apr).toFixed(1)}%</b> on <b>${money(debtBal(d))}</b>. Adding <b>$50</b> a month to your payments clears everything <b>${plural(Math.max(b0.m-b1.m,0),'month')}</b> sooner and saves about <b>${money(Math.max(b0.int-b1.int,0))}</b> in interest.`,
   ctas:[{l:'Try it in the simulator',a:'sim'}]})}
 /* when essentials alone crowd the income, point at income */
 const lastFull=full[0];
 if(lastFull){const LT=monthTot(lastFull),ess=sum(monthTx(lastFull).filter(x=>isDone(x)&&isSpend(x)&&isEss(x.cat,x.type)),spendAmt);
  if(LT.i>0&&ess/LT.i>.6)add({u:ess/LT.i>.85?2:1,imp:LT.i*.05*12,feas:1,tag:'Income',icon:'bulb',
   head:`Essentials took ${Math.round(ess/LT.i*100)}% of income last month`,
   math:`<b>${money(ess)}</b> of <b>${money(LT.i)}</b> went to essentials. At that level, cutting helps less than earning more.`,
   ctas:[{l:'Income options',a:'income'}]})}
 /* small optional buys */
 const sm=cur.filter(x=>isDone(x)&&x.type==='variable'&&!x.refund&&x.amt<15&&!isEss(x.cat,'variable')),smS=sum(sm,x=>x.amt);
 if(sm.length>=5&&smS>=25)add({u:1,imp:smS*6,yr:1,feas:3,tag:'Small buys',icon:'drop',head:`${sm.length} small optional buys came to ${money(smS)} this month`,
  math:`Together they're <b>${money(smS)}</b>, about <b>${money(smS*12)}</b> a year at this pace.`,
  ctas:[{l:'See them',a:'size:-20'}],habit:{tpl:'review-daily'}});
 /* surplus into a goal, with honest projections */
 const open=S.goals.map(g=>({g,left:(+g.target||0)-goalBal(g).saved})).filter(x=>x.left>0).sort((a,b)=>a.left-b.left)[0];
 if(sa.avg>20&&open){const half=sa.avg/2,mo=Math.ceil(open.left/half),d=new Date();d.setMonth(d.getMonth()+mo);
  add({u:1,imp:open.left,feas:2,tag:'Goals',icon:'target',head:`Half your surplus would finish ${esc(open.g.name)} by ${d.toLocaleString('en-US',{month:'long',year:'numeric'})}`,
   math:`Your surplus averaged <b>${money(sa.avg)}</b> a month over ${plural(sa.n,'complete month')}${sa.vals.some(v=>v<0)?', including the months that ran short':''}. Moving <b>${money(half)}</b> of it covers the <b>${money(open.left)}</b> still missing in about <b>${plural(mo,'month')}</b>.`,
   ctas:[{l:'Open goals',a:'goals'}],habit:{tpl:'payday-save',ref:{goal:open.g.id}}})}
 if(sa.avg>20&&!S.goals.length)add({u:1,imp:sa.avg*12,feas:2,tag:'Goals',icon:'target',head:'Your surplus has nowhere to go yet',
  math:`You kept an average of <b>${money(sa.avg)}</b> a month over ${plural(sa.n,'complete month')}.`,
  ctas:[{l:'Name a goal',a:'goal:new'}]});
 return out.map(m=>Object.assign(m,{score:m.u*1e7+m.imp*m.feas})).sort((a,b)=>b.score-a.score)}
const U_L={3:'Urgent',2:'Soon',1:'When you can'},F_L={3:'Easy',2:'Some effort',1:'Takes time'};
function moveHTML(m,i,lead){
 const meta=F_L[m.feas]+(m.yr&&m.imp>=1?` · worth about ${money(m.imp)} a year`:'');
 return `<div class="move${lead?' lead':''}">
  <div class="mi" aria-hidden="true">${ico(m.icon,17)}</div>
  <div class="mb"><div class="mtag"><span class="pill ${m.u===3?'neg':m.u===2?'warn':''}">${U_L[m.u]}</span><span class="pill">${m.tag}</span></div>
   <h3 class="mh">${m.head}</h3>
   <div class="mm">${m.math}</div><p class="mmeta">${meta}</p>
   <div class="macts">${(m.ctas||[]).map((c,k)=>`<button type="button" class="${k?'btn2':'mc'}" data-act="${esc(c.a)}">${c.l}${k?'':' <span aria-hidden="true">→</span>'}</button>`).join('')}
</div>
  </div></div>`}
const empty=(icon,title,sub,act)=>`<div class="empty"><div class="em">${ico(icon,20)}</div>
 <b>${title}</b><span class="es">${sub}</span>${act?`<button type="button" class="ea" data-act="${act[1]}">${act[0]}</button>`:''}</div>`;
let movesOpen=false;
function setMovesOpen(open){
 movesOpen=open;
 const n=$('#moves2').children.length,tg=$('#movesTog');
 $('#moves2Wrap').hidden=!open;
 if(tg){tg.setAttribute('aria-expanded',open?'true':'false');tg.textContent=open?'Hide':`Show ${n}`}
}
function drawMoves(){
 const all=moves(),rest=all.slice(1);
 $('#moves').innerHTML=all.length?moveHTML(all[0],0,true)
  :empty('target','Nothing needs attention','Log a couple of weeks and specific next steps show up here, worked out from your own numbers.',['Add an entry','add']);
 $('#movesN').innerHTML=rest.length?`<button type="button" class="lnk" id="moreMoves">${rest.length} more →</button>`:'';
 $('#moreCard').hidden=!rest.length;
 $('#moves2').innerHTML=rest.map((m,i)=>moveHTML(m,i+1,false)).join('');
 setMovesOpen(movesOpen);
 const mm=$('#moreMoves');if(mm)mm.onclick=()=>{
  const box=$('#moreToday');
  if(box&&box.hidden&&$('#todayTog'))$('#todayTog').click();
  setMovesOpen(true);$('#moreCard').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'})};
 const tg=$('#movesTog');if(tg)tg.onclick=()=>setMovesOpen(!movesOpen);
 bindActs();
}
function bindActs(root){
 (root||document).querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>doAct(b.dataset.act));
}
function doAct(a){
 const i=a.indexOf(':'),k=i<0?a:a.slice(0,i),val=i<0?'':a.slice(i+1);
 if(k==='add')openTx(null);
 else if(k==='cat'){V.cat=val;V.type='all';V.size='all';$('#fT').value='all';$('#fS').value='all';go('ledger')}
 else if(k==='type'){V.cat=null;V.type=val;$('#fT').value=val;go('ledger')}
 else if(k==='size'){V.cat=null;V.size=val;$('#fS').value=val;go('ledger')}
 else if(k==='goals')go('goals');
 else if(k==='sim'){V.extra=Math.max(V.extra,50);$('#extra').value=V.extra;go('debts');setTimeout(()=>$('#extra').focus(),320)}
 else if(k==='reps'){go('ledger');setTimeout(()=>$('#reps').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'}),260)}
 else if(k==='sched'||k==='up'){go('ledger');setTimeout(()=>$('#schedCard').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'}),260)}
 else if(k==='income')openIncome();
 else if(k==='open'){if(val==='pay')openPay();else openCyc()}
 else if(k==='tax')openTransfer({cat:'Tax reserve',amt:+val});
 else if(k==='fund'){const f=S.funds.find(x=>x.id===val);if(f)openTop({fund:f,amt:fundPlan(f,primary()).thisCycle})}
 else if(k==='top'){const g=S.goals.find(x=>x.id===val);if(g)openTop({goal:g})}
 else if(k==='goal'){go('goals');setTimeout(()=>openGoal(null,val==='new-emerg'),200)}
 else if(k==='reps-add')openRep(null);
 else if(k==='debt-add')openDebt(null);
 else if(k==='fund-add')openFund(null);
}

/* ══════════ 4 · coming up ══════════ */
function upRow(p,opts){
 const inc=p.flow>0,past=p.date<today(),r=p.rid&&S.rec.find(x=>x.id===p.rid);
 const verb=p.type==='income'?'Received':p.type==='transfer'?'Moved':'Paid';
 const meta=[esc(p.cat)];
 if(r)meta.push(FREQ_L[r.freq]||'');
 if(p.est)meta.push('estimate: '+p.basis);
 if(!r)meta.push('planned');
 return `<div class="upr${past?' past':''}">
  <div class="ud"><b class="mono">${D(p.date).getDate()}</b><span>${D(p.date).toLocaleDateString('en-US',{month:'short'})}</span></div>
  <div style="min-width:0"><div class="un">${esc(p.name)}</div><div class="um">${past?`was due ${D(p.date).toLocaleDateString('en-US',{weekday:'short'})} · `:wdD(p.date)+' · '}${meta.filter(Boolean).join(' · ')}</div></div>
  <div class="ua"><div class="uv mono ${inc?'in':''}">${inc?'+':'−'}${money(p.amt).replace('−','')}${p.est?'<span class="vh"> estimated</span>*':''}</div>
   <div class="ub"><button data-cf="${esc(p.key)}" aria-label="${verb}: ${esc(p.name)}, ${fmtD(p.date)}">${verb}</button>${!opts||opts.skip!==false?`<button class="q" data-sk="${esc(p.key)}" aria-label="Skip ${esc(p.name)} on ${fmtD(p.date)}">Skip</button>`:''}</div></div>
 </div>`}
let UPC={};
const UP_SHOWN=3;
function drawUpcoming(){
 const t=today(),pay=primary(),next=pay?nextPay(pay,t):null;
 const to=next&&diffD(t,next)>14?next:addD(t,14);
 const un=unconfirmed(),soon=planned(t,to);
 UPC={};un.concat(soon).forEach(p=>UPC[p.key]=p);
 let h='',room=UP_SHOWN;
 const take=a=>{const n=a.slice(0,Math.max(room,0));room-=n.length;return n};
 const shownUn=take(un);
 if(shownUn.length)h+=`<div class="uphead"><span>Needs confirming</span><span>${un.length}</span></div>`+shownUn.map(p=>upRow(p)).join('');
 const before=next?soon.filter(p=>p.date<next):soon,after=next?soon.filter(p=>p.date>=next):[];
 const shownBefore=take(before);
 if(shownBefore.length)h+=`<div class="uphead"><span>${next?'Before payday, '+fmtD(next):'Next two weeks'}</span><span class="mono">${money(-sum(before.filter(p=>p.flow<0),p=>p.amt))}</span></div>`+shownBefore.map(p=>upRow(p)).join('');
 const shownAfter=take(after);
 if(shownAfter.length)h+=`<div class="uphead"><span>From payday on</span></div>`+shownAfter.map(p=>upRow(p)).join('');
 const rest=un.length+soon.length-(UP_SHOWN-Math.max(room,0));
 if(rest>0)h+=`<p class="foot">${plural(rest,'more item')} scheduled. <b>All scheduled</b> shows them.</p>`;
 $('#upl').innerHTML=h||empty('cal','Nothing scheduled in the next two weeks','Schedule your paycheck and regular bills and they show up here before they happen.',['Add a schedule','reps']);
 bindUp($('#upl'));bindActs($('#upl'));
}
function bindUp(root){
 root.querySelectorAll('[data-cf]').forEach(b=>b.onclick=()=>confirmPlanned(UPC[b.dataset.cf]));
 root.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>skipPlanned(UPC[b.dataset.sk]));
}
function confirmPlanned(p){
 if(!p)return;
 if(p.tx){const t=S.tx.find(x=>x.id===p.tx);if(!t)return;openTx(t,{confirm:true});return}
 const r=S.rec.find(x=>x.id===p.rid);if(!r)return;
 const date=p.date<=today()?p.date:today();
 const base={type:r.kind,cat:r.cat,amt:p.amt,note:r.note||r.cat,date,rid:r.id,occ:p.date,src:'schedule',
  goal:r.goal,fund:r.fund,debt:r.debt,dir:r.kind==='transfer'?'out':undefined};
 /* amounts that change are confirmed in the entry sheet so the real figure is kept */
 if(r.vary||r.kind==='income'||r.debt){openTx(null,{preset:base,confirm:true});return}
 addTx(Object.assign({status:'done'},base));
 save();render();toast(`${r.kind==='transfer'?'Moved':'Paid'}: ${r.note||r.cat}`);checkWins();
}
function skipPlanned(p){
 if(!p)return;
 if(p.tx){const t=S.tx.find(x=>x.id===p.tx);if(t){t.status='skipped';t.ts=Date.now()}}
 else S.tx.push({id:uid(),date:p.date,type:p.type,cat:p.cat,amt:0,note:p.name,status:'skipped',rid:p.rid,occ:p.date,src:'schedule',ts:Date.now()});
 save();render();toast('Skipped this one')}
function addTx(o){const t=Object.assign({id:uid(),ts:Date.now(),src:'manual',status:'done'},o);
 Object.keys(t).forEach(k=>t[k]===undefined&&delete t[k]);delete S.reviewed[t.date.slice(0,7)];if(S.checks[t.date]&&isSpend(t))delete S.checks[t.date];S.tx.push(t);return t}

/* ══════════ today's money check ══════════ */
function todayManual(){const t=today();
 return S.tx.filter(x=>isDone(x)&&['manual','schedule','route'].includes(x.src)&&iso(new Date(x.ts||0))===t)}
function drawCheck(){
 const t=today(),c=S.checks[t],ml=todayManual(),spentToday=ml.some(x=>isSpend(x)&&!x.refund);
 let h=`<p class="chkd">${ml.length?`You've logged <b>${plural(ml.length,'entry','entries')}</b> today.`:'Nothing logged today yet.'}</p>`;
 if(c){h+=`<div class="status on" style="margin-top:10px"><span class="dotc"></span><div><b>${c.t==='nospend'?'No-spend day, reviewed':'Reviewed today'}</b><br>${c.src==='streak'?'Recorded earlier from BeFree Streak.':'Saved to your daily record.'}</div></div>
  <button class="tlink" id="ckUndo" style="margin-top:10px">Undo</button>`}
 else h+=`<div class="chk-row" style="margin-top:12px"><button class="btn2" id="ckRev">I reviewed today</button>${spentToday?'':'<button class="btn2" id="ckNo">No spending today</button>'}</div>
  <p class="foot" style="margin-top:10px">A quick look at today's spending. Reviewed days make your spending estimates more reliable.</p>`;
 $('#checkBox').innerHTML=h;
 const rv=$('#ckRev');if(rv)rv.onclick=()=>{S.checks[t]={t:'review',ts:Date.now(),src:'gap'};save();drawCheck();toast('Reviewed. Nice.')};
 const no=$('#ckNo');if(no)no.onclick=()=>{S.checks[t]={t:'nospend',ts:Date.now(),src:'gap'};save();drawCheck();toast('Recorded: reviewed, no spending today')};
 const un=$('#ckUndo');if(un)un.onclick=()=>{delete S.checks[t];save();drawCheck()};
}

/* ══════════ details ══════════ */
function drawTiles(){
 const l=pTx(),T=tot(l),pc=n=>T.i?Math.round(n/T.i*100)+'% of income':'no income yet';
 const essOf=type=>sum(l.filter(x=>isDone(x)&&x.type===type&&isEss(x.cat,type)),spendAmt);
 const hist=k=>{const a=[];for(let b=5;b>=0;b--)a.push({l:mk(b).toLocaleString('en-US',{month:'short'}),v:monthHas(b)?Math.max(monthTot(b)[k],0):null,cur:b===0});return a};
 const spark=(pts,c)=>{const mx=Math.max(...pts.map(p=>p.v||0),1),W=120,H=34,bw=W/6;
  return `<svg class="spk" viewBox="0 0 ${W} ${H}" aria-hidden="true">${pts.map((p,i)=>{const hh=p.v===null?2:Math.max(p.v/mx*(H-4),2);
   return `<rect x="${(i*bw+2).toFixed(1)}" y="${(H-hh).toFixed(1)}" width="${(bw-4).toFixed(1)}" height="${hh.toFixed(1)}" rx="2" fill="${p.v===null?'var(--hair)':c}" opacity="${p.cur?1:.55}" data-tip="${p.v===null?'No entries':money(p.v)}|${p.l}${p.cur?' (so far)':''}"/>`}).join('')}</svg>`};
 [['t1','Money in',T.i,'var(--c-in)',`${plural(l.filter(x=>isDone(x)&&x.type==='income').length,'deposit')}`,'i'],
  ['t2','Fixed',T.f,'var(--c-fix)',`${pc(T.f)} · ${money(essOf('fixed'))} essential`,'f'],
  ['t3','Variable',T.v,'var(--c-var)',`${pc(T.v)} · ${money(essOf('variable'))} essential`,'v']]
 .forEach(([id,lab,v,c,sub,k])=>$('#'+id).innerHTML=
  `<div class="rail" style="background:${c}"></div><div class="eb">${lab}</div>
   <div class="v mono">${money(v)}</div><div class="s">${sub}</div>${spark(hist(k),c)}<div class="spl">last 6 months</div>`);
}

/* ══════════ income that varies ══════════ */
function variStats(){
 const outs=[];for(let b=5;b>=1;b--){if(monthHas(b)){const t=monthTot(b);if(t.out>0)outs.push(t.out)}}
 const lean=outs.length?Math.min(...outs):monthTot(0).out;
 const week=lean/4.35;
 const n=today(),d7=addD(n,-7),d14=addD(n,-14);
 const inc=S.tx.filter(t=>isDone(t)&&t.type==='income');
 const lastWk=sum(inc.filter(t=>t.date>d7&&t.date<=n),t=>t.amt);
 const prevWk=sum(inc.filter(t=>t.date>d14&&t.date<=d7),t=>t.amt);
 return{week,lean,lastWk,prevWk,months:outs.length}}
function drawVari(){
 const box=$('#variCard'),pay=primary();
 const on=(pay&&pay.vary)||S.rec.some(r=>r.kind==='income'&&r.vary&&r.on!==false)||S.tax.on;
 if(!on){box.style.display='none';return}
 box.style.display='';
 const v=variStats(),cover=v.week?Math.min(v.prevWk/v.week,2):0;
 $('#variTag').textContent=v.week?money(v.week)+' a week':'-';
 const x=S.tax.on?taxEst(monthTx(0)):null;
 $('#variGrid').innerHTML=`
  <div class="vb"><div class="k">Baseline week</div>
   <div class="v mono">${money(v.week)}</div>
   <div class="d">${v.months?`Your leanest recent month cost ${money(v.lean)}. Spread over 4.35 weeks, this is what a week needs to cover.`:'Needs a complete month of entries.'}</div></div>
  <div class="vb"><div class="k">Earned the week before last</div>
   <div class="v mono">${money(v.prevWk)}</div>
   <div class="d">${v.prevWk&&v.week?`Already received, so it's safe to plan this week with. It covers <b style="color:var(--tx)">${cover.toFixed(1)} ${cover===1?'week':'weeks'}</b> of your baseline.`:'No income logged that week. When you log what you earned, it becomes the money to plan the next week with.'}</div>
   <div class="wk"><div class="wkf" data-w="${Math.min(cover*50,100).toFixed(0)}"></div></div></div>
  ${x?`<div class="vb"><div class="k">Tax reserve, estimated</div>
   <div class="v mono" style="color:${x.need-x.held>5?'var(--warn)':'var(--acc2)'}">${money(Math.max(x.need-x.held,0))}</div>
   <div class="d">${x.base?`${money(x.base)} of income with no withholding this month × your ${+S.tax.rate}% rate = ${money(x.need)}; ${money(x.held)} set aside. An estimate to plan with, not your tax bill.`:'No income without withholding logged this month.'}</div>
   ${x.need-x.held>5?`<button type="button" class="mc" data-act="tax:${Math.round(x.need-x.held)}" style="margin-top:10px">Set ${money(x.need-x.held)} aside <span aria-hidden="true">→</span></button>`:''}</div>`
  :`<div class="vb"><div class="k">Tax reserve</div><div class="v mono" style="color:var(--tx3)">Off</div><div class="d">If some income has no tax withheld, turn on the reserve estimate in Settings.</div></div>`}`;
 requestAnimationFrame(()=>$$('#variGrid .wkf').forEach(f=>f.style.width=f.dataset.w+'%'));
 bindActs($('#variGrid'));
}

/* ══════════ pace: this month's variable spending, day by day, against a typical month ══════════ */
function cumBy(o){const m=mk(o),n=dayCount(m.getFullYear(),m.getMonth()),a=new Array(n+1).fill(0);
 monthTx(o).filter(t=>isDone(t)&&t.type==='variable').forEach(t=>a[D(t.date).getDate()]+=spendAmt(t));
 for(let d=1;d<=n;d++)a[d]+=a[d-1];return a}
function drawPace(){
 const m=mk(V.off),now=new Date(),days=dayCount(m.getFullYear(),m.getMonth());
 const isCur=V.off===0,dayN=isCur?now.getDate():days;
 const cur=cumBy(V.off),spent=cur[dayN];
 const full=[1,2,3].map(o=>o+V.off).filter(monthReviewed),known=full.length>0;
 const cs=full.map(cumBy),typ=[];for(let d=0;d<=days;d++)typ.push(known?sum(cs.map(c=>{const n=c.length-1;return c[Math.min(n,Math.round(d/days*n))]}))/cs.length:null);
 const base=known?Math.max(typ[days],1):0;
 const burn=spent/Math.max(dayN,1),proj=isCur?burn*days:spent;
 $('#paceDay').textContent=isCur?`day ${dayN} of ${days}`:'closed month';
 const hi=Math.max(proj,base,spent,1)*1.08,L=10,R=330,T0=12,B=118;
 const x=d=>L+(R-L)*(d/days),y=v=>B-(B-T0)*(v/hi);
 const path=(arr,from,to)=>{let o='';for(let d=from;d<=to;d++)o+=`${d===from?'M':'L'}${x(d).toFixed(1)} ${y(arr[d]).toFixed(1)}`;return o};
 const hot=known&&spent>typ[dayN]*1.06;
 const col=hot?'var(--c-over)':'var(--c-var)';
 let o=`<defs><linearGradient id="pcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".3"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>`;
 o+=`<path d="M${L} ${B}H${R}" stroke="var(--grid)"/>`;
 [.25,.5,.75].forEach(f=>o+=`<path d="M${x(days*f).toFixed(1)} ${T0}V${B}" stroke="var(--grid)" stroke-dasharray="2 4"/>`);
 if(known)o+=`<path d="${path(typ,0,days)}" fill="none" stroke="var(--c-plan)" stroke-width="1.6" stroke-dasharray="5 4"/>`;
 o+=`<path d="${path(cur,0,dayN)}L${x(dayN).toFixed(1)} ${B}L${L} ${B}Z" fill="url(#pcg)"/>`;
 o+=`<path id="pcl" d="${path(cur,0,dayN)}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="1000" stroke-dashoffset="1000"/>`;
 if(isCur&&dayN<days&&spent>0)o+=`<path d="M${x(dayN).toFixed(1)} ${y(spent).toFixed(1)}L${x(days).toFixed(1)} ${y(proj).toFixed(1)}" stroke="${col}" stroke-width="1.8" stroke-dasharray="2 4" opacity=".85"/>
   <circle cx="${x(days).toFixed(1)}" cy="${y(proj).toFixed(1)}" r="3.6" fill="none" stroke="${col}" stroke-width="1.6" data-tip="${money(proj)} at this pace|Month end"/>`;
 o+=`<circle cx="${x(dayN).toFixed(1)}" cy="${y(spent).toFixed(1)}" r="5" fill="${col}" stroke="var(--card)" stroke-width="2" data-tip="${money(spent)} so far${known?` · typical by now ${money(typ[dayN])}`:''}|Day ${dayN}"/>`;
 if(known)o+=`<text x="${R}" y="${(y(base)-6).toFixed(1)}" text-anchor="end" font-size="11.5" fill="var(--tx2)" font-family="'IBM Plex Mono',monospace">typical ${kfmt(base)}</text>`;
 o+=`<text x="${L}" y="${B+17}" font-size="11.5" fill="var(--tx2)" font-family="Poppins">1</text><text x="${x(days/2).toFixed(1)}" y="${B+17}" text-anchor="middle" font-size="11.5" fill="var(--tx2)" font-family="Poppins">${Math.round(days/2)}</text><text x="${R}" y="${B+17}" text-anchor="end" font-size="11.5" fill="var(--tx2)" font-family="Poppins">${days}</text>`;
 const pcs=$('#paceSvg');pcs.innerHTML=o;
 anim(v=>{const e=$('#pcl');e&&e.setAttribute('stroke-dashoffset',1000*(1-v))},900);
 $('#paceLeg').innerHTML=lgd(col,'This month')+(known?`<span><i style="background:none;border-top:2px dashed var(--c-plan);height:0;border-radius:0"></i>Typical month</span>`:'')
  +(isCur&&dayN<days&&spent>0?`<span><i style="background:none;border-top:2px dotted ${col};height:0;border-radius:0"></i>At this pace</span>`:'');
 let foot;
 if(!known&&!spent)foot='Log a few purchases and this shows whether you are ahead of the month or behind it.';
 else if(!isCur)foot=`Closed at <b class="mono">${money(spent)}</b> variable${known?`, against a typical <b class="mono">${money(base)}</b>`:''}.`;
 else if(!known)foot=`<b class="mono">${money(burn)}</b> a day so far. After a complete month there's a typical month to compare with.`;
 else foot=`About <b class="mono">${money(burn)}</b> a day. At this pace the month lands near <b class="mono" style="color:${proj>base?'var(--neg)':'var(--acc2)'}">${money(proj)}</b>, against a typical <b class="mono">${money(base)}</b> (${plural(full.length,'complete month')}).`;
 $('#paceFoot').innerHTML=foot;
}
/* ══════════ surplus by month: gaps, not zeros, for months with no entries ══════════ */
function drawTrend(){
 const pct=V.trMode==='pct';
 $$('#trMode button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===(pct?'pct':'usd')));
 const pts=[];for(let b=5;b>=0;b--){const m=mk(b),t=monthTot(b),has=monthHas(b);
  pts.push({l:m.toLocaleString('en-US',{month:'short'}),v:!has?null:pct?(t.i?t.gap/t.i*100:null):t.gap,noinc:has&&pct&&!t.i,cur:b===0,g:t.gap,i:t.i})}
 const vals=pts.filter(p=>p.v!==null).map(p=>p.v);
 const hi=Math.max(...vals,pct?5:1),lo=Math.min(...vals,0);
 const L=8,R=332,T0=24,B=112,step=(R-L)/6,bw=step*.56;
 const y=v=>T0+(B-T0)*((hi-v)/((hi-lo)||1)),z=y(0);
 const fmt=v=>pct?Math.round(v)+'%':kfmt(v);
 let o=PAT+`<path d="M${L} ${z.toFixed(1)}H${R}" stroke="var(--hair3)"/>`;
 if(vals.length>1){const av=sum(vals)/vals.length;o+=`<path d="M${L} ${y(av).toFixed(1)}H${R}" stroke="var(--tx3)" stroke-dasharray="3 4" opacity=".7"/>
  <text class="v" x="${L}" y="${(y(av)-4).toFixed(1)}" font-size="11" fill="var(--tx3)" font-family="Poppins">avg ${fmt(av)}</text>`}
 pts.forEach((p,i)=>{const cx=L+step*i+step/2,x=cx-bw/2;
  o+=`<text x="${cx.toFixed(1)}" y="${B+26}" text-anchor="middle" font-size="11.5" fill="var(--tx2)" font-family="Poppins">${p.l}${p.cur?'*':''}</text>`;
  if(p.v===null){o+=`<rect x="${x.toFixed(1)}" y="${(z-1).toFixed(1)}" width="${bw.toFixed(1)}" height="2" fill="var(--hair3)"/>
   <text x="${cx.toFixed(1)}" y="${(z-7).toFixed(1)}" text-anchor="middle" font-size="11" fill="var(--tx3)" font-family="Poppins">${p.noinc?'no income':'no data'}</text>`;return}
  const yy=y(p.v),top=Math.min(yy,z),hh=Math.max(Math.abs(z-yy),1.5),pos=p.v>=0;
  o+=`<rect class="tb" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${hh.toFixed(1)}" rx="4"
    fill="${pos?'var(--c-keep)':'url(#hatchO)'}" ${pos?'':'stroke="var(--c-over)" stroke-width="1.2"'} opacity="${p.cur?.62:1}"
    data-tip="${money(p.g)} surplus${p.i?` · ${Math.round(p.g/p.i*100)}% of income`:''}|${p.l}${p.cur?' (so far)':''}" style="transform-origin:${cx.toFixed(1)}px ${z.toFixed(1)}px"/>`;
  o+=`<text class="v" x="${cx.toFixed(1)}" y="${(pos?top-6:top+hh+14).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${pos?'var(--tx)':'var(--neg)'}" font-family="'IBM Plex Mono',monospace">${fmt(p.v)}</text>`});
 $('#trend').innerHTML=o;
 $('#trendNote').textContent=(pct?'Surplus ÷ income each month. ':'')+(pts.some(p=>p.v===null)?'Months with no entries are marked, not counted as zero. ':'')+'Recorded amounts; months you have not closed may be incomplete. * month so far.';
}
$$('#trMode button').forEach(b=>b.onclick=()=>{V.trMode=b.dataset.m;drawTrend();fitType($('#trend'))});
/* ══════════ income sources ══════════ */
const RAMP=['var(--k2)','var(--k1)','var(--k4)','var(--k5)','var(--k3)'];
function drawIncome(){
 const MS=[];
 for(let b=5;b>=0;b--){
  const l=monthTx(b).filter(t=>isDone(t)&&t.type==='income'),m={};
  l.forEach(t=>m[t.cat]=(m[t.cat]||0)+t.amt);
  MS.push({l:mk(b).toLocaleString('en-US',{month:'short'}),m,t:sum(l,x=>x.amt),has:monthHas(b)});
 }
 const agg={};MS.forEach(x=>{for(const k in x.m)agg[k]=(agg[k]||0)+x.m[k]});
 const src=Object.keys(agg).sort((a,b)=>agg[b]-agg[a]);
 const keys=src.slice(0,5),tail=src.slice(5);
 const hue=k=>keys.indexOf(k)>=0?RAMP[keys.indexOf(k)]:'var(--k0)';
 const live=MS.slice(0,5).filter(x=>x.has).map(x=>x.t);
 const hi=Math.max(...MS.map(x=>x.t),1);
 const avg=live.length?sum(live)/live.length:0;
 const swing=avg&&live.length>1?Math.round((Math.max(...live)-Math.min(...live))/avg*100):null;
 $('#incTag').textContent=swing===null?'—':swing<=12?'steady':`±${swing}% swing`;
 const L=8,R=332,T=22,B=94,step=(R-L)/6,BW=step*.52;
 let o=`<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" stroke="var(--grid)"/>`;
 if(avg>0){const ay=B-(B-T)*(avg/hi);
  o+=`<line x1="${L}" y1="${ay.toFixed(1)}" x2="${R}" y2="${ay.toFixed(1)}" stroke="var(--tx3)" stroke-width="1" stroke-dasharray="3 4" opacity=".7"/>`;}
 MS.forEach((mo,i)=>{
  const x=L+step*i+(step-BW)/2;let y=B;
  const parts=Object.entries(mo.m).sort((a,b)=>agg[b[0]]-agg[a[0]]);
  if(!parts.length)o+=`<rect x="${x.toFixed(1)}" y="${B-2}" width="${BW.toFixed(1)}" height="2" fill="var(--hair2)"/>`;
  parts.forEach(([k,v])=>{const h=(B-T)*(v/hi);y-=h;
   o+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${BW.toFixed(1)}" height="${Math.max(h,.6).toFixed(1)}"
       fill="${hue(k)}" opacity=".93" data-tip="${money(v)}|${esc(k)}|${mo.l}"/>`;});
  o+=`<text x="${(x+BW/2).toFixed(1)}" y="${B+15}" text-anchor="middle" font-size="11.5" fill="var(--tx2)" font-family="Poppins">${mo.l}</text>`;
  if(mo.t)o+=`<text class="v" x="${(x+BW/2).toFixed(1)}" y="${(y-7).toFixed(1)}" text-anchor="middle" font-size="11.5"
      font-weight="600" fill="var(--tx2)" font-family="'IBM Plex Mono',monospace">${mo.t>=1000?(mo.t/1000).toFixed(1)+'k':Math.round(mo.t)}</text>`;
 });
 $('#incSvg').innerHTML=o;
 const all6=sum(Object.values(agg))||1;
 const rows=keys.map(k=>[k,agg[k],hue(k)]);if(tail.length)rows.push(['Other',sum(tail,k=>agg[k]),'var(--k0)']);
 $('#incLeg').innerHTML=rows.length
  ?rows.map(([k,v,c])=>`<div class="shr"><span class="shn"><i style="background:${c}"></i>${esc(k)}</span>
     <span class="shv mono">${money(v)}</span><span class="shp mono">${(v/all6*100).toFixed(v/all6<.1?1:0)}%</span>
     <span class="sht"><span class="shf" data-w="${(v/all6*100).toFixed(1)}" style="background:${c}"></span></span></div>`).join('')
    +`<p class="foot" style="margin-top:6px">Share of all income over the last six months${avg>0?`. Dashed line: average complete month, ${money(avg)}`:''}.</p>`
  :`<p class="foot">Log some income and its sources show up here.</p>`;
 requestAnimationFrame(()=>$$('#incLeg .shf').forEach(f=>f.style.width=f.dataset.w+'%'));
}
/* ══════════ categories ══════════ */
function drawCats(){
 const l=pTx().filter(t=>isDone(t)&&isSpend(t)),T=tot(pTx());
 const group=k=>{const m={};l.filter(t=>t.type===k).forEach(t=>m[t.cat]=(m[t.cat]||0)+spendAmt(t));
  return Object.entries(m).filter(e=>Math.abs(e[1])>=.005).sort((a,b)=>b[1]-a[1])};
 const F=group('fixed'),Vr=group('variable');
 const out=T.f+T.v;
 const col=(rows,label,s,c,sub)=>{
  const top=Math.max(rows[0]?rows[0][1]:1,1);
  return `<div><div class="cgh"><span class="eb"><span class="dot" style="background:${c}"></span>${label}</span>
   <span><span class="cgt mono">${money(s)}</span><span class="cgs">${sub}</span></span></div>`+
   (rows.length?rows.map(([cat,v])=>{
    const lim=V.range==='month'&&label==='Variable'?LIMITS[cat]:null,over=lim&&v>lim,e=isEss(cat,label.toLowerCase());
    return `<button type="button" class="cr" data-c="${esc(cat)}" aria-pressed="${V.cat===cat}">
     <span class="cn">${esc(cat)}<span class="etag${e?'':' d'}">${e?'Essential':'Optional'}</span></span><span class="cv mono ${over?'over':''}">${money(v)}</span>
     <span class="ct"><span class="cf" data-w="${(Math.max(v,0)/top*100).toFixed(1)}"
       style="display:block;height:100%;border-radius:99px;background:${over?'var(--c-over)':c}"></span></span>
     <span class="cp mono"><span>${out>0?(v/out*100).toFixed(1):0}% of spending</span>
     ${lim?`<span class="${over?'over':''}">${over?'over':'guide'} ${money(lim)}</span>`:''}</span></button>`}).join('')
    :`<div class="empty" style="padding:20px 8px;font-size:14px">Nothing logged</div>`)+`</div>`;
 };
 const pc=n=>T.i?Math.round(n/T.i*100)+'% of income':'';
 const all=[...F,...Vr].sort((a,b)=>b[1]-a[1]);
 const top=all[0];
 const lead=top&&out>0?`<div class="lead">Your largest line is
   <b>${esc(top[0])}</b> at <b class="mono">${money(top[1])}</b>,
   ${Math.round(top[1]/out*100)}% of everything spent.${T.ref?` Refunds of <b class="mono">${money(T.ref)}</b> are already subtracted.`:''}</div>`:'';
 const trs=pTx().filter(t=>isDone(t)&&t.type==='transfer');
 $('#cats').innerHTML=(F.length||Vr.length)
  ?lead+`<div class="cgrid">${col(F,'Fixed',T.f,'var(--c-fix)',pc(T.f))}${col(Vr,'Variable',T.v,'var(--c-var)',pc(T.v))}</div>`
   +(T.i?`<div class="load">${loadNote(T)}</div>`:'')
   +(trs.length?`<p class="foot" style="margin-top:10px">Not included above: <b class="mono">${money(sum(trs,t=>t.amt))}</b> in ${plural(trs.length,'transfer')} (savings, goals, funds, card payments). Moving money isn't spending it.</p>`:'')
  :empty('basket','Nothing logged yet','Add one entry and the split builds itself.',['Add an entry','add']);
 requestAnimationFrame(()=>$$('#cats .cf').forEach(f=>f.style.width=f.dataset.w+'%'));
 $$('#cats .cr').forEach(r=>r.onclick=()=>{V.cat=V.cat===r.dataset.c?null:r.dataset.c;go('ledger')});
 $('#clrCat').style.display=V.cat?'':'none';
}
/* Essentials as a share of take-home: the one line the book, the guide and
   this app all say the same way (STYLESHEET.md, rule J2). Essentials are the
   categories tagged essential in Settings plus every debt minimum, which is
   what Chapter 3 means by the word. Fixed costs were the old measure and are
   not the same thing: a gym membership is fixed and optional, rent is fixed
   and not. Thresholds 60 and 85; the verdicts are the book's. */
function loadNote(T){
 const ess=sum(pTx().filter(t=>isDone(t)&&(t.type==='fixed'||t.type==='variable')
   &&(t.debtRole==='minimum'||isEss(t.cat,t.type))),spendAmt);
 const load=Math.round(ess/T.i*100);
 const verdict=load<=60?'Under 60%, cutting and earning both work.'
  :load<=85?'Past 60%, earning beats cutting.'
  :'Past 85%, move a big cost or raise income.';
 return `Essentials take <b class="mono" style="color:var(--tx)">${load}%</b> of what came in. ${verdict}`;
}
/* ══════════ where income went ══════════
   Surplus is what was left after spending; actual savings is the part of it
   that was moved. The rest is surplus you haven't assigned yet. */
function drawSplit(){
 const T=tot(pTx()),sv=Math.max(T.sav,0),loose=Math.max(T.unassigned,0);
 const ps=[['Fixed',Math.max(T.f,0),'var(--c-fix)'],['Variable',Math.max(T.v,0),'var(--c-var)'],['Moved to savings',sv,'var(--k5)'],['Extra debt paid',Math.max(T.extra,0),'var(--c-over)'],['Unassigned \u00b7 no job yet',loose,'var(--c-keep)']];
 const s=sum(ps,p=>p[1]),cx=100,cy=75,r=56,C=2*Math.PI*r;let o=0;
 const pl=V.range==='month'&&V.off===0?sum(planned(monthStart(),monthEnd()).filter(p=>p.type==='transfer'&&p.flow<0),p=>p.amt):0;
 const base=T.i>0?Math.max(T.i,s):s;
 $('#split').innerHTML=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--hair2)" stroke-width="20"/>`+(s?ps.map(([n,v,c])=>{const len=C*(v/s);
  const e=`<circle class="dn" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="20"
   stroke-dasharray="${Math.max(len-1.5,0)} ${C}" stroke-dashoffset="${-o}" transform="rotate(-90 ${cx} ${cy})" data-tip="${money(v)} · ${base?Math.round(v/base*100):0}%|${n}"/>`;
  o+=len;return e}).join(''):'')+
 `<text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="24" font-weight="900" fill="var(--tx)" font-family="Fraunces,serif">${T.i?Math.round(sv/T.i*100):0}%</text>
  <text x="${cx}" y="${cy+21}" text-anchor="middle" font-size="11" letter-spacing="1.2" fill="var(--tx2)" font-family="Poppins">TRANSFERRED</text>`;
 $('#splitLeg').innerHTML=ps.map(([n,v,c])=>`<div class="shr"><span class="shn"><i style="background:${c}"></i>${n}</span>
   <span class="shv mono">${money(v)}</span><span class="shp mono">${base?Math.round(v/base*100):0}%</span></div>`).join('')
  +`<p class="foot">${T.unassigned<0
   ?`You gave ${money(T.assigned)} a job, but the month only left ${money(T.gap)}. The extra ${money(-T.unassigned)} came from earlier savings or a card.`
   :`The month left ${money(T.gap)}. You gave ${money(T.assigned)} of it a job, so ${money(T.unassigned)} still has none.`}</p>`+(pl?`<p class="foot">Planned, not moved: ${money(pl)}</p>`:'');
}
function drawHeat(){
 const m=mk(V.off),Y=m.getFullYear(),M=m.getMonth();
 const days=dayCount(Y,M),first=new Date(Y,M,1).getDay();
 const by={};monthTx(V.off).filter(t=>isDone(t)&&isSpend(t)).forEach(t=>{
  const d=D(t.date).getDate();by[d]=(by[d]||0)+spendAmt(t)});
 const vs=Object.values(by).filter(v=>v>0).sort((a,b)=>a-b);
 const q=f=>vs.length?vs[Math.min(vs.length-1,Math.floor(vs.length*f))]:0,q1=q(.34),q2=q(.67);
 const lvl=v=>v<=0?0:v<=q1?1:v<=q2?2:3;
 $('#hmM').textContent=m.toLocaleString('en-US',{month:'short',year:'numeric'}).toUpperCase();
 let h='';for(let i=0;i<first;i++)h+='<div class="hx"></div>';
 const t=today();
 for(let d=1;d<=days;d++){const ds=iso(new Date(Y,M,d)),v=Math.max(by[d]||0,0),ck=S.checks[ds],fut=ds>t;
  h+=`<div class="h${lvl(v)}${ck&&ck.t==='nospend'?' ns':''}${fut?' fut':''}${ds===t?' td':''}" data-tip="${fut?'Not yet':v?money(v):ck&&ck.t==='nospend'?'No-spend day':'$0'}|${m.toLocaleString('en-US',{month:'short'})} ${d}"><span>${d}</span></div>`}
 $('#hm').innerHTML=h;
 $('#hmH').innerHTML=['S','M','T','W','T','F','S'].map(d=>`<div>${d}</div>`).join('');
}

/* ══════════ ledger: completed entries ══════════ */
const linkName=t=>{
 if(t.goal){const g=S.goals.find(x=>x.id===t.goal);return g?g.name:'a goal'}
 if(t.fund){const f=S.funds.find(x=>x.id===t.fund);return f?f.name:'a fund'}
 if(t.debt){const d=S.debts.find(x=>x.id===t.debt);return d?d.name:'a debt'}
 return ''};
function drawTx(){
 let l=pTx().filter(isDone);
 if(V.cat)l=l.filter(t=>t.cat===V.cat);
 if(V.type==='refund')l=l.filter(t=>t.refund);
 else if(V.type!=='all')l=l.filter(t=>t.type===V.type);
 if(V.size!=='all'){const n=+V.size;l=l.filter(t=>n<0?t.amt<-n:t.amt>n)}
 if(V.q){const q=V.q.toLowerCase();l=l.filter(t=>((t.note||'')+' '+t.cat+' '+linkName(t)).toLowerCase().includes(q))}
 l=l.slice().sort((a,b)=>V.sort==='amt'?b.amt-a.amt:V.sort==='cat'?a.cat.localeCompare(b.cat)||b.amt-a.amt:b.date.localeCompare(a.date)||(b.ts||0)-(a.ts||0));
 $('#txN').textContent=plural(l.length,'entry','entries')+(V.cat?' · '+V.cat:'');
 const T=tot(l);
 const cap=V.shown||60;
 let lastM='';
 const rows=l.slice(0,cap).map(t=>{
  const inc=t.type==='income',tr=t.type==='transfer',ref=t.refund;
  const mLab=D(t.date).toLocaleString('en-US',{month:'long',year:'numeric'});
  const div=(V.range!=='month'&&mLab!==lastM)?`<div class="uphead" style="padding-top:14px">${(lastM=mLab)}</div>`:'';
  const ln=linkName(t);
  const sign=inc||ref?'+':tr?(t.dir==='in'?'+':''):'−';
  const meta=[esc(t.cat),fmtD(t.date)];
  if(tr)meta.push(t.dir==='in'?`from ${esc(ln||'savings')}`:`to ${esc(ln||t.cat.toLowerCase())}`);
  else if(ln)meta.push((t.debt?'payment on ':'from ')+esc(ln));
  return div+`<button type="button" class="tx" data-id="${t.id}">
   <span class="dot" style="background:${inc?'rgba(237,163,53,.15)':'var(--hair2)'};color:${inc?'var(--acc2)':'var(--tx2)'}">${ico(ICON[t.cat],16)}</span>
   <span><span class="n">${esc(t.note||t.cat)}${ref?'<span class="rec">Refund</span>':''}${t.rid?'<span class="rec">Scheduled</span>':''}${tr?'<span class="rec">Transfer</span>':''}${t.src==='repeat'?'<span class="rec">Auto-entered</span>':''}</span>
    <span class="m" style="display:block">${meta.join(' · ')}</span></span>
   <span class="a mono ${inc||ref?'in':tr?'tr':''}">${sign}${money(t.amt).replace('−','')}</span></button>`}).join('');
 $('#txs').innerHTML=l.length?
  `<p class="foot" style="margin:0 0 6px">In <b class="mono">${money(T.i)}</b> · spent <b class="mono">${money(T.out)}</b>${T.ref?` (after ${money(T.ref)} refunds)`:''} · moved <b class="mono">${money(T.tr)}</b> · surplus <b class="mono" style="color:${T.gap>=0?'var(--acc2)':'var(--neg)'}">${money(T.gap)}</b></p>`
   +rows+(l.length>cap?`<button type="button" class="ghost" id="moreTx">Show ${Math.min(60,l.length-cap)} more of ${l.length-cap}</button>`:'')
  :empty('file','No completed entries match','Widen the range or clear a filter.');
 const mb=$('#moreTx');if(mb)mb.onclick=()=>{V.shown=cap+60;drawTx()};
 $$('#txs .tx').forEach(r=>r.onclick=()=>openTx(S.tx.find(t=>t.id===r.dataset.id)));
}
function drawSched(){
 const t=today(),un=unconfirmed(),soon=planned(t,addD(t,45));
 un.concat(soon).forEach(p=>UPC[p.key]=p);
 $('#schedN').textContent=un.length?`${un.length} to confirm`:plural(soon.length,'item');
 let h='';
 if(un.length)h+=`<div class="uphead"><span>Needs confirming</span></div>`+un.map(p=>upRow(p)).join('');
 if(soon.length)h+=`<div class="uphead"><span>Next 45 days</span><span class="mono">in ${money(sum(soon.filter(p=>p.flow>0),p=>p.amt))} · out ${money(sum(soon.filter(p=>p.flow<0),p=>p.amt))}</span></div>`+soon.map(p=>upRow(p)).join('');
 h+=`<p class="foot" style="margin-top:10px">Planned items don't change any total until you mark them done. Amounts marked * are conservative estimates for income that changes.</p>`;
 $('#sched').innerHTML=(un.length||soon.length)?h:empty('cal','Nothing scheduled','Add your paycheck and regular bills below. They appear here before they happen.');
 bindUp($('#sched'));
}
function schedDesc(r){
 const o=[];
 if(r.freq==='weekly'||r.freq==='biweekly')o.push(`${FREQ_L[r.freq]}, ${r.anchor?'on '+D(r.anchor).toLocaleDateString('en-US',{weekday:'long'})+'s':'no date set'}`);
 else if(r.freq==='semimonthly')o.push(`twice a month, the ${ord(r.day||15)} and ${+r.day2>=31||!r.day2?'last day':'the '+ord(r.day2)}`);
 else if(r.freq==='yearly')o.push(`every year on ${r.anchor?fmtD(r.anchor,{month:'long',day:'numeric'}):'—'}`);
 else o.push(`monthly on the ${+r.day>=31?'last day':ord(r.day||1)}`);
 const n=occ(r,today(),addD(today(),400))[0];
 if(n)o.push('next '+fmtD(n,{weekday:'short',month:'short',day:'numeric'}));
 if(r.on===false)o.push('paused');
 return o.join(' · ')}
function drawReps(){
 const l=S.rec.slice().sort((a,b)=>(b.prim?1:0)-(a.prim?1:0)||(a.kind===b.kind?0:a.kind==='income'?-1:1));
 $('#reps').innerHTML=l.length?l.map(r=>{const inc=r.kind==='income',e=recEst(r);
  return `<div class="rp">
   <button type="button" data-edit="${r.id}" style="text-align:left;display:block">
    <span class="rn" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${esc(r.note||r.cat)}${r.prim?'<span class="pill ok">Main paycheck</span>':''}${r.vary?'<span class="pill">Varies</span>':''}${r.kind==='transfer'?'<span class="pill">Transfer</span>':''}</span>
    <span class="rm" style="display:block">${esc(r.cat)} · ${schedDesc(r)}</span></button>
   <div class="rv mono ${inc?'in':''}">${inc?'+':r.kind==='transfer'?'':'−'}${money(e.amt).replace('−','')}${e.est?'*':''}</div>
   <button type="button" class="sw" role="switch" aria-checked="${r.on!==false}" data-tog="${r.id}"
     aria-label="${esc(r.note||r.cat)} schedule on or off"></button></div>`}).join('')
  :empty('loop','Nothing scheduled yet','Your paycheck, rent, phone, insurance. Schedule them once and they show up as planned, ready to confirm.',['Add a schedule','reps-add']);
 const inc=sum(l.filter(r=>r.on!==false&&r.kind==='income'),r=>recEst(r).amt*(PER_MONTH[r.freq]||1));
 const out=sum(l.filter(r=>r.on!==false&&r.kind!=='income'),r=>(+r.amt||0)*(PER_MONTH[r.freq]||1));
 $('#repNote').innerHTML=l.length?`In a typical month these plan <b class="mono" style="color:var(--acc2)">${money(inc)}</b> in and <b class="mono">${money(out)}</b> out (every 2 weeks counts as 26 a year, not 24). Nothing is counted as done until you confirm it.`:'';
 $$('#reps [data-edit]').forEach(b=>b.onclick=()=>openRep(S.rec.find(r=>r.id===b.dataset.edit)));
 $$('#reps [data-tog]').forEach(b=>b.onclick=()=>{const r=S.rec.find(x=>x.id===b.dataset.tog);
  r.on=r.on===false;save();drawReps();toast(r.on?'Back on':'Paused')});
 $$('#reps [data-act="reps-add"]').forEach(b=>b.onclick=()=>openRep(null));
}
const ord=n=>{n=+n||1;const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])};

/* ══════════ debts ══════════
   A payoff date is shown only when the simulation actually reaches zero. */
function ordered(list){return [...list].sort((a,b)=>V.method==='avalanche'?(+b.apr||0)-(+a.apr||0):(a.b??debtBal(a))-(b.b??debtBal(b)))}
function simulate(extra){
 const ds=liveDebts().map(d=>({...d,b:debtBal(d)}));
 const tot0=sum(ds,d=>d.b);
 if(!ds.length)return{m:0,int:0,ok:true,none:true,path:[0],left:0};
 const budget=sum(ds,d=>+d.min||0)+extra;
 const i0=sum(ds,d=>d.b*((+d.apr||0)/1200));
 const path=[tot0],clr={};let m=0,I=0;
 while(ds.some(d=>d.b>.005)&&m<600){
  m++;let spent=0;
  ds.forEach(d=>{if(d.b<=0)return;const i=d.b*((+d.apr||0)/1200);I+=i;d.b+=i});
  ds.forEach(d=>{if(d.b<=0)return;const p=Math.min(d.b,+d.min||0);d.b-=p;spent+=p});
  let pool=budget-spent;
  for(const d of ordered(ds)){if(pool<=0)break;if(d.b<=0)continue;const p=Math.min(d.b,pool);d.b-=p;pool-=p}
  ds.forEach(d=>{if(d.b<=.005&&clr[d.id]==null)clr[d.id]=m});
  path.push(sum(ds,d=>Math.max(d.b,0)));
 }
 const left=sum(ds,d=>Math.max(d.b,0)),ok=left<=.5;
 return{m:ok?m:null,int:I,ok,left,path,budget,i0,short:Math.max(i0-budget,0),months:m,clr,ds}}
const SIM_ASSUME=`<b>How this is worked out:</b> interest is charged monthly at each APR you entered and doesn't change; payments stay at today's minimums (real card minimums usually shrink as the balance falls, which makes a minimums-only payoff slower than shown); no new charges; extra money goes to one debt at a time in the order above, and each cleared debt's payment rolls to the next. It stops at 50 years. Balances come from what you entered plus payments logged since; interest charged since then isn't added, so update balances from your statements now and then.`;
function debtExtra(d,bal){
 if(d.kind==='bnpl'){const l=bnplLeft(d);return `<span class="dmeta" style="display:block">${l.length?`${plural(l.length,'payment')} left · next ${fmtD(l[0])}`:'No payments scheduled'}</span>`}
 if(d.kind==='card'&&+d.limit>0){const u=BeFreePlus.utilization(bal,d.limit);
  return `<span class="dmeta" style="display:block"><span class="${u.band==='high'?'neg':''}">${Math.round(u.pct)}% of ${money(+d.limit)} limit</span>${+d.close?` · statement closes on the ${ord(d.close)}`:''}</span>`}
 return ''}
function drawDebts(){
 const ord2=ordered(liveDebts()),rank=new Map(ord2.map((d,i)=>[d.id,i])),rk=d=>rank.has(d.id)?rank.get(d.id):1e9;
 /* listed in the order the chosen method pays them; paid-off debts last */
 const ds=S.debts.filter(d=>d.kind!=='due').sort((a,b)=>rk(a)-rk(b)),rs=S.debts.filter(d=>d.kind==='due');
 $('#mthLbl').textContent=V.method==='avalanche'?'highest rate first':'smallest first';
 $('#dList').innerHTML=ds.length?ds.map(d=>{const bal=debtBal(d),tot0=+d.total||0,p=tot0?Math.min(Math.max(1-bal/tot0,0),1):0;
  const tgt=ord2[0]&&ord2[0].id===d.id,mi=bal*(+d.apr||0)/1200,warn=bal>0&&mi>.5&&(+d.min||0)<=mi;
  return `<button type="button" class="dcard ${tgt?'tgt':''}" data-id="${d.id}">
   <span class="dtop"><span><span class="dname">${esc(d.name)} ${tgt?'<span class="badge">next target</span>':''}<span class="pill">${d.kind==='card'?'Card':d.kind==='bnpl'?'Pay later':'Loan'}</span></span>
    <span class="dmeta mono" style="display:block">${(+d.apr||0).toFixed(1)}% APR · payment ${money(+d.min||0)}</span>${debtExtra(d,bal)}</span>
    <span><span class="dbal mono" style="display:block">${money(bal)}</span>
    <span class="dmeta mono" style="display:block;text-align:right">${tot0?Math.round(p*100)+'% paid':''}</span></span></span>
   <span class="dtrack" style="display:block"><span class="dfill" data-w="${(p*100).toFixed(1)}" style="display:block"></span></span>
   ${warn?`<span class="dwarn" style="display:block">The payment (${money2(+d.min||0)}) doesn't cover the monthly interest (about ${money2(mi)}), so this balance grows.</span>`:''}</button>`}).join('')
  :empty('card','No debts listed','Add one to see how and when it clears, or enjoy the quiet.',['Add a debt','debt-add']);
 $('#rList').innerHTML=rs.length?rs.map(d=>{const bal=debtBal(d);
  return `<button type="button" class="dcard" data-id="${d.id}"><span class="dtop">
   <span><span class="dname" style="display:block">${esc(d.name)}</span><span class="dmeta" style="display:block">still owed to you</span></span>
   <span class="dbal mono" style="color:var(--acc2)">${money(bal)}</span></span></button>`}).join('')
  :empty('coin','Nothing outstanding','Nobody owes you money right now.');
 $$('#dList .dcard,#rList .dcard').forEach(c=>c.onclick=()=>openDebt(S.debts.find(d=>d.id===c.dataset.id)));
 $$('#dList [data-act="debt-add"]').forEach(b=>b.onclick=()=>openDebt(null));
 requestAnimationFrame(()=>$$('.dfill').forEach(f=>f.style.width=f.dataset.w+'%'));
 const base=simulate(0),now=simulate(V.extra);
 $('#exVal').textContent=money(V.extra);
 $('#extra').setAttribute('aria-valuetext',`${money(V.extra)} extra a month`);
 const setV=(id,txt,neg)=>{const e=$(id);e.textContent=txt;e.classList.toggle('neg',!!neg)};
 if(base.none){['#simM','#simD','#simI','#simS'].forEach(i=>setV(i,'-'));$('#simNote').innerHTML='';$('#simAssume').innerHTML='';drawPayoff();drawOrder();return}
 if(now.ok){const yr=Math.floor(now.m/12),mo=now.m%12;
  setV('#simM',yr?`${yr}y ${mo}m`:`${mo}m`);
  const dd=new Date();dd.setMonth(dd.getMonth()+now.m);
  setV('#simD',dd.toLocaleString('en-US',{month:'short',year:'numeric'}));
  setV('#simI',money(now.int))}
 else{setV('#simM','Not on this plan',true);setV('#simD','No date',true);setV('#simI',now.months>=600?money(now.int)+'+':'keeps growing',!now.ok)}
 setV('#simS',V.extra&&base.ok&&now.ok?money(Math.max(base.int-now.int,0)):'-');
 let note='';
 if(!now.ok)note=`With ${money(now.budget)} a month going to debt, ${now.short>0?`interest of about <b class="mono">${money(now.i0)}</b> a month is more than the payments, so the total grows`:'the total does not reach zero within 50 years'}. No payoff date is shown because there isn't one on this plan. ${now.short>0?`Paying at least <b class="mono">${money(now.short+1)}</b> more each month is where progress starts.`:'Adding to the monthly amount is what changes that.'}`;
 else if(V.extra&&base.ok)note=`Adding <b class="mono">${money(V.extra)}</b> a month clears everything <b>${plural(Math.max(base.m-now.m,0),'month')}</b> sooner and saves about <b class="mono">${money(Math.max(base.int-now.int,0))}</b> in interest.`;
 else if(V.extra&&!base.ok)note=`Minimums alone never clear these balances. With <b class="mono">${money(V.extra)}</b> extra a month, they do.`;
 else note=`Paying only the current payments takes <b>${plural(base.m,'month')}</b> and costs about <b class="mono">${money(base.int)}</b> in interest. Drag the slider to compare.`;
 $('#simNote').innerHTML=note;$('#simAssume').innerHTML=SIM_ASSUME;
 drawPayoff();drawOrder();
}
function drawPayoff(){
 const el=$('#payoff');if(!el)return;
 const bs=simulate(0),base=bs.path;
 if(bs.none||base.length<2){el.innerHTML=`<text x="10" y="44" font-size="12.5" fill="var(--tx3)" font-family="Poppins">No debts listed. Add one to see how it comes down.</text>`;$('#payTag').textContent='';return}
 const fs=V.extra?simulate(V.extra):null,fast=fs?fs.path:null;
 const N=Math.max(base.length,fast?fast.length:0),hi=Math.max(...base,...(fast||[]),1);
 const L=10,R=332,T=15,B=68;
 const x=i=>L+(R-L)*(i/Math.max(N-1,1)),y=v=>B-(B-T)*(v/hi);
 const line=a=>a.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
 let o=`<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" stroke="var(--grid)"/>`;
 const stepY=N>120?60:12;
 for(let k=stepY;k<N;k+=stepY)o+=`<line x1="${x(k).toFixed(1)}" y1="${T+4}" x2="${x(k).toFixed(1)}" y2="${B}" stroke="var(--grid)" stroke-dasharray="2 4"/>`
   +`<text x="${x(k).toFixed(1)}" y="${B+15}" text-anchor="middle" font-size="11.5" fill="var(--tx2)" font-family="Poppins">${k/12}y</text>`;
 if(fast&&fast.length>1&&fs.ok){
  const back=fast.map((v,i)=>`L${x(i).toFixed(1)} ${y(v).toFixed(1)}`).reverse().join(' ');
  o+=`<path d="${line(base)} ${back}Z" fill="var(--acc)" opacity=".16"/>`;
 }else o+=`<path d="${line(base)}L${x(base.length-1).toFixed(1)} ${B}H${L}Z" fill="var(--tx3)" opacity=".09"/>`;
 o+=`<path d="${line(base)}" fill="none" stroke="${bs.ok?'var(--tx3)':'var(--neg)'}" stroke-width="1.8" stroke-linejoin="round" stroke-dasharray="${fast?'5 4':'none'}"/>`;
 if(fast&&fast.length>1){
  o+=`<path d="${line(fast)}" fill="none" stroke="${fs.ok?'var(--acc)':'var(--neg)'}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
  if(fs.ok){const fx=x(fast.length-1);
   o+=`<line x1="${fx.toFixed(1)}" y1="${T}" x2="${fx.toFixed(1)}" y2="${B}" stroke="var(--acc)" stroke-width="1" stroke-dasharray="2 3" opacity=".6"/>
    <circle cx="${fx.toFixed(1)}" cy="${y(0).toFixed(1)}" r="3.4" fill="var(--acc)"/>
    <text x="${(fx-6).toFixed(1)}" y="${(T+10).toFixed(1)}" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--acc2)" font-family="'IBM Plex Mono',monospace">paid off</text>`}
 }
 o+=`<text x="${L}" y="${(T-3).toFixed(1)}" font-size="11.5" font-weight="600" fill="var(--tx2)" font-family="'IBM Plex Mono',monospace">${money(hi)}</text>`;
 el.innerHTML=o;fitType(el);
 const shown=fs||bs;
 $('#payTag').textContent=!shown.ok?(shown.months<600?'balance grows on this plan':'not paid off in 50 years'):fs&&bs.ok?`${plural(Math.max(base.length-fast.length,0),'month')} sooner`:fs?'paid off with the extra':'current payments only';
}

/* ══════════ payoff order: when each debt clears on the current plan ══════════ */
function drawOrder(){
 const el=$('#orderSvg');if(!el)return;
 const sm=simulate(V.extra),ds=ordered(liveDebts());
 if(sm.none||!ds.length){el.innerHTML='';el.setAttribute('viewBox','0 0 340 40');
  el.innerHTML=`<text x="8" y="24" font-size="12.5" fill="var(--tx3)" font-family="Poppins">No debts listed.</text>`;$('#ordTag').textContent='';return}
 ds.sort((a,b)=>(sm.clr[a.id]??1e9)-(sm.clr[b.id]??1e9));
 const N=Math.max(...ds.map(d=>sm.clr[d.id]!=null?sm.clr[d.id]:sm.months),1);
 const rowH=34,H=ds.length*rowH+30,L=8,R=332;el.setAttribute('viewBox',`0 0 340 ${H}`);
 const x=m=>L+(R-L)*(m/N),hues=['var(--k1)','var(--k2)','var(--k3)','var(--k4)','var(--k5)'];
 let o=PAT;
 ds.forEach((d,i)=>{const y=i*rowH+16,c=sm.clr[d.id],ok=c!=null,end=ok?c:N,col=hues[i%5];
  const when=ok?(()=>{const dd=new Date();dd.setMonth(dd.getMonth()+c);return dd.toLocaleString('en-US',{month:'short',year:'numeric'})})():'not on this plan';
  o+=`<text x="${L}" y="${y-3}" font-size="12" font-weight="600" fill="var(--tx)" font-family="Poppins">${esc(d.name)}</text>
   <text x="${R}" y="${y-3}" text-anchor="end" font-size="11.5" fill="${ok?'var(--tx2)':'var(--neg)'}" font-family="'IBM Plex Mono',monospace">${when}</text>
   <rect class="ob" x="${L}" y="${y+2}" width="${Math.max(x(end)-L,3).toFixed(1)}" height="10" rx="5" fill="${ok?col:'url(#hatchO)'}" ${ok?'':'stroke="var(--c-over)" stroke-width="1"'}
     data-tip="${ok?`Cleared in ${plural(c,'month')}`:'Not paid off on this plan'}|${esc(d.name)} · ${money(debtBal(d))} now"/>`});
 const yrs=N/12,stp=N>120?60:N>36?12:N>12?6:3;
 for(let k=stp;k<N;k+=stp)o+=`<text x="${x(k).toFixed(1)}" y="${H-4}" text-anchor="middle" font-size="11" fill="var(--tx3)" font-family="Poppins">${k%12?k+'m':k/12+'y'}</text>`;
 el.innerHTML=o;fitType(el);
 $('#ordTag').textContent=(V.method==='avalanche'?'highest rate first':'smallest first')+(V.extra?` · +${money(V.extra)}/mo`:'');
}
/* ══════════ goals ══════════ */
function goalPace(g){
 const full=[1,2,3].filter(monthReviewed);if(!full.length)return null;
 const v=full.map(o=>sum(monthTx(o).filter(t=>t.goal===g.id&&t.type==='transfer'&&isDone(t)),t=>t.dir==='in'?-t.amt:t.amt));
 return sum(v)/full.length}
function drawGoalBars(){
 const el=$('#gBars');if(!el)return;
 const gs=[...S.goals].filter(g=>g.target>0).sort((a,b)=>b.target-a.target);
 if(!gs.length){el.innerHTML=empty('up','Nothing to size up yet','Goals appear here at their real size once you add one.');return}
 const mx=Math.max(...gs.map(g=>g.target));
 el.innerHTML=gs.map(g=>{const b=goalBal(g),p=Math.min(Math.max(b.saved,0)/g.target,1),pp=Math.min(Math.max(b.plan,0)/g.target,1-p),done=p>=1;
  return `<div class="gbar ${done?'done':''}">
   <div class="gt"><span class="gtn">${esc(g.name)}</span>
    <span class="gtv mono">${money(b.saved)} <span style="color:var(--tx3);font-weight:400">/ ${money(g.target)}</span></span></div>
   <div class="gtr" style="width:${Math.max(g.target/mx*100,7).toFixed(1)}%">
    <div class="gtf" data-w="${(p*100).toFixed(1)}"></div>${pp>0?`<div class="gtp" style="left:${(p*100).toFixed(1)}%;width:${(pp*100).toFixed(1)}%"></div>`:''}</div></div>`}).join('')
  +`<div class="gscale"><span>Bar length shows the size of the goal. Striped: planned, not moved yet.</span><span class="mono">${money(mx)}</span></div>`;
 requestAnimationFrame(()=>$$('#gBars .gtf').forEach(f=>f.style.width=f.dataset.w+'%'));
}
function drawGoals(){
 const sa=surplusAvg(),EM=essMonthly();
 $('#gRate').textContent='Dates use actual net transfers to each specific goal in closed months. They assume that pace continues; the same surplus is never assigned to every goal.';
 let cum=0,prevName='';
 $('#gList').innerHTML=S.goals.length?S.goals.map(g=>{
  const b=goalBal(g),p=Math.min(1,Math.max(b.saved,0)/(g.target||1)),C=2*Math.PI*22,left=Math.max(g.target-b.saved,0);
  let proj='';
  if(left<=0)proj='Reached. Point the surplus somewhere new.';
  else{const pace=goalPace(g);if(!(pace>0))proj='No date yet: record and review a full month of positive transfers to this goal.';
   else{const m=Math.ceil(left/pace),d=new Date();d.setMonth(d.getMonth()+m);proj=`At this goal's own pace: approximately <b>${d.toLocaleString('en-US',{month:'short',year:'numeric'})}</b>.`;}}

  if(left>0&&g.due){const mo=Math.max(diffD(today(),g.due)/30.44,.5);proj+=`<br>To reach it by ${fmtD(g.due,{month:'short',year:'numeric'})}: about <b>${money(left/mo)}</b> a month.`}
  const pace=goalPace(g);if(pace>0)proj+=`<br>You've moved about ${money(pace)} a month to it lately.`;
  if(g.emerg){if(EM&&EM.total>0){const days=Math.max(b.saved,0)/(EM.total/30.44);proj=`Covers about <b>${Math.floor(days)} days</b> of essential costs (≈${money(EM.total)} a month${EM.partial?', partly estimated':''}).<br>`+proj}
   else proj='Days of essentials covered appears once essential costs are known: schedule essential bills or add a weekly essentials estimate.<br>'+proj}
  return `<div class="gcard" data-id="${g.id}">
   <svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="22" fill="none" stroke="var(--hair)" stroke-width="4.5"/>
   <circle cx="27" cy="27" r="22" fill="none" stroke="${p>=1?'var(--pos)':'var(--acc)'}" stroke-width="4.5" stroke-linecap="round"
     stroke-dasharray="${C*p} ${C}" transform="rotate(-90 27 27)"/>
   <text x="27" y="31.5" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--tx)" font-family="'IBM Plex Mono',monospace">${Math.round(p*100)}</text></svg>
   <button type="button" style="flex:1;text-align:left;min-width:0" data-open-g="${g.id}"><span class="gn">${esc(g.name)}${g.emerg&&!/emergency/i.test(g.name)?'<span class="pill ok">Emergency buffer</span>':''}</span>
    <span class="gm mono" style="display:block">${money(b.saved)} of ${money(g.target)}${b.plan>0?` · +${money(b.plan)} planned`:''}${g.due?' · by '+fmtD(g.due,{month:'short',year:'numeric'}):''}</span>
    <span class="gproj" style="display:block">${proj}</span></button>
   <div class="gbtns"><button type="button" class="mini" data-add="${g.id}" aria-label="Add money to ${esc(g.name)}">+ Add</button></div></div>`}).join('')
  :empty('up','No goals yet','A surplus with a name attached is easier to keep. An emergency buffer is a good first one.',['Add a goal','goal:new']);
 $$('#gList [data-open-g]').forEach(b=>b.onclick=()=>openGoal(S.goals.find(g=>g.id===b.dataset.openG)));
 $$('#gList [data-add]').forEach(b=>b.onclick=()=>openTop({goal:S.goals.find(x=>x.id===b.dataset.add)}));
 bindActs($('#gList'));
 drawGoalBars();drawFunds();drawGoalHist();
}
/* ══════════ saved over time: goal and fund balances at each month end ══════════ */
/* A starting balance counts from the day the goal was set up. Older goals
   have no such date, so their first linked entry stands in for it. */
function madeOf(o,fund,list){if(o.made)return o.made;let f=null;
 (list||S.tx).forEach(t=>{if(isDone(t)&&(fund?t.fund===o.id:t.goal===o.id)&&(!f||t.date<f))f=t.date});return f}
function balAt(o,date,list){const fund=S.funds.includes(o),m=madeOf(o,fund,list);let s=!m||m<=date?(+o.start||0):0;
 (list||S.tx).forEach(t=>{if(!isDone(t)||t.date>date)return;
  if(fund?t.fund===o.id:t.goal===o.id){if(t.type==='transfer')s+=(t.dir==='in'?-1:1)*t.amt;else if(fund&&isSpend(t))s-=spendAmt(t)}});
 return Math.max(s,0)}
function drawGoalHist(){
 const el=$('#gHist');if(!el)return;
 const items=[...S.goals,...S.funds];
 if(!items.length){el.innerHTML='';el.style.display='none';$('#gHistLeg').innerHTML='<p class="foot">Add a goal or fund and its balance builds here, month by month.</p>';$('#gHistTag').textContent='';return}
 el.style.display='';
 const ms=[];for(let b=11;b>=0;b--){const m=mk(b),e=b===0?today():iso(new Date(m.getFullYear(),m.getMonth()+1,0));ms.push({l:m.toLocaleString('en-US',{month:'short'}),e})}
 const own=new Map(items.map(o=>{const f=S.funds.includes(o);return [o,S.tx.filter(t=>f?t.fund===o.id:t.goal===o.id)]}));
 const bal=(o,d)=>balAt(o,d,own.get(o));
 const cur=items.map(o=>({o,now:bal(o,today())})).sort((a,b)=>b.now-a.now);
 const top=cur.slice(0,4),rest=cur.slice(4),hues=['var(--k2)','var(--k1)','var(--k4)','var(--k3)'];
 const series=top.map((c,i)=>({n:c.o.name,c:hues[i],v:ms.map(m=>bal(c.o,m.e))}));
 if(rest.length)series.push({n:'Others',c:'var(--k0)',v:ms.map(m=>sum(rest,r=>bal(r.o,m.e)))});
 const tots=ms.map((_,i)=>sum(series,s=>s.v[i])),hi=Math.max(...tots,1)*1.1;
 const L=8,R=332,T0=14,B=112,x=i=>L+(R-L)*(i/(ms.length-1)),y=v=>B-(B-T0)*(v/hi);
 let o=`<path d="M${L} ${B}H${R}" stroke="var(--grid)"/>`,base=ms.map(()=>0);
 series.forEach(s=>{const top2=base.map((b,i)=>b+s.v[i]);
  const up=top2.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  const dn=base.map((v,i)=>`L${x(i).toFixed(1)} ${y(v).toFixed(1)}`).reverse().join('');
  o+=`<path d="${up}${dn}Z" fill="${s.c}" opacity=".78"/><path d="${up}" fill="none" stroke="${s.c}" stroke-width="1.6"/>`;base=top2});
 ms.forEach((m,i)=>{o+=`<rect x="${(x(i)-(R-L)/22).toFixed(1)}" y="${T0}" width="${((R-L)/11).toFixed(1)}" height="${B-T0}" fill="transparent" data-tip="${money(tots[i])} saved|${m.l}${i===ms.length-1?' (today)':''}"/>`;
  if(i%2===1||i===ms.length-1)o+=`<text x="${x(i).toFixed(1)}" y="${B+16}" text-anchor="middle" font-size="11" fill="var(--tx2)" font-family="Poppins">${m.l}</text>`});
 o+=`<text x="${R}" y="${(y(tots[tots.length-1])-6).toFixed(1)}" text-anchor="end" font-size="12" font-weight="600" fill="var(--tx)" font-family="'IBM Plex Mono',monospace">${money(tots[tots.length-1])}</text>`;
 el.innerHTML=o;
 const d=tots[tots.length-1]-tots[0];
 $('#gHistTag').textContent=`${d>=0?'+':'−'}${money(Math.abs(d))} in 12 months`;
 $('#gHistLeg').innerHTML=series.map(s=>lgd(s.c,esc(s.n))).join('');
}
function drawFunds(){
 const pay=primary();
 $('#fList').innerHTML=S.funds.length?S.funds.map(f=>{const b=fundBal(f),p=fundPlan(f,pay),pc=Math.min(Math.max(b.saved,0)/(f.target||1),1);
  const plan=p.ready?`Ready for ${fmtD(f.due||today(),{month:'short',day:'numeric',year:'numeric'})}.`
   :p.late?`Was due ${fmtD(p.due)}; ${money(p.left)} short.`
   :`Needs <b class="mono">${money(p.per)}</b> ${pay&&p.n?'per paycheck':'a month'}${pay&&p.n?` (≈${money(p.perMonth)} a month)`:''} to be ready by ${fmtD(p.due,{month:'short',day:'numeric',year:'numeric'})}.${p.thisCycle>0&&p.thisCycle<p.per-.5?` ${money(p.per-p.thisCycle)} already set aside this pay cycle.`:''}`;
  return `<div class="gcard">
   <svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="22" fill="none" stroke="var(--hair)" stroke-width="4.5"/>
   <circle cx="27" cy="27" r="22" fill="none" stroke="var(--k2)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="${2*Math.PI*22*pc} ${2*Math.PI*22}" transform="rotate(-90 27 27)"/>
   <text x="27" y="31.5" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--tx)" font-family="'IBM Plex Mono',monospace">${Math.round(pc*100)}</text></svg>
   <button type="button" style="flex:1;text-align:left;min-width:0" data-open-f="${f.id}"><span class="gn">${esc(f.name)}${+f.every?`<span class="pill">every ${+f.every===12?'year':f.every+' months'}</span>`:''}</span>
    <span class="gm mono" style="display:block">${money(b.saved)} of ${money(f.target)}${b.plan>0?` · +${money(b.plan)} planned`:''} · ${esc(f.cat||'')}</span>
    <span class="gproj" style="display:block">${plan}</span></button>
   <div class="gbtns"><button type="button" class="mini" data-fadd="${f.id}" aria-label="Set money aside for ${esc(f.name)}">+ Set aside</button>
    <button type="button" class="mini" data-fpay="${f.id}" aria-label="Pay a ${esc(f.name)} bill from this fund">Pay from it</button></div></div>`}).join('')
  :empty('cal','No sinking funds yet','Car repairs, insurance premiums, medical bills, gifts: costs that are certain but not monthly. Give each one a target and a date.',['Add a fund','fund-add']);
 $$('#fList [data-open-f]').forEach(b=>b.onclick=()=>openFund(S.funds.find(f=>f.id===b.dataset.openF)));
 $$('#fList [data-fadd]').forEach(b=>b.onclick=()=>{const f=S.funds.find(x=>x.id===b.dataset.fadd);openTop({fund:f,amt:fundPlan(f,primary()).thisCycle})});
 $$('#fList [data-fpay]').forEach(b=>b.onclick=()=>{const f=S.funds.find(x=>x.id===b.dataset.fpay);
  openTx(null,{preset:{type:'variable',cat:f.cat||'Other',fund:f.id,amt:Math.min(Math.max(fundBal(f).saved,0),+f.target||0)||'',note:f.name}})});
 $$('#fList [data-act="fund-add"]').forEach(b=>b.onclick=()=>openFund(null));
}

/* ══════════ essentials and optional, six months ══════════ */
function drawEss(){
 const ms=[];for(let b=5;b>=0;b--){const l=monthTx(b).filter(t=>isDone(t)&&isSpend(t));
  const e=sum(l.filter(t=>isEss(t.cat,t.type)),spendAmt),op=sum(l.filter(t=>!isEss(t.cat,t.type)),spendAmt);
  ms.push({l:mk(b).toLocaleString('en-US',{month:'short'}),e:Math.max(e,0),o:Math.max(op,0),has:monthHas(b),cur:b===0})}
 const hi=Math.max(...ms.map(m=>m.e+m.o),1)*1.12,L=8,R=332,T0=16,B=112,step=(R-L)/6,bw=step*.56;
 const y=v=>(B-T0)*(v/hi);
 let o=`<path d="M${L} ${B}H${R}" stroke="var(--grid)"/>`;
 ms.forEach((m,i)=>{const cx=L+step*i+step/2,x=cx-bw/2;
  o+=`<text x="${cx.toFixed(1)}" y="${B+16}" text-anchor="middle" font-size="11.5" fill="var(--tx2)" font-family="Poppins">${m.l}${m.cur?'*':''}</text>`;
  if(!m.has){o+=`<rect x="${x.toFixed(1)}" y="${B-2}" width="${bw.toFixed(1)}" height="2" fill="var(--hair3)"/><text x="${cx.toFixed(1)}" y="${B-8}" text-anchor="middle" font-size="11" fill="var(--tx3)" font-family="Poppins">no data</text>`;return}
  const he=y(m.e),ho=y(m.o),t=m.e+m.o;
  o+=`<rect class="eb1" x="${x.toFixed(1)}" y="${(B-he).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(he,0).toFixed(1)}" rx="3" fill="var(--c-ess)" opacity="${m.cur?.7:1}" data-tip="${money(m.e)} · ${t?Math.round(m.e/t*100):0}%|Essential · ${m.l}"/>
   <rect class="eb1" x="${x.toFixed(1)}" y="${(B-he-ho-1.5).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(ho,0).toFixed(1)}" rx="3" fill="var(--c-opt)" opacity="${m.cur?.7:1}" data-tip="${money(m.o)} · ${t?Math.round(m.o/t*100):0}%|Optional · ${m.l}"/>
   <text class="v" x="${cx.toFixed(1)}" y="${(B-he-ho-7).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--tx)" font-family="'IBM Plex Mono',monospace">${t?Math.round(m.o/t*100)+'%':''}</text>`});
 $('#essSvg').innerHTML=o;
 $('#essLeg').innerHTML=lgd('var(--c-ess)','Essential')+lgd('var(--c-opt)','Optional')+`<span>Number on top: optional share</span>`;
}
/* ══════════ biggest movers between the last two complete months ══════════ */
function drawMovers(){
 const full=[1,2,3,4,5,6].filter(monthHas).slice(0,2);
 if(full.length<2){$('#movTag').textContent='needs two complete months';
  $('#movers').innerHTML=empty('file','Not enough history yet','Two complete months of entries and the comparison shows up here.');return}
 const a={},b={};
 monthTx(full[0]).filter(t=>isDone(t)&&isSpend(t)).forEach(t=>a[t.cat]=(a[t.cat]||0)+spendAmt(t));
 monthTx(full[1]).filter(t=>isDone(t)&&isSpend(t)).forEach(t=>b[t.cat]=(b[t.cat]||0)+spendAmt(t));
 const keys=[...new Set([...Object.keys(a),...Object.keys(b)])];
 const mv=keys.map(k=>({k,d:(a[k]||0)-(b[k]||0),n:a[k]||0,p:b[k]||0})).filter(x=>Math.abs(x.d)>4).sort((x,y)=>Math.abs(y.d)-Math.abs(x.d)).slice(0,6);
 const m0=mk(full[0]).toLocaleString('en-US',{month:'short'}),m1=mk(full[1]).toLocaleString('en-US',{month:'short'});
 $('#movTag').textContent=`${m0} vs ${m1}`;
 const mx=Math.max(...mv.map(x=>Math.abs(x.d)),1);
 $('#movers').innerHTML=mv.length?`<div class="mvax"><span>Spent less</span><span>Spent more</span></div>`+mv.map(x=>`<div class="mv2" data-tip="${money(x.p)} → ${money(x.n)}|${esc(x.k)}, ${m1} to ${m0}" tabindex="0">
   <div class="mvn">${esc(x.k)}</div><div class="mvbar"><span class="${x.d>0?'u':'d'}" data-w="${(Math.abs(x.d)/mx*50).toFixed(1)}"></span></div>
   <div class="mvd mono ${x.d>0?'u':'d'}">${x.d>0?'+':'−'}${money(x.d).replace('−','')}</div></div>`).join('')
  :empty('file','Steady','No category moved by more than $5 between those months.');
 requestAnimationFrame(()=>$$('#movers .mvbar span').forEach(f=>f.style.width=f.dataset.w+'%'));
}
/* ══════════ spending by weekday ══════════ */
function drawDow(){
 const dow=[0,0,0,0,0,0,0],cnt=[0,0,0,0,0,0,0],DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 pTx().filter(t=>isDone(t)&&t.type==='variable').forEach(t=>{dow[D(t.date).getDay()]+=spendAmt(t);cnt[D(t.date).getDay()]++});
 const dm=Math.max(...dow,1),tot7=sum(dow)||1,top=dow.indexOf(Math.max(...dow));
 const L=8,R=332,step=(R-L)/7,bw=step*.6,B=100,H=78;
 $('#dowSvg').innerHTML=dow.map((v,i)=>{const cx=L+step*i+step/2,h=Math.max(v,0)/dm*H,hot=i===top&&v>0;
  return `<rect class="tb" x="${(cx-bw/2).toFixed(1)}" y="${(B-h).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h,1.5).toFixed(1)}" rx="4" fill="var(--c-var)" opacity="${hot?1:.5}" data-tip="${money(v)} · ${Math.round(v/tot7*100)}% · ${plural(cnt[i],'purchase')}|${DN[i]}" style="transform-origin:${cx.toFixed(1)}px ${B}px"/>
   <text x="${cx.toFixed(1)}" y="${B+17}" text-anchor="middle" font-size="11.5" fill="${hot?'var(--tx)':'var(--tx2)'}" font-weight="${hot?600:400}" font-family="Poppins">${DN[i]}</text>
   <text x="${cx.toFixed(1)}" y="${(B-h-6).toFixed(1)}" text-anchor="middle" font-size="11" fill="var(--tx2)" font-family="'IBM Plex Mono',monospace">${v?kfmt(v):''}</text>`}).join('')
  +`<path d="M${L} ${B}H${R}" stroke="var(--grid)"/>`;
 $('#dowNote').textContent=dow.some(v=>v>0)?`Variable spending, ${rangeLabel()}. ${DN[top]} is your heaviest day at ${Math.round(dow[top]/tot7*100)}%.`:`No variable spending ${rangeLabel()}.`;
}
/* ══════════ category by month ══════════ */
function drawTable(){
 const ms=[3,2,1,0].map(o=>mk(o)),cur={};
 monthTx(0).concat(monthTx(1)).filter(t=>isDone(t)&&isSpend(t)).forEach(t=>cur[t.cat]=(cur[t.cat]||0)+spendAmt(t));
 const top=Object.entries(cur).sort((a,b)=>b[1]-a[1]).slice(0,8).map(x=>x[0]);
 const by=[3,2,1,0].map(o=>{const r={};monthTx(o).filter(t=>isDone(t)&&isSpend(t)).forEach(t=>r[t.cat]=(r[t.cat]||0)+spendAmt(t));return r});
 const cell=(c,m)=>by[ms.indexOf(m)][c]||0;
 const mx=Math.max(...top.flatMap(c=>ms.map(m=>cell(c,m))),1);
 $('#mtab').innerHTML=`<thead><tr><th>Category</th>${ms.map((m,i)=>`<th>${m.toLocaleString('en-US',{month:'short'})}${i===3?'*':''}</th>`).join('')}</tr></thead>
 <tbody>${top.map(c=>`<tr><td>${esc(c)}</td>${ms.map((m,i)=>{
   const has=monthHas(3-i),v=cell(c,m);
   return `<td class="mono"><span class="tcell" style="--a:${has&&v>0?(v/mx*.55+.08).toFixed(2):0}">${!has?'n/a':v?money(v):'$0'}</span></td>`}).join('')}</tr>`).join('')}</tbody>`
  +`<caption style="caption-side:bottom;text-align:left;font-size:12.5px;color:var(--tx3);padding-top:8px">* month so far. n/a: no entries that month. Shading grows with the amount.</caption>`;
}
/* ══════════ connection card ══════════ */
function drawStreak(){
 const box=$('#streakBox');if(!box)return;
 const t=today(),ev=gapEvents(),hit=d=>!!(ev[d]&&(ev[d].log||ev[d].review));
 let run=0;for(let i=hit(t)?0:1;i<400&&hit(addD(t,-i));i++)run++;
 let n30=0;for(let i=0;i<30;i++)if(hit(addD(t,-i)))n30++;
 box.innerHTML=`<div class="ch"><h2 class="eb">Your check-in record</h2></div>
  <div class="status${run?' on':''}"><span class="dotc"></span><div>${run?`<b>${plural(run,'day')} in a row</b> with an entry you logged or a review.`:'<b>No run yet.</b> Log an entry or review today to start one.'}</div></div>
  <p class="foot" style="margin-top:10px">Last 30 days: <b>${n30} of 30</b> days checked in. Only entries you log yourself and your reviews count, never automatic ones.</p>`;
}

/* ══════════ chips + render ══════════ */
const RG=[['month','This month'],['30','Last 30 days'],['90','Last 90 days'],['365','Last 12 months'],['all','All time']];
$('#chips').innerHTML=RG.map(([k,l])=>`<button type="button" class="chip" data-r="${k}" aria-pressed="${k==='month'}">${l}</button>`).join('');
$('#lChips').innerHTML=RG.map(([k,l])=>`<button type="button" class="chip" data-r="${k}" aria-pressed="${k==='month'}">${l}</button>`).join('');
function syncRange(){
 $$('.chip[data-r]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.r===V.range));
 const lbl=V.range==='month'
  ?mk(V.off).toLocaleString('en-US',{month:'short',year:'numeric'}).toUpperCase()
  :RG.find(r=>r[0]===V.range)[1].toUpperCase();
 $('#lLbl').textContent=lbl;$('#plbl').textContent=lbl;
 ['#lPrev','#prevM'].forEach(s=>$(s).disabled=V.range!=='month');
 ['#lNext','#nextM'].forEach(s=>$(s).disabled=V.range!=='month'||V.off===0);}
$('#lPrev').onclick=$('#prevM').onclick=()=>{V.off++;V.shown=60;render()};
$('#lNext').onclick=$('#nextM').onclick=()=>{if(V.off>0){V.off--;V.shown=60;render()}};
$$('.chip[data-r]').forEach(c=>c.onclick=()=>{V.range=c.dataset.r;V.off=0;V.shown=60;render()});
function render(){
 revisionOverview();
 mcReset();syncRange();
 if(V.page==='overview'){drawPos();drawGap();drawCycle();drawTiles();drawVari();drawPace();drawTrend();
  drawCats();drawEss();drawSplit();drawIncome();drawHeat();drawMovers();drawDow();drawTable()}
 if(V.page==='guide'){if(typeof drawHome==='function')drawHome();drawMoves();drawUpcoming();drawCheck();drawStreak()}
 if(V.page==='ledger'){drawSched();drawTx();drawReps();
  const bi=$('#bankImpL');if(bi)bi.textContent=S.weekly?'Import a bank file first':'Import a bank file'}
 if(V.page==='plan'&&typeof drawPlan==='function')drawPlan();
 if(V.page==='debts'){drawDebts();if(typeof drawCreditUse==='function')drawCreditUse()}
 if(V.page==='goals')drawGoals();
 fitAllType();kbdCharts($('#p-'+V.page));
 bindOpen($('#p-'+V.page));
 bindActs($('#p-'+V.page));
 $('#prtD').textContent=$('#plbl').textContent;
}
$('#q').oninput=e=>{V.q=e.target.value;V.shown=60;drawTx()};
$('#fT').onchange=e=>{V.type=e.target.value;V.shown=60;drawTx()};
$('#fS').onchange=e=>{V.size=e.target.value;V.shown=60;drawTx()};
$('#fO').onchange=e=>{V.sort=e.target.value;V.shown=60;drawTx()};
$('#clrCat').onclick=()=>{V.cat=null;render()};
$('#extra').oninput=e=>{V.extra=+e.target.value;drawDebts()};
$$('[data-mth]').forEach(b=>b.onclick=()=>{V.method=b.dataset.mth;
 $$('[data-mth]').forEach(x=>x.setAttribute('aria-pressed',x===b));drawDebts()});
$('#upAll').onclick=()=>doAct('sched');
$('#addGoal').onclick=()=>openGoal(null);
$('#addFund').onclick=()=>openFund(null);
$('#addDebt').onclick=()=>openDebt(null);
/* jump links scroll without touching the address, and carry keyboard focus along */
$$('.jump a').forEach(a=>a.onclick=e=>{e.preventDefault();const t=$(a.getAttribute('href'));if(!t)return;
 if(t.style.display==='none'){toast('That section appears once there is data for it');return}
 t.setAttribute('tabindex','-1');t.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});t.focus({preventScroll:true})});

/* ══════════ sheets ══════════
   Every dialog is a sheet: focus moves in, Tab stays inside, Escape closes,
   and focus returns to whatever opened it. */
const sheets=['#shPriv','#shTx','#shRoute','#shRep','#shDebt','#shGoal','#shFund','#shTop','#shPay','#shCyc','#shInfo','#shCats','#shIncome','#shAsk','#shSet','#shLockPin'];
let lastFocus=null,curSheet=null;
const FOCUSABLE='button:not([disabled]),[href],input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea,[tabindex]:not([tabindex="-1"])';
function closeAll(noFocus){sheets.forEach(s=>{const e=$(s);e.classList.remove('on');e.setAttribute('aria-hidden','true')});$('#scrim').classList.remove('on');
 document.body.classList.remove('locked');curSheet=null;
 if(!noFocus&&lastFocus&&lastFocus.focus&&document.contains(lastFocus)){try{lastFocus.focus({preventScroll:true})}catch(e){}}
 if(!noFocus)lastFocus=null}
function show(sel,keepOrigin){const origin=keepOrigin?lastFocus:document.activeElement;closeAll(true);lastFocus=origin;
 const el=$(sel);el.classList.add('on');el.removeAttribute('aria-hidden');$('#scrim').classList.add('on');document.body.classList.add('locked');
 el.scrollTop=0;curSheet=el;
 if(!el.querySelector('.shx')){const x=document.createElement('button');x.type='button';x.className='shx';x.setAttribute('aria-label','Close');
  x.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  x.onclick=()=>closeAll();el.insertBefore(x,el.firstChild)}
 setTimeout(()=>{const f=el.querySelector('input:not([type=hidden]):not([type=checkbox]),select')||el.querySelector(FOCUSABLE);
  f&&f.focus({preventScroll:true})},60)}
sheets.forEach(s=>$(s).setAttribute('aria-hidden','true'));
$('#scrim').onclick=()=>closeAll();
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){
  if($('#win').classList.contains('on')){closeWin();return}
  if(curSheet){e.preventDefault();if(curSheet.id==='shAsk')$('#askNo').click();else closeAll()}return}
 if(e.key==='Tab'&&curSheet){const f=[...curSheet.querySelectorAll(FOCUSABLE)].filter(x=>x.offsetParent!==null);
  if(!f.length)return;const a=f[0],z=f[f.length-1];
  if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
  else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
let tT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');
 clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('on'),2800)}
/* in-app confirmation, same look in both apps */
function ask(title,body,ok,danger){return new Promise(res=>{
 $('#askTitle').textContent=title;$('#askBody').textContent=body;$('#askOk').textContent=ok||'Continue';
 $('#askOk').style.background=danger?'var(--neg)':'';$('#askOk').style.color=danger?'var(--bg)':'';
 const back=lastFocus;show('#shAsk');
 $('#askOk').onclick=()=>{closeAll(true);lastFocus=back;res(true)};
 $('#askNo').onclick=()=>{closeAll();res(false)}})}
const segSet=(sel,attr,val)=>$$(sel+' button').forEach(b=>b.setAttribute('aria-pressed',b.dataset[attr]===val));
const optVal=(v,l,sel)=>`<option value="${esc(v)}"${sel?' selected':''}>${esc(l)}</option>`;

/* ── entry sheet ── */
let A={};
function transferOpts(sel){
 let o=`<optgroup label="Put money in">`;
 S.goals.forEach(g=>o+=optVal('goal:'+g.id,'Goal: '+g.name,sel==='goal:'+g.id));
 S.funds.forEach(f=>o+=optVal('fund:'+f.id,'Sinking fund: '+f.name,sel==='fund:'+f.id));
 o+=optVal('cat:Savings','Savings (general)',sel==='cat:Savings')+optVal('cat:Tax reserve','Tax reserve',sel==='cat:Tax reserve')+optVal('cat:Investing','Investing',sel==='cat:Investing')+`</optgroup>`;
 const cards=S.debts.filter(d=>d.kind==='card'||d.kind==='loan');
 if(cards.length){o+=`<optgroup label="Pay a debt">`;cards.forEach(d=>o+=optVal('debt:'+d.id,d.name,sel==='debt:'+d.id));o+=`</optgroup>`}
 o+=`<optgroup label="Take money out">`;
 S.goals.forEach(g=>o+=optVal('goalin:'+g.id,'From goal: '+g.name,sel==='goalin:'+g.id));
 S.funds.forEach(f=>o+=optVal('fundin:'+f.id,'From fund: '+f.name,sel==='fundin:'+f.id));
 o+=optVal('catin:Savings','From savings (general)',sel==='catin:Savings')+optVal('catin:Tax reserve','From tax reserve',sel==='catin:Tax reserve')+optVal('catin:Investing','From investments',sel==='catin:Investing');
 S.debts.filter(d=>d.kind==='due').forEach(d=>o+=optVal('duein:'+d.id,'Repaid by: '+d.name,sel==='duein:'+d.id));
 o+=`</optgroup>`+optVal('cat:Between accounts','Between my own accounts',sel==='cat:Between accounts');
 return o}
function linkKey(a){
 if(a.type==='transfer'){
  if(a.goal)return (a.dir==='in'?'goalin:':'goal:')+a.goal;
  if(a.fund)return (a.dir==='in'?'fundin:':'fund:')+a.fund;
  if(a.debt){const d=S.debts.find(x=>x.id===a.debt);return (d&&d.kind==='due'?'duein:':'debt:')+a.debt}
  return (a.dir==='in'?'catin:':'cat:')+(a.cat||'Savings')}
 if(a.fund)return 'fund:'+a.fund;
 if(a.debt)return 'debt:'+a.debt;
 return ''}
function applyLink(a,v){
 delete a.goal;delete a.fund;delete a.debt;
 if(a.type==='transfer'){a.dir='out';
  const [k,id]=v.split(':');
  if(k==='goal'||k==='goalin'){a.goal=id;a.cat='Goal';a.dir=k==='goalin'?'in':'out'}
  else if(k==='fund'||k==='fundin'){a.fund=id;a.cat='Sinking fund';a.dir=k==='fundin'?'in':'out'}
  else if(k==='debt'){a.debt=id;a.cat='Card payment'}
  else if(k==='duein'){a.debt=id;a.cat='Between accounts';a.dir='in'}
  else if(k==='catin'){a.cat=id;a.dir='in'}
  else if(k==='cat'){a.cat=id;a.dir=id==='Between accounts'?(a.dir||'out'):'out'}
  return}
 if(!v)return;const [k,id]=v.split(':');if(k==='fund')a.fund=id;else if(k==='debt')a.debt=id}
function openTx(t,opts){
 opts=opts||{};
 if(t)A={...t,raw:String(t.amt),edit:true};
 else A=Object.assign({type:'variable',cat:'Groceries',raw:'',date:today(),status:'done',edit:false},opts.preset||{});
 if(opts.preset&&opts.preset.amt!=null)A.raw=String(opts.preset.amt===''?'':r2(+opts.preset.amt));
 if(opts.confirm){A.status='done';A.confirming=true;if(A.date>today())A.date=today()}
 if(A.type==='transfer'&&!A.dir)A.dir='out';
 $('#txTitle').textContent=A.confirming?(A.type==='income'?'Confirm what arrived':'Confirm this payment'):A.edit?'Edit entry':'New entry';
 $('#txDel').style.display=A.edit?'block':'none';
 $('#txDate').value=A.date;$('#txNote').value=A.note&&A.note!==A.cat?A.note:'';
 $('#txRefund').checked=!!A.refund;syncTx();show('#shTx');
 setTimeout(()=>{const b=$('#seg [aria-pressed=true]');b&&b.focus({preventScroll:true})},90)}
$('#seg').onclick=e=>{const b=e.target.closest('button');if(!b)return;A.type=b.dataset.t;A.newCat=false;
 delete A.goal;delete A.fund;delete A.debt;A.refund=A.refund&&isSpend(A);
 if(A.type==='transfer'){A.cat='Savings';A.dir='out'}else A.cat=allCats(A.type)[0];syncTx()};
$('#stSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;A.status=b.dataset.s;syncTx()};
$('#txRefund').onchange=e=>{A.refund=e.target.checked;syncTx()};
$('#txLink').onchange=e=>{applyLink(A,e.target.value);syncTx()};
$('#pad').innerHTML=[1,2,3,4,5,6,7,8,9,'.',0,'⌫'].map(k=>`<button type="button" data-k="${k}" aria-label="${k==='⌫'?'Delete last digit':k==='.'?'Decimal point':k}">${k}</button>`).join('');
$('#pad').onclick=e=>{const b=e.target.closest('button');if(!b)return;padKey(b.dataset.k)};
function padKey(k){
 if(k==='⌫'||k==='Backspace')A.raw=A.raw.slice(0,-1);
 else if(k==='.'){if(!A.raw.includes('.'))A.raw=(A.raw||'0')+'.'}
 else if(/^\d$/.test(k)&&!(A.raw.includes('.')&&A.raw.split('.')[1].length>=2)&&A.raw.length<9)A.raw=(A.raw+k).replace(/^0(?=\d)/,'');
 syncTx()}
/* typing on a keyboard works too, when focus isn't in a text field */
$('#shTx').addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
 if(/^\d$/.test(e.key)||e.key==='.'||e.key==='Backspace'){e.preventDefault();padKey(e.key)}
 else if(e.key==='Enter'&&!$('#txSave').disabled&&e.target.tagName!=='BUTTON'){e.preventDefault();$('#txSave').click()}});
function syncTx(){
 segSet('#seg','t',A.type);segSet('#stSeg','s',A.status||'done');
 $('#refWrap').style.display=isSpend(A)?'flex':'none';
 const tr=A.type==='transfer';
 $('#cpick').style.display=tr?'none':'flex';
 if(!tr){
  const mine=userCats(A.type);
  $('#cpick').innerHTML=allCats(A.type).map(c=>
   `<button type="button" data-c="${esc(c)}" aria-pressed="${c===A.cat}" class="${mine.includes(c)?'own':''}">${esc(c)}${
     mine.includes(c)?`<span class="xc" data-x="${esc(c)}" role="button" aria-label="Remove category ${esc(c)}">✕</span>`:''}</button>`).join('')
  +(A.newCat
   ?`<span class="newwrap"><input id="catNew" maxlength="22" placeholder="Name it" autocomplete="off" aria-label="New category name"><button type="button" id="catOk">Add</button></span>`
   :`<button type="button" id="catAdd" class="addc">+ New</button>`);
  $$('#cpick button[data-c]').forEach(b=>b.onclick=e=>{
   if(e.target.dataset.x){const n=e.target.dataset.x;dropCat(A.type,n);
     if(A.cat===n)A.cat=allCats(A.type)[0];syncTx();toast('Category removed');return}
   A.cat=b.dataset.c;syncTx()});
  const ab=$('#catAdd');if(ab)ab.onclick=()=>{A.newCat=true;syncTx();setTimeout(()=>$('#catNew')&&$('#catNew').focus(),20)};
  const ni=$('#catNew');
  if(ni){const commit=()=>{const n=addCat(A.type,ni.value);A.newCat=false;
     if(n){A.cat=n;syncTx();toast('"'+n+'" added')}else syncTx()};
   $('#catOk').onclick=commit;
   ni.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();commit()}
     if(e.key==='Escape'){e.preventDefault();e.stopPropagation();A.newCat=false;syncTx()}}}}
 /* what the entry is linked to */
 let lo='',lab='Linked to',hint='';
 if(tr){lab='Where the money goes';lo=transferOpts(linkKey(A));
  hint=A.debt&&A.cat==='Card payment'?'Choose whether this settles recorded purchases, pays a required old-debt amount, or pays extra principal. Split mixed payments so nothing is counted twice.':A.dir==='in'?'Money coming back from savings. Not income.':'Savings transfers assign cash. Required payments on existing debt count toward living costs; extra payments assign the gap. Settlement of recorded purchases is not a second expense.'}
 else if(isSpend(A)){
  const loans=S.debts.filter(d=>d.kind==='loan');
  lo=optVal('','Nothing',!A.fund&&!A.debt);
  if(S.funds.length){lo+=`<optgroup label="Paid out of a sinking fund">`;S.funds.forEach(f=>lo+=optVal('fund:'+f.id,f.name,A.fund===f.id));lo+='</optgroup>'}
  if(loans.length&&A.type==='fixed'){lo+=`<optgroup label="Payment on a loan">`;loans.forEach(d=>lo+=optVal('debt:'+d.id,d.name,A.debt===d.id));lo+='</optgroup>'}
  hint=A.fund?'Counts as spending and comes out of the fund.':A.debt?'Only the principal amount you confirm lowers the loan balance.':''}
 $('#linkWrap').style.display=lo&&(tr||S.funds.length||S.debts.some(d=>d.kind==='loan'&&A.type==='fixed'))?'flex':'none';
 $('#txLink').innerHTML=lo;$('#txLinkLab').textContent=lab;$('#txLinkHint').textContent=hint;
 if(tr){const v=linkKey(A);if(![...$('#txLink').options].some(o=>o.value===v)){applyLink(A,$('#txLink').value)}else $('#txLink').value=v}
 const v=parseFloat(A.raw||'0')||0;
 $('#aDisp').textContent='$'+(A.raw||'0');$('#aDisp').classList.toggle('dim',!v);
 $('#aDisp').setAttribute('aria-label','Amount $'+(A.raw||'0'));
 $('#txSave').disabled=!v;
 const pl=A.status==='planned';
 revisionTxFields();
 $('#txSave').textContent=A.confirming?'Confirm':A.edit?'Save changes':pl?'Add as planned':(A.type==='income'?'Add income':tr?'Add transfer':A.refund?'Add refund':'Add expense')}
$('#txSave').onclick=()=>{const v=parseFloat(A.raw)||0;if(!v)return;
 const date=$('#txDate').value||today(),note=$('#txNote').value.trim();
 if(!revisionTxValid(v,date))return;
 const o={type:A.type,cat:A.cat,amt:r2(v),date,note:note||(A.type==='transfer'?(linkName(A)||A.cat):A.cat),status:A.status||'done',
  payFrom:A.payFrom,card:A.card,debtRole:A.debtRole,principal:A.principal,needsReview:false,
  refund:isSpend(A)&&A.refund?true:undefined,goal:A.goal,fund:A.fund,debt:A.debt,dir:A.type==='transfer'?(A.dir||'out'):undefined};
 let fresh=null;
 if(A.edit){const t=S.tx.find(x=>x.id===A.id);['goal','fund','debt','dir','refund','payFrom','card','debtRole','principal','needsReview'].forEach(k=>delete t[k]);
  if(S.bal&&isDone(t)&&t.date<=S.bal.asOf){S.bal=null;S.cyc.confirmed=null;}
  delete S.reviewed[t.date.slice(0,7)];Object.assign(t,o);
  if(A.confirming)t.ts=Date.now();Object.keys(t).forEach(k=>t[k]===undefined&&delete t[k]);fresh=A.confirming?t:null}
 else fresh=addTx(Object.assign(o,{rid:A.rid,occ:A.occ,src:A.src||'manual'}));
 /* paying a sinking-fund bill rolls the fund to its next due date */
 if(fresh&&fresh.fund&&isSpend(fresh)&&isDone(fresh)){const f=S.funds.find(x=>x.id===fresh.fund);
  if(f&&+f.every&&f.due&&fresh.date>=addD(f.due,-60)){const d=D(f.due);d.setMonth(d.getMonth()+(+f.every));f.due=iso(d);
   setTimeout(()=>toast(`${f.name}: next due ${fmtD(f.due,{month:'short',year:'numeric'})}`),2900)}}
 delete S.reviewed[date.slice(0,7)];
 save();closeAll();render();checkWins();
 if(fresh&&fresh.type==='income'&&isDone(fresh)&&S.prefs.askRoute&&(S.goals.length||liveDebts().length))
  setTimeout(()=>openRoute(fresh.amt),260);
 else toast(A.confirming?'Confirmed':A.edit?'Entry updated':o.status==='planned'?'Added as planned':'Entry added')};
$('#txDel').onclick=async()=>{const id=A.id;const ok=await ask('Delete this entry?','It will be removed from the ledger and every total. This cannot be undone.','Delete',true);
 if(!ok)return;const old=S.tx.find(x=>x.id===id);if(old){delete S.reviewed[old.date.slice(0,7)];if(S.bal&&old.date<=S.bal.asOf){S.bal=null;S.cyc.confirmed=null;}}S.tx=S.tx.filter(x=>x.id!==id);save();closeAll();render();toast('Entry removed')};
function openTransfer(o){openTx(null,{preset:Object.assign({type:'transfer',dir:'out'},o)})}

/* ── routing split: planned unless you say it moved ── */
const RT={p0:50,p1:75,amt:0};
function openRoute(amt){
 const c=cycle();if(c.need.length){toast('Review your balance, bills, essentials and card reserve before allocating money.');openCyc();return}
 RT.amt=Math.max(0,Math.min(amt,c.avail));if(RT.amt<=0){toast('No protected room to allocate before payday.');return}RT.p0=S.route.gap;RT.p1=Math.min(100,S.route.gap+S.route.debt);
 $('#rTitle').textContent=`${money(RT.amt)} available after protections`;$('#rMoved').checked=false;
 drawRoute();show('#shRoute')}
function routeParts(){return BeFreeFinance.allocation(RT.amt,RT.p0,RT.p1-RT.p0)}
function drawRoute(){
 const p=routeParts(),w=[RT.p0,RT.p1-RT.p0,100-RT.p1];
 ['#rs0','#rs1','#rs2'].forEach((s,i)=>{const e=$(s);e.style.flex='none';e.style.width=w[i]+'%';
  e.textContent=w[i]>=17?money([p.g,p.d,p.y][i]):''});
 $('#rs2').style.color='var(--tx)';
 $('#rg0').style.left=RT.p0+'%';$('#rg1').style.left=RT.p1+'%';
 $('#rg0').setAttribute('aria-valuenow',RT.p0);$('#rg1').setAttribute('aria-valuenow',RT.p1);
 $('#rg0').setAttribute('aria-valuetext',`Goal ${RT.p0} percent, ${money(p.g)}`);
 $('#rg1').setAttribute('aria-valuetext',`Debt ${RT.p1-RT.p0} percent, ${money(p.d)}`);
 const goals=S.goals.filter(g=>g.target-goalBal(g).saved>0),debts=liveDebts();
 const prev={g:$('#rGoal')&&$('#rGoal').value,d:$('#rDebt')&&$('#rDebt').value};
 $('#rrows').innerHTML=`
 <div class="rr"><div class="rrt"><i style="background:var(--acc)"></i>
   <div class="rl">Into a goal or fund</div><div class="ra mono">${money(p.g)}</div></div>
  <div class="rs">${RT.p0}% of protected available money</div>
  ${goals.length||S.funds.length?`<select class="rpick" id="rGoal" aria-label="Which goal or fund">${goals.map(g=>`<option value="goal:${g.id}">${esc(g.name)} · ${money(g.target-goalBal(g).saved)} to go</option>`).join('')}${S.funds.map(f=>`<option value="fund:${f.id}">${esc(f.name)} (fund)</option>`).join('')}<option value="">Keep it unassigned</option></select>`:''}</div>
 <div class="rr"><div class="rrt"><i style="background:var(--c-over)"></i>
   <div class="rl">Extra on a debt</div><div class="ra mono">${money(p.d)}</div></div>
  <div class="rs">${RT.p1-RT.p0}% of protected available money</div>
  ${debts.length?`<select class="rpick" id="rDebt" aria-label="Which debt">${ordered(debts).map(d=>`<option value="${d.id}">${esc(d.name)} · ${money(debtBal(d))} left</option>`).join('')}<option value="">Skip debt</option></select>`:''}</div>
 <div class="rr"><div class="rrt"><i style="background:var(--card3);box-shadow:0 0 0 1px var(--hair3)"></i>
   <div class="rl">Unassigned choice</div><div class="ra mono">${money(p.y)}</div></div>
  <div class="rs">${100-RT.p1}%, optional; preserve it if needed</div></div>`;
 if(prev.g!=null&&$('#rGoal'))$('#rGoal').value=prev.g;if(prev.d!=null&&$('#rDebt'))$('#rDebt').value=prev.d;
}
function setHandle(i,p){p=Math.max(0,Math.min(100,Math.round(p)));
 if(i===0){RT.p0=p;if(RT.p1<RT.p0)RT.p1=RT.p0}
 else{RT.p1=p;if(RT.p0>RT.p1)RT.p0=RT.p1}
 drawRoute()}
function saveRoute(){S.route={gap:RT.p0,debt:RT.p1-RT.p0,you:100-RT.p1};save()}
[['#rg0',0],['#rg1',1]].forEach(([sel,i])=>{const el=$(sel);
 el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);el.dataset.d='1';e.preventDefault()});
 el.addEventListener('pointermove',e=>{if(!el.dataset.d)return;
  const r=$('#rbar').getBoundingClientRect();setHandle(i,(e.clientX-r.left)/r.width*100)});
 const up=e=>{if(!el.dataset.d)return;delete el.dataset.d;
  try{el.releasePointerCapture(e.pointerId)}catch(x){}saveRoute()};
 el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
 el.addEventListener('keydown',e=>{
  const d={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1,PageDown:-5,PageUp:5}[e.key];
  if(d===undefined)return;e.preventDefault();setHandle(i,(i===0?RT.p0:RT.p1)+d);saveRoute()})});
$('#rSkip').onclick=()=>{closeAll();toast('Saved. Nothing planned for it.')};
$('#rSave').onclick=()=>{
 const c=cycle();if(c.need.length||RT.amt>c.avail+0.005){toast('Availability changed. Review your balance first.');return}
 const p=routeParts(),gi=$('#rGoal'),di=$('#rDebt'),done=[],moved=$('#rMoved').checked,st=moved?'done':'planned';
 if(gi&&gi.value&&p.g>0){const [k,id]=gi.value.split(':');
  const x=k==='goal'?S.goals.find(g=>g.id===id):S.funds.find(f=>f.id===id);
  if(x){addTx({type:'transfer',cat:k==='goal'?'Goal':'Sinking fund',[k]:id,dir:'out',amt:p.g,date:today(),note:x.name,status:st,src:'route'});done.push(`${money(p.g)} to ${x.name}`)}}
 if(di&&di.value&&p.d>0){const d=S.debts.find(x=>x.id===di.value);
  if(d){const amt=Math.min(p.d,debtBal(d));addTx({type:'transfer',cat:'Debt payment',debt:d.id,debtRole:'extra',principal:d.kind==='loan'?amt:undefined,dir:'out',amt,date:today(),note:d.name+' extra principal',status:st,src:'route'});done.push(`${money(amt)} to ${d.name}`)}}

 saveRoute();save();closeAll();render();checkWins();
 toast(done.length?(moved?'Moved: ':'Planned: ')+done.join(' and '):'Split saved')};

/* ── schedule sheet ── */
let RP={};
function openRep(r){
 RP=r?{...r,edit:true}:{kind:'fixed',cat:'Rent',note:'',amt:'',freq:'monthly',day:1,day2:31,wk:'same',on:true,edit:false};
 $('#repTitle').textContent=RP.edit?'Edit this schedule':'Add a schedule';
 $('#repDel').style.display=RP.edit?'block':'none';
 $('#repName').value=RP.note||'';$('#repAmt').value=RP.amt||'';$('#repDay').value=RP.day||1;$('#repDay2').value=RP.day2||31;
 $('#repAnchor').value=RP.anchor||'';$('#repWk').value=RP.wk||'same';$('#repVar').checked=!!RP.vary;$('#repPrim').checked=!!RP.prim;
 syncRep();show('#shRep')}
function syncRep(){
 segSet('#repSeg','k',RP.kind);segSet('#repFreq','f',RP.freq);
 const list=allCats(RP.kind==='income'?'income':RP.kind==='transfer'?'transfer':'fixed').concat(RP.kind==='fixed'?allCats('variable').filter(c=>!allCats('fixed').includes(c)):[]);
 if(!list.includes(RP.cat))RP.cat=list[0];
 $('#repCat').innerHTML=list.map(c=>optVal(c,c,c===RP.cat)).join('');
 const f=RP.freq,anc=f==='weekly'||f==='biweekly'||f==='yearly';
 $('#repAnchorW').style.display=anc?'flex':'none';
 $('#repAnchorLab').textContent=f==='yearly'?'Date it happens each year':'One actual date it happens';
 $('#repAnchorHint').textContent=f==='biweekly'?'Every 2 weeks means 26 times a year. Pick a real date and the rest follow from it.':'';
 $('#repDaysW').style.display=anc?'none':'grid';$('#repDay2W').style.display=f==='semimonthly'?'flex':'none';
 $('#repWkW').style.display=anc&&f!=='yearly'?'none':'flex';
 $('#repVarW').style.display=RP.kind==='income'?'flex':'none';$('#repPrimW').style.display=RP.kind==='income'?'flex':'none';
 let lo='';
 if(RP.kind==='transfer'){lo=optVal('','Savings (general)',!RP.goal&&!RP.fund&&!RP.debt);
  S.goals.forEach(g=>lo+=optVal('goal:'+g.id,'Goal: '+g.name,RP.goal===g.id));S.funds.forEach(x=>lo+=optVal('fund:'+x.id,'Fund: '+x.name,RP.fund===x.id));
  S.debts.filter(d=>d.kind==='card').forEach(d=>lo+=optVal('debt:'+d.id,'Card payment: '+d.name,RP.debt===d.id))}
 else if(RP.kind==='fixed'){lo=optVal('','Nothing',!RP.debt);S.debts.filter(d=>d.kind==='loan'||d.kind==='bnpl').forEach(d=>lo+=optVal('debt:'+d.id,'Payment on: '+d.name,RP.debt===d.id))}
 $('#repLinkW').style.display=lo&&(RP.kind==='transfer'||S.debts.some(d=>d.kind==='loan'||d.kind==='bnpl'))?'flex':'none';$('#repLink').innerHTML=lo}
$('#repSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;RP.kind=b.dataset.k;delete RP.goal;delete RP.fund;delete RP.debt;syncRep()};
$('#repFreq').onclick=e=>{const b=e.target.closest('button');if(!b)return;RP.freq=b.dataset.f;syncRep()};
$('#repCat').onchange=e=>RP.cat=e.target.value;
$('#repLink').onchange=e=>{delete RP.goal;delete RP.fund;delete RP.debt;const v=e.target.value;if(v){const [k,id]=v.split(':');RP[k]=id}};
$('#repSave').onclick=()=>{
 const f=RP.freq,anc=f==='weekly'||f==='biweekly'||f==='yearly';
 const o={kind:RP.kind,cat:$('#repCat').value,note:$('#repName').value.trim()||$('#repCat').value,
  amt:+$('#repAmt').value||0,freq:f,wk:$('#repWk').value,on:RP.on!==false,
  day:Math.max(1,Math.min(31,+$('#repDay').value||1)),day2:Math.max(1,Math.min(31,+$('#repDay2').value||31)),
  anchor:anc?$('#repAnchor').value:undefined,goal:RP.goal,fund:RP.fund,debt:RP.debt,
  vary:RP.kind==='income'&&$('#repVar').checked||undefined,prim:RP.kind==='income'&&$('#repPrim').checked||undefined};
 if(o.kind==='transfer'&&!o.goal&&!o.fund&&!o.debt)o.cat=o.cat||'Savings';
 if(o.debt&&o.kind==='transfer')o.cat='Card payment';
 if(!(o.amt>0)){toast('Give it an amount first');$('#repAmt').focus();return}
 if(anc&&!o.anchor){toast('Pick one real date for it');$('#repAnchor').focus();return}
 if(o.prim)S.rec.forEach(x=>{if(x.id!==RP.id)delete x.prim});
 Object.keys(o).forEach(k=>o[k]===undefined&&delete o[k]);
 if(RP.edit){const x=S.rec.find(r=>r.id===RP.id);['goal','fund','debt','vary','prim','anchor'].forEach(k=>delete x[k]);Object.assign(x,o)}
 else S.rec.push(Object.assign({id:uid(),start:today()},o));
 save();closeAll();render();toast(RP.edit?'Schedule updated':'Schedule added')};
$('#repDel').onclick=async()=>{const id=RP.id;
 if(!await ask('Delete this schedule?','Entries you already confirmed stay in the ledger. Future planned items from it disappear.','Delete',true))return;
 S.rec=S.rec.filter(x=>x.id!==id);save();closeAll();render();toast('Schedule removed')};
$('#addRep').onclick=()=>openRep(null);

/* ── debt sheet ── */
let DT={};
function bnplRec(d){return S.rec.find(r=>r.bnpl===d.id)||null}
/* payments still to come on a pay-later plan: scheduled and not yet confirmed */
function bnplLeft(d){const r=bnplRec(d);if(!r||!r.end)return[];return occ(r,today(),r.end).filter(x=>!matched(r,x))}
/* each installment is a scheduled bill linked to the plan, so "available
   until payday" keeps room for it and confirming one lowers the balance */
function bnplSchedule(d){const dates=BeFreePlus.installmentDates(d.next,d.every,d.left),mo=d.every==='monthly';
 const o={kind:'fixed',cat:'Debt minimum',note:(d.prov&&d.prov!=='Other'?d.prov+': ':'')+d.name,amt:+d.min||0,freq:mo?'monthly':'biweekly',wk:'same',on:true,
  day:+d.next.slice(8,10),day2:31,start:d.next,end:dates[dates.length-1],debt:d.id,bnpl:d.id};
 if(!mo)o.anchor=d.next;
 const r=bnplRec(d);if(r){delete r.anchor;Object.assign(r,o)}else S.rec.push(Object.assign({id:uid()},o))}
function openDebt(d){DT=d?{...d,edit:true}:{kind:'card',name:'',total:'',bal0:'',apr:'',min:'',edit:false};
 if(!DT.every)DT.every='biweekly';
 $('#dTitle').textContent=DT.edit?'Edit '+DT.name:'Add a debt';$('#dDel').style.display=DT.edit?'block':'none';$('#dPay').style.display=DT.edit?'block':'none';
 $('#dName').value=DT.name;$('#dTotal').value=DT.total;$('#dBal').value=DT.edit?r2(debtBal(DT)):'';
 $('#dApr').value=DT.apr;$('#dMin').value=DT.min;
 $('#dLimit').value=DT.limit||'';$('#dClose').value=DT.close||'';$('#dProv').value=DT.prov||'Afterpay';
 const bl=DT.edit&&DT.kind==='bnpl'?bnplLeft(DT):[];$('#dNext').value=bl[0]||DT.next||'';$('#dLeft').value=DT.edit&&DT.kind==='bnpl'?bl.length:'';
 syncDebt();show('#shDebt')}
$('#dEvery').onclick=e=>{const b=e.target.closest('button');if(!b)return;DT.every=b.dataset.e;syncDebt()};
$('#dSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;DT.kind=b.dataset.k;syncDebt()};
function syncDebt(){segSet('#dSeg','k',DT.kind);
 $('#dTerms').style.display=DT.kind==='due'?'none':'grid';
 $('#dTotalLab').textContent=DT.kind==='due'?'Amount lent':DT.kind==='bnpl'?'Purchase amount':'Original amount';
 $('#dMinLab').textContent=DT.kind==='bnpl'?'Each payment':'Minimum payment';
 const ph=DT.kind==='bnpl'?['Sneakers, Afterpay','200','0','50']:DT.kind==='loan'?['Car loan','18000','7.9','385']:DT.kind==='due'?['Loan to Sam','300','','']:['Blue card','2400','24.9','65'];
 $('#dName').placeholder=ph[0];$('#dTotal').placeholder=ph[1];$('#dApr').placeholder=ph[2];$('#dMin').placeholder=ph[3];$('#dBal').placeholder=DT.kind==='bnpl'?'150':'1490';
 $('#dCardX').style.display=DT.kind==='card'?'grid':'none';
 $('#dBnplX').style.display=DT.kind==='bnpl'?'block':'none';
 segSet('#dEvery','e',DT.every||'biweekly');
 $('#dKindNote').textContent=DT.kind==='card'?'Separate settlement of recorded purchases, minimum old-debt payments and extra old-debt payments. Split mixed payments into separate entries.':DT.kind==='loan'?'Minimum payments are recurring bills; extra principal is a transfer. Enter principal from the statement; interest is not principal.':DT.kind==='bnpl'?'Afterpay, Klarna, Affirm and similar. Each payment is scheduled as a bill, so "available until payday" keeps room for it. Log the payments, not the original purchase, so it is not counted twice.':'Money someone owes you. Repayments come back as transfers, not income.';
 $('#dPay').textContent=DT.kind==='due'?'Log money received':'Log a payment';
 $('#dBalNote').textContent=DT.edit?`Balance shown includes payments logged since you last updated it${DT.ts?' on '+fmtD(iso(new Date(DT.ts))):''}. Only confirmed principal reduces loans. Enter card interest/fees as card expenses. Reconcile from each statement; balances are estimates between statements.`:'Use the balance from your latest statement.'}
$('#dSave').onclick=()=>{
 const bal=$('#dBal').value===''?null:+$('#dBal').value;
 if(['#dBal','#dTotal','#dApr','#dMin'].some(k=>$(k).value!==''&&(!Number.isFinite(+$(k).value)||+$(k).value<0))){toast('Use a valid amount of zero or more.');return;}
 const o={kind:DT.kind,name:$('#dName').value.trim()||'Untitled',total:+$('#dTotal').value||0,apr:+$('#dApr').value||0,min:+$('#dMin').value||0};
 let nb=bal;
 if(o.kind==='card'){o.limit=Math.max(0,+$('#dLimit').value||0);o.close=Math.max(0,Math.min(31,Math.round(+$('#dClose').value||0)))}
 if(o.kind==='bnpl'){const nx=$('#dNext').value,left=Math.round(+$('#dLeft').value||0);
  if(!(o.min>0)){toast('Enter the amount of each payment');$('#dMin').focus();return}
  if(!nx){toast('Pick the date of the next payment');$('#dNext').focus();return}
  if(!(left>=1&&left<=60)){toast('Enter how many payments are left, from 1 to 60');$('#dLeft').focus();return}
  Object.assign(o,{prov:$('#dProv').value,every:DT.every==='monthly'?'monthly':'biweekly',next:nx,left});
  if(nb==null&&!DT.edit)nb=r2(o.min*left)}
 let x;
 if(DT.edit){x=S.debts.find(y=>y.id===DT.id);Object.assign(x,o);
  if(nb!=null){x.bal0=nb;x.ts=Date.now();x.ledgerBaseline=Object.fromEntries(S.tx.map(t=>[t.id,BeFreeFinance.debtEffect(x,t)]));}}
 else{x=Object.assign({id:uid(),bal0:nb!=null?nb:o.total,ts:Date.now()},o,{total:o.total||nb||0});S.debts.push(x)}
 if(x.kind==='bnpl')bnplSchedule(x);else S.rec=S.rec.filter(r=>r.bnpl!==x.id);
 save();closeAll();render();checkWins();toast(DT.edit?'Updated':x.kind==='bnpl'?'Added. Its payments are now scheduled bills.':'Added')};
$('#dPay').onclick=()=>{const d=S.debts.find(x=>x.id===DT.id);if(!d)return;closeAll(true);
 const preset=d.kind==='card'?{type:'transfer',cat:'Card payment',debt:d.id,debtRole:'',dir:'out',amt:d.min||'',note:d.name}
  :d.kind==='bnpl'?{type:'fixed',cat:'Debt minimum',debt:d.id,debtRole:'minimum',amt:d.min||'',note:d.name}
  :d.kind==='loan'?{type:'fixed',cat:'Loan payment',debt:d.id,debtRole:'minimum',amt:d.min||'',note:d.name}
  :{type:'transfer',cat:'Between accounts',debt:d.id,dir:'in',amt:'',note:d.name};
 openTx(null,{preset})};
$('#dDel').onclick=async()=>{const id=DT.id;
 if(!await ask('Delete this debt?','Payments already logged stay in the ledger but will no longer be linked.','Delete',true))return;
 S.debts=S.debts.filter(x=>x.id!==id);S.rec=S.rec.filter(r=>r.bnpl!==id);S.tx.forEach(t=>{if(t.debt===id)delete t.debt});save();closeAll();render();toast('Removed')};

/* ── goal sheet ── */
let G={};
function openGoal(g,emerg){G=g?{...g,edit:true}:{name:emerg?'Emergency buffer':'',target:'',start:'',due:'',emerg:!!emerg,edit:false};
 $('#gTitle').textContent=G.edit?'Edit goal':'Add a goal';$('#gDel').style.display=G.edit?'block':'none';
 $('#gName').value=G.name;$('#gTarget').value=G.target;$('#gSaved').value=G.start===''?'':(+G.start||0);$('#gDue').value=G.due||'';
 $('#gEmerg').checked=!!G.emerg;
 $('#gSavedNote').textContent=G.edit?`Total now: ${money(goalBal(G).saved)}, including money moved through the ledger.`:'Money moved later is logged as transfers and added on top.';
 syncGoal();show('#shGoal')}
function syncGoal(){
 const on=$('#gEmerg').checked;$('#gPresetsW').style.display=on?'block':'none';if(!on)return;
 const EM=essMonthly(),m=EM&&EM.total;
 const P=[['Starter: $500',500],['$1,000',1000]];
 if(m){P.push(['1 month of essentials',Math.round(m/50)*50]);P.push(['3 months',Math.round(m*3/50)*50]);P.push(['6 months',Math.round(m*6/50)*50])}
 $('#gPresets').innerHTML=P.map(([l,v])=>`<button type="button" data-v="${v}">${l}${l.startsWith('$')||l.startsWith('Starter')?'':' · '+money(v)}</button>`).join('');
 $$('#gPresets button').forEach(b=>b.onclick=()=>{$('#gTarget').value=b.dataset.v;if(!$('#gName').value)$('#gName').value='Emergency buffer'});
 $('#gPresetNote').innerHTML=m?`Your essential costs look like about <b>${money(m)}</b> a month${EM.partial?' (partly estimated)':''}. A steady paycheck and a second earner at home can often aim lower; income that changes, one earner, or people who depend on you point higher. Start with what your pay cycle can support; the target can grow later.`
  :'Once essential bills are scheduled or you add a weekly essentials estimate, month-based targets appear here.'}
$('#gEmerg').onchange=syncGoal;
$('#gSave').onclick=()=>{
 const o={name:$('#gName').value.trim()||'Untitled',target:+$('#gTarget').value||0,
  start:+$('#gSaved').value||0,due:$('#gDue').value||'',emerg:$('#gEmerg').checked||undefined};
 if(o.emerg)S.goals.forEach(g=>{if(g.id!==G.id)delete g.emerg});
 if(G.edit){const x=S.goals.find(y=>y.id===G.id);delete x.emerg;Object.assign(x,o);Object.keys(x).forEach(k=>x[k]===undefined&&delete x[k])}
 else{const n={id:uid(),made:today(),...o};Object.keys(n).forEach(k=>n[k]===undefined&&delete n[k]);S.goals.push(n)}
 save();closeAll();render();checkWins();toast(G.edit?'Goal updated':'Goal added')};
$('#gDel').onclick=async()=>{const id=G.id;
 if(!await ask('Delete this goal?','Transfers already logged stay in the ledger but will no longer be linked to it.','Delete',true))return;
 S.goals=S.goals.filter(x=>x.id!==id);S.tx.forEach(t=>{if(t.goal===id){delete t.goal;t.cat='Savings'}});save();closeAll();render();toast('Goal removed')};

/* ── sinking fund sheet ── */
const FUND_P=[['Car maintenance',600,12,'Car maintenance'],['Car insurance premium',720,6,'Insurance'],['Medical and dental',500,12,'Health'],
 ['Holidays and gifts',450,12,'Gifts'],['Yearly subscriptions',150,12,'Subscriptions'],['Home repairs',600,12,'Other'],['School costs',300,12,'Kids'],['Pet care',400,12,'Other']];
let FD={};
function openFund(f){FD=f?{...f,edit:true}:{name:'',target:'',due:'',every:12,start:'',cat:'Other',edit:false};
 $('#fTitle').textContent=FD.edit?'Edit '+FD.name:'Add a sinking fund';$('#fDel').style.display=FD.edit?'block':'none';
 $('#fPresets').style.display=FD.edit?'none':'flex';
 $('#fPresets').innerHTML=FUND_P.map((p,i)=>`<button type="button" data-i="${i}">${p[0]}</button>`).join('');
 $$('#fPresets button').forEach(b=>b.onclick=()=>{const p=FUND_P[+b.dataset.i];$('#fName').value=p[0];$('#fTarget').value=p[1];$('#fEvery').value=p[2];$('#fCat').value=p[3];
  if(!$('#fDue').value){const d=new Date();d.setMonth(d.getMonth()+(p[2]===6?6:p[0].startsWith('Holidays')?(11-d.getMonth()||12):10));$('#fDue').value=iso(d)}fundPreview()});
 $('#fCat').innerHTML=allCats('fixed').concat(allCats('variable')).filter((c,i,a)=>a.indexOf(c)===i).map(c=>optVal(c,c,c===FD.cat)).join('');
 $('#fName').value=FD.name;$('#fTarget').value=FD.target;$('#fDue').value=FD.due;$('#fEvery').value=String(FD.every||0);$('#fSaved').value=FD.start===''?'':(+FD.start||0);
 fundPreview();show('#shFund')}
function fundPreview(){
 const f={id:FD.id||'_new',target:+$('#fTarget').value||0,due:$('#fDue').value,start:+$('#fSaved').value||0};
 if(!f.target||!f.due){$('#fPlan').textContent='Add an amount and a due date to see the plan.';return}
 const pay=primary(),p=fundPlan(f,pay);
 $('#fPlan').innerHTML=p.ready?'Already fully set aside.':p.late?'That date has passed.':`Plan: <b class="mono">${money(p.per)}</b> ${pay&&p.n?`per paycheck for ${plural(p.n,'paycheck')}`:'a month'} gets you there by ${fmtD(f.due,{month:'short',day:'numeric',year:'numeric'})}.`}
['#fTarget','#fDue','#fSaved'].forEach(s=>$(s).oninput=fundPreview);
$('#fSave').onclick=()=>{
 const o={name:$('#fName').value.trim()||'Sinking fund',target:+$('#fTarget').value||0,due:$('#fDue').value||'',every:+$('#fEvery').value||0,
  start:+$('#fSaved').value||0,cat:$('#fCat').value};
 if(!o.target){toast('Add the amount you\'ll need');$('#fTarget').focus();return}
 if(!o.due){toast('Add when it\'s due');$('#fDue').focus();return}
 if(FD.edit)Object.assign(S.funds.find(x=>x.id===FD.id),o);else S.funds.push({id:uid(),made:today(),...o});
 save();closeAll();render();toast(FD.edit?'Fund updated':'Fund added')};
$('#fDel').onclick=async()=>{const id=FD.id;
 if(!await ask('Delete this fund?','Entries already logged stay in the ledger but will no longer be linked to it.','Delete',true))return;
 S.funds=S.funds.filter(x=>x.id!==id);S.tx.forEach(t=>{if(t.fund===id){delete t.fund;if(t.type==='transfer')t.cat='Savings'}});save();closeAll();render();toast('Fund removed')};

/* ── money into or out of a goal or fund, through the ledger ── */
let TOP=null;
function openTop(o){TOP=Object.assign({dir:'out',status:'done'},o);const x=o.goal||o.fund,b=o.goal?goalBal(o.goal):fundBal(o.fund);
 $('#topTitle').textContent=(o.goal?'Goal: ':'Fund: ')+x.name;
 $('#topSub').textContent=`${money(b.saved)} of ${money(x.target)} so far${b.plan>0?`, ${money(b.plan)} planned`:''}. ${money(Math.max(x.target-b.saved,0))} to go.`;
 $('#topAmt').value=o.amt?r2(o.amt):'';$('#topDate').value=today();syncTop();show('#shTop')}
function syncTop(){segSet('#topSeg','d',TOP.dir);segSet('#topSt','s',TOP.status)}
$('#topSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;TOP.dir=b.dataset.d;syncTop()};
$('#topSt').onclick=e=>{const b=e.target.closest('button');if(!b)return;TOP.status=b.dataset.s;syncTop()};
$('#topSave').onclick=()=>{const n=parseFloat($('#topAmt').value);
 if(!(n>0)){toast('Enter an amount first');$('#topAmt').focus();return}
 const x=TOP.goal||TOP.fund;
 addTx({type:'transfer',cat:TOP.goal?'Goal':'Sinking fund',goal:TOP.goal&&TOP.goal.id,fund:TOP.fund&&TOP.fund.id,dir:TOP.dir,amt:r2(n),
  date:$('#topDate').value||today(),note:x.name,status:TOP.status});
 save();closeAll();render();checkWins();toast(TOP.status==='planned'?'Planned. Confirm it under Coming up when it moves.':(TOP.dir==='in'?'Taken out of ':'Added to ')+x.name)};

/* ── pay schedule ── */
let PY={};
function openPay(){const p=primary();
 PY=p?{...p}:{freq:'biweekly',anchor:'',day:15,day2:31,wk:'before',amt:'',note:'Paycheck',vary:false};
 $('#payAnchor').value=PY.anchor||'';$('#payD1').value=PY.day||(PY.freq==='monthly'?1:15);$('#payD2').value=PY.day2||31;
 $('#payWk').value=PY.wk&&PY.wk!=='same'?PY.wk:'before';$('#payAmt').value=PY.amt||'';$('#payName').value=PY.note||'Paycheck';
 $('#payVar').checked=!!PY.vary;$('#payLow').value=PY.low||'';
 const legacy=S.rec.filter(r=>r.kind==='income'&&!r.prim&&r.on!==false&&r.freq==='monthly'&&['Paycheck','Tips'].includes(r.cat));
 $('#payReplace').innerHTML=legacy.length?`<label class="chk"><input type="checkbox" id="payRepl" checked><span>Turn off ${plural(legacy.length,'older paycheck schedule')} (${legacy.map(r=>'the '+ord(r.day)).join(', ')})<small>Older versions entered paychecks on fixed days of the month. Keeping both would count your pay twice.</small></span></label>`:'';
 syncPay();show('#shPay')}
function syncPay(){segSet('#payFreq','f',PY.freq);const f=PY.freq,anc=f==='weekly'||f==='biweekly';
 $('#payAnchorW').style.display=anc?'flex':'none';$('#payDaysW').style.display=anc?'none':'grid';
 $('#payD2W').style.display=f==='semimonthly'?'flex':'none';$('#payWkW').style.display=anc?'none':'flex';
 $('#payD1Lab').textContent=f==='semimonthly'?'First payday':'Payday (day of month)';
 $('#payLowW').style.display=$('#payVar').checked?'flex':'none';
 const r=payFromForm(),l=r?occ(r,today(),addD(today(),120),{all:true}).slice(0,4):[];
 $('#payPreview').innerHTML=l.length?`Next paydays: <b>${l.map(d=>fmtD(d,{weekday:'short',month:'short',day:'numeric'})).join(', ')}</b>. That's ${PER_YEAR[f]} paychecks a year.`:(anc?'Pick one real payday to see the schedule.':'')}
function payFromForm(){const f=PY.freq,anc=f==='weekly'||f==='biweekly';
 const r={freq:f,anchor:anc?$('#payAnchor').value:undefined,day:+$('#payD1').value||(f==='monthly'?1:15),day2:+$('#payD2').value||31,wk:anc?'same':$('#payWk').value,on:true};
 if(anc&&!r.anchor)return null;return r}
$('#payFreq').onclick=e=>{const b=e.target.closest('button');if(!b)return;PY.freq=b.dataset.f;syncPay()};
['#payAnchor','#payD1','#payD2','#payWk'].forEach(s=>$(s).addEventListener('input',syncPay));
$('#payVar').onchange=syncPay;
$('#paySave').onclick=()=>{
 const r=payFromForm();if(!r){toast('Pick one real payday');$('#payAnchor').focus();return}
 const amt=+$('#payAmt').value||0;if(!(amt>0)){toast('Add your take-home pay');$('#payAmt').focus();return}
 Object.assign(r,{kind:'income',cat:PY.cat||'Paycheck',note:$('#payName').value.trim()||'Paycheck',amt,vary:$('#payVar').checked||undefined,low:+$('#payLow').value||undefined,prim:true});
 Object.keys(r).forEach(k=>r[k]===undefined&&delete r[k]);
 const p=primary();
 if(p){['anchor','vary','low'].forEach(k=>delete p[k]);Object.assign(p,r)}
 else{S.rec.forEach(x=>delete x.prim);S.rec.push(Object.assign({id:uid(),start:today()},r))}
 const rp=$('#payRepl');if(rp&&rp.checked)S.rec.forEach(x=>{if(x.kind==='income'&&!x.prim&&x.freq==='monthly'&&['Paycheck','Tips'].includes(x.cat))x.on=false});
 save();closeAll();render();toast('Pay schedule saved')};

/* ── balance, buffer, essentials ── */
function openCyc(){
 $('#cBal').value=S.bal&&typeof S.bal.amt==='number'?'':'';$('#cBal').placeholder=S.bal?`was ${money2(S.bal.amt)} on ${fmtD(S.bal.asOf)}`:'e.g. 1240';
 $('#cBuf').value=S.cyc.buf==null?'':S.cyc.buf;$('#cEss').value=S.cyc.ess==null?'':S.cyc.ess;$('#cFunds').checked=S.cyc.funds!==false;revisionCycleFields();
 const e=essDaily();
 $('#cEssHint').textContent=e&&e.src==='history'?`Your logged essentials average ${money(e.v*7)} a week over ${e.win} days. If you enter an estimate too, Gap uses whichever is higher.`
  :e&&e.also&&e.also.src==='history'?`Your logged essentials average ${money(e.also.v*7)} a week. Gap uses the higher of that and your estimate.`
  :'After about three weeks of logging, Gap can work this out from your entries.';
 show('#shCyc')}
$('#cSave').onclick=()=>{
 const b=$('#cBal').value;if(b===''){toast('Re-enter today’s checking balance with the current reserve.');return}if(!Number.isFinite(+b)){toast('Enter a valid balance');return}if(b!==''){S.bal={amt:+b,asOf:today(),ts:Date.now()};S.balanceReviewed=today();}
 const cr=$('#revCard').value;if(cr===''||!Number.isFinite(+cr)||+cr<0){toast('Enter the cash set aside for card purchases you have not paid yet, or zero.');return}
 S.cyc.cardReserve=+cr;S.cyc.confirmed=$('#revCycleOK').checked?today():null;
 const u=$('#cBuf').value;S.cyc.buf=u===''?null:Math.max(+u,0);
 const e=$('#cEss').value;S.cyc.ess=e===''?null:Math.max(+e,0);
 S.cyc.funds=$('#cFunds').checked;
 save();closeAll();render();toast('Saved')};

/* ── explanations ── */
const INFO={
 surplus:['Surplus (your gap)',`<div class="eq">Surplus = income received − fixed spending − variable spending</div>
  <p>Only <b>completed</b> entries count. Scheduled paychecks and bills don't change it until you confirm them.</p>
  <p><b>Refunds</b> lower spending in their category; they aren't income. <b>Transfers</b> (to savings, goals, sinking funds, the tax reserve, or a credit card payment) aren't spending, so they don't lower your surplus.</p>
  <p>Surplus is what was <i>left over</i>. It isn't the same as savings: savings is what you actually moved.</p>`],
 savings:['Actual savings',`<div class="eq">Actual savings = transfers into savings, goals, funds and the tax reserve − money taken back out of them</div>
  <p>Paying a bill out of a sinking fund counts as taking money out, because it leaves the fund.</p>
  <p><b>Allocated</b> money is different: it's planned, not moved yet. It appears as "planned" on goals and funds, and in Coming up until you confirm it.</p>
  <p>Surplus not moved to savings is still in your account, unassigned.</p>`],
 balance:['Checking balance estimate',`<div class="eq">Estimate = balance you entered + entries logged since then</div>
  <p>Gap never connects to your bank. It starts from the balance you type in and adds income and subtracts spending and transfers you log after that.</p>
  <p>Purchases on a credit card don't leave checking until you pay the card, so if you log card purchases, the estimate can run low. That errs on the safe side; updating the balance from your bank now and then keeps it exact.</p>`],
 available:['Available until next payday',`<div class="eq">Available = balance now − unpaid bills and planned transfers before payday − sinking-fund set-asides − essential spending until payday − protective buffer</div>
  <p><b>Balance now</b> is the balance you entered plus what you've logged since.</p>
  <p><b>Bills</b> are scheduled or planned items dated from your balance date up to the day before payday that you haven't confirmed. Anything before your balance date is assumed to be reflected in that balance already.</p>
  <p><b>Essential spending</b> is your daily essentials rate × days until payday. It uses your logged essential spending over up to 60 days, or your weekly estimate, whichever is higher.</p>
  <p><b>Income</b> is never counted before it arrives, including your next paycheck. For income that changes, forecasts use the lowest recent amount.</p>
  <p>If the pay schedule, balance, buffer or essentials estimate is missing, Gap asks for it instead of showing a number.</p>`]};
function openInfo(k){const x=INFO[k];if(!x)return;$('#infoTitle').textContent=x[0];$('#infoBody').innerHTML=x[1];show('#shInfo')}
$('#infoClose').onclick=()=>closeAll();

/* ── essential or discretionary ── */
function openCats(){
 const list=[...allCats('fixed').map(c=>[c,'fixed']),...allCats('variable').map(c=>[c,'variable'])].filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i);
 $('#catList').innerHTML=list.map(([c,t])=>{const e=isEss(c,t);return `<div class="catrow"><span>${esc(c)} <span style="color:var(--tx3);font-size:13px">· ${t}</span></span>
  <div class="seg sm" role="group" aria-label="${esc(c)}"><button data-cat="${esc(c)}" data-e="1" aria-pressed="${e}">Essential</button><button data-cat="${esc(c)}" data-e="0" aria-pressed="${!e}">Optional</button></div></div>`}).join('');
 $$('#catList button').forEach(b=>b.onclick=()=>{S.ess[b.dataset.cat]=+b.dataset.e;save();
  $$(`#catList button[data-cat="${CSS.escape(b.dataset.cat)}"]`).forEach(x=>x.setAttribute('aria-pressed',x===b))});
 show('#shCats')}
$('#catsDone').onclick=()=>{closeAll();render()};

/* ── closing a shortfall: the income side ── */
function openIncome(){
 const C=cycle(),T=monthTot(0),gap=!C.need.length&&C.avail<0?-C.avail:T.gap<0?-T.gap:0;
 const pay=primary(),per=pay?PER_YEAR[pay.freq]/12:0;
 $('#incBody').innerHTML=`${gap?`<p>The gap to close is about <b>${money(gap)}</b>${!C.need.length&&C.avail<0?' before your next payday':' this month'}.</p>`:''}
  <p><b>Right now</b></p>
  <ul style="margin:0 0 12px 18px;display:flex;flex-direction:column;gap:6px">
   <li>Call any company whose bill won't fit before its due date. Ask for a later date, a payment plan, or a hardship program.</li>
   <li>Dial <b>211</b> (or visit 211.org) for local help with rent, utilities and food. Energy bills may qualify for LIHEAP assistance through your state.</li>
   <li>Sell something you no longer use, or pick up a one-off job this week.</li></ul>
  <p><b>Over the next few months</b></p>
  <ul style="margin:0 0 12px 18px;display:flex;flex-direction:column;gap:6px">
   <li>Ask for more hours or shifts, or a raise. At full time, $1 more an hour is about $2,080 a year before taxes.</li>
   <li>Side work that fits your schedule: delivery, tutoring, pet sitting, freelance skills.</li>
   <li>Check what you may qualify for: SNAP, the Earned Income Tax Credit at tax time, employer benefits.</li>
   <li>If you get a large tax refund every year, the IRS Tax Withholding Estimator can show whether adjusting your W-4 would give you more in each paycheck instead.</li></ul>
  <div class="fld"><label for="incRate">If you picked up extra hours, at what hourly pay?</label><input id="incRate" type="number" inputmode="decimal" min="0" placeholder="e.g. 18"></div>
  <p id="incOut" class="foot"></p>`;
 const calc=()=>{const r=+$('#incRate').value;const need=gap||150;
  $('#incOut').innerHTML=r>0?`Closing <b>${money(need)}</b> takes about <b>${Math.ceil(need/(r*.8))} extra hours</b>, assuming roughly 20% goes to taxes.${per?` Spread over ${per>=2?'this month\'s paychecks':'a month'}, that's about ${Math.ceil(need/(r*.8)/Math.max(per,1))} hours per pay period.`:''}`:''};
 $('#incRate').oninput=calc;show('#shIncome')}
$('#incClose').onclick=()=>closeAll();

$('#fab').onclick=()=>{if(V.page==='debts')openDebt(null);else if(V.page==='goals')openGoal(null);else openTx(null)};
$('#fab').setAttribute('aria-label','Add an entry');

/* ══════════ settings ══════════ */
function syncSet(){
 segSet('#thSeg','th',themePref());
 const p=primary();
 $('#setPay').textContent=p?`${money(p.amt)} ${FREQ_L[p.freq]}${p.vary?', varies':''} · next ${fmtD(nextPay(p,today()),{month:'short',day:'numeric'})}`:'Not set';
 $('#setCyc').textContent=[S.bal?`balance ${money(S.bal.amt)} on ${fmtD(S.bal.asOf)}`:'no balance',S.cyc.buf!=null?`buffer ${money(S.cyc.buf)}`:'no buffer',S.cyc.ess!=null?`essentials ${money(S.cyc.ess)}/week`:''].filter(Boolean).join(' · ');
 $('#swWeekly').setAttribute('aria-checked',!!S.weekly);
 $('#weeklyDesc').textContent=S.weekly?'On · the bank file first, the review on Sunday':'Off · you log as you go';
 $('#swTax').setAttribute('aria-checked',!!S.tax.on);
 $('#taxOpts').style.display=S.tax.on?'block':'none';
 $('#taxPct').value=S.tax.rate;$('#taxBiz').checked=!!S.tax.biz;
 $('#taxCats').innerHTML=allCats('income').map(c=>`<label class="chk" style="padding:4px 0"><input type="checkbox" data-tc="${esc(c)}" ${S.tax.cats.includes(c)?'checked':''}><span>${esc(c)}</span></label>`).join('');
 $$('#taxCats input').forEach(i=>i.onchange=()=>{S.tax.cats=$$('#taxCats input').filter(x=>x.checked).map(x=>x.dataset.tc);save();render()});
 $('#swRoute').setAttribute('aria-checked',!!S.prefs.askRoute);
 $('#swMonth').setAttribute('aria-checked',!!S.prefs.monthNudge);
}
$('#setBtn').onclick=()=>{syncSet();show('#shSet')};
$('#setClose').onclick=()=>closeAll();
$('#thSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;setThemePref(b.dataset.th);syncSet()};
$('#setPayBtn').onclick=()=>openPay();
$('#setCycBtn').onclick=()=>openCyc();
$('#setCatsBtn').onclick=()=>openCats();
$('#swTax').onclick=()=>{S.tax.on=!S.tax.on;save();syncSet();render();toast(S.tax.on?'Tax reserve estimate is on':'Tax reserve estimate is off')};
$('#taxPct').onchange=e=>{S.tax.rate=Math.max(0,Math.min(60,+e.target.value||0));save();render()};
$('#taxBiz').onchange=e=>{S.tax.biz=e.target.checked;save();render()};
$('#swRoute').onclick=()=>{S.prefs.askRoute=!S.prefs.askRoute;save();syncSet()};
$('#swMonth').onclick=()=>{S.prefs.monthNudge=!S.prefs.monthNudge;save();syncSet()};

function dl(name,text,mime){const b=new Blob([text],{type:mime});
 const u=URL.createObjectURL(b),a=document.createElement('a');
 a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(u),4000)}
function doExport(){S.lastExport=today();DB.s(KEY,S);
 dl(`befree-gap-${today()}.json`,JSON.stringify(Object.assign({app:'befree-gap',exported:new Date().toISOString()},S),null,1),'application/json');
 closeAll();toast('Backup saved. Keep it somewhere you trust.')}
window.doExport=doExport;
addEventListener('beforeprint',()=>{PRINTING=true;render();PRINTING=false});
$('#prtBtn').onclick=()=>{closeAll();if(V.page!=='overview')go('overview');setTimeout(()=>window.print(),300)};
$('#expJson').onclick=doExport;
$('#expCsv').onclick=()=>{
 /* text that a spreadsheet would read as a formula gets a leading apostrophe */
 const q=s=>{let v=String(s==null?'':s);if(/^[=+\-@\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
 const rows=[['Date','Status','Type','Category','Description','Amount','Refund','Linked to','Scheduled','Payment source','Card','Debt purpose','Principal'].join(',')];
 S.tx.filter(t=>t.status!=='skipped').slice().sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>{
  const sg=t.type==='income'||t.refund||(t.type==='transfer'&&t.dir==='in')?'':'-';
  rows.push([q(t.date),q(t.status||'done'),q(t.type),q(t.cat),q(t.note),sg+Number(t.amt).toFixed(2),q(t.refund?'yes':''),q(linkName(t)),q(t.rid?'yes':'no'),q(t.payFrom||''),q(t.card||''),q(t.debtRole||''),q(t.principal??'')].join(','))});
 rows.push('');rows.push(['Goal','Target','Saved','Planned'].join(','));
 S.goals.forEach(g=>{const b=goalBal(g);rows.push([q(g.name),Number(g.target).toFixed(2),b.saved.toFixed(2),b.plan.toFixed(2)].join(','))});
 rows.push('');rows.push(['Sinking fund','Target','Saved','Due'].join(','));
 S.funds.forEach(f=>rows.push([q(f.name),Number(f.target).toFixed(2),fundBal(f).saved.toFixed(2),q(f.due)].join(',')));
 rows.push('');rows.push(['Debt','Type','Original','Balance','APR','Payment'].join(','));
 S.debts.forEach(d=>rows.push([q(d.name),q(d.kind),Number(d.total||0).toFixed(2),debtBal(d).toFixed(2),Number(d.apr||0).toFixed(2),Number(d.min||0).toFixed(2)].join(',')));
 dl(`befree-gap-${today()}.csv`,'﻿'+rows.join('\r\n'),'text/csv;charset=utf-8');
 toast('Spreadsheet saved')};
$('#impBtn').onclick=()=>$('#impFile').click();
$('#impFile').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>2e7){e.target.value='';toast('That file is too large to be a backup.');return}const r=new FileReader();
 r.onload=async()=>{let d,txt=r.result;
  try{const o=JSON.parse(txt);if(BeFreePlus.isEncrypted(o)){txt=typeof plusUnlock==='function'?await plusUnlock(o):null;if(txt==null)return}}catch(x){}
  try{d=JSON.parse(txt,(k,v)=>k==='__proto__'||k==='constructor'||k==='prototype'?undefined:v);if(!d||typeof d!=='object'||!Array.isArray(d.tx))throw 0;if(d.v&&d.v>5)throw 1}
  catch(x){toast(x===1?'That backup is from a newer version of Gap':'That file is not a BeFree Gap backup');return}
  const onSetup=$('#setup').classList.contains('on');
  if(!onSetup&&S.tx.length&&!await ask('Restore this backup?',`It replaces the ${plural(S.tx.length,'entry','entries')} on this device now with the ${plural(d.tx.length,'entry','entries')} in the file. A copy of the current record is kept on this device.`,'Restore'))return;
  const raw=DB.raw(KEY);if(raw)DB.put('befree.v5.before-restore',raw);
  delete d.app;delete d.exported;
  S=migrate(d,d.v||2);S.setup.done=true;seedGlyphs();save();closeAll();
  $('#setup').classList.remove('on');document.body.classList.remove('locked');
  render();toast('Backup restored');migrNotice()};
 r.readAsText(f);e.target.value=''};
async function doWipeEverything(){
 if(!await ask('Clear everything?','This erases every entry, schedule, goal, fund and debt on this device, including older saved copies. Save a backup first if you might want it. There is no undo.','Erase everything',true))return false;
 ['befree.v5','befree.v5.before-restore','befree.v4','befree.v3','befree.v2','befree.v3.pre-v4','befree.v4.before-restore','befree.bridge.gap.v1','befree.bridge.gap.v2','befree.bridge.inbox.v1'].forEach(k=>DB.d(k));alSet(null);
 S=blankState();closeAll();$('#notices').innerHTML='';startSetup();toast('Cleared');
 return true}
$('#wipeBtn').onclick=doWipeEverything;
window.bfWipeEverything=doWipeEverything;

/* ══════════ milestones ══════════ */
function checkWins(){
 const list=[];
 S.goals.forEach(g=>{if(g.target>0&&goalBal(g).saved>=g.target&&!S.won.includes('g'+g.id)){
  S.won.push('g'+g.id);list.push({k:'Goal reached',n:g.name,amt:money(g.target),
   d:`${money(g.target)} put away, one transfer at a time. Pick where the surplus points next.`})}});
 S.debts.forEach(d=>{if(d.kind!=='due'&&d.total>0&&debtBal(d)<=0.005&&!S.won.includes('d'+d.id)){
  S.won.push('d'+d.id);list.push({k:'Debt closed',n:d.name,amt:money(d.total),
   d:`${money(d.total)} cleared. The ${money(+d.min||0)} payment is yours again, every month from here.`})}});
 if(!list.length)return;save();showWin(list[0])}
function showWin(w){
 $('#winK').textContent=w.k;$('#winN').textContent=w.n;$('#winD').textContent=w.d;
 $('#winSvg').innerHTML=`
  <path d="M16 18V48" stroke="var(--acc)" stroke-width="2.2" stroke-linecap="round" opacity="0" id="wa"/>
  <path d="M304 18V48" stroke="var(--acc)" stroke-width="2.2" stroke-linecap="round" opacity="0" id="wb"/>
  ${[...Array(15)].map((_,i)=>`<path d="M${34+i*18} 28V38" stroke="var(--acc)" stroke-width="1" opacity=".3"/>`).join('')}
  <path d="M16 33H304" stroke="var(--acc)" stroke-width="2" stroke-linecap="round" stroke-dasharray="288" stroke-dashoffset="288" id="wl"/>
  <text x="160" y="64" text-anchor="middle" font-size="12" font-weight="600" fill="var(--acc2)" font-family="'IBM Plex Mono',monospace" opacity="0" id="wc">${esc(w.amt||'')}</text>`;
 lastFocus=document.activeElement;
 $('#win').classList.add('on');document.body.classList.add('locked');
 anim(v=>{const l=$('#wl');if(!l)return;l.setAttribute('stroke-dashoffset',288*(1-v));
  $('#wa').setAttribute('opacity',Math.min(1,v*2));$('#wb').setAttribute('opacity',Math.max(0,(v-.5)*2));
  $('#wc').setAttribute('opacity',Math.max(0,(v-.7)/.3))},900);
 setTimeout(()=>$('#winBtn').focus({preventScroll:true}),120)}
function closeWin(){$('#win').classList.remove('on');document.body.classList.remove('locked');
 render();checkWins();if(lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){}}
$('#winBtn').onclick=closeWin;

/* ══════════ check-in events ══════════
   Entries a person logged themselves, bills they confirmed, money they moved
   and daily reviews, by day. Automatic entries never count. Gap runs on its
   own: nothing is shared with Streak or any other app. */
function gapEvents(){
 const ev={},from=addD(today(),-120);
 S.tx.forEach(t=>{if(!isDone(t)||!['manual','schedule','route'].includes(t.src))return;
  const d=iso(new Date(t.ts||0));if(d<from)return;const e=ev[d]=ev[d]||{};
  if(isSpend(t))e.log=(e.log||0)+1;
  if(t.rid&&(t.type==='fixed'||t.debt)){e.bill=(e.bill||0)+1;e.billRefs=e.billRefs||{};e.billRefs[t.rid]=(e.billRefs[t.rid]||0)+1;}
  if(t.type==='transfer'&&saveSign(t)>0){e.save=(e.save||0)+1;e.saveRefs=e.saveRefs||{};const key=t.goal?'goal:'+t.goal:t.fund?'fund:'+t.fund:null;if(key)e.saveRefs[key]=(e.saveRefs[key]||0)+1;}});
 Object.entries(S.checks||{}).forEach(([d,c])=>{if(d<from)return;const e=ev[d]=ev[d]||{};e.review=1;if(c.t==='nospend')e.nospend=1;if(c.t==='complete')e.complete=1;});
 if(S.balanceReviewed){const e=ev[S.balanceReviewed]=ev[S.balanceReviewed]||{};e.balance=1;}return ev;
}


/* ══════════ notices ══════════ */
function banner(o){
 const el=document.createElement('div');el.className='banner';el.setAttribute('role','status');
 el.innerHTML=`<div class="bt"><div class="b1">${o.b1}</div>${o.b2?`<div class="b2">${o.b2}</div>`:''}</div>
  <div class="ba">${o.action?`<button type="button" class="lnk">${o.action}</button>`:''}
  <button type="button" class="xb" aria-label="Dismiss">
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`;
 $('#notices').appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));
 const kill=()=>{el.classList.remove('on');setTimeout(()=>el.remove(),300)};
 el.querySelector('.xb').onclick=kill;
 const a=el.querySelector('.lnk');if(a)a.onclick=()=>{o.fn&&o.fn();kill()};
 return kill}
function migrNotice(){
 const m=(S.migr||[])[S.migr.length-1];if(!m||m.shown)return false;
 m.shown=true;save();
 banner({b1:'BeFree Gap was updated, and your entries were kept',
  b2:m.notes.map(esc).join('. ')+'. A copy of the earlier record stays on this device.',
  action:primary()?null:'Set pay schedule',fn:()=>openPay()});return true}
function backupNudge(){
 const iosRisk=(/iP(hone|ad|od)/.test(navigator.userAgent)
   ||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))
   &&!(window.navigator.standalone===true||matchMedia('(display-mode: standalone)').matches);
 const n=(S.tx||[]).length; if(n<(iosRisk?1:25)) return false;
 if(!S.lastExport){
  banner({b1:'Your whole record lives on this device only',
   b2:'Saving a backup file takes a couple of seconds and protects every entry. Keep it somewhere you trust.',
   action:'Save a backup',fn:()=>doExport()}); return true}
 const days=diffD(S.lastExport,today());
 if(days>=7){
  banner({b1:`No backup in ${days} days`,
   b2:'If this browser ever clears its storage, the record goes with it. A backup file fixes that.',
   action:'Save a backup',fn:()=>doExport()}); return true}
 return false}
function quietNudge(){
 const ds=(S.tx||[]).filter(t=>isDone(t)&&isSpend(t)&&t.src==='manual').map(t=>t.date).sort();
 if(!ds.length) return false;
 const days=diffD(ds[ds.length-1],today());
 if(days<4||days>45) return false;
 banner({b1:`Nothing logged since ${D(ds[ds.length-1]).toLocaleDateString('en-US',{weekday:'long'})}`,
  b2:'One entry, or a quick "no spending" check, and the picture is accurate again.',
  action:'Log one',fn:()=>openTx(null)}); return true}
function memWarn(){if(!DB.mem)return;
 banner({b1:'This browser is not letting the app save',
  b2:'Everything works, but it clears when you close the tab. Save a backup file from Settings before you go.'})}
/* daily reminder (opt in, Settings): has today got anything logged yet? */
window.__bfReminderCheck=function(){
 const t=today();
 return (S.tx||[]).some(x=>isDone(x)&&x.src==='manual'&&x.date===t)||!!(S.checks&&S.checks[t])};
function remindBanner(){
 if(!remindCheck())return false;
 banner({b1:'Nothing logged yet today',b2:'A minute now keeps the picture accurate.',
  action:'Log one',fn:()=>openTx(null)}); return true}
/* weekly mode: the review beat belongs to the app, not to the reader's memory */
function weeklyBanner(){
 if(!S.weekly)return false;
 const t=today();
 if(S.weeklyShown===t||D(t).getDay()!==0)return false;
 S.weeklyShown=t;save();
 banner({b1:'The ten-minute Sunday review',
  b2:'Catch up from your bank file, then read what is safe to spend until payday.',
  action:'Import a bank file',fn:()=>$('#bankImp').click()});
 return true}
function monthNotice(){
 const key=ym(new Date());
 if(!S.prefs.monthNudge||S.seenMonth===key){S.seenMonth=key;save();return false}
 S.seenMonth=key;save();
 if(!monthHas(1))return false;
 const last=monthTot(1),nm=mk(1).toLocaleString('en-US',{month:'long'});
 banner({b1:`${nm} closed with a ${last.gap>=0?'surplus':'shortfall'} of ${money(Math.abs(last.gap))}`,
  b2:`${money(last.i)} in, ${money(last.out)} spent, ${money(last.sav)} moved to savings. A fresh month starts now.`,
  action:'Look back',fn:()=>{V.range='month';V.off=1;go('overview')}});return true}

/* ══════════ first run ══════════ */
const BILLS=[['Rent',1],['Utilities',4],['Phone',6],['Internet',10],['Car payment',12],
 ['Insurance',8],['Child care',5],['Subscriptions',14]];
const SU={income:0,freq:'biweekly',steady:null,weekly:0,step:1};
function startSetup(){
 $('#suBills').innerHTML=`<div class="bill" style="margin-bottom:6px">
   <div class="bd" style="text-align:left">Bill</div><div class="bd">Amount</div><div class="bd">Day due</div></div>`
  +BILLS.map(([n,d])=>`<div class="bill">
   <label class="bn" for="bill-${n.replace(/\s/g,'')}">${n}${isEss(n,'fixed')?'':' <span class="etag d">Optional</span>'}</label>
   <input id="bill-${n.replace(/\s/g,'')}" data-bill="${n}" type="number" inputmode="decimal" min="0" placeholder="0">
   <input data-day="${n}" type="number" inputmode="numeric" min="1" max="31" value="${d}" aria-label="${n}, day of month it's due"></div>`).join('');
 SU.step=1;stepTo(1);syncSu();
 $('#setup').classList.add('on');document.body.classList.add('locked')}
function stepTo(n){SU.step=n;
 $$('.step').forEach(s=>s.classList.remove('on'));$('#st'+n).classList.add('on');
 $$('.sbar i').forEach((b,i)=>b.classList.toggle('on',i<n));
 $('#setup').scrollTo({top:0,behavior:'auto'});
 setTimeout(()=>{const h=$('#st'+n+' h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}},50)}
function syncSu(){const f=SU.freq,anc=f==='weekly'||f==='biweekly';
 $('#suAnchorW').style.display=anc?'flex':'none';$('#suDaysW').style.display=anc?'none':'grid';
 $('#suD2W').style.display=f==='semimonthly'?'flex':'none';
 $('#suD1Lab').textContent=f==='semimonthly'?'First payday':'Payday (day of month)';
 if(f==='monthly'&&$('#suD1').value==='15')$('#suD1').value='1';
 if(f==='semimonthly'&&$('#suD1').value==='1')$('#suD1').value='15'}
$('#suFreq').onclick=e=>{const b=e.target.closest('button');if(!b)return;SU.freq=b.dataset.f;
 $$('#suFreq .opt').forEach(x=>x.setAttribute('aria-pressed',x===b));syncSu()};
$('#suSteady').onclick=e=>{const b=e.target.closest('button');if(!b)return;SU.steady=+b.dataset.s;
 $$('#suSteady .opt').forEach(x=>x.setAttribute('aria-pressed',x===b))};
$('#suMode').onclick=e=>{const b=e.target.closest('button');if(!b)return;SU.weekly=+b.dataset.w;
 $$('#suMode .opt').forEach(x=>x.setAttribute('aria-pressed',x===b));
 $('#suModeNote').textContent=SU.weekly
  ?'Gap will put Import a bank file first and ask for the review on Sunday. In Streak, start with Weekly money review.'
  :'Either works. You can change it later in Settings.'};
$('#su1').onclick=()=>{
 SU.income=parseFloat($('#suIncome').value)||0;
 if(!SU.income){toast('Add one paycheck to start');$('#suIncome').focus();return}
 const anc=SU.freq==='weekly'||SU.freq==='biweekly';
 SU.anchor=$('#suAnchor').value;
 if(anc&&!SU.anchor){toast('Pick a real payday, recent or upcoming');$('#suAnchor').focus();return}
 SU.d1=Math.max(1,Math.min(31,+$('#suD1').value||(SU.freq==='monthly'?1:15)));SU.d2=Math.max(1,Math.min(31,+$('#suD2').value||31));
 if(SU.steady===undefined||SU.steady===null){
  $('#suSteady').scrollIntoView({block:'center',behavior:reduced()?'auto':'smooth'});
  $('#suSteady').classList.add('needs');toast('Pick one: is your pay the same every time?');
  setTimeout(()=>$('#suSteady').classList.remove('needs'),1800);return}
 stepTo(2)};
$('#su2b').onclick=()=>stepTo(1);
$('#su3b').onclick=()=>stepTo(2);
$('#su4b').onclick=()=>stepTo(3);
$('#su2').onclick=()=>{
 SU.bills=BILLS.map(([n])=>({name:n,
  amt:parseFloat($(`[data-bill="${n}"]`).value)||0,
  day:Math.max(1,Math.min(31,parseInt($(`[data-day="${n}"]`).value)||1))})).filter(b=>b.amt>0);
 stepTo(3)};
$('#su3').onclick=()=>{
 const b=$('#suBal').value;SU.bal=b===''?null:+b;SU.buf=$('#suBuf').value===''?null:Math.max(+$('#suBuf').value,0);
 const inc=SU.income*PER_MONTH[SU.freq],out=sum(SU.bills,b=>b.amt);
 $('#suIn').textContent=money(inc);$('#suOut').textContent=money(out);
 const gap=inc-out;$('#suGap').textContent=money(gap);
 $('#suGap').style.color=gap>=0?'var(--acc2)':'var(--neg)';
 $('#suWord').innerHTML=(gap>=0
  ?`Groceries, gas and everything else come out of that ${money(gap)}. Whatever is left at the end of the month is your surplus, and this app exists to help it grow.`
  :`Your bills run ${money(-gap)} past your pay in a typical month. That's worth knowing now rather than on the 28th, and it isn't a judgment. Gap will show where there's room and where more income would help most.`)
  +(SU.freq==='biweekly'?' Every 2 weeks means two months a year have a third paycheck; the typical month above already spreads that out.':'');
 stepTo(4)};
$('#su4').onclick=()=>{
 S=blankState();S.setup={done:true,demo:false};
 const t=today(),anc=SU.freq==='weekly'||SU.freq==='biweekly';
 S.rec.push({id:uid(),kind:'income',cat:SU.steady?'Paycheck':'Paycheck',note:'Paycheck',amt:SU.income,freq:SU.freq,
  anchor:anc?SU.anchor:undefined,day:anc?undefined:SU.d1,day2:SU.freq==='semimonthly'?SU.d2:undefined,wk:anc?'same':'before',
  on:true,prim:true,vary:SU.steady?undefined:true,start:t});
 S.rec.forEach(r=>Object.keys(r).forEach(k=>r[k]===undefined&&delete r[k]));
 (SU.bills||[]).forEach(b=>S.rec.push({id:uid(),kind:'fixed',cat:b.name,note:b.name,amt:b.amt,freq:'monthly',day:b.day,wk:'same',on:true,start:t}));
 if(SU.bal!=null)S.bal={amt:SU.bal,asOf:t,ts:Date.now()};
 S.cyc.buf=SU.buf;
 S.weekly=!!SU.weekly;
 save();
 $('#setup').classList.remove('on');document.body.classList.remove('locked');
 render();memWarn();
 toast(S.weekly?'You\'re set. Import your bank file when the week is done.':'You\'re set. Tap + to log a purchase.')};
$('#suDemo').onclick=()=>{S=demoState();save();
 $('#setup').classList.remove('on');document.body.classList.remove('locked');
 render();memWarn();toast('Sample numbers loaded. Clear them any time in Settings.')};
$('#suRestore').onclick=()=>$('#impFile').click();

/* ══════════ theme: match device, light or dark ══════════ */
const SUN='M12 3v2M12 19v2M5 12H3M21 12h-2M6 6 4.6 4.6M19.4 19.4 18 18M6 18l-1.4 1.4M19.4 4.6 18 6M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z';
const MOON='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';
const mqDark=matchMedia('(prefers-color-scheme: dark)');
function themePref(){let p=DB.g('befree.gap.theme');if(p==null)p=DB.g('befree.theme');return p==='light'||p==='dark'||p==='system'?p:'system'}
function applyTheme(){const p=themePref(),n=p==='system'?(mqDark.matches?'dark':'light'):p;
 document.documentElement.dataset.theme=n;
 $('#thI').setAttribute('d',n==='dark'?MOON:SUN);
 $('#thBtn').setAttribute('aria-label',n==='dark'?'Switch to light theme':'Switch to dark theme');
 document.querySelector('meta[name=theme-color]').setAttribute('content',n==='dark'?'#011B08':'#E6F1E8')}
function setThemePref(p){DB.s('befree.gap.theme',p);applyTheme();setTimeout(render,60)}
mqDark.addEventListener&&mqDark.addEventListener('change',()=>{if(themePref()==='system'){applyTheme();render()}});
$('#privBtn').onclick=()=>show('#shPriv',true);
$('#privClose').onclick=()=>{syncSet();show('#shSet',true)};
$('#thBtn').onclick=()=>setThemePref(document.documentElement.dataset.theme==='dark'?'light':'dark');

/* ══════════ install and offline ══════════ */
function iconURL(size,mask){
 const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
 const BG='#255A34',CR='#F3E9DA',GD='#EDA335';
 x.fillStyle=BG;x.fillRect(0,0,size,size);
 const k=(mask?0.322:0.42)*size/142.03, cx=size/2-5.74*k, cy=size/2+8.68*k;
 x.save();x.translate(cx,cy);x.scale(k,k);
 x.strokeStyle=CR;x.lineWidth=38.49;x.lineCap='butt';
 x.beginPath();x.arc(0,0,80.755,-0.241725,4.428644,false);x.stroke();
 x.fillStyle=GD;x.beginPath();x.arc(88.29,-94.18,23.19,0,7);x.fill();
 x.restore();
 return c.toDataURL('image/png')}
(async()=>{ try{
 if(!location.protocol.startsWith('http'))throw 0;
 const r=await fetch('manifest.webmanifest',{cache:'no-store'});
 if(r.ok){await r.json();return}
 throw 0;
}catch(e){
 try{
  const mf={name:'Gap',short_name:'Gap',start_url:'.',scope:'.',display:'standalone',
   orientation:'portrait',background_color:'#011B08',theme_color:'#011B08',
   description:'See what is available until payday, and widen the gap between what comes in and what goes out.',
   icons:[{src:iconURL(192),sizes:'192x192',type:'image/png',purpose:'any'},
          {src:iconURL(512),sizes:'512x512',type:'image/png',purpose:'any'},
          {src:iconURL(512,true),sizes:'512x512',type:'image/png',purpose:'maskable'}]};
  document.querySelectorAll('link[rel=manifest]').forEach(l=>l.remove());
  const link=document.createElement('link');link.rel='manifest';
  link.href=URL.createObjectURL(new Blob([JSON.stringify(mf)],{type:'application/manifest+json'}));
  document.head.appendChild(link);
  const ap=document.querySelector('link[rel=apple-touch-icon]')||document.createElement('link');
  ap.rel='apple-touch-icon';ap.href=mf.icons[0].src;document.head.appendChild(ap);
 }catch(x){}
}})();
let deferred=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;
 $('#installBtn').style.display='grid';$('#installBtn').classList.add('hot')});
$('#installBtn').onclick=async()=>{if(!deferred)return;deferred.prompt();
 await deferred.userChoice;deferred=null;$('#installBtn').style.display='none'};
window.addEventListener('appinstalled',()=>{$('#installBtn').style.display='none';
 toast('Added to your home screen. It works with no signal.')});
async function registerSW(){
 /* a service worker must be a real same-origin file next to this page */
 if(window.top!==window.self||!('serviceWorker' in navigator)||!location.protocol.startsWith('http'))return;
 const had=!!navigator.serviceWorker.controller;
 try{const r=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
  r.addEventListener('updatefound',()=>{const w=r.installing;if(!w)return;
   w.addEventListener('statechange',()=>{if(w.state==='activated'&&had)
    banner({b1:'A new version of Gap is ready',b2:'Reload to use it. Your entries are not affected.',action:'Reload',fn:()=>location.reload()})})})}
 catch(e){}
}
registerSW();
window.onStorageLost=()=>{try{memWarn();toast('This browser stopped saving. Back up now.')}catch(e){}};

/* ══════════ last resort ══════════ */
addEventListener('error',ev=>{ if(window.__bfDown)return; window.__bfDown=true;
 try{console.error(ev.error||ev.message)}catch(e){}
 try{const d=document.createElement('div');
  d.setAttribute('role','alert');
  d.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;padding:13px 15px;'
   +'border-radius:12px;background:var(--card2,#fff);border:1px solid var(--neg,#9E472B);'
   +'color:var(--tx,#10231B);font:14px/1.5 Poppins,system-ui,sans-serif;'
   +'box-shadow:0 8px 28px rgba(0,0,0,.18)';
  d.innerHTML='<b>Something went wrong on screen.</b><br>Your saved record is untouched. '
   +'Close this tab and open the app again. If it keeps happening, save a backup first.';
  document.body.appendChild(d)}catch(e){}
});

/* ══════════ boot ══════════ */
let _rz,_rw=innerWidth;addEventListener('resize',()=>{clearTimeout(_rz);_rz=setTimeout(()=>{if(Math.abs(innerWidth-_rw)>20){_rw=innerWidth;render()}},200)},{passive:true});
applyTheme();
if(!S.setup.done&&!S.tx.length){startSetup()}
else{
 S.setup.done=true;
 seedGlyphs();
 save();
 render();
 const shown=migrNotice()||monthNotice();
 memWarn();
 if(!shown&&!weeklyBanner()&&!backupNudge()&&!quietNudge()) remindBanner();
}

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

 var LEAD = '<p>A few taps and Gap sits on your ' + DEV + ' like any other app \u2014 no '
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
   el.setAttribute('aria-label', 'Add Gap to your ' + DEV);
   el.innerHTML =
     '<div class="ic-h"><b>Keep Gap on your ' + DEV + '</b>'
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
   Streak; that value is copied once, and turning the PIN off here stores
   {on:false} so the shared copy can't switch it back on. */
const AL_KEY='befree.gap.applock.v2',AL_OLD='befree.applock.v1';
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
 $('#lockPinSub').textContent='Choose 4 to 6 digits. You’ll need it to open Gap on this device.';
 $('#lockPinLbl').textContent='PIN';
 $('#lockPinA').value='';$('#lockPinErr').textContent='';$('#lockPinGo').textContent='Continue';
}
function alOpenSet(){if(!AL_SUPPORTED)return;alResetSheet();show('#shLockPin')}
if($('#swLock'))$('#swLock').onclick=async()=>{
 if(!AL_SUPPORTED)return;
 if(alGet()){
  if(!await ask('Turn off the PIN?','Anyone who opens Gap on this device will see your data.','Turn off',true))return;
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
  $('#lockPinSub').textContent='Choose 4 to 6 digits. You’ll need it to open Gap on this device.';
  $('#lockPinLbl').textContent='PIN';$('#lockPinErr').textContent='Those don’t match. Try again.';
  $('#lockPinA').focus();return}
 const salt=alRandSalt(),hash=await alHash(v,salt);
 alSet({on:true,hash,salt});
 closeAll();alRefreshRow();toast('PIN set. It protects Gap on this device.');
};
alRefreshRow();


/* Revision 5: transparent inputs, evidence and assumptions. */
function revisionTxFields(){
 let box=$('#revisionTx');if(!box){box=document.createElement('div');box.id='revisionTx';$('#txNote').parentElement.insertAdjacentElement('afterend',box);}
 const expense=isSpend(A),loan=A.debt&&S.debts.find(d=>d.id===A.debt&&d.kind==='loan');
 if(!expense){delete A.payFrom;delete A.card;}if(A.fund||A.debt){delete A.card;A.payFrom='checking';}
 const payment=A.debt&&A.dir!=='in';
 box.innerHTML=(expense&&!payment&&!A.fund?`<div class="fld"><label for="revPayFrom">Paid from</label><select id="revPayFrom"><option value="checking">Checking / debit / cash covered by checking</option><option value="card">Credit card (checking is unchanged)</option></select></div><div class="fld" id="revCardWrap"><label for="revCardLink">Credit card</label><select id="revCardLink"><option value="">Choose a card</option>${S.debts.filter(d=>d.kind==='card').map(d=>`<option value="${esc(d.id)}">${esc(d.name)}</option>`).join('')}</select><small>Add the card under Debts first. Refunds go back to this same card.</small></div>`:'')
 +(payment?`<div class="fld"><label for="revDebtRole">What does this payment cover?</label><select id="revDebtRole"><option value="">Choose a purpose</option><option value="minimum">Required payment on existing debt (reduces the gap)</option><option value="extra">Extra old-debt principal (assigns the gap)</option>${!loan?'<option value="settlement">Settle purchases already recorded (no second expense)</option>':''}</select><small>Split a mixed payment into separate entries. Never record the same dollars as both a purchase and an old-debt minimum.</small></div>`:'')
 +(loan?`<div class="fld"><label for="revPrincipal">Principal applied, from the statement</label><input id="revPrincipal" type="number" min="0" step="0.01" value="${Number.isFinite(A.principal)?A.principal:''}" placeholder="Leave blank if unknown"><small>Interest/fees are not principal. If unknown, the estimated debt balance will not fall until you reconcile it.</small></div>`:'')
 +(A.type==='income'?'<p class="foot">Paycheck: actual take-home deposit. Freelance/side income: actual receipts before your own tax reserve; record business costs separately once. If a platform withheld its fee before depositing, do not deduct that fee again. Do not enter income after subtracting a reserve you will also record as a transfer.</p>':'');
 if($('#revPayFrom')){$('#revPayFrom').value=A.payFrom||'checking';$('#revCardLink').value=A.card||'';$('#revCardWrap').style.display=A.payFrom==='card'?'flex':'none';$('#revPayFrom').onchange=e=>{A.payFrom=e.target.value;delete A.card;revisionTxFields()};$('#revCardLink').onchange=e=>A.card=e.target.value;}
 if($('#revDebtRole')){$('#revDebtRole').value=A.debtRole||'';$('#revDebtRole').onchange=e=>{A.debtRole=e.target.value;};}
 if($('#revPrincipal'))$('#revPrincipal').oninput=e=>A.principal=e.target.value===''?undefined:+e.target.value;
}
function revisionTxValid(v,date){
 if(!Number.isFinite(v)||v<=0){toast('Enter a positive amount.');return false;}
 if((A.status||'done')==='done'&&date>today()){toast('Future entries must stay planned.');return false;}
 if(A.payFrom==='card'&&!S.debts.some(d=>d.kind==='card'&&d.id===A.card)){toast('Choose the card used for this purchase.');return false;}
 if(A.debt&&A.dir!=='in'&&!['minimum','extra','settlement'].includes(A.debtRole)){toast('Choose the payment purpose.');return false;}
 if(A.principal!==undefined&&(!Number.isFinite(A.principal)||A.principal<0||A.principal>v)){toast('Principal must be between zero and the payment amount.');return false;}
 if(A.debt&&A.debtRole==='extra'){A.type='transfer';A.cat='Debt payment';A.dir='out';}
 if(A.debt&&A.debtRole==='minimum'&&A.type==='fixed'){} // Existing loan minimum remains a recurring bill.
 if(S.bal&&!A.edit&&date<S.bal.asOf&&isDone(A)){S.bal=null;S.cyc.confirmed=null;toast('Historical entry added: reconcile checking before using availability.');}
 return true;
}
function revisionCycleFields(){
 let box=$('#revisionCycle');if(!box){box=document.createElement('div');box.id='revisionCycle';$('#cFunds').parentElement.insertAdjacentElement('afterend',box);}
 box.innerHTML=`<div class="fld"><label for="revCard">Cash reserved for recorded card purchases</label><input id="revCard" type="number" min="0" step="0.01" value="${S.cyc.cardReserve==null?'':S.cyc.cardReserve}" placeholder="0 if none"><small>Purchases not yet settled, including those before tracking began. Exclude old-debt minimums already scheduled. Re-enter this reserve whenever you update checking.</small></div><label class="chk"><input type="checkbox" id="revCycleOK"><span>I reviewed pending charges, overdue bills, minimum debt payments, essential costs and taxes for this cycle.</span></label><p class="foot">Use a current available checking balance. Include unrecorded pending debits as planned entries. A reserve is protected cash, not a new expense. After backdating or correcting reconciled entries, reconcile again.</p>`;
 $('#revCycleOK').checked=S.cyc.confirmed===today();
}
function revisionOverview(){
 const host=$('#p-overview');if(!host)return;let box=$('#revisionOverview');
 if(!box){box=document.createElement('section');box.id='revisionOverview';box.className='card c6';
  const grid=$('#g-records')||host.querySelector('.bento');(grid||host).appendChild(box);}
 const m=V.range==='month'?mKey(V.off):null,reviewed=m&&S.reviewed[m],t=tot(pTx()),pending=S.tx.filter(x=>x.needsReview).length;
 const mName=m?fmtD(m+'-01',{month:'long',year:'numeric'}):'';
 box.innerHTML=`<div class="ch"><h2 class="eb">Your records</h2><div class="eb mono">${reviewed?'reviewed':'in progress'}</div></div><p style="margin:0 0 8px">${reviewed?`${mName} is reviewed: its entries were checked against your statements.`:`${m?mName+' is still open, so these':'These'} totals cover only what you have logged so far.`} The surplus is not your checking balance.</p>${pending?`<p class="neg">${pending} older payment entries need a purpose. Edit them in Money, then check your debt and checking balances.</p>`:''}<div class="chk-row"><button class="btn2" id="revCompleteDay">Today's spending is all logged</button>${m?`<button class="btn2" id="revCloseMonth">${reviewed?'Reopen this month':'Close this month'}</button>`:''}<button class="btn2" id="revFI">Financial independence estimate</button></div><p class="foot">Mark a day as logged only after adding cash, debit and card purchases. Save a backup each week and after you close a month.</p>`;
 $('#revCompleteDay').onclick=()=>{S.checks[today()]={t:'complete',ts:Date.now(),src:'gap'};save();render();toast('Spending marked complete for today.');};
 if($('#revCloseMonth'))$('#revCloseMonth').onclick=async()=>{if(S.reviewed[m]){delete S.reviewed[m];save();render();return;}if(m>=today().slice(0,7)){toast('Close this month after it ends; current totals stay provisional.');return;}if(pending){toast('Review legacy payment purposes before closing a month.');return;}if(await ask('Confirm complete month?','Check all income, cash/card purchases, refunds, bills, debt minimums, business costs and transfers against statements. Missing entries make forecasts misleading.','Records checked')){S.reviewed[m]=Date.now();save();render();}};
 $('#revFI').onclick=revisionFI;
}
function revisionFI(){
 let dialog=$('#revisionFIDialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='revisionFIDialog';dialog.style.cssText='max-width:520px;width:90%;padding:24px;border-radius:18px;background:var(--card);color:var(--tx)';document.body.appendChild(dialog);}
 const a=S.fi||{annualSpending:36000,portfolio:0,monthlyInvestment:0,realReturn:4,withdrawalRate:3.5};
 const fields=[['annualSpending','Annual spending to fund, including taxes'],['portfolio','Invested portfolio today (exclude emergency/tax funds)'],['monthlyInvestment','Sustainable actual monthly investment'],['realReturn','Annual real return after fees (%)'],['withdrawalRate','Initial withdrawal assumption (%)']];
 dialog.innerHTML='<h2>FI scenario, in today’s dollars</h2><p>Educational estimate. Returns vary, losses occur, and taxes, fees, future spending and withdrawal risk matter. This is not a promised retirement date.</p>'+fields.map(([k,l])=>`<div class="fld"><label for="fi-${k}">${l}</label><input id="fi-${k}" type="number" step="any" value="${a[k]}"></div>`).join('')+'<p>Examples are editable assumptions. Savings transfers, tax reserves and extra debt payments are not investment contributions. Enter investments you can sustain.</p><button class="btn2" id="fiCalc">Calculate scenarios</button><div id="fiResult" aria-live="polite"></div><button class="btn2" id="fiClose">Close</button>';
 $('#fiClose').onclick=()=>dialog.close();$('#fiCalc').onclick=()=>{try{const input=Object.fromEntries(fields.map(([k])=>[k,+$('#fi-'+k).value]));const result=BeFreeFinance.fi(input);S.fi=input;save();$('#fiResult').innerHTML=`<p>Target portfolio: <b>${money(result.target)}</b>. Estimated time: <b>${result.years===null?'not reached within 100 years':result.years+' years'}</b>.</p><p>Return sensitivity, holding spending and contributions constant:</p>`+[0,2,4,6].map(r=>{const x=BeFreeFinance.fi({...input,realReturn:r});return `<p>${r}% real return: ${x.years===null?'not reached in 100 years':x.years+' years'}</p>`;}).join('')+'<p>End-of-month contributions, constant purchasing power, no volatility model. A withdrawal percentage is an assumption, not a guarantee.</p>';}catch(e){$('#fiResult').textContent=e.message;}};
 dialog.showModal();
}


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
/* I2 - Insights is three groups, not eight screens. Where you stand keeps
   its place above them, so the gap number and both bars are the first thing
   on the page whichever group is open. */
let OVG='month';
function setGroup(g){
 OVG=g;
 ['month','trends','records'].forEach(k=>{const el=$('#g-'+k);if(el)el.hidden=k!==g});
 $$('#ovSeg button').forEach(b=>b.setAttribute('aria-selected',b.dataset.g===g?'true':'false'));
 render();
}
if($('#ovSeg'))$('#ovSeg').onclick=e=>{const b=e.target.closest('button');if(b)setGroup(b.dataset.g)};

/* I1 - Today opens on four things: what is safe to spend, what is coming,
   the one next step, and the button that logs a purchase. */
if($('#todayTog'))$('#todayTog').onclick=()=>{
 const box=$('#moreToday'),open=box.hidden;
 box.hidden=!open;
 $('#todayTog').setAttribute('aria-expanded',open?'true':'false');
 $('#todayTog').textContent=open?'Show less':'Show more';
 if(open)box.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'nearest'});
};
if($('#swWeekly'))$('#swWeekly').onclick=()=>{
 S.weekly=!S.weekly;save();syncSet();render();
 toast(S.weekly?'Weekly mode on. Import your bank file when the week is done.':'Weekly mode off. Log as you go.')};

/* the reliable half: once a day, once per app open, only if there is
   really nothing logged yet today */
function remindCheck(){
 if(!S.prefs||!S.prefs.reminder)return false;
 if(S.remindShown===today())return false;
 if(typeof window.__bfReminderCheck!=='function'||window.__bfReminderCheck())return false;
 S.remindShown=today();save();
 return true;
}



INFO.surplus=['Gap and assignments','<p>Gap = received income minus recorded living costs and required payments on existing debt. Planned entries do not count. Purchase refunds reduce spending. Extra debt payments and net transfers to savings, funds, investments and tax reserves assign the gap. Settlement of already-recorded card purchases is not a second expense.</p><p>Whatever is left after that has no job yet. It can be negative, which means some of the money you gave a job came from earlier savings or a card. Your checking balance is a separate number.</p>'];
INFO.savings=['Assigned cash','<p>Net transfers into savings, goals, sinking funds, tax reserves and investments, less withdrawals or spending from funds. Extra debt is shown separately. A tax reserve is an obligation, and a sinking fund is planned future spending; neither is investment growth.</p>'];
INFO.balance=['Checking estimate','<p>Starts with your current available checking balance. New checking transactions change it; card purchases do not. Paying a card reduces checking. Reconcile after backdated entries or changes to records already included in a balance. Physical cash is assumed covered by the checking figure; adjust for withdrawals so cash is not counted twice.</p>'];
INFO.available=['Protected room until payday','<p>Checking estimate minus unpaid bills, planned transfers, essential spending, sinking-fund set-asides, protective buffer, the cash set aside for card purchases you have not paid yet, and the estimated tax-reserve shortfall. Expected income is excluded until received. Review overdue obligations, pending charges and that card cash today before using this estimate.</p><p>Do not treat it as permission to spend. Unknown obligations or incomplete records can make it too high. Only allocate within the protected amount. Extra debt payments must also fit the lender’s rules.</p>'];
