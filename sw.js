const CACHE = "streamday-v1";
const IMG = [];
["mochi","maple","pip","cocoa"].forEach(c => { ["happy","hype","sleepy"].forEach(m => IMG.push(`img/${c}_${m}.png`)); ["gg","love","sip","lurk","rage","hype"].forEach(e => IMG.push(`img/${c}_e_${e}.png`)); });
const FILES = ["./", "index.html", "cal.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png",
  "nunito-latin-600-normal.woff2", "nunito-latin-800-normal.woff2", "silkscreen-latin-400-normal.woff2", "silkscreen-latin-700-normal.woff2", ...IMG];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(url.pathname.endsWith("cal.html") ? "cal.html" : "index.html", c)); return r; }).catch(() => caches.match(url.pathname.endsWith("cal.html") ? "cal.html" : "index.html")));
    return;
  }
  e.respondWith(fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return res; }).catch(() => caches.match(e.request)));
});
