<template>
  <ion-app>
    <ion-router-outlet ref="routerOuteletRef" id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref, provide } from "vue";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { HeaderColor } from "@ionic-native/header-color/ngx";

const { StatusBar } = Plugins;

// TODO: open -a Google\ Chrome --args --disable-web-security --user-data-dir --------> PER APRIRE IN DEBUG

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