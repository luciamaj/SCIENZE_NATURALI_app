workbox.core.setCacheNameDetails({prefix: "silence-museum"});
 
 self.addEventListener('message', (event) => {
   if (event.data && event.data.type === 'SKIP_WAITING') {
	 self.skipWaiting();
   }
 });
 
 /**
  * The workboxSW.precacheAndRoute() method efficiently caches and responds to
  * requests for URLs in the manifest.
  * See https://goo.gl/S9QRab
  */
 self.__precacheManifest = [].concat(self.__precacheManifest || []);
 workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
 


 workbox.routing.registerRoute(
	new RegExp('/'),
	new  workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
	new RegExp(process.env.VUE_APP_BASE_URL+'/upload/'),
	new  workbox.strategies.cacheFirst({
		cacheName: 'media-cache',
	})
);

//network first for data download

workbox.routing.registerRoute(
	new RegExp(process.env.VUE_APP_BASE_URL+ '/service/rest/v1/mostra-attiva'),
	new  workbox.strategies.NetworkFirst()
);
workbox.routing.registerRoute(
	new RegExp(process.env.VUE_APP_BASE_URL+ '/service/rest/v1/mostra-attiva/percorsi'),
	new  workbox.strategies.NetworkFirst()
);


workbox.routing.registerRoute(
	new RegExp(process.env.VUE_APP_BASE_URL+'/service/rest/v1/app-schede-audible'),
	new  workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
	/.*\.(?:mp4|mp3|wav)/,
	workbox.strategies.cacheFirst({
	  cacheName: 'media-cache',
	  
	})
)