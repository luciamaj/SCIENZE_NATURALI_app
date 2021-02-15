<template>
  <IonVuePage :title="'Modal'">
    <ion-button @click="openModal">Open Modal</ion-button>
    <ModalContent
      ref="modalContent"
      v-show="isOpen"
      title="My Modal"
      :closeMe="closeModal"
      @close="closeModal"
    />
  </IonVuePage>
</template>

<script>
import { modalController } from "@ionic/core";

import {
  //IonPage,
  //IonHeader,
  //IonToolbar,
  //IonTitle,
  IonButton
  //IonContent,
} from "@ionic/vue";

import ModalContent from "@/components/SimpleModal.vue";
import IonVuePage from "@/views/IonVuePage.vue";

export default {
  name: "Modal",
  components: {
    ModalContent,
    //IonPage,
    //IonHeader,
    //IonToolbar,
    //IonTitle,
    IonButton,
    //IonContent,
    IonVuePage
  },
  data() {
    return {
      isOpen: false,
      modal: null
    };
  },
  methods: {
    async createModal() {
      this.modal = await modalController.create({
        component: this.$refs.modalContent.$el
      });
    },
    async openModal() {
      await this.createModal();
      this.isOpen = true;
      this.modal.present();
    },
    closeModal() {
      this.modal.dismiss();
    }
  }
};
</script>