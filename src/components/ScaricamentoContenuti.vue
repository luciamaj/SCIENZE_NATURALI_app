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
import { version } from 'vue';


export default {
    name: "scaricamento",
    props: {
        lang: { type: String, default: 'it' },
        fromC: { type: String, default: 'main'},
        perc: { type: String, default: null}
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
        quotaExcided:false,
        mediatoGet:[],
        mediaArray:[],
        medianotDownloaded:[],
        vLangs:[],
        stima:0,
        alertOpen:false,
        salvataggioCompleto:false

        };
    },

    computed:{
      versionLangs:{
        get() {
          let versionLangs= [];
          if(localStorage.hasOwnProperty(('versionLangs'))){
            console.log("linguee ", localStorage.getItem('versionLangs'))
            versionLangs=  JSON.parse(localStorage.getItem('versionLangs'));
           
            console.log("linguee versionLangs ", versionLangs)
            this.copyVLangs(versionLangs);
          }
          return versionLangs
        },
      // setter
      set(newLVersion) {
        if(!this.vLangs.find(e=>e.lang==newLVersion.lang)){
          this.vLangs.push(newLVersion);
        }else{
          const langIndex=this.vLangs.findIndex(e=>e.lang==newLVersion.lang);
          this.vLangs[langIndex].vers=newLVersion.vers;
        }
        
        localStorage.setItem('versionLangs',JSON.stringify(this.vLangs));
      }

    },
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
    this.checkStatus=common.checkOnlineStatus;
    this.datetoVersion=common.datetoVersion;
    this.storageError=common.storageError;
    this.updateNotification=common.updateNotification;
    this.savedlangs=localStorage.getItem('savedLangs');
    console.log("svd lng",this.savedlangs);
    this.currLang=this.$i18n.locale;//controllare se uso la lingua giusta
    this.passedLang=this.lang
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
      if(this.fromC=="onboard"/*|| this.fromC=="lang"*/){
        const newdbV=global.dbVersion+1
        global.dbVersion=newdbV;
        console.log("WEN DBV"+newdbV)
        localStorage.setItem("dbVersion",newdbV);
      }

  },
  unmounted(){
    console.log("smonto e stoppo");
    clearTimeout(this.timerScaricamento);
    
  },
  mounted(){
    this.versionLangs
   // this.openDB();
   // this.openDBAltern();
    setTimeout(async() => {
      this.online= await this.checkStatus();
      console.log("online STATUS ",this.online);
      if(this.online){
        this.searchMedia();
        console.log("SET timer 3 minuti");
        this.timerScaricamento= setTimeout(() => {
          console.log("scaduto il timer");
          this.timeoutAlert();
       
        },60000*3);
    
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
    async timeoutAlert(){
      const alert = await alertController.create({
        header: "Problema di scaricamento" ,
        message: "è stato riscontrato un problema di scaricamento, controlla la connessione e riprova" ,
        buttons: [
            
            {
                text:"Annulla",
                role: "cancel",
                handler: () => {
                    console.log("Declined the offer");
                    
                },
            },
            {
                text:"Riprova",
                handler: () => {
                    console.log("Riprovo");
                    this.saveinDB();
                    
                },
            },
        ],
      });
      await alert.present();
    },
  
    async errorDownloadAlert(){
      this.alertOpen=true;
      const alert = await alertController.create({
        header: this.$t('scarica.errorconn.title') ,
        message: this.$t('scarica.errorconn.text'),
        buttons: [
            
            {
                text: this.$t('action.cancel'),
                role: "cancel",
                handler: () => {
                  this.alertOpen=false;
                    console.log("Declined the offer");
                    clearTimeout(this.timerScaricamento);
                    //localStorage.setItem("salvataggioCompleto", false);
                   // this.saveVersionLangVuota();
                   // this.openNext()
                   this.alertAnnullamento();
                    
                },
            },
            {
                text:this.$t('action.riprova'),
                cssClass:'modal-accept-button',
                handler: () => {
                    console.log("Riprovo");
                    this.alertOpen=false;
                    this.mediafetched=0;
                    this.mediaArray=[];
                    this.getMedia();
                    //this.saveinDB();
                    
                },
            },
        ],
      });
      await alert.present();
    },
    async alertAnnullamento(){
      this.alertOpen=true;
      const alert = await alertController.create({
        header: this.$t('scarica.alertannulla.title'),
        message: this.$t('scarica.alertannulla.text') ,
        buttons: [
            
            {
                text:this.$t('action.salta'),
                role: "cancel",
                handler: () => {
                  this.alertOpen=false;
                    console.log("Declined the offer");
                    this.salvataggioCompleto=false;
                    localStorage.setItem("salvataggioCompleto", this.salvataggioCompleto);
                    this.saveVersionLangVuota();
                    this.openNext()
                    this.updateNotification(true);
                    
                },
            },
            {
                text:this.$t('action.riprova'),
                cssClass:'modal-accept-button',
                handler: () => {
                    console.log("Riprovo");
                    this.alertOpen=false;
                    this.mediafetched=0;
                    this.mediaArray=[];
                    this.getMedia();
                    //this.saveinDB();
                    
                },
            },
        ],
      });
      await alert.present();
    },


    copyVLangs(vLangs){
      this.vLangs=vLangs;
    },

    saveVersionLang(){
      const dataPubb=JSON.parse(localStorage.getItem('pubblication'));
     const version =this.datetoVersion(dataPubb.pubblicazione);
    
      const langDate={
        lang:this.passedLang,
        vers:version
      }
      if(!localStorage.hasOwnProperty("versionLangs")){
        localStorage.setItem("versionLangs", JSON.stringify([langDate]));
      }else{
        this.versionLangs=langDate;
      }
      
    },
    saveVersionLangVuota(){
      const dataPubb=JSON.parse(localStorage.getItem('pubblication'));
     const version= 0;
    
      const langDate={
        lang:this.passedLang,
        vers:version
      }
      if(!localStorage.hasOwnProperty("versionLangs")){
        localStorage.setItem("versionLangs", JSON.stringify([langDate]));
      }else{
        this.versionLangs=langDate;
      }
      
    },

    testChiamata(){
      this.getinfo((info) => {
        this.publishedLang=info.lang.map(element => {
          console.log(element);
          return element.toLowerCase();
        });
      })

    },

    openDB(){
        this.request = indexedDB.open('mediaStore', global.dbVersion);
        this.request.onsuccess = event => {
          this.searchMedia();

          console.log("REQUEStt SUCCESS, "+ this.fromC)
          const db = event.target.result;
         
          /*db.onversionchange = function() {
            db.close();
            console.log("version changed");
          };*/

         // transaction = db.transaction(['media-'+this.lang],'readwrite');
          //objectStore = transaction.objectStore('media-'+this.lang);

        }
        
        this.request.onupgradeneeded = event => {
          console.log("REQUESR SUCCESS")
          const db = event.target.result;
          db.onversionchange = function() {
            db.close();
            console.log("version changed");
          };
          let objectStore;
          console.log('VEDO FROM? '+ this.fromC )
          if(this.fromC=="update" || this.fromC=="main" ){

            objectStore = request.transaction.objectStore('media-'+this.passedLang);
          }else{
            if(!db.objectStoreNames.contains('media-'+this.passedLang)){
              objectStore = db.createObjectStore('media-'+this.passedLang,  {keyPath: "name"});
            }
            
          }


        }
        
       
        this.request.onerror =  event => {
          console.log("error opening db dal mounted Error  ", event)
          alert("error opening db dal mounted")
        }
        this.request.onblocked=event=>{
          console.log("dal mounted  BLOCKED ",event)
      
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
      console.log("CHIAMATA DI TEST")

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
    console.log("lingua? "+ this.passedLang);
    const allschede=localStorage.getItem('allDataMostra');
    const schede=localStorage.getItem('dataMostra');
    let jsonSchede=allschede==null?JSON.parse(schede):JSON.parse(allschede);
    if(this.perc!=null){
      allschede==null && localStorage.setItem('allDataMostra',schede);
       jsonSchede=jsonSchede.filter(scheda=>scheda.percorsi.includes(this.perc))
      console.log("filtro per percorso scelto", jsonSchede)
      localStorage.setItem('dataMostra',JSON.stringify(jsonSchede));
    }
    

    let contenuto="";
    console.log("->>",jsonSchede);
    let counter=1;
    this.mediaCounter();
    this.mediatoGet.push(this.$store.getters.pubblication.img);
   // this.getMedia(this.$store.getters.pubblication.img);
    jsonSchede.forEach((scheda, index) => {
      console.log("n° ",counter++ )
      if(this.quotaExcided==false){
        if(scheda.img!=null){
          this.mediaCounter();
          this.mediatoGet.push(scheda.img);
            //this.getMedia(scheda.img)
        }else{
          console.log("Non ci sono immagini per la scheda ")
        }
        contenuto=scheda.content.find(el=> el.lang== this.passedLang )
        console.log("Cont ", contenuto);
        if(contenuto.audio!=null){
          if(!this.mediatoGet.includes(contenuto.audio)){
            this.mediaCounter();
            this.mediatoGet.push(contenuto.audio);
            //this.getMedia(contenuto.audio);
            console.log("Get audio ", contenuto.audio)
          }
            
        }else if(contenuto.video!=null && !this.mediatoGet.includes(contenuto.video) ){
         
            this.mediaCounter();
            this.mediatoGet.push(contenuto.video);
          //this.getMedia(contenuto.video);
          console.log("Get video ",contenuto.video)
        }else{
            console.log("Non ci sono Media per la scheda ")
        }
        if(contenuto.supportoVisuale!=null  && !this.mediatoGet.includes(contenuto.supportoVisuale) ){
            this.mediaCounter();
            this.mediatoGet.push(contenuto.supportoVisuale);
          //this.getMedia(contenuto.video);
          console.log("Get video Supporto ",contenuto.supportoVisuale)
        }

        // console.log('index', index, jsonSchede.length )
        if(index==jsonSchede.length-1){
          this.last=true;
          console.log('entro è last')
        }
      }
      

    });
    this.getMedia();


  },
   /* getmedia(name){
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


    },*/

    getMedia(){
      console.log("numero media contatore ", this.media );
      console.log("numero media ", this.mediatoGet.length);
      this.mediatoGet.forEach((name, index) => { 
        console.log("scarico media  index  ", index);
      const mediaRequest = fetch(this.$store.getters.baseUrl+"/upload/"+name).then(response => response.blob())
      .catch(err => { this.medianotDownloaded.push(name); console.log("sono in errore"+ name);this.erroreScaricamento();/*console.error(err);*/ /*alert('Errore nello scaricamnto');*/});
        mediaRequest.then(blob => {
          console.log("sono nel then della media request" );
          navigator.storage.estimate().then((estimate)=> {
            console.log("estimate ",estimate.quota," ",estimate )
            this.remainingquota=estimate.quota-estimate.usage;
            console.log("this.remainingquota ",  this.remainingquota)
            if(blob){
              console.log(" this.filesize ",   blob.size)
              if(this.remainingquota> this.stima+blob.size){
                this.stima+=blob.size;
                  console.log("CI STA ",name)
                  this.mediaArray.push({name:name, media:blob});
                  console.log("media scaricati "+ this.mediaArray.length);
                  this.incProgress();
                //  this.saveinDB(name, blob)
              }else{
                if(this.quotaExcided==false){
                  this.storageError();
                }
                console.log("NON CI STA ",name)
                this.quotaExcided=true;
                this.incProgress();
                console.log("progress ",  this.progress);
                if(this.progress==1){
                  this.openNext();
                }
              }
            }
             
            //if(this.medianotDownloaded.length==0){
              console.log("media scaricati "+ this.mediaArray.length+ " media da scaricare " + this.media);
              if(this.mediaArray.length==this.media){
                localStorage.setItem("dowloadcompleto", true);
                this.saveinDB();
              }
          /*  }else{
              console.log("devo riscaricare ", this.medianotDownloaded);
              this.getAgain();
            }*/
           
          });
          

        })
      });
      
    },

    erroreScaricamento(){
      console.log("devo riscaricare ", this.medianotDownloaded);
      if(this.alertOpen==false){
        this.errorDownloadAlert();
      }
     
     // this.getAgain(name);
    },

    getAgain(name){
      
      
      const mediaRequest = fetch(this.$store.getters.baseUrl+"/upload/"+name).then(response => response.blob())
      .catch(err => { this.medianotDownloaded.push(name); console.log("sono in errore"+ name);console.error(err); alert('Errore nello scaricamento');});
        mediaRequest.then(blob => {
          navigator.storage.estimate().then((estimate)=> {
            console.log("estimate ",estimate.quota," ",estimate )
            this.remainingquota=estimate.quota-estimate.usage;
            console.log("this.remainingquota ",  this.remainingquota)
            if(blob){
              console.log(" this.filesize ",   blob.size)
              if(this.remainingquota> this.stima+blob.size){
                this.stima+=blob.size;
                  console.log("CI STA ",name)
                  this.mediaArray.push({name:name, media:blob});
                  console.log("media scaricati "+ this.mediaArray.length);
                  this.incProgress();
                //  this.saveinDB(name, blob)
              }else{
                if(this.quotaExcided==false){
                  this.storageError();
                }
                console.log("NON CI STA ",name)
                this.quotaExcided=true;
                this.incProgress();
                console.log("progress ",  this.progress);
                if(this.progress==1){
                  this.openNext();
                }
              }
            }
                      
              console.log("media scaricati "+ this.mediaArray.length+ " media da scaricare " + this.media);
              if(this.mediaArray.length==this.media){
                this.saveinDB();
              }
          
           
          });
          

        })
     
      
    },

    async removeMedia(){
     
 
      const open = indexedDB.open('mediaStore',  global.dbVersion)

      open.onupgradeneeded = ()=>{
          const db = open.result
      }

      open.onsuccess = ()=> {
          const db = open.result
          const tx = db.transaction(['media-'+this.passedLang],'readwrite');
          const store = tx.objectStore(['media-'+this.passedLang])
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

    saveinDBPrecedente(name, blob){

      console.log("GDBV "+global.dbVersion+ ' type '+ typeof  global.dbVersion)
      const request = indexedDB.open('mediaStore', global.dbVersion);
      console.log( "REQUESTING ",global.dbVersion)
      let transaction;
      let objectStore;
      request.onsuccess = event => {

        console.log("REQUEStt SUCCESS, prvo a salvare "+ name,' ', this.fromC)
        const db = event.target.result;
        
        transaction = db.transaction(['media-'+this.passedLang],'readwrite');
        objectStore = transaction.objectStore('media-'+this.passedLang);
        
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
              if(this.progress==1){
                db.close();
                console.log("qui chiudevo");
                clearTimeout(this.timerScaricamento);
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
                this.incProgress();
                if(this.last==true){
                db.close();
              }
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

          objectStore = request.transaction.objectStore('media-'+this.passedLang);

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
        }/*else  if(this.fromC=="onboard" || this.fromC=="lang" ){ //check se usavo ono
          console.log("Arrivo da: ", this.fromC)
          objectStore = db.createObjectStore('media-'+this.passedLang, { keyPath: 'name' });
          objectStore.transaction.oncomplete = event => {
      
          
            const mediaObjectStore = db.transaction('media-'+this.passedLang, 'readwrite').objectStore('media-'+this.passedLang);

            //const videoObjectStore = db.transaction('videos', 'readwrite').objectStore('videos');
            // const newMedia=mediaObjectStore.add({name: name, blob: blob});
            /* newMedia.onsuccess = (event) =>{ già commentati 
            
            console.log(name+ " Successs");
              
            };
            newMedia.onerror = (event) =>{
            
              console.log(" ERROR in add " +name, event);
              alert( 'ERROR in add onb lang ' +name+' '+ event.target.error );
              
            };*/ 
         /* -- };

          objectStore.transaction.onerror= (event) => {
            console.log("error transaction in upgrade");
           // alert("error transaction in upgrade");
          }

        }*/
        
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

  saveinDB(){

    console.log("GDBV "+global.dbVersion+ ' type '+ typeof  global.dbVersion)
    const request = indexedDB.open('mediaStore', global.dbVersion);
    console.log( "REQUESTING ",global.dbVersion)
  
   
    request.onupgradeneeded = event => {
      console.log("UPGRADE eneeded");
      const db = event.target.result;
      db.onversionchange = function() {
        db.close();
        console.log("version changed");
      };
      let objectStore;
      console.log('VEDO FROM? '+ this.fromC )
      
      if(!db.objectStoreNames.contains('media-'+this.passedLang)){
        console.log("Apro object Store "+'media-'+this.passedLang);
       // objectStore = db.createObjectStore('media-'+this.passedLang,  {keyPath: "name"});
        db.createObjectStore('media-en',  {keyPath: "name"});
        db.createObjectStore('media-es',  {keyPath: "name"});
        db.createObjectStore('media-de',  {keyPath: "name"});
        db.createObjectStore('media-it',  {keyPath: "name"});
        db.createObjectStore('media-fr',  {keyPath: "name"});
      

      }
            
          
    }
    request.onsuccess = event => {

      console.log("REQUEStt SUCCESS, prvo a salvare "+ this.fromC)
      const db = event.target.result;
      
     const transaction = db.transaction(['media-'+this.passedLang],'readwrite');
      const store = transaction.objectStore('media-'+this.passedLang);
      

      this.mediaArray.forEach((el,index)=>{
        const file=store.get(el.name);
        file.onsuccess=(event)=>{
          const testget = event.target.result;      
          if (!testget) {
          
            console.log(" il file non presente "+el.name);
            const objectStoreRequest = store.add({name: el.name, blob: el.media});
            objectStoreRequest.onsuccess = (event) =>{
            // report the success of our request
            console.log(el.name+ " Successs");
              console.log("INDEX E ARR LENGH" +index+  " "+this.mediaArray.length);
              
              
              /*if(this.progress==1){
                this.openNext();
              }*/
            };
            objectStoreRequest.onerror=(event)=>{
                  console.log(" ERROR in add "+el.name , event);

                  alert( 'ERROR objectStoreRequest'+ el.name +' '+ event.target.error );
            }
            
          }else{
                console.log("file già presente "+el.name);
                //this.incProgress();
                if(this.last==true){
                //db.close();
              }
          }

          if(index==this.mediaArray.length-1){
            this.salvataggioCompleto=true;
            localStorage.setItem("salvataggioCompleto", this.salvataggioCompleto);
            this.saveVersionLang();
            this.incProgress();
            if(this.progress==1){
              db.close();
              console.log("qui chiudevo");
              clearTimeout(this.timerScaricamento);
            }
          }


      }

      transaction.onerror=()=>{
        console.log('ERROR transaction ', event);
          // alert( 'ERROR transaction '+name +' '+ event.target.error );
      }

      })
      /*const file=store.get(name);
      file.onsuccess=(event)=>{
          const testget = event.target.result;      
        if (!testget) {
        
          console.log(" il file non presente "+name);
          const objectStoreRequest = store.add({name: name, blob: blob});
          objectStoreRequest.onsuccess = (event) =>{
          // report the success of our request
          console.log(name+ " Successs");
            this.incProgress();
            if(this.progress==1){
              db.close();
              console.log("qui chiudevo");
            }
           
          };
          objectStoreRequest.onerror=(event)=>{
                console.log(" ERROR in add "+name , event);

                alert( 'ERROR objectStoreRequest'+ name +' '+ event.target.error );
          }
          
        }else{
              console.log("file già presente "+name);
              this.incProgress();
              if(this.last==true){
              db.close();
            }
        }


      }

      transaction.onerror=()=>{
        console.log('ERROR transaction '+name +' ', event);
          // alert( 'ERROR transaction '+name +' '+ event.target.error );
      }*/

    }

   

   /* request.onupgradeneeded = event => {
      console.log("REQUESR SUCCESS")
      const db = event.target.result;
      let objectStore;
      console.log('VEDO FROM? '+ this.fromC )
      if(this.fromC=="aggiorna" || this.fromC=="main" ){

        objectStore = request.transaction.objectStore('media-'+this.passedLang);

        const objectStoreRequest = objectStore.add({name: name, blob: blob});
        objectStoreRequest.onsuccess = (event) =>{
          // report the success of our request
          console.log(name+ " Successs");
          this.incProgress();
          
            
        };
        console.log('entroo')
      }
  
      console.log( " request.onupgradeneeded");
  
    }*/
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
      this.progress=Math.round(this.mediafetched/(this.media+1)*100 )/100;
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
      } else if(this.fromC=="lang" ||this.fromC=="perc"){
        if(this.fromC=="lang"){
          this.pushPage("lang");
        } 
        if(this.salvataggioCompleto==true){
          this.fromC=="lang"?this.emitter.emit('addLang',this.passedLang):this.emitter.emit('addPerc',this.perc);
          
        }
       
        
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