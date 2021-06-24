<template>
  <ion-page v-if="videoParam">
    <ionHeader class="header">
      <ion-toolbar color="primary" mode="ios">
        <ion-title>{{ name  }}</ion-title>
          <ion-buttons v-if="$route.query.ios != 'true'">
            <ion-button v-on:click="close">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
      </ion-toolbar>
    </ionHeader>
    <ion-content>
      <div class="player">
        <video id="video" controls preload="metadata" muted autoplay loop>
            <source src="assets/videos/nero.mp4" type="video/mp4">
            <track id="track_en" label="English" kind="subtitles" srclang="en" :src="'subtitles/' + videoParam.toString + '/en.vtt'">
            <track id="track_de" label="German" kind="subtitles" srclang="de" :src="'subtitles/' + videoParam.toString + '/de.vtt'">
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
  modalController,
  IonIcon,
  IonButton,
  IonButtons
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
    IonIcon,
    IonButton,
    IonButtons
  },
  mounted() {
    this.langSub = this.$route.query.langSub ? this.$route.query.langSub : this.$props.langSubProp;
    this.timestamp = this.$route.query.timestamp ? parseInt(this.$route.query.timestamp) : this.$props.timestampProp;
    this.videoParam = this.$route.query.videoParam ? this.$route.query.videoParam : this.$props.videoParamProp;

    const vid = document.getElementById("video") as HTMLVideoElement;
    vid.currentTime = this.timestamp;

    const vidEl = document.getElementById("video")  as Element;
    vidEl.requestFullscreen();

    console.log("track_" + this.langSub);

    const currentTrack = document.getElementById("track_" + this.langSub) as HTMLTrackElement;
    currentTrack.default = true;

    currentTrack.addEventListener('cuechange', function(e) {
      const targetSub = e.target as HTMLTrackElement;
      const cues = targetSub.track.activeCues;

      if(cues[0]) {
        console.log(cues[0]["text"]);

        if(cues[0]["text"] === "fine") {
          console.log("restart video");
          vid.currentTime = 0;
        }
      }
    });

    document.addEventListener('fullscreenchange', _ => {
      if(!document.fullscreenElement) {
        console.log("exited full screen");
        this.close();
      }
    });
  },
  props: ['langSubProp', 'timestampProp', 'videoParamProp'],
  methods: {
    back() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: "open-scanner" });
      }
    },
    async close() {
      const top = await modalController.getTop();
      if (top) top.dismiss();
    },
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    name() {
      return "SOTTOTITOLI";
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
      timestamp: 0,
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

.fine {
  color: #000;
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
  pointer-events: none;
}

#video::-webkit-media-controls {
  display: none;
}

/* Could Use thise as well for Individual Controls */
#video::-webkit-media-controls-play-button {}

#video::-webkit-media-controls-volume-slider {}

#video::-webkit-media-controls-mute-button {}

#video::-webkit-media-controls-timeline {}

#video::-webkit-media-controls-current-time-display {}

video::cue {
  color: #FFF;
  background-color: rgb(0, 0, 0);
  font-size: 30px !important;
  transform: translateY(10%) !important;
}

video::-webkit-media-text-track-container {
  overflow: visible !important;
  transform: translateY(-40%) !important;
}

#header {
  background-color: #000;
}

</style>