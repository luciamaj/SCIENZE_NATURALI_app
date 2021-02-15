<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Scanner</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="vertical-center">
        <div class="center">
          <IonButton @click="openModal">Open scanner</IonButton>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  modalController
} from "@ionic/vue";

import Home from "./Home.vue";
import Scanner from "./Scanner.vue";
import { Plugins } from "@capacitor/core";
import { useRouter, useRoute } from "vue-router";
const { Storage } = Plugins;

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButton
  },
  methods: {
    async getObject() {
      const ret = await Storage.get({ key: "path" });
      console.log(ret);
    }
  },
  setup() {
    const outlet: any = inject("routerOutlet");
    const router = useRouter();
    const route = useRoute();

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
        console.log("the obj", obj.path);
        if (obj.path != "") {
          router.push({ path: "/audioguida-modal/" + obj.path });
        }
      });

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

.center {
  display: block;
  margin: auto;
}
</style>
