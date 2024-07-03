<template>
  <ion-page>
    <ion-header collapse="fade">
      <ion-toolbar class="toolbar" >
        <!--ion-title v-html="contentScheda.titolo" > </ion-title-->
        <ion-buttons  slot="start" >
          <ion-button v-on:click="goingback()" class="back-button"><ion-icon size="medium" name="arrow-back"></ion-icon> {{$t('schede.back')}}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="supercontainer">
        <div  :class="[hastext? 'player-container': 'player-container-notext']">
          <video  id="video" >
            <source :src="url" type="video/mp4" />
          </video>
          <ion-icon class="expand" name="expand-outline" @click="launchIntoFullscreen()"></ion-icon>

        </div>
      

        <div class="ion-no-border content-scheda">

          <div class="meta-container">

            <div class="song-title" v-html="contenuto.titolo"></div>
            <progress class="amplitude-song-played-progress" :value="progress" :buffer="1" color="secondary"></progress>
              <div class="time-container">
              <div class="current-time">
                <span class="amplitude-current-minutes" data-amplitude-song-index="0">{{current.min}}</span>:
                <span class="amplitude-current-seconds" data-amplitude-song-index="0">{{current.sec}}</span>
              </div>

              <div class="duration">
                <span class="amplitude-duration-minutes" data-amplitude-song-index="0">{{duration.min}}</span>:
                <span class="amplitude-duration-seconds" data-amplitude-song-index="0">{{duration.sec}}</span>
              </div>
            </div>
            <div class="control-container">
              <div class="amplitude-prev" @click="minus"></div>
              <div class="amplitude-play-pause " :class="checkPlay()" @click="playpause('normale')"></div>
              <div class="amplitude-next" @click="plus"></div>
            </div>
          </div>
          <div class="descrArea"   v-html="contenuto.testo"> </div>
        </div>
        
      </div>
    </ion-content>
    <div class="video-full-container" :class="(fullscreen? 'show': 'hideFull') ">
          <video  class="videoFull"  id="videoFull" >
              <source :src="videoSrc" type="video/mp4" />
          </video>
          <div class="controls">
             <div  class="amplitude-play-pause play " :class="checkPlay()" @click="playpause('full')" data-icon="P" aria-label="play pause toggle"></div>
             <progress class="amplitude-song-played-progress" :value="progress" :buffer="1" color="secondary"></progress>
             <div  class="exitFull" @click="exitFull"><ion-icon class="close-expand" name="expand-outline"></ion-icon></div>
          </div>

        </div>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  //IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  alertController,
 // IonProgressBar
} from "@ionic/vue";
import Amplitude from "amplitudejs";
import { Plugins } from "@capacitor/core";
import common from './../js/common'
import {global} from '../js/global'

const { Storage } = Plugins;

