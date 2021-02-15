<template>
  <ion-page class="ion-page" main>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ title }}</ion-title>
        <ion-buttons v-if="showBackButton">
          <ion-back-button default-href="/" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-content" padding></ion-content>
    <slot></slot>
    <ion-footer>
      <div class="footer-text">Carefully crafted by</div>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonBackButton,
  IonButtons
} from "@ionic/vue";

export default {
  name: "IonVuePage",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter,
    IonBackButton,
    IonButtons
  },
  props: {
    title: { type: String, default: "" },
    showBackButton: { type: Boolean, default: false }
  }
};
</script>

<style scoped>
.footer-text {
  font-size: 80%;
  margin: 10px 0;
  text-align: center;
}
.modus-labs-logo {
  display: block;
  margin: 0 auto 10px auto;
  width: 9.6825rem;
}
</style>