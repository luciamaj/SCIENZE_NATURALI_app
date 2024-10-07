<template>
  <ion-page>
     <ion-header collapse="fade">
      <ion-toolbar class="toolbar" >
        <!--ion-title v-html="contentScheda.titolo" > </ion-title-->
        <ion-buttons   slot="start"  v-if="context=='scheda'">
          <ion-button v-on:click="goingback()"  class="back-button" ><ion-icon size="medium" name="arrow-back"></ion-icon> {{$t('schede.back')}}</ion-button>
         
        </ion-buttons>
        <ion-buttons   slot="end"  v-if="context=='modal'">
          <ion-button v-on:click="closeModal()"  class="back-button" ><ion-icon size="medium" name="close"></ion-icon> {{$t('action.close')}}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="vertical-center">       
        <div class="player">
          <div :class="[hastext? 'img-container': 'img-container-audio-notext']"> 
            <img :src="imgSrc" class="album-art" :key="imageUrl"/>
          </div>
          
          <div class="ion-no-border content-scheda">
            <div class="meta-container"> 
              <div class="song-title" v-html="contentScheda.titolo"></div>

              
              <progress v-if="fileUrl!=null"
                class="amplitude-song-played-progress"
                data-amplitude-song-index="0"
                id="song-played-progress-1">
              </progress>
              <div class="time-container" v-if="fileUrl!=null">
                <div class="current-time">
                  <span class="amplitude-current-minutes" data-amplitude-song-index="0">00</span>:
                  <span class="amplitude-current-seconds" data-amplitude-song-index="0">00</span>
                </div>

                <div class="duration">
                  <span class="amplitude-duration-minutes" data-amplitude-song-index="0">03</span>:
                  <span class="amplitude-duration-seconds" data-amplitude-song-index="0">30</span>
                </div>
              </div>
              <div class="control-container" v-if="fileUrl!=null">
                <div class="prev" @click="minus"></div>
                <div class="amplitude-play-pause" data-amplitude-song-index="0"></div>
                <div class="next" @click="plus"></div>
              </div>
            </div>
            <div class="descrArea"   v-html="contentScheda.testo"> </div>
          </div>
        </div>

       
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  //IonTitle,
  IonContent,
 alertController,
 modalController,
  IonButtons,
  //IonIcon,
  //IonButton,

} from "@ionic/vue";
import Amplitude from "amplitudejs";
import { data } from "../data/data";
import { Plugins } from "@capacitor/core";
import common from "./../js/common"
import {global} from "./../js/global"
const { Storage } = Plugins;



