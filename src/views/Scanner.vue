<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-toolbar>
          <ion-title>Scanner</ion-title>
        </ion-toolbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">SCANNER</ion-title>
        </ion-toolbar>
      </ion-header>

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
  IonContent
} from "@ionic/vue";
import { QrStream } from "vue3-qr-reader";
import { data } from "../data/data";
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "Scanner",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    QrStream
  },
  methods: {
    close() {
      console.log("close");
      this.$router.back();
    },
    onDecode(decodedString) {
      window.open(decodedString);
      this.value = decodedString;
      const audio = data.find(x => x.external_url == decodedString);
      let index;
      if (audio) {
        index = audio.index;
      } else {
        index = data[0].index;
      }

      this.$router.push({ path: "/audioguida-modal/" + index.toString() });
    }
  },
  data: () => {
    return {
      value: ""
    };
  }
});
</script>