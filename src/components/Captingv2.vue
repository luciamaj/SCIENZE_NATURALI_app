<template>

   
      
      <div class="back"> 
        <div class="capting-icon-container"> <img src="/assets/background/capting.gif" >
           <div class="indicazioni">{{ info[id] }}</div>
        </div>
        <!--div class="indicazioni">{{$t('main.capting[0]')  }}</div-->
      </div>
    

</template>

<script>
import {
 
  IonContent,
  modalController,
 
} from "@ionic/vue";
import { QrStream } from "vue3-qr-reader";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export default defineComponent({
  name: "Scanner",
  components: {
   
 
  },
 
  computed:{
    info() {
      const infolang= this.$i18n.messages[this.$i18n.locale].capting; 
         console.log("cosa c'èèèè ? " ,infolang)
      return infolang; // Accessing the localized array
    }
  },
 
mounted(){
  

 this.emitter.on('startCapting', _ => {
     this.startAnimation();
 });

 this.emitter.on('stopCapting', _ => {
     this.stopAnimation();
 });

},
  
  methods: {

    startAnimation(){
      this.settimer();
    },
    stopAnimation(){
      clearTimeout(this.timer);

      this.id=0;
    },

    changeindex(){
      if(this.id<2){
        this.id+=1;
      }else{
        this.id=0
      }
      this.settimer();
      
    },

    settimer(){
      this.timer= setTimeout(() => {
     //   console.log("HOCAMBIATOOOOOOOOOOOOOOOOOOOOOO TOMEOUT")
        this.changeindex();
      }, 2300);

    }
    
    /*async close() {
      const top = await modalController.getTop();
   
      top.dismiss();
    },*/

  },

  data: () => {
    return {
      value: "",
      title: "Scansiona",
      id:0
    };
  }
});
</script>

<style scoped>
ion-content {
  --overflow: hidden;
}

.back{
  
}

.indicazioni{
  text-align: center;
    color: var(--ion-color-secondary);
    font-size: 1.2em;
    font-weight: 600;
    transition: opacity 1s;;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}



</style>