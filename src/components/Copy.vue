<template>
 <ion-header>
    <ion-toolbar>
       <ion-title color="secondary">{{$t("menu."+page)}}</ion-title>
      <ion-buttons slot="start" >
        <ion-back-button></ion-back-button>
      </ion-buttons>
     
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" id="nav-child-content">
      <div class="ex-page-container" v-html="htmlString"></div>
  </ion-content>
</template>

<script lang="ts">
//import { IonNav } from '@ionic/vue';
import NavRoot from '@/components/NavRoot.vue';
export default ({
   props: {
        page: { type: String, default: 'copyright' },
    },
   
    //components: { IonNav },
    setup() {
        return { NavRoot  }
    },
    data(){
        return{
            input:'<p style="font-size:3em">loading</p>'
        }

    },
    computed: {
       htmlString() {
          return this.input;
        }
    },

    created(){
       this.loadFile()
       
    },
    methods: {
      loadFile(){
        fetch(this.$store.getters.baseUrl+"/plugin/silencetag/"+this.page+".html")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }
          return response.text()
        })
        .then(html => {
          this.input=html
        
        })
      
        .catch(error => console.log(error))

      }
    }

    
    

});
</script>

<style scoped>

.ex-page-container{
 width: 80vw;
 margin: auto;
 font-size: 0.35em;
 height: 95%;
 overflow: scroll;

}
.ex-page-container>h2{
  font-size: 22px;

}

</style>