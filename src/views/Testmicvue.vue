<template>
 <ion-page>
  <div class="row">
         <h1 class="is-size-1 has-text-centered is-uppercase has-text-weight-bold">Sound check!</h1>
   <div class="toggle" @click="start">start</div> <div class="toggle" @click="pause">pause</div>

  </div>
     
  </ion-page>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        showRecorder: true,
        headers: {
          'X-Custom-Header': 'some data'
        }
      }
    },
    components:{},
    methods: {
      
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
    this.context    = new(window.AudioContext || window.webkitAudioContext)({sampleRate: 44100})
    this.duration   = this._duration
    this.input      = this.context.createMediaStreamSource(stream)
    this.processor  = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    this.stream     = stream
    const options = { mimeType: "video/webm; codecs=vp9" };
    const mediaRecorder = new MediaRecorder(stream, options);

    let recordedChunks = [];
        
        
    

        function download() {
         const blob = new Blob(recordedChunks, { 'type' : 'audio/ogg; codecs=opus' });
        recordedChunks = [];
        const audio = document.createElement('audio');
         audio.controls = true;
           audio.autoplay = true;
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
        /*const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "test.webm";
        a.click();
        window.URL.revokeObjectURL(url);*/
        }
function handleDataAvailable(event) {
        console.log("data-available");
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
            console.log(recordedChunks);
            download();
        } else {
            // ...
        }
    }

     mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
        // demo: to download after 9sec
        setTimeout(() => {
        console.log("stopping");
        mediaRecorder.stop();
        }, 9000);

     /* const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.autoplay = true;
                  
                    audio.srcObject = stream;*/

    this.processor.onaudioprocess = (ev) => {
      const sample = ev.inputBuffer.getChannelData(0)
      let sum = 0.0

     // this.lameEncoder.encode(sample)

      for (let i = 0; i < sample.length; ++i) {
        sum += sample[i] * sample[i]
      }
           // console.log("samplee ",sample);
      this.duration = parseFloat(this._duration) + parseFloat(this.context.currentTime.toFixed(2))
      this.volume = Math.sqrt(sum / sample.length).toFixed(2)
    }

  

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
    }
  }
</script>