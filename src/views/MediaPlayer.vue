<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
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
      <ion-range
        snaps="false"
        step="100"
        min="0"
        max="100"
        id="linearbar"
        color="danger"
        v-model="trackProgress"
      ></ion-range>
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
  IonButton,
  IonIcon,
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
      value: 0.0,
      seek: 0,
      playing: false,
      rangeActive: false
    };
  },
  watch: {
    playing(playing) {
      this.seek = this.sound.howl.seek();
      let updateSeek;
      if (playing) {
        updateSeek = setInterval(() => {
          this.seek = this.sound.howl.seek();
        }, 250);
      } else {
        clearInterval(updateSeek);
      }
    }
  },
  computed: {
    progress() {
      if (this.sound.howl.duration() === 0) return 0;
      /* eslint-disable */
      // this.value = this.seek / this.sound.howl.duration();
      return this.seek / this.sound.howl.duration();
    },
    trackProgress() {
      return this.progress * 100;
    }
  },
  created: function() {
    const howlObj = new Howl({
      src: ["assets/sounds/1.mp3"]
    });
    this.sound.howl = howlObj;
  },
  methods: {
    onSeekStart() {
      console.log(1);
    },

    onSeekEnd() {
      console.log(2);
    },
    playSound() {
      if (!this.sound.howl.playing()) {
        this.sound.howl.play();
        this.playing = true;
      } else {
        this.sound.howl.stop();
        this.playing = false;
      }
    },
    activateRange() {
      this.rangeActive = true;
    },

    mouseUp() {
      if (this.rangeActive) {
        this.rangeActive = false;
        console.log("range active");
        // here you are sure the value is changed and
        // the user has stopped to drag the range knobs so you can use the values
      }
    },
    updateSeek(event) {
      console.log("qui 0");
      console.log("event", event);
      const mousePos = event.offsetX;
      const elWidth = document.getElementById("linearbar").clientWidth;
      const percents = (mousePos / elWidth) * 100;
      this.setSeek(percents);
    },
    setSeek(percents) {
      console.log("qui 1");
      console.log(this.isDragging);
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