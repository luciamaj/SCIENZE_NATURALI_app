<template>
  <ion-page>
  <ion-header class="ion-no-border">
    <ion-toolbar class="toolbar" >
      <ion-title > </ion-title>
      <ion-buttons slot="start" >
        <ion-button v-on:click="aletrtexit()" class="back-button"><ion-icon size="medium" name="arrow-back"></ion-icon> {{$t('schede.back')}}</ion-button>
      </ion-buttons>

      <ion-buttons slot="end" >
        <ion-button v-if="visited.length>0" color="secondary"  @click="openviste()" class="collection-button">
          <ion-icon   name="file-tray-full-outline" class="history-icon"></ion-icon>
        </ion-button>
        <ion-button v-on:click="aletrtMap()" class="back-button"><ion-icon size="medium" name="help-circle-outline"></ion-icon> </ion-button>
      </ion-buttons>
    </ion-toolbar> 
  </ion-header>

   
    <ion-content :fullscreen="true">
      <div class="vertical-center ">
        <div :class="isloaded==false ?'blur':'' ">
          
          <div id="map"   style="height: 95vh; width: 100vw;" ></div>
         
          <div id="punto"></div>

          <div class="logo-container">
            <ion-button class="reload-button" @click="updateMap"><img class="icon-button" src="assets/background/reload.png"></ion-button>
            
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
  IonHeader,
  alertController
  //IonModal
  
} from "@ionic/vue";


