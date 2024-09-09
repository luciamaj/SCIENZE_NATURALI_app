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
        <ion-slides :key="sliderKey" pager="true" :options="slideOpts"  @ionSlideDidChange="slidechanged" ref="slider">
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
          <ion-slide   v-if="(context=='onboard' && accessibility==1  )" >
            <div class="slide-inner">
              <h5 class="lang-title"> {{$t('onboard.accessibility.title')}} </h5>
              <div class="text-one"> {{$t('onboard.accessibility.text')}} </div>
              <ion-grid>
                  <ion-row class="row inline-row" >
                    <ion-col  class="access-cont" size="8" >  <div> {{$t('menu.accessibility.supportoVisuale')}} </div></ion-col>
                    <ion-col  size="4"  >
                      <ion-toggle  v-model="attivaSupporto"  @ionChange="notice()" :enable-on-off-labels="true"></ion-toggle>
     
                    </ion-col>
                      
                  </ion-row>
              </ion-grid>
            </div>

          </ion-slide>
         
         
          <ion-slide v-if="(context=='onboard'&& confPerc && nPercMostra!=null && nPercMostra>1)" >
            <div class="slide-inner">
              <h5 class="lang-title"> {{$t('onboard.percorsi.title')}} </h5>
              <div class="text-one"> {{$t('onboard.percorsi.text')}} </div>
              <ion-grid>
                  <ion-row v-for="(perc,index) in percorsiMostra" class="row inline-row" :key="(perc,index)" v-on:click="setPercorso(perc.percorso)" >
                    <ion-col  class="percorsi-cont" size="3" > <div class="circle-cont-perc "  > <img class="cover circle" :class="checkPerc(perc.percorso)" id="circle-it" :src="imgPercorsi(perc)" alt=""></div></ion-col>
                    <ion-col  size="8"  >
                      
                      <div  class="percorso">{{nomeLingua(perc)}}</div>
                  
                    </ion-col>
                      
                  </ion-row>
              </ion-grid>
            </div>

          </ion-slide>
          <!--Aggiungere slide per scelta percosri però controllare se abilitati-->
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
           <ion-slide v-if="(context!='onboard' && accessibility==1)" >
            <div class="slide-inner">
              <div class="onb-img">
                  <img class="cover" src="/assets/background/accessibility.png" alt="">
              </div>
              <div class="onb-desc ion-text-center">
                <h5> {{$t('onboard.accessibility.title')}}</h5>
                <p class="ion-no-margin desc-text" > {{$t('onboard.accessibility.alternative')}}  </p>
                <p class="ion-no-margin">  </p>

              </div>
             
             
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
  IonSlides, IonSlide ,
  IonToggle

} from "@ionic/vue";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';




import "swiper/swiper.scss";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'swiper/modules/navigation/navigation.min.css'
import 'swiper/modules/pagination/pagination.min.css'
import"swiper/modules/pagination/pagination.scss"
import common from  "../js/common"



