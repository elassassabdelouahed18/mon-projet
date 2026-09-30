/* BeFree root: the install page and the extra-paycheck tool. Gap and Streak
   are separate apps, each with its own service worker in gap/ and streak/.
   For anyone who installed the older shared window, this worker also clears
   its cache. Only the root files below are handled here; everything else is
   left to the network or to the app's own worker. */
const CACHE = 'befree-root-v3';
const FILES = ['./', 'index.html', 'install.css', 'install.js', 'logo.svg', 'extra-paychecks.html', 'extra-paychecks.js', 'plus-core.js',
  'fonts/fraunces-600.woff2', 'fonts/fraunces-900.woff2', 'fonts/poppins-400.woff2', 'fonts/poppins-500.woff2', 'fonts/poppins-600.woff2',
  'shots/gap-today.jpg', 'shots/streak-today.jpg'];
const ROOT = new URL('./', self.location).pathname;
const MINE = new Set(FILES.map(f => f === './' ? ROOT : ROOT + f));
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, {cache: 'reload'}))))
    .then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('befree-suite-') ||
    (k.startsWith('befree-root-') && k !== CACHE)).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !MINE.has(u.pathname)) return;
  e.respondWith(fetch(u.href, {cache: 'no-cache'}).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(u.pathname === ROOT ? './' : u.pathname, copy)); }
    return r;
  }).catch(() => caches.match(u.pathname === ROOT ? './' : u.pathname).then(hit => hit || caches.match('index.html'))));
});
