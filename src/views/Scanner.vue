<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Scanner</ion-title>
        <ion-icon @click="close" size="large" name="close" />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <QrStream @decode="onDecode"></QrStream>
      <div class="result">{{ value }}</div>
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
  IonIcon,
  modalController
} from "@ionic/vue";
import { QrStream } from "vue3-qr-reader";
import { data } from "../data/data";
import { defineComponent, inject } from "vue";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export default defineComponent({
  name: "Scanner",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonIcon,
    QrStream
  },
  props: ["modal"],
  methods: {
    async close() {
      const top = await modalController.getTop();
      top.dismiss();
    },
    async setObject(param) {
      await Storage.set({
        key: "path",
        value: JSON.stringify({
          path: param
        })
      });
    },
    ionViewDidEnter() {
      this.setObject("");
    },
    onDecode(decodedString) {
      this.value = decodedString;
      const audio = data.find(x => x.external_url == decodedString);
      let index;
      if (audio) {
        index = audio.index;
      } else {
        index = data[0].index;
      }

      this.setObject(index);
      this.close();
    }
  },
  data: () => {
    return {
      value: ""
    };
  }
});
</script>

<style scoped>
ion-content {
  --overflow: hidden;
}
</style>