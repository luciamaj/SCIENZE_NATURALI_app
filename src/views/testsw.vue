<template>
     <ion-content>
     
      <div  class="onboard-main">



         <h1>Service Worker Test</h1>

        <p>Try reloading the page without an Internet connection.</p>

        <video controls></video>

       
            

      </div>
      

    </ion-content>
</template>
<script>
import {

 IonContent,

} from "@ionic/vue";
export default {
    

components: {
   IonContent,
 },

 mounted(){
    // this.getvideo();
 },

 methods:{

    getvideo(){


        const videos = {
         one: document.querySelector('video')
        };

        const videoRequest = fetch(this.$store.getters.baseUrl+"/upload/356.mp4").then(response => response.blob());
        videoRequest.then(blob => {
        const request = indexedDB.open('mediaStore', 1);

        request.onsuccess = event => {
            const db = event.target.result;

            const transaction = db.transaction(['videos']);
            const objectStore = transaction.objectStore('videos');

            const test = objectStore.get('test');

            test.onerror = event => {
            console.log('error');
            };

            test.onsuccess = event => {
            videos.one.src = window.URL.createObjectURL(test.result.blob);
            };
        }

        request.onupgradeneeded = event => {
            const db = event.target.result;
            const objectStore = db.createObjectStore('videos', { keyPath: 'name' });

            objectStore.transaction.oncomplete = event => {
            const videoObjectStore = db.transaction('videos', 'readwrite').objectStore('videos');
            videoObjectStore.add({name: 'test', blob: blob});
            };
        }
        });

    }
 }

}
</script>
