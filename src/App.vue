<template>
  <ion-app>
    <ion-router-outlet ref="routerOuteletRef" id="main-content"></ion-router-outlet>
  </ion-app>
   <loader v-if="loading"/>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref, provide } from "vue";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { HeaderColor } from "@ionic-native/header-color/ngx";
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
 import { loadScript } from "vue-plugin-load-script";
//constructor(private screenOrientation: ScreenOrientation) { }
import Loader from "./components/Loader.vue"
import common from "./js/common"

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
 
  created(){
    this.setInactiveTour=common.setInactiveTour;
    this.updateNotification=common.updateNotification;
    this.getNotificationState=common.getNotificationState;
  
    window.document.addEventListener("visibilitychange", ()=> {
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
        
    const routerOuteletRef = ref(null);
    provide("routerOutlet", routerOuteletRef);
    //this.setInactiveTour();
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
        const JSONstring= JSON.stringify(this.evendata(filtered));
        localStorage.removeItem('dataMostra');
        localStorage.setItem('dataMostra',JSONstring );
        //this.searchMedia(JSONstring);
        if(from!="menu"){
          this.$router.replace({ path: "/scarica/"+ localStorage.getItem('lang')});
        }
       
      
      });
        
    },

    evendata(data){
      const lang=this.infoPubbl.lang.filter( ( el ) =>{
        return el!=process.env.VUE_APP_LANG_DEFAULT;
      });
      console.log("lang filter", this.infoPubbl.lang, " ", lang )
      if(lang.length>0){
        data.forEach(scheda => {
        lang.forEach(lang => {
         const contenuto=scheda.content.find(el=> el.lang==lang);
            // console.log("Cont ", contenuto);
            console.log("Conttype ", contenuto.type);
            const contenutodefault=scheda.content.find(el=> el.lang==process.env.VUE_APP_LANG_DEFAULT);
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

     searchMedia(schede){
       console.log("I MEDIA SONO: "+ this.media);
       console.log("progresss: "+ this.media);
       const currLang=localStorage.getItem('lang');
      const jsonSchede=JSON.parse(schede);
      let contenuto="";
      console.log("->>", jsonSchede);
      jsonSchede.forEach(scheda => {
        if(scheda.img!=null){
          this.mediaCounter();
          this.getmedia(scheda.img)
        }else{
          console.log("Non ci sono immagini per la scheda ")
        }
        contenuto=scheda.content.find(el=> el.lang==currLang )
        //console.log("Cont ", contenuto);
        if(contenuto.audio!=null){
           this.mediaCounter();
          this.getmedia(contenuto.audio);
           //console.log("Getaudio ")
        }else if(contenuto.video!=null){
         this.mediaCounter();
          this.getmedia(contenuto.video);
          //console.log("Getvideo ")
        }else{
           console.log("Non ci sono Media per la scheda ")
        }

      });
    },
    getmedia(name){
     console.log("numero di media "+ this.media );
     // fetch(this.$store.getters.baseUrl+"/inventario/download.php?id="+name+"&link=1")
      fetch(this.$store.getters.baseUrl+"/upload/"+name)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        console.log("OK Resp", response);
        if(response.status==200){
          this.mediafetched++
        }
        this.progress=this.mediafetched/this.media;
        console.log("progress ",  this.progress);
        if(this.progress==1){
          this.emitter.emit("fineAggiornamento");
           this.$router.push({ name: "wave" });
        }
        return response
      })
      .catch(error => console.log(error))
    },

    mediaCounter(){
      this.media++;
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