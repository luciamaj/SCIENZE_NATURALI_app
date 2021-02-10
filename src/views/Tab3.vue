<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 3</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
      <button v-on:click="openModal()">OPEN SCANNER</button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  modalController,
  IonContent
} from "@ionic/vue";
import Modal from "./Modal.vue";

export default {
  name: "Tab3",
  components: {
    // ScanContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage
  },
  methods: {
    async openModal() {
      const modal = await modalController.create({
        component: Modal,
        cssClass: "my-custom-class",
        componentProps: {
          title: "New Title"
        }
      });
      return modal.present();
    }
  }
};
</script>