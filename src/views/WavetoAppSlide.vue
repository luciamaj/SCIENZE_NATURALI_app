<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar  class="toolbar">
        <ion-title :key="percKey" slot="start"  class="main-title"> {{getpercselinlang()}}</ion-title>
        <ion-buttons slot="end" v-if="history==true" >
              <ion-button color="secondary"  @click="openHistory()" class="collection-button">
                <ion-icon  size="large" name="file-tray-full-outline" class="history-icon"></ion-icon>
                <!--ion-label color="dark">{{$t('raccolta.title')}}</ion-label-->
              </ion-button>
        </ion-buttons>
      <!--ion-button expand="block" class="capture-btn" @click="opensubs()" id="captureStart">subs</ion-button-->
        
        <ion-buttons slot="end">
          <ion-button @click="openMenuModal(notification)">
            <ion-icon slot="start" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
            <ion-badge  mode="ios" id="badge" color="warning" class="notification" :class="{showNotification:notification}">0</ion-badge>
          </ion-button>
        </ion-buttons>
       
      </ion-toolbar> 
    </ion-header>
  
    <ion-content :fullscreen="true">
     <!--ion-modal :is-open="true" :swipe-to-close="true">
  <ion-content>Modal Content</ion-content>
</ion-modal-->
      <div class="vertical-center view-wwave-container">
        <div class="center" :key="percKey">
          <div class="slide-percorsi">

            <template v-if="infoPercorsi.length>1">
              <ion-slides :options="slideOpts" pager="true">
                <ion-slide v-for="(percorso,index) in infoPercorsi" v-bind:key="(percorso,index)">
                  <div class="logo-container" v-on:click="select(percorso)">
                    <img  :id="'logo'+index" class="percosoImg logo" :class="{ 'percorsoAttivo':checkIfActive(percorso.percorso, index) }" :src=" this.$store.getters.baseUrl+'/upload/'+percorso.img"/>
                    <div v-if="!checkIfActive(percorso.percorso, index)" class="overlay-opaco"> Clicca per attivare</div>
                    <capting :class="iscapting" id="captingIcon" hidden></capting>
                  </div>
                </ion-slide>
              </ion-slides>
            </template>
            <template v-else>
              <div class="logo-container" ><img  :id="'logo'+index" class="percosoImg percorsoAttivo logo" :src=" this.$store.getters.baseUrl+'/upload/'+percselInfo.img"/></div>


            </template>
          </div>
        
        
          <!--div class="logo-container" id="mostra"><img  id="logo" class="logo" :src="logo"/>
        </div-->

          <div class="buttons" :key="percKey">
          <!--ion-button expand="block" class="capture-btn" @click="callJava" id="captureStart">{{$t('main.start')}}</ion-button-->
        
          <template v-if="infoPercorsi!=null && percselInfo.hasOwnProperty('pulsanti') && percselInfo.pulsanti!=null" >
            <ion-button  v-if="percselInfo.pulsanti.includes('Silence_tag')" expand="block" class="capture-btn" @click="callJava" id="captureStart"><img class="icon-button" src="assets/background/onda.png"></ion-button>
            <ion-button  v-if="percselInfo.pulsanti.includes('Silence_tag')" expand="block" class="capture-btn" id="captureStop" hidden><img class="icon-button" src="assets/background/onda.png"/></ion-button>
            <ion-button  v-if="percselInfo.pulsanti.includes('Qr_code')" expand="block" class="scan-btn" @click="openModal"><img class="icon-button" src="assets/background/qrI.png"></ion-button>
            <ion-button  v-if="percselInfo.pulsanti.includes('Geo_tag') && conf.gps==true" expand="block" class="gps-btn" id="testGps" @click="opengps" ><img class="icon-button" src="assets/background/gpsicon.png"></ion-button>
          
          </template>
          <template v-else>
            <ion-button expand="block" class="capture-btn" @click="callJava" id="captureStart"><img class="icon-button" src="assets/background/onda.png"></ion-button>
            <ion-button expand="block" class="capture-btn" id="captureStop" hidden><img class="icon-button" src="assets/background/onda.png"/>  </ion-button>
            <ion-button expand="block" class="scan-btn" @click="openModal"><img class="icon-button" src="assets/background/qrI.png"></ion-button>
            <ion-button expand="block" v-if="conf.gps==true" class="gps-btn" id="testGps" @click="opengps" ><img class="icon-button" src="assets/background/gpsicon.png"></ion-button>
          </template>
          </div>
         
          <!--div class="wait-tag"> </div-->
        </div>
      </div>
    </ion-content>
    
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  modalController,
  alertController,
  IonBadge, 
  IonSlides, IonSlide 
  //IonModal
  
} from "@ionic/vue";

