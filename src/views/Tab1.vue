<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="single-song-player">
        <img amplitude-song-info="cover_art_url" amplitude-main-song-info="true" />
      </div>
      <div class="bottom-container">
        <progress
          class="amplitude-song-played-progress"
          amplitude-main-song-played-progress="true"
          id="song-played-progress"
        ></progress>
      </div>
      <div class="time-container">
        <span class="current-time">
          <span class="amplitude-current-minutes" amplitude-main-current-minutes="true"></span>:
          <span class="amplitude-current-seconds" amplitude-main-current-seconds="true"></span>
        </span>
        <span class="duration">
          <span class="amplitude-duration-minutes" amplitude-main-duration-minutes="true"></span>:
          <span class="amplitude-duration-seconds" amplitude-main-duration-seconds="true"></span>
        </span>
      </div>
      <div class="control-container">
        <div class="amplitude-play-pause" amplitude-main-play-pause="true" id="play-pause"></div>
      </div>
      <div class="meta-container">
        <span amplitude-song-info="name" amplitude-main-song-info="true" class="song-name"></span>
        <span amplitude-song-info="artist" amplitude-main-song-info="true"></span>
      </div>
      <ion-button @click="play">PLAY</ion-button>
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
  IonButton
} from "@ionic/vue";
import Amplitude from "amplitudejs";

export default {
  name: "Tab1",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton
  },
  methods: {
    play() {
      Amplitude.play();
    }
  },
  mounted() {
    Amplitude.init({
      /* eslint-disable */
      songs: [
        {
          name: "Song Name 1",
          artist: "Artist Name",
          album: "Album Name",
          url: "/assets/sounds/1.ogg",
          cover_art_url: "/assets/icon/icon.png"
        }
      ]
    });
    console.log(Amplitude);
  }
};
</script>

<style>
div.amplitude-play-pause {
  width: 74px;
  height: 74px;
  cursor: pointer;
  float: left;
  margin-left: 10px;
}

div.amplitude-play-pause.amplitude-paused {
  background: url("/assets/icon/icon.pngg");
  background-size: cover;
}

div.amplitude-play-pause.amplitude-playing {
  background: url("/assets/icon/icon.png");
  background-size: cover;
}
</style>