<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Media Player</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Media Player</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-button @click="playSound">PLAY SOUND</ion-button>
      <ion-icon name="play-outline" size="large"></ion-icon>
      <ion-icon name="play-skip-back-outline" size="large"></ion-icon>
      <ion-icon name="play-skip-forward-outline" size="large"></ion-icon>
      <ion-icon name="pause-outline" size="large"></ion-icon>
      {{ sound.artist }} - {{ sound.title }}
      {{ sound.howl ? sound.howl.duration() : '' }}
      <ion-progress-bar id="linearbar" :value="progress" @click="updateSeek"></ion-progress-bar>
      <ion-range
        min="0"
        max="1"
        color="danger"
        :value="progress != null ? progress : 0"
        @click="updateSeek"
      ></ion-range>
      {{ progress }}
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
  IonButton,
  IonIcon,
  IonProgressBar,
  IonRange
} from "@ionic/vue";
import { Howl } from "howler";

export default {
  name: "Media Player",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonRange
  },
  data() {
    return {
      sound: {
        title: "Streets of Sant'Ivo",
        artist: "Ask Again",
        howl: null,
        display: true
      },
      seek: 0,
      playing: false
    };
  },
  watch: {
    playing(playing) {
      this.seek = this.sound.howl.seek();
      console.log("the seek?", this.seek);
      let updateSeek;
      if (playing) {
        updateSeek = setInterval(() => {
          this.seek = this.sound.howl.seek();
        }, 250);
      } else {
        console.log("what?");
        clearInterval(updateSeek);
      }
    }
  },
  computed: {
    progress() {
      if (this.sound.howl.duration() === 0) return 0;
      console.log(this.seek);
      return this.seek / this.sound.howl.duration();
    },
    trackProgress() {
      return this.progress * 100;
    }
  },
  created: function() {
    const howlObj = new Howl({
      src: ["assets/sounds/1.ogg"]
    });
    this.sound.howl = howlObj;
  },
  methods: {
    playSound() {
      if (!this.sound.howl.playing()) {
        this.sound.howl.play();
        this.playing = true;
      } else {
        this.sound.howl.stop();
        this.playing = false;
      }
    },
    updateSeek(event) {
      const mousePos = event.offsetX;
      const elWidth = document.getElementById("linearbar").clientWidth;
      const percents = (mousePos / elWidth) * 100;
      this.setSeek(percents);
    },
    setSeek(percents) {
      const track = this.sound.howl;

      if (track.playing()) {
        track.seek((track.duration() / 100) * percents);
      }
    }
  }
};
</script>

<style scoped>
.icon-player {
  color: white !important;
  font-size: 100px;
}
</style>