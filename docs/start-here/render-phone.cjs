/* H1 - the phone edition of the guide, from the same book.html. */
const {chromium}=require(process.env.PW||'playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:845}});
await p.goto('file://'+path.resolve(__dirname,'book.html'));
await p.addStyleTag({path:path.resolve(__dirname,'phone.css')});
await p.evaluate(()=>document.fonts.ready);
await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r}))));
const r=await p.evaluate(()=>{
 const over=[];document.querySelectorAll('.pg').forEach((pg,i)=>{
  const w=pg.clientWidth-parseFloat(getComputedStyle(pg).paddingLeft)-parseFloat(getComputedStyle(pg).paddingRight);
  let wide=0;[...pg.querySelectorAll('*')].forEach(c=>{const r=c.getBoundingClientRect();
   if(r.width>w+1.5)wide=Math.max(wide,Math.round(r.width-w))});
  over.push([i+1,Math.round(pg.getBoundingClientRect().height),wide])});
 const body=getComputedStyle(document.querySelector('.pg')).fontSize;
 const clipped=[...document.querySelectorAll('.pg')].filter(pg=>pg.scrollHeight>pg.clientHeight+1).length;
 return {over,body,clipped,broken:[...document.images].filter(i=>!i.naturalWidth).length}});
console.log(JSON.stringify(r));
await p.pdf({path:path.resolve(__dirname,'Start-Here-The-BeFree-System-phone.pdf'),
 printBackground:true,preferCSSPageSize:true,tagged:true,outline:true});
await b.close()})();
