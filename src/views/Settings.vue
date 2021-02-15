<template>
  <ion-page>
    <ion-header collapse="condense">
      <ion-toolbar ion-toolbar color="primary">
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ExploreContainer name="Settings" />
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
import ExploreContainer from "@/components/ExploreContainer.vue";

export default {
  name: "settings",
  components: {
    ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage
  }
};
</script>