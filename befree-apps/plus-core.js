/* BeFree additions: pure helpers shared by Gap, Streak and tests.
   Nothing here touches the page or storage. Dates are local YYYY-MM-DD strings. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.BeFreePlus=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const pad=n=>String(n).padStart(2,'0');
 const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
 const D=s=>new Date(s+'T00:00:00');
 const addD=(s,n)=>{const d=D(s);d.setDate(d.getDate()+n);return iso(d)};
 const round=n=>Math.round((n+Number.EPSILON)*100)/100;

 /* ── bank files ──────────────────────────────────────────────
    US banks export CSV (Chase, Bank of America, Wells Fargo, Capital One,
    Citi, Discover, Amex…) or OFX/QFX. Both are read here on the device;
    nothing is uploaded. Amounts come back signed: + money in, − money out. */
 function csvRows(text){
  text=String(text||'').replace(/^\uFEFF/,'');
  const first=text.split(/\r?\n/).find(l=>l.trim())||'';
  const cnt=c=>(first.match(new RegExp('\\'+c,'g'))||[]).length;
  const delim=[',',';','\t'].sort((a,b)=>cnt(b)-cnt(a))[0];
  const rows=[];let row=[],cell='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
   if(q){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else q=false}else cell+=c;continue}
   if(c==='"'){q=true;continue}
   if(c===delim){row.push(cell);cell='';continue}
   if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';continue}
   cell+=c}
  if(cell!==''||row.length){row.push(cell);rows.push(row)}
  return rows.map(r=>r.map(x=>x.trim())).filter(r=>r.some(x=>x!==''))}
 function parseAmount(v){
  if(v==null)return null;let s=String(v).trim();if(!s)return null;
  let neg=false;
  if(/^\(.*\)$/.test(s)){neg=true;s=s.slice(1,-1)}
  if(/-$/.test(s)){neg=true;s=s.slice(0,-1)}
  if(/\s*CR$/i.test(s))s=s.replace(/\s*CR$/i,'');
  else if(/\s*DR$/i.test(s)){neg=true;s=s.replace(/\s*DR$/i,'')}
  s=s.replace(/[$,\s]/g,'');
  if(s.startsWith('-')){neg=!neg;s=s.slice(1)}else if(s.startsWith('+'))s=s.slice(1);
  if(!/^\d*\.?\d+$/.test(s))return null;
  const n=parseFloat(s);return neg?-n:n}
 function parseDate(v){
  const s=String(v||'').trim();let m;
  if((m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)))return ok(+m[1],+m[2],+m[3]);
  if((m=s.match(/^(\d{4})(\d{2})(\d{2})/)))return ok(+m[1],+m[2],+m[3]);
  if((m=s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/))){let y=+m[3];if(y<100)y+=2000;return ok(y,+m[1],+m[2])}
  return null;
  function ok(y,mo,d){if(mo<1||mo>12||d<1||d>31||y<1990||y>2100)return null;const x=new Date(y,mo-1,d);return x.getMonth()===mo-1?iso(x):null}}
 const H={
  date:[/^(transaction|trans\.?)\s*date$/i,/^date$/i,/^(posting|posted|post)\s*date$/i,/^date posted$/i,/date/i],
  desc:[/^description$/i,/^(payee|merchant|merchant name)$/i,/^name$/i,/^(transaction )?description/i,/^memo$/i,/^details$/i],
  amount:[/^(transaction )?amount$/i,/^amount \(usd\)$/i,/amount/i],
  debit:[/^debit(s)?$/i,/^withdrawal(s)?$/i,/^(money out|charges?|debit amount)$/i],
  credit:[/^credit(s)?$/i,/^deposit(s)?$/i,/^(money in|payments?|credit amount)$/i],
  ref:[/^(reference|ref(erence)? ?(no|number|#)?|transaction id|check or slip #|check number)$/i]};
 function pick(hdr,list,skip){for(const re of list){const i=hdr.findIndex((h,k)=>!(skip||[]).includes(k)&&re.test(h)&&!/balance/i.test(h));if(i>=0)return i}return -1}
 function fromCSV(text){
  const rows=csvRows(text);if(!rows.length)return{rows:[],error:'The file is empty.'};
  let hi=-1,map=null;
  for(let i=0;i<Math.min(rows.length,20);i++){const h=rows[i];
   const d=pick(h,H.date),a=pick(h,H.amount),db=pick(h,H.debit),cr=pick(h,H.credit);
   if(d>=0&&(a>=0||db>=0||cr>=0)&&!parseDate(h[d])){hi=i;map={d,a,db,cr,desc:pick(h,H.desc,[d,a,db,cr]),ref:pick(h,H.ref)};break}}
  if(!map){ /* no header (Wells Fargo): find the date, amount and text columns from the data */
   const body=rows.filter(r=>r.length>=2),n=Math.max(...body.map(r=>r.length));const score=f=>[...Array(n).keys()].map(c=>body.filter(r=>f(r[c])).length);
   const ds=score(x=>!!parseDate(x)),as=score(x=>parseAmount(x)!==null&&!parseDate(x)),ts=[...Array(n).keys()].map(c=>body.reduce((s,r)=>s+((r[c]||'').replace(/[\d\s.,$*-]/g,'').length),0));
   const d=ds.indexOf(Math.max(...ds)),a=as.indexOf(Math.max(...as.map((v,i)=>i===d?-1:v))),desc=ts.indexOf(Math.max(...ts));
   if(ds[d]<body.length*0.6||as[a]<body.length*0.6)return{rows:[],error:'Could not find the date and amount columns in this file.'};
   map={d,a,db:-1,cr:-1,desc,ref:-1};hi=-1}
  const out=[];let bad=0;
  rows.slice(hi+1).forEach(r=>{const date=parseDate(r[map.d]);let amt=null;
   if(map.a>=0)amt=parseAmount(r[map.a]);
   else{const db=parseAmount(r[map.db]),cr=parseAmount(r[map.cr]);if(db!==null||cr!==null)amt=(cr?Math.abs(cr):0)-(db?Math.abs(db):0)}
   if(!date||amt===null){if(r.some(x=>x))bad++;return}
   const desc=(map.desc>=0?r[map.desc]:'')||'';
   out.push({date,amt:round(amt),desc:desc.replace(/\s+/g,' ').trim(),ref:map.ref>=0?r[map.ref]||'':''})});
  return{rows:out,skipped:bad,format:'csv'}}
 function fromOFX(text){
  const out=[];const blocks=String(text).split(/<STMTTRN>/i).slice(1);
  const tag=(b,t)=>{const m=b.match(new RegExp('<'+t+'>([^<\\r\\n]*)','i'));return m?m[1].trim():''};
  blocks.forEach(b=>{const date=parseDate(tag(b,'DTPOSTED')||tag(b,'DTUSER')),amt=parseAmount(tag(b,'TRNAMT'));
   if(!date||amt===null)return;
   const name=tag(b,'NAME'),memo=tag(b,'MEMO');
   out.push({date,amt:round(amt),desc:(name&&memo&&!memo.includes(name)?name+' '+memo:name||memo).replace(/&amp;/g,'&').replace(/\s+/g,' ').trim(),ref:tag(b,'FITID')})});
  return{rows:out,skipped:0,format:'ofx'}}
 function readBankFile(text,name){
  const t=String(text||'');
  if(/<OFX>|OFXHEADER|<STMTTRN>/i.test(t)||/\.(ofx|qfx|qbo)$/i.test(name||''))return fromOFX(t);
  return fromCSV(t)}

 /* best guess only; every imported row can be changed before and after import */
 const RULES=[
  [/\b(atm|cash) ?(withdrawal|w\/d|wd)\b|\batm\b/i,{type:'variable',cat:'Other',skip:'Cash withdrawal: log what the cash paid for instead, so it is not counted twice.'}],
  [/afterpay|klarna|affirm|sezzle|zip\.co|quadpay|pay ?in ?4/i,{type:'fixed',cat:'Debt minimum',bnpl:true}],
  [/credit ?card|card ?(pmt|payment)|payment to .*card|card ending|crd ?(pmt|epay)|cc ?(pmt|payment)|chase credit|capital one.*(pmt|payment|mobile pymt)|amex|american express|discover.*(pmt|payment)|citi.*(pmt|payment|autopay)|synchrony|barclaycard|bank of america.*(pmt|payment)/i,{type:'transfer',cat:'Card payment',review:true}],
  [/irs\b|usataxpymt|dept of revenue|franchise tax|tax ?pymt/i,{type:'fixed',cat:'Estimated income tax'}],
  [/student ?loan|navient|nelnet|sallie ?mae|mohela|aidvantage|great lakes|mortgage|mr\.? ?cooper|rocket mortgage|lendingclub|upstart|sofi loan|personal loan/i,{type:'fixed',cat:'Loan payment',review:true}],
  [/auto ?loan|car ?payment|toyota (motor )?(fin|credit)|honda fin|ally auto|gm financial|ford credit|santander consumer|capital one auto|westlake|credit acceptance/i,{type:'fixed',cat:'Car payment'}],
  [/\brent\b|apartment|property mgmt|property management|leasing office|realty/i,{type:'fixed',cat:'Rent'}],
  [/electric|energy|\bpower\b|water|sewer|trash|waste mgmt|pg&e|con ?ed|duke energy|xcel|comed|dominion|georgia power|fpl|utility|utilities|national grid|socalgas|peoples gas/i,{type:'fixed',cat:'Utilities'}],
  [/verizon|at&t|\batt\b|t-?mobile|sprint|cricket|metro ?by|metropcs|mint mobile|visible|boost mobile|straight talk|us cellular|google fi/i,{type:'fixed',cat:'Phone'}],
  [/comcast|xfinity|spectrum|charter comm|cox comm|centurylink|frontier comm|optimum|google fiber|starlink|brightspeed|earthlink/i,{type:'fixed',cat:'Internet'}],
  [/geico|progressive|state ?farm|allstate|liberty mutual|insurance|usaa ins|farmers ins|nationwide|lemonade|root ins/i,{type:'fixed',cat:'Insurance'}],
  [/daycare|day care|child ?care|kindercare|bright horizons|preschool/i,{type:'fixed',cat:'Child care'}],
  [/netflix|spotify|hulu|disney ?(\+|plus)|hbo|\bmax\.com|apple\.com\/bill|itunes|youtube ?premium|youtube ?tv|amazon prime|prime video|paramount|peacock|audible|sirius|icloud|google ?storage|microsoft ?365|adobe|dropbox|chatgpt|openai|patreon|planet fitness|la fitness|gym/i,{type:'fixed',cat:'Subscriptions'}],
  [/acorns|stash|betterment|wealthfront|robinhood|fidelity|vanguard|schwab|e\*?trade|webull|m1 finance|coinbase/i,{type:'transfer',cat:'Investing'}],
  [/to sav(ings)?|savings transfer|transfer to .*sav|ally bank|marcus|capital one 360|sofi sav|discover sav|amex sav|chime sav/i,{type:'transfer',cat:'Savings'}],
  [/instacart|kroger|safeway|whole ?foods|trader ?joe|aldi|publix|wegmans|h-e-b|\bheb\b|food lion|giant eagle|stop ?& ?shop|albertsons|vons|ralphs|meijer|winco|sprouts|fry'?s food|harris teeter|hy-?vee|piggly|smart ?& ?final|grocery|market basket|save a lot|food 4 less|shoprite|costco|sam'?s club|bj'?s wholesale|food ?city|ingles|jewel|king soopers|shaw'?s|hannaford|foodmaxx|99 ranch|h ?mart|fresh market/i,{type:'variable',cat:'Groceries'}],
  [/shell|chevron|exxon|mobil\b|\bbp\b|speedway|sunoco|marathon|valero|citgo|circle ?k|wawa|sheetz|quiktrip|\bqt\b|racetrac|love'?s|pilot|flying j|casey'?s|7-?eleven|arco|\b76\b|phillips ?66|conoco|kum ?& ?go|murphy (usa|oil)|gas station|\bfuel\b|holiday stationstores/i,{type:'variable',cat:'Gas'}],
  [/doordash|uber ?eats|grubhub|postmates|mcdonald|starbucks|chipotle|subway|wendy|burger king|taco bell|chick-?fil-?a|domino|pizza|dunkin|panera|kfc|popeyes|sonic drive|arby|five guys|panda express|jack in the box|whataburger|in-n-out|culver|dairy queen|ihop|denny|applebee|olive garden|chili'?s|buffalo wild|restaurant|\bcafe\b|coffee|\bgrill\b|diner|sushi|taqueria|bakery|bar ?& ?grill|\btst\*|\bsq \*/i,{type:'variable',cat:'Dining out'}],
  [/cvs|walgreens|rite ?aid|pharmacy|medical|clinic|hospital|dental|dentist|doctor|urgent ?care|optometr|vision center|labcorp|quest diag|kaiser|copay/i,{type:'variable',cat:'Health'}],
  [/autozone|o'?reilly|advance auto|napa auto|jiffy lube|valvoline|firestone|pep boys|midas|meineke|discount tire|tire|car ?wash|\bdmv\b|auto repair|mechanic/i,{type:'variable',cat:'Car maintenance'}],
  [/amc |regal|cinemark|ticketmaster|stubhub|seatgeek|steam(games|powered)?|playstation|xbox|nintendo|fandango|bowling|topgolf|dave ?& ?buster|live nation/i,{type:'variable',cat:'Entertainment'}],
  [/overdraft|\bnsf\b|service (fee|charge)|monthly (maintenance )?fee|maintenance fee|atm fee|late fee|interest charge|finance charge|annual fee|foreign transaction|returned item/i,{type:'variable',cat:'Interest and fees'}],
  [/hallmark|1-800-flowers|gift ?card|edible arrangements/i,{type:'variable',cat:'Gifts'}],
  [/amazon|amzn|walmart|wal-mart|target|best ?buy|home ?depot|lowe'?s|ikea|etsy|ebay|tj ?maxx|marshalls|\bross\b|kohl'?s|macy'?s|nordstrom|old navy|shein|temu|dollar tree|dollar general|family dollar|five below|wayfair|apple store|nike|burlington|big lots|michaels|hobby lobby|petsmart|petco|chewy/i,{type:'variable',cat:'Shopping'}],
  [/zelle|venmo|cash ?app|paypal|apple cash/i,{type:'variable',cat:'Other',review:true}],
  [/transfer|xfer/i,{type:'transfer',cat:'Between accounts',review:true}]];
 const IN_RULES=[
  [/payroll|direct ?dep|dir ?dep|salary|\bpay ?check|\badp\b|gusto|paychex|intuit ?payroll|trinet|workday|paylocity|justworks|rippling|employer/i,{type:'income',cat:'Paycheck'}],
  [/doordash|uber|lyft|instacart|grubhub|shipt|amazon flex|spark driver|upwork|fiverr|etsy|ebay|stripe|square|shopify/i,{type:'income',cat:'Side income'}],
  [/ssa|social security|unemployment|\bui\b benefit|snap|ebt|va benefit|treas 310|dept of labor/i,{type:'income',cat:'Benefits'}],
  [/irs treas|tax ref|state of .* tax|tax refund/i,{type:'income',cat:'Other',note:'Tax refund'}],
  [/refund|return|reversal|credit adj/i,{type:'variable',cat:'Other',refund:true}],
  [/interest (paid|earned|payment)|dividend/i,{type:'income',cat:'Other'}],
  [/transfer from|from sav|xfer from|online transfer|zelle|venmo|cash ?app|paypal/i,{type:'transfer',cat:'Between accounts',dir:'in',review:true}]];
 function guess(desc,amt,account){
  const d=String(desc||'');
  if(account==='card'){
   if(amt>0){if(/payment|autopay|thank ?you|pymt|epay/i.test(d))return{type:'transfer',cat:'Card payment',skip:'A payment to this card. Record card payments from your checking file instead.'};
    return{type:'variable',cat:'Other',refund:true}}
   for(const [re,g] of RULES){if(re.test(d)&&g.type!=='transfer'&&!g.skip)return Object.assign({},g)}
   return{type:'variable',cat:'Other'}}
  if(amt>0){for(const [re,g] of IN_RULES)if(re.test(d))return Object.assign({},g);return{type:'income',cat:'Other'}}
  for(const [re,g] of RULES)if(re.test(d))return Object.assign({},g);
  return{type:'variable',cat:'Other'}}
 /* a row that matches an entry already in the ledger: same amount, within two days */
 function isDuplicate(row,existing){const a=Math.abs(row.amt);
  return existing.some(t=>(row.ref&&t.ext===row.ref)||(Math.abs((+t.amt||0)-a)<0.005&&Math.abs((D(t.date)-D(row.date))/864e5)<=2))}

 /* ── paychecks ─────────────────────────────────────────────── */
 /* months holding more paydays than usual: 3 for every-two-weeks pay, 5 for weekly */
 function extraPayMonths(dates,freq){const base=freq==='weekly'?4:freq==='biweekly'?2:null;if(!base)return[];
  const by={};dates.forEach(d=>{(by[d.slice(0,7)]=by[d.slice(0,7)]||[]).push(d)});
  return Object.keys(by).sort().filter(m=>by[m].length>base).map(m=>({month:m,dates:by[m].sort(),extra:by[m].sort().slice(base)}))}

 /* ── estimated tax (Form 1040-ES) ───────────────────────────
    Four payment periods; a due date on a weekend or a DC legal holiday
    moves to the next business day. Always confirm at irs.gov. */
 function nthWeekday(y,m,wd,n){const d=new Date(y,m,1);const off=(wd-d.getDay()+7)%7;return iso(new Date(y,m,1+off+7*(n-1)))}
 function holidays(y){const h=new Set();
  const obs=(s)=>{const d=D(s),w=d.getDay();return w===6?addD(s,-1):w===0?addD(s,1):s};
  h.add(obs(`${y}-01-01`));h.add(nthWeekday(y,0,1,3));h.add(obs(`${y}-04-16`));h.add(obs(`${y}-06-19`));h.add(obs(`${y}-07-04`));h.add(nthWeekday(y,8,1,1));
  return h}
 function businessDay(s){const y=+s.slice(0,4);let hs=holidays(y);let d=s;
  for(let i=0;i<10;i++){const w=D(d).getDay();if(w!==0&&w!==6&&!hs.has(d))return d;d=addD(d,1);if(+d.slice(0,4)!==y)hs=holidays(+d.slice(0,4))}return d}
 function quarterlyDue(y){
  return[{q:1,from:`${y}-01-01`,to:`${y}-03-31`,due:businessDay(`${y}-04-15`)},{q:2,from:`${y}-04-01`,to:`${y}-05-31`,due:businessDay(`${y}-06-15`)},
   {q:3,from:`${y}-06-01`,to:`${y}-08-31`,due:businessDay(`${y}-09-15`)},{q:4,from:`${y}-09-01`,to:`${y}-12-31`,due:businessDay(`${y+1}-01-15`)}]}

 /* ── employer retirement match ───────────────────────────────
    tiers: [{rate:100,upTo:3},{rate:50,upTo:2}] = 100% of the first 3% of pay,
    then 50% of the next 2%. */
 function match401k({salary,pct,tiers}){
  salary=Math.max(0,+salary||0);pct=Math.max(0,+pct||0);tiers=(tiers||[]).filter(t=>+t.rate>0&&+t.upTo>0);
  let cum=0,now=0,max=0;
  tiers.forEach(t=>{const band=+t.upTo;now+=(+t.rate/100)*Math.min(Math.max(pct-cum,0),band)*salary/100;max+=(+t.rate/100)*band*salary/100;cum+=band});
  return{employer:round(now),max:round(max),missing:round(Math.max(max-now,0)),needPct:round(cum),yours:round(pct*salary/100)}}

 /* ── credit use ─────────────────────────────────────────────── */
 function utilization(bal,limit){bal=Math.max(0,+bal||0);limit=+limit||0;if(limit<=0)return null;const p=bal/limit*100;
  return{pct:round(p),band:p<10?'low':p<30?'moderate':'high'}}

 /* ── buy now, pay later ─────────────────────────────────────── */
 function installmentDates(first,freq,n){const out=[];n=Math.max(0,Math.floor(+n||0));
  for(let i=0;i<n;i++){if(freq==='monthly'){const d=D(first);const day=d.getDate();const x=new Date(d.getFullYear(),d.getMonth()+i,1);x.setDate(Math.min(day,new Date(x.getFullYear(),x.getMonth()+1,0).getDate()));out.push(iso(x))}
   else out.push(addD(first,(freq==='weekly'?7:14)*i))}
  return out}

 /* ── calendar file (RFC 5545), all-day events ─────────────── */
 function icsText(s){return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n')}
 function icsFold(line){const out=[];let cur='',len=0;
  for(const ch of line){const b=new TextEncoder().encode(ch).length;if(len+b>(out.length?74:75)){out.push(cur);cur='';len=0}cur+=ch;len+=b}
  out.push(cur);return out.join('\r\n ')}
 function buildICS(events,opt){opt=opt||{};const stamp=(opt.now||new Date()).toISOString().replace(/[-:]/g,'').replace(/\.\d+Z$/,'Z');
  const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//BeFree//Gap//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:'+icsText(opt.name||'BeFree Gap')];
  events.forEach(e=>{const d=e.date.replace(/-/g,''),n=addD(e.date,1).replace(/-/g,'');
   L.push('BEGIN:VEVENT','UID:'+icsText(e.uid),'DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+d,'DTEND;VALUE=DATE:'+n,'SUMMARY:'+icsText(e.title),'TRANSP:TRANSPARENT');
   if(e.desc)L.push('DESCRIPTION:'+icsText(e.desc));
   if(e.alarm)L.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsText(e.title),'TRIGGER:-P'+(+e.alarm)+'D','END:VALARM');
   L.push('END:VEVENT')});
  L.push('END:VCALENDAR');return L.map(icsFold).join('\r\n')+'\r\n'}

 /* ── encrypted backups ──────────────────────────────────────
    PBKDF2-SHA-256 (600,000 rounds) derives an AES-256-GCM key from the
    passphrase. The passphrase is never stored; without it the file cannot
    be opened by anyone, including us. */
 const ITER=600000;
 const b64=u=>{let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
 const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 const subtle=()=>{const c=globalThis.crypto;if(!c||!c.subtle)throw new Error('Encryption is not available in this browser.');return c.subtle};
 async function keyFrom(pass,salt,iter){const s=subtle();
  const base=await s.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);
  return s.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
 async function encryptBackup(plain,pass,app,opt){
  if(String(pass||'').length<8)throw new Error('Use a passphrase of at least 8 characters.');
  const iter=(opt&&opt.iter)||ITER,salt=globalThis.crypto.getRandomValues(new Uint8Array(16)),iv=globalThis.crypto.getRandomValues(new Uint8Array(12));
  const ct=new Uint8Array(await subtle().encrypt({name:'AES-GCM',iv},await keyFrom(pass,salt,iter),new TextEncoder().encode(plain)));
  return JSON.stringify({befree:'encrypted-backup',v:1,app,created:new Date().toISOString(),kdf:'PBKDF2-SHA256',iter,cipher:'AES-256-GCM',salt:b64(salt),iv:b64(iv),data:b64(ct)})}
 function isEncrypted(o){return !!(o&&typeof o==='object'&&o.befree==='encrypted-backup'&&o.data&&o.salt&&o.iv)}
 async function decryptBackup(o,pass){
  if(typeof o==='string')o=JSON.parse(o);
  if(!isEncrypted(o))throw new Error('This is not an encrypted BeFree backup.');
  try{const pt=await subtle().decrypt({name:'AES-GCM',iv:unb64(o.iv)},await keyFrom(pass,unb64(o.salt),+o.iter||ITER),unb64(o.data));return new TextDecoder().decode(pt)}
  catch(e){throw new Error('That passphrase does not open this file.')}}

 return{csvRows,parseAmount,parseDate,readBankFile,guess,isDuplicate,extraPayMonths,quarterlyDue,businessDay,holidays,match401k,utilization,installmentDates,buildICS,encryptBackup,decryptBackup,isEncrypted,ITER};
});
