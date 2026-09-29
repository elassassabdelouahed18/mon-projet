/* BeFree financial rules, revision 5. Pure functions shared by the app and tests. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.BeFreeFinance=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const round=n=>Math.round((n+Number.EPSILON)*100)/100;
 const done=t=>(t.status||'done')==='done';
 const spend=t=>t.type==='fixed'||t.type==='variable';
 const amount=t=>(t.refund?-1:1)*(+t.amt||0);
 const savings=t=>t.type==='transfer'&&(t.goal||t.fund||['Savings','Goal','Sinking fund','Tax reserve','Investing'].includes(t.cat));
 function cash(t){if(!done(t))return 0;if(t.type==='income')return +t.amt||0;
  if(spend(t))return t.fund||t.payFrom==='card'?0:-amount(t);
  if(t.type==='transfer')return (t.dir==='in'?1:-1)*(+t.amt||0);return 0;}
 function totals(list){let i=0,f=0,v=0,sav=0,extra=0,tax=0,invest=0,ref=0,tr=0;
  list.filter(done).forEach(t=>{const a=+t.amt||0;
   if(t.type==='income')i+=a;
   else if(spend(t)){if(t.debtRole==='extra')extra+=amount(t);else if(t.type==='fixed')f+=amount(t);else v+=amount(t);if(t.refund)ref+=a;}
   else if(t.type==='transfer'){tr+=a;if(t.debtRole==='minimum')f+=(t.dir==='in'?-a:a);if(t.debtRole==='extra')extra+=(t.dir==='in'?-a:a);}
   if(savings(t)){const n=t.dir==='in'?-a:a;sav+=n;if(t.cat==='Tax reserve')tax+=n;if(t.cat==='Investing')invest+=n;}
   if(spend(t)&&t.fund)sav-=amount(t);
  });const gap=i-f-v,assigned=sav+extra;
  return Object.fromEntries(Object.entries({i,f,v,out:f+v,gap,sav,extra,tax,invest,assigned,unassigned:gap-assigned,wealth:sav-tax,ref,tr}).map(([k,n])=>[k,round(n)]));}
 function debtEffect(d,t){if(!done(t))return 0;
  if(t.payFrom==='card'&&t.card===d.id&&spend(t))return amount(t);
  if(t.debt!==d.id)return 0;
  if(d.kind==='card'||d.kind==='due')return -(+t.amt||0);
  return Number.isFinite(t.principal)?-Math.max(0,Math.min(t.principal,+t.amt||0)):0;}
 function debtBalance(d,list){let b=+d.bal0||0;const base=d.ledgerBaseline;
  if(base){const current={};list.forEach(t=>{current[t.id]=debtEffect(d,t);});new Set([...Object.keys(base),...Object.keys(current)]).forEach(id=>{b+=(current[id]||0)-(base[id]||0);});}
  else list.forEach(t=>{if((t.ts||0)>(d.ts||0))b+=debtEffect(d,t);});return round(Math.max(0,b));}
 function allocation(available,percentGoal,percentDebt){const cents=Math.max(0,Math.floor(available*100+1e-6));const g=Math.floor(cents*percentGoal/100),d=Math.floor(cents*percentDebt/100);return{g:g/100,d:d/100,y:(cents-g-d)/100};}
 function fi({annualSpending,portfolio=0,monthlyInvestment=0,realReturn=4,withdrawalRate=3.5}){
  if(![annualSpending,portfolio,monthlyInvestment,realReturn,withdrawalRate].every(Number.isFinite)||annualSpending<=0||portfolio<0||monthlyInvestment<0||realReturn<=-100||withdrawalRate<=0||withdrawalRate>10)throw new Error('Check the assumptions.');
  const target=annualSpending/(withdrawalRate/100),r=Math.pow(1+realReturn/100,1/12)-1;let balance=portfolio,months=0;
  while(balance<target&&months<1200){balance=balance*(1+r)+monthlyInvestment;months++;}
  return{target:round(target),years:balance>=target?round(months/12):null,convention:'Constant dollars; end-of-month contributions; no guaranteed return.'};}
 function evidence(h,ev={},noSpend=false){if(!h.link)return null;
  if(h.link==='log')return ev.complete||(!ev.log&&(ev.nospend||noSpend))?{k:'complete',txt:'today’s spending was marked complete (or reviewed as no spending)'}:null;
  if(h.link==='review')return ev.review?{k:'review',txt:'you reviewed your money in Gap'}:null;
  if(h.link==='balance')return ev.balance?{k:'balance',txt:'you reconciled the checking balance in Gap'}:null;
  if(h.link==='bills'){const n=h.ref&&h.ref.rid?(ev.billRefs||{})[h.ref.rid]:ev.bill;return n?{k:'bill',txt:'you confirmed the linked bill payment'}:null;}
  if(h.link==='save'){const ref=h.ref||{},key=ref.goal?'goal:'+ref.goal:ref.fund?'fund:'+ref.fund:null;const n=key?(ev.saveRefs||{})[key]:ev.save;return n?{k:'save',txt:key?'you moved money to this specific goal or fund':'you moved money to savings'}:null;}return null;}
 return{round,done,spend,cash,totals,debtEffect,debtBalance,allocation,fi,evidence};
});
