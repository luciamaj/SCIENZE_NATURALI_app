<template>
  <div  class="bg">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title size="large"></ion-title>
      </ion-toolbar>
      <ion-toolbar color="primary">
        <div class="title">MUSEO FELLINI</div>
      </ion-toolbar>
    </ion-header>
    <ion-page>
      <ion-content :fullscreen="false">
        <div class="vertical-center view-wwave-container">
          <div class="center">
            <div class="logo-container"><img class="logo" src="/assets/background/dos.png"/></div>

            <ion-button expand="block" class="capture-btn" @click="onSend" id="captureStart">PLAY</ion-button>
            <ion-button expand="block" class="capture-btn" id="captureStop" hidden>STOP</ion-button>

            <ion-button expand="block" class="capture-btn" @click="openModal('en', 0, '00')">PROVA</ion-button>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </div>
</template>

<script>
import {
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  modalController
} from "@ionic/vue";

import factory from "ggwave";
import Subtitles from "./Subtitles.vue";

export default {
  name: "Tab",
  data() {
    return {
      decodedValue: "",
      name: "MUSEO FELLINI"
    };
  },
  components: {
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
  },
  setup() {

    const openModal = async (langSub, timestamp, videoParam) => {
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
    };

    return {
      openModal
    };
  },
  methods: {
    findRoute(decodedString) {
      console.log(decodedString);
      //const audio = data.find(x => x.index == decodedString);
      
      const decodedArray = decodedString.split(" ");

      if(decodedArray[0] == "media") {
        if(parseInt(decodedArray[1])) {
          const timestamp = decodedArray[2] ? decodedArray[2] : 0;
          openModal('en', timestamp, parseInt(decodedArray[1]));
        }
      }

      if (audio != null) {
        if (audio.type == "audio") {
          this.$router.push({ path: "/audio/" + audio.index });
        } else {
          this.$router.push({ path: "/video/" + audio.index });
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
  padding-bottom: 15vh;
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

@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>