import Scanner from "./Scanner.vue";
//import Capting from "@/components/Capting.vue";
import Capting from "@/components/Captingv2.vue";
import Download from '@/components/ScaricamentoContenuti.vue';
import Nav from "../components/Nav.vue";
import { Plugins } from "@capacitor/core";
import Subtitles from "./Subtitles.vue";
import { useRouter } from "vue-router";
import common from "../js/common"
import { ref, onMounted, watch } from 'vue';


const { Storage } = Plugins;


export default {
  name: "Tab",
  data() {
    return {
      decodedValue: "",
      name: "AUDIBLE MUSEUM",
      store:"",
      notification:false,
     ntag:"",
     playing:false,
     percSel:"",
     currLang:"",
     percKey:0,
     slideOpts: {
        initialSlide: 0,
        speed: 400,
      },
      pagination: {
      el: '.swiper-pagination',
      clickable: true,
      percselInfo:"",
    },
    };
  },

  
  ionViewWillEnter(){
   
   this.getTour().then(x => {
    this.tour=x;
   
    console.log("upTour ", this.tour)
    if(this.tour){
        //const captureStart = document.getElementById("captureStart");
        this.captureStart = document.getElementById("captureStart");
        this.captureStop = document.getElementById("captureStop");
        this.captureStart.hidden = true;
        this.captureStop.hidden = false;
    
       
         //captureStart.click();
    }
    } );
   

  },
  mounted(){
    this.store=JSON.parse(localStorage.getItem('pubblication'));
    this.captureStart = document.getElementById("captureStart");
    this.captureStop = document.getElementById("captureStop");
    console.log("Capture start stop", this.captureStart , this.captureStop)
    this.captingIcon = document.getElementById("captingIcon");
    this.logoi = document.getElementById("logo");
    this.currLang=localStorage.getItem("lang")
    this.percselInfo=this.getpercselInfo();
    this.percSel=this.percselInfo.percorso;
    this.pubblication=JSON.parse(localStorage.getItem('pubblication'))
  

   // this.anima=document.getElementById("anima");
   // this.mostra=document.getElementById("mostra");

    /* window["answMessage"] = (tag) => {
      this.answMessage(tag);
      console.log("nella HOME!!");

    };*/

    this.captureStop.addEventListener("click", ()=> {
      try{
        AndroidObject.executeJavaCode(false);//aggiungere parametro  false
      }catch(e){
        console.log(e);
      }

      clearTimeout(this.waitingTime);
      this.setInactiveTour();
      this.schedaState(false);
      this.decodedValue = "stopped recording";
      this.captureStart.hidden = false;
      this.captureStop.hidden = true;

      this.logoi.hidden = false;
      this.captingIcon.hidden = true;
      this.emitter.emit('stopCapting');
     
    });
    watch(() => localStorage.getItem('lang'), (newLang) => {
      console.log("WATCHOOOOOOOOOOOO",newLang)
    this.currLang = newLang;
   // this.percSel = this.getpercselinlang();
  });
    
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.updateTitle);
    console.log("infopercorsi",this.infoPercorsi)
    
  },
  computed:{


    interactionMode(){
      console.log("interactionMode "+this.conf.interactionMode );
      return this.conf.interactionMode;
    },
    logo() {
      const img=this.store.img;
      if (img) {
        console.log("c'è logo");
        return this.$store.getters.baseUrl+"/upload/"+img;
      } else {
        return '/assets/background/dos.png'
       
      }
     
    },
    history(){
      if(this.swiConf.abilita_archivio==1){
        return true;
      }else{
        return false;
      }
      
    },

    infoPercorsi() {
      
      const percorsi=common.getElencoPercorsi();
      if(percorsi){
        return percorsi;
      }else{
        return null
      }
       

    },
   
    savedPercList(){
      const getsaved= JSON.parse(localStorage.getItem('savedPerc')) ;
      
      return getsaved;
    },
    nomeLingua(perc){
      
      const retur= perc.lingue.find(item=>item.lang==this.currLang);
        return retur.nome;

    },
    attivaSupporto(){
      const sup=common.getAttivaSuppoto();
      return sup;

    }

  },
  components: {
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonBadge,
    Capting,
    IonSlides, 
    IonSlide 
    
    //IonModal
  
  },
  setup() {
     
    const router = useRouter();
    

    const openMenuModal = async (notification) => {
      const top = await modalController.getTop();

      const menumodal = await modalController.create({
        component: Nav,
        swipeToClose: true,
        presentingElement: top,
        componentProps: { 
          updateNotification:notification,
          
        }
      });

      menumodal.onDidDismiss().then(async _ => {

        console.log("dismissed");
         console.log("dismissed " +notification);
         
      });

     

      return menumodal.present();
    };

  
    return {
    //  openModal,
      openMenuModal,
    

    };


  },
  created(){
    this.goToApp=common.openApp;
    this.showOptions=common.showOptions;
    this.setInactiveTour=common.setInactiveTour;
    this.setActiveTour=common.setActiveTour;
    this.getNotificationState=common.getNotificationState;
    this.alertPercorso=common.alertPercorso;
    this.checkStatus=common.checkOnlineStatus;
    this.datetoVersion=common.datetoVersion;

    this.emitter.on('changeVersion', _ => {
      this.showOptions();
    });
    
    this.emitter.on('fineAggiornamento', _ => {
      console.log("FINITO");
      this.notification=false;
    });
    this.emitter.on('addPerc', (perc)=>{
      this.addDowloadedPerc(perc);
      this.closedownloadModal();
    })


    this.getNotificationState().then(state=>{
      console.log("notification", state );
      this.notification=state});



   
  },



  methods: {

    opensubs(){
      this.$router.push({ path: "/subs/E01A/00004"});
    },
    updateTitle(){
      this.currLang=localStorage.getItem("lang")
     // this.percSel=this.getpercselinlang();
      this.percKey+=1;
    },
    
    haspulsanti(){
      return this.percselInfo.hasOwnProperty("pulsanti")
    },


    select(percorso){
      if(this.savedPercList[this.currLang].find(perc=>perc==percorso.percorso)){
        this.switchPerc(percorso);
      }else{
        console.log("NON è nella LISTA dei salvati")
        this.add(percorso)
       //this.switchPerc(percorso);
      }
    },

    switchPerc(percorso){
      const perc=percorso.percorso
      

        if (localStorage.getItem('percSel')!= perc) {
          localStorage.setItem('percSel', perc);
          console.log("entro,cambio era", this.percSel,"sarà ", perc);
          this.percSel=perc;

          common.setstorePerc(percorso);
         
          let  jsonSchede =JSON.parse(localStorage.getItem('allDataMostra'));
          jsonSchede=jsonSchede.filter(scheda=>scheda.percorsi.includes(this.percSel))
          console.log("filtro per percorso scelto", jsonSchede)
          localStorage.setItem('dataMostra',JSON.stringify(jsonSchede));
          
          this.percselInfo=this.getpercselInfo();
          this.$forceUpdate()
          
        }
       this.checkVersion(perc);  
    },
    getversionLangs(){
       
       let versionLangs= [];
         versionLangs=  JSON.parse(localStorage.getItem('versionLangs'));
       
      return versionLangs;
         
    },
    checkVersion(perc){
      const currentVersion=this.datetoVersion(this.pubblication.pubblicazione);
      const langVersion=this.getversionLangs().find(el=> el.lang==this.currLang).vers;

      if(currentVersion>langVersion){
        console.log("LA LINGUA NON è AGGIORNATA"); 
        this.updatePerc(perc);
      }else{
        console.log("versione ok"); 
      }

    },
    async updatePerc(perc) {
      if(window.navigator.onLine){
            const alert = await alertController.create({
              header: this.$t('update.title') ,
              message: this.$t('update.text') ,
              buttons: [
                  
                  {
                      text: this.$t('action.postponi') ,
                      role: "cancel",
                      handler: () => {
                          console.log("Declined the offer");
                          
                      },
                  },
                  {
                      text:this.$t('action.download'),
                      cssClass:'modal-accept-button',
                      handler: () => {
                          console.log("Accepted");
                          this.emitter.emit('aggiorna', "main");
                          this.pushPageAggiorna(perc);
                      
                      },
                  },
              ],
          });

          await alert.present();

      }else{
          this.networkError();
      }
           
    },
    pushPageAggiorna(passedPerc) {
      //const ionNav = document.querySelector('ion-nav') as any;
      
      //ionNav.push(Download,  { lang: this.currLang , fromC:"update", perc:passedPerc});
     
    },

    add(perc){

    this.showOptionsadd(perc)
  
    },
    addDowloadedPerc(newPerc){
      const saved=this.savedPercList;
      saved[this.currLang].push(newPerc);
      localStorage.setItem('savedPerc', JSON.stringify(saved))
    },

    async showOptionsadd(perc) {
      const alert = await alertController.create({
        header: this.$t('menu.percorsi.add') ,
        message:  this.$t('menu.percorsi.alert') ,
        buttons: [
          {
            text: this.$t('action.download'),
            cssClass:'modal-accept-button',
            handler: async() => {
              console.log("Accepted");
              const online= await this.checkStatus();
              console.log("onlòineSTATUS ",online);
              if(online){
                /*const suppLang=this.pubblication.percorsi.find(el=> el==perc);
             
                if(suppLang){}/*/
                  console.log("aprimodal")
                 this.modalDownload(perc)
                
             
              }else{
                console.log("NON C?èRETE");
                this.networkError();
              }
            
            
            },
          },
          {
            text: this.$t('action.cancel') ,
            role: "cancel",
          },
        ],
      });

      await alert.present();
    },
 


    async modalDownload(percorso)  {
    
      
    const top = await modalController.getTop();

    const modalDownload = await modalController.create({
    class:"modal-download",
      component: Download,
      componentProps: {
        lang: this.currLang , 
        fromC:"perc", 
        perc:percorso.percorso
        },
      swipeToClose: false,
      presentingElement: top
    });

    modalDownload.onDidDismiss().then(async _ => {
      this.switchPerc(percorso);
    });

   
    return modalDownload.present();
  },


  async closedownloadModal  ()  {
  
    
  const top = await modalController.getTop();

  top.dismiss();
},




    async openModal  ()  {
      if(this.$store.getters.conf.interactionMode=="mix"){
        if(this.tour==true){
          const captureStop=document.getElementById("captureStop");
          captureStop.click();
        }
       

      }
      
      const top = await modalController.getTop();

      const modal = await modalController.create({
        component: Scanner,
        swipeToClose: true,
        presentingElement: top
      });

      modal.onDidDismiss().then(async _ => {
        console.log("dismissed");
        const objStr = await Storage.get({ key: "scheda" });
        let obj = JSON.parse(objStr.value);

        if (obj != null) {
          obj=obj.path
          console.log("OGGETTO ",obj)
          if (this.attivaSupporto==true && obj.supportoVisuale !=null) {//da spostare prima
              this.$router.push({ path: "/video/" + obj.index });
          }else{
            if (obj.type == "audio") {
            this.$router.push({ path: "/audio/" + obj.index });
            } else  if (obj.type == "video") {
                this.$router.push({ path: "/video/" + obj.index });
            }else{
              this.$router.push({ path: "/soloImg/" + obj.index });
            }

          }
          
        }
      });

      await Storage.remove({ key: "scheda" });

      return modal.present();
    },



  async captingModal  ()  {
    
      
      const top = await modalController.getTop();

      const modalCapt = await modalController.create({
        component: Capting,
        swipeToClose: true,
        presentingElement: top
      });

      modalCapt.onDidDismiss().then(async _ => {
        console.log("dismissed");
        const captureStop=document.getElementById("captureStop");
        captureStop.click();
      });

     
      return modalCapt.present();
    },


    async closeCaptingModal  ()  {
    
      
    const top = await modalController.getTop();

    top.dismiss();
  },


    
  async getTour() {
    const ret = await Storage.get({ key: 'tourActive' });
    const tour = JSON.parse(ret.value);
    if(tour){
       return tour.active;
    }
    else{
      console.log("Not existing");
      return null;
    }
   
  },
  async schedaState(state) {
    console.log("openScheda");
    await Storage.set({
      key: 'openScheda',
      value:state
    });
  },
  async getSchedaState() {
    const ret = await Storage.get({ key: 'openScheda' });
    const scheda = JSON.parse(ret.value);
    return scheda;
  },
  getpercselInfo(){
      const sel=common.getpercinfo();
      return sel;
   },
  
  getpercselinlang(){
   
   const sel=common.getpercinfo();
  // common.setstorePerc(sel);
  console.log("selll",sel)
   if (sel){
      const lan=sel.lingue.find(item=>item.lang==this.currLang);
      console.log("enteraa",lan)
    return lan.nome;
    
   }else{
    return ""
   }
  },

  checkIfActive(perc, index){
      console.log("checkIfActive p",this.percSel)
      if(this.percSel==perc){
        this.slideOpts.initialSlide=index
        console.log("checkIfActive dentro")
        return true
      }else{
        return false
      }
  },


  openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },

    findRoute(decodedString) {
      console.log(decodedString);
       const data=localStorage.getItem("dataMostra")
       let idvid;
       let timeStamp;
       if(decodedString.length>4){
        idvid= decodedString.split("_")[0];
         timeStamp=decodedString.split("_")[1];
         console.log("log ide t");
         console.log(idvid);
         console.log(timeStamp);
       }else{
        idvid=decodedString
       }
     
      const scheda= JSON.parse(data).find(x => x.tag == idvid);
      
      const captureStop = document.getElementById("captureStop");  
         
        if (scheda != null) {
          const content=scheda.content.find(x => x.lang == this.currLang);
          console.log("scheda.type "+ content.type);
          captureStop.click();
          if(this.attivaSupporto==true && content.supportoVisuale !=null ){

            if(timeStamp!=null){
                this.$router.push({ path: "/video/" + idvid +"/"+timeStamp, replace:true });
              }else{
                this.$router.push({ path: "/video/" + idvid, replace:true });
              }
          }else{

            if (content.type == "audio") {
              console.log("audio");
     
              if(timeStamp!=null){
                this.$router.push({ path: "/audiosync/" + idvid +"/"+timeStamp, replace:true });
              }else{
                this.$router.push({ path: "/audio/" + idvid,  replace:true });
              }

            }else if (content.type == "video"){
              if(timeStamp!=null){
                this.$router.push({ path: "/video/" + idvid +"/"+timeStamp, replace:true });
              }else{
                this.$router.push({ path: "/video/" + idvid, replace:true });
              }
              console.log("video");
              
            }else{
                this.$router.push({ path: "/soloImg/" + idvid , replace:true});
            }

          }
          
        
        }else{

          const allschede=JSON.parse(localStorage.getItem("allDataMostra"))
          if(allschede){
            const media_in_altre = allschede.find(x => x.tag == this.tag);
            console.log("MIA", media_in_altre)
            if( media_in_altre){
              this.alertPercorso()
            
            }else{
              console.log("MIA non esiste")
            }
          
          }else{
            this.presentAlert();
          }

        }
       
       
      //captureStop.click();
        
    },
    openHistory(){
       this.$router.push({ path: "/raccolta", replace:true});
    },
    opengps(){
      console.log("HISTORU : ",window.history )
      this.$router.push({ path: "/gps", replace:false});
    },
       
    callJava(){
     // this.captingModal();
      window["answMessage"] = (tag) => {
        this.answMessage(tag);
        console.log("nella HOME!!");

      };
     
      try{
         AndroidObject.executeJavaCode(true);  //aggiungere parametro  true
          this.setActiveTour();
          this.decodedValue = "recording";
          this.logoi.hidden = true;
          this.captingIcon.hidden = false;
          this.captureStart.hidden = true;
          this.captureStop.hidden = false; 
          this.emitter.emit('startCapting');
          
          this.waitingTime=setTimeout(() => {
            this.presentAlert();
        }, 20000);
      }catch(e){
        clearTimeout(this.waitingTime);
      //  console.log("catch "+e);
      // alert("catch "+e);
       if(typeof AndroidObject=="undefined"){
           this.openAppModal();
       }else{
         alert("An error occurred, please restart the app")
       }
      

      }
     

    },
    answMessage(tag){
     clearTimeout(this.waitingTime);
      (async () => {
       this.stato = await this.getSchedaState();
          //console.log("statooo "+stato);
          if( this.stato==false|| this.stato==null){
             const res = tag
             
            if (res) {
              this.closeCaptingModal();
                  this.findRoute(res);
                  this.decodedValue = res;
                  
            }

          }
        })();

    },
   
    async openAppModal() {
     
      const alert = await alertController.create({
          header: this.$t('main.alertApp.title') ,
          message: this.$t('main.alertApp.text') ,
          buttons: [
             
              {
                text: this.$t('action.close') ,
                role: "cancel",
                handler: () => {
                    console.log("Declined the offer");
                  
                },
              },
               {
                  text:this.$t('action.app'),
                  cssClass:'modal-accept-button',
                  handler: () => {
                    console.log(this)
                   this.goToApp();
                     
                  },
              },
          ],
      });

      await alert.present();
    },

  presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.mode='ios'
    alert.header = 'Alert';
    alert.message = this.$t('main.timeoutTagText');
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    return alert.present();
  },

    openpage(){
     // this.$router.push({ path: "/audio/A0002"  });
      this.$router.push({ path: "/testjava"  });
    },

    async setObject(param) {
      await Storage.set({
        key: "scheda",
        value: JSON.stringify({
          path: param
        })
      });
    },
    async removeObj() {
      await Storage.remove({ key: "scheda" });
    },
  }
};
</script>

