<template>
  <ion-page>
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
      <div class="player" id="player">
        <video class="video" id="videoPl" preload="metadata" muted autoplay loop>
            <source src="assets/videos/nero.mp4" type="video/mp4">
            <track id="track_en" :src="'https://fellini-app.eadev.it/subs/' + $props.videoParamProp + '/en.srt'" label="English srt subtitles" kind="subtitles" srclang="en" />
            <track id="track_it" :src="'https://fellini-app.eadev.it/subs/' + $props.videoParamProp + '/en.srt'" label="Italian srt subtitles" kind="subtitles" srclang="in" />
        </video>
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
    // eslint-disable-next-line
    const that = this;
    console.log(that);

    $('.video').videoSub();

    const vid = document.getElementById("videoPl");
    this.vid = document.getElementById("videoPl");

    window.addEventListener('orientationchange', _ => {
      if(window.innerHeight > window.innerWidth) {
        console.log("cane", this);
        console.log("sono qui 1", window.innerHeight, window.innerWidth);
        this.vid.style.height = "100vh !important";
        this.vid.style.width = "auto !important";

        vid.setAttribute("style", "height: 80vh !important; width: auto !important");
      } else {
        console.log("sono qui 2", window.innerHeight, window.innerWidth);
        this.vid.style.width = "100vw !important";
        this.vid.style.height = "auto !important";

        vid.setAttribute("style", "height: auto !important; width: 100vw !important");
      }
    });

    this.langSub = this.$route.query.langSub ? this.$route.query.langSub : this.$props.langSubProp;
    this.timestamp = this.$route.query.timestamp ? parseInt(this.$route.query.timestamp) : this.$props.timestampProp;
    this.videoParam = this.$route.query.videoParam ? this.$route.query.videoParam : this.$props.videoParamProp;

    vid.currentTime = this.timestamp;

    console.log("track_" + this.langSub);

    const currentTrack = document.getElementById("track_" + this.langSub);
    currentTrack.default = true;

    currentTrack.addEventListener('cuechange', function(e) {
      const targetSub = e.target;
      const cues = targetSub.track.activeCues;

      if(cues[0]) {
        console.log(cues[0]["text"]);

        if(cues[0]["text"] === "fine") {
          console.log("restart video");
          vid.currentTime = 0;
        }
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
      open: false,
    };
  }
};

</script>

<style scoped>

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

.videosub-bar {
  width: 100%;
}

#videoPl {
  height: auto;
  pointer-events: none;
  display: inline-block;
  width: 100%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
}

#player {
  height: 100%;
  width: 100%;
}

#video::-webkit-media-controls {
  display: none;
}

#video::-webkit-media-controls-play-button {}

#video::-webkit-media-controls-volume-slider {}

#video::-webkit-media-controls-mute-button {}

#video::-webkit-media-controls-timeline {}

#video::-webkit-media-controls-current-time-display {}

video::cue {
  color: #FFF;
  background-color: rgb(0, 0, 0);
  font-size: 30px !important;
}

video::-webkit-media-text-track-container {
  overflow: visible !important;
  transform: translateY(-50%) !important;
}

#header {
  background-color: #000;
}

</style>