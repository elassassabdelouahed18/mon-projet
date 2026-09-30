/* Additions: bank files, paychecks, estimated tax dates, employer match,
   calendar export, pay-later plans, encrypted backups, Streak standalone. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const P=require('../befree-apps/plus-core.js'),F=require('../befree-apps/finance-core.js');
let count=0;const tests=[];function test(n,fn){tests.push([n,fn])}

test('Chase checking CSV: dates, signed amounts, categories',()=>{
 const r=P.readBankFile(`Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #,
DEBIT,09/26/2026,"KROGER #123",-54.21,DEBIT_CARD,1234.55,,
CREDIT,09/25/2026,"ACME PAYROLL PPD",1450.00,ACH_CREDIT,1288.76,,
DEBIT,09/24/2026,"Payment to Chase card ending in 1234",-200.00,LOAN_PMT,0,,`,'chase.csv');
 assert.deepEqual(r.rows.map(x=>[x.date,x.amt]),[['2026-09-26',-54.21],['2026-09-25',1450],['2026-09-24',-200]]);
 assert.equal(P.guess(r.rows[0].desc,r.rows[0].amt,'checking').cat,'Groceries');
 assert.deepEqual(P.guess(r.rows[1].desc,r.rows[1].amt,'checking'),{type:'income',cat:'Paycheck'});
 assert.equal(P.guess(r.rows[2].desc,r.rows[2].amt,'checking').cat,'Card payment')});
test('Capital One card CSV with debit and credit columns',()=>{
 const r=P.readBankFile(`Transaction Date,Posted Date,Card No.,Description,Category,Debit,Credit
2026-09-20,2026-09-21,1234,SHELL OIL 57444,Gas,41.02,
2026-09-19,2026-09-20,1234,CAPITAL ONE MOBILE PYMT,Payment,,300.00`,'c1.csv');
 assert.deepEqual(r.rows.map(x=>x.amt),[-41.02,300]);
 assert.ok(P.guess(r.rows[1].desc,300,'card').skip,'card payment on the card file is skipped')});
test('Wells Fargo CSV without a header row',()=>{
 const r=P.readBankFile(`"09/22/2026","-12.99","*","","SPOTIFY USA"\n"09/20/2026","-1180.00","*","","CHECK 1043 RENT"`,'wf.csv');
 assert.deepEqual(r.rows.map(x=>[x.amt,x.desc]),[[-12.99,'SPOTIFY USA'],[-1180,'CHECK 1043 RENT']])});
test('OFX/QFX transactions keep their bank IDs for de-duplication',()=>{
 const r=P.readBankFile('<OFX><STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20260915120000<TRNAMT>-8.45<FITID>A1<NAME>STARBUCKS\n</STMTTRN></OFX>','x.qfx');
 assert.deepEqual(r.rows[0],{date:'2026-09-15',amt:-8.45,desc:'STARBUCKS',ref:'A1'});
 assert.ok(P.isDuplicate(r.rows[0],[{ext:'A1',amt:1,date:'2020-01-01'}]));
 assert.ok(P.isDuplicate({date:'2026-09-16',amt:-8.45},[{amt:8.45,date:'2026-09-15'}]));
 assert.ok(!P.isDuplicate({date:'2026-09-20',amt:-8.45},[{amt:8.45,date:'2026-09-15'}]))});
test('Amounts in bank formats',()=>assert.deepEqual(['(12.50)','12.50-','$1,234.56','-$5','3.00 CR','3.00 DR','abc'].map(P.parseAmount),[-12.5,-12.5,1234.56,-5,3,-3,null]));
test('IRS 1040-ES dates follow weekend and DC holiday rules',()=>{
 assert.deepEqual(P.quarterlyDue(2022).map(q=>q.due),['2022-04-18','2022-06-15','2022-09-15','2023-01-17']);
 assert.deepEqual(P.quarterlyDue(2025).map(q=>q.due),['2025-04-15','2025-06-16','2025-09-15','2026-01-15']);
 assert.deepEqual(P.quarterlyDue(2028).map(q=>q.due),['2028-04-18','2028-06-15','2028-09-15','2029-01-16'])});
test('Extra paycheck months',()=>{
 assert.deepEqual(P.extraPayMonths(['2026-01-02','2026-01-16','2026-01-30','2026-02-13','2026-02-27'],'biweekly').map(m=>m.extra),[['2026-01-30']]);
 assert.deepEqual(P.extraPayMonths(['2026-01-01','2026-01-15'],'semimonthly'),[])});
test('Employer match: two tiers',()=>{
 assert.deepEqual(P.match401k({salary:52000,pct:3,tiers:[{rate:100,upTo:3},{rate:50,upTo:2}]}),{employer:1560,max:2080,missing:520,needPct:5,yours:1560});
 assert.equal(P.match401k({salary:52000,pct:10,tiers:[{rate:50,upTo:6}]}).missing,0)});
test('Credit use bands',()=>{assert.equal(P.utilization(250,3000).band,'low');assert.equal(P.utilization(600,3000).band,'moderate');assert.equal(P.utilization(900,3000).band,'high');assert.equal(P.utilization(1,0),null)});
test('Pay-later installments, including month ends',()=>{
 assert.deepEqual(P.installmentDates('2026-10-01','biweekly',4),['2026-10-01','2026-10-15','2026-10-29','2026-11-12']);
 assert.deepEqual(P.installmentDates('2026-01-31','monthly',3),['2026-01-31','2026-02-28','2026-03-31'])});
test('A confirmed pay-later payment lowers the balance by its full amount',()=>{
 const d={id:'b',kind:'bnpl',bal0:200,ts:0};assert.equal(F.debtBalance(d,[{id:'t',ts:1,status:'done',type:'fixed',debt:'b',amt:50}]),150)});
test('Calendar file: escaping, folding, reminders',()=>{
 const t=P.buildICS([{uid:'a@b',date:'2026-10-01',title:'Rent, due; now '+'x'.repeat(80),alarm:1}],{now:new Date('2026-09-30T00:00:00Z')});
 assert.ok(t.includes('DTSTART;VALUE=DATE:20261001')&&t.includes('DTEND;VALUE=DATE:20261002')&&t.includes('Rent\\, due\\; now')&&t.includes('TRIGGER:-P1D'));
 assert.ok(t.split('\r\n').every(l=>Buffer.byteLength(l)<=75),'lines folded at 75 octets')});
test('Encrypted backup: round trip, wrong passphrase, no plain text',async()=>{
 const e=await P.encryptBackup('{"tx":["rent"]}','correct horse','gap',{iter:1000});
 assert.ok(P.isEncrypted(JSON.parse(e))&&!e.includes('rent'));
 assert.equal(await P.decryptBackup(e,'correct horse'),'{"tx":["rent"]}');
 await assert.rejects(P.decryptBackup(e,'wrong passphrase'),/does not open/);
 await assert.rejects(P.encryptBackup('x','short','gap'),/8 characters/)});
test('Streak copies paydays and bill days from the old bridge once',()=>{
 const src=fs.readFileSync(__dirname+'/../befree-apps/streak/app.js','utf8');
 const store={'befree.bridge.gap.v2':JSON.stringify({v:2,pay:{freq:'biweekly',anchor:'2026-09-25',wk:'same'},bills:[{rid:'r1',next:['2026-10-01','2026-11-01']}]})};
 const c={Date,Math,Number,Object,Array,JSON,String,Set,LIVE:true,HC:[1,2,3],tplOf:()=>null,today:()=>'2026-09-30',localStorage:{getItem:k=>store[k]??null}};
 vm.createContext(c);vm.runInContext(src.slice(src.indexOf('function blank(){'),src.indexOf('function loadS(){')),c);
 const s=c.migrate({v:2,habits:[{id:'h',created:'2026-09-01',sched:[{from:'2026-09-01',rule:{t:'before',days:2,rid:'r1'}}]}],pay:null});
 assert.deepEqual([s.pay.freq,s.pay.anchor],['biweekly','2026-09-25']);
 assert.deepEqual(s.habits[0].sched[0].rule,{t:'before',days:2,day:1});
 assert.ok(s.standaloneV1&&s.migr.length===1);
 const again=c.migrate(JSON.parse(JSON.stringify(s)));assert.equal(again.migr.length,1,'runs once')});
(async()=>{for(const [n,fn] of tests){await fn();count++;console.log('PASS '+n)}console.log(count+' addition tests passed')})().catch(e=>{console.error(e);process.exit(1)});
