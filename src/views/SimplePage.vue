<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title slot="start" >WAvE B - {{store}}</ion-title>
        
      </ion-toolbar> 
    </ion-header>
  
    <ion-content :fullscreen="true">
    
          <div class="buttons">
          
            <ion-button  class="test-btn" id="test" @click="callJava" >call</ion-button>
          </div>

          Risposta: {{answ}}
         
    </ion-content>
    
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,

  //IonModal
  
} from "@ionic/vue";


import { Plugins } from "@capacitor/core";

import { useRouter } from "vue-router";

const { Storage } = Plugins;

export default {
  name: "Tab",
  data() {
    return {
      decodedValue: "",
      name: "AUDIBLE MUSEUM",
      store:"",
      notification:false,
     ntag:"",
     playing:false,
    };
  },
 
  components: {
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,    
    //IonModal
  
  },
  


  methods: {
 
    openpage(){
     // this.$router.push({ path: "/audio/A0002"  });
      this.$router.push({ path: "/test"  });
    },

    callJava(){
      const answ= AndroidObject.executeJavaCode();
      alert("Risposta  "+answ);
      this.answ=answ;

      
   

    }

   
  }
};
</script>

<style scoped>

ion-content {
  --overflow: hidden;
}

.vertical-center {
  display: flex;
  justify-content: center;
  height: 100%;
}

.center {
  display: block;
  position: absolute;
  bottom: 0;
  padding-bottom: 20vh;
}

.logo-container {
  background-color: #fff;
}

.logo {
  object-fit: contain;
  max-height: 30vh;
  margin-bottom: 50px;
  object-position: center;
  width: 100%;
}
.buttons{
  width: 100%;
  text-align: center;
}
.view-wwave-container {
  background-color: white;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-blend-mode: saturation;
}

.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}

.toolbar {
   --background:  red;
}

.capture-btn {
  font-weight: 700;
  width: 280px;
  margin: 15px auto;
}
#captureStart{
    --background:var(--ion-color-secondary);
}
#captureStop {
  --background: #2d9fe3;
}

.toolbar-background {
  color: black !important;
}
.notification{
  width: 10px;
  visibility:hidden;
  height: 16px;
}
.showNotification{
  visibility: visible;
}

@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>