<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" mode="ios">
        <ion-title>Scanner</ion-title>
        <ion-icon @click="close" size="large" name="close" />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <QrStream @decode="onDecode"></QrStream>
      <div class="result">{{ value }}</div>
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
  IonIcon
} from "@ionic/vue";
import { QrStream } from "vue3-qr-reader";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export default defineComponent({
  name: "Scanner",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    QrStream,
    IonIcon
  },
  props: ["modal"],
  mounted(){
    
    this.schedaState(true);
    this.time=setTimeout(() => {
      this.presentAlert();
    }, 30000);
    this.statusCam();
   

  },
  ionViewDidEnter() {
      console.log("remove obj");
      this.removeObj();
      
  },
  methods: {
    async statusCam() {
      const status = await navigator.permissions.query({name: "camera"})
      console.log("status",status);
      if(status.state=="denied"){
        this.alertPermissions();
       
      }
      if(status.state=="prompt"){
          this.alertPermissions();
          status.addEventListener('change', ()=>{
             this.PermissionAlert.dismiss()
          })
       
         
      }

    },
    async close() {
      const top = await modalController.getTop();
       this.schedaState(false)
       clearTimeout(this.time);
      top.dismiss();
    },
    async setObject(param) {
      await Storage.set({
        key: "scheda",
        value: JSON.stringify({
          path: param
        })
      });
    },
    async removeObj() {
      await Storage.remove({ key: "scheda" });
    },
    async schedaState(state) {
      console.log("openScheda");
      await Storage.set({
        key: 'openScheda',
        value:state
      });
    },
    
    onDecode(decodedString) {
      this.value = decodedString.split('/');
      this.tag=this.value[ this.value.length-1]
      let media = JSON.parse(localStorage.getItem("dataMostra")).find(x => x.tag == this.tag);
      const lang= localStorage.getItem("lang")
      if(media){
        media=media.content.find(x => x.lang == lang);
        console.log("content",media);
        const dataEl = { index: this.tag, type: media.type };
        this.setObject(dataEl);
        this.close();
      }else{
        this.presentAlert();
      }

     
    },
    presentAlert() {
      const alert = document.createElement('ion-alert');
      alert.mode='ios'
      alert.header = 'Alert';
      alert.message = 'Qr code non riconosciuto';
      alert.buttons = ['OK'];

      document.body.appendChild(alert);
      return alert.present();
    },
    alertPermissions() {
      const permAlert = document.createElement('ion-alert');
      permAlert.mode='ios'
      permAlert.header = 'Alert';
      permAlert.message = 'La camera non ha i permessi necessari';
      permAlert.buttons = ['OK'];

      document.body.appendChild(permAlert);
      this.PermissionAlert=permAlert;
      return permAlert.present();
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
</style>