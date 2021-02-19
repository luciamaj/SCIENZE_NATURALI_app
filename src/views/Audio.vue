<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>{{ name }}</ion-title>
        <ion-buttons>
          <ion-button v-on:click="back">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <vue-plyr id="player" :options="options">
        <video controls crossorigin playsinline preload="metadata">
          <source src="/assets/sounds/quadro-sinottico-en.mp3" type="video/mp4" />
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
  IonContent,
  IonButtons,
  IonButton,
  IonIcon
} from "@ionic/vue";

import { data } from "../data/data";

export default {
  name: "Tab",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonButton,
    IonIcon
  },
  methods: {
    back() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: "open-scanner" });
      }
    }
  },
  data() {
    return {
      options: {
        displayDuration: true,
        type: "audio",
        title: "Example Title",
        enabled: true,
        clickToPlay: true,
        hideControls: false,
        fullscreen: { enabled: false },
        seekTime: 20,
        controls: [
          "mute",
          "volume",
          "play-large",
          "rewind",
          "progress",
          "current-time",
          "fast-forward"
        ]
      }
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    name() {
      const audio = data.find(x => x.index == this.$route.params.id);
      if (audio) {
        return audio.name;
      } else {
        return data[0].name;
      }
    },
    lang() {
      const audio = data.find(x => x.index == this.$route.params.id);
      if (audio) {
        return audio.lang;
      } else {
        return data[0].lang;
      }
    },
    url() {
      const audio = data.find(x => x.index == this.$route.params.id);
      if (audio) {
        return audio.url;
      } else {
        return data[0].url;
      }
    }
  }
};
</script>

<style scoped>
video {
  background: transparent url("/assets/imgs/qr.png") 50% 50% / contain no-repeat;
}
</style>