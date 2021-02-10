<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet
  },
  mounted() {
    this.askPermissions();
  },
  methods: {
    async askPermissions() {
      navigator.permissions.query({ name: "camera" });
    }
  }
});
</script>