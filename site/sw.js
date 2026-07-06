// Self-destroying service worker.
//
// The old Gatsby site (gatsby-plugin-offline) registered a service worker at
// /sw.js that still lives in returning visitors' browsers and serves a stale
// cached copy of the site. Browsers re-fetch this URL on every navigation, so
// serving this replacement makes the old worker update to one that wipes all
// caches, unregisters itself, and reloads open tabs onto the real site.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