export default {
  name: "Amplitude",
  props:{
    tag:{ type: String, default: '00'},
    context:{ type: String, default: 'scheda'}

    
  },
  components: {
    IonHeader,
    IonToolbar,
    //IonTitle,
    IonContent,
    IonPage,
   
    IonButtons,
    //IonIcon,
  //  IonButton,

  },
  ionViewWillLeave() {
    console.log('Ampli will leave');
    if(this.fileUrl){
      clearTimeout(this.timer);
      Amplitude.pause();
      this.audio.currentTime=0;
      this.audio.src="";
      
    }

  },

   
  ionViewDidLeave() {
   
     console.log("leave page");
  },

  unmounted(){
    this.schedaState(false);
    console.log("Unmounting page");
    console.log('DB? ', this.db)
    
  },

  created(){
     document.addEventListener('backbutton',()=>{
      this.$router.replace('/');
    });
    this.addtoBucket=common.addtoBucket;
    this.paramId=this.$route.params.id?this.$route.params.id:this.tag;
    this.schedaState(true);
    this.emitter.on('changeVersion', _ => {
      this.showOptions();
    });
    this.emitter.on('fineAggiornamento', _ => {
      console.log("FINITO");
     // this.notification=false;
    });

  },

  data() {
    return {
      title: "Audioguida",
      timer:"",
      fileUrl:true,
      imageUrl:0,
      imgSrc:'',
      hastext:true,
    };
  },

  computed: {

    contentScheda(){
         
       console.log("ENTRO QUA")
       const lang= localStorage.getItem("lang")
         
      const scheda= this.dataSchede.content.find(x => x.lang == lang);
    //  console.log("che fine ha fatto la scheda? ",scheda);
      if(scheda) {
        return scheda
      }else{

        return ""
      }
     

    },
    dataSchede(){

      const data=localStorage.getItem("dataMostra")
     
      const scheda= JSON.parse(data).find(x => x.tag ==  this.paramId);
      
     return scheda
     
    },
   
   /* cover() {
      const audio=this.contentScheda.audio; 
      console.log("che c'è? "+ audio + this.dataSchede.img);
      if (audio && this.dataSchede.img) {
        console.log("c'è audio e iimmmagine");
        this.getCoverImg(this.dataSchede.img);
        return 'i'
      } else {
        return this.$store.getters.baseUrl+'/upload/329.jpg'
       
      }
     
    },*/
    id() {
      return this.paramId;
    },

    name() {
      const audio = data.find(x => x.index == this.$route.params.id);
      if (audio) {
        return audio.name;
      } else {
        return data[0].name;
      }
    },
     lang() {
      const lang= localStorage.getItem("lang")
      if (lang) {
        return lang;
      } else {
        return this.$i18n.locale;
      }
    },
  
  },
  beforeMount(){
    this.url();
    this.cover();

  },
  mounted() {
  
    this.addtoBucket(this.paramId);
  },
  methods:{

    async  closeModal(){
      const top= await modalController.getTop();
       top.dismiss();

    },
    
 
    cover() {
      const type=this.contentScheda.type; 
      console.log("che c'è? "+ this.contentScheda.audio + this.dataSchede.img);
      if ((type=="audio"|| type==null) && this.dataSchede.img) {
        console.log("c'è audio e iimmmagine");
        this.getCoverImg(this.dataSchede.img);
        //return this.$store.getters.baseUrl+'/upload/'+this.dataSchede.img
      } else {
        if(this.conf.percorsi==false){
          this.getCoverImg(this.$store.getters.pubblication.img) 
        }else{
          const sel=common.getpercinfo();
          console.log("cosa è salvatop?",sel);
         
          this.getCoverImg(sel.img);
        }
         
       
      }
      if(this.contentScheda.testo==null){
        this.hastext=false;
      }else{
        this.hastext=true;
      }
     
    },

    getCoverImg(name){
       this.request = indexedDB.open('mediaStore', global.dbVersion);
        this.request.onsuccess = event => {
             this.db = event.target.result;
        const transaction = this.db.transaction(['media-'+this.lang],'readwrite');
        const objectStore = transaction.objectStore('media-'+this.lang);

        const test = objectStore.get(name);

        test.onsuccess = event => {
            console.log("GET RESULT ", event.target.result)
            const testget = event.target.result;      
            if (testget) {
             this.imgSrc= URL.createObjectURL(testget.blob);
                
            // this.imgSrc='data:'+testget.blob.type+';base64,'+btoa(testget.data);
              console.log("img ",this.imgSrc);
             
            
            } else {
              console.log('testget dont exixst error');
                this.fetchImg(name);
            }

            this.db.close();
          };
        }
        this.request.onerror= event=>{
          this.fetchImg(name);
        }
    
    },

    fetchImg(name){
       console.log("TRYIN FETCH")
        const mediaRequest = fetch(this.$store.getters.baseUrl+"/upload/"+name).then(response => response.blob()).catch(err => {console.error(err); console.log("sono in errore")});
    
        mediaRequest.then(blob => {
          const fileblob=blob;
           this.imgSrc=  URL.createObjectURL(fileblob)
         
        
          const objectStore =this.db.transaction(['media-'+this.lang],'readwrite').objectStore('media-'+this.lang);
            console.log('blobb ',fileblob)
            const objectStoreRequest = objectStore.add({name: name, blob: fileblob});
            objectStoreRequest.onsuccess = (event) =>{
            // report the success of our request
            console.log(name+ " Successs put");
              
          };
        
        })
        
        

     },

    url() {
      const audio=this.contentScheda;
      if (audio.audio) {
        console.log("audio ",audio.audio);  
        this.request = indexedDB.open('mediaStore', global.dbVersion);
        this.request.onsuccess = event => {
          this.db = event.target.result;
          if(this.db){
            console.log("ildb ",this.db)
           
          
          }else{
            alert("no DB")
          }
          const transaction = this.db.transaction(['media-'+this.lang],'readwrite');
          transaction.onerror= event => {
              alert('notransaction ', event);
            
            };
          const objectStore = transaction.objectStore('media-'+this.lang);

          const test = objectStore.get(audio.audio);
      

          test.onerror = event => {
              console.log('error');
            
            };

          test.onsuccess = event => {
            console.log("GET RESULT ",event.target.result)
            const testget = event.target.result;
             if (testget) {
                this.fileUrl=URL.createObjectURL(testget.blob);
               console.log(" audio ", this.fileUrl )
             // this.audio.load()
             // this.audio.onloadeddata=()=>  this.play();
              this.ampliInit();

                 this.play();
                console.log("AMPLI ",Amplitude);
            
            } else {
              console.log('testget dont exixst error');
                this.fetchFile(audio.audio);
            }

            this.db.close();
          };
        }
       
      } else if (audio.video) {
         console.log("video ",audio.video);
        this.fileUrl= this.$store.getters.baseUrl+"/upload/"+ audio.video;
      }else{
        console.log("URL"+ null)
        this.fileUrl= null
      }
    },

    ampliInit(){
      Amplitude.init({
        /* eslint-disable */
        songs: [
          {
            name: "",
            artist: "",
            album: "",
            url: this.fileUrl,
            cover_art_url: "/assets/icon/icon.png"
          }
        ],
        callbacks: {
          ended: ()=>{
            console.log("Audio has been stopped.");
            console.log("Document " + document.visibilityState)
            if(document.visibilityState=="visible"){
              this.setTimer();
            }else{
              this.back();
            }
            

          }
        }
      });
      this.audio=Amplitude.getAudio();

      document.getElementById("song-played-progress-1")
      .addEventListener("click", function(e) {
        if (Amplitude.getActiveIndex() == 0) {
          var offset = this.getBoundingClientRect();
          var x = e.pageX - offset.left;

          Amplitude.setSongPlayedPercentage(
            (parseFloat(x.toString()) /
              parseFloat(this.offsetWidth.toString())) *
              100
          );
        }
      });

    },
    
     fetchFile(name){
       console.log("TRYIN FETCH")
        const mediaRequest = fetch(this.$store.getters.baseUrl+"/upload/"+name).then(response => response.blob()).catch(err => {console.error(err); console.log("sono in errore")});
    
        mediaRequest.then(blob => {
          const fileblob=blob;
          this.fileUrl=  URL.createObjectURL(fileblob)
          this.ampliInit();
          this.play(); // manca init amplitude, mettere un loader da qualche parte
          
          const objectStore =this.db.transaction(['media-'+this.lang],'readwrite').objectStore('media-'+this.lang);
            console.log('blobb ',fileblob)
            if(objectStore){
              console.log("objS presente ", objectStore)
            }
            const objectStoreRequest = objectStore.add({name: name, blob: fileblob});
            objectStoreRequest.onsuccess = (event) =>{
            // report the success of our request
            console.log(name+ " Added Successfully");
              
          };
          objectStoreRequest.onerror=(event)=>{
            alert ('error objectstore rquest');
          }

        
        })
        
        

     },
    goingback() {
       this.schedaState(false);
    /*  if (window.history.length > 1) {
        this.$router.go(-1);
      } */
     console.log("HISTORU : ",window.history )
     if(window.history.state.back=="/gps" || window.history.state.back== "/raccolta"){
      this.$router.go(-1);
     }else{
      this.$router.replace({path:"/"});
     }
      
      
      
    },
    play() {
      console.log(" audio ",this.audio)
      Amplitude.play();
      
      $('.amplitude-play-pause').addClass('amplitude-playing').removeClass('amplitude-paused');
      if(this.timer){
         clearTimeout(this.timer);
      }
    },
    pause() {
      Amplitude.pause();
    },

    minus(){
      
      if(this.audio.currentTime> 0.0){
      this.audio.currentTime= this.audio.currentTime-5;
        
      }
      if(this.timer){
        clearTimeout(this.timer);
      }


    },
    plus(){
     
      if(this.audio.currentTime< this.audio.duration){
        this.audio.currentTime= this.audio.currentTime+5;
       
      }
      if(this.timer){
        clearTimeout(this.timer);
      }
      
        

    },
  
    inactivityTime(){
       document.ontouchmove = this.resetTimer;
    },
     
    resetTimer() {
      console.log('RESET Timer out');
      clearTimeout(this.timer);
      this.setTimer();
          
    },

    setTimer(){
       this.inactivityTime();
      this.timer = setTimeout(this.timeout, 30 * 1000);
    },
    timeout() { 
      console.log("timeout");
    
      this.$router.replace({path:"/"});
      
    },

    
    async schedaState(state) {
      console.log(" openscheda state");
      await Storage.set({
        key: 'openScheda',
        value:state
      });
    },
    async showOptions() {
      const alert = await alertController.create({
          header: this.$t('update.title') ,
          message: this.$t('update.text') ,
          buttons: [
              {
                  text:this.$t('action.download'),
                  cssClass:'modal-accept-button',
                  handler: () => {
                      localStorage.setItem('provToOpen', this.$route.params.id);
                      this.emitter.emit('aggiorna','main');
                  },
              },
              {
              text: this.$t('action.postponi') ,
              role: "cancel",
              handler: () => {
                  console.log("Declined the offer");
                  this.updateNotification(true);
                  
              },
              },
          ],
      });

      await alert.present();
    },
 
      
     
  }
};
</script>

