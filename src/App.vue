<template>
  <ion-app>
    <ion-router-outlet ref="routerOuteletRef" id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref, provide } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const routerOuteletRef = ref(null);
    provide("routerOutlet", routerOuteletRef);

    return { routerOuteletRef };
  }
});
</script>