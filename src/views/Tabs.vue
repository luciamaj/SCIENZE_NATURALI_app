<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar>
        <!--ion-tab-button tab="tab1" href="/tabs/welcome">
          <ion-icon :icon="home" />
        </ion-tab-button-->

        <ion-tab-button tab="tab2" href="/tabs/open-scanner">
          <ion-icon :icon="qrCodeOutline" />
        </ion-tab-button>

        <!--ion-tab-button tab="tab3" href="/tabs/settings">
          <ion-icon :icon="radio" />
        </ion-tab-button-->
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage } from "@ionic/vue";
import { home, radio, qrCodeOutline } from "ionicons/icons";

export default {
  name: "Tabs",
  components: { IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
  setup() {
    return {
      home,
      radio,
      qrCodeOutline
    };
  }
};
</script>