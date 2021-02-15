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

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet
  },
  mounted() {
    const routerOuteletRef = ref(null);
    provide("routerOutlet", routerOuteletRef);

    StatusBar.setStyle({
      style: StatusBarStyle.Light
    });

    // Display content under transparent status bar (Android only)
    StatusBar.setOverlaysWebView({
      overlay: true
    });

    return { routerOuteletRef };
  }
});
</script>