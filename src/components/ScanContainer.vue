<template>
  <div id="container">
    <strong>{{ name }}</strong>
    SCAN CONTAINER
    <button v-on:click="scan()">SCAN</button>
  </div>
</template>

<script lang="ts">
import {  
  Plugins,  
  CameraSource,  
  CameraResultType
} from "@capacitor/core";
const { Camera } = Plugins;

export default {
  name: 'ExploreContainer',
  props: {
    name: String
  },
methods: {
    async scan()  {
        console.log('sono entrata');
        const image = await Camera.getPhoto({
        quality: 90,            
        allowEditing: true,            
        resultType: CameraResultType.DataUrl,            
        source: CameraSource.Prompt
        });
                console.log(image.path);

        }
    }
}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>