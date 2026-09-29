// Illustrative scenarios, not payroll estimates or observed outcomes.
const F=require('../befree-apps/finance-core.js');
const specs={Marcus:{pay:2769,base:2355,debts:[['Card A',4800,26.9,120],['Card B',1400,22.4,35],['Auto',11850,14.9,362],['Medical',1180,0,0]],starter:500,emergencyMonth:16,emergency:780},Maya:{pay:5647,base:4887,debts:[['Card',2400,24.9,70],['Auto',26400,7.4,545],['Student',14200,5.5,185]],starter:1000,emergencyMonth:9,emergency:1450}};
function run(name){const p=specs[name],d=p.debts.map(([name,balance,apr,min])=>({name,balance,apr,min}));let buffer=0,fund=0,taxReserve=0;const rows=[],ledger=[];
 rows.push({month:0,income:p.pay,living:p.base+d.reduce((s,x)=>s+x.min,0),gap:p.pay-p.base-d.reduce((s,x)=>s+x.min,0),buffer,fund,taxReserve,debt:d.reduce((s,x)=>s+x.balance,0),cards:d.filter(x=>x.name.startsWith('Card')).reduce((s,x)=>s+x.balance,0)});
 for(let month=1;month<=24;month++){
  const tx=[],add=(type,cat,amt,extra={})=>{if(amt>0)tx.push({type,cat,amt:F.round(amt),status:'done',...extra})};
  const pay=p.pay+(name==='Marcus'&&month>=7?180:0)-(name==='Maya'&&month>=3?146:0),side=month>=6?(name==='Marcus'?200:600):0,cost=side*.1,tax=F.round((side-cost)*.25);
  let base=p.base-(name==='Marcus'?180:480)-(name==='Maya'&&month>=12?255:0);
  add('income','Paycheck',pay);add('income','Side income',side);add('variable','Living costs excluding debt',base);add('variable','Business expense',cost);
  let minimum=0,interest=0;d.forEach(x=>{if(x.balance<=0)return;const charge=F.round(x.balance*x.apr/1200);interest+=charge;x.balance+=charge;const paid=Math.min(x.balance,x.min);x.balance=F.round(x.balance-paid);minimum+=paid;add('fixed','Debt minimum',paid);});
  let relief=0;if(name==='Marcus'&&month===14){const medical=d.find(x=>x.name==='Medical');relief=medical.balance;medical.balance=0;}
  add('transfer','Tax reserve',tax);taxReserve=F.round(taxReserve+tax);
  const room=Math.max(0,pay+side-base-cost-minimum-tax),reward=F.round(room*.2);add('variable','Optional spending',reward);
  let free=F.round(room-reward),toBuffer=Math.min(free,Math.max(0,p.starter-buffer));buffer+=toBuffer;free-=toBuffer;
  const toFund=F.round(free*.2);fund+=toFund;free-=toFund;
  let extra=0;for(const x of d.filter(x=>x.apr>=12).sort((a,b)=>b.apr-a.apr)){const pay=Math.min(free,x.balance);x.balance=F.round(x.balance-pay);free=F.round(free-pay);extra+=pay;}
  toBuffer+=free;buffer+=free;add('transfer','Savings',toBuffer);add('transfer','Sinking fund',toFund);add('transfer','Debt payment',extra,{debtRole:'extra'});
  let shock=0;if(month===p.emergencyMonth){shock=p.emergency;const takeFund=Math.min(fund,shock);fund-=takeFund;const takeBuffer=Math.min(buffer,shock-takeFund);buffer-=takeBuffer;const missing=F.round(shock-takeFund-takeBuffer);if(missing>0)throw Error('Emergency shortfall must be modeled');add('transfer','Sinking fund',takeFund,{dir:'in'});add('transfer','Savings',takeBuffer,{dir:'in'});add('variable','Emergency repair',shock);}
  if(month%3===0&&taxReserve){add('transfer','Tax reserve',taxReserve,{dir:'in'});add('fixed','Estimated income tax',taxReserve);taxReserve=0;}
  const t=F.totals(tx);if(Math.abs(t.unassigned)>.04)throw Error('Unbalanced month '+name+' '+month+' '+t.unassigned);
  const row={month,income:t.i,living:t.out,gap:t.gap,assigned:t.assigned,buffer:F.round(buffer),fund:F.round(fund),taxReserve,extra:F.round(extra),interest:F.round(interest),relief,shock,cards:F.round(d.filter(x=>x.name.startsWith('Card')).reduce((s,x)=>s+x.balance,0)),debt:F.round(d.reduce((s,x)=>s+x.balance,0))};rows.push(row);ledger.push({month,transactions:tx});
 }return{assumptions:p,rows,ledger};}
const scenarios={Marcus:run('Marcus'),Maya:run('Maya')};
if(require.main===module){const fs=require('node:fs');fs.writeFileSync(__dirname+'/financial-model.json',JSON.stringify(scenarios,null,2));for(const[name,s]of Object.entries(scenarios))console.log(name,s.rows.filter(x=>[0,6,9,12,16,24].includes(x.month)));}
module.exports={run,scenarios};
