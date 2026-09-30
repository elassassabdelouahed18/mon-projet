const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const src=fs.readFileSync(__dirname+'/../befree-apps/gap/app.js','utf8'),streak=fs.readFileSync(__dirname+'/../befree-apps/streak/app.js','utf8');
const between=(s,a,b)=>s.slice(s.indexOf(a),s.indexOf(b,s.indexOf(a)));
let total=0;function test(n,f){f();total++;console.log('PASS '+n)}
const els=new Map();const $=q=>{if(!els.has(q))els.set(q,{innerHTML:'',textContent:'',style:{}});return els.get(q)};
const F=require('../befree-apps/finance-core.js');
const c={Date,Math,Number,Object,String,Array,S:{tx:[],reviewed:{}},V:{trMode:'usd'},$,$$:()=>[],PAT:'',RAMP:['green'],isDone:F.done,tot:F.totals,mk:o=>new Date(2026,8-o,1),money:n=>'$'+n,kfmt:n=>String(n),esc:String,sum:(a,f)=>a.reduce((n,x)=>n+(f?f(x):x),0),requestAnimationFrame:f=>f()};vm.createContext(c);
vm.runInContext(between(src,'let MC=null;','let PRINTING=false;')+between(src,'function drawTrend(){',"\n$$('#trMode")+between(src,'function drawIncome(){','/* ══════════ categories'),c);
function run(tx){c.S.tx=tx;vm.runInContext('mcReset()',c);c.drawTrend();c.drawIncome()}
test('Unreviewed old records produce visible gap bars',()=>{run([{date:'2026-08-01',type:'income',amt:3000},{date:'2026-08-02',type:'fixed',amt:2500}]);assert.match($('#trend').innerHTML,/class="tb"/);assert.match($('#trend').innerHTML,/500/);assert.match($('#incSvg').innerHTML,/height="72.0"/)});
test('Current month appears before it can be closed',()=>{run([{date:'2026-09-01',type:'income',amt:2000}]);assert.match($('#trend').innerHTML,/class="tb"/);assert.equal(vm.runInContext('monthHas(0)',c),true);assert.equal(vm.runInContext('monthReviewed(0)',c),false)});
test('Historical chart visibility does not authorize forecasts',()=>{assert.equal(vm.runInContext('monthReviewed(0)',c),false);c.S.reviewed['2026-09']=1;assert.equal(vm.runInContext('monthReviewed(0)',c),true);c.S.reviewed={}});
test('Planned-only records do not appear as completed money',()=>{run([{date:'2026-09-01',type:'income',amt:2000,status:'planned'}]);assert.doesNotMatch($('#trend').innerHTML,/class="tb"/)});
test('True zero gap remains a visible data point',()=>{run([{date:'2026-08-01',type:'income',amt:100},{date:'2026-08-02',type:'fixed',amt:100}]);assert.match($('#trend').innerHTML,/class="tb"/)});
test('Negative gap renders a negative bar',()=>{run([{date:'2026-08-01',type:'fixed',amt:100}]);assert.match($('#trend').innerHTML,/class="tb"/);assert.match($('#trend').innerHTML,/-100/)});
test('Rendering does not alter transaction records',()=>{const before=JSON.stringify(c.S.tx);c.drawTrend();c.drawIncome();assert.equal(JSON.stringify(c.S.tx),before)});
const d={Date,Math,Number,Object,DN:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],DNL:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],S:{habits:[{id:'h',link:'log',created:'2026-09-01'}],ticks:{'h|2026-09-28':'g'},legacyAutoTicks:{'h|2026-09-28':'g'},evidenceV5:true},$,$$:()=>[],today:()=> '2026-09-28',addD:(s,n)=>new Date(new Date(s+'T12:00:00Z').getTime()+n*864e5).toISOString().slice(0,10),D:s=>new Date(s+'T12:00:00Z'),COUNTED:new Set(['done','small','missed']),DONE:new Set(['done','small']),fitType:()=>{},status:(h,ds)=>ds==='2026-09-28'?'done':'before',tk:(h,ds)=>d.S.ticks[h.id+'|'+ds],G:{v:2},evidence:()=>null};vm.createContext(d);vm.runInContext(between(streak,'function drawWeekday(){','function drawRing(){')+between(streak,'function autoTick(){','function habitFromTpl('),d);
test('Streak displays one recorded day instead of hiding the chart',()=>{d.drawWeekday();assert.notEqual($('#dow').style.display,'none');assert.match($('#dow').innerHTML,/height="64.0"/);assert.equal($('#dowTag').textContent,'Early history')});
test('Streak empty history retains an honest empty state',()=>{d.status=()=> 'before';d.drawWeekday();assert.equal($('#dow').style.display,'none')});
test('Legacy automatic marks survive the evidence upgrade',()=>{d.autoTick();assert.equal(d.S.ticks['h|2026-09-28'],'g')});
test('Earlier downgrade is repaired from the retained history',()=>{d.S.historyRepairV1=false;d.S.ticks['h|2026-09-28']='s';d.autoTick();assert.equal(d.S.ticks['h|2026-09-28'],'g')});
console.log(total+' chart/history regression tests passed');
