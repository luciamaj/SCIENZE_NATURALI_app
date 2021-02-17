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
      {{ decodedValue }}
      <div>Tx Data:</div>
      <textarea name="textarea" id="txData" style="width:300px;height:100px;">Hello javascript</textarea>
      <br />

      <button @click="onSend">Send</button>

      <br />
      <br />

      <div>Rx data:</div>
      <textarea name="textarea" id="rxData" style="width:300px;height:100px;" disabled></textarea>
      <br />

      <button id="captureStart">Start capturing</button>
      <button id="captureStop" hidden>Stop capturing</button>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/vue";

import factory from "ggwave";

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
    IonPage
  },
  methods: {
    onSend() {
      factory().then(ggwave => {
        /* eslint-disable no-console */
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.OfflineAudioContext =
          window.OfflineAudioContext || window.webkitOfflineAudioContext;

        const context = new AudioContext();
        let recorder = null;
        const captureStart = document.getElementById("captureStart");

        // create ggwave instance with default parameters
        const parameters = ggwave.getDefaultParameters();
        const instance = ggwave.init(parameters);

        const payload = "hello js";

        // generate audio waveform for string "hello js"
        const waveform = ggwave.encode(
          instance,
          payload,
          ggwave.TxProtocolId.GGWAVE_TX_PROTOCOL_AUDIBLE_FAST,
          10
        );

        // decode the audio waveform back to text
        const res = ggwave.decode(instance, waveform);

        console.log("the res", res);
        this.decodedValue = res;

        if (res != payload) {
          //process.exit(1);
        }

        function convertTypedArray(src, type) {
          const buffer = new ArrayBuffer(src.byteLength);
          const baseView = new src.constructor(buffer).set(src);
          return new type(buffer);
        }

        captureStart.addEventListener("click", function() {
          const txData = document.getElementById("txData");
          const rxData = document.getElementById("rxData");
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
            .then(function(e) {
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

              recorder.onaudioprocess = function(e) {
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
                offlineCtx.oncomplete = function(e) {
                  const resampled = e.renderedBuffer.getChannelData(0);
                  const res = ggwave.decode(
                    instance,
                    convertTypedArray(new Float32Array(resampled), Int8Array)
                  );
                  if (res) {
                    rxData.value = res;
                  }
                };
              };

              mediaStream.connect(recorder);
              recorder.connect(context.destination);
            })
            .catch(function(e) {
              console.error(e);
            });

          rxData.value = "Listening ...";
          captureStart.hidden = true;
          captureStop.hidden = false;
        });
      });
    }
  }
};
</script>