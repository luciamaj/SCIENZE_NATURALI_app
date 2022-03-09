<template>
  <ion-page>
    <div  class="onboard-main">
      <ion-fab vertical="bottom" horizontal="end" >
        <ion-fab-button color="primary" v-on:click="next()"  class="next" :class="{invisible:last}">
          <ion-icon name="chevron-forward"></ion-icon>
          </ion-fab-button>
      </ion-fab>
    
      <div class="onboard-top">
        <ion-toolbar>
          <ion-buttons >
            <ion-button color="primary" v-on:click="goBack()" class="goback" :class="{invisible:isFirst}">
                <ion-icon name="chevron-back" ></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
              <ion-button color="dark" v-on:click="skip()">
              skip
              </ion-button>
          </ion-buttons>
        </ion-toolbar>

      </div>

      <div class="onboard-bot">
               
        <div class="swiper-container"  @slideChange="onSlideChange" > 
          <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="onb-card">
              <ion-grid>
                <ion-row>
                    <ion-col class="lang-cont" size="6" v-on:click="checkChecked('it')">
                    
                        <div class="circle-cont"  > <img class="cover circle checked" id="circle-it" src="/assets/background/Flag_It.png" alt=""></div>
                        <div class="lang">ITA</div>
                
                    </ion-col>
                    <ion-col class="lang-cont" size="6"  v-on:click="checkChecked('en')">
                      
                        <div class="circle-cont" > <img class="cover circle"  id="circle-en" src="/assets/background/Flag_UK.png" alt=""></div>
                        <div class="lang">ENG</div>
                    
                    </ion-col>
                    <ion-col  class="lang-cont" size="6"  v-on:click="checkChecked('fr')">
                      
                        <div class="circle-cont"  > <img class="cover circle" id="circle-fr"  src="/assets/background/Flag_Fra.png" alt=""></div>
                        <div class="lang">FRA</div>
                    
                    </ion-col>
                    <ion-col class="lang-cont" size="6"  v-on:click="checkChecked('de')"> 
                        
                        <div class="circle-cont"  > <img  class="cover circle" id="circle-de"  src="/assets/background/Flag_Ger.png" alt=""></div>
                        <div class="lang">TED</div>
                      
                    </ion-col>
                  </ion-row>
              </ion-grid>
                
            </div>
          </div>
            <div class="swiper-slide">
              <div class="onb-card">
                  <div class="onb-img">
                      <img class="cover" src="/assets/background/dos.png" alt="">
                  </div>
                  <div class="onb-desc ion-text-center">
                      <h4>titolo in H4 slide 2</h4>
                      <p class="ion-no-margin">  Utilizza l'app per accedere a contenuti di approfondimento</p>
                        <p class="ion-no-margin">  Avvicina lo smartphone ai Silence Tag </p>

                  </div>
              </div>
           </div>
          <div class="swiper-slide">
              <div class="onb-card">
                  <div class="onb-img">
                      <img class="cover" src="/assets/background/qr.png" alt="">
                  </div>
                  <div class="onb-desc ion-text-center">
                      <h4>titolo in H4 slide 3</h4>
                      <p class="ion-no-margin">  Utilizza l'app per accedere a contenuti di approfondimento</p>
                        <p class="ion-no-margin">  Scansiona i QR Code che troverai lungo il percorso </p>

                  </div>
              </div>
          </div>
         <div class="swiper-slide">
              <div class="onb-card">
                  
                  <div class="onb-desc ion-text-center">
                      <h4>Scarico i contenuti</h4>
                      <p class="ion-no-margin">A breve l'applicazione sarà pronta all'uso</p>
                      <ion-progress-bar :value="progress" :buffer="1" color="secondary"></ion-progress-bar>

                  </div>
              </div>
          </div>>
           </div>
          <div class="swiper-pagination"></div>

        </div>

      </div>
    </div>
  </ion-page>
</template>



<script>



import {
  IonPage,
  IonToolbar,
 // IonTitle,
 // IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonFab,
  IonFabButton

} from "@ionic/vue";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper } from "swiper";
Swiper.use([Navigation, Pagination, Scrollbar, A11y ]);


import "swiper/swiper.scss";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'
import"swiper/components/pagination/pagination.scss"
import { IonProgressBar } from '@ionic/vue'

//import { data } from "../data/data";

//import { Plugins } from "@capacitor/core";
//import { useRouter } from "vue-router";

//const { Storage } = Plugins;

