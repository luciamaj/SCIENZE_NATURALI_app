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
       
         <!--div class="bar" id="volume-visualizer"></div>
    <div class="components">
        <button class="techkib-online-tool-button" id="start">
            <i class="fa fa-microphone"></i> Start The Test
        </button>
        <button class="techkib-online-tool-button" id="stop"><i class="fa fa-stop"></i> Stop</button>
        <button class="techkib-online-tool-button" onClick="window.location.reload();">
            <i class="fa fa-refresh"> </i> Reload Test Environment
        </button>
    </div>
    <h3 id="tex"></h3-->

              <h1 class="is-size-1 has-text-centered is-uppercase has-text-weight-bold">Sound check!</h1>
  <p class="">See if your microphone and headphones are setup properly</p>
  <p> For the Microphone test, a prompt will appear asking for permission to access your select output device </p>
    <p>If you are not using headphones, it'll have a loop feedback</p>
    <p></p>
  <button class="button is-primary is-fullwidth is-large" id="micTest" type="button">Test Microphone</button>
  
  <!--button class="button is-link is-light is-fullwidth is-medium" id="soundTest" type="button">Test Headphone/Speakers</button-->
       
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
  //IonIcon,
  //IonButton,
  IonBackButton, 
} from "@ionic/vue";


export default {
  name: "Amplitude",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,

    IonButtons,
    //IonIcon,
  //  IonButton,
    IonBackButton, 
  },


  data() {
    return {
      title: "Audioguida",
      timer:"",
    };
  },

  mounted(){
     //  this.vol();

    document.querySelector("#micTest").addEventListener('click', function(){
        if ( window.stream ) {
          console.log("Streamm ", window.stream );
            this.innerText = "Test Microphone";
        } else {
            this.innerText = "Stop Test";
        }
        if (navigator.mediaDevices) {
            const constraints = window.constraints = {
            audio: true, 
            video: false
            }
            navigator.mediaDevices.getUserMedia(constraints). then(stream => {
                 console.log("AAAA")
                if (window.stream) {
                    window.stream.getAudioTracks().forEach(track => track.stop());
                    window.stream = null;
                } else {
                    const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.autoplay = true;
                    window.stream = stream;
                    audio.srcObject = stream;

                    stream.oninactive = function() {
                    console.log('Stream ended');
                    };
                }

            }).catch(this.handleError)
        }
    });

    /*document.querySelector('#soundTest').addEventListener('click', function(){
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.autoplay = true;
        audio.src = 'https://teste-sdk-rs.s3.amazonaws.com/Purr.wav';
    })*/
  },
  methods:{
    
    
   /* async vol(){
        
        let volumeCallback = null;
        let volumeInterval = null;
        const volumeVisualizer = document.getElementById('volume-visualizer');
        const startButton = document.getElementById('start');
        const stopButton = document.getElementById('stop');
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true
                }
            });
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaStreamSource(audioStream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.minDecibels = -127;
            analyser.maxDecibels = 0;
            analyser.smoothingTimeConstant = 0.4;
            audioSource.connect(analyser);
            const volumes = new Uint8Array(analyser.frequencyBinCount);
            volumeCallback = () => {
                
                analyser.getByteFrequencyData(volumes);
                let volumeSum = 0;
                for (const volume of volumes)
                    volumeSum += volume;
                const averageVolume = volumeSum / volumes.length;
                volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%');
                console.log("volumes analizer "+averageVolume)
                const taxi= document.getElementById("tex");
                taxi.innerHTML = "Your Microphone is Working! 😇";
            };
        }
        catch (e) {
            console.error('Failed to initialize volume visualizer, simulating instead...', e);
            let lastVolume = 50;
            volumeCallback = () => {
                const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
                lastVolume = volume;
                volumeVisualizer.style.setProperty('--volume', volume + '%');
                const taxi = document.getElementById("tex");
                taxi.innerHTML = "Status: Microphone is not working! ❌";
            };
        }
        startButton.addEventListener('click', () => {
            if (volumeCallback !== null && volumeInterval === null)
                volumeInterval = setInterval(volumeCallback, 100);
        });
        stopButton.addEventListener('click', () => {
            if (volumeInterval !== null) {
                clearInterval(volumeInterval);
                volumeInterval = null;
            }
        });

    }*/


        handleError(e){
        console.log("ruin", e.message);
        },


 
      
     
  }
};
</script>

<style>
ion-content {
  --overflow: hidden;
}
 div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 300px;
  }

.bar {
    --volume: 0%;
    position: relative;
    width: 100%;
    height: 50px;
    border-radius: 5px;
    margin-bottom: 20px;
}

.bar::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 5px;
    width: var(--volume);
    background-color: green;
    transition: width 100ms linear;
}

.techkib-online-tool-button {
    background-color: black;
    border: none;
    border-radius: 5px;
    color: yellow;
    padding: 12px 16px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-right: 5px;
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