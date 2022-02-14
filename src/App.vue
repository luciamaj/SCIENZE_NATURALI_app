<template>
  <ion-app>
    <ion-router-outlet ref="routerOuteletRef" id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref, provide } from "vue";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { HeaderColor } from "@ionic-native/header-color/ngx";



const { StatusBar } = Plugins;
const { Storage } = Plugins;

// TODO: open -a Google\ Chrome --args --disable-web-security --user-data-dir --------> PER APRIRE IN DEBUG

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  data() {
    return {
      mostra:"",
      pubblicazione:"",
      refreshing: false,
      worker: null,
      updateExists: false, 
      media:0,
      progress:0,
      mediafetched:0,
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
     document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
      this.emitter.on('aggiorna', _ => {
      this.aggiorna();
    });

  },
  mounted() {
    const routerOuteletRef = ref(null);
    provide("routerOutlet", routerOuteletRef);
   
    this.getinfo((info) => {
      console.log("info", info);
      this.mostra=info.mostra;
      this.pubblicazione=info.pubblicazione;
   
      if(localStorage.getItem('version')==null ||localStorage.getItem('version')=="" ){
        console.log("versione VUOTA");
         
        localStorage.setItem('version', info.pubblicazione);
        this.scaricaInfoMostra();
       
    
      }else{
        if(localStorage.getItem('version')!=info.pubblicazione){
          console.log("versione cambiata")///controllare e fare apparire popup di aggiornamento
          this.emitter.emit('changeVersion');
         
        }else{
          console.log("versione uguale");
          const dataMostra=localStorage.getItem('dataMostra')
          this.setData(dataMostra);
         
        }
      
      }
   
        const ogg=localStorage.getItem('dataMostra')


        console.log("schede salvate "+ ogg);
    });

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

       fetch("https://dataoversound.eadev.it/dataoversound-swi/service/rest/v1/mostra-attiva")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`)
        }
        return response.json()
      })
      .then(data => {
        callback(data.result[0]);
      })
      .catch(error => console.log(error))

    },
    getSchede(callback){
      fetch("https://dataoversound.eadev.it/dataoversound-swi/service/rest/v1/app-schede-audible")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`)
        }
        return response.json()
      })
      .then(data => {
       // console.log("schede", data.result);
         callback(data.result);
      
      })
      .catch(error => console.log(error))
    },

    aggiorna(){
      console.log("aggiorno pubblicazione");
      localStorage.setItem('version', this.pubblicazione);
      localStorage.removeItem('dataMostra');
      this.aggiornaInfo();
     // const newData= localStorage.getItem('dataMostra');
     
    },
    scaricaInfoMostra(){
      this.getSchede((schede) => {
      
        console.log("schede info", schede);
        const retrivedinfo = schede;
        const filtered= retrivedinfo.filter( x => (x.mostra == this.mostra));
      
        console.log("Filtered " , filtered);
        const JSONstring= JSON.stringify(filtered);
        
      localStorage.setItem('dataMostra',JSONstring );
     
      
      });
        
    },
    aggiornaInfo(){
      this.getSchede((schede) => {
      
        console.log("schede info", schede);
        const retrivedinfo = schede;
        const filtered= retrivedinfo.filter( x => (x.mostra == this.mostra));
      
        console.log("Filtered " , filtered);
        const JSONstring= JSON.stringify(filtered);
        
       localStorage.setItem('dataMostra',JSONstring );
       this.searchMedia(JSONstring);
      
      });
        
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
        console.log("Cont ", contenuto);
        if(contenuto.audio!=null){
           this.mediaCounter();
          this.getmedia(contenuto.audio);
           console.log("Getaudio ")
        }else if(contenuto.video!=null){
         this.mediaCounter();
          this.getmedia(contenuto.video);
          console.log("Getvideo ")
        }else{
           console.log("Non ci sono Media per la scheda ")
        }

      });
    },
    getmedia(name){
     console.log("numero di media "+ this.media );
     // fetch("https://dataoversound.eadev.it/dataoversound-swi/inventario/download.php?id="+name+"&link=1")
      fetch("https://dataoversound.eadev.it/dataoversound-swi/upload/"+name)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`)
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
      .then(data => {
       //console.log("media", data);
        
      
      })
      .catch(error => console.log(error))
    },

    mediaCounter(){
      this.media++;
    }
  },
 
});
</script>

<style >
body{
   font-family: "Open Sans", sans-serif;
}
</style>