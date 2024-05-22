<template>
    <div id="app">
      <MapComponent />
    </div>
  </template>
  
  <script>
  import MapComponent from '../components/MapComp.vue';
  
  export default {
    name: 'App',
    components: {
      MapComponent
    }
  };
  </script>
  
  <style>
  #app {
    height: 100vh;
    margin: 0;
  }
  </style>
  