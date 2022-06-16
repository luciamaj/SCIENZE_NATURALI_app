<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar >
        <ion-title slot="start" v-html="store.mostra" class="main-title"></ion-title>
        <ion-buttons slot="end" v-if="history==true" >
              <ion-button color="secondary"  @click="openHistory()" class="collection-button">
                <ion-icon  size="large" name="file-tray-full-outline" class="history-icon"></ion-icon>
                <!--ion-label color="dark">{{$t('raccolta.title')}}</ion-label-->
              </ion-button>
        </ion-buttons>
        
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
        <div class="center">
          <div class="logo-container"><img class="logo" :src="logo"/></div>
          <div class="buttons">
          <ion-button expand="block" class="capture-btn" @click="callJava" id="captureStart">{{$t('main.start')}}</ion-button>
          <ion-button expand="block" class="capture-btn" id="captureStop" hidden>
          <ion-badge  mode="ios" id="badge" color="danger" class="listen">0</ion-badge>
           {{$t('main.stop')}}</ion-button>

          <ion-button expand="block" class="scan-btn" @click="openModal">{{$t('main.scan')}}</ion-button>

          </div>
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
  IonBadge
  //IonModal
  
} from "@ionic/vue";

import { data } from "../data/data";
import Scanner from "./Scanner.vue";
import Menu from "./Menu.vue";
import Nav from "../components/Nav.vue";
import factory from "ggwave";
import { Plugins } from "@capacitor/core";
import Subtitles from "./Subtitles.vue";
import { useRouter } from "vue-router";
import {AudioProcessing} from "../audioWorklet/audioWorker.js";
import common from "../js/common"
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

     window["answMessage"] = (tag) => {
      this.answMessage(tag);
    };

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
    });
   
    
  },
  computed:{
    interactionMode(){
      console.log("interactionMode "+this.conf.interactionMode );
      return this.conf.interactionMode;
    },
    logo() {
      const imgMostra=this.store.img;
      if (imgMostra) {
        console.log("c'è logo");
        return this.$store.getters.baseUrl+"/upload/"+imgMostra;
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
      
    }

  },
  components: {
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonBadge
    
    //IonModal
  
  },
  setup() {
     
    const router = useRouter();
   /* const openModal = async () => {
      if(store.getters.conf.interactionMode=="mix"){
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
        const obj = JSON.parse(objStr.value);

        if (obj != null) {
            console.log("OGGETTO ",obj)
          if (obj.path.type == "audio") {
            router.replace({ path: "/audio/" + obj.path.index });
          } else  if (obj.path.type == "video") {
            router.replace({ path: "/video/" + obj.path.index });
          }else{
            router.replace({ path: "/audio/" + obj.path.index });
          }
        }
      });

      await Storage.remove({ key: "scheda" });

      return modal.present();
    };*/

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

    this.emitter.on('changeVersion', _ => {
      this.showOptions();
    });
    
    this.emitter.on('fineAggiornamento', _ => {
      console.log("FINITO");
      this.notification=false;
    });

    this.getNotificationState().then(state=>{this.notification=state});



   
  },



  methods: {
    
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
        const obj = JSON.parse(objStr.value);

        if (obj != null) {
            console.log("OGGETTO ",obj)
          if (obj.path.type == "audio") {
            this.$router.replace({ path: "/audio/" + obj.path.index });
          } else  if (obj.path.type == "video") {
              this.$router.replace({ path: "/video/" + obj.path.index });
          }else{
            this.$router.replace({ path: "/audio/" + obj.path.index });
          }
        }
      });

      await Storage.remove({ key: "scheda" });

      return modal.present();
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
  /*async showOptions() {
    const alert = await alertController.create({
      header: this.$t('update.title'),
      message:  this.$t('update.text'),
      buttons: [
        {
          text: this.$t('action.postponi'),
          role: "cancel",
          handler: () => {
            console.log("Declined the offer");
            this.notification=true;
          },
        },
        {
          text:  this.$t('action.download'),
          handler: () => {
            console.log("Accepted");
             this.emitter.emit('aggiorna');
          },
        },
      ],
    });

    await alert.present();
  },*/



  openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },

    findRoute(decodedString) {
      console.log(decodedString);
       const data=localStorage.getItem("dataMostra")
     
      const scheda= JSON.parse(data).find(x => x.tag == decodedString);
      
      const captureStop = document.getElementById("captureStop");
      
        // Dispatch/Trigger/Fire the event
       // const event = new Event('pause');
      //  window.dispatchEvent(event);
    
         
        if (scheda != null) {
          const content=scheda.content.find(x => x.lang == localStorage.getItem("lang"));
          console.log("scheda.type "+ content.type);
          
          if (content.type == "audio") {
            console.log("audio");
            //this.schedaState(true);
            this.$router.push({ path: "/audio/" + decodedString , replace:true});

          }else if (content.type == "video"){
            console.log("video");
            //this.schedaState(true);
            this.$router.push({ path: "/video/" + decodedString, replace:true });
          }else{
              this.$router.push({ path: "/audio/" + decodedString , replace:true});
          }
        
        }
       
       
      //captureStop.click();
        
    },
    openHistory(){
       this.$router.push({ path: "/raccolta", replace:true});
    },

       
    callJava(){
     
     
      try{
         AndroidObject.executeJavaCode(true);  //aggiungere parametro  true
          this.setActiveTour();
          this.decodedValue = "recording";
          this.captureStart.hidden = true;
          this.captureStop.hidden = false; 
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
  padding-bottom: 20vh;
  height: 90vh;
  width: 100%;
}
.main-title{
  width: 65%;
  font-size: 1em;
}
.logo-container {
 /*background-color: #fff;*/
  position: relative;
  /* top: 9px; */
  top: 16%;
  width: 77vw;
  margin: auto;
}

.logo {
  object-fit: contain;
  max-height: 40vh;
  margin-bottom: 30px;
  object-position: center;
  width: 100%;
}
.buttons{
  width: 100%;
  text-align: center;
  top: 66%;
  position: absolute;
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
   --background:  red;
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

.capture-btn {
  font-weight: 700;
  width: 280px;
  margin: 17px auto;
   height: 41px;
}
#captureStart{
    --background:var(--ion-color-secondary);
}
#captureStop {
  --background:var(--ion-color-secondary-whitened);
}
.scan-btn{
  font-weight: 700;
  width: 280px;
  margin: 17px auto;
  height: 41px;
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
@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>