<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="vertical-center">
        <div class="center">
          <ion-img class="logo" src="/assets/imgs/logo_museo.svg"></ion-img>
        </div>
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
  IonImg
} from "@ionic/vue";

export default {
  name: "welcome",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonImg
  },
  mounted() {
    console.log("waaaa", this.$router);
  },
  data() {
    return {
      title: "Benvenuto"
    };
  }
};
</script>

<style scoped>
.vertical-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.center {
  display: block;
  margin: auto;
  width: 50%;
}

.logo {
  height: 30em;
}

ion-content {
  --overflow: hidden;
}
</style>