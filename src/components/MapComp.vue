<template>
  <div id="map" ref="map" style="height: 100vh;"></div>
</template>

<script lang="ts">


import { onMounted, ref } from 'vue';
import L from 'leaflet';
//import { defineComponent } from 'vue';
export default ({
  setup() {
    const map = ref(null);
    
    onMounted(() => {
      // Definisci le dimensioni della tua immagine (in pixel)
      const imageWidth = 1024;
      const imageHeight = 768;

      // Crea la mappa e disabilita le interazioni non necessarie
      map.value = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -5,
        maxZoom: 5,
        zoomControl: true
      }).setView([0, 0], 0);

      // Calcola le dimensioni dell'immagine in coordinate di Leaflet
      const southWest = map.value.unproject([0, imageHeight], map.value.getMaxZoom());
      const northEast = map.value.unproject([imageWidth, 0], map.value.getMaxZoom());
      const bounds = new L.LatLngBounds(southWest, northEast);

      // Aggiungi l'immagine alla mappa
      L.imageOverlay('path/to/your/image.jpg', bounds).addTo(map.value);

      // Limita la visualizzazione ai confini dell'immagine
      map.value.setMaxBounds(bounds);
      map.value.fitBounds(bounds);

      // Aggiungi un marker come esempio
      const marker = L.marker(map.value.unproject([512, 384], map.value.getMaxZoom())).addTo(map.value);
      marker.bindPopup('Questo è un marker').openPopup();
    });

    return {
      map
    };
  }
})
</script>

