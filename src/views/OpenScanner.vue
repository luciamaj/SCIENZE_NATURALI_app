<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="centered">
        <ion-button @click="openModal">Open Modal</ion-button>
      </div>
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
  IonButton
} from "@ionic/vue";

export default {
  name: "OpenScanner",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent
  },
  data() {
    return {
      isOpen: false,
      modal: null
    };
  },
  methods: {
    openModal() {
      console.log("logging");
      this.$router.push({ name: "scanner" });
    },
    closeModal() {
      this.modal.dismiss();
    }
  }
};
</script>

<style scoped>
.centered {
  text-align: center;
}
</style>