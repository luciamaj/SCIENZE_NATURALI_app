//import workletUrl from './processor.js';

// If you uncoment the line below this and comment the previous import, it works
const workletUrl = './processor.js';

export class AudioProcessing {

    static async create(context) {

        class AudioProcess extends AudioWorkletNode {
            constructor(context) {
                super(context, 'audio-processor');
            }
        }

        try {
            await context.audioWorklet.addModule(workletUrl);
        } catch(e) {
            console.log(e);
        }
        return new AudioProcess(context);
    }

}
