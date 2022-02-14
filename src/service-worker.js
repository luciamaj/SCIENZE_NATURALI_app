/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */
 

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts("/precache-manifest.3d710cb96b1eaf93679788b2e1f8a8ad.js");

workbox.core.setCacheNameDetails({prefix: "audible-museum"});


var CACHE_VERSION = 1;
var cache = {
  media: 'media-cache-v' + CACHE_VERSION
};
var cacheFiles = [
	'./',
  '/assets/background/dos.png',
  
  /*'https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/previous.svg',
  'https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/next.svg',
  "https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/pause.svg",
  "https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/play.svg",*/
	'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic,700italic',
	
	'/assets/icon/favicon.png'	,	

]

  

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Installed');

  // e.waitUntil Delays the event until the Promise is resolved
  e.waitUntil(

    // Open the cache
    caches.open(cache.media).then(function(cache) {

      // Add all the default files to the cache
    console.log('[ServiceWorker] Caching cacheFiles');
    return cache.addAll(cacheFiles);
    })
  ); // end e.waitUntil
});



self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);

	// e.respondWidth Responds to the fetch event

	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)
			 .then(function( response) {

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
					// Return the cached version
					return response;
				}else{
					// If the request is NOT in the cache, fetch and cache

					var requestClone = e.request.clone();
					return fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log("[ServiceWorker] No response from fetch ")
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cache.media).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;
			
				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});

				}

				


			}) // end caches.match(e.request)
	); // end e.respondWith

});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});



