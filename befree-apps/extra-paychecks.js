/* Extra paycheck finder: months with more paydays than usual, next 24 months. */
(function(){
'use strict';
const P=BeFreePlus,$=s=>document.querySelector(s);
const pad=n=>String(n).padStart(2,'0'),iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const D=s=>new Date(s+'T00:00:00'),addD=(s,n)=>{const d=D(s);d.setDate(d.getDate()+n);return iso(d)};
const fmt=(s,o)=>D(s).toLocaleDateString('en-US',o);
const money=n=>'$'+Math.round(n).toLocaleString('en-US');
function run(){
 const freq=$('#freq').value,day=$('#day').value,amt=+$('#amt').value||0,res=$('#res');
 if(!day){res.innerHTML='<p>Pick one real payday to see your months.</p>';return}
 const step=freq==='weekly'?7:14,now=new Date(),from=iso(new Date(now.getFullYear(),now.getMonth(),1)),to=iso(new Date(now.getFullYear(),now.getMonth()+24,0));
 let d=addD(day,Math.ceil((D(from)-D(day))/864e5/step)*step);const dates=[];while(d<=to){dates.push(d);d=addD(d,step)}
 const ms=P.extraPayMonths(dates,freq),end12=iso(new Date(now.getFullYear(),now.getMonth()+12,1)).slice(0,7);
 const n12=ms.filter(m=>m.month<end12).reduce((s,m)=>s+m.extra.length,0);
 res.innerHTML=ms.length?`<h2>Your extra paychecks, next 24 months</h2>${ms.map(m=>`<div class="m"><b>${fmt(m.month+'-01',{month:'long',year:'numeric'})}</b><span>${m.extra.map(x=>fmt(x,{weekday:'short',month:'short',day:'numeric'})).join(', ')}${amt?` · +${money(amt*m.extra.length)}`:''}</span></div>`).join('')}
  ${amt?`<p>That's about <b>${money(amt*n12)}</b> in the next 12 months that no regular bill is counting on.</p>`:''}`
  :'<p>No extra paychecks in the next 24 months with that schedule.</p>'}
['#freq','#day','#amt'].forEach(s=>$(s).addEventListener('input',run));
$('#f').addEventListener('submit',e=>{e.preventDefault();run()});
run();
})();