import common from "../js/common"
import { useRouter } from "vue-router";

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
      cityCoord: { latitude:  45.466479544159796, longitude:9.192086626765356 } ,
     
      map: null,
     
      mapheight:this.conf.altezzaMappa,
      mapwidth:this.conf.larghezzaMappa,
      bounds: [[0,0], [this.conf.altezzaMappa,this.conf.larghezzaMappa]],
      imageBounds : [[0,0], [this.conf.altezzaMappa,this.conf.larghezzaMappa]],

     /* bergamo
     mapwidth:2645,
      mapheight:3000,
      bounds: [[0,0], [3000,2645]],
      imageBounds : [[0,0], [3000,2645]],*/

      /*milano
      mapwidth:1248,
      mapheight:987,
    bounds: [[0,0], [987,1248]],
      imageBounds : [[0,0], [987,1248]],*/

      url: '/assets/background/map/mappa.png',
      items: [],
      markers: [],
      open:false,
      isloaded:false,
      range:0,
    };
  },
  
  components: {
   IonContent,
    IonPage,
    IonHeader,
    //IonModal
  
  },
  computed:{
    schede(){
      const data=localStorage.getItem("dataMostra")
     
      const schede= JSON.parse(data);
      return schede
    },
    lang() {
      const lang= localStorage.getItem("lang")
      if (lang) {
        return lang;
      } else {
        return this.$i18n.locale;
      }
    },

    visited(){
      let visitedTag=localStorage.getItem("schede_viste_onmap");  
      if(visitedTag){
          visitedTag=visitedTag.split(',');
          console.log("visitedtag: ",visitedTag)
          return visitedTag;
      }else{
          return [];
      } 
    }

  },
 

  beforeMount(){
   
    this.range=this.conf.range;
    this.lat1=this.conf.lat1;
    this.lon1=this.conf.lon1;
    this.lat2=this.conf.lat2;
    this.lon2=this.conf.lon2;
    console.log("configlatlan", this.lat1,this.lat2, this.lon1, this.lon2);

    this.schede.forEach(scheda=>{
      const cont= scheda.content.find(x => x.lang == this.lang);
    
      if(scheda.coord!=null){
        const status= !this.visited.includes(scheda.tag)?1:2; 
        const point={id:scheda.tag, description: cont.titolo, latLng: this.coordtopixelPunti(scheda.coord.latitude, scheda.coord.longitude), status: status, img:scheda.img};
        this.items.push(point);
      }
    })
        
   
  },
  mounted(){
    this.getLocation();
    this.drawMap();

    if(localStorage.getItem("alertmappaletto")!=1){
      this.aletrtMap();
    }

    setTimeout(() => {
      this.updateMap();
      this.isloaded=true;
      
    }, 450);
  
   console.log("items",this.items)
             
  },


  methods: {
    savedtag(tags){
        this.visitedTag=tags;
    },
    async aletrtMap() {
      const alert = await alertController.create({
        //header: this.$t('menu.lang.add') ,
        message: "Esplora la mappa raggiungendo i punti segnati" ,
        buttons: [
          {
            text: "Conutinua",
            cssClass:'modal-accept-button',
            handler: async() => {
             localStorage.setItem("alertmappaletto",1)
            
            
            },
           
          },
          
        ],
      });

      await alert.present();
    },

    async aletrtexit() {
      const alert = await alertController.create({
       // header: this.$t('menu.lang.add') ,
        message: "Uscendo la geolocalizzazione verrà interrota" ,
        buttons: [
          {
            text: "Conutinua",
            cssClass:'modal-accept-button',
            handler: async() => {
              this.open=false;
              this.map.remove();
              this.clearwatcher();
             this.back();
             
            
            },
          }, {
            text: this.$t('action.cancel'),
            role:"cancel",
            
          },
          
        ],
      });

      await alert.present();
    },

  


    drawMap() {
      this.map = L.map('map', {
        crs: L.CRS.Simple, zoom:-2,zoomAnimation:false,
        maxZoom: 3,
        minZoom: -2,
        maxBounds:this.bounds,
        maxBoundsViscosity: 1.0
      }).setView([0, 0])
    

      L.imageOverlay(this.url, this.imageBounds).addTo(this.map);
     this.map.fitBounds(this.bounds);
     
      this.map.invalidateSize();
      this.markers = [];
     
      this.items.forEach(async item=>{
       /* const markerX = L.marker(L.latLng(item.latLng), {draggable: false})
          .setIcon(this.getIcon(item.status))
        markerX.itemId = item.id;
        this.markers.push(markerX);*/
        if(item.id!="me"){
          const im= await this.getCoverImg(item.img)
        // console.log("img card ",im)
          const popupcontent=`<div class="img-container"><img src=${im}></div>
              <div class="card-title">${item.description}</div>`
          L.marker(L.latLng(item.latLng)).setIcon(this.getIcon(item.status)).addTo(this.map)
            .bindPopup(popupcontent)
        }else{
          this.meMarker=L.marker(L.latLng(item.latLng)).setIcon(this.getIcon(item.status)).addTo(this.map)
        }
      });

    },


    getIcon(status) { 
      // Inicializa os ícones
      const ColorIcon = L.Icon.extend({
        options: {
            shadowUrl: '',
            iconSize: [36, 36],
            iconAnchor: status!=3?[18,36]:[18,18],
            popupAnchor: [1, -34],
            shadowSize: [20, 20]
        }
      });
      const icons = [];
      icons[1] = new ColorIcon({iconUrl: '/assets/background/pinlocation.png'});
      icons[2] = new ColorIcon({iconUrl: '/assets/background/pinlocation_visto.png'});
      icons[3] = new ColorIcon({iconUrl: '/assets/background/hotspot.gif'});
      return icons[status];
    },
    updateMap() {
      this.map.remove();
     // this.getitems();
      this.drawMap();
    },

    back(){
      console.log("HISTORU : ",window.history )
      //this.$router.replace({path:"/"});
      
      this.$router.go(-1);
    },

    calcolaDistanze(){
      if(this.open==true){
      this.schede.forEach(it=>{
        console.log("calc",this.userCoord, it.coord)
        if( it.coord!=null){
          const distance= this.calculateDistance(this.userCoord, it.coord);
          const range=it.range!=null ? it.range : this.range;
          console.log("distance",it.tag, distance)
          
            if(distance<=range){
              if( !this.visited.includes(it.tag)){
                this.openscheda(it)
              }
            
              //alert("sei vicino al punto");
            }

        
          
        }
        

      })
    }
    },

    showPosition(position) {
      if( this.open==false){
        setTimeout(() => {
      this.open=true
     }, 10000);
      }
     
      this.userCoord.latitude= position.coords.latitude,
      this.userCoord.longitude= position.coords.longitude
      const foundme=this.items.find(e=>e.id=="me")
      const mypoint={id: 'me', description: 'ME', latLng: this.coordtopixelPunti(this.userCoord.latitude,  this.userCoord.longitude), status: 3}
      if(foundme){
       console.log(foundme)
        //foundme=mypoint; 
        this.meMarker.setLatLng(this.coordtopixelPunti(this.userCoord.latitude,  this.userCoord.longitude));
      }else{
        this.items.push(mypoint);
      }
      
      console.log("mie coord ",  this.userCoord )
      this.calcolaDistanze();

     // this.getimagepos();
    //this.coordtoCart()
   // this.coordtopixel()
            
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

   clearwatcher(){
   console.log("chiudo il watcher");
    navigator.geolocation.clearWatch(this.watcher);
   },
openscheda(scheda){
  const tag=scheda.tag
 //this.addtoBucket(tag,'schede_viste')
 this.addtoBucket(tag,'schede_viste_onmap')
   const content=scheda.content.find(x => x.lang == this.lang);
          console.log("scheda.type "+ content.type);
          this.clearwatcher();
          this.open=false;
          if (content.type == "audio") {
            console.log("audio");
            //this.schedaState(true);
            //this.$router.push({ path: "/audio/" + idvid , replace:true});
           
            this.$router.push({ path: "/audio/" + tag,  replace:true });
            

          }else if (content.type == "video"){
            console.log("video");
            //this.schedaState(true);
            this.$router.push({ path: "/video/" + tag, replace:true });
          }else{
              this.$router.push({ path: "/soloImg/" + tag , replace:true});
          }
    
},
    getLocation() {
      if (navigator.geolocation) {
       this.watcher =   navigator.geolocation.watchPosition(this.showPosition, this.showError,{enableHighAccuracy: true,  timeout: 5000, maximumAge: 3000,
});
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
      return  distance.toFixed(2)*1000;
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

    coordtopixelPunti(lat,lon){

      //milano    
     /* const  lat1= 45.71241717967386
      const  lon1= 8.69531166660485

      const  lat2=  45.18079075895875
      const  lon2= 9.640075829782067*/

      //bergamo
     /* const  lat1= 45.71818229288252
      const  lon1= 9.647315629494203

      const  lat2=45.69061654646927
      const  lon2= 9.681764123048756*/

      const  lat1= this.lat1
      const  lon1= this.lon1

      const  lat2=this.lat2
      const  lon2=this.lon2
     
      
      // bergamo
      /* 1 45.71798229288252, 9.647315629494203*/
      /* 2 45.69059123618014, 9.681764123048756*/

      //1 45.71110808387814, 9.652650465465236
     //2 45.6 9805537615133, 9.676256441490102



        const pixel_x = this.mapwidth * (lon - lon1) / (lon2 - lon1)
        const pixel_y = this.mapheight * (lat - lat1) / (lat2 - lat1)

        console.log( "pixel",pixel_x,  pixel_y);
        return [(this.mapheight-pixel_y),(pixel_x )]

      },

    
    async getCoverImg(name) {
      if (name != null) {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('mediaStore', global.dbVersion);
          
          request.onsuccess = event => {
            const db = event.target.result;
            const transaction = db.transaction(['media-' + this.lang], 'readwrite');
            const objectStore = transaction.objectStore('media-' + this.lang);
            const test = objectStore.get(name);
            
            test.onsuccess = event => {
              const testget = event.target.result;
              if (testget) {
                const imgSrc = URL.createObjectURL(testget.blob);
                //console.log("img ", imgSrc);
                db.close();
                resolve(imgSrc);
              } else {
                console.log('testget does not exist');
                db.close();
                resolve(""); // or reject with an error message if needed
              }
            };

            test.onerror = () => {
              console.log('test get error');
              db.close();
              reject('Error getting image');
            };
          };

          request.onerror = () => {
            console.log("Error opening database");
            reject('Error opening database');
          };
        });
      } else {
        console.log("name is null");
        return "";
      }
    },
    addtoBucket(ntag, variabile){
      this.bucket= localStorage.getItem(variabile);
      if(this.bucket==null){
        localStorage.setItem(variabile, ntag);

      }else{
        this.bucket= this.bucket.split(",");
       
        if(!this.bucket.includes(ntag)){
          this.bucket.push(ntag);
          localStorage.setItem(variabile, this.bucket);
        }
       
        console.log("bucket  "+this.bucket)
        
      }
      
    },
    openviste(){
      this.$router.push({ name: 'raccolta', params:{ from:"map"}});
     // this.$router.push({ path: "/raccolta", replace:true});
    },

    unmounted(){
    this.open==false
    console.log("Unmounting map");
   
 
    
  },
 
  }
};



</script>

<style >

ion-content {
  --overflow: hidden;
}
.back-button{
  text-transform: capitalize;
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
  z-index: 1;


}
.blur{
  animation: fadeblur 1s;

}
@keyframes fadeblur{
	from { filter: blur(6px); }
	to { filter: blur(0px);}
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
.logo-container{
    position: fixed;
    bottom: 0;
    height: 10vh;
    width: 100%;
    z-index: 5;
    background: white;
    border-top-right-radius: 15px;
    padding: 20px;
    border-top-left-radius: 15px;
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


.leaflet-popup-content .img-container {
  width: 46vw;
  /*height: 30vh;*/
 
}

.leaflet-popup-content .card-title{
  font-size: 17px;
}

.reload-button{
  width: 60px;
    height: 60px;
    --background: white;
    --border-radius:15px;

    position: absolute;
    bottom: 80px;
    left: 20px;
}






</style>