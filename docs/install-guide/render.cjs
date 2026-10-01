const {chromium}=require(process.env.PW||'playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'guide.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
const fit=await p.evaluate(()=>{const b=document.body;return {sh:b.scrollHeight,ch:b.clientHeight,fonts:['900 20px Fraunces','400 12px Poppins','500 12px "IBM Plex Mono"'].map(f=>document.fonts.check(f))}});console.log(JSON.stringify(fit));
await p.pdf({path:path.resolve(__dirname,'Installation-Guide-Gap-and-Streak.pdf'),format:'Letter',printBackground:true,margin:{top:0,right:0,bottom:0,left:0},preferCSSPageSize:true});
await b.close()})();