<style>
.back-button{
  text-transform: capitalize;
}
ion-icon{
  margin-right: 10px;
}
ion-content {
  --overflow: hidden;
}
.img-container{
  height: 45vh;
}

.img-container-audio-notext{
  height: 70vh;
}

div.player {
  margin-bottom: 20px;
  max-width: 750px;
  width: 100%;
  margin: auto;
  position: relative;
  /*top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);*/
}

div.player:after {
  content: "";
  display: table;
  clear: both;
}
div.player img.album-art {
  width: 245px;
  height: 245px;
  object-fit: cover;
  float: left;
}

.vertical-center {
  height: 88vh;
  width: 100%;
}

.descrArea{
  float: left;
  padding: 8px 27px 30px;
 /* max-height: 40vh;*/
 height: 39vh;
 width: 100%;
 /* overflow: overlay;*/
 /* margin-top: 2vh;*/
  margin-bottom: 2vh;
  font-size: 1.1em;
  line-height: 1.4em;
  margin-top: 1vh;
  overflow: scroll;

}
.descrArea p{ margin-top: 0;}

.content-scheda{
    /* overflow: overlay;*/
    height: 57vh;
}
/*
  Small only
*/
@media screen and (max-width: 39.9375em) {
  div.player img.album-art {
    width: 100%;
    height: 100%;
    /*max-height: 40vh;*/
    object-fit: cover;
  }
  .img-container-audio-notext{
    height: 60vh;
  }
}
/*
  Medium only
*/
/*
  Large Only
*/

