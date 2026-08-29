const CACHE = 'lmc-v49';
const ASSETS = [
  '/app/',
  '/app/index.html',
  '/app/css/app.css',
  '/app/js/db.js',
  '/app/js/app.js',
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

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});

// ── Push notifications (local reminders) ────────────────────────────────────
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

// ── Background sync (when back online) ──────────────────────────────────────
self.addEventListener('sync', e => {
  if (e.tag === 'sync-workouts') {
    // Future: sync offline workouts to backend
    console.log('[SW] Background sync: sync-workouts');
  }
});
