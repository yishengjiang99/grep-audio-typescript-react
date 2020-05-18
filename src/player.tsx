import * as React from 'react';
import './player.css';
import {Slider} from './slider';
import {AudioInput} from './components/AudioInput';

export interface PlayerProps {
  src?: string,
  ytId?: string,
  spotifyTrackId?: string,
  twitchId?: string,
  controls?: string | void,
  title?: string,
  description?: string
}

interface PlayerState {
  volume: GainNode,
  nowPlaying: AudioInput,
  playList: Array<AudioInput>,
  lastPlayed: Array<AudioInput>,
  effectChains: Array<BiquadFilterNode|IIRFilterNode|DynamicsCompressorNode|ConvolverNode|StereoPannerNode|GainNode|ScriptProcessorNode>,
  currentTime: Number,
  duration: Number,
  bufferedAmount: TimeRanges,
  loop: Boolean,
  shuffle: Boolean
};

const audioContext = new AudioContext();

export class Player extends React.Component<PlayerProps, PlayerState>{

  constructor(props){
    super(props);
    this.state={
      volume: new GainNode(audioContext, {gain:1}),
      nowPlaying: null,
      effectChains: [],
      playList:[],
      lastPlayed:[],
      loop: false,
      shuffle: false,
      currentTime: 0,
      duration: null,
      bufferedAmount: null,

    }
  }
  public render() {
    const {title,description} = this.props;
    const {currentTime,duration, bufferedAmount} = this.state;
    return ( 
      <div className='container' style={{display:"inline-block", minWidth:80, width:"100%"}}>
        <slot>{title}</slot>
        
        <Slider value={1} minValue={0} maxValue={2} step={0.01} property={this.state.volume.gain}></Slider>
        <Panel>

        </Panel>
      </div>
    );  
  }
}

const Panel:React.FC<{children:any}> = (props)=>{
  return (
    <div className='panel'>
      {props.children}
    </div>
  )

}