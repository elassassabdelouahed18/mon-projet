/* BeFree install page.
   One page lists both apps. A browser can only install the app whose
   manifest and folder the page belongs to, so the same page exists twice,
   identical: gap/install.html installs Gap in place, streak/install.html
   installs Streak in place, and each links to the other for the second
   step. Install progress is remembered in this browser only. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const NAME={gap:'Gap',streak:'Streak'};
const flag=a=>{try{return localStorage.getItem('befree.installed.'+a)==='1'}catch(e){return false}};
const setFlag=a=>{try{localStorage.setItem('befree.installed.'+a,'1')}catch(e){}};
const ua=navigator.userAgent||'';
const iOS=/iP(hone|ad|od)/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const iOSOther=iOS&&/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);
const macSafari=!iOS&&/Macintosh/.test(ua)&&/Safari\//.test(ua)&&!/Chrome|Chromium|Edg\/|Firefox|OPR/.test(ua);
const firefoxDesktop=/Firefox\//.test(ua)&&!/Android|Mobile/.test(ua);
const android=/Android/.test(ua),edge=/Edg\//.test(ua);
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const SHARE='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/></svg>';
const PLUS='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>';

const app=document.body.dataset.app,other=app==='gap'?'streak':'gap',name=NAME[app];
/* opened from the new icon: this is the installed app, go straight in */
if(standalone){setFlag(app);location.replace('./');return}
/* cache the app now, so it opens with no signal right after installing */
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});

const act=$('#act-'+app),otherAct=$('#act-'+other);
$('#step-'+app).classList.add('is-active');

function paintStates(){
 ['gap','streak'].forEach(a=>{const b=$('#state-'+a),on=flag(a);b.textContent=on?'Installed':'Not installed yet';b.classList.toggle('ok',on)});
 const oname=NAME[other],href=`../${other}/install.html#step-${other}`;
 otherAct.innerHTML=flag(other)
  ?`<p class="note">Installed on this device.</p>`
  :`<a class="btn${flag(app)?'':' ghost'}" href="${href}">${flag(app)&&app==='gap'?'Now install '+oname:'Install '+oname}</a>`;
 const both=flag('gap')&&flag('streak');$('#allDone').hidden=!both;return both}

function success(){setFlag(app);
 act.innerHTML=`<h3>${name} is on your ${iOS||android?'Home Screen':'computer'}</h3><p class="note">Open it from its icon from now on, not from this browser tab.</p>`;
 if(paintStates())$('#allDone').scrollIntoView({behavior:'smooth',block:'center'});
 else{const n=$('#step-'+other);if(n)n.scrollIntoView({behavior:'smooth',block:'center'})}}
function manual(title,steps,note){
 act.innerHTML=`<h3>${title}</h3><ol>${steps.map(s=>`<li>${s}</li>`).join('')}</ol><button class="btn" id="did" type="button">I've added ${name}</button>${note?`<p class="note">${note}</p>`:''}`;
 $('#did').onclick=success}
const menuHelp=()=>edge?`Open the <b>…</b> menu, then <b>Apps</b>, then <b>Install this site as an app</b>.`
 :android?`Open the <b>⋮</b> menu and tap <b>Install app</b> or <b>Add to Home screen</b>, then <b>Install</b>.`
 :`Click the install icon at the right of the address bar, or open the <b>⋮</b> menu, then <b>Cast, save, and share</b>, then <b>Install page as app</b>.`;

paintStates();
if(iOS){manual(`Add ${name} to your Home Screen`,[
  `Tap <b>Share</b> ${SHARE} ${iOSOther?'in the address bar or the browser menu':'at the bottom of Safari (at the top on iPad)'}. Don't see it? Tap the <b>…</b> button first.`,
  `Scroll down and tap <b>Add to Home Screen</b> ${PLUS}.`,
  `Keep <b>Open as Web App</b> on, check the name says <b>${name}</b>, then tap <b>Add</b>.`],
  iOSOther?'Adding to the Home Screen from Chrome or Edge needs iOS 16.4 or later. On older versions, open this page in Safari.':'On the Home Screen the app keeps its own storage, and Safari will not clear it after a week of not visiting.')}
else if(macSafari)manual(`Add ${name} to your Dock`,['In the menu bar, click <b>File</b>, then <b>Add to Dock</b>.',`Check the name says <b>${name}</b> and click <b>Add</b>.`],'Needs macOS Sonoma 14 or later. On an older Mac, use Chrome or Edge.');
else if(firefoxDesktop){act.innerHTML=`<h3>Firefox can't install apps</h3><p class="note">Open this page in Chrome, Edge or Safari to install ${name}, or keep using it in a Firefox tab.</p><button class="btn" id="copy" type="button">Copy this page's link</button><a class="btn ghost" href="./">Open ${name} in this tab</a>`;
 $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(location.href.split('#')[0]);$('#copy').textContent='Link copied'}catch(e){$('#copy').textContent=location.href.split('#')[0]}}}
else{
 /* Chrome, Edge, Samsung Internet, Android: the browser's own install prompt, right here */
 let deferred=null;
 act.innerHTML=`<button class="btn" id="go" type="button" disabled>Install ${name}</button><p class="note" id="alt">One tap, then confirm. ${name} gets its own icon and opens in its own window.</p>`;
 const go=$('#go'),alt=$('#alt');
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;go.hidden=false;go.disabled=false});
 addEventListener('appinstalled',success);
 go.onclick=async()=>{if(!deferred)return;deferred.prompt();const c=await deferred.userChoice.catch(()=>({}));deferred=null;
  if(c.outcome==='accepted')success();else{go.disabled=true;alt.innerHTML=menuHelp()}};
 /* no prompt: already installed, or the browser wants its own menu */
 setTimeout(()=>{if(deferred)return;go.hidden=true;
  alt.innerHTML=(flag(app)?`${name} may already be installed on this device. If not: `:'')+menuHelp();
  const d=document.createElement('button');d.className='btn ghost';d.type='button';d.id='did';d.textContent=`I've installed ${name}`;d.onclick=success;act.appendChild(d)},3000)}

/* arriving for the second step: bring its card into view */
if(location.hash==='#step-'+app){const s=$('#step-'+app);if(s)setTimeout(()=>s.scrollIntoView({block:'center'}),60)}
})();
