<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title slot="start" >WAvE B - {{store}}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="openMenuModal(notification)">
            <ion-icon slot="start" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
            <ion-badge  mode="ios" color="danger" class="notification" :class="{showNotification:notification}">1</ion-badge>
          </ion-button>
         </ion-buttons>
      </ion-toolbar> 
    </ion-header>
  
    <ion-content :fullscreen="false">
     <!--ion-modal :is-open="true" :swipe-to-close="true">
  <ion-content>Modal Content</ion-content>
</ion-modal-->
      <div class="vertical-center view-wwave-container">
        <div class="center">
          <div class="logo-container"><img class="logo" src="/assets/background/dos.png"/></div>
            {{ntag}}
          <div class="buttons">
          <ion-button expand="block" class="capture-btn" @click="onSend" id="captureStart">PLAY</ion-button>
          <ion-button expand="block" class="capture-btn" id="captureStop" hidden>STOP</ion-button>
            <IonButton class="scan-btn" @click="openModal">INQUADRA UN QR CODE</IonButton>

            <ion-button  class="test-btn" id="test" @click="openpage" >TEST</ion-button>
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
     ntag:"",
     playing:false,
    };
  },
  ionViewWillEnter(){
   
   this.getTour().then(x => {
    const tour=x;
   
    console.log("upTour ", tour)
    if(tour){
         const captureStart = document.getElementById("captureStart");
        // captureStart.click();
    }
    } );
   

  },
  mounted(){
    this.store=localStorage.getItem('version');
   
    

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
        const objStr = await Storage.get({ key: "path" });
        const obj = JSON.parse(objStr.value);
        console.log("OGGETTO ",obj.path)
        if (obj != null) {
          if (obj.path.type == "audio") {
            router.push({ path: "/audio/" + obj.path.index });
          } else {
            router.push({ path: "/video/" + obj.path.index });
          }
        }
      });

      await Storage.remove({ key: "path" });

      return modal.present();
    };

    const openMenuModal = async (notification) => {
      const top = await modalController.getTop();

      const menumodal = await modalController.create({
        component: Menu,
        swipeToClose: true,
        presentingElement: top,
        componentProps: { 
          notification:notification,
          
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
   /* this.$parent.$on('changeVersion', _ => {
      this.showOptions();
    });*/
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
    console.log("aaa ", scheda);
    return scheda;
  },
  async showOptions() {
    const alert = await alertController.create({
      header: "Aggiornamento",
      message: "Sono disponibili aggiornamenti dei contenuti",
      buttons: [
        {
          text: "Scarica",
          handler: () => {
            console.log("Accepted");
             this.emitter.emit('aggiorna');
          },
        },
        {
          text: "Postponi",
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



  inizialize(){
    //navigator.mediaDevices.getUserMedia({audio: true});
    navigator.mediaDevices.enumerateDevices().then((devices)=>{ 
    const availableOutputDevices = devices.filter(device => device.kind === "audioinput");
    this.selectedDeviceId = availableOutputDevices[1].deviceId;
    console.log("DEV ", this.selectedDeviceId);
    });
       
  },

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
      (async () => {
          const stato = await this.getSchedaState();
          console.log("statooo "+stato);
        if (scheda != null) {
          if(stato==false||stato==null){
            if (scheda.type == "audio") {
              console.log("audio");
            //this.schedaState(true);
            this.$router.push({ path: "/audio/" + decodedString });
            } else {
                console.log("video");
          //  this.schedaState(true);
            this.$router.push({ path: "/audio/" + decodedString });
            }
          }
        }
      })();
       
       
      //captureStop.click();
        
    },

    onSend() {
       this.inizialize();
      this.setActiveTour();
      this. ggwave=null
      factory().then((obj) =>{
          this.ggwave = obj;

           const audio=document.getElementById("audio-src");
        
      const captureStart = document.getElementById("captureStart");
      const captureStop = document.getElementById("captureStop");

   

       const constraints = {
        audio: {
          // not sure if these are necessary to have
          echoCancellation: {exact: true},
          autoGainControl:  {exact: false},
          noiseSuppression: {exact: false},
          deviceId:{exact: this.selectedDeviceId},
        },
        video: false
      };

      navigator.mediaDevices.enumerateDevices() .then(function(devices) {
        devices.forEach(function(device) {
          console.log(device.kind + ": " , device);
        });
        
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
      /*const stream=audio.captureStream();
       this.streamhandler(stream);*/

  
      navigator.mediaDevices.getUserMedia( constraints).then((stream)=>{
        console.log("audiotracks 2 ",stream.getAudioTracks());
        const track=stream.getAudioTracks()[0]
        if(track){
          
          console.log("PIPPO ");
          console.log("TRACK constr ",track.getConstraints());
          console.log("TRACK settings ",track.getSettings());
          console.log(" capabilities ",track.getCapabilities());
          this.settingSampleRate=track.getSettings().sampleRate;
        }
      
        this.streamhandler(stream);
        this.audioRecorder(stream)


      }).catch(function (e) {   console.error(e);})

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.OfflineAudioContext =
      window.OfflineAudioContext || window.webkitOfflineAudioContext;
   


      captureStop.addEventListener("click", ()=> {
        if (this.recorder) {
          this.recorder.disconnect(this.context.destination);
         this.mediaStream.disconnect(this.recorder);
          this.recorder = null;
        }
        this.setInactiveTour();
        this.schedaState(false);
        this.decodedValue = "stopped recording";
        captureStart.hidden = false;
        captureStop.hidden = true;
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
      console.log("audiotracks 2 ",stream.getAudioTracks());
      this.mediaStream = this.context.createMediaStreamSource(stream);
      console.log("mdiastream handler ",  stream);
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
        console.log("createJavaScriptNode");
          this.recorder = this.context.createJavaScriptNode(
          bufferSize,
          numberOfInputChannels,
          numberOfOutputChannels
        );
      }
    
      this.recorder.onaudioprocess = e => {
          
        const source = e.inputBuffer.getChannelData(0);
          console.log("onaudioprocess entro");
          
        
        const res = this.ggwave.decode(this.instance, this.convertTypedArray(new Float32Array(source), Int8Array));
        if (res) {
              this.findRoute(res);
              this.decodedValue = res;
        }
      }
      this.mediaStream.connect(this.recorder);
      this.recorder.connect(this.context.destination);

    },

    openpage(){
     // this.$router.push({ path: "/audio/A0002"  });
      this.$router.push({ path: "/test"  });
    }
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
}

.logo-container {
  background-color: #fff;
}

.logo {
  object-fit: contain;
  max-height: 30vh;
  margin-bottom: 50px;
  object-position: center;
  width: 100%;
}
.buttons{
  width: 100%;
  text-align: center;
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
  width: 280px;
  margin: 15px auto;
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