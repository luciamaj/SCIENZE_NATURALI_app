<template>
  <ion-content>
    <ion-slide>
      <div class="diag" style="background: url('assets/img/whitebg.svg') no-repeat">
        <ion-icon ios="ios-analytics" md="md-analytics" color="primary"></ion-icon>
      </div>
      <div>
        <h2>track your routine</h2>
        <p>whether it's sets, reps, weight used, you can track it all with our intuitive interface.</p>
      </div>
    </ion-slide>

    <ion-slide>
      <div class="diag" style="background: url('assets/img/whitebg.svg') no-repeat">
        <ion-icon ios="ios-trophy" md="md-trophy" color="primary"></ion-icon>
      </div>
      <div>
        <h2>set personal goals</h2>
        <p>we're all in the gym for a reason: goals. set goals for diet and fitness.</p>
      </div>
    </ion-slide>

    <ion-slide>
      <div class="diag" style="background: url('assets/img/whitebg.svg') no-repeat">
        <ion-icon ios="ios-chatboxes" md="md-chatboxes" color="primary"></ion-icon>
      </div>
      <div>
        <h2>chat with others</h2>
        <p>inspire and help each other reach fitness and diet goals.</p>
      </div>
    </ion-slide>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  modalController
} from "@ionic/vue";

import Home from "./Home.vue";
import Scanner from "./Scanner.vue";
import { Plugins } from "@capacitor/core";
import { useRouter, useRoute } from "vue-router";
const { Storage } = Plugins;

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButton
  },
  methods: {
    async getObject() {
      const ret = await Storage.get({ key: "path" });
      console.log(ret);
    }
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const openModal = async () => {
      const top = await modalController.getTop();

      const modal = await modalController.create({
        component: Scanner,
        swipeToClose: true,
        presentingElement: top
      });

      modal.onDidDismiss().then(async _ => {
        console.log("dismissed");
        const objStr = await Storage.get({ key: "path" });
        const obj = JSON.parse(objStr.value);
        if (obj != null) {
          router.push({ path: "/audioguida-modal/" + obj.path });
        }
      });

      await Storage.remove({ key: "path" });

      return modal.present();
    };

    return {
      openModal
    };
  }
});
</script>

<style scoped>
.vertical-center {
  display: flex;
  justify-content: center;
  height: 100%;
}

.center {
  display: block;
  margin: auto;
}

ion-content {
  --overflow: hidden;
}
</style>