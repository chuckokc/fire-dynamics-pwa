// Give our app's storage system a name - like labeling a filing cabinet
const CACHE_NAME = 'fire-dynamics-v1';

// List all the files our app needs to work - like making a checklist
const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/manifest.json',
    '/data/firedata.json',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// When the service worker is installed (like setting up a new office)
self.addEventListener('install', event => {
    event.waitUntil(
        // Open our storage and save all necessary files
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// When the app requests a file (like looking something up)
self.addEventListener('fetch', event => {
    event.respondWith(
        // Check if we have it saved first
        caches.match(event.request)
            .then(response => {
                // If we have it saved, use that; if not, get it from the internet
                return response || fetch(event.request);
            })
    );
});