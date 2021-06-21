<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>{{ name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="player">
        <video id="video" controls preload="metadata">
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
  },
  mounted() {
    this.langSub = this.$route.query.lang ? this.$route.query.lang : "en";
    this.timestamp = this.$route.query.timestamp ? parseInt(this.$route.query.timestamp) : 0;

    const vid = document.getElementById("video") as HTMLVideoElement;
    console.log("TIMESTAMP?", this.timestamp);
    vid.currentTime = this.timestamp;
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
      langSub: "en",
      timestamp: 0,
      videoSrc: "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
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