export default {
  props: {
      context: { type: String, default: 'onboard' },
  },
  name: "Tab",

  components: {
    
    IonToolbar,
    IonIcon,
    IonContent,
    IonPage,
    IonButton,
    IonButtons,
    IonFab,
    IonFabButton,
    IonSlides, IonSlide,
    IonToggle
   
  },

  data() {
    return {
      publishedLang:[],
      percorsiMostra:[],
      name: "onboard",
      store:"",
      currLang:"it",
      currPerc:null,
      currSlide:0,
      isFirst:true,
      last:false,
      progress:0,
      media:0,
      mediafetched:0,
      help:false,
      percorsi:[],
      showpage:false,
      accessibility:null,
      nPercMostra:null,
      sliderKey: 0,
      attivaSupporto:false
    
    
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

    getPubbl(){
      const pubblication=JSON.parse(localStorage.getItem('pubblication'));
      return pubblication;
    },
    interactionMode(){
      console.log("interactionMode "+this.conf.interactionMode );
      return this.conf.interactionMode;
    },

    contentsonb(){
      return contents;
    },
    confPerc(){
    
      return this.conf.percorsi;

    },
    nPercorsiMostra(){
      const pubblication=JSON.parse(localStorage.getItem('pubblication'));
      if(pubblication){
        if( pubblication.hasOwnProperty("percorsi")){
          console.log("HA I percordsi")
            return pubblication.percorsi.length

        }else{
          console.log("NON HA I percordsi")
            return null
        }
      }else{
        console.log("NON HA pubblication")
        return null
      }
    },
    supportoVisivo(){
            const pubblication=JSON.parse(localStorage.getItem('pubblication'));
            if(pubblication && pubblication.hasOwnProperty("supporto_video")){
              console.log("HA I il supporto")
                return pubblication.supporto_video

            }else{
              console.log("Non HA I il supporto")
                return null
            }
            

    },
    getAttivaSupporto(){
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

  async created(){
    //this.nPercMostra=this.nPercorsiMostra;
  //  this.accessibility=this.supportoVisivo;
    this.getinfo=common.getinfo;
    await this.getinfoall();
    //this.getpubbldata();

    this.emitter.on('savedPubbl', _ => {
      this.sliderKey += 1;
      console.log("EMITTT ")
      this.getpubbldata();
     
      
    });
   

 
  },
  mounted(){
    if(this.getPubbl!=null){
      this.accessibility=this.supportoVisivo;
      this.nPercMostra=this.nPercorsiMostra;
    }

    this.attivaSupporto=this.getAttivaSupporto
   
    //this.calcSlidelength();
    
  
   
      
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
    checkPerc(perc){
      if(perc==this.currPerc){
        return "checked"
      }
    },

    checkdisplayPerc(){
      if(this.percorsi.length<=1){
        return "checkedDiaplay"
       
      }
    },

    notice(){
      
      localStorage.setItem('attivaSupporto', this.attivaSupporto)
    },
    /*attivaaccessibility(){
     
      if(this.accessibility==null ||this.accessibility==0 ){
       // this.settings.push("accessibility");
       
        this.accessibility=1
      
      }else{
        this.accessibility=0
      }
      this.sliderKey += 1;
     // this.updateSlides();
      console.log("Clicked, ",this.accessibility)
    },*/
    getpubbldata(){
     
      this.accessibility=this.supportoVisivo;
      this.nPercMostra=this.nPercorsiMostra;
      console.log("getpubbldata", this.accessibility,this.nPercMostra )
     // this.sliderKey += 1;
    },

   async getinfoall(){
      console.log('? '+ contents[0].name);
      this.currLang=this.$i18n.locale;

      if(this.context=='onboard'){
        this.getinfo(async(info) => {
          this.publishedLang=info.lang.map(element => {
            return element.toLowerCase();
          });
          console.log("LANG PUBB ", this.publishedLang.length)
          if(this.publishedLang.find( element => element ==this.currLang)){
            this.setLang(this.currLang);
          }else{
            this.setLang(this.publishedLang[0]);
          }
          if(info.percorsi){
            console.log("onb Percorsi")
          
            this.percorsi=info.percorsi;
            console.log("onb iiiiiiiiiiiiiiii", this.percorsi );
            console.log("N oper",  this.percorsi.length)
            
            if(this.percorsi.length<=1){
             // this.$refs.slider.$el.update(); 
              
              console.log("N oper2",  this.percorsi.length)
            }
                            
           let perc= await common.getPercorsiawait();
           perc=perc.result;
           console.log("awaittt perc",perc);
            this.percorsiMostra = perc.filter(item => info.percorsi.includes(item.percorso));
              
                  this.setPercorso(this.percorsiMostra[0].percorso)

            this.calcSlidelength();
          }
          
        })
        
        //  this.percorsiMostra = JSON.parse(localStorage.getItem("percorsi"));
        
          
     

      }
    },


    nomeLingua(perc){
      
      const retur= perc.lingue.find(item=>item.lang==this.currLang);
        return retur.nome;

    },

   /* getinfo(callback){
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

    },*/

    
    imgPercorsi(perc){
      
          
      if(perc.img!=null){
         return this.$store.getters.baseUrl+"/upload/"+perc.img
      }else{
       return '/assets/background/logo.png'
      }
    
    

  },
    setLang(lang){
      this.currLang=lang;
      console.log("click lang" + lang);
      localStorage.setItem('lang', lang);
      //if(localStorage.getItem('savedLangs')==null){
        localStorage.setItem('savedLangs', lang);
        this.$i18n.locale = lang;
    // }
    },
  

    setPercorso(perc){
      this.currPerc=perc;
      console.log("click percorso" + perc);
      localStorage.setItem('percSel', perc);
      
      common.setstorePerc(this.percorsiMostra.find(itemperc=>itemperc.percorso==perc));
      //if(localStorage.getItem('savedLangs')==null){
        const percLang={};

        console.log("cosa vedeee", this.currLang," ",perc )
        percLang[this.currLang]=[perc];
         
         
        localStorage.setItem('savedPerc',  JSON.stringify(percLang));
        console.log("OGGGGGGGG", percLang)
       
    // }
    },


    next(){
      console.log("nexxxt");
    
      this.$refs.slider.$el.slideNext(500);

      this.slidechanged();
      console.log(this.slideLength);
      if(this.currSlide==this.slideLength-1){

        if(this.context=="onboard"){
        this.setPercorso(this.currPerc)

          this.$router.replace({ name: 'scarica', params:{ lang:this.currLang, fromC:"onboard", perc:this.currPerc}});

        }else{
          this.skip();
        }
        
     
     }
  
    },
    async calcSlidelength(){
      
      this.slideLength= await this.$refs.slider.$el.length();
      console.log("N slides "+   this.slideLength)
    },
    
    async slidechanged() {
      this.currSlide= await this.$refs.slider.$el.getActiveIndex();
      console.log('@index',  this.currSlide);
      this.checkProgress();    
      
    },

    updateSlides() {
      // Aggiorna il componente ion-slides quando cambia la visibilità delle slide
      this.$nextTick(() => {
        if (this.$refs.slider && this.$refs.slider.update) {
          this.$refs.slider.update(); // Forza l'aggiornamento delle slides
        }
      });
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

ion-toolbar{
  --background: transparent;
  --min-height: 40px;
  --max-height: 520px;
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
  width: 90vw;
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
    margin-bottom: 6vh;
    margin-top: 4vh;
}


.lang{
 text-align: center;
 font-size: 0.9em;
 
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

.inline-row{
  margin-bottom: 15px;
  align-items: center;
  box-shadow: 0 1px 6px 0px rgba(0, 0, 0, .2);
  border-radius: 7px;
  padding: 6px ;
  border: .5px solid #bfbfbf24;
  background: rgb(245 245 245 / 81%);
}

.percorsi-cont{
 display: flex;
 justify-content: flex-start;
}
.percorso{
  text-align: left;
  padding-left: 2vw;
}
.circle-cont{
  height:10vh;
  width: 10vh;
  margin: 0 auto 10px;
}
.circle-cont-perc{
  height:8vh;
  width: 8vh;
}
.circle{
  
  height:100%;
  width: 100%;
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
   outline: solid 5px var(--ion-color-secondary-whitened);
     opacity: 1;
}
.checkedDiaplay{
  display: none;
}

.checked-row{
  font-weight: 600;

}
.swiper-pagination {
  color: red;
}
.swiper-pagination-bullets{
  bottom: 40px!important;
}
.swiper-pagination-bullet-active{
  background:var(--ion-color-secondary)!important;
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
  top: 1vh;

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
  padding: 25px;
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