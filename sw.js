self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // НЕ обрабатывать внешние запросы
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});