<style scoped>

ion-content {
  --overflow: hidden;
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
  padding-bottom: 10vh;
  height: 92vh;
  width: 100%;
}
.main-title{
  width: 65%;
  font-size: 1em;
}
.slide-percorsi{
  display: flex;
    height: 65vh;
}


.logo-container {
    position: relative;
    width: 79vw;
   /* margin-bottom: 43px;*/
    margin-bottom: 7px;
    height: 52vh;
    display: flex;
    align-items: center;
    padding: 0 5px;
    justify-content: center;
}
.overlay-opaco{
  background-color:  hsl(0deg 0% 100% / 69%);
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 38px;
    /* border-bottom-right-radius: 10px; */
    /* border-bottom-left-radius: 10px; */
    display: flex;
    align-items: center;
    padding: 14px;
    font-weight: 500;
    font-style: normal;
    color: #212121;
    justify-content: center;
}

.percosoImg{
 opacity: 0.7;
 filter: blur(1px);
 width: 30vw;
}
.percorsoAttivo{
  opacity: 1;
 
  filter: blur(0px);
  box-shadow: 0px 0px 5px 0px #4e4e4e6b;
  height: 100%;
  transition:opacity, filter, height 1s;
}
.logo {
  object-fit: cover;
 /* max-height: 60vh;*/
 /* margin-bottom: 30px;*/
 height: 95%;
  object-position: center;
  width: 100%;
  border-radius: 12px;

}
.buttons{
  width: 100%;
  text-align: center;
  top:67vh;
  position: absolute;
  display: flex;
  padding: 0 6vw;
}
.view-wwave-container {
  background-color: white;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-blend-mode: saturation;
}
.history-icon{
  
    width: 0.8em
}

