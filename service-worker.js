const CACHE_NAME = 'gold-calc-v1';
const FILES_TO_CACHE = [
  './gold-calculator.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // فقط فایل‌های خودِ برنامه را از کش سرو کن؛ درخواست‌های API (قیمت‌ها) همیشه از شبکه بروند
  if (event.request.method !== 'GET' || !FILES_TO_CACHE.some((f) => url.includes(f.replace('./', '')))) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