export default {
  name: "Tab",
  data() {
    return {
      
      name: "onboard",
      store:"",
      currLang:"it",
      currSlide:0,
      isFirst:true,
      last:false,
      progress:0,
      media:0,
      mediafetched:0,

      swiperOption:{
        slidesPerView: 1,
        spaceBetween: 100,
        observer:true,
        navigation:{ nextEl: '.next',  prevEl: '.prev' } ,
        pagination:{ clickable: true ,  el: '.swiper-pagination', type: 'bullets'} 
      }
    };
  },

  setup() {
   
    const onSwiper = (swiper) => {
      console.log("swiper",swiper);
    };
  
    const onSlideChange = (swiper) => {
      console.log("activeidx "+ swiper.activeIndex);
      
      console.log('slide change');
    };
    
  
    return {
      onSwiper,
      onSlideChange,
    

      modules: [Navigation, Pagination, Scrollbar, A11y],
    };
  },
  mounted(){
    this.swiper  =new Swiper('.swiper-container', {slidesPerView: 1,
        spaceBetween: 100,
        observer:true,
        navigation:{ nextEl: '.next',  prevEl: '.prev' } ,
        pagination:{ clickable: true ,  el: '.swiper-pagination', type: 'bullets'} });
  },
 
  components: {
    
    IonToolbar,
    IonIcon,
   // IonTitle,
   // IonContent,
    IonPage,
    IonButton,
    IonButtons,
    IonFab,
    IonFabButton,
    IonProgressBar
  },


  methods:{
    checkChecked(lang){
      if(this.currLang!=""){
        const checked= document.getElementById('circle-'+this.currLang);
        checked.classList.remove("checked");

      }
       this.setLang(lang);
    },
    setLang(lang){
      this.currLang=lang;
      console.log("click lang" + lang);
      const checked= document.getElementById('circle-'+lang);
      checked.classList.add("checked");
      localStorage.setItem('lang', lang);
      localStorage.setItem('savedLangs', lang);
      
    },

    next(){
      console.log("swippppppppeer", this.swiper);
       //swiper = document.querySelector(".swiper-container");

     // swiper.slideNext();
      this.slidechanged( this.swiper);
      
    },
    slidechanged(swiper){
      this.currSlide= swiper.activeIndex;
      this.checkProgress();

       if(this.currSlide==3){
        this.searchMedia();
      }
    },
    goBack(){
     
       this.swiper.slidePrev();
      this.slidechanged(this.swiper);
     
    
    },
    checkProgress(){
      if(this.currSlide>0){
        this.isFirst=false;
        console.log("isfirst "+ this.isFirst);
        if(this.currSlide==3){
          this.last=true;
        }else{
          this.last=false;
        }
      }else{
        this.isFirst=true;
         console.log("isfirst "+ this.isFirst);
         
      }
    },

    searchMedia(){
      const schede=localStorage.getItem('dataMostra');
      const jsonSchede=JSON.parse(schede);
      let contenuto="";
      console.log("->>", JSON.parse(schede));
      jsonSchede.forEach(scheda => {
        if(scheda.img!=null){
          this.mediaCounter();
          this.getmedia(scheda.img)
        }else{
          console.log("Non ci sono immagini per la scheda ")
        }
        contenuto=scheda.content.find(el=> el.lang==this.currLang )
        console.log("Cont ", contenuto);
        if(contenuto.audio!=null){
           this.mediaCounter();
          this.getmedia(contenuto.audio);
           console.log("Getaudio ")
        }else if(contenuto.video!=null){
           this.mediaCounter();
          this.getmedia(contenuto.video);
          console.log("Getvideo ")
        }else{
           console.log("Non ci sono Media per la scheda ")
        }

      });
    },
    getmedia(name){
     console.log("nuemro di media "+ this.media );

      //fetch("https://dataoversound.eadev.it/dataoversound-swi/inventario/download.php?id="+name+"&link=1")
     fetch("https://dataoversound.eadev.it/dataoversound-swi/upload/"+name)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`)
        }
        
        console.log("OK Resp", response);
        if(response.status==200){
         
          this.mediafetched++
        }
        this.progress=this.mediafetched/this.media;
        console.log("progress ",  this.progress);
        if(this.progress==1){
           this.$router.push({ name: "wave" });
        }
        return response
      })
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => console.log( url))
      .catch(err => console.error(err));
   

    },

    mediaCounter(){
      this.media++;
    }
    
  }
   
}




</script>

<style scoped>

ion-content {
  --overflow: hidden;
}

.body{
     background:  white;
}
.goback{
  visibility: visible;
}
.next{
 visibility: visible;
}
.invisible{
  visibility:hidden
}
.row{
  width: 100%;
  display: flex;
  margin-bottom: 40px;
}
.onboard-main{
    padding: 5%;
    height: 100%;
     background:  white;

}
ion-fab{
  bottom: 35px;
  right: 28px;
}
.onboard-top{
  margin-top: 5%;
 
}

.onboard-bot{
     margin-bottom: 5%;
  height: 80%;
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
}
.swiper-container{
  width: 85vw;
  height: 61vh;
}
.swiper-slide{
  width: 100%;
}
.lang-cont {
  margin-bottom: 20px;
}

.lang{
 text-align: center;
 
}
.circle-cont{
  height:100px;
  width: 100px;
  margin: 0 auto 10px;
}
.circle{
  
  height:100%;
  border-radius: 50%;
  border: solid 1px rgb(194, 194, 194);
  opacity: 0.8;

}
.circle> img{
  height: 100%;
}
.cover{
  object-fit: cover;
}
.checked{
   border: solid 5px rgb(11, 124, 11);
     opacity: 1;
}
.swiper-pagination {
  color: red;
}

.vertical-center {
  display: flex;
  justify-content: center;
  height: 100%;
}

.center {
  display: block;
  position: absolute;
  bottom: 0;
  padding-bottom: 15vh;
}

.logo-container {
  background-color: #fff;
}

.logo {
  object-fit: contain;
  max-height: 30vh;
  margin-bottom: 50px;
  object-position: center;
  width: 100%;
}

.onb-img{
  height: 300px;
  text-align: center;
}
.onb-img > img{
  height: 100%;
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


.toolbar-background {
  color: white !important;
}

@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>