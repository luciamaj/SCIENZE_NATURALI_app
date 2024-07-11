<template>

  <ion-header class="ion-no-border">
    <ion-toolbar >
      <ion-title > GPS</ion-title>
      <ion-buttons slot="start" >
        <ion-button  @click="back"><ion-icon size="large" name="chevron-back" /></ion-button>
      </ion-buttons>
    </ion-toolbar> 
  </ion-header>
  <ion-page>
    <ion-header>
      
    </ion-header>
  
    <ion-content :fullscreen="true">
      <div class="vertical-center ">
        <div class="center-content">
          <div class="map-container">
            <img class="image" src="/assets/background/map/mappa.png">

          </div>

          <div class="logo-container">
            lat: {{ userCoord.latitude }} -
            long {{ userCoord.longitude }} ---
            distanza {{ distance }} m
          </div>

        </div>
      </div>
    </ion-content>
    
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonButton,

  //IonModal
  
} from "@ionic/vue";


import common from "../js/common"
import { useRouter } from "vue-router";
import NavRoot from '@/components/NavRoot.vue';


export default {
  name: "gps",
  props: {
    title: { type: String, default: 'Default Title' }
  },
  data() {
    return {
      userCoord: { latitude: 0, longitude: 0 },
      distance: null,
      cityCoord: { latitude:  45.46836295570483, longitude:9.23224679549364 } 
    };
  },
  setup(){
    NavRoot
  },
 
  components: {
   IonContent,
    IonPage,
        
    //IonModal
  
  },
  computed:{
   
  },

  
  mounted(){
    this.getLocation();
             
  },


  methods: {

    back(){
      const ionNav = document.querySelector('ion-nav') ;
            ionNav.pop();    
    },

    showPosition(position) {
     
      this.userCoord.latitude= position.coords.latitude,
      this.userCoord.longitude= position.coords.longitude
      console.log("mie coord ",   this.userCoord )
      this.calculateDistance(  this.userCoord, this.cityCoord);
            
    },

    showError(error) {
      switch(error.code) {
          case error.PERMISSION_DENIED:
              alert("Accesso alla posizione negato dall'utente.");
              break;
          case error.POSITION_UNAVAILABLE:
              alert("Informazioni sulla posizione non disponibili.");
              break;
          case error.TIMEOUT:
              alert("Timeout della richiesta di posizione.");
              break;
          case error.UNKNOWN_ERROR:
              alert("Errore sconosciuto.");
              break;
      }
   },

    getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.watchPosition(this.showPosition, this.showError);
          console.log("dentro, geo ")
      } else {
          alert("Geolocation is not supported by this browser.");
      }
    },

    calculateDistance(coord1, coord2) {
      const earthRadius = 6371; // Raggio medio della Terra in chilometri
      const lat1 = this.degreesToRadians(coord1.latitude);
      const lon1 = this.degreesToRadians(coord1.longitude);
      const lat2 = this.degreesToRadians(coord2.latitude);
      const lon2 = this.degreesToRadians(coord2.longitude);

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = earthRadius * c;
      this.distance = distance.toFixed(2)*1000; // Arrotonda la distanza a due cifre decimali
    },
    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
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

.center-content {
    display: flex;
    position: absolute;
   
    width: 84vw;
    height:94vh;
    flex-direction: column;
    justify-content: center;
}

.logo-container {
  background-color: #fff;
}

.logo {
  object-fit: contain;
  max-height: 35vh;
  margin-bottom: 50px;
  object-position: center;
  width: 100%;
}
.buttons{
  width: 100%;
  text-align: center;
}

.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}


.powered{
    position: absolute;
    bottom: 25px;
    width: 100vw;
    font-size: 15px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
    color: #136c97;

}
@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>