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
  <main>
    <h1 class="is-size-1 has-text-centered is-uppercase has-text-weight-bold">Sound check!</h1>
    <p class="">See if your microphone and headphones are setup properly</p>
    <p> For the Microphone test, a prompt will appear asking for permission to access your select output device </p>
      <p>If you are not using headphones, it'll have a loop feedback</p>
      <p></p>
    <!--button class="button is-primary is-fullwidth is-large" id="micTest" type="button">Test Microphone</button-->
  </main>
  <!--button class="button is-link is-light is-fullwidth is-medium" id="soundTest" type="button">Test Headphone/Speakers</button-->
       
      </div>


     <div class="toggle" @click="start">start</div> <div class="toggle" @click="pause">pause</div>
    <audio-recorder v-if="showRecorder"
      upload-url="some url"
      filename="ninja"
      format="wav"
      :attempts="3"
      :time="2"
      :headers="headers"
      :before-recording="callback"
      :pause-recording="callback"
      :after-recording="callback"
      :select-record="callback"
      :before-upload="callback"
      :successful-upload="callback"
      :failed-upload="callback"
      :bit-rate="192"/>

    <audio-player :src="mp3" v-if="!showRecorder"/>
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
       
        headers: {
          'X-Custom-Header': 'some data'
        }
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
   /* callback (msg) {
      console.debug('Event: ', msg)
    },
    toggle () {
      this.showRecorder = !this.showRecorder
    },*/
    


    start(){
      const constraints = {
        video: false,
        audio: {
          channelCount: 1,
          echoCancellation: false
        }
      }
      navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this._micCaptured.bind(this))
      .catch(this._micError.bind(this))
    },


    _micCaptured (stream) {
    this.context    = new(window.AudioContext || window.webkitAudioContext)()
    this.duration   = this._duration
    this.input      = this.context.createMediaStreamSource(stream)
    this.processor  = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    this.stream     = stream

    this.processor.onaudioprocess = (ev) => {
      const sample = ev.inputBuffer.getChannelData(0)
      let sum = 0.0

     // this.lameEncoder.encode(sample)

      for (let i = 0; i < sample.length; ++i) {
        sum += sample[i] * sample[i]
      }

      this.duration = parseFloat(this._duration) + parseFloat(this.context.currentTime.toFixed(2))
      this.volume = Math.sqrt(sum / sample.length).toFixed(2)
    }

    const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.autoplay = true;
                  
                    audio.srcObject = stream;

    this.input.connect(this.processor)
    this.processor.connect(this.context.destination)
  },
   _micError (error) {
    this.micFailed && this.micFailed(error)
  },

  pause () {
    console.log("pause");
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.processor.disconnect()
   //this.context.close()

    this._duration = this.duration
    this.isPause = true

    this.pauseRecording && this.pauseRecording('pause recording')
  }

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


       /* handleError(e){
        console.log("ruin", e.message);
        },*/


 
      
     
  }
};
</script>

<style>
ion-content {
  --overflow: hidden;
}

#micTest::before {
  content: '';
  background-size: contain;
  display: block;
  width: 100px;
  height: 20px;
}

#micTest{
  width: 100%;
}
 /*div {

    min-height: 300px;
  }*/

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