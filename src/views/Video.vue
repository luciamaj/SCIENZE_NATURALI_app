<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab</ion-title>
        </ion-toolbar>
      </ion-header>

      <vue-plyr :options="options">
        <video controls crossorigin playsinline>
          <source src="https://api.gelato.loudsrl.com/api/test/video/1.mp4" type="video/mp4" />
        </video>
      </vue-plyr>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/vue";

export default {
  name: "Tab",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage
  },
  data() {
    return {
      setup: { fluid: true }
    };
  }
};
</script>