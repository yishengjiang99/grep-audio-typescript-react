export interface AudioInputOptions {

    outputNode: AudioNode,
    gain: AudioParam,
    URL: string,
    audioBuffer: AudioBuffer,
    arrayBuffer: ArrayBuffer
    fromUserDevice: boolean
}


export class AudioInput extends AudioNode {
    constructor(ctx: AudioContext, options?: Partial<AudioInputOptions>){
        super();  
        if(options.URL) {
            AudioInput.loadFromURL(ctx, options.URL);

        }else if(options.audioBuffer){
            AudioInput.loadFromBuffer(ctx, options.audioBuffer);

        }else if(options.fromUserDevice){
            AudioInput.loadFromUserMedia(ctx);
        }
    }

    static async loadFromURL(ctx: AudioContext, url: string): Promise< AudioInput | void> {
        fetch(url).then(resp=> resp.arrayBuffer() )
        .then( buffer => ctx.decodeAudioData(buffer) )
        .then( audioBuffer=> new AudioBufferSourceNode(ctx, {buffer: audioBuffer}) )
        .catch( e=> {
            throw e;
            return null;
        });

    }
    static async loadFromBuffer(ctx, audioBuffer) {
        return new AudioBufferSourceNode(ctx, {buffer: audioBuffer});
    }

    static async loadFromYoutubeId(ctx: AudioContext, ytid: string): Promise< AudioInput|void>{
        return AudioInput.loadFromURL(ctx, "https://dsp.grepawk.com/api/yt/"+ytid+".mp3");
    }

    static async loadFromUserMedia(ctx: AudioContext): Promise< AudioInput | void> {
        const constraints: MediaStreamConstraints = {
            audio: {
                echoCancellation: true,
                sampleRate: ctx.sampleRate
            }
        }
        
        if(!navigator || !navigator.mediaDevices) Promise.reject(new Error("running IE 6"));
        try{
            let stream = await navigator.mediaDevices.getUserMedia( constraints );   
            return ctx.createMediaStreamSource(stream);
        }catch(e){
            throw e;
            return null;;
        }
    }       
}
