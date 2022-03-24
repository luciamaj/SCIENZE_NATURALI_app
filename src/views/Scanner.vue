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

<script>
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
  mounted(){
    this.schedaState(true);

  },
  methods: {
    async close() {
      const top = await modalController.getTop();
       this.schedaState(false)
      top.dismiss();
    },
    async setObject(param) {
      await Storage.set({
        key: "scheda",
        value: JSON.stringify({
          path: param
        })
      });
    },
    async removeObj() {
      await Storage.remove({ key: "scheda" });
    },
    async schedaState(state) {
      console.log("openScheda");
      await Storage.set({
        key: 'openScheda',
        value:state
      });
    },
    ionViewDidEnter() {
      console.log("remove obj");
      this.removeObj();
      
    },
    onDecode(decodedString) {
      this.value = decodedString.split('/');
      this.tag=this.value[ this.value.length-1]
      let media = JSON.parse(localStorage.getItem("dataMostra")).find(x => x.tag == this.tag);
      const lang= localStorage.getItem("lang")
      media=media.content.find(x => x.lang == lang);
       console.log("content",media);
      //const dataEl = { index: this.value[ this.value.length-1], type: "audio" };
 
      const dataEl = { index: this.tag, type: media.type };
     /* if (audio) {
        dataEl.index = audio.index;
        dataEl.type = audio.type;
      } else {
        dataEl.index = data[0].index;
        dataEl.type = data[0].type;
      }*/

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