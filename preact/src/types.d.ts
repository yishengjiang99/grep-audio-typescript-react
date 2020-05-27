interface TrackInfo {
    songName: string;
    artistName: string;
    thumbnailUrl: string;
    trackId?: string;
}

interface PlayerState {
    isPlaying: boolean;
    hasNext: boolean;
    hasPrev: boolean;
    duration: number;
    position: number;
    nowPlaying?: TrackInfo | null;
}
interface AlbumInfo {
    playlistID?: string;
    name?: string;
    albumCoverUrl?: string;
    tracks?: Array<TrackInfo>;
}

export { TrackInfo, PlayerState, AlbumInfo };
