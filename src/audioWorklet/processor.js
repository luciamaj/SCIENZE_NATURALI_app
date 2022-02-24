class MyWorkletProcessor extends AudioWorkletProcessor{
    constructor() {
        console.log('Constructing myworkletprocessor');
        super();
    }

    process(inputs, outputs, params) {
       // this method gets automatically called with a buffer of 128 frames
       // audio process goes here
       // if you don't return true, webaudio will stop calling your process method
       console.log("Processing");
       return true;
    }
}

// you also need to register your class so that it can be intanciated from the main thread
console.log('Registering processor');
registerProcessor('audio-processor', MyWorkletProcessor);