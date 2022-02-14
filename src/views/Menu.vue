<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>MENU  {{notification}}</ion-title>
       
        <ion-buttons slot="end">
            <ion-button @click="close"> 
                <ion-icon size="large" name="chevron-down-outline" />
            </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
     <ion-title class="content-title">Settings</ion-title>
     <div class="button-container">
         
        <ion-button expand="block" size="large" color="secondary" :disabled="!notification" @click="showOptions"> 
            <ion-icon slot="start" size="large" name="checkmark-circle-outline" /><ion-badge  mode="ios" color="danger" class="notification"  v-model="notificationState" :class="{showNotification:notificationState}">1</ion-badge>
            <div class="button-text"> Aggiorna contenuti</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
            <ion-button expand="block" size="large" color="secondary" > 
            <ion-icon   slot="start" size="large" name="language" />
            <div class="button-text"> Cambia lingua</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
        <ion-button expand="block" size="large" color="secondary" > 
            <ion-icon  slot="start" size="large" name="information-circle-outline" />
            <div class="button-text"> Help</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
         <ion-button expand="block" size="large" color="secondary" > 
            <ion-icon  slot="start" size="large" name="information-circle-outline" />
            <div class="button-text"> Copiright</div>
            <ion-icon  slot="end" size="large" name="chevron-forward" />
        </ion-button>
       
     </div>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  modalController,
  alertController,
  IonIcon,
   IonBadge
} from "@ionic/vue";

import { data } from "../data/data";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;


export default defineComponent({
  name: "Menu",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonBadge,
    IonIcon
  },
  props: {
          notification: { type: Boolean, default: false },
  },
  mounted(){
    console.log("NOTIFICATON "+ this.notification);

    this.notificationState=this.notification;
  },
  methods: { 

    hide(){
      this.notificationState=false;
    },
    async close() {
      const top = await modalController.getTop();
      top.dismiss();
    },


    async showOptions() {
      const alert = await alertController.create({
      header: "Aggiornamento",
      message: "Sono disponibili aggiornamenti dei contenuti",
      buttons: [
        {
          text: "Scarica",
          handler: () => {
            console.log("Accepted");
             this.emitter.emit('aggiorna');
             this.notificationState=false
          },
        },
        {
          text: "Postponi",
          role: "cancel",
          handler: () => {
            console.log("Declined the offer");
            
          },
        },
      ],
    });

    await alert.present();
  },

    
  },
  data: () => {
    return {
      value: "",
      title: "Menu",
      notificationState:false,
    };
  }
});
</script>

<style scoped>

.content-title{
margin-top: 30px;
}
.button-container{
    position: relative;
    height: 47vh;
    top: 15%;
    padding: 8vw;
}
.button-container>ion-button{
    text-transform: capitalize;
    margin: 25px 0;
    
}
.button-text{
       width: 80%;
    text-align: start;
    padding-left: 13px;
    font-size: 0.9em;
   
}
.notification{
  width: 10px;
  visibility:hidden;
  height: 16px;
}
.showNotification{
  visibility: visible;
}

</style>