self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});


const latest = {
	cache: 'cache/v',
	version:1
};

self.addEventListener('install', event => {
	event.waitUntil(
	caches.open(latest.cache+latest.version).then(cache => {
		return cache.addAll([
		'/',
		'/assets/icon/playerIcon/pause.svg',
		'/assets/icon/playerIcon/pause_white.svg',
		'/assets/icon/playerIcon/play.svg',
		'/assets/icon/playerIcon/play_white.svg',
		'/assets/icon/playerIcon/previous.svg',
		'/assets/icon/playerIcon/next.svg',
		'/assets/background/logo.png',
		'/raccolta',
		'/audio\/(.*)',
		'/video\/(.*)',
		'/service/rest/v1/mostra-attiva'
		
		]);
	})
	);
});

const baseUrl="";

self.addEventListener('message', event => {
	console.log(`The client sent me a message: ${event.data.type}`);
	if(event.data.type==='addversion'){
		increaseV();
	}
	if(event.data.type==='baseurl'){
		 baseUrl=event.data.message

	}
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	  }

})

function increaseV(){
	latest.version+=1;
}

var ignoreRequests = new RegExp('(' + [
	'/upload\/(.*)',
	].join('(\/?)|\\') + ')$')

var netFirstRequests = new RegExp('(' + [

	'/service/rest/v1/app-schede-audible',
	].join('(\/?)|\\') + ')$')
  
	var netFirstmostraAttiva = new RegExp('(' + [
		'/service/rest/v1/mostra-attiva',
		
		].join('(\/?)|\\') + ')$')
	  

/*self.addEventListener('fetch', event => {
	// exclude requests that start with chrome-extension://
	if (event.request.url.startsWith('chrome-extension://')) return;
	
	event.respondWith(
		caches.open(latest.cache).then(cache => {
			return cache.match(event.request).then(response => {
				return response || fetch(event.request).then(networkResponse => {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
			})
			
			})
		})
	);
});*/

function onFetch(event) {
	if (ignoreRequests.test(event.request.url)) {
	  console.log('ignored: ', event.request.url)
	  event.respondWith(fetchNotCache(event))
	  return
	}
	if(netFirstRequests.test(event.request.url)){
		console.log('netFirst: ', event.request.url)
		event.respondWith(fetchorCache(event))
		return
	}
	if(netFirstmostraAttiva.test(event.request.url)){
		console.log('netFirst MA: ', event.request.url)
		event.respondWith(fetchorCacheMA(event))
		return
	}
  
	event.respondWith(cacheorFetch(event))
}

function fetchNotCache(event){
	var networked = fetch(event.request)
	.then(fetchFromNetwork(event)).catch(function() {
		console.log("error fatching");
		
	})
	return networked
}
  
function fetchorCache(event){
	var networked = fetch(event.request)
	.then(fetchedFromNetworkAndPutInCache(event)).catch(function() {
		console.log("from cache");
		return caches.match(event.request).catch(()=>{
			console.log("non è in cache")
		});
	})
	return networked
}
function fetchorCacheMA(event){
	var networked = fetch(event.request)
	.then(fetchedFromNetworkAndPutInCache(event))
	.catch(function() {
		console.log("cerco in cache");
		return caches.match(event.request).then((cachedResponse)=>{
			console.log("response", cachedResponse );
				return cachedResponse
				
		 }).catch(()=>{
			console.log("non in cache");
			new Promise((resolve,reject)=>{
				resolve(JSON.parse(localStorage.getItem('pubblication')))
			})
			//return JSON.parse(localStorage.getItem('pubblication'));
		});
	});

	console.log("networked ",networked )
	return networked
}

function cacheorFetch(event) {
return caches.match(event.request)
	.then((cached)=> {
	var networked = fetch(event.request)
		.then(fetchedFromNetworkAndPutInCache(event)).catch( error=> console.log("error ", error))
	return cached || networked
	})
}
  
function fetchedFromNetworkAndPutInCache(event) {
return function transform(response) {
	var cacheCopy = response.clone()
	caches.open(latest.cache+latest.version)
	.then(function add(cache) {
		cache.put(event.request, cacheCopy)
	})
	.then(function() {
		// console.log('WORKER: fetch response stored in cache.', event.request.url)
	})
	return response
}
}

function fetchFromNetwork(event) {
	return function transform(response) {
	
		return response
	}
	}
  
self.addEventListener('fetch', onFetch);

self.addEventListener('activate', event => {
	event.waitUntil(
	caches.keys().then(cacheNames => {
		return Promise.all(
		cacheNames.filter(cacheName => {
			if (cacheName === latest.cache+latest.version) {
				console.log("caheuguali");
			return false;
			}

			return true;
		}).map(cacheName => {
			console.log("cache delete");
			return caches.delete(cacheName)
		})
		);
	})
	);
});