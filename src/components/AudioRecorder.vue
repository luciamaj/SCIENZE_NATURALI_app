<template>
  <div>
    <div class="audioWrapper">
      <h3>recording test</h3>
      <ion-button @click="startRecording()" :disabled="isRecording"
        >START</ion-button
      >
      <ion-button @click="stopRecording()">STOP</ion-button>
      <div v-if="isRecording" class="recordingText">RECORDING</div>
    </div>
    <div class="audioWrapper">
      <audio controls :src="audioSrc"></audio>
    </div>

    <div class="audioWrapper">
      <h3>PLAYBACK</h3>
      <ion-button @click="startPlaying()" :disabled="isRecording"
        >START</ion-button
      >
      <ion-button @click="stopPlaying()">STOP</ion-button>
    </div>
  </div>
</template>

<script lang="ts">

import { Capacitor } from "@capacitor/core";
import { IonButton } from "@ionic/vue";
import AudioRecorder from "vue-audio-recorder"

export default ({
  components: { IonButton },
  name: "AudioRecorder",
  setup() {
      
   // const AudioRecorder = Plugins.AudioRecorder || Plugins.AudioRecorderPlugin;
    let isRecording = false;
    let  rawFilePath: string;
    let audioSrc = "";

    AudioRecorder.addListener("recordingFinished",  (info) => {
      console.log("recordingFinished was fired");
      isRecording = false;
      audioSrc = Capacitor.convertFileSrc(info.file);
      rawFilePath = info.file;
      audioSrc ="";
    });

    const startRecording = async () => {
      await AudioRecorder.authorize();
      await AudioRecorder.start({
        fileName: "test.m4a",
        duration: 6.0,
      });
      isRecording = true;
    };

    const stopRecording = async () => {
      isRecording = false;
      await AudioRecorder.stop();
    };

    const startPlaying = async () => {
      await AudioRecorder.startPlaying({ fileName: rawFilePath  });
    };

    const stopPlaying = async () => {
      await AudioRecorder.stopPlaying();
      await AudioRecorder.deleteRecording({ fileName: rawFilePath });
    };

    return {
      startRecording,
      stopRecording,
      startPlaying,
      stopPlaying,
      isRecording,
      audioSrc,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.recordingText {
  font-weight: bold;
  color: red;
  padding: 16px;
}
.audioWrapper {
  padding: 16px;
}
.hide-audio {
  display: none;
}
</style>