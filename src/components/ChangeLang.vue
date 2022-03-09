<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>{{$t('menu.lang.title')}}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" id="nav-child-content">
    {{ title }}


    <ion-grid>
        <ion-row>
            <!--ion-col class="lang-cont" size="6" v-on:click="switchLang('it')">
            
                <div class="circle-cont"  > <img class="cover circle checked" id="circle-it" src="/assets/background/Flag_It.png" alt=""></div>
                <div class="lang">ITA</div>
        
            </ion-col>
            <ion-col class="lang-cont" size="6"  v-on:click="switchLang('en')">
                
                <div class="circle-cont" > <img class="cover circle"  id="circle-en" src="/assets/background/Flag_UK.png" alt=""></div>
                <div class="lang">ENG</div>
            
            </ion-col>
            <ion-col  class="lang-cont" size="6"  v-on:click="switchLang('fr')">
                
                <div class="circle-cont"  > <img class="cover circle" id="circle-fr"  src="/assets/background/Flag_Fra.png" alt=""></div>
                <div class="lang">FRA</div>
            
            </ion-col>
            <ion-col class="lang-cont" size="6"  v-on:click="switchLang('de')"> 
                
                <div class="circle-cont"  > <img  class="cover circle" id="circle-de"  src="/assets/background/Flag_Ger.png" alt=""></div>
                <div class="lang">TED</div>
                
            </ion-col-->
            <template v-for="lang in saved" v-bind:key="lang">
              <ion-col class="lang-cont" size="6" v-on:click="switchLang(lang)">
              
                  <div class="circle-cont"  > <img class="cover circle checked" id="circle-it" :src="'/assets/background/Flag_'+lang+'.png'" alt=""></div>
                  <div class="lang">{{lang}}</div>
          
              </ion-col>
            </template>
        </ion-row>
    </ion-grid>


    <ion-button expand="block" size="slim" color="primary">  {{$t('menu.lang.add')}} </ion-button>

    <div>
     
      <div v-for="remainingLang in remaining" v-bind:key="remainingLang" @click="add(remainingLang)">
        {{remainingLang}}
      </div>


    </div>
     
  </ion-content>
</template>

<script lang="ts">
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  alertController,
  } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: "langSwitch",
  props: {
    title: { type: String, default: 'Default Title' }
  },
  components: {
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  },
  data(){
    return{
      availableLangs:['it','en','fr','de'],
      saved:[],
      remaining:[],
    }
  },
  setup(){
    
    return{
      
    }
  },
  computed:{

    savedLangs:{
        get() {
          console.log("linguee ", localStorage.getItem('savedLangs'))
          let savedLangs= [];
          savedLangs=  localStorage.getItem('savedLangs').split(",");
          this.assignSaved(savedLangs)
          console.log("linguee savedLangs ", savedLangs)
          return savedLangs
        },
      // setter
      set(newLang) {
        // Note: we are using destructuring assignment syntax here.
        this.saved.push(newLang);
        localStorage.setItem('savedLangs', this.saved)
      }

    },

    remainingLang(){
      const myArray = this.availableLangs.filter( ( el ) =>{
        console.log("?? "+!this.savedLangs.includes( el ));
        return !this.savedLangs.includes( el );
      
      });
      this.assignRemaining(myArray);
    return myArray;

    }

    
  },
  mounted(){
    this.savedLangs
    this.remainingLang
  },

  methods:{

    async showOptions(lang) {
      const alert = await alertController.create({
      header: this.$t('menu.lang.add') ,
      message:  this.$t('menu.lang.alert') ,
      buttons: [
        {
          text: this.$t('action.accept'),
          handler: () => {
            console.log("Accepted");
           //  this.emitter.emit('aggiorna');
           this.searchMedia(lang);
            this.savedLangs=lang;
            this.remaining=this.remaining.filter(item => item !== lang);
           
          },
        },
        {
          text: this.$t('action.cancel') ,
          role: "cancel",
          handler: () => {
            console.log("Declined the offer");
            
          },
        },
      ],
    });

    await alert.present();
    },

    switchLang(lang){
        if (this.$i18n.locale !== lang) {
           this.$i18n.locale = lang;
        }
    },
    add(lang){

      this.showOptions(lang)
    /*  this.savedLangs=lang;
      this.remaining=this.remaining.filter(item => item !== lang);*/
    },
    assignSaved(savedLangs){
      this.saved=savedLangs;
    },
    assignRemaining(remainingLangs){
      this.remaining=remainingLangs;
    },
    searchMedia(lang){
      const schede=localStorage.getItem('dataMostra');
      const jsonSchede=JSON.parse(schede);
      let contenuto;
      console.log("->>", JSON.parse(schede));
      jsonSchede.forEach(scheda => {
        contenuto=scheda.content.find(el=> el.lang==lang )
        console.log("Cont ", contenuto);
        if(contenuto.audio!=null){
           /*this.mediaCounter();
          this.getmedia(contenuto.audio);*/
           console.log("Getaudio ")
        }else if(contenuto.video!=null){
        /*  this.mediaCounter();
          this.getmedia(contenuto.video);*/
          console.log("Getvideo ")
        }else{
           console.log("Non ci sono Media per la scheda ")
        }

      });
    },
  }
})
</script>