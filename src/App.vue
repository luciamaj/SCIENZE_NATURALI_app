<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins, PermissionType } from "@capacitor/core";
const { Permissions, PermissionsOptions } = Plugins;

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
      const hasPermission = await Permissions.query(PermissionsOptions.Camera);
      console.log("permissions", hasPermission.state);
    }
  }
});
</script>