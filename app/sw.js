const CACHE = 'lmc-v55';
const ASSETS = [
  '/app/',
  '/app/index.html',
  '/app/css/app.css',
  '/app/css/app.css?v=53',
  '/app/js/db.js',
  '/app/js/db.js?v=54',
  '/app/js/app.js',
  '/app/js/app.js?v=54',
  '/app/manifest.json',
  '/app/icons/icon-192.png',
  '/app/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

function sameOrigin(url) {
  try { return new URL(url, self.location.origin).origin === self.location.origin; }
  catch { return false; }
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!sameOrigin(e.request.url)) return;
  const url = new URL(e.request.url);
  const isNav = e.request.mode === 'navigate'
    || url.pathname === '/app/'
    || url.pathname.endsWith('.html');

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request)
      || await cache.match(url.pathname)
      || await cache.match(url.pathname + url.search);

    const isCode = url.pathname.endsWith('.js')
      || url.pathname.endsWith('.css')
      || url.pathname.endsWith('.json');
    // Страницы и код — сначала сеть, чтобы толпа не сидела на сломанном кэше.
    // Картинки можно отдать из кэша сразу.
    const offlinePage = () => cached || new Response('Living Motion offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

    if (isNav || isCode) {
      try {
        // no-cache so a broken script cannot stay pinned in the HTTP cache.
        const res = isCode
          ? await fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' })
          : await fetch(e.request);
        if (res && res.ok) {
          cache.put(e.request, res.clone()).catch(() => {});
          return res;
        }
        return cached || res;
      } catch {
        return offlinePage();
      }
    }

    if (cached) return cached;
    try {
      const res = await fetch(e.request);
      if (res && res.ok) {
        cache.put(e.request, res.clone()).catch(() => {});
        return res;
      }
      return cached || res;
    } catch {
      return cached || new Response('', { status: 504 });
    }
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const appUrl = '/app/';
      for (const c of list) {
        if (c.url.includes('/app/') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(appUrl);
    })
  );
});

self.addEventListener('sync', e => {
  if (e.tag === 'sync-workouts') {
    console.log('[SW] Background sync: sync-workouts');
  }
});
