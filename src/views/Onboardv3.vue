<template>
  <ion-page>
    <ion-content>
    <div  class="onboard-main">
      <ion-fab class="button-next" vertical="bottom" horizontal="end" >
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
          <ion-buttons slot="end" v-if="context=='help'">
              <ion-button color="dark" v-on:click="skip()">
              {{$t('action.salta')}}
              </ion-button>
          </ion-buttons>
        </ion-toolbar>

      </div>

      <div class="onboard-bot">
        <ion-slides pager="true" :options="slideOpts"  @ionSlideDidChange="slidechanged" ref="slider">
          <ion-slide v-if="context=='onboard'">
            <div class="slide-inner">
              <h5 class="lang-title"> {{$t('onboard.lang.title')}} </h5>
              <div class="text-one"> {{$t('onboard.lang.text')}} </div>
              <ion-grid>
                  <ion-row class="row">
                  <ion-col v-for="lang in publishedLang" class="lang-cont" size="6" v-on:click="setLang(lang)" :key="lang">
                      
                          <div class="circle-cont"  > <img class="cover circle" id="circle-it" :class="checkLang(lang)" :src="'/assets/background/Flag_'+lang+'.png'" alt=""></div>
                          <div class="lang">{{$t('menu.lang.'+lang)}}</div>
                  
                      </ion-col>
                      
                  </ion-row>
              </ion-grid>
            </div>

          </ion-slide>
          <!--ion-slide v-if="interactionMode=='mix'">
              <div class="slide-inner">
                  <div class="onb-img">
                      <img class="cover" src="/assets/background/dos2.png" alt="">
                  </div>
                  <div class="onb-desc ion-text-center">
                      <h4> {{$t('onboard.tag.title')}}</h4>
                      <p class="ion-no-margin desc-text"> {{$t('onboard.tag.text')}}</p>
                        <p class="ion-no-margin">  </p>

                  </div>
              </div>
          </ion-slide>
          <ion-slide>
            <div class="slide-inner">
              <div class="onb-img">
                  <img class="cover" src="/assets/background/qr2.png" alt="">
              </div>
              <div class="onb-desc ion-text-center">
                  <h4><h4 v-if="interactionMode=='mix'">{{$t('onboard.qr.alternative')}}</h4>{{$t('onboard.qr.title')}}</h4>
                  <p class="ion-no-margin">  Utilizza l'app per accedere a contenuti di approfondimento</p>
                  <p class="ion-no-margin desc-text" > {{$t('onboard.qr.text')}}  </p>

              </div>
            </div>
          </ion-slide-->
          <ion-slide v-for="sli in contentsonb" :key="sli">
            <div class="slide-inner">
              <div class="onb-img">
                  <img class="cover" :src="sli.img" alt="">
              </div>
              <template v-for="info in sli.info " :key="info">
                <div v-if="info.lang==currLang" class="onb-desc ion-text-center">
                  <h4> {{info.title}}</h4>
                  <p class="ion-no-margin desc-text" > {{info.txt}}  </p>
                  <p class="ion-no-margin">  </p>

                </div>
                <template v-else>
                  <div v-if="info.lang==en" class="onb-desc ion-text-center">
                    <h4> {{info.title}}</h4>
                    <p class="ion-no-margin desc-text" > {{info.txt}}  </p>
                    <p class="ion-no-margin">  </p>

                  </div>
              </template>

              </template>
             
            </div>
          </ion-slide>
        </ion-slides>

      </div>
    </div>
    </ion-content>
  </ion-page>
</template>



<script>

import {contents} from "../data/contentOnb";

import {
  IonPage,
  IonToolbar,
 // IonTitle,
  modalController,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSlides, IonSlide 

} from "@ionic/vue";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';




import "swiper/swiper.scss";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'swiper/modules/navigation/navigation.min.css'
import 'swiper/modules/pagination/pagination.min.css'
import"swiper/modules/pagination/pagination.scss"



