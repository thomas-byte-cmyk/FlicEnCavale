// =========================================================
// SERVICE WORKER de FlicEnCavale (fichier généré à la construction :
// ne pas modifier dist/sw.js, mais scripts/sw-template.js).
// Rôle : garder le jeu en mémoire pour qu'il marche HORS LIGNE et
// qu'il puisse s'installer sur l'écran d'accueil.
//
// Mises à jour : la page du jeu (index.html) est TOUJOURS redemandée
// d'abord à Internet. Une nouvelle version publiée est donc prise en
// compte dès le lancement suivant ; le cache ne sert que hors ligne
// (ou si le réseau met plus de 4 secondes à répondre).
// Les autres fichiers ont un nom qui change à chaque version
// (ex. index-B1iO60VO.js) : on peut les garder en cache sans risque.
// =========================================================

const VERSION = '__VERSION__';
const CACHE = `flicencavale-${VERSION}`;
const FILES = __FILES__;
const NETWORK_TIMEOUT = 4000; // ms

// Installation : on met tous les fichiers du jeu en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()), // la nouvelle version prend la main tout de suite
  );
});

// Activation : on efface les caches des anciennes versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('flicencavale-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Réseau d'abord (avec délai maximum), cache si hors ligne. */
async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('lent')), NETWORK_TIMEOUT)),
    ]);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (
      (await cache.match(request, { ignoreSearch: true })) ||
      (await cache.match('./index.html')) ||
      (await cache.match('./')) ||
      Response.error()
    );
  }
}

/** Cache d'abord (fichiers dont le nom change à chaque version), sinon réseau. */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // rien d'externe
  if (request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith(networkFirst(request));
  } else if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('.webmanifest')) {
    return; // toujours le réseau (pour détecter les mises à jour)
  } else {
    event.respondWith(cacheFirst(request));
  }
});
