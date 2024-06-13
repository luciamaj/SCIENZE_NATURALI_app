<template>
  
    <ion-header>
      <ion-toolbar color="white" mode="ios">
      
        <ion-icon @click="close" size="large" name="close" />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false">
      
      <div class="back"> <div class="capting-icon-container"> <img src="/assets/background/capting.gif" ></div></div>
    </ion-content>

</template>

<script>
import {
  IonHeader,
  IonToolbar,
 
  IonContent,
  modalController,
  IonIcon
} from "@ionic/vue";
import { QrStream } from "vue3-qr-reader";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export default defineComponent({
  name: "capting",
  components: {
    IonHeader,
    IonToolbar,
  
    IonContent,
    IonIcon
  },
  props: ["modal"],

  
  methods: {
    
    async close() {
      const top = await modalController.getTop();
   
      top.dismiss();
    },

  },
  data: () => {
    return {
      value: "",
      title: "Scansiona"
    };
  }
});
</script>

<style scoped>
ion-content {
  --overflow: hidden;
}

.back{
  background-color:rgba(245, 245, 245, 0.404) ;
  opacity: 0.8;
}



</style>