export default {
  name: "Tab",
  components: {
    IonHeader,
    IonToolbar,
    //IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonButton,
    IonIcon,
  //  IonProgressBar
  },
 
  ionViewWillLeave() {
  
    console.log('VIdeo will leave');
     clearTimeout(this.timer);
    this.vid.pause();
    this.vid.currentTime=0;
   
   
  },
   
  unmounted(){
    this.vid.src="";
    this.schedaState(false);
    console.log("Unmounting page");
  },
  computed: {
    tag() {
      return this.paramId;
    },
    scheda() {
      const scheda = JSON.parse(localStorage.getItem("dataMostra")).find(x => x.tag == this.tag);
      if (scheda) {
        return scheda;
      } else {
        return "";
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
    contenuto(){
      const contenuti=this.scheda.content.find(x => x.lang == this.lang);
      console.log("content ", contenuti);
      if(contenuti){
        return contenuti
      }else{
        return "";
      }
    },
    url() {
      const video = this.contenuto.video;
   
        if (video) {
        console.log("video ",video);
       // return this.$store.getters.baseUrl+"/upload/"+video;
       this.getvideo(video)
       return "videoo"
      } else {
        
        return "";
      }
    }
  },
  created(){
   
   document.addEventListener('backbutton',()=>{
      this.$router.replace('/');  this.vid.play()
    });
    this.addtoBucket=common.addtoBucket;
    this.paramId=this.$route.params.id;
     this.schedaState(true);
    console.log("Entra update")
    this.emitter.on('changeVersion', _ => {
      this.showOptions();
    });
    this.emitter.on('fineAggiornamento', _ => {
      console.log("FINITO");
    });

  },
  mounted(){
   
    this.vid=document.getElementById("video");
    this.vidFull=document.getElementById("videoFull");
    console.log("video ",this.vid);
    this.vid.load();
    this.vid.onloadeddata = ()=> {
      console.log("Browser has loaded ");
      this.duration= this.getminsec(this.vid.duration);
      this.vid.play();
      if(this.vid.paused){
        this.videoPlay=false;
      }else{
         this.videoPlay=true;
      }
     
    };

    this.vid.ontimeupdate = ()=> {
      this.current= this.getminsec(this.vid.currentTime);
      this.calcProgress(this.vid.currentTime, this.vid.duration);
    },
    this.vidFull.ontimeupdate = ()=> {
      this.current= this.getminsec(this.vidFull.currentTime);
      this.calcProgress(this.vidFull.currentTime, this.vid.duration);
    },
    this.vid.onended=()=>{
      console.log("FINIOTOO")
      this.videoPlay=false;
      if(document.visibilityState=="visible"){
        this.setTimer();
      }else{
          this.back();
      }
    }

    this.addtoBucket(this.paramId);


    if(this.contenuto.testo==null){
        this.hastext=false;
      }else{
        this.hastext=true;
      }
  },

   methods: {
     getvideo(name){
      /*const mediaRequest = fetch(this.$store.getters.baseUrl+"/upload/"+name).then(response => response.blob()).catch(err => {console.error(err); console.log("sono in errore")});
      
       mediaRequest.then(blob => {
        const request = indexedDB.open('mediaStore', 1);
        request.onsuccess = event => {
          const db = event.target.result;
           
          const transaction = db.transaction(['media-'+this.lang],'readwrite');
          const objectStore = transaction.objectStore('media-'+this.lang);

        
          const test = objectStore.get(name);

          test.onerror = event => {
            console.log('error');
           
          };

          test.onsuccess = event => {
           document.getElementById('video').src=  URL.createObjectURL(test.result.blob);
          };
        }
        })*/
         
        this.request = indexedDB.open('mediaStore', global.dbVersion);
        this.request.onsuccess = event => {
         this.db = event.target.result;
          
          const transaction = this.db.transaction(['media-'+this.lang],'readwrite');
          const objectStore = transaction.objectStore('media-'+this.lang);

          const test = objectStore.get(name);
      

         test.onerror = event => {
            console.log('error');
           
          };

          test.onsuccess = event => {
            console.log("GET RESULT ",test.result)
            const testget = test.result;
             if (testget) {
              this.videoSrc=URL.createObjectURL(test.result.blob);
              document.getElementById('video').src= this.videoSrc;
            } else {
              console.log('testget dont exixst error');
                this.fetchFile(name);
            }

            
          };
        }

       
  
  

     },
     fetchFile(name){
       console.log("TRYIN FETCH")
        const mediaRequest = fetch(this.$store.getters.baseUrl+"/upload/"+name).then(response => response.blob()).catch(err => {console.error(err); console.log("sono in errore")});
    
        mediaRequest.then(blob => {
          const fileblob=blob;
          document.getElementById('video').src=  URL.createObjectURL(fileblob)
          document.getElementById('video').play();
          
          const objectStore =this.db.transaction(['media-'+this.lang],'readwrite').objectStore('media-'+this.lang);
            console.log('blobb ',fileblob)
            const objectStoreRequest = objectStore.add({name: name, blob: fileblob});
            objectStoreRequest.onsuccess = (event) =>{
            // report the success of our request
            console.log(name+ " Successs");
              
          };
        
        })
        
        

     },
    back() {
      /*if (window.history.length > 1) {
        this.$router.go(-1);
      } else {*/
      this.$router.replace({ path: "/" });
      
    },
    getminsec(time){
      let min=Math.floor(time/60)
       min = (min >= 10) ? min : "0" +min;
       let sec = Math.floor(time% 60);
        sec=(sec >= 10) ? sec : "0" + sec;

        return {min:min,
        sec:sec
        }
    },
    calcProgress(current,duration){
      
      this.progress=current/duration;
      console.log("prog "+current+" " +duration+" "+ this.progress)

    },
    playpause(video){
      this.vidFull=document.getElementById("videoFull")
      if(this.videoPlay){
        if(video=="full"){
          this.vidFull.pause();
        }else{
          this.vid.pause();
        }
        
        this.videoPlay=false;
      }else{
        
        if(video=="full"){
          this.vidFull.play();
        }else{
          this.vid.play();
        }
       
          this.videoPlay=true;
          if(this.timer){
            console.log('clear?');
            clearTimeout(this.timer);
          }

      }
    },

    checkPlay(){
        if(this.videoPlay==false){
          return  'amplitude-paused'

        }else{
          return  'amplitude-playing'

        }
    },

    minus(){
          
      if(this.vid.currentTime> 0.0){
      this.vid.currentTime= this.vid.currentTime-5;
        
      }
      if(this.timer){
          console.log('clear?');
          clearTimeout(this.timer);
      }


    },
    plus(){
      if(this.vid.currentTime< this.vid.duration){
        this.vid.currentTime= this.vid.currentTime+5;
        console.log("VD "+ this.vid.duration)
      }
      if(this.timer){
          console.log('clear?');
          clearTimeout(this.timer);
      }
      
        

    },

    
    // Find the right method, call on correct element
    launchIntoFullscreen() {
      
      this.vid.pause();
      this.videoPlay=false;
      this.fullscreen=true;
     
      this.vidFull.load();
      this.vidFull.onloadeddata = ()=> {
    
       this.vidFull.currentTime=this.vid.currentTime;
       this.vidFull.play();
        if(this.vidFull.paused){
          this.videoPlay=false;
        }else{
          this.videoPlay=true;
        }
      }
 
    
      
      //window.location.replace(videosrc);
      /*if(element.requestFullscreen) {
        element.requestFullscreen(void 0);
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }else if( element.webkitEnterFullscreen){
         element.webkitEnterFullscreen();
      } else {
        return alert("Fullscreen API unavailable");
      }*/
    },
    exitFull(){
      this.vidFull.pause();
      this.videoPlay=false;
      this.vid.currentTime=this.vidFull.currentTime;
      this.fullscreen=false;
      this.vid.play();
      if(this.vid.paused){
          this.videoPlay=false;
        }else{
          this.videoPlay=true;
        }
      

    },

     exitFullscreen() {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
  
    
    expand(){
      const vid=document.getElementById('video');
      if (vid.requestFullscreen) {
        vid.requestFullscreen();
      } else if (vid.webkitRequestFullscreen) { /* Safari */
        vid.webkitRequestFullscreen();
      } else if (vid.msRequestFullscreen) { /* IE11 */
        vid.msRequestFullscreen();
      }
     // screen.orientation.lock('landscape')
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
    
     // this.$router.replace({path:"/"});
     this.back();
      
    },

    async showOptions( ) {
      const alert = await alertController.create({
          header: this.$t('update.title') ,
          message: this.$t('update.text') ,
          buttons: [
            {
              text: this.$t('action.postponi') ,
              role: "cancel",
              handler: () => {
                  console.log("Declined the offer");
                  this.updateNotification(true);
                  
              },
            },
            {
                text:this.$t('action.download'),
                handler: () => {
                  console.log("Accepted");
                  localStorage.setItem('provToOpen', this.$route.params.id);
                  this.emitter.emit('aggiorna','main');
                },
            },
          ],
      });

      await alert.present();
    },

    async schedaState(state) {
       console.log("set openscheda state");
      await Storage.set({
        key: 'openScheda',
        value:state
      });
    },
    
  },

  data() {
    return {
      options: {
        title: "Example Title",
        enabled: true,
        clickToPlay: true,
        hideControls: false,
        controls: [
          "mute",
          "volume",
          "play-large",
          "progress",
          "current-time",
          "fullscreen"
        ],
        

      },
      videoPlay:false,
      progress:0,
      duration:{
          min:"00",
          sec:"00",
      },
      current:{
        min:"00",
        sec:"00",
      },
      fullscreen:false,
      hastext:true,
    };
  }
};
</script>

<style scoped>

.back-button{
  text-transform: capitalize;
}
ion-icon{
  margin-right: 5px;
}

ion-content {
  --overflow: hidden;
}

div.player {
  margin-bottom: 20px;
  max-width: 750px;
  margin: auto;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
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
  padding: 70px 0;
  height: 88vh;
  width: 100vw;
}

.descrArea{
  float: left;
  padding: 8px 27px 30px;
 /* max-height: 40vh;*/
 height: 39vh;
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
  overflow: overlay;
  height: 57vh;

}
video {
  
  width: 100%;
  object-fit: cover;
  height: 100%;
}
.videoFull{

}

.video-full-container{
      position: fixed;
    top: 0;
    left: 100%;
    z-index: 100;
    height: 100vw;
    width: 100vh;
    transform: rotate(90deg);
    transform-origin: 0 0;
    transform-origin: 0 0;
}
.hideFull{
  opacity: 0;
   z-index: -100;
}
.controls {
  /*visibility: hidden;*/
  opacity: 0.5;
  width: 400px;
  border-radius: 10px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -200px;
  background-color: black;
  box-shadow: 3px 3px 5px black;
  transition: 1s all;
  display: flex;
  align-items: center;
}
div.controls div.amplitude-play-pause {
  height: 20px;
  width: 25px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
   margin: 10px 15px;
   color: #ffffff;
}
div.controls div.amplitude-play-pause.amplitude-paused {
  background: url("/assets/icon/playerIcon/play_white.svg");
      background-size: cover;
}
div.controls div.amplitude-play-pause.amplitude-playing {
  background: url("/assets/icon/playerIcon/pause_white.svg");
      background-size: cover;
}

.video-full-container:hover .controls, 
.video-full-containeryer:focus-within .controls {
  opacity: 1;
}


.expand{
  position: relative;
  bottom: 43px;
  
  left: 90vw;
  color: white;
  height: 3vh;
  width: 3vh;
  background: #ffffff21;

}
.exitFull{
  height: 25px;
}
.close-expand{
  position: relative;

  color: white;
  height: 3vh;
  width: 3vh;
  background: #ffffff21;
  margin: 0 15px;

}
.player-container{
  height: 45vh;
}
.player-container-notext{
  height: 60vh;
}

@media screen and (max-width: 39.9375em) {
  div.player img.album-art {
    width: 100%;
    height: auto;
    max-height: 45vh;
  }
}
/*
  Medium only
*/
/*
  Large Only
*/
div.meta-container {
  float: left;
  width: calc(100% - 270px);
  padding: 10px 20px;
  max-height: 40vh;
}
 div.song-title {
  text-align: le;
  color: #263238;
  font-size: 22px;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
  margin: 5px 0;
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
div.control-container div.amplitude-prev {
  width: 28px;
  height: 24px;
  cursor: pointer;
  background: url("/assets/icon/playerIcon/previous.svg");
  display: inline-block;
  vertical-align: middle;
}
div.control-container div.amplitude-play-pause {
  width: 35px;
  height: 40px;
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
div.control-container div.amplitude-next {
  width: 28px;
  height: 24px;
  cursor: pointer;
  background: url("/assets/icon/playerIcon/next.svg");
  display: inline-block;
  vertical-align: middle;
}

/*
  Small only
*/
@media screen and (max-width: 39.9375em) {
  div.control-container div.amplitude-prev {
    margin-right: 75px;
  }
  div.control-container div.amplitude-next {
    margin-left: 75px;
  }
}
/*
  Medium only
*/
@media screen and (min-width: 40em) and (max-width: 63.9375em) {
  div.control-container div.amplitude-prev {
    margin-right: 40px;
  }
  div.control-container div.amplitude-next {
    margin-left: 40px;
  }
}
/*
  Large Only
*/
@media screen and (min-width: 64em) {
  div.control-container div.amplitude-prev {
    margin-right: 75px;
  }
  div.control-container div.amplitude-next {
    margin-left: 75px;
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
  height:6px;
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