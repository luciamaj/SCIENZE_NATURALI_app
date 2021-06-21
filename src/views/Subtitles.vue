<template>
  <ion-page>
    <ionHeader>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>{{ name }}</ion-title>
          <ion-buttons>
            <ion-button v-on:click="close">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
      </ion-toolbar>
    </ionHeader>
    <ion-content>
      <div class="player">
        <video id="video" controls preload="metadata" muted autoplay>
            <source :src="videoSrc" type="video/mp4">
            <track v-if="langSub == 'en'" label="English" kind="subtitles" srclang="en" src="subtitles/en.vtt" default>
            <track v-if="langSub == 'de'" label="German" kind="subtitles" srclang="de" src="subtitles/de.vtt" default>
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

    this.options.captions.language = "en";
    this.options.captions.active = true;
    console.log(this.options.captions.language)
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
      top.dismiss();
    },
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
      timestamp: 0,
      videoSrc: "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
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
        captions: { defaultActive:true, active: true, update: true, language: "en" },
        hideControls: false,
        controls: [
          "play-large",
          "fullscreen",
          "captions",
          "options"
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

::cue {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 20px !important;
  position: -40%;
}

</style>