/*
 * DP Code service worker.
 *
 * Intentionally conservative: this app is a live, WebSocket-driven control
 * surface for coding agents, so we never want to serve stale application data.
 * The worker exists to make the app installable and to provide a graceful
 * offline fallback — not to act as an aggressive cache.
 *
 * Strategy:
 *  - Only GET, same-origin, navigation/static-asset requests are touched.
 *  - API / WebSocket / range requests are passed straight to the network.
 *  - Navigations use network-first with an offline.html fallback.
 *  - Hashed build assets use stale-while-revalidate for fast repeat loads.
 */

const VERSION = "dpcode-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

const SHELL_URLS = ["/offline.html", "/manifest.webmanifest", "/dpcode.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isStaticAsset(url) {
  return /\.(?:js|mjs|css|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|gif|ico)$/i.test(
    url.pathname,
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept live data channels or API calls.
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/ws") ||
    request.headers.has("range")
  ) {
    return;
  }

  // App navigations: network-first, fall back to cached shell, then offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(SHELL_CACHE);
        return (
          (await cache.match(request)) ||
          (await cache.match("/offline.html")) ||
          Response.error()
        );
      }),
    );
    return;
  }

  // Static build assets: stale-while-revalidate.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type === "basic") {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});
