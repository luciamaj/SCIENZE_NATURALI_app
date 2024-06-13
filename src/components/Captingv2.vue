<template>

   
      
      <div class="back"> 
        <div class="capting-icon-container"> <img src="/assets/background/capting.gif" >
           <div class="indicazioni">{{ info[index] }}</div>
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
  props: ["modal"],
  computed:{
    info() {
      return this.$t('main.capting'); // Accessing the localized array
    }
  },
 
mounted(){
  
 this.timer= setTimeout(() => {
  this.changeindex();
    }, 1500);

},
  
  methods: {

    changeindex(){
      if(this.index<2){
        this.index+=1;
      }else{
        this.index=0
      }
      
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
      index:0
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

}



</style>