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
        mediaGeneral:[],
        mediatoGet:[],
        mediaArray:[],
        mediaArrayGen:[],
        medianotDownloaded:[],
        vLangs:[],
        stima:0,
        alertOpen:false,
        salvataggioCompleto:false,
        versionPercLangs:{},

        };
    },

    computed:{
      versionLangs:{
        get() {
         let versionLangs= [];
         let versionperc=null;
          if(localStorage.hasOwnProperty(('sPercLang'))){
            
            versionLangs=  JSON.parse(localStorage.getItem('sPercLang'));
            console.log("verisonii ",  versionLangs)
            versionperc= versionLangs.find(p=>p.perc==this.perc);
            this.copyVLangs(versionLangs, versionperc?versionperc.langs:versionperc);
            if(versionperc){
              console.log("linguee versionLangs ",  versionLangs)
           
            return versionperc.langs
            }
          
            
          }
          return null
          
        },
      // setter
      set(newLVersion) {
        console.log("faccio il set versin ",this.versionPercLangs)
        if(!this.versionPercLangs.find(p=>p.perc==this.perc)){
          const newperc= {"perc":this.perc,"langs":[newLVersion]};
          this.versionPercLangs.push(newperc);

        }else if(!this.vLangs.find(e=>e.lang==newLVersion.lang)){
          this.vLangs.push(newLVersion);
          console.log("verisonii  push",  this.vLangs)

        }else{
          const langIndex=this.vLangs.findIndex(e=>e.lang==newLVersion.lang);
          this.vLangs[langIndex].vers=newLVersion.vers;
          console.log("deve settare",  newLVersion.lang, this.vLangs, this.versionPercLangs[this.versionPercLangs.findIndex(p=>p.perc==this.perc)].langs)
          this.versionPercLangs[this.versionPercLangs.findIndex(p=>p.perc==this.perc)].langs=this.vLangs;
          console.log("verisonii  set",  this.versionPercLangs)
        }
        localStorage.setItem('sPercLang',JSON.stringify(this.versionPercLangs));
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
    this.versionLangs;
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
  async mounted(){
    this.db =await this.openDatabase();
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
                handler:async () => {
                    console.log("Riprovo");
                    await this.addDataToStore(this.db, 'media-' + this.passedLang, this.mediaArray);
                   // this.saveinDB();
                    
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


    copyVLangs(versionLangs,vLangs){
      this.versionPercLangs=versionLangs;
      this.vLangs=vLangs;
    },

    saveVersionLang(){
      const dataPubb=JSON.parse(localStorage.getItem('pubblication'));
     const version =this.datetoVersion(dataPubb.pubblicazione);
    
      const langDate={
        lang:this.passedLang,
        vers:version
      }
      if(!localStorage.hasOwnProperty("sPercLang")){
        const first= [{"perc":this.perc,"langs":langDate}]
        localStorage.setItem("sPercLang", JSON.stringify([first]));
      }else{
        console.log("save new version lang", langDate)
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
      if(!localStorage.hasOwnProperty("sPercLang")){
       const empty= [{"perc":this.perc,"langs":langDate}]

        localStorage.setItem("sPercLang", JSON.stringify([empty]));
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

     openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open  ('mediaStore', global.dbVersion);
      

        // Configurazione del database al primo avvio
        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            // Creare Object Store "general"
            if (!db.objectStoreNames.contains("general")) {
              db.createObjectStore('general',  {keyPath: "name"});
            }

            // Creare Object Store "media-it"
            if (!db.objectStoreNames.contains("media-it")) {
              db.createObjectStore('media-en',  {keyPath: "name"});
              db.createObjectStore('media-es',  {keyPath: "name"});
              db.createObjectStore('media-de',  {keyPath: "name"});
              db.createObjectStore('media-it',  {keyPath: "name"});
              db.createObjectStore('media-fr',  {keyPath: "name"});
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(`Errore nell'apertura del database: ${event.target.errorCode}`);
        };
    });
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
    let  counter=0;
    const allschede=localStorage.getItem('allDataMostra');
    const schede=localStorage.getItem('dataMostra');
    let jsonSchede=allschede==null?JSON.parse(schede):JSON.parse(allschede);
    if(this.perc!=null){
      allschede==null && localStorage.setItem('allDataMostra',schede);
       jsonSchede=jsonSchede.filter(scheda=>scheda.percorsi.includes(this.perc))
   //   console.log("filtro per percorso scelto", jsonSchede)
      localStorage.setItem('dataMostra',JSON.stringify(jsonSchede));
    }
    

    let contenuto="";
   // console.log("->>",jsonSchede);
    const percorsi=JSON.parse(localStorage.getItem('percorsi'));
    percorsi.forEach(perc=>{
      counter++;
      this.mediaCounter();
     // this.mediatoGet.push(perc.img);
      this.mediaGeneral.push(perc.img)
      if(perc.infomappa.img!=null){
        this.mediaGeneral.push(perc.infomappa.img);
        this.mediaCounter();
        counter++;
      }
     
    })
    
   // this.getMedia(this.$store.getters.pubblication.img);
    jsonSchede.forEach((scheda, index) => {
     // console.log("n° ",counter++ )
      if(this.quotaExcided==false){
        if(scheda.img!=null){
          this.mediaCounter();
          this.mediatoGet.push(scheda.img);
            //this.getMedia(scheda.img)
        }else{
          console.log("Non ci sono immagini per la scheda ")
        }
        contenuto=scheda.content.find(el=> el.lang== this.passedLang )
      //  console.log("Cont ", contenuto);
        if(contenuto.audio!=null){
          if(!this.mediatoGet.includes(contenuto.audio)){
            this.mediaCounter();
            this.mediatoGet.push(contenuto.audio);
            //this.getMedia(contenuto.audio);
           // console.log("Get audio ", contenuto.audio)
          }
            
        }else if(contenuto.video!=null && !this.mediatoGet.includes(contenuto.video) ){
         
            this.mediaCounter();
            this.mediatoGet.push(contenuto.video);
          //this.getMedia(contenuto.video);
          console.log("Get video ",contenuto.video)
        }else{
            console.log("Non ci sono Media per la scheda ", contenuto.titolo)
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
   

    getMedia() {
      console.log("Numero media contatore ", this.media);
      console.log("Numero media ", this.mediatoGet.length, this.mediaGeneral.length);

      const fetchMedia = (array, targetArray, notDownloadedArray) => {
        return array.map((name) => {
          console.log("Scarico media ", name);

          return fetch(this.$store.getters.baseUrl + "/upload/" + name)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Errore nel fetch per ${name}`);
              }
              return response.blob();
            })
            .then((blob) => {
              if (blob) {
                console.log("Blob scaricato per ", name);
                targetArray.push( {name:name, media:blob});
               
                this.incProgress();
              }
            })
            .catch((err) => {
              console.error(`Errore nello scaricamento di ${name}: `, err);
              notDownloadedArray.push(name);
              this.erroreScaricamento();
            });
        });
      };

      // Avvia i download per entrambi gli array
      const mediaGeneralPromises = fetchMedia(
        this.mediaGeneral,
        this.mediaArrayGen,
        this.medianotDownloaded
      );

      const mediaToGetPromises = fetchMedia(
        this.mediatoGet,
        this.mediaArray,
        this.medianotDownloaded
      );

      // Attendi che tutti i fetch siano completati
      Promise.all([...mediaGeneralPromises, ...mediaToGetPromises])
        .then(() => {
          console.log(
            "Download completato: ", this.mediaArrayGen.length + this.mediaArray.length,  " media da scaricare: ",
            this.media);

          if (this.mediaArrayGen.length + this.mediaArray.length === this.media) {
            localStorage.setItem("dowloadcompleto", true);
            this.salvaArrayneldb(); // Chiama la funzione finale
          } else {
            console.log("Alcuni media non sono stati scaricati: ", this.medianotDownloaded);
            //this.getAgain(); // Eventuale funzione di retry
          }
        })
        .catch((err) => {
          console.error("Errore durante il download dei media: ", err);
        });
    },

    async salvaArrayneldb(){
      console.log("inizio a salvare nel db")
      await this.addDataToStore(this.db, "general", this.mediaArrayGen);
      await this.addDataToStore(this.db, "media-"+this.passedLang, this.mediaArray);
      this.db.close();
    },

    erroreScaricamento(){
      console.log("devo riscaricare ", this.medianotDownloaded);
      if(this.alertOpen==false){
        this.errorDownloadAlert();
      }
     
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

                this.addDataToStore(this.db,"media-"+this.passedLang, this.mediaArray)
                //this.saveinDB();
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

  addDataToStore(db, storeName, dataArray) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        dataArray.forEach((el, index) => {
          const getRequest = store.get(el.name);
          getRequest.onsuccess = function (event) {
              if (event.target.result) {
                  console.log(`Elemento con nome${el.name} già presente nello store '${storeName}'`);
                 // resolve(); // Elemento già presente, ignoriamo l'aggiunta
              } else {
                  // Aggiungi l'elemento se non esiste
                  console.log("elemento", el)
                  const addRequest = store.add({name: el.name, blob: el.media});
                  addRequest.onsuccess = function () {
                      console.log(`Elemento con nome ${el.name} aggiunto allo store '${storeName}'`);
                      resolve();
                  };
                  addRequest.onerror = function (event) {
                      console.error(`Errore nell'aggiungere l'elemento con nome ${el.name}: ${event.target.error}`);
                      reject(event.target.errorCode);
                  };
              }
          };
            
          if(storeName!="general" && index==this.mediaArray.length-1){
            this.salvataggioCompleto=true;
            localStorage.setItem("salvataggioCompleto", this.salvataggioCompleto);
            this.saveVersionLang();
            this.incProgress();
            if(this.progress==1){
             // db.close();
              console.log("qui chiudevo");
              clearTimeout(this.timerScaricamento);
            }
          }
        });

        transaction.oncomplete = function () {
          console.log("completato", storeName)
            resolve();
        };

        transaction.onerror = function (event) {
            reject(`Errore nella transazione: ${event.target.errorCode}`);
        };
    });
},
  saveinDB(){

    console.log("GDBV "+global.dbVersion+ ' type '+ typeof  global.dbVersion)
    const request = indexedDB.open('mediaStore', global.dbVersion);
    console.log( "REQUESTING ",global.dbVersion)
  
    request.onupgradeneeded = (event) => {
      console.log("UPGRADE eneeded");
      const db = event.target.result;
      const storeName = 'media-' + this.passedLang;
      db.onversionchange = function() {
        db.close();
        console.log("version changed");
      };
      if(!db.objectStoreNames.contains('media-'+this.passedLang)){
        console.log("Apro object Store "+'media-'+this.passedLang);
        db.createObjectStore('general',  {keyPath: "name"});
        db.createObjectStore('media-en',  {keyPath: "name"});
        db.createObjectStore('media-es',  {keyPath: "name"});
        db.createObjectStore('media-de',  {keyPath: "name"});
        db.createObjectStore('media-it',  {keyPath: "name"});
        db.createObjectStore('media-fr',  {keyPath: "name"});

      }
            
          
    }
    request.onsuccess = event => {
      const db = event.target.result;

      const transactionGeneral = db.transaction("general",'readwrite');
      const storeGeneral = transactionGeneral.objectStore('general');

      this.mediaArrayGen.forEach((el,index)=>{
          const objectStoreRequest = storeGeneral.add({name: el.name, blob: el.media});
          objectStoreRequest.onsuccess = (event) =>{
            // report the success of our request
            console.log(el.name+ " Successs");
            };
            objectStoreRequest.onerror=(event)=>{
                console.log(" ERROR in add "+el.name , event);
            }
        })

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