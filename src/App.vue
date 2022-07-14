<template>
  <ion-app>
    <ion-router-outlet ref="routerOuteletRef" id="main-content"></ion-router-outlet>
  </ion-app>
  <KeepAlive>
    <loader v-if="loading"/>
  </KeepAlive>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref, provide } from "vue";
import { Plugins, StatusBarStyle } from "@capacitor/core";

//constructor(private screenOrientation: ScreenOrientation) { }
import Loader from "./components/Loader.vue"
import common from "./js/common"
import {global} from './js/global'
const { StatusBar } = Plugins;
const { Storage } = Plugins;

// TODO: open -a Google\ Chrome --args --disable-web-security --user-data-dir --------> PER APRIRE IN DEBUG

export default defineComponent({
  
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    Loader,
  },
  data() {
    return {
      infoPubbl:{},
      mostra:"",
      pubblicazione:"",
      refreshing: false,
      worker: null,
      updateExists: false, 
      media:0,
      progress:0,
      mediafetched:0,
      loading: true
    };
  },
  ionViewWillEnter() {
    this.statusBar.styleDarkContent();
    this.statusBar.backgroundColorByHexString("#fff");

    StatusBar.setStyle({
      style: StatusBarStyle.Dark
    });

    StatusBar.setBackgroundColor({
      color: "#FFF"
    });

  },
  beforeCreate(){
    const r = document.querySelector(':root');
   
    r.style.setProperty('--ion-color-primary', (this.swiConf.colori.secondario!="") ? this.swiConf.colori.secondario : r.getPropertyValue('--ion-color-secondary') );
    r.style.setProperty('--ion-color-secondary',  (this.swiConf.colori.primario!="") ? this.swiConf.colori.primario : r.getPropertyValue('--ion-color-primary'));
    r.style.setProperty('--ion-color-primary-whitened', (this.swiConf.colori.secondario_opacizzato !="") ? this.swiConf.colori.secondario_opacizzato  : r.getPropertyValue('--ion-color-secondary-whitened'));
    r.style.setProperty('--ion-color-secondary-whitened', (this.swiConf.colori.primario_opacizzato !="") ? this.swiConf.colori.primario_opacizzato  : r.getPropertyValue('--ion-color-primary-whitened'));
    
  },
  created(){
   
    console.log("APP"+ this.conf.nameMuseum);
    this.setInactiveTour=common.setInactiveTour;
    this.updateNotification=common.updateNotification;
    this.getNotificationState=common.getNotificationState;
  
    window.document.addEventListener("visibilitychange", ()=> { this.mostra
      console.log('VISIBILITY CHANGE', window.document.visibilityState);
      if(window.document.visibilityState=="visible"){ 
        this.getinfo((info) => {
          this.pubblicazione=info.pubblicazione;
          this.infoPubbl=info;
          this.infoPubbl.lang= this.infoPubbl.lang.map(element => {
            return element.toLowerCase();
          });
        });
        this.savedPubblication=JSON.parse(localStorage.getItem('pubblication'));
        if(this.savedPubblication.pubblicazione!= this.pubblicazione){
          this.getNotificationState().then(state=>{
            if(state==false ||state==null){
              this.emitter.emit('changeVersion');
              this.updateNotification(true);

            }
          })
         

        }
      }
     
    });
    
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });

    this.emitter.on('aggiorna',(from) => {
      this.aggiorna(from);
    });

  },
 
  mounted() {
       this.currLang=localStorage.getItem('lang');  
    const routerOuteletRef = ref(null);
    provide("routerOutlet", routerOuteletRef);
    this.setInactiveTour();
    this.getinfo((info) => {
      console.log("info", info);
      this.infoPubbl=info;
      this.infoPubbl.lang= this.infoPubbl.lang.map(element => {
        return element.toLowerCase();
      });
      this.mostra=info.mostra;
      this.pubblicazione=info.pubblicazione;
      this.savedPubblication=JSON.parse(localStorage.getItem('pubblication'));
     
      if(this.savedPubblication==null ||this.savedPubblication=="" ){
        console.log("versione VUOTA");
         
        localStorage.setItem('pubblication', JSON.stringify(info));
        this.scaricaInfoMostra();
       
    
      }else{
        if(this.savedPubblication.pubblicazione!= this.pubblicazione){
          console.log("versione cambiata")///controllare e fare apparire popup di aggiornamento
          this.emitter.emit('changeVersion');
          this.updateNotification(true);
         
        }else{
          console.log("versione uguale");
          const dataMostra=localStorage.getItem('dataMostra')
          this.setData(dataMostra);
         
        }
      
      }
   
        const ogg=localStorage.getItem('dataMostra')


        console.log("schede salvate "+ ogg);
    });
    
   setTimeout(() => {
        this.loading = false
        this.schedaState(false);
    }, 1500);

  },


  methods:{

    async setData(param) {
     
      await Storage.set({
        key: "dataSchede",
        value:JSON.stringify(param) 
      });
    },
    async getData() {
      const ret = await Storage.get({ key: "dataSchede" });
      console.log(ret);
    },

    showRefreshUI(e) {
      // Display a button inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      if (e.detail) {
        this.worker = e.detail;
        this.updateExists = true;
        console.log("Showing refresh button.");
        console.log(this.worker);
      } else {
        console.warn("No worker data found!");
      }
    },
    

    getinfo(callback){
      //if (store.getters.baseUrl) {
      
       fetch(this.$store.getters.baseUrl+"/service/rest/v1/mostra-attiva")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        callback(data.result[0]);
      })
      .catch(error => console.log(error))

    },
    getSchede(callback){
      fetch(this.$store.getters.baseUrl+"/service/rest/v1/app-schede-audible")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
       // console.log("schede", data.result);
         callback(data.result);
      
      })
      .catch(error => console.log(error))
    },

    aggiorna(from){
      console.log("aggiorno pubblicazione");
      const prevPubb= JSON.parse(localStorage.getItem("pubblication"));
      console.log(prevPubb.mostra+"  mostre "+this.infoPubbl.mostra);
     console.log("sono uguali? ",prevPubb.mostra!=this.infoPubbl.mostra)
      if(prevPubb.mostra!=this.infoPubbl.mostra){
        this.mostraCambiata=true;
        this.mostra=this.infoPubbl.mostra
      }else{
         this.mostraCambiata=false;
      }
      localStorage.setItem('pubblication', JSON.stringify(this.infoPubbl));
      this.aggiornaInfo(from);
     // const newData= localStorage.getItem('dataMostra');
     
    },
    scaricaInfoMostra(){
      this.getSchede((schede) => {
      
        console.log("schede info", schede);
        const retrivedinfo = schede;
        const filtered= retrivedinfo.filter( x => (x.mostra == this.mostra));
      
        console.log("Filtered " , filtered);
        
        const JSONstring= JSON.stringify(this.evendata(filtered));
        
        localStorage.setItem('dataMostra',JSONstring );
      
      });
        
    },
    aggiornaInfo(from){
     
      this.getSchede((schede) => {
      
        console.log("schede info", schede);
        const retrivedinfo = schede;
        const filtered= retrivedinfo.filter( x => (x.mostra == this.mostra));
      
        console.log("Filtered " , filtered);
        const newSchede=this.evendata(filtered)
        const JSONstring= JSON.stringify(newSchede);
        if(this.mostraCambiata==false){
          console.log('mostra uguiale');
            const oldData=JSON.parse(localStorage.getItem('dataMostra'));
            const conttoRemove=[]
            newSchede.forEach(scheda => {
              const coincide= oldData.find(oldscheda=> oldscheda.tag==scheda.tag)
              if(coincide){
                console.log("presente ");
               const contenutoNew= scheda.content.find(el=> el.lang== this.currLang)
               const contenutoOld=coincide.content.find(el=> el.lang== this.currLang)
               console.log( scheda.tag+" - "+ contenutoOld+" - "+ contenutoNew);
               if(contenutoOld.type!=contenutoNew.type){
                 if(contenutoNew.type=='audio'){
                    conttoRemove.push(contenutoOld.video);

                 }else{
                    conttoRemove.push(contenutoOld.audio);
                 }
                
               }else{
                 if(contenutoOld.audio!=contenutoNew.audio){
                   conttoRemove.push(contenutoOld.audio);
                 }
                 if(contenutoOld.video!=contenutoNew.video){
                    conttoRemove.push(contenutoOld.video);
                 }
               }
              }
              
            });

            console.log("CONTENUTI DA RIMUOVERE ",conttoRemove)
            localStorage.setItem('conttoRemove',conttoRemove );
            this.endAggiornamento(JSONstring , from)

        }else{
          this.clearStore().then(()=>{
            this.endAggiornamento(JSONstring , from)
          });
        }
      
       /* localStorage.removeItem('dataMostra');
        localStorage.setItem('dataMostra',JSONstring );
        
        if(from!="menu"){
          this.$router.replace({ name: "scarica", params:{ lang:this.currLang ,  fromC:'aggiorna'}});
        }*/
       
      
      });
        
    },

    endAggiornamento(datatoSave,from){
      localStorage.removeItem('dataMostra');
      localStorage.setItem('dataMostra', datatoSave );
      if(from!="menu"){
        this.$router.replace({ name: "scarica", params:{ lang:this.currLang ,  fromC:'aggiorna'}});
      }
    },

    evendata(data){
      const lang=this.infoPubbl.lang.filter( ( el ) =>{
        return el!=this.conf.langDefault;
      });
      console.log("lang filter", this.infoPubbl.lang, " ", lang )
      if(lang.length>0){
        data.forEach(scheda => {
          lang.forEach(lang => {
            const contenuto=scheda.content.find(el=> el.lang==lang);
              // console.log("Cont ", contenuto);
              console.log("Conttype ", contenuto.type);
              const contenutodefault=scheda.content.find(el=> el.lang==this.conf.langDefault);
              if(contenuto.type==null) {
                    
                console.log("Non ci sono Media per la scheda  in "+ lang)
              
                console.log("contenutoita "+ contenutodefault.type)
                if(contenutodefault.type!=null){
                  contenuto.type=contenutodefault.type
                }

                if(contenutodefault.type=="audio") {
                  contenuto.audio=contenutodefault.audio;
                  console.log("Getaudio default ")
                }else if(contenutodefault.type=="video"){
                  contenuto.video=contenutodefault.video;
              
                  console.log("Getvideo default ")
                }
                
              }
              if(contenuto.titolo==null){
                contenuto.titolo=contenutodefault.titolo;
              }
              if(contenuto.testo==null){
                contenuto.testo=contenutodefault.testo;
              }

         });
        });
        
      }
      return data
    },

    

  incrementdb(){
    const newdbV=global.dbVersion+1
    global.dbVersion=newdbV;
    console.log("WEN DBV"+newdbV)
    localStorage.setItem("dbVersion",newdbV);

  },
   async clearStore(){
     this.incrementdb();
    console.log("global.dbVersion" +global.dbVersion)
      
    
      const open = indexedDB.open('mediaStore',  global.dbVersion)

     /* open.onupgradeneeded = ()=>{
         console.log("request onupgradeneeded")
           const db = open.result

            objectStore = open.transaction.objectStore('media-'+this.lang);
            const clearRequest =store.clear();
          
            clearRequest.onsuccess = event=> {
              console.log("clearRequest SUCCEESS")
              db.deleteObjectStore(['media-'+ this.currLang]);
              db.close()
            }
                  
           // db.deleteObjectStore(['media-'+ this.currLang]);
          /*const tx = db.transaction(['media-'+ this.currLang],'readwrite');
          const store = tx.objectStore(['media-'+ this.currLang])
          const clearRequest =store.clear();
          

        tx.oncomplete = ()=> {
           localStorage.removeItem('schede_viste');
          // localStorage.setItem('savedLangs','')
           console.log("tx SUCCEESS")
         
        }
        clearRequest.onsuccess = event=> {
          console.log("clearRequest SUCCEESS")
           db.deleteObjectStore(['media-'+ this.currLang]);
          db.close()
        }
      }*/

      open.onsuccess = ()=> {
        const db = open.result
        console.log("ILDB ", db);
        db.objectStoreNames.forEach(objStore => {
          console.log("obstores ",objStore)
          const tx = db.transaction([objStore],'readwrite');
          const store = tx.objectStore([objStore])
          const clearRequest =store.clear();

          tx.oncomplete = ()=> {
        
            // localStorage.setItem('savedLangs','')
            /*db.deleteObjectStore(['media-'+ this.currLang]);
            db.close()*/
            
          }

          clearRequest.onsuccess = event=> {
            localStorage.removeItem('schede_viste');
            console.log("clearRequest SUCCEESS")
            //  db.deleteObjectStore(['media-'+ this.currLang]);
            //db.close()
          }

        });

      }
     
      open.onerror = (err)=> {
          
        console.error('Error to clear store: ',err)
      }
         

    },
    
    async schedaState(state) {
      await Storage.set({
        key: 'openScheda',
        value:state
      });
    },
   
   /* async updateNotification(state) {
      console.log("Update");
      await Storage.set({
        key: 'update',
        value:state
      });
    },*/
  },
 
});
</script>

<style >
body{
   font-family: "Open Sans", sans-serif;
}
</style>