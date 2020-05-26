import { FunctionalComponent, h, Fragment } from "preact";
import {useState, useEffect} from "preact/compat";


interface TrackInfo {
    songName: string,
    artistName:string,
    thumbnailUrl: string,
    trackId?: string
}


const NowPlaying: FunctionalComponent<TrackInfo> = (props:TrackInfo) =>{
    const {songName, artistName, thumbnailUrl} = props;
    return (
        <div>
            <div>{songName}</div>
            <div>{artistName}</div>
            <img src={thumbnailUrl} />
        </div>
    )
}

interface PlayerState{
    isPlaying: boolean,
    hasNext: boolean,
    hasPrev: boolean,
    duration: number,
    position: number,
    nowPlaying?: TrackInfo|null
}
const defaultState:PlayerState ={
    duration: 0,
    position: 0,
    hasNext: false,
    hasPrev: false,
    nowPlaying: null,
    isPlaying: true
}
const AudioController: FunctionalComponent<PlayerState> = (props:PlayerState) => {
    return(
        <div>controlelr</div>
    )
}

interface AlbumInfo {
    playlistID?: string,
    name?: string
    albumCoverUrl?: string,
    tracks?: Array<TrackInfo>
}

const TrackListView: FunctionalComponent<AlbumInfo> = (props: AlbumInfo) =>{
    return(
        <div style={{display:"grid"}}>
            <div style={{ gridRow:"1/2", gridColumn:"1"}}>
            </div>    
            <div style={{ gridRow:"2/5", gridColumn:"1"}}>
            </div>    
        </div>
    )
}
interface AlbumMenuProp {
    albums?: AlbumInfo[]
}
const AlbumMenu: FunctionalComponent<AlbumMenuProp> = (props: AlbumMenuProp) =>{
    return (<div>alb</div>);
}

interface SpotifyProps{
    accessToken: string,
    refreshToken: string
}
const Spotify: FunctionalComponent = () => {
      const [nowPlaying, setNowPlaying] = useState<TrackInfo|null>(null);
      const [playlists, setPlaylists] = useState<AlbumInfo[]>( [] );
      const [tracks, setTracks] = useState<TrackInfo[]>( [] );
      const [playerState, setPlayerState] = useState(defaultState);
      const [currentAlbum, setCurrentAlbum] = useState<AlbumInfo|null>( null );
      useEffect( ()=>{
          console.log("dd")
      })
      return (
        <div>
            { h(NowPlaying, nowPlaying) }
            { h(AlbumMenu, {albums: playlists},null) }
            { h(TrackListView,currentAlbum)}
            { h(AudioController, playerState,null)}
        </div>
    )
     
};
export default Spotify;