export default {
  props: {
      context: { type: String, default: 'onboard' },
  },
  name: "Tab",
  data() {
    return {
      publishedLang:[],
      name: "onboard",
      store:"",
      currLang:"it",
      currSlide:0,
      isFirst:true,
      last:false,
      progress:0,
      media:0,
      mediafetched:0,
      help:false
    
    };
  },

  setup() {
  
    const slideOpts = {
      initialSlide: 0,
      speed: 400,
      
    };

    return {
      slideOpts,
      //onSlideChange,
  
      modules: [Navigation, Pagination, Scrollbar, A11y],
    };
  },
  computed:{
    interactionMode(){
      console.log("interactionMode "+this.conf.interactionMode );
      return this.conf.interactionMode;
    },

    contentsonb(){
      return contents;
    }
  },
  mounted(){
 
    console.log('? '+ contents[0].name);
    this.currLang=this.$i18n.locale;
    
    this.getinfo((info) => {
      this.publishedLang=info.lang.map(element => {
        return element.toLowerCase();
      });
      console.log("LANG PUBB ", this.publishedLang.length)
      if(this.publishedLang.find( element => element ==this.currLang)){
         this.setLang(this.currLang);
      }else{
         this.setLang(this.publishedLang[0]);
      }
    })
   
    this.slidelength();

      
  },
 
  components: {
    
    IonToolbar,
    IonIcon,
    IonContent,
    IonPage,
    IonButton,
    IonButtons,
    IonFab,
    IonFabButton,
    IonSlides, IonSlide 
   
  },


  methods:{


    async skip() {
      this.pushPage();
    },

    pushPage() {
        const ionNav = document.querySelector('ion-nav') ;
            ionNav.pop();    
       
    },

  
    checkLang(lang){
      if(lang==this.currLang){
        return "checked"
      }
    },

    getinfo(callback){
      //if (store.getters.baseUrl) {

       fetch(this.$store.getters.baseUrl+"/service/rest/v1/mostra-attiva")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${reponse.status}`)
        }
        return response.json()
      })
      .then(data => {
        callback(data.result[0]);
      })
      .catch(error => console.log(error))

    },

    setLang(lang){
      this.currLang=lang;
      console.log("click lang" + lang);
      localStorage.setItem('lang', lang);
      //if(localStorage.getItem('savedLangs')==null){
        localStorage.setItem('savedLangs', lang);
    // }
      
      
    },

    next(){
      console.log("nexxxt");
    
      this.$refs.slider.$el.slideNext(500);

      this.slidechanged();
      console.log(this.slideLength);
      if(this.currSlide==this.slideLength-1){
        if(this.context=="onboard"){
          this.$router.replace({ name: 'scarica', params:{ lang:this.currLang, fromC:"onboard"}});

        }else{
          this.skip();
        }
        
     
     }
  
    },
    async slidelength(){
      this.slideLength= await this.$refs.slider.$el.length();
      console.log("N slides "+   this.slideLength)
    },
    
    async slidechanged() {
      this.currSlide= await this.$refs.slider.$el.getActiveIndex();
      console.log('@index',  this.currSlide);
      this.checkProgress();    
      
    },
 
    goBack(){
      
      this.$refs.slider.$el.slidePrev(500);
      this.slidechanged();
      
    
    },
    checkProgress(){
      if(this.currSlide>0){
        this.isFirst=false;
        console.log("isfirst "+ this.isFirst);
        if(this.currSlide== this.slideLength){
          this.last=true;
        }else{
          this.last=false;
        }
      }else{
        this.isFirst=true;
          console.log("isfirst "+ this.isFirst);
          
      }
    },

    
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
ion-grid{
  width: 100%;
}
.row{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.onboard-main{
    padding: 5%;
    height: 100%;
     background:  white;

}
.button-next{
  position: absolute;
  z-index: 10;
   bottom: 35px;
  right: 28px;
}

.onboard-top{
  margin-top: 3%;
 
}

.onboard-bot{
  margin-bottom: 5%;
  height: 100%;
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
}
.swiper{
  margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
    list-style: none;
    padding: 0;
    z-index: 1;
}
.swiper-container{
  width: 85vw;
  height: 90vh;
}
.swiper-slide{
  width: 100%;
}
.slide-inner{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  text-align: center;
}

.lang-cont {
  margin-bottom: 20px;
}
.text-one{
    margin-bottom: 13vh;
    margin-top: 6vh;
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
   border: solid 5px var(--ion-color-secondary-whitened);
     opacity: 1;
}
.swiper-pagination {
  color: red;
}
.swiper-pagination-bullets{
  bottom: 40px!important;
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
  padding-bottom: 5vh;
}
.lang-title{
  position: relative;
  top: 3%;

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
  height: 230px;
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

.onb-desc{
  margin-top: 4vh;
  padding: 10px;
  top: 2%;
}
.desc-text{
  margin-top: 5vh;

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