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
      <div name="textarea" id="rxData">{{ decodedValue }}</div>

      <ion-button @click="onSend" id="captureStart">Start capturing</ion-button>
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

export default {
  name: "Tab",
  data() {
    return {
      decodedValue: "cane",
      isRecording: false,
      constraints: {
        audio: {
          // not sure if these are necessary to have
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      }
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
  mounted() {
    this.captureStart = document.getElementById("captureStart");
    this.recorder = null;
  },
  methods: {
    convertTypedArray(src, type) {
      const buffer = new ArrayBuffer(src.byteLength);
      return new type(buffer);
    },
    onSend() {
      /* eslint-disable */
      factory().then(ggwave => {
        /* eslint-disable no-console */
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.OfflineAudioContext =
          window.OfflineAudioContext || window.webkitOfflineAudioContext;

        // create ggwave instance with default parameters
        const parameters = ggwave.getDefaultParameters();
        const instance = ggwave.init(parameters);

        //init();
        this.context = new AudioContext();

        navigator.mediaDevices
          .getUserMedia(this.constraints)
          .then(e => {
            const mediaStream = this.context.createMediaStreamSource(e);

            const bufferSize = 16 * 1024;
            const numberOfInputChannels = 1;
            const numberOfOutputChannels = 1;

            if (this.context.createScriptProcessor) {
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
                  this.convertTypedArray(new Float32Array(resampled), Int8Array)
                );
                if (res) {
                  console.log(res);
                  this.decodedValue = res;
                }
              };
            };

            this.recorder.on;

            mediaStream.connect(this.recorder);
            this.recorder.connect(this.context.destination);
          })
          .catch(function(e) {
            console.error(e);
          });
      });
    }
  }
};
</script>