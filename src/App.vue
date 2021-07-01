<template>
  <ion-app>
    <ion-router-outlet ref="routerOuteletRef" id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref, provide } from "vue";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { HeaderColor } from "@ionic-native/header-color/ngx";

const { StatusBar } = Plugins;

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
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
  }
});
</script>

<style>
@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: 
landscape) {
  html {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    height: 100vw;
    overflow-x: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
</style>