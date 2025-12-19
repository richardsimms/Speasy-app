/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

/**
 * Speasy PWA Service Worker
 * Handles: offline caching, push notifications, background sync
 */

const CACHE_VERSION = 'speasy-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const AUDIO_CACHE = `${CACHE_VERSION}-audio`;

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/speasy-logo.svg',
];

// API routes to cache with network-first strategy
const API_ROUTES = ['/api/feeds/', '/api/users/'];

// Audio file extensions to cache
const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.ogg', '.aac'];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Force activate immediately
        return self.skipWaiting();
      }),
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete caches that don't match current version
            return (
              cacheName.startsWith('speasy-') && !cacheName.includes(CACHE_VERSION)
            );
          })
          .map(cacheName => caches.delete(cacheName)),
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    }),
  );
});

/**
 * Fetch event - handle caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different resource types
  if (isAudioRequest(url)) {
    event.respondWith(audioFirstStrategy(request));
  } else if (isApiRequest(url)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

/**
 * Check if request is for audio content
 */
function isAudioRequest(url) {
  return AUDIO_EXTENSIONS.some(ext => url.pathname.endsWith(ext))
    || url.pathname.includes('/audio/')
    || url.searchParams.has('audio');
}

/**
 * Check if request is an API call
 */
function isApiRequest(url) {
  return API_ROUTES.some(route => url.pathname.startsWith(route));
}

/**
 * Check if request is for static assets
 */
function isStaticAsset(url) {
  const staticExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff2', '.woff', '.css', '.js'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Cache-first strategy for static assets
 */
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return getOfflineFallback(request);
  }
}

/**
 * Network-first strategy for API calls and dynamic content
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return getOfflineFallback(request);
  }
}

/**
 * Audio caching strategy - cache audio for offline playback
 */
async function audioFirstStrategy(request) {
  // Check cache first for audio to enable offline playback
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Also try to update cache in background
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(AUDIO_CACHE).then((cache) => {
            cache.put(request, response);
          });
        }
      })
      .catch(() => {
        // Ignore errors for background update
      });
    return cachedResponse;
  }

  // If not in cache, fetch from network and cache
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(AUDIO_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Audio unavailable offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Get offline fallback response
 */
async function getOfflineFallback(request) {
  // For navigation requests, return offline page
  if (request.mode === 'navigate') {
    const cachedOffline = await caches.match('/offline');
    if (cachedOffline) {
      return cachedOffline;
    }
    // Return a basic offline response if no offline page cached
    return new Response(
      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
      {
        headers: { 'Content-Type': 'text/html' },
      },
    );
  }

  // For other requests, return appropriate error
  return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch {
    data = {
      title: 'New Speasy Update',
      body: event.data.text(),
    };
  }

  const options = {
    body: data.body || 'You have a new digest ready to listen',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    image: data.image || '/poster.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/dashboard',
      digestId: data.digestId,
      timestamp: Date.now(),
    },
    actions: [
      {
        action: 'play',
        title: 'Play Now',
        icon: '/android-chrome-192x192.png',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
    tag: data.tag || 'speasy-notification',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Speasy', options),
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';
  const digestId = event.notification.data?.digestId;

  // Handle action buttons
  if (event.action === 'play' && digestId) {
    // Navigate to player with specific digest
    const playerUrl = `/dashboard?play=${digestId}`;
    event.waitUntil(openOrFocusClient(playerUrl));
  } else if (event.action === 'dismiss') {
    // Just close the notification

  } else {
    // Default: open the dashboard
    event.waitUntil(openOrFocusClient(urlToOpen));
  }
});

/**
 * Open URL in existing client or create new one
 */
async function openOrFocusClient(url) {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  // Try to find an existing Speasy window
  for (const client of clients) {
    if (client.url.includes(self.location.origin) && 'focus' in client) {
      await client.focus();
      return client.navigate(url);
    }
  }

  // No existing window, open new one
  return self.clients.openWindow(url);
}

/**
 * Background sync for queued actions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'speasy-sync-playback') {
    event.waitUntil(syncPlaybackData());
  } else if (event.tag === 'speasy-sync-feeds') {
    event.waitUntil(syncFeeds());
  }
});

/**
 * Sync playback progress when back online
 */
async function syncPlaybackData() {
  try {
    // Get queued playback data from IndexedDB
    const db = await openDatabase();
    const playbackQueue = await getQueuedPlayback(db);

    for (const item of playbackQueue) {
      try {
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        await removeFromQueue(db, item.id);
      } catch {
        // Will retry on next sync
      }
    }
  } catch {
    // Database error, will retry later
  }
}

/**
 * Sync RSS feeds when back online
 */
async function syncFeeds() {
  try {
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage({ type: 'FEEDS_SYNC_COMPLETE' });
    }
  } catch {
    // Ignore errors
  }
}

/**
 * IndexedDB helpers for background sync
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('speasy-sw', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('playback-queue')) {
        db.createObjectStore('playback-queue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getQueuedPlayback(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('playback-queue', 'readonly');
    const store = transaction.objectStore('playback-queue');
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removeFromQueue(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('playback-queue', 'readwrite');
    const store = transaction.objectStore('playback-queue');
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Message handler for communication with main thread
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_AUDIO':
      if (payload?.url) {
        caches.open(AUDIO_CACHE).then((cache) => {
          cache.add(payload.url).catch(() => {
            // Ignore cache errors
          });
        });
      }
      break;

    case 'CLEAR_AUDIO_CACHE':
      caches.delete(AUDIO_CACHE);
      break;

    case 'GET_CACHE_STATUS':
      getCacheStatus().then((status) => {
        event.source?.postMessage({ type: 'CACHE_STATUS', payload: status });
      });
      break;
  }
});

/**
 * Get current cache status
 */
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};

  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status[name] = keys.length;
  }

  return status;
}
