<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Stacking Modals</ion-title>
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
  modalController,
} from "@ionic/vue";

import Home from "./Home.vue";

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButton,
  },
  setup() {
    const outlet: any = inject("routerOutlet");

    const openModal = async () => {
      const top = (await modalController.getTop()) || outlet.value.$el;

      const modal = await modalController.create({
        component: Home,
        swipeToClose: true,
        presentingElement: top,
      });
      return modal.present();
    };

    return {
      openModal,
    };
  },
});
</script>

<style scoped>
</style>
