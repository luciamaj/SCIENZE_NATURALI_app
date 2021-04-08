<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
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
  modalController,
  IonIcon
} from "@ionic/vue";
import { QrStream } from "vue3-qr-reader";
import { defineComponent } from "vue";
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
    QrStream,
    IonIcon
  },
  props: ["modal"],
  created() {
    this.dataPunti = JSON.parse(JSON.stringify(this.$store.getters.data));
  },
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
    async removeObj() {
      await Storage.remove({ key: "path" });
    },
    ionViewDidEnter() {
      console.log("remove obj");
      this.removeObj();
    },
    onDecode(decodedString) {
      this.value = decodedString;
      const audio = this.dataPunti.find(x => x.external_url == decodedString);
      const dataEl = { index: null, type: null };
      if (audio) {
        dataEl.index = audio.index;
        dataEl.type = audio.type;
      } else {
        dataEl.index = this.dataPunti[0].index;
        dataEl.type = this.dataPunti[0].type;
      }

      this.setObject(dataEl);
      this.close();
    }
  },
  data: () => {
    return {
      value: "",
      title: "Scansiona"
    };
  }
});
</script>

<style scoped>
ion-content {
  --overflow: hidden;
}
</style>