// The "service worker": a little helper the phone keeps running in the background.
// First visit: it saves a copy of the app files. After that: it serves those saved copies,
// so the app opens even with no internet. Bump CACHE ("v2", "v3"...) whenever you update the app.
// Map tiles you have looked at are also kept (in TILES) so those map areas still show offline.
const CACHE = 'trip-v48';
const TILES = 'trip-tiles';
const MAX_TILES = 3000;   // about 60 MB; the oldest tiles are dropped first
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's own HTTP cache, so a new release never saves an old copy
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== TILES).map(k => caches.delete(k)))));
  self.clients.claim();
});

let tilePuts = 0;
async function trimTiles(c) {
  const keys = await c.keys();   // oldest first
  for (const k of keys.slice(0, Math.max(0, keys.length - MAX_TILES))) await c.delete(k);
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname === 'tile.openstreetmap.org') {
    e.respondWith(caches.open(TILES).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r.ok) { c.put(e.request, r.clone()).then(() => { if (++tilePuts % 50 === 0) trimTiles(c); }); }
      return r;
    }).catch(() => new Response('', {status: 504})))));
    return;
  }
  // opening the app (also with ?something added to the address) always gets the saved app page
  if (e.request.mode === 'navigate' && url.origin === location.origin) {
    e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || caches.match('./index.html')).then(hit => hit || fetch(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