.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}

.toolbar {
  /* --background:  red;*/
   --min-height: 48px!important;
}
.toolbar-container{
  height: inherit;
    
}

.collection-button{
   /* border: 2px solid aliceblue;*/
    border-radius: 50px;
    margin: 5px 17px;
   /* background: #d9d9d9;*/
    height: 36.7px;
}
.collection-button>ion-label{
    margin: 5px 6px;
    font-size: 13px;
    text-transform: capitalize;
}

.icon-button{
  max-height: 65%;
  max-width:70%;
}

.gps-btn {
  font-weight: 700;
  /*width: 280px;*/
  width: 25vw;
  margin: 17px auto;
  /* height: 41px;*/
  height: 25vw;
  --border-radius: 10px;
}
.capture-btn {
  font-weight: 700;
  /*width: 280px;*/
  width: 25vw;
  margin: 17px auto;
  /* height: 41px;*/
  height: 25vw;
  --border-radius: 10px;
}
#captureStart{
    --background:var(--ion-color-secondary);
}
#captureStop {
  --background:var(--ion-color-secondary-whitened);
}
.scan-btn{
  font-weight: 700;
  /*width: 280px;*/
  width: 25vw;
  margin: 17px auto;
 /* height: 41px;*/
 height: 25vw;
  --background: #e1e1e1;
  --border-radius: 10px;
}
.toolbar-background {
  color: black !important;
}
.notification{
  width: 10px;
  visibility:hidden;
  height: 16px;
  
  position: absolute;
  top: 3px;
  right: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: transparent;

}
.showNotification{
  visibility: visible;
}

.listen{
  width: 10px;
  height: 16px;
  position: absolute;
  left: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: transparent;

}
/*@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}*/
.modal-accept-button{
  color: var(--ion-color-primary);
}

.modal-download{
  display: flex;
  align-items: center;
}
.modal-download>.ion-page{
  height: 41%;
  transform: translatex(-50%);
  margin: auto;
  text-align: center;
  left: 50%;
  /* top: 50%; */
  width: 86%;
  border-radius: 15px;

}

</style>