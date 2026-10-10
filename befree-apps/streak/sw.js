/* BeFree Streak — offline shell.
   Precache on install so the app opens with the radio off. Pages are
   network-first (so a new version arrives the next time you're online) and
   fall back to the cached copy offline; icons and the manifest are served from
   the cache and refreshed in the background. Nothing here talks to a server we
   own, because there isn't one. Bump CACHE whenever index.html changes. */
const CACHE = 'befree-streak-v19';
const MINE = /^befree-streak-/;
const SHELL = ['./app.js', './extras.js', '../finance-core.js', '../plus-core.js', './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  /* only this app's old caches: Gap and Streak share an origin, so deleting
     every other cache would wipe the sibling app's offline copy */
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE && (MINE.test(k) || k === 'befree-1')).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    /* only the app page itself is kept as the offline copy; other pages in
       this folder (install.html) must never replace it */
    const app = /\/(index\.html)?$/.test(url.pathname);
    /* straight to the network, past the HTTP cache, so an update shows up
       on the next open even on hosts that cache pages */
    e.respondWith(fetch(req.url, {cache: 'no-cache', credentials: 'same-origin'}).then(res => {
      if (app && res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match('./index.html').then(hit => hit || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => {
    const net = fetch(req).then(res => {
      if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
