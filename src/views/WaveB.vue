<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar >
        <ion-title slot="start" >{{store.mostra}}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="openMenuModal(notification)">
            <ion-icon slot="start" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
            <ion-badge  mode="ios" id="badge" color="danger" class="notification" :class="{showNotification:notification}">0</ion-badge>
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
          <div class="logo-container" id="logomostra"><img class="logo" :src="logo"/></div>
          <div class="logo-container" id="anima" hidden><img class="gif-listen" src="assets/background/anima.gif"/></div>
          <div class="buttons">
          <ion-button v-if="interactionMode=='mix'" expand="block" class="capture-btn" @click="onSend" id="captureStart">{{$t('main.start')}}</ion-button>
          <ion-button expand="block" class="capture-btn" id="captureStop" hidden>{{$t('main.stop')}}</ion-button>

          <ion-button class="scan-btn" @click="openModal">{{$t('main.scan')}}</ion-button>

            <!--ion-button  class="test-btn" id="test" @click="openpage" >TEST</ion-button-->
          </div>
          <!--ion-button expand="block" class="capture-btn" @click="openModal('en', 0, '00')">PROVA</ion-button-->
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
const { Storage } = Plugins;

export default {
  name: "Tab",
  data() {
    return {
      decodedValue: "",
      name: "AUDIBLE MUSEUM",
      store:"",
      notification:false,
     ntag:"a",
     playing:false,
    };
  },
  ionViewWillEnter(){
   
   this.getTour().then(x => {
    const tour=x;
   
    console.log("upTour ", tour)
    if(tour){
         const captureStart = document.getElementById("captureStart");
         //captureStart.click();
    }
    } );
   

  },
  mounted(){
    this.store=JSON.parse(localStorage.getItem('pubblication'));
    
  },
  computed:{
    interactionMode(){
      console.log("interactionMode "+ this.conf.interactionMode );
      return  this.conf.interactionMode;
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

    /*const openModal = async (langSub, timestamp, videoParam) => {
      const top = await modalController.getTop();

      console.log("timestamp", timestamp);

      const modal = await modalController.create({
        component: Subtitles,
        componentProps: {'langSubProp': langSub, 'timestampProp': timestamp, 'videoParamProp': videoParam, 'web': 1},
        swipeToClose: true,
        presentingElement: top
      });

      modal.onDidDismiss().then(async _ => {
        console.log("dismissed");
      });

      return modal.present();
    };*/
 
    
  
    const router = useRouter();
    const openModal = async () => {
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
            router.push({ path: "/audio/" + obj.path.index });
          } else {
            router.push({ path: "/video/" + obj.path.index });
          }
        }
      });

      await Storage.remove({ key: "scheda" });

      return modal.present();
    };

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
      openModal,
      openMenuModal,
     
    

    };


  },
  created(){
     this.emitter.on('changeVersion', _ => {
      this.showOptions();
    });
    
    this.emitter.on('fineAggiornamento', _ => {
      console.log("FINITO");
      this.notification=false;
    });
   
  },



  methods: {
  async setActiveTour() {
    await Storage.set({
      key: 'tourActive',
      value:JSON.stringify({
         active: true,
        
      })
    });
  },
  async setInactiveTour() {
    await Storage.set({
      key: 'tourActive',
      value:JSON.stringify({
         active: false,
        
      })
    });
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
  async showOptions() {
    const alert = await alertController.create({
      header: this.$t('update.title'),
      message:  this.$t('update.text'),
      buttons: [
        {
          text: "Scarica",
          cssClass:'modal-accept-button',
          handler: () => {
            console.log("Accepted");
             this.emitter.emit('aggiorna','main');
          },
        },
        {
          text: this.$t('action.postponi'),
          role: "cancel",
          handler: () => {
            console.log("Declined the offer");
            this.notification=true;
          },
        },
      ],
    });

    await alert.present();
  },

    openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },

    findRoute(decodedString) {
      console.log(decodedString);
       const data=localStorage.getItem("dataMostra")
       let idvid;
       let timeStamp=null;
       let split;
       if(decodedString.length>4){
        console.log("decoded>4");
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
          const content=scheda.content.find(x => x.lang == localStorage.getItem("lang"));
          console.log("scheda.type "+ content.type);
          
          if (content.type == "audio") {
            console.log("audio");

            if(timeStamp!=null){
               this.$router.push({ path: "/audiosync/" + idvid +"/"+timeStamp, });
            }else{
              this.$router.push({ path: "/audio/" + idvid });
            }
            //this.schedaState(true);
          

          }else if (content.type == "video"){
            console.log("video");
            //this.schedaState(true);
            this.$router.push({ path: "/video/" + idvid });
          }else{
              console.log("null");
          }
        
        }

      //captureStop.click();
        
    },

    onSend() {
     //  this.inizialize();
      this.waitingTime=setTimeout(() => {
        this.presentAlert();
      }, 10000);
      this.setActiveTour();
      this. ggwave=null
      factory().then((obj) =>{
          this.ggwave = obj;
       window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.OfflineAudioContext =
      window.OfflineAudioContext || window.webkitOfflineAudioContext;

         
        
      const captureStart = document.getElementById("captureStart");
      const captureStop = document.getElementById("captureStop");
      const anima=document.getElementById("anima");
      const mostra=document.getElementById("logomostra");
   

       const constraints = {
        audio: {
          // not sure if these are necessary to have
          echoCancellation: {exact: false},
          autoGainControl:  {exact: false},
          noiseSuppression: {exact: false},
          deviceId:{exact: this.selectedDeviceId},
        },
        video: false
      };

      /*navigator.mediaDevices.enumerateDevices() .then(function(devices) {
        devices.forEach(function(device) {
          console.log(device.kind + ": " , device);
        });
        
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });*/
      /*const stream=audio.captureStream();
       this.streamhandler(stream);*/

  
      navigator.mediaDevices.getUserMedia( constraints).then((stream)=>{
        console.log("audiotracks 2 ",stream.getAudioTracks());
        const track=stream.getAudioTracks()[0]
        if(track){
          this.settingSampleRate=track.getSettings().sampleRate;
        }
      
        this.streamhandler(stream);
        
      }).catch(function (e) {   console.error(e);})


      captureStop.addEventListener("click", ()=> {
        if (this.recorder) {
          this.recorder.disconnect(this.context.destination);
         this.mediaStream.disconnect(this.recorder);
          this.recorder = null;
        }
        clearTimeout(this.waitingTime);
        this.setInactiveTour();
        this.schedaState(false);
        this.decodedValue = "stopped recording";
        captureStart.hidden = false;
        captureStop.hidden = true;
        anima.hidden=true;
        mostra.hidden=false;
      });

      window.addEventListener('pause', ()=> {
        if (this.recorder) {
          this.recorder.disconnect(this.context.destination);
          this.mediaStream.disconnect(this.recorder);
          this.recorder = null;
        }
        this.decodedValue = "stopped recording";
        captureStart.hidden = false;
        captureStop.hidden = true;
      });
      this.decodedValue = "recording";
      captureStart.hidden = true;
      captureStop.hidden = false;
      anima.hidden=false;
      mostra.hidden=true;

      });

    },
    audioRecorder(stream){
     
      const options = {mimeType: 'audio/webm'};
      const mediaRecorder = new MediaRecorder(stream, options);
      setTimeout(()=>{mediaRecorder.stop();},12000);  
      mediaRecorder.ondataavailable = this.handleDataAvailable;
      mediaRecorder.start();

    },
    handleDataAvailable(event) {
      const recordedChunks = []
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      } else {
        // ...
      }
       /* function play() {
          var superBuffer = new Blob(recordedChunks);
          videoElement.src =
            window.URL.createObjectURL(superBuffer);
        }*/
       
      const blob = new Blob(recordedChunks, {
        type: 'audio/webm'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'test.webm';
      a.click();
      window.URL.revokeObjectURL(url);
             
    },

    convertTypedArray(src, type) {
      const buffer = new ArrayBuffer(src.byteLength);
      const baseView = new src.constructor(buffer).set(src);
      return new type(buffer);
    },
    initcontext(){
        this.context =  new AudioContext({ sampleRate: this.settingSampleRate});
        const parameters = this.ggwave.getDefaultParameters();
        parameters.sampleRateInp = this.context.sampleRate;
        parameters.sampleRateOut = this.context.sampleRate;
        this.instance = this.ggwave.init(parameters);
    },

    streamhandler(stream){
       this.initcontext();   
      this.mediaStream = this.context.createMediaStreamSource(stream);
      const bufferSize = 16 * 1024;
      const numberOfInputChannels = 1;
      const numberOfOutputChannels = 1;
  
      if (this.context.createScriptProcessor) {
        console.log("createScriptProcessor");
        this.recorder = this.context.createScriptProcessor(
        bufferSize,
        numberOfInputChannels,
        numberOfOutputChannels
        );
      } else {
          this.recorder = this.context.createJavaScriptNode(
          bufferSize,
          numberOfInputChannels,
          numberOfOutputChannels
        );
      }
    
      this.recorder.onaudioprocess = e => {
          
        const source = e.inputBuffer.getChannelData(0);      
        (async () => {
       this.stato = await this.getSchedaState();
          if( this.stato==false|| this.stato==null){
             const res = this.ggwave.decode(this.instance, this.convertTypedArray(new Float32Array(source), Int8Array));
            if (res) {
               clearTimeout( this.waitingTime);
               console.log(res);
               
                  this.findRoute(res);
                  this.decodedValue = res;
            }

          }
        })();
       
      }
      this.mediaStream.connect(this.recorder);
      this.recorder.connect(this.context.destination);

    },

    openpage(){
     // this.$router.push({ path: "/audio/A0002"  });
      this.$router.push({ path: "/testjava"  });
    },

    presentAlert() {
      const alert = document.createElement('ion-alert');
      alert.header = 'Alert';
      alert.subHeader = 'sottotitolo';
      alert.message = 'Avvicinarsi al tag oppure usare il qr code';
      alert.buttons = ['OK'];

      document.body.appendChild(alert);
      return alert.present();
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
  height: 90vh;
  width: 100%;
}

.logo-container {
 /*background-color: #fff;*/
  position: relative;
  /* top: 9px; */
  top: 20%;
  height: 300px;
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
  top: 75%;
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

.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}

.toolbar {
   --background:  red;
}

.capture-btn {
  font-weight: 700;
  /*width: 280px;*/
  width: 30vw;
  height: 30vw;
  margin: 15px auto;
}
#captureStart{
    --background:var(--ion-color-secondary);
}
#captureStop {
  --background: #2d9fe3;
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

@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>