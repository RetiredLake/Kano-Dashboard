// Basic PWA support, not a promise that all games are available offline.
const CACHE = "kano-dashboard-public-v17-1";
const FALLBACK = "/offline.html";
const SHELL = [FALLBACK, "/manifest.webmanifest", "/dashboard/pwa-192.png", "/dashboard/pwa-512.png"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith("kano-dashboard-public-") && key !== CACHE)
    .map((key) => caches.delete(key)))));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.search) return;
  if (request.mode === "navigate") {
    // Never store server-rendered, authenticated, or API responses.
    event.respondWith(fetch(request).catch(() => caches.match(FALLBACK)));
    return;
  }
  if (!SHELL.includes(url.pathname) && !url.pathname.startsWith("/dashboard/")) return;
  event.respondWith(fetch(request).then((response) => {
    if (response.ok && response.type === "basic" && !/no-store|private/i.test(response.headers.get("Cache-Control") || "")) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)));
    }
    return response;
  }).catch(() => caches.match(request)));
});
