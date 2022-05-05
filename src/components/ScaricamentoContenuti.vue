<template>
     <ion-content>
     
      <div  class="onboard-main">

       

          <div class="onb-desc ion-text-center">
            <h4> {{$t('scarica.title')}}</h4>
            <p class="ion-no-margin text-scaricamento"> {{$t('scarica.text')}}</p>
          </div>
          <div class="progress"> 
            <ion-progress-bar :value="progress" :buffer="1" color="secondary"> </ion-progress-bar>
            <div class ="progressvalue"><ion-spinner v-if="progress<1" name="crescent"></ion-spinner>{{ Math.round(progress*100) }} %</div>
          </div>

         
       
            

      </div>
      

    </ion-content>
</template>

<script>
import common from "../js/common"
import {

 IonContent,
 IonProgressBar,
 IonSpinner,
 alertController

} from "@ionic/vue";


import Lang from '@/components/ChangeLang.vue';

export default {
    name: "scaricamento",
    props: {
        lang: { type: String, default: 'it' },
        from: { type: String, default: 'main' }
    },
    data() {
        return {
        publishedLang:[],
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


  
  created(){
    if(window.navigator.onLine){
      this.online=true
    }else{
       this.online=false
    }
    this.updateNotification=common.updateNotification;
    this.savedlangs=localStorage.getItem('savedLangs');
    console.log("svd lng",this.savedlangs);
    this.currLang=this.$i18n.locale;

    if(this.online){
      this.getinfo((info) => {
        this.publishedLang=info.lang.map(element => {
          return element.toLowerCase();
        });
      })
    }

  },
  mounted(){
   
    
    setTimeout(() => {
      if(this.online){
        this.searchMedia();
      }else{
        this.networkError();
      }
       
    
    },1000);
    
       
      
  },
 
  components: {
    
   IonSpinner ,
   IonContent,
    IonProgressBar
  },


  methods:{

    async networkError() {
      const alert = await alertController.create({
        header:  this.$t('networkerror.title'),
        message: this.$t('networkerror.text'),
        buttons: [
         
          {
            text: this.$t('networkerror.action'), 
            handler: () => {
              this.gotoFrom();
              
            },
          },
        ],
      });
  
      await alert.present();
    },
  
    getinfo(callback){
      

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
    console.log("lingua? "+ this.lang);
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
      contenuto=scheda.content.find(el=> el.lang== this.lang )
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

      //fetch(this.$store.getters.baseUrl+"/inventario/download.php?id="+name+"&link=1")
      fetch(this.$store.getters.baseUrl+"/upload/"+name)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        
        console.log("OK Resp", response);
        if(response.status==200){
         
         // this.mediafetched++
        }
       /* this.progress=(this.mediafetched/this.media*100 )/100;
        console.log("progress ",  this.progress);*/
       
        return response
      })
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url =>{ console.log( url);
        this.mediafetched++
        this.progress=Math.round(this.mediafetched/this.media*100 )/100;
        console.log("progress ",  this.progress);
      
        if(this.progress==1){
          this.openNext();
        }
      })
      .catch(err => {console.error(err)
        console.log("sono in errore")
        this.mediafetched++
        this.progress=Math.round(this.mediafetched/this.media*100 )/100;
        console.log("progress ",  this.progress);
        if(this.progress==1){
          this.openNext();
        }
      });


    },

    mediaCounter(){
      this.media++;
    },
    pushPage(fromTo) {
        const ionNav = document.querySelector('ion-nav') ;
        if(fromTo=="lang"||fromTo=="update"){
            ionNav.pop();
            
        }
        
       
    },

    openNext(){
      this.emitter.emit("fineAggiornamento");
      this.updateNotification(false);
      if(this.from=="main"){
        if(localStorage.getItem('provToOpen')!=null){
          const tag= localStorage.getItem('provToOpen');
          localStorage.removeItem('provToOpen');
          this.$router.replace({ path: "/scheda/"+tag });
        }else{
          this.$router.replace({ name: "wave" });
        }
            
      }else if(this.from=="update"){
        this.pushPage("update");
      } else if(this.from=="lang"){
        this.pushPage("lang");
      }
    },

    gotoFrom(){
      if(this.from=="main"){
        if(localStorage.getItem('provToOpen')!=null){
          const tag= localStorage.getItem('provToOpen');
          localStorage.removeItem('provToOpen');
          this.$router.replace({ path: "/scheda/"+tag });
        }else{
          this.$router.replace({ name: "wave" });
        }
            
      }else if(this.from=="update"){
        this.pushPage("update");
      } else if(this.from=="lang"){
        this.pushPage("lang");
      }
      
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



.title {
  color: #2d9fe3;
  font-size: 26px;
  font-weight: 700;
  padding: 10px;
}

.onb-desc{
  top: 32%;
    position: relative;

}

.text-scaricamento{
  margin-bottom: 20px;
}

.toolbar {
   --background:  red;
}


.toolbar-background {
  color: white !important;
}
.progress{
  height: 31px;
  top: 35%;
    position: relative;
    padding: 0 10px;

}
ion-spinner{
  margin-right: 2%;
  color: azure;
  height: 19px;
  flex-direction: row;
}
.progressvalue{
  display: flex;
  align-items: center;
  position: relative;
  left: 15px;
  text-align: left;
  transform: translateY(-110%);
  font-weight: 700;
  color: azure;
  height: 25px;
}
ion-progress-bar {
  background-color: #d7dee3;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  display: block;
  cursor: pointer;
  border-radius: 15px;
  height: 30px;
  border: none;
}

ion-progress-bar[value]::-webkit-progress-bar {
  background-color: #d7dee3;
  border-radius: 3px;
}

ion-progress-bar[value]::-moz-progress-bar {
  background-color: #00a0ff;
  border-radius: 3px;
}

ion-progress-bar[value]::-webkit-progress-value {
  background-color: #00a0ff;
  border-radius: 3px;
}

@media only screen and (orientation:portrait) {
  body {
    height: 100vw;
    transform: rotate(90deg);
  }
}

</style>