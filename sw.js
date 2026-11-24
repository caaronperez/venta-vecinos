// Price-drop notifications only: no caching, the page always loads fresh from the network.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  var scope = self.registration.scope;
  // The server sends mirror links (older ones: GitHub Pages); open the same page on whichever address this was installed from (GitHub or the Cloudflare mirror).
  var m = typeof d.url === "string" ? /^https:\/\/(caaronperez\.github\.io\/venta-(mudanza|vecinos)|venta-(mudanza|vecinos)\.caaronperez\.workers\.dev)\//.exec(d.url) : null;
  var url = m ? scope + d.url.slice(m[0].length) : scope;
  e.waitUntil(self.registration.showNotification(d.title || "Bajó de precio", {
    body: d.body || "",
    icon: scope + "brand/icon-192.png",
    badge: scope + "brand/icon-192.png",
    image: d.image || undefined,
    tag: d.tag || undefined,
    data: { url: url }
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(self.clients.openWindow(url));
});
