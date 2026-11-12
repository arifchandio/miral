// Simple offline cache. Bump V when you change index.html so users get the update.
const V = 'hina-b26-v13';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './extras.css', './extras.js', './extras2.js', './extras3.js', './extras4.js', './extras5.js', './extras6.js', './extras7.js', './extras8.js', './extras9.js', './qr.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const ok = u.origin === location.origin || /cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u.host);
  if (!ok) return;
  if (/\.mp3$/i.test(u.pathname)) return;   // audio uses Range requests: let the browser handle it directly
  if (r.mode === 'navigate') {   // page: network first, cache as fallback
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put('./index.html', cp)); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })));
});