div.meta-container {
  /*float: left;*/
  /*width: calc(100% - 270px);*/
  padding: 10px 20px;
  max-height: 40vh;
}
div.meta-container div.song-title {
  text-align: left;
  color: #263238;
  font-size: 22px;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
  margin: 14px 0 5px;

}
div.meta-container div.song-artist {
  text-align: center;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  color: #263238;
  margin-top: 10px;
}
div.meta-container div.time-container {
  font-family: Helvetica;
  font-size: 15px;
  color: #000;
  margin-top: 10px;
}
div.meta-container div.time-container:after {
  content: "";
  display: table;
  clear: both;
}
div.meta-container div.time-container div.current-time {
  float: left;
}
div.meta-container div.time-container div.duration {
  float: right;
}

/*
  Small only
*/
@media screen and (max-width: 39.9375em) {
  div.meta-container {
    width: 100%;
  }
}
/*
  Medium only
*/
/*
  Large Only
*/
div.control-container {
  text-align: center;
  margin-top: 1vh;
}
div.control-container div.prev {
  width: 21px;
  height: 18px;
  cursor: pointer;
  background: url("/assets/icon/playerIcon/previous.svg");
  background-size: cover;
  display: inline-block;
  vertical-align: middle;
}
div.control-container div.amplitude-play-pause {
  width: 28px;
  height: 29px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}
div.control-container div.amplitude-play-pause.amplitude-paused {
  background: url("/assets/icon/playerIcon/play.svg");
      background-size: cover;
}
div.control-container div.amplitude-play-pause.amplitude-playing {
  background: url("/assets/icon/playerIcon/pause.svg");
      background-size: cover;
}
div.control-container div.next {
  width: 21px;
  height:18px;
  cursor: pointer;
  background: url("/assets/icon/playerIcon/next.svg");
   background-size: cover;
  display: inline-block;
  vertical-align: middle;
}

/*
  Small only
*/
@media screen and (max-width: 39.9375em) {
  div.control-container div.prev {
    margin-right: 65px;
  }
  div.control-container div.next {
    margin-left: 65px;
  }
}
/*
  Medium only
*/
@media screen and (min-width: 40em) and (max-width: 63.9375em) {
  div.control-container div.prev {
    margin-right: 40px;
  }
  div.control-container div.next {
    margin-left: 40px;
  }
}
/*
  Large Only
*/
@media screen and (min-width: 64em) {
  div.control-container div.prev {
    margin-right: 75px;
  }
  div.control-container div.next {
    margin-left: 75px;
  }

  .vertical-center {
  padding: 70px 0;
 
  }

}
progress.amplitude-song-played-progress:not([value]) {
  background-color: #313252;
}

progress.amplitude-song-played-progress {
  background-color: #d7dee3;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  display: block;
  cursor: pointer;
  border-radius: 3px;
  height: 6px;
  border: none;
}

progress[value]::-webkit-progress-bar {
  background-color: #d7dee3;
  border-radius: 3px;
}

progress[value]::-moz-progress-bar {
  background-color: #00a0ff;
  border-radius: 3px;
}

progress[value]::-webkit-progress-value {
  background-color: #00a0ff;
  border-radius: 3px;
}

/*
  3. Layout
*/
body {
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
  padding: 20px;
}
body div#preload {
  display: none;
}
</style>