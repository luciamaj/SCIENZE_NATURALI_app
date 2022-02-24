<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" >
        <ion-buttons slot="start">
           <ion-back-button default-href="/" v-on:click="back" > </ion-back-button>
          <!--ion-button v-on:click="back()">
           
          </ion-button-->
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="vertical-center">
       
        <div class="player">
          <img :src="cover" class="album-art" />
          <ion-footer class="ion-no-border">
            <div class="meta-container">

             
              <div class="song-title">{{ contentScheda.titolo }} {{contentScheda.audio}}</div>
              <div class="song-artist">{{ lang }}</div>

              <div class="time-container">
                <div class="current-time">
                  <span class="amplitude-current-minutes" data-amplitude-song-index="0"></span>:
                  <span class="amplitude-current-seconds" data-amplitude-song-index="0"></span>
                </div>

                <div class="duration">
                  <span class="amplitude-duration-minutes" data-amplitude-song-index="0">3</span>:
                  <span class="amplitude-duration-seconds" data-amplitude-song-index="0">30</span>
                </div>
              </div>
              <progress
                class="amplitude-song-played-progress"
                data-amplitude-song-index="0"
                id="song-played-progress-1"
              ></progress>
              <div class="control-container">
                <div class="amplitude-prev"></div>
                <div class="amplitude-play-pause" data-amplitude-song-index="0"></div>
                <div class="amplitude-next"></div>
              </div>
            </div>
            <div class="descrArea"   v-html="contentScheda.testo"> </div>
          </ion-footer>
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
  IonTitle,
  IonContent,
  IonFooter,
  IonButtons,
  //IonIcon,
  //IonButton,
  IonBackButton, 
} from "@ionic/vue";
import Amplitude from "amplitudejs";
import { data } from "../data/data";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export default {
  name: "Amplitude",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonFooter,
    IonButtons,
    //IonIcon,
  //  IonButton,
    IonBackButton, 
  },
  ionViewWillLeave() {
    console.log('Ampli will leave');
     clearTimeout(this.timer);
    Amplitude.pause();
    this.schedaState(false);
   
  },

  data() {
    return {
      title: "Audioguida",
      timer:"",
    };
  },
  computed: {

    contentScheda(){
       const data=localStorage.getItem("dataMostra")
     
      const scheda= JSON.parse(data).find(x => x.tag == this.$route.params.id);
       console.log("ENTRO QUA")
     
        return scheda.content.find(x => x.lang == 'it');
     
       
     
    },
    dataSchede(){

      const data=localStorage.getItem("dataMostra")
     
      const scheda= JSON.parse(data).find(x => x.tag == this.$route.params.id);
      
     return scheda
     
    },
   
    cover() {
      const audio=this.contentScheda.audio; 
      console.log("che c'è? "+ audio + this.dataSchede.img);
      if (audio && this.dataSchede.img) {
        console.log("c'è audio e iimmmagine");
        return "https://dataoversound.eadev.it/dataoversound-swi/upload/"+this.dataSchede.img;
      } else {
        return 'https://dataoversound.eadev.it/dataoversound-swi/upload/329.jpg'
       
      }
      return 'https://dataoversound.eadev.it/dataoversound-swi/upload/(329)%2030_8_5.jpg';
    },
    id() {
      return this.$route.params.id;
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
      const audio = data.find(x => x.index == this.$route.params.id);
      if (audio) {
        return audio.lang;
      } else {
        return data[0].lang;
      }
    },
    url() {
      const audio=this.contentScheda;
      if (audio.audio) {
        console.log("audio ",audio.audio);
        return "https://dataoversound.eadev.it/dataoversound-swi/upload/"+audio.audio;
      } else {
         console.log("audio ",audio.video);
        return "https://dataoversound.eadev.it/dataoversound-swi/upload/"+ audio.video;
      }
    }
  },
  mounted() {
     this.schedaState(true);
    Amplitude.init({
      /* eslint-disable */
      songs: [
        {
          name: "Song Name 1",
          artist: "Artist Name",
          album: "Album Name",
          url: this.url,
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
           this.$router.replace({path:"/"});
        }
         

			 }
		  }
    });
   

    document
      .getElementById("song-played-progress-1")
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

      
    console.log("AMPLI ",Amplitude);

     this.play();
  } ,
  methods:{
    play() {
      Amplitude.play();
      
      $('.amplitude-play-pause').addClass('amplitude-playing').removeClass('amplitude-paused');
    },
    pause() {
      Amplitude.pause();
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
    
      this.$router.replace({path:"/"});
      
    },

    
    async schedaState(state) {
      console.log("openScheda");
      await Storage.set({
        key: 'openScheda',
        value:state
      });
    },
 
      
     
  }
};
</script>

<style>
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
  padding: 18px 25px;
  max-height: 40vh;
  overflow: overlay;
  margin-top: 4vh;

}
/*
  Small only
*/
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
  padding: 10px;
  max-height: 40vh;
}
div.meta-container div.song-title {
  text-align: center;
  color: #263238;
  font-size: 30px;
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
  font-size: 18px;
  color: #000;
  margin-bottom: 10px;
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
  margin-top: 4vh;
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
  width: 40px;
  height: 44px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}
div.control-container div.amplitude-play-pause.amplitude-paused {
  background: url("https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/play.svg");
}
div.control-container div.amplitude-play-pause.amplitude-playing {
  background: url("https://521dimensions.com/img/open-source/amplitudejs/examples/multiple-songs/pause.svg");
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