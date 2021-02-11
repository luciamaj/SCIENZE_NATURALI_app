<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-toolbar>
          <ion-icon @click="close" size="large" name="close" />
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
  IonContent,
  IonIcon
} from "@ionic/vue";
import { QrStream } from "vue3-qr-reader";

export default {
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
  methods: {
    close() {
      console.log("close");
      this.$router.back();
    },
    onDecode(decodedString) {
      window.open(decodedString);
      this.value = decodedString;
      console.log("the result", this.value);
    }
  },
  data: () => {
    return {
      value: ""
    };
  }
};
</script>