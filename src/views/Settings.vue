<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>{{ title }}</ion-title>
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
  },
  data() {
    return {
      title: "Impostazioni"
    };
  }
};
</script>

<style scoped>
ion-content {
  --overflow: hidden;
}
</style>