
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
		'/assets/icon/playerIcon/play.svg',
		'/assets/icon/playerIcon/previous.svg',
		'/assets/icon/playerIcon/next.svg',
		'/assets/background/logo.png',
		'/raccolta',
		'/audio',
		'/video',
		
		]);
	})
	);
});



self.addEventListener('message', event => {
	console.log(`The client sent me a message: ${event.data}`);
	if(event.data==='addversion'){
		increaseV();
	}

})
function increaseV(){
	latest.version+=1;
}

var ignoreRequests = new RegExp('(' + [
	'/service/rest/v1/mostra-attiva',
	'/service/rest/v1/app-schede-audible',
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
	  // request will be networked
	  //return
	  event.respondWith(fetchorCache(event))
	  return
	}
  
	event.respondWith(cacheorFetch(event))
}
  
function fetchorCache(event){
	var networked = fetch(event.request)
	.then(fetchedFromNetwork(event)).catch(function() {
		console.log("from cache");
		return caches.match(event.request);
	})
	return networked
}

function cacheorFetch(event) {
return caches.match(event.request)
	.then((cached)=> {
	var networked = fetch(event.request)
		.then(fetchedFromNetwork(event))
	return cached || networked
	})
}
  
function fetchedFromNetwork(event) {
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