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

declare const dataPunti;

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet
  },
  created() {
        //const dataPunti = "waa";
     this.$loadScript("config/conf.js")
    .then((data) => {
      // eslint-disable-next-line
      console.log(dataPunti);
      console.log(this.dataPunti);
    })
    .catch(() => {
      // Failed to fetch script
    });
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