
const CACHE_NAME = 'timesplit-v2-bunker';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/@supabase/supabase-js@2.39.3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Try to cache critical assets, but don't fail installation if external ones (like CDN) fail
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => 
            fetch(url).then(response => {
                if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                return cache.put(url, response);
            }).catch(e => console.warn(`Could not cache ${url}:`, e))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 1. Skip non-GET
  if (event.request.method !== 'GET') return;

  // 2. Skip special protocols
  const url = new URL(event.request.url);
  if (url.protocol === 'chrome-extension:' || url.protocol === 'data:') return;

  // 3. Stale-While-Revalidate Strategy for most things
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Network fetch promise
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache if valid
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
         // Network failed
         console.warn('Fetch failed, returning offline fallback if available', err);
         // Optionally return a specific offline page here if it was a navigation request
      });

      // Return cached response immediately if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
