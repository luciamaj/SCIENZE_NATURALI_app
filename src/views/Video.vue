<template>
  <ion-page>
    <ion-header collapse="fade">
      <ion-toolbar  mode="ios">
        <ion-title>{{ contenuto.titolo }} {{ lang}}</ion-title>
        <ion-buttons>
          <ion-button v-on:click="back">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <video  id="video" >
        <source :src="url" type="video/mp4" />
      </video>
       <ion-icon class="expand" name="expand-outline" @click="expand()"></ion-icon>

      <div class="ion-no-border content-scheda">

        <div class="meta-container">

          <div class="song-title">{{ contenuto.titolo }} </div>
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
            <div class="amplitude-prev"></div>
            <div class="amplitude-play-pause " :class="checkPlay()" @click="playpause"></div>
            <div class="amplitude-next"></div>
          </div>
        </div>
        <div class="descrArea"   v-html="contenuto.testo"> </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
 // IonProgressBar
} from "@ionic/vue";
import Amplitude from "amplitudejs";

import { data } from "../data/data";

export default {
  name: "Tab",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
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
  
    this.schedaState(false);
   
  },
 
  computed: {
    tag() {
      return this.$route.params.id;
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
        return "https://dataoversound.eadev.it/dataoversound-swi/upload/"+video;
      } else {
        
        return "";
      }
    }
  },
  mounted(){
    this.vid=document.getElementById("video");
    console.log("video ",this.vid);
    this.vid.onloadeddata = ()=> {
      //alert("Browser has loaded the current frame");
    this.duration= this.getminsec(this.vid.duration);
    this.vid.play();
     this.videoPlay=true;
    };

    this.vid.ontimeupdate = ()=> {
      this.current= this.getminsec(this.vid.currentTime);
      this.calcProgress(this.vid.currentTime, this.vid.duration);
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


   
   
  },

   methods: {
    back() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: "wave" });
      }
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
    playpause(){
      if(this.videoPlay){
        this.vid.pause();
        this.videoPlay=false;
      }else{
        this.vid.play();
          this.videoPlay=true;

      }
    },

    checkPlay(){
        if(this.videoPlay==false){
          return  'amplitude-paused'

        }else{
          return  'amplitude-playing'

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
      this.timer = setTimeout(this.timeout, 10 * 1000);
    },
    timeout() { 
      console.log("timeout");
    
     // this.$router.replace({path:"/"});
     this.back();
      
    },

    async schedaState(state) {
      console.log("openScheda");
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
    };
  }
};
</script>

<style scoped>

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
  /* width: calc(100% - 60px); */
  padding:5px 25px;
  max-height: 40vh;
  overflow: overlay;
  margin-top: 2vh;
  margin-bottom: 2vh;
  /*bottom: 3vh;
  position: absolute;*/

}
.content-scheda{
  overflow: overlay;
  height: 57vh;

}
video {
  width: 100%;
}
.expand{
  position: relative;
    bottom: 7vh;
    
    left: 90vw;
    color: white;
    height: 3vh;
    width: 3vh;
    background: #ffffff21;

}

@media screen and (max-width: 39.9375em) {
  div.player img.album-art {
    width: 100%;
    height: auto;
    max-height: 40vh;
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
  font-size: 25px;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
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
  background: url("https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/previous.svg");
  display: inline-block;
  vertical-align: middle;
}
div.control-container div.amplitude-play-pause {
  width: 35px;
  height: 41px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}
div.control-container div.amplitude-play-pause.amplitude-paused {
  background: url("https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/play.svg");
  
    background-size: cover;

}
div.control-container div.amplitude-play-pause.amplitude-playing {
  background: url("https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/pause.svg");
  
    background-size: cover;

}
div.control-container div.amplitude-next {
  width: 28px;
  height: 24px;
  cursor: pointer;
  background: url("https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/next.svg");
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
  height: 5px;
  display: block;
  cursor: pointer;
  border-radius: 3px;
  height: 8px;
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