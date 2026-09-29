/* BeFree root. Gap and Streak are separate apps, each with its own service
   worker in gap/ and streak/. This worker replaces the old shared-window one
   for anyone who installed it: it clears the shared-window cache and keeps
   only the root redirect page available offline. Other requests are left to
   the network or to the app's own worker. */
const CACHE = 'befree-root-v1';
const ROOT = new URL('./', self.location).pathname;
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(['./', 'index.html'].map(u => new Request(u, {cache: 'reload'}))))
    .then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('befree-suite-') ||
    (k.startsWith('befree-root-') && k !== CACHE)).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname !== ROOT && u.pathname !== ROOT + 'index.html') return;
  e.respondWith(fetch(u.href, {cache: 'no-cache'}).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, {ignoreSearch: true})));
});
