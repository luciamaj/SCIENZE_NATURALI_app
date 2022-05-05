<template>
  <ion-page>
    <ion-header>
      
    </ion-header>
  
    <ion-content :fullscreen="true">
      <div class="vertical-center ">
        <div class="center-content">
          <div class="logo-container"><img class="logo" :src="logo"/></div>
      
        <div class="buttons">
        
          <ion-button color="secondary" class="test-btn" id="test" @click="openApp(tag)" >{{$t('action.app')}}</ion-button>
        </div>
        <div class="powered" @click="openWebSite">Powered by Engineering Associates</div>
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



export default {
  name: "open-app",
  props:{tag:{type: String, default: '0' }},
  data() {
    return {
    };
  },
  created(){
    this.openApp=common.openApp;
   

  },
 
  components: {
   IonContent,
    IonPage,
    IonButton,    
    //IonModal
  
  },
  computed:{
   
  },

  
  mounted(){
    const mostra=JSON.parse(localStorage.getItem('pubblication'));
    
    if (mostra) {
        this.logo= this.$store.getters.baseUrl+"/upload/"+mostra.img;
    } else {
      this.logo= '/assets/background/dos.png'
      
    }
    
    this.openApp(this.tag)
         
  },


  methods: {
 
   
  
   
      
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