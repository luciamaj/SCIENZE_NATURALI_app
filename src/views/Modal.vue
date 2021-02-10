<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <QrStream @decode="onDecode"></QrStream>
        <div class="result">{{ value }}</div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">{{ content }}</ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/vue";
import { QrStream } from "vue3-qr-reader";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {
    title: { type: String, default: "Super Modal" }
  },
  data() {
    return {
      content: "Content"
    };
  },
  methods: {
    onDecode(decodedString) {
      console.log("the result", decodedString);
      window.open(decodedString);
      this.value = decodedString;
    }
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    QrStream
  }
});
</script>