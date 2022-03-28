<template>
     <ion-content>
     
      <div  class="onboard-main">
    
      

        <div class="onboard-bot">

          <div class="onb-card">
              
            <div class="onb-desc ion-text-center">
                <h4>Scarico i contenuti</h4>
                <p class="ion-no-margin">A breve l'applicazione sarà pronta all'uso</p>
                <ion-progress-bar :value="progress" :buffer="1" color="secondary"></ion-progress-bar>

            </div>
          </div>
          
        </div>
            

      </div>
      

    </ion-content>
</template>



<script>



import {

 IonContent,
 IonProgressBar

} from "@ionic/vue";

//import NavRoot from '@/components/NavRoot.vue';
import Lang from '@/components/ChangeLang.vue';
//import { Plugins } from "@capacitor/core";
//import { useRouter } from "vue-router";


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


  computed:{
    
    /*lang(){
   
      return this.lang;
    },*/

   
  },
  mounted(){

        this.currLang=this.$i18n.locale;

        this.getinfo((info) => {
          this.publishedLang=info.lang.map(element => {
            return element.toLowerCase();
          });
        })
        this.searchMedia();
       
      
  },
 
  components: {
    
   
   
   IonContent,
    IonProgressBar
  },


  methods:{


  
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
          throw new Error(`Request failed with status ${reponse.status}`)
        }
        
        console.log("OK Resp", response);
        if(response.status==200){
         
          this.mediafetched++
        }
        this.progress=this.mediafetched/this.media;
        console.log("progress ",  this.progress);
        if(this.progress==1){
            if(this.from=="main"){
              if(localStorage.getItem('provToOpen')!=null){
                console.log("entra in audio?");
               // const path= "audio/"
                this.$router.replace({ path: "/audio/"+localStorage.getItem('provToOpen') });
              }else{
                this.$router.replace({ name: "wave" });
              }
                
            }else if(this.from=="update"){
                this.pushPage();
            } else if(this.from=="lang"){
                this.pushPage("lang");
            }
           
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
    },
    pushPage(fromTo) {
        const ionNav = document.querySelector('ion-nav') ;
        if(fromTo=="lang"){
            ionNav.pop();
            
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