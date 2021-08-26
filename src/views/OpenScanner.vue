<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="vertical-center">
        <div class="center">
          <ion-img class="qr-img" src="/assets/imgs/logo_museo.svg"></ion-img>
          <IonButton class="scan-btn" @click="openModal">INQUADRA UN QR CODE</IonButton>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  modalController,
  IonImg
} from "@ionic/vue";

import Scanner from "./Scanner.vue";
import { Plugins } from "@capacitor/core";
import { useRouter } from "vue-router";
const { Storage } = Plugins;

export default defineComponent({
  name: "Open Scanner",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButton,
    IonImg,
    IonHeader
  },
  methods: {
    async getObject() {
      const ret = await Storage.get({ key: "path" });
      console.log(ret);
    }
  },
  data() {
    return {
      title: "Ascolta"
    };
  },
  setup() {
    const router = useRouter();

    const openModal = async () => {
      const top = await modalController.getTop();

      const modal = await modalController.create({
        component: Scanner,
        swipeToClose: true,
        presentingElement: top
      });

      modal.onDidDismiss().then(async _ => {
        console.log("dismissed");
        const objStr = await Storage.get({ key: "path" });
        const obj = JSON.parse(objStr.value);
        if (obj != null) {
          if (obj.path.type == "audio") {
            router.push({ path: "/audio/" + obj.path.index });
          } else {
            router.push({ path: "/video/" + obj.path.index });
          }
        }
      });

      await Storage.remove({ key: "path" });

      return modal.present();
    };

    return {
      openModal
    };
  }
});
</script>

<style scoped>
.vertical-center {
  display: flex;
  justify-content: center;
  height: 100%;
}

.qr-img {
  height: 200px;
  width: auto;
  display: block;
  filter: grayscale(100%) brightness(120%);
}

.scan-btn {
  display: block;
  margin: 30px 60px;
}

.center {
  display: block;
  margin: auto;
}

ion-content {
  --overflow: hidden;
}
</style>
