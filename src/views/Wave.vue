<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Wave</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Wave</ion-title>
        </ion-toolbar>
      </ion-header>

      <div>Rx data:</div>
      {{ decodedValue }}
      <ion-button @click="onSend" id="captureStart">Start capturing</ion-button>
      <ion-button id="captureStop" hidden>Stop capturing</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from "@ionic/vue";

import factory from "ggwave";
import { useRouter } from "vue-router";
import { data } from "../data/data";

export default {
  name: "Tab",
  data() {
    return {
      decodedValue: ""
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton
  },
  methods: {
    findRoute(decodedString) {
      console.log(decodedString);
      const audio = data.find(x => x.external_url == decodedString);

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

        const txData = document.getElementById("txData");

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