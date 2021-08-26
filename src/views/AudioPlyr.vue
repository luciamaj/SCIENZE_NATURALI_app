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
      <div class="player">
        <ion-img class="cover" :src="cover"></ion-img>
        <vue-plyr :options="options">
          <audio controls crossorigin playsinline>
            <source :src="url" type="audio/mp3" />
          </audio>
        </vue-plyr>
      </div>
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
  IonButtons,
  IonButton,
  IonIcon,
  IonImg
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
    IonIcon,
    IonImg
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
  computed: {
    cover() {
      const audio = data.find(x => x.index == this.$route.params.id);
      if (audio) {
        return audio.cover;
      } else {
        return data[0].cover;
      }
    },
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
  },
  data() {
    return {
      options: {
        title: "Example Title",
        enabled: true,
        clickToPlay: true,
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true,
          container: null
        },
        hideControls: false,
        controls: [
          "play",
          "mute",
          "volume",
          "play-large",
          "progress",
          "current-time"
        ]
      }
    };
  }
};
</script>

<style scoped>
  .cover {
    object-fit: cover;
  }

    button {
      margin: 0 auto;
      width: 200px;
    }

    .vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
     }

  .player {
    height: 50vh;
    position: relative;
  }

ion-content {
  --overflow: hidden;
}
</style>