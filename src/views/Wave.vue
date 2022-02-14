<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title slot="start" >Audible - {{store}}</ion-title>
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
          <ion-button expand="block" class="capture-btn" @click="onSend" id="captureStart">PLAY</ion-button>
          <ion-button expand="block" class="capture-btn" id="captureStop" hidden>STOP</ion-button>
            <IonButton class="scan-btn" @click="openModal">INQUADRA UN QR CODE</IonButton>

            <ion-button  class="test-btn" id="test" @click="openpage" >TEST</ion-button>
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
      openMenuModal
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
  openFirst() {
      menuController.enable(true, 'first');
      menuController.open('first');
    },

    findRoute(decodedString) {
      console.log(decodedString);
       const data=localStorage.getItem("dataMostra")
     
      const scheda= JSON.parse(data).find(x => x.tag == decodedString);
   
      //const audio = data.find(x => x.index == decodedString);
      
     ///const decodedArray = decodedString.split(" ");
      //const audio = data.find(x => x.index ==  parseInt(decodedArray[1]));

      /*if(decodedArray[0] == "media") {
        
        if(parseInt(decodedArray[1])) {
          const timestamp = decodedArray[2] ? decodedArray[2] : 0;
         // openModal('en', timestamp, parseInt(decodedArray[1]));
        }
      }*/
     

        // Dispatch/Trigger/Fire the event
        
      if (scheda != null) {
       if(this.playingredmi ==false){
        if (scheda.type == "audio") {
          this.playing==true;
          this.$router.push({ path: "/audio/" + decodedString });
        } else {
          this.playing==true;
          this.$router.push({ path: "/audio/" + decodedString });
        }
       }
        
      }
    },
    onSend() {
      factory().then(ggwave => {
        /* eslint-disable no-console */
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.OfflineAudioContext =
          window.OfflineAudioContext || window.webkitOfflineAudioContext;

        const context = new AudioContext();
        let recorder = null;

        // create ggwave instance with default parameters
        const parameters = ggwave.getDefaultParameters();
        const instance = ggwave.init(parameters);

        function convertTypedArray(src, type) {
          const buffer = new ArrayBuffer(src.byteLength);
          const baseView = new src.constructor(buffer).set(src);
          return new type(buffer);
        }

        const captureStart = document.getElementById("captureStart");
        const captureStop = document.getElementById("captureStop");
        //init();

        const constraints = {
          audio: {
            // not sure if these are necessary to have
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false
          }
        };

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(e => {
            const mediaStream = context.createMediaStreamSource(e);

            const bufferSize = 16 * 1024;
            const numberOfInputChannels = 1;
            const numberOfOutputChannels = 1;

            if (context.createScriptProcessor) {
              recorder = context.createScriptProcessor(
                bufferSize,
                numberOfInputChannels,
                numberOfOutputChannels
              );
            } else {
              recorder = context.createJavaScriptNode(
                bufferSize,
                numberOfInputChannels,
                numberOfOutputChannels
              );
            }

            recorder.onaudioprocess = e => {
              const source = e.inputBuffer;
              const offlineCtx = new OfflineAudioContext(
                source.numberOfChannels,
                48000 * source.duration,
                48000
              );
              const offlineSource = offlineCtx.createBufferSource();

              offlineSource.buffer = source;
              offlineSource.connect(offlineCtx.destination);
              offlineSource.start();
              offlineCtx.startRendering();
              offlineCtx.oncomplete = e => {
                const resampled = e.renderedBuffer.getChannelData(0);
                const res = ggwave.decode(
                  instance,
                  convertTypedArray(new Float32Array(resampled), Int8Array)
                );
                if (res) {
                  this.findRoute(res);
                  this.decodedValue = res;
                }
              };
            };

            mediaStream.connect(recorder);
            recorder.connect(context.destination);

            captureStop.addEventListener("click", function() {
              if (recorder) {
                recorder.disconnect(context.destination);
                mediaStream.disconnect(recorder);
                recorder = null;
              }

              this.decodedValue = "stopped recording";
              captureStart.hidden = false;
              captureStop.hidden = true;
            });

          
          })
          .catch(e => {
            console.error(e);
          });

        this.decodedValue = "recording";
        captureStart.hidden = true;
        captureStop.hidden = false;
      });
    },

    openpage(){
      this.$router.push({ path: "/audio/A0002"  });
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