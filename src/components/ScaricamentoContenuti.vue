<template>
     <ion-content>
     
      <div  class="onboard-main">

  

          <div class="onb-desc ion-text-center">
            <h4> {{$t('scarica.title')}}</h4>
            <p class="ion-no-margin text-scaricamento"> {{$t('scarica.text')}}</p>
          </div>
          <div class="progress"> 
            <ion-progress-bar :value="progress" :buffer="1" color="secondary"> </ion-progress-bar>
            <div class ="progressvalue"><ion-spinner v-if="progress<1" name="crescent"></ion-spinner>{{ Math.round(progress*100) }} %</div>
          </div>

         
       
            

      </div>
      

    </ion-content>
</template>

<script>
import common from "../js/common"
import {

 IonContent,
 IonProgressBar,
 IonSpinner,
 alertController

} from "@ionic/vue";
import {global} from '../js/global'


export default {
    name: "scaricamento",
    props: {
        lang: { type: String, default: 'it' },
        fromC: { type: String, default: 'main' }
    },
    data() {
        return {
        publishedLang:[],
        store:"",
        currLang:"it",
        currSlide:0,
        isFirst:true,
        last:false,
        progress:0,
        media:0,
        mediafetched:0,
        quotaExcided:false

        };
    },


  
  created(){
   /* if(window.navigator.onLine){
      this.online=true
    }else{
       this.online=false
       //alert("Connection lost, controllare la connessione alla rete")
    }*/

    this.online=true
    this.testChiamata();
    this.storageError=common.storageError;
    this.updateNotification=common.updateNotification;
    this.savedlangs=localStorage.getItem('savedLangs');
    console.log("svd lng",this.savedlangs);
    this.currLang=this.$i18n.locale;

    if(this.online){
      
      const toremove=localStorage.getItem("conttoRemove");
      
      if(toremove){
        console.log('saved to remove '+toremove)
        this.toremove=toremove.split(",");
        if(this.toremove.length>0)
       // this.toremove.forEach(media=>{
          this.removeMedia();
       // })
      }
     
    }
      if(this.fromC=="onboard"|| this.fromC=="lang"){
        const newdbV=global.dbVersion+1
        global.dbVersion=newdbV;
        console.log("WEN DBV"+newdbV)
        localStorage.setItem("dbVersion",newdbV);
      }

  },
  mounted(){
    this.openDB();

    setTimeout(() => {
      if(this.online){
        this.searchMedia();
      }else{
        this.networkError();
      }
       
    
    },1000);
    
       
      
  },
 
  components: {
    
   IonSpinner ,
   IonContent,
    IonProgressBar
  },


  methods:{

    testChiamata(){
      this.getinfo((info) => {
        this.publishedLang=info.lang.map(element => {
          return element.toLowerCase();
        });
      })

    },

    openDB(){
        this.request = indexedDB.open('mediaStore', global.dbVersion);
        this.request.onsuccess = event => {

        console.log("REQUEStt SUCCESS, "+ this.fromC)
        const db = event.target.result;
        
        transaction = db.transaction(['media-'+this.lang],'readwrite');
        objectStore = transaction.objectStore('media-'+this.lang);
        }
        this.request.onupgradeneeded = event => {
          console.log("REQUESR SUCCESS")
          const db = event.target.result;
          let objectStore;
          console.log('VEDO FROM? '+ this.fromC )
          if(this.fromC=="update" || this.fromC=="main" ){

            objectStore = request.transaction.objectStore('media-'+this.lang);
          }else{
            objectStore = db.createObjectStore('media-'+this.lang,  {keyPath: "name"});
          }
        }
    },
  
    async networkError() {
      const alert = await alertController.create({
        header:  this.$t('networkerror.title'),
        message: this.$t('networkerror.text'),
        buttons: [
         
          {
            text: this.$t('networkerror.action'), 
            handler: () => {
              this.updateNotification(true);
              this.gotoFrom();
              
            },
          },
        ],
      });
  
      await alert.present();
    },
  
    getinfo(callback){
      

       fetch(this.$store.getters.baseUrl+"/service/rest/v1/mostra-attiva")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`)
        }
        return response.json()
      })
      .then(data => {
        callback(data.result[0]);
      })
      .catch(error =>{console.log(error)
        this.online=false;
      } )

    },

  searchMedia(){
    console.log('VEDO FROM? '+ this.fromC )
    console.log("lingua? "+ this.lang);
    const schede=localStorage.getItem('dataMostra');
    const jsonSchede=JSON.parse(schede);
    let contenuto="";
    console.log("->>", JSON.parse(schede));
    let counter=1;
    this.mediaCounter();
    this.getvideo(this.$store.getters.pubblication.img);
    jsonSchede.forEach((scheda, index) => {
      console.log("n° ",counter++ )
      if(this.quotaExcided==false){
        if(scheda.img!=null){
          this.mediaCounter();
        // this.getmedia(scheda.img)
            this.getvideo(scheda.img)
        }else{
          console.log("Non ci sono immagini per la scheda ")
        }
        contenuto=scheda.content.find(el=> el.lang== this.lang )
        console.log("Cont ", contenuto);
        if(contenuto.audio!=null){
            this.mediaCounter();
        // this.getmedia(contenuto.audio);
          this.getvideo(contenuto.audio);
            console.log("Getaudio ")
        }else if(contenuto.video!=null){
            this.mediaCounter();
        // this.getmedia(contenuto.audio);
          this.getvideo(contenuto.video);
          console.log("Getvideo ")
        }else{
            console.log("Non ci sono Media per la scheda ")
        }

         console.log('index', index, jsonSchede.length )
        if(index==jsonSchede.length-1){
          this.last=true;
          console.log('entro è last')
        }
      }
      

    });
  },
    getmedia(name){
      console.log("nuemro di media "+ this.media );

      //fetch(this.$store.getters.baseUrl+"/inventario/download.php?id="+name+"&link=1")
      fetch(this.$store.getters.baseUrl+"/upload/"+name)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        
        console.log("OK Resp", response);
        if(response.status==200){
         
         // this.mediafetched++
        }
       /* this.progress=(this.mediafetched/this.media*100 )/100;
        console.log("progress ",  this.progress);*/
       
        return response
      })
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url =>{ console.log( url);
        this.mediafetched++
        this.progress=Math.round(this.mediafetched/this.media*100 )/100;
        console.log("progress ",  this.progress);
      
        if(this.progress==1){
          this.openNext();
        }
      })
      .catch(err => {console.error(err)
        console.log("sono in errore")
        this.mediafetched++
        this.progress=Math.round(this.mediafetched/this.media*100 )/100;
        console.log("progress ",  this.progress);
        if(this.progress==1){
          this.openNext();
        }
      });


    },

    getvideo(name){
           
      const mediaRequest = fetch(this.$store.getters.baseUrl+"/upload/"+name).then(response => response.blob()).catch(err => {console.error(err); console.log("sono in errore"); alert('Errore nello scaricamnto');});
      mediaRequest.then(blob => {
        navigator.storage.estimate().then((estimate)=> {
          console.log("estimate ",estimate.quota," ",estimate )
          this.remainingquota=estimate.quota-estimate.usage;
            console.log("this.remainingquota ",  this.remainingquota)
            console.log(" this.filesize ",   blob.size)
          if(this.remainingquota> blob.size){
              console.log("CI STA ",name)
              this.saveinDB(name, blob)
          }else{
            if(this.quotaExcided==false){
              this.storageError();
            }
            console.log("NON CI STA ",name)
            this.quotaExcided=true;
            this.mediafetched++
            this.progress=Math.round(this.mediafetched/this.media*100 )/100;
            //this.progress=1
            console.log("progress ",  this.progress);
            if(this.progress==1){
              this.openNext();
            }
          }
          });
        
      });
        
       

    },
    async removeMedia(){
     
 
      const open = indexedDB.open('mediaStore',  global.dbVersion)

      open.onupgradeneeded = ()=>{
          const db = open.result
      }

      open.onsuccess = ()=> {
          const db = open.result
          const tx = db.transaction(['media-'+this.lang],'readwrite');
          const store = tx.objectStore(['media-'+this.lang])
          this.toremove.forEach(mediaName=>{
            store.delete(mediaName)
            console.log("tryng to remove ",mediaName);

          })
          

          tx.oncomplete = ()=> {
            localStorage.removeItem("conttoRemove");
              db.close()
          }
      }
     
     
      open.onerror = (err)=> {
          console.error('Error to delete media: ',err)
      }
    },

    saveinDB(name, blob){

      console.log("GDBV "+global.dbVersion+ ' type '+ typeof  global.dbVersion)
      const request = indexedDB.open('mediaStore', global.dbVersion);
      console.log( "REQUESTING ",global.dbVersion)
      let transaction;
      let objectStore;
      request.onsuccess = event => {

        console.log("REQUEStt SUCCESS, prvo a salvare "+ name,' ', this.fromC)
        const db = event.target.result;
        
        transaction = db.transaction(['media-'+this.lang],'readwrite');
        objectStore = transaction.objectStore('media-'+this.lang);
        
        const file=objectStore.get(name);
        file.onsuccess=(event)=>{
            const testget = event.target.result;      
          if (!testget) {
          
            console.log(" il file non presente "+name);
            const objectStoreRequest = objectStore.add({name: name, blob: blob});
            objectStoreRequest.onsuccess = (event) =>{
            // report the success of our request
            console.log(name+ " Successs");
              this.incProgress();
              if(this.last==true){
                db.close();
              }
              /*if(this.progress==1){
                this.openNext();
              }*/
            };
            objectStoreRequest.onerror=(event)=>{
                  console.log(" ERROR in add "+name , event);

                  alert( 'ERROR objectStoreRequest'+ name +' '+ event.target.error );
            }
            
          }else{
                console.log("file già presente "+name);
          }


        }
        

        transaction.onerror=()=>{
          console.log('ERROR transaction '+name +' ', event);
             // alert( 'ERROR transaction '+name +' '+ event.target.error );
        }

      }

      request.onupgradeneeded = event => {
        console.log("REQUESR SUCCESS")
        const db = event.target.result;
        let objectStore;
        console.log('VEDO FROM? '+ this.fromC )
        if(this.fromC=="aggiorna" || this.fromC=="main" ){

          objectStore = request.transaction.objectStore('media-'+this.lang);

          const objectStoreRequest = objectStore.add({name: name, blob: blob});
          objectStoreRequest.onsuccess = (event) =>{
            // report the success of our request
            console.log(name+ " Successs");
            this.incProgress();
            /*if(this.progress==1){
                  this.openNext();
            }*/
              
          };
          console.log('entroo')
        }else  if(this.fromC=="onboard" || this.fromC=="lang" ){
          console.log("Arrivo da: ", this.fromC)
          objectStore = db.createObjectStore('media-'+this.lang, { keyPath: 'name' });
          objectStore.transaction.oncomplete = event => {
      
          
            const mediaObjectStore = db.transaction('media-'+this.lang, 'readwrite').objectStore('media-'+this.lang);

            //const videoObjectStore = db.transaction('videos', 'readwrite').objectStore('videos');
            // const newMedia=mediaObjectStore.add({name: name, blob: blob});
            /* newMedia.onsuccess = (event) =>{
            
            console.log(name+ " Successs");
              
            };
            newMedia.onerror = (event) =>{
            
              console.log(" ERROR in add " +name, event);
              alert( 'ERROR in add onb lang ' +name+' '+ event.target.error );
              
            };*/
          };

          objectStore.transaction.onerror= (event) => {
            console.log("error transaction in upgrade");
           // alert("error transaction in upgrade");
          }

        }
        
          console.log( " request.onupgradeneeded");
        
      }
      request.onerror =  event => {
        console.log("Error ", event)
        alert("error opening db")
      }
      request.onblocked=event=>{
        console.log("BLOCKED ",event)
      }
      

    },

    incProgress(){
      this.mediafetched++
      this.progress=Math.round(this.mediafetched/this.media*100 )/100;
      console.log("progress ",  this.progress);
      if(this.progress==1){
        this.openNext();
      }
    },

    mediaCounter(){
      this.media++;
    },
    pushPage(fromTo) {
        const ionNav = document.querySelector('ion-nav') ;
        if(fromTo=="lang"||fromTo=="update"){
            ionNav.pop();
            
        }
    },

    openNext(){
      this.emitter.emit("fineAggiornamento");
      this.updateNotification(false);
      if(this.fromC=="main" || this.fromC=="onboard"|| this.fromC=="aggiorna"){
        if(localStorage.getItem('provToOpen')!=null){
          const tag= localStorage.getItem('provToOpen');
          localStorage.removeItem('provToOpen');
          this.$router.replace({ path: "/scheda/"+tag });
        }else{
          this.$router.replace({ name: "wave" });
        }
            
      }else if(this.fromC=="update"){
        this.pushPage("update");
      } else if(this.fromC=="lang"){
        this.pushPage("lang");
        this.emitter.emit('addLang',this.lang);
      }
    },

    gotoFrom(){
      if(this.fromC=="main" || this.fromC=="onboard"|| this.fromC=="aggiorna"){
        if(localStorage.getItem('provToOpen')!=null){
          const tag= localStorage.getItem('provToOpen');
          localStorage.removeItem('provToOpen');
          this.$router.replace({ path: "/scheda/"+tag });
        }else{
          this.$router.replace({ name: "wave" });
        }
            
      }else if(this.fromC=="update"){
        this.pushPage("update");
      } else if(this.fromC=="lang"){
        this.pushPage("lang");
      }
      
    }
    
    
  }
   
}




</script>

<style scoped>

ion-content {
  --overflow: hidden;
}

.body{
     background:  white;
}
.goback{
  visibility: visible;
}
.next{
 visibility: visible;
}
.invisible{
  visibility:hidden
}
.row{
  width: 100%;
  display: flex;
  margin-bottom: 40px;
}
.onboard-main{
    padding: 5%;
    height: 100%;
     background:  white;

}
ion-fab{
  bottom: 35px;
  right: 28px;
}
.onboard-top{
  margin-top: 5%;
 
}

.onboard-bot{
     margin-bottom: 5%;
  height: 80%;
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
}
.swiper-container{
  width: 85vw;
  height: 61vh;
}
.swiper-slide{
  width: 100%;
}
.lang-cont {
  margin-bottom: 20px;
}

.lang{
 text-align: center;
 
}
.circle-cont{
  height:100px;
  width: 100px;
  margin: 0 auto 10px;
}
.circle{
  
  height:100%;
  border-radius: 50%;
  border: solid 1px rgb(194, 194, 194);
  opacity: 0.8;

}
.circle> img{
  height: 100%;
}
.cover{
  object-fit: cover;
}
.checked{
   border: solid 5px rgb(11, 124, 11);
     opacity: 1;
}
.swiper-pagination {
  color: red;
}

.vertical-center {
  display: flex;
  justify-content: center;
  height: 100%;
}

.center {
  display: block;
  position: absolute;
  bottom: 0;
  padding-bottom: 15vh;
}



.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}

.onb-desc{
  top: 32%;
    position: relative;

}

.text-scaricamento{
  margin-bottom: 20px;
}

.toolbar {
   --background:  red;
}


.toolbar-background {
  color: white !important;
}
.progress{
  height: 31px;
  top: 35%;
    position: relative;
    padding: 0 10px;

}
ion-spinner{
  margin-right: 2%;
  color: azure;
  height: 19px;
  flex-direction: row;
}
.progressvalue{
  display: flex;
  align-items: center;
  position: relative;
  left: 15px;
  text-align: left;
  transform: translateY(-110%);
  font-weight: 700;
  color: azure;
  height: 25px;
}
ion-progress-bar {
  background-color: #e1e1e1;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  display: block;
  cursor: pointer;
  border-radius: 15px;
  height: 30px;
  border: none;
}

ion-progress-bar[value]::-webkit-progress-bar {
  background-color: #e1e1e1;
  border-radius: 3px;
}

ion-progress-bar[value]::-moz-progress-bar {
  background-color: #00a0ff;
  border-radius: 3px;
}

ion-progress-bar[value]::-webkit-progress-value {
  background-color: #00a0ff;
  border-radius: 3px;
}

@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>