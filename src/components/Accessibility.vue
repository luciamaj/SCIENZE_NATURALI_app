<template>
  <ion-header>
    <ion-toolbar>
       <ion-title color="secondary">{{$t('menu.accessibility.title')}}</ion-title>
       <ion-buttons slot="start" >
        <ion-button  @click="back"><ion-icon size="large" name="chevron-back" /></ion-button>
      </ion-buttons>
     
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" id="nav-child-content">
    <!--div>{{$t('menu.lang.subtitle')}}</div-->
    <div class="container-text-access">{{$t('menu.accessibility.subtitle')}} </div>
    <div class="container-supporto-visuale">
     <div> {{$t('menu.accessibility.supportoVisuale')}}</div> <ion-toggle  v-model="attivaSupporto"  @ionChange="notice()" :enable-on-off-labels="true"></ion-toggle>
     
    </div>

     
  </ion-content>
</template>

<script lang="ts">
import router from '@/router';
import {
  IonButtons,
  
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonToggle
  
  } from '@ionic/vue';
  
import common from  "../js/common"
 import Download from '@/components/ScaricamentoContenuti.vue';

//import { defineComponent } from 'vue';
export default ({
  name: "langSwitch",
  props: {
    title: { type: String, default: 'Default Title' }
  },
  components: {
    IonButtons,
   
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonToggle
    
  },
  data(){
    return{
     currPerc:null,
      currLang:this.currentLang,
      attivaSupporto:0

    }
  },
  setup(){
   
    return{
      
    }
  },
  computed:{

    supportoVisivo(){
      const pubblication=JSON.parse(localStorage.getItem('pubblication'));
      if(pubblication.hasOwnProperty("supporto_video")){
        return pubblication.supporto_video

      }else{
        return null
      }
      

    },
    getAttivaSuppoto(){
      const supporto=JSON.parse(localStorage.getItem('attivaSupporto'));
      if(supporto){
        if(supporto==true){
          return true
        }else{
          return false
        }

      }else{
        return false
      }
    },

    
    

  
    
  },
 
  mounted(){
  
   this.attivaSupporto=this.getAttivaSuppoto;
  
  
    
  },

  methods:{

    notice(){
      console.log("fire notice")
      localStorage.setItem('attivaSupporto', this.attivaSupporto)
    },

  
    back(){
      const ionNav = document.querySelector('ion-nav') ;
            ionNav.pop();    
    },
   

  }
})
</script>

<style scoped>

.langs-grid{
  margin-top: 3vh;

}
.container-text-access{
  padding: 14px;
    margin: 2vh 0;

}
.container-supporto-visuale{
  display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .8em 1.2em;
    border-bottom: solid 1px #d5d5d5;
    position: relative;
    margin: 0.5em 1em;
  }

ion-toggle{
  --background-checked:rgb(91, 136, 91);
  --handle-background-checked: white;
  
  height: 24px;
  width: 2.5em;
  --handle-spacing: 2px;
}

 .checked{
    /*background: #377999b8;*/
    background: var(--ion-color-secondary-whitened);
    color: white;
    border-radius: 8px;
 }

 .circle-cont{

   width: 13vw;
   height: 13vw;
 }
 .circle-cont>img{
       max-width: 100%;
    border: 0;
    object-fit: cover;
    height: 100%;
    width: 100%;
    border-radius: 50%;
 }

  
 





</style>