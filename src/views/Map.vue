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
   
    <ion-content :fullscreen="true">
      <div class="vertical-center ">
        <div class="center-content">
          
            <div id="map"></div>
         
          <div id="punto"></div>

          <div class="logo-container">
            lat: {{ userCoord.latitude }} -
            long {{ userCoord.longitude }} ---
            distanza {{ distance }} m
            <ion-button  @click="updateMap">remap</ion-button>
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
import L from "leaflet";
import 'leaflet/dist/leaflet.css';




export default {
  name: "gps",
  props: {
    title: { type: String, default: 'Default Title' }
  },
  data() {
    return {
      userCoord: { latitude: 0, longitude: 0 },
      distance: null,
      cityCoord: { latitude:  45.46836295570483, longitude:9.23224679549364 } ,
      coord: [
        [ 45.58283251014277, 8.96687190033312],
        [ 45.58283251014277, 9.429670949972401],
        [ 45.35216866591035, 8.96687190033312],
        [ 45.35216866591035, 9.429670949972401]

    ],
     lastTouchDistance : 0,
    lastScale : 1,
    map: null,
    bounds: [[0,0], [987,1248]],
     imageBounds : [[0,0], [987,1248]],
    url: '/assets/background/map/mappa.png',
    itens: [],
    markers: []
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
    this.drawMap();
    setTimeout(() => {
      this.updateMap();
    }, 500);
  
// this.getimagepos();
this.getItens();
   
             
  },


  methods: {

  
    getItens() {
      this.itens = [
        {id: '1', description: 'Centro', latLng: [ 398,589], status: Math.floor((Math.random() * 2) + 1)},
        {id: '2', description: 'Gaggiano', latLng: [171, 193 ], status: Math.floor((Math.random() * 2) + 1)},
        {id: '3', description: 'forna', latLng: this.coordtopixelPunti(45.49004314703912, 8.895382882487887), status: Math.floor((Math.random() * 2) + 1)}
      ];
    },

    drawMap() {
     
      // Inicializa o mapa, utilizando o sistema de coordenadas simples
      this.map = L.map('map', {
        crs: L.CRS.Simple, zoom:1,
        maxZoom: 3,
        minZoom: -1,
        maxBounds:this.bounds,
        maxBoundsViscosity: 1.0
      }).setView([0, 0])
      // Carrega a imagem do mapa, com seus limites

      
      L.imageOverlay(this.url, this.imageBounds).addTo(this.map);
     this.map.fitBounds(this.bounds);
      //this.map.setMaxBounds(this.bounds);
      
      // Exclui marcadores anteriores
      this.map.invalidateSize();
      this.markers = [];
      // Converte os itens em marcadores
      this.itens.forEach((item, index, array)=>{
        const markerX = L.marker(L.latLng(item.latLng), {draggable: false})
          .setIcon(this.getIcon(item.status))
        markerX.itemId = item.id;
        this.markers.push(markerX);
      });
      // Adiciona os marcadores ao mapa, setando as propriedades comuns
     L.featureGroup(this.markers).addTo(this.map);
    },

    getIcon(status) {
      // Inicializa os ícones
      const ColorIcon = L.Icon.extend({
        options: {
            shadowUrl: '',
            iconSize: [25, 41],
            iconAnchor: [15, 13],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }
      });
      const icons = [];
      // Ícone verde: status 1 'Disponível'
      icons[1] = new ColorIcon({iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'});
      // Ícone vermelho: status 2 'Vendido'
      icons[2] = new ColorIcon({iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'});
      return icons[status];
    },
    updateMap() {
      this.map.remove();
     // this.getItens();
      this.drawMap();
    },

    back(){
      const ionNav = document.querySelector('ion-nav') ;
            ionNav.pop();    
    },

    showPosition(position) {
     
      this.userCoord.latitude= position.coords.latitude,
      this.userCoord.longitude= position.coords.longitude
      console.log("mie coord ",   this.userCoord )
      this.calculateDistance(  this.userCoord, this.cityCoord);
     // this.getimagepos();
    this.coordtoCart()
    this.coordtopixel()
            
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
    },

    getimagepos(){
      this.mappa=$("#mappa")
      console.log("getmap", this.mappa)
      //this.mappa2=document.getElementById("mappa-cont")
     // const rect =  this.mappa2.getBoundingClientRect();

    
        // Chiamata a getBoundingClientRect() qui
        this.mappa2 = document.getElementById("mappa-cont");
        const rect = this.mappa2.getBoundingClientRect();
        console.log("getmapc", this.mappa2)
       console.log("rect", rect);
   
     

    },

    coordtoCart(){

    // Esempio di utilizzo
      
      const latitude = 45.35216866591035;
      const longitude = 9.429670949972401;

      this.coord.forEach(coor=>{const mercatorCoords=this.mercatorProjection(coor[0], coor[1])
        console.log("mercatorCoords ", mercatorCoords);
      
      })

     const miecoordtrasform=this.mercatorProjection(this.userCoord.latitude, this.userCoord.longitude)
     console.log("miecoordtrasform ", miecoordtrasform);
      //const mercatorCoords = this.mercatorProjection(latitude, longitude);
      
    },

    coordtopixel(){

     
    const  lat1= 45.71241717967386
    const  lon1= 8.69531166660485
   
    const  lat2=  45.18079075895875
    const  lon2= 9.640075829782067


   
      const pixel_x = 1248 * (this.userCoord.longitude - lon1) / (lon2 - lon1)
      const pixel_y = 987 * (this.userCoord.latitude - lat1) / (lat2 - lat1)

      console.log( "pixel",pixel_x,  pixel_y);
      this.punto= document.getElementById('punto');
      this.punto.style.top=(pixel_y)+"px";
      this.punto.style.left=pixel_x+"px";

    },
    coordtopixelPunti(lat,lon){

     
const  lat1= 45.71241717967386
const  lon1= 8.69531166660485

const  lat2=  45.18079075895875
const  lon2= 9.640075829782067



  const pixel_x = 1248 * (lon - lon1) / (lon2 - lon1)
  const pixel_y = 987 * (lat - lat1) / (lat2 - lat1)

  console.log( "pixel",pixel_x,  pixel_y);
  return [(987-pixel_y),(pixel_x )]

},

     
    mercatorProjection(lat, lon) {
    // Converti latitudine e longitudine da gradi a radianti
      const latRad = lat * (Math.PI / 180);
      const lonRad = lon * (Math.PI / 180);

      // Proiezione di Mercatore
      const x = lonRad;
      const y = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

      return { x, y };
  },

  gestisciTouchStart(event) {
  if (event.touches.length === 2) {
    this.lastTouchDistance = Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY
    );
  }
},

gestisciTouchMove(event) {
  if (event.touches.length === 2) {
    const newTouchDistance = Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY
    );
    const scaleDelta = newTouchDistance / this.lastTouchDistance;
    const newScale = this.lastScale * scaleDelta;

    // Limita il fattore di scala minimo e massimo
    newScale = Math.min(Math.max(0.5, newScale), 3);

    document.getElementById('immagine').style.transform = 'scale(' + newScale + ')';
    this.lastTouchDistance = newTouchDistance;
    this.lastScale = newScale;
  }
},


gestisciTouchEnd() {
  lastTouchDistance = 0;
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
   
    width:100vw;
    height:100vh;
    flex-direction: column;
    justify-content: center;
}
.leaflet-container{
  background: #ffffff!important;
}
/*.map-container{
  height: 80vh;
}*/
/*.image-map{
  height: 100%;
  object-fit: contain;
    object-position: top;

}*/
#map { 
  width:100%;
  height: 500px;


}
.livello-marker {
    width: auto;
    position: absolute  !important;;
    top: 0;
    left: 0;
}
#punto{
  width: 5px;
  height: 5px;
  position: absolute;
  top: 0;
  left: 0;
  background: red;
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

.toolbar {
   --background:  red;
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