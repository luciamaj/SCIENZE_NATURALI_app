<template>
  <div id="map" ref="map" style="height: 100vh;"></div>
</template>

<script>

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

//import { defineComponent } from 'vue';
export default ({
  name: 'MapComponent',
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Aggiungere un'immagine PNG come overlay
      const imageUrl = '/assets/background/map/mappa.png';
      const imageBounds = [[51.49, -0.08], [51.5, -0.06]];
      L.imageOverlay(imageUrl, imageBounds).addTo(map);
    }
  }
})
</script>
<style scoped>
#map {
  height: 100%;
}
</style>

