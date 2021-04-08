<template>
  <ion-app>
    <ion-router-outlet ref="routerOuteletRef" id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref, provide } from "vue";
import { Plugins, StatusBarStyle } from "@capacitor/core";

const { StatusBar } = Plugins;

declare const dataPunti;

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet
  },
  ionViewWillEnter() {
    this.statusBar.styleDarkContent();
    this.statusBar.backgroundColorByHexString("#fff");

    StatusBar.setStyle({
      style: StatusBarStyle.Dark
    });

    StatusBar.setBackgroundColor({
      color: "#FFF"
    });


  },
  mounted() {
    const routerOuteletRef = ref(null);
    provide("routerOutlet", routerOuteletRef);

    return { routerOuteletRef };
  }
});
</script>