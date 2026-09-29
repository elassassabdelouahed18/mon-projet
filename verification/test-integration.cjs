const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),F=require('../befree-apps/finance-core.js');
const src=fs.readFileSync(__dirname+'/../befree-apps/gap/app.js','utf8');
const cut=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b,src.indexOf(a)));
let count=0;function test(n,fn){fn();count++;console.log('PASS '+n);}
const date='2026-09-28';
function setup(){const c={Date,Math,Number,Object,occ:()=>[],matched:()=>false,BeFreeFinance:F,today:()=>date,primary:()=>({}),essDaily:()=>({v:10}),nextPay:()=> '2026-10-05',diffD:(a,b)=>Math.round((new Date(b)-new Date(a))/864e5),addD:(a,n)=>new Date(new Date(a).getTime()+n*864e5).toISOString().slice(0,10),sum:(a,f)=>a.reduce((n,x)=>n+(f?f(x):x),0),cashEff:F.cash,isDone:F.done,isSpend:F.spend,spendAmt:t=>(t.refund?-1:1)*t.amt,items:[{flow:-1,amt:100}],planned:()=>c.items,fundPlan:()=>({thisCycle:100}),S:{bal:{amt:500,asOf:date,ts:10},tx:[],cyc:{buf:50,ess:70,cardReserve:80,confirmed:date,funds:true},funds:[],tax:{on:false,rate:25,cats:['Side income'],biz:true}}};vm.createContext(c);vm.runInContext(cut('function taxEst(','function unconfirmed(')+cut('function cycle(){','/* ══════════ nav'),c);return c;}
test('Availability protects bills, essentials, buffer and card reserve',()=>assert.equal(setup().cycle().avail,200));
test('Missing cycle review suppresses availability',()=>{const c=setup();c.S.cyc.confirmed=null;assert.ok(c.cycle().need.includes('review'));assert.equal(c.cycle().avail,undefined)});
test('Stale checking suppresses availability',()=>{const c=setup();c.S.bal.asOf='2026-09-20';assert.ok(c.cycle().need.includes('bal'))});
test('Card purchase reserves money without reducing checking',()=>{const c=setup();c.S.tx=[{type:'variable',amt:100,payFrom:'card',ts:11}];const x=c.cycle();assert.equal(x.balNow,500);assert.equal(x.avail,100)});
test('Settling a card reserve preserves the same room',()=>{const c=setup();c.S.tx=[{type:'transfer',amt:80,debtRole:'settlement',ts:11}];assert.equal(c.cycle().avail,200)});
test('Planned card settlement is not protected twice',()=>{const c=setup();c.items.push({flow:-1,amt:80,debtRole:'settlement'});assert.equal(c.cycle().avail,200)});
test('Planned sinking transfer is not protected twice',()=>{const c=setup();c.S.funds=[{id:'f'}];c.items.push({flow:-1,amt:100,fund:'f'});assert.equal(c.cycle().funds,0);assert.equal(c.cycle().avail,100)});
test('Tax estimate respects payment from a reserve',()=>{const c=setup();const t=c.taxEst([{type:'income',cat:'Side income',amt:500},{type:'variable',cat:'Business expense',amt:100},{type:'transfer',cat:'Tax reserve',amt:100},{type:'transfer',cat:'Tax reserve',amt:100,dir:'in'},{type:'fixed',cat:'Estimated income tax',amt:100}]);assert.equal(t.need,100);assert.equal(t.held,100)});
test('Enabled tax shortfall reduces protected availability',()=>{const c=setup();c.S.tax.on=true;c.S.tx=[{type:'income',cat:'Side income',amt:400,ts:1,date}];assert.equal(c.cycle().taxHold,100);assert.equal(c.cycle().avail,100)});
test('No-spend evidence cannot override a later purchase',()=>assert.equal(F.evidence({link:'log'},{log:1},true),null));
test('Root offline cache includes code and both app pages',()=>{const s=fs.readFileSync(__dirname+'/../befree-apps/sw.js','utf8');for(const name of ['finance-core.js','gap/app.js','streak/app.js','gap/index.html','streak/index.html'])assert.ok(s.includes(name));});
test('Revision uses new storage without deleting legacy keys on load',()=>{assert.ok(src.includes("const KEY='befree.v5'"));assert.ok(src.includes("const old4=DB.g('befree.v4')"));assert.ok(src.includes("d.v>5"));});
console.log(count+' integration tests passed');
