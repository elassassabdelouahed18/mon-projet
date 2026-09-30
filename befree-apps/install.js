/* BeFree install flow.
   The main page lists both apps; each app installs from its own page
   (gap/install.html, streak/install.html), because a browser can only
   install the app whose manifest and scope the current page belongs to.
   Install progress is remembered in this browser only. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const APPS={gap:'Gap',streak:'Streak'};
const flag=a=>{try{return localStorage.getItem('befree.installed.'+a)==='1'}catch(e){return false}};
const setFlag=a=>{try{localStorage.setItem('befree.installed.'+a,'1')}catch(e){}};
const ua=navigator.userAgent||'';
const iOS=/iP(hone|ad|od)/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const iOSOther=iOS&&/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);
const macSafari=!iOS&&/Macintosh/.test(ua)&&/Safari\//.test(ua)&&!/Chrome|Chromium|Edg\/|Firefox|OPR/.test(ua);
const firefoxDesktop=/Firefox\//.test(ua)&&!/Android|Mobile/.test(ua);
const edge=/Edg\//.test(ua);
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const SHARE='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/></svg>';
const PLUS='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>';

/* ── main page ── */
function hub(){
 const g=flag('gap'),s=flag('streak');
 [['gap',g],['streak',s]].forEach(([a,on])=>{
  const st=$('#'+a+'State'),step=$('#step'+APPS[a]),btn=$('#'+a+'Btn');
  st.textContent=on?'Installed':'Not installed yet';st.classList.toggle('ok',on);step.classList.toggle('is-done',on);
  btn.textContent=on?`Install ${APPS[a]} again`:`Install ${APPS[a]}`});
 if(g&&!s){$('#streakBtn').textContent='Next: install Streak'}
 $('#allDone').hidden=!(g&&s)}

/* ── one app's page ── */
function one(){
 const b=document.body,app=b.dataset.app,name=APPS[app],other=app==='gap'?'streak':'gap',oname=APPS[other];
 /* opened from the new icon: this is the installed app, go straight in */
 if(standalone){setFlag(app);location.replace('./');return}
 /* cache the app now, so it opens with no signal right after installing */
 if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
 const box=$('#how'),next=()=>flag(other)
  ?`<p>Both apps are installed. Open them from your home screen or app list from now on.</p><a class="btn ghost" href="../">Back to the install page</a>`
  :`<a class="btn" href="../${other}/install.html">Next: install ${oname}</a>`;
 const success=()=>{setFlag(app);box.innerHTML=`<h2>${name} is installed</h2><p>Find the ${name} icon on your home screen or in your apps, and open it from there, not from this browser tab.</p>${next()}`};
 const manual=(title,steps,note)=>{box.innerHTML=`<h2>${title}</h2><ol>${steps.map(s=>`<li>${s}</li>`).join('')}</ol>
  <button class="btn" id="did" type="button">I've added ${name}</button>${note?`<p class="note">${note}</p>`:''}`;$('#did').onclick=success};
 if(iOS){manual(`Add ${name} to your Home Screen`,[
   `Tap <b>Share</b> ${SHARE} ${iOSOther?'in the address bar or the browser menu':'at the bottom of Safari (at the top on iPad)'}. If you don't see it, tap the <b>…</b> button first.`,
   `Scroll down and tap <b>Add to Home Screen</b> ${PLUS}.`,
   `Keep <b>Open as Web App</b> switched on, check the name says <b>${name}</b>, then tap <b>Add</b>.`],
   iOSOther?'Adding to the Home Screen from Chrome or Edge needs iOS 16.4 or later. On older versions, open this page in Safari.':'The app then keeps its own storage, separate from Safari, and Safari will not clear it after a week of not visiting.');return}
 if(macSafari){manual(`Add ${name} to your Dock`,['In the menu bar, click <b>File</b>, then <b>Add to Dock</b>.',`Check the name says <b>${name}</b> and click <b>Add</b>.`],'Needs macOS Sonoma 14 or later. On an older Mac, use Chrome or Edge.');return}
 if(firefoxDesktop){box.innerHTML=`<h2>Firefox can't install apps</h2><p>Open this page in Chrome, Edge or Safari to install ${name}. Or keep using it in a Firefox tab and bookmark it.</p>
  <button class="btn" id="copy" type="button">Copy this page's link</button><a class="btn ghost" href="./" style="margin-top:10px">Open ${name} in this tab</a>`;
  $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);$('#copy').textContent='Link copied'}catch(e){$('#copy').textContent=location.href}};return}
 /* Chrome, Edge, Samsung Internet, Android: the browser's own install prompt */
 let deferred=null;
 box.innerHTML=`<h2>Install ${name}</h2><p>One tap, then confirm. ${name} gets its own icon and opens in its own window.</p><button class="btn" id="go" type="button" disabled>Preparing…</button><p class="note" id="alt"></p>`;
 const go=$('#go'),alt=$('#alt');
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;go.disabled=false;go.textContent=`Install ${name}`;alt.textContent=''});
 addEventListener('appinstalled',success);
 go.onclick=async()=>{if(!deferred)return;deferred.prompt();const c=await deferred.userChoice.catch(()=>({}));deferred=null;
  if(c.outcome==='accepted')success();else{go.textContent=`Install ${name}`;go.disabled=true;alt.innerHTML=menuHelp()}};
 const menuHelp=()=>edge?`If the button doesn't respond: open the <b>…</b> menu, then <b>Apps</b>, then <b>Install this site as an app</b>.`
  :/Android/.test(ua)?`If the button doesn't respond: open the <b>⋮</b> menu and tap <b>Install app</b> or <b>Add to Home screen</b>, then <b>Install</b>.`
  :`If the button doesn't respond: click the install icon at the right of the address bar, or open the <b>⋮</b> menu, then <b>Cast, save, and share</b>, then <b>Install page as app</b>.`;
 setTimeout(()=>{if(deferred)return;go.textContent=flag(app)?`${name} may already be installed`:`Install from the browser menu`;
  alt.innerHTML=menuHelp()+(flag(app)?'':' ')+`<br><button class="btn ghost" id="did" type="button" style="margin-top:12px">I've installed ${name}</button>`;
  const d=$('#did');if(d)d.onclick=success},3000)}

if(document.body.dataset.page==='hub')hub();else one();
})();
