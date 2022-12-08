const buildFiles = [
  '/index.html',
  '/manifest.json',];

const staticFiles = [
  '/src/img/icons/favicon-32.png',
  '/src/img/icons/icon-512x512.png',
];

const routes = [
  '/',
  '/media',
  '/audio',
  '/audio-recording',
  '/geolocation',
  '/device-orientation',
  '/device-motion',
  '/web-share',
  '/share-target',
  '/multi-touch',
  '/speech-synthesis',
  '/speech-recognition',
  '/page-lifecycle',
  '/notifications',
  '/screen-orientation',
  '/bluetooth',
  '/network-info',
  '/contacts',
  '/ar-vr',
  '/info',
  '/payment',
  '/authentication',
  '/wake-lock',
  '/vibration',
  '/nfc',
  '/file-system',
  '/barcode'
];

const filesToCache = [
  ...buildFiles,
  ...staticFiles,
  ...routes
];

const version = 233;

const cacheName = `pwa-cache-${version}`;

const debug = true;

const log = debug ? console.log.bind(console) : () => {
};

const installHandler = e => {
  // log('[ServiceWorker] Install');
  // sendMessage({msg: 'Install'});

  self.skipWaiting();

  e.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache))
  );
};

const activateHandler = e => {
  // log('[ServiceWorker] Activate');
  // sendMessage({msg: 'activate'});

  e.waitUntil(
    caches.keys()
    .then(names => Promise.all(
      names
      .filter(name => name !== cacheName)
      .map(name => caches.delete(name))
    ))
  );

  return self.clients.claim();
};

const returnRangeRequest = request => fetch(request)
.then(res => res.arrayBuffer())
.then(arrayBuffer => {
  const bytes = /^bytes=(\d+)-(\d+)?$/g.exec(request.headers.get('range'));

  if(bytes) {
    const start = Number(bytes[1]);
    const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;

    return new Response(arrayBuffer.slice(start, end + 1), {
      status: 206,
      statusText: 'Partial Content',
      headers: [
        ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`]
      ]
    });
  }

  return new Response(null, {
    status: 416,
    statusText: 'Range Not Satisfiable',
    headers: [['Content-Range', `*/${arrayBuffer.byteLength}`]]
  });

});

const fetchHandler = async e => {
  const {request} = e;
  const {url} = request;

  // log('[Service Worker] Fetch', url, request.method);

  if(url.includes('font')) {
    console.log('font in url', url);
  }

  if(url.includes('/download')) {
    // e.respondWith(
    e.request.blob().then(file => {

      const response = new Response(file);
      response.headers.append('Content-Length', file.size);
      response.headers.append('Content-Disposition', `attachment; filename="${file.name}"`);
      // log(response);
      return response;
    })
    .catch(e => {
      // log(e);
    });

    // );
  }
  else {
    e.respondWith(
      caches.match(e.request, {ignoreSearch: true})
      .then(response => {
        if(response) {
          // log('from cache', url);
          // sendMessage({msg: `from cache: ${url}`});

          return response;
        }

        if(url.includes('.woff')) {
          console.log('font', url);
          const fontOrigin = new URL(url).origin;
          const origin = new URL(location.href).origin;

          if(fontOrigin !== origin) {
            const fontName = url.split('/').pop();
            const localFontUrl = `${origin}/src/fonts/${fontName}`;
            const fontRequest = new Request(localFontUrl);

            console.log('fetching local font', localFontUrl);

            return caches.match(fontRequest)
            .then(response => {
              if(response) {
                console.log('local font from cache');
                return response
              }
              return fetch(fontRequest);
            });
          }
        }
        // log('fetch', url);
        // sendMessage({msg: `fetch: ${url}`});

        return fetch(e.request);
      })
      .catch(err => console.error('fetch error:', err, url))
    );
  }
};

const sendMessage = async message => {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
  });

  clients.forEach((client) => client.postMessage(message));
}

const pushHandler = e => {
  // log('push', e.data.text(), Notification.permission);

  self.registration.showNotification(e.data.text())
  .then((res) => {
    log('notification result', res);
  })
  .catch((err) => {
    log('notification error', err);
  });
};

self.addEventListener('install', installHandler);
self.addEventListener('activate', activateHandler);
self.addEventListener('fetch', fetchHandler);
self.addEventListener('push', pushHandler);
