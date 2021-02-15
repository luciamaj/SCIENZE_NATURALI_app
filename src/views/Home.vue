<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Scanner</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <IonButton @click="openModal">Open Modal</IonButton>
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
  setup() {
    const outlet: any = inject("routerOutlet");

    const openModal = async () => {
      const top = (await modalController.getTop()) || outlet.value.$el;

      const modal = await modalController.create({
        component: Scanner,
        swipeToClose: true,
        presentingElement: top
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
</style>
