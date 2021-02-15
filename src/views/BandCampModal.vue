<template>
  <ion-page>
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title>Bandcamp {{ name }}</ion-title>
        <ion-icon @click="back" size="large" name="arrow-back" />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <iframe style="border: 0; width: 100%; height: 120px;" :src="url" seamless></iframe>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/vue";

import { data } from "../data/data";

export default {
  name: "BandCampModal",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage
  },
  mounted() {
    console.log(data);
  },
  methods: {
    back() {
      this.$router.go(-2);
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
#newsframe {
  height: calc(100vh - 60px);

  width: 100vw;

  border: none;
  padding: 0;
  margin: 0;
}
</style>