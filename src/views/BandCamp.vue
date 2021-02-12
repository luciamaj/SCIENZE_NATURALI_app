

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Bandcamp {{ id }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Bandcamp {{ id }}</ion-title>
        </ion-toolbar>
      </ion-header>
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
  name: "BandCamp",
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
  computed: {
    id() {
      return this.$route.params.id;
    },
    url() {
      const audio = data.find(x => x.index == this.$route.params.id);
      if (audio) {
        return data.find(x => x.index == this.$route.params.id).url;
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