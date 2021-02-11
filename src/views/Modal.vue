<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-icon @click="close" size="large" name="close" />
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button @click="closeMe">Close Me!</ion-button>
    </ion-content>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonContent
} from "@ionic/vue";

export default {
  name: "Modal",
  components: { IonHeader, IonToolbar, IonIcon, IonButton, IonContent },
  props: {
    title: { type: String, default: "Super Modal" },

    closeMe: { type: Function, default: () => {} }
  },
  data() {
    return {
      content: "Content"
    };
  },
  methods: {
    close() {
      this.$emit("close", { foo: "bar" });
    }
  }
};
/* eslint-enable */
</script>