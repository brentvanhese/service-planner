/* MyService offline service worker: precache the shell, then cache-as-you-go. */
const CACHE = "myservice-v1";
const SCOPE = self.registration.scope;
const SHELL = ["", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"].map((p) => new URL(p, SCOPE).href);

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(SHELL.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  // Navigations: network first, fall back to cached page or app shell.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
        .catch(async () => (await caches.match(req)) || (await caches.match(new URL("", SCOPE).href)) || (await caches.match(new URL("index.html", SCOPE).href))),
    );
    return;
  }

  // Static assets: cache first, then network (and store).
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    })),
  );
});
