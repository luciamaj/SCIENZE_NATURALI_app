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
        <video id="video" controls preload="metadata">
            <source src="https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_30mb.mp4" type="video/mp4">
            <track label="English" kind="subtitles" srclang="en" src="subtitles/sub.vtt" default>
        </video>
      </div>
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
  name: "Subtitle",
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
  },
  data() {
    return {
      options: {
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
.player {
  height: 50vh;
  position: relative;
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

button {
    margin: 0 auto;
    width: 200px;
}

ion-content {
  --overflow: hidden;
}

#video {
  width: 100vw;
}

::cue {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 20px !important;
}

</style>