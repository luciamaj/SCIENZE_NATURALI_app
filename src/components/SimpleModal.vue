<template>
  <div>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ title }}</ion-title>
        <ion-icon @click="close" size="large" name="close" />
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      {{ title }}
      <br />
      <ion-button @click="closeMe">Close Me!</ion-button>
    </ion-content>
  </div>
</template>

<script>
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent
} from "@ionic/vue";

export default {
  name: "ModalContent",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent
  },
  props: {
    title: { type: String, default: "Super Modal" },
    /* eslint-disable */
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
</script>