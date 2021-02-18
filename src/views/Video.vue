<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>Tab</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <vue-plyr id="player" :options="options">
        <video controls crossorigin playsinline>
          <source src="https://api.gelato.loudsrl.com/api/test/video/1.mp4" type="video/mp4" />
        </video>
      </vue-plyr>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/vue";

export default {
  name: "Tab",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage
  },
  data() {
    return {
      options: {
        title: "Example Title",
        enabled: true,
        clickToPlay: true,
        hideControls: false,
        controls: [
          "play",
          "play-large",
          "progress",
          "current-time",
          "mute",
          "volume",
          "fullscreen"
        ]
      }
    };
  }
};
</script>