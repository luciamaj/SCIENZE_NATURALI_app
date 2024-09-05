<template>
  <ion-header>
    <ion-toolbar>
       <ion-title color="secondary">{{$t('menu.accessibility.subtitile')}}</ion-title>
       <ion-buttons slot="start" >
        <ion-button  @click="back"><ion-icon size="large" name="chevron-back" /></ion-button>
      </ion-buttons>
     
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" id="nav-child-content">
    <!--div>{{$t('menu.lang.subtitile')}}</div-->
    <div v-if="supportoVisivo==1" class="container-supporto-visuale">
     <div> Supporto Visuale</div> <ion-toggle  v-model="attivaSupporto"  @ionChange="notice()" :enable-on-off-labels="true"></ion-toggle>
     
    </div>

    <!--ion-grid class="langs-grid">
      <template v-for="lang in saved" v-bind:key="lang">
        <ion-row>
          <div :class="checkIfActive(lang)" class="lang-cont" v-on:click="switchLang(lang)"> 
            <ion-col class="lang-cont-flag" size="6"  :value="lang"   >
              
                <div class="circle-cont"  > <img class="cover circle" id="circle-it" :src="'/assets/background/Flag_'+lang+'.png'" alt=""></div>
        
            </ion-col>
            <ion-col class="lang-cont-name">
               <div class="lang" >{{$t('menu.lang.'+lang)}}</div>

            </ion-col> 
            </div>         
        </ion-row>
      </template>
    </ion-grid-->


    
     
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
.container-supporto-visuale{
  display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .8em 1.2em;
    border-bottom: solid 0.5px #dcdcdc;
    top: 2em;
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
 .lang-cont{
   display: flex;
    margin: 0.2em 1em;
    border-bottom: solid 1px #d5d5d5;
    width: 100%;
    padding: 0.4em 1em;
    
 }
  .lang-cont-flag{
   
       margin-right: 1em;
 }
 .lang-cont-name{
   
    display: flex;
    align-items: center;
    font-size: 20px;
 }
 .add-lang{
  position: absolute;
    bottom: 5vh;
    width: 91vw;
 }
 .modal-accept-button{
  color: var(--ion-color-primary);
}